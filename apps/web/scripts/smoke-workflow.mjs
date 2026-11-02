/** Integration test: real Next route handlers + local Meta stub. Never uses credits.
 * Run from apps/web: node scripts/smoke-workflow.mjs
 * Creates only synthetic local recipes under .data; does not delete existing records. */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const counts = { transcribe: 0, analyze: 0, sam: 0, merge: 0 };
let failOnce = true;
const mock = createServer(async (req, res) => {
  assert.equal(req.headers.authorization, "Bearer handful-local-smoke-test");
  let body = "";
  for await (const chunk of req) body += chunk;
  const json = (v, status = 200) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(v)); };
  if (req.url === "/v1/asr/transcribe") {
    counts.transcribe++;
    await wait(1500);
    return json({ sessionId: "stub", transcript: "Use low heat.", audioDurationMs: 4000, turns: [{ turnId: 1, startMs: 0, endMs: 4000, transcript: "Un puñito.", speaker: "A" }] });
  }
  if (req.url === "/v1/files") return json({ id: "file-stub" });
  if (req.url === "/v1/responses") {
    const b = JSON.parse(body);
    if (b.model === "sam-3.1") {
      counts.sam++;
      res.writeHead(200, { "Content-Type": "text/event-stream" });
      return res.end(`data: ${JSON.stringify({ type: "response.output_text.delta", delta: "<|box;x1=1;y1=1;x2=8;y2=8;w=10;h=10|>" })}\n\ndata: [DONE]\n\n`);
    }
    const name = b.text.format.name;
    const prompt = b.input[0].content[0].text;
    if (name === "recipe_analysis") {
      counts.analyze++;
      if (prompt.includes("FailOnce") && failOnce) { failOnce = false; return json({ error: "controlled failure" }, 500); }
      return json({ output_text: JSON.stringify({ title: "Synthetic recipe", steps: [{ start_sec: 0, end_sec: 8, action: "Añadir un puñito", ingredients: ["harina"], informal_measure: "un puñito", handful_subject: "hand" }], gaps: [{ step_index: 0, kind: "heat", question: "¿Qué fuego usas?", evidence: "No se dijo." }, { step_index: 0, kind: "time", question: "¿Cuánto tiempo?", evidence: "No se dijo." }] }) });
    }
    counts.merge++;
    const resolved = !prompt.includes("unsure");
    return json({ output_text: JSON.stringify({ note: resolved ? "Use low heat." : "I am unsure.", resolved }) });
  }
  json({ error: "Unexpected mock route" }, 404);
});
mock.listen(0, "127.0.0.1");
await once(mock, "listening");
const mockPort = mock.address().port;
const port = 3078;
const base = `http://127.0.0.1:${port}`;
let output = "";
const next = spawn(process.execPath, ["--use-system-ca", "node_modules/next/dist/bin/next", "dev", "--port", String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, MODEL_API_KEY: "handful-local-smoke-test", META_API_BASE_URL: `http://127.0.0.1:${mockPort}/v1`, BLOB_READ_WRITE_TOKEN: "", NEXT_PUBLIC_STORAGE_DRIVER: "local" },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});
for (const stream of [next.stdout, next.stderr]) stream.on("data", (chunk) => { output = (output + chunk.toString()).slice(-15000); });
async function api(path, method = "GET", data, key) {
  const res = await fetch(base + path, { method, headers: { ...(data ? { "Content-Type": "application/json" } : {}), ...(key ? { "x-edit-key": key } : {}) }, body: data ? JSON.stringify(data) : undefined });
  return { status: res.status, body: await res.json() };
}
const checks = [];
const check = (name) => { checks.push(name); console.log(`PASS ${name}`); };
async function settled(id, key) {
  for (let i = 0; i < 100; i++) {
    const r = await api(`/api/recipes/${id}`, "GET", undefined, key);
    if (r.body.recipe?.job && ["completed", "failed"].includes(r.body.recipe.job.status)) return r.body.recipe;
    await wait(200);
  }
  throw new Error("Job did not settle");
}
try {
  for (let i = 0; i < 150; i++) {
    if (next.exitCode !== null) throw new Error("Next exited early");
    if (output.includes("Ready in")) break;
    await wait(500);
    if (i === 149) throw new Error("Next did not start");
  }
  const fixture = `smoke-${randomUUID()}`;
  for (const name of ["video.mp4", "audio.wav", "frame.jpg"]) {
    const r = await fetch(`${base}/api/files/uploads/${fixture}/${name}`, { method: "PUT", body: "synthetic transport fixture; no real user media" });
    assert.equal(r.status, 200);
  }
  const input = { title: "Smoke recipe", cookName: "Synthetic cook", videoUrl: `/api/files/uploads/${fixture}/video.mp4`, audioUrl: `/api/files/uploads/${fixture}/audio.wav`, durationSec: 8, sampleFrames: [{ frameUrl: `/api/files/uploads/${fixture}/frame.jpg`, frameSec: 4 }], consent: true };
  const created = await api("/api/recipes", "POST", input);
  assert.equal(created.status, 201);
  const { recipe, editKey } = created.body;
  assert.equal((await api(`/api/recipes/${recipe.id}/background`, "POST", undefined, "wrong-key")).status, 403);
  check("background processing requires owner credential");
  const start = performance.now();
  const queued = await api(`/api/recipes/${recipe.id}/background`, "POST", undefined, editKey);
  const enqueueMs = performance.now() - start;
  assert.equal(queued.status, 202);
  assert.ok(enqueueMs < 1400, `Response should finish before 1500ms transcription: ${enqueueMs}`);
  assert.equal((await api(`/api/recipes/${recipe.id}/background`, "POST", undefined, editKey)).body.recipe.job.id, queued.body.recipe.job.id);
  check("returns 202 before AI finishes; repeated start reuses active job");
  // No client orchestration: wait without issuing any stage calls.
  await wait(2200);
  const done = await settled(recipe.id, editKey);
  assert.equal(done.status, "ready");
  assert.equal(done.job.status, "completed");
  assert.equal(counts.transcribe, 1); assert.equal(counts.analyze, 1); assert.equal(counts.sam, 1);
  assert.equal(done.steps[0].handful.frameSec, 4);
  check("server completes all stages independently of browser, with actual sample timestamp");
  const [first, second] = done.gaps;
  assert.equal((await api(`/api/recipes/${recipe.id}/answers`, "POST", { mode: "text", gapId: first.id, text: "low heat" })).status, 403);
  const own = await api(`/api/recipes/${recipe.id}/answers`, "POST", { mode: "text", gapId: first.id, text: "low heat" }, editKey);
  assert.equal(own.status, 200);
  assert.equal(own.body.recipe.gaps[0].answer.author, "owner");
  assert.equal(own.body.recipe.gaps[0].answer.audioUrl, null);
  assert.equal(own.body.recipe.gaps[0].status, "answered");
  check("owner answers directly by text with attribution and no invented audio");
  const unclear = await api(`/api/recipes/${recipe.id}/answers`, "POST", { mode: "text", gapId: second.id, text: "unsure" }, editKey);
  assert.equal(unclear.body.recipe.gaps[1].status, "open");
  assert.equal(unclear.body.recipe.gaps[1].answer.resolved, false);
  check("unclear answer is saved without resolving the question");
  const voice = await api(`/api/recipes/${recipe.id}/answers`, "POST", { mode: "voice", gapId: first.id, audioUrl: input.audioUrl }, editKey);
  assert.equal(voice.body.recipe.gaps[0].answer.author, "owner");
  assert.equal(voice.body.recipe.gaps[0].answer.audioUrl, input.audioUrl);
  check("owner voice answer uses speech transcription and merge");
  assert.equal((await api(`/api/recipes/${recipe.id}`, "PATCH", { gaps: [{ id: second.id, status: "sent" }] }, editKey)).status, 200);
  const ask = await api(`/api/ask/${recipe.askToken}`);
  assert.ok(ask.body.questions.some((q) => q.id === second.id));
  const guest = await api(`/api/ask/${recipe.askToken}`, "POST", { gapId: second.id, audioUrl: input.audioUrl });
  assert.equal(guest.status, 200);
  assert.equal((await api(`/api/recipes/${recipe.id}`, "GET", undefined, editKey)).body.recipe.gaps[1].answer.author, "cook");
  check("family answer-link flow remains functional");
  const pub = (await api(`/api/recipes/${recipe.id}`)).body.recipe;
  for (const key of ["editKeyHash", "askToken", "runs", "job", "sampleFrames"]) assert.equal(key in pub, false);
  check("public API excludes owner credentials, model logs and job/sample metadata");
  const failedRecipe = await api("/api/recipes", "POST", { ...input, cookName: "FailOnce" });
  const retryId = failedRecipe.body.recipe.id, retryKey = failedRecipe.body.editKey;
  await api(`/api/recipes/${retryId}/background`, "POST", undefined, retryKey);
  assert.equal((await settled(retryId, retryKey)).job.stage, "analyze");
  const before = counts.transcribe;
  await api(`/api/recipes/${retryId}/background`, "POST", undefined, retryKey);
  assert.equal((await settled(retryId, retryKey)).status, "ready");
  assert.equal(counts.transcribe, before);
  check("failed analysis resumes from checkpoint without paying for transcription again");
  const home = await fetch(base);
  assert.equal(home.status, 200);
  const homeText = await home.text();
  assert.ok(homeText.includes("Some recipes")); assert.ok(homeText.includes("logo-transparent.png"));
  assert.equal((await fetch(`${base}/r/${recipe.id}`)).status, 200);
  check("landing and shared recipe render successfully");
  await mkdir("../../eval/results", { recursive: true });
  await writeFile("../../eval/results/workflow-smoke-20261028.json", JSON.stringify({ checkedAt: new Date().toISOString(), api: "LOCAL STUB — no real inference and no credits used", checks, counts, enqueueMs, fixtureRecipeIds: [recipe.id, retryId] }, null, 2));
  console.log(`Completed ${checks.length} integration checks. No real Meta calls.`);
} catch (e) {
  console.error(e);
  console.error(output);
  process.exitCode = 1;
} finally {
  if (process.platform === "win32") {
    await new Promise((resolve) => { const stop = spawn("taskkill", ["/PID", String(next.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" }); stop.on("exit", resolve); stop.on("error", resolve); });
  } else next.kill("SIGTERM");
  mock.closeAllConnections(); mock.close();
}
