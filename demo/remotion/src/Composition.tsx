import { loadFont as loadBody } from "@remotion/google-fonts/DMSans";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Fraunces";
import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  OffthreadVideo,
  Series,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily: display } = loadDisplay("normal", { weights: ["600"], subsets: ["latin"] });
const { fontFamily: body } = loadBody("normal", { weights: ["400", "500"], subsets: ["latin"] });

const FPS = 30;
const C = { bg: "#211C19", text: "#F8EEDF", barro: "#EBA38B", laurel: "#A9C7AC", comal: "#E2BE7D", ciruela: "#D8B3DC", card: "#2A2420" };
const sec = (s: number) => Math.round(s * FPS);

const Fade: React.FC<{ children: React.ReactNode; dur: number }> = ({ children, dur }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, 12, dur - 12, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity, background: C.bg, color: C.text, fontFamily: body }}>{children}</AbsoluteFill>;
};

const Rise: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({ children, delay = 0, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: { damping: 200 }, durationInFrames: 20 });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px)`, ...style }}>{children}</div>;
};

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ color: C.laurel, fontSize: 30, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>{children}</div>
);
const H: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 84 }) => (
  <h1 style={{ fontFamily: display, fontWeight: 600, fontSize: size, lineHeight: 1.12, margin: 0 }}>{children}</h1>
);

/** Text scene, centered in the safe area. */
const Statement: React.FC<{ eyebrow?: string; title: React.ReactNode; sub?: string; size?: number }> = ({ eyebrow, title, sub, size = 120 }) => (
  <AbsoluteFill style={{ justifyContent: "center", padding: "0 160px" }}>
    {eyebrow && <Rise><Eyebrow>{eyebrow}</Eyebrow></Rise>}
    <Rise delay={6}><H size={size}>{title}</H></Rise>
    {sub && <Rise delay={24} style={{ fontSize: 48, color: C.laurel, marginTop: 36, maxWidth: 1400, lineHeight: 1.3 }}>{sub}</Rise>}
  </AbsoluteFill>
);

/** Split layout: copy on the left, media on the right. */
const Split: React.FC<{ eyebrow: string; title: string; notes?: string[]; media: React.ReactNode }> = ({ eyebrow, title, notes = [], media }) => (
  <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 100px", gap: 80 }}>
    <div style={{ flex: "0 0 800px" }}>
      <Rise><Eyebrow>{eyebrow}</Eyebrow></Rise>
      <Rise delay={6}><H size={72}>{title}</H></Rise>
      {notes.map((n, i) => (
        <Rise key={n} delay={30 + i * 45} style={{ fontSize: 42, marginTop: 30, lineHeight: 1.3, color: C.text }}>{n}</Rise>
      ))}
    </div>
    <div style={{ flex: 1, height: 920, position: "relative", display: "flex", justifyContent: "center" }}>{media}</div>
  </AbsoluteFill>
);

/** A tall page screenshot that scrolls slowly (linear on purpose: constant reading speed). */
const Pan: React.FC<{ src: string; width: number; ratio: number; from: number; to: number; dur: number; start?: number }> = ({ src, width, ratio, from, to, dur, start = 20 }) => {
  const f = useCurrentFrame();
  const y = interpolate(f, [start, dur - 20], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <div style={{ width, height: 920, overflow: "hidden", borderRadius: 32, border: `2px solid ${C.laurel}55`, background: C.bg }}>
      <Img src={staticFile(src)} style={{ width, height: width * ratio, transform: `translateY(${-y}px)` }} />
    </div>
  );
};

const Clip: React.FC<{ src: string; caption: string }> = ({ src, caption }) => (
  <div style={{ position: "relative", height: 920, aspectRatio: "9 / 16", borderRadius: 32, overflow: "hidden" }}>
    <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, background: C.bg, padding: "12px 18px", borderRadius: 16, fontSize: 28 }}>{caption}</div>
  </div>
);

const MODELS = [
  ["Muse Voice Transcribe", "Who said what, turn by turn"],
  ["Muse Spark 1.3", "Video + speech into steps, literal measures and open questions"],
  ["SAM 3.1", "Finds the hand or container on real frames of each step"],
];
const QUESTIONS = [
  ["How much", "¿Cuánta leche le sirves a cada tazón para que quede justo?"],
  ["How much", "¿Cuánto cereal le pones a cada tazón?"],
  ["Which one", "¿Qué cereal usas exactamente, es Cheerios o cuál?"],
  ["Heat", "¿La leche la sirves fría, al tiempo o la tibias un poquito?"],
];
const RESULTS = [
  ["71 s", "to process a 50-second video, in the background"],
  ["4", "open questions the model raised, all about things never said"],
  ["0", "invented grams or cups in this test recording"],
];

type Scene = { s: number; el: (dur: number) => React.ReactNode };
const SCENES: Scene[] = [
  { s: 6, el: () => <Statement eyebrow="Handful Recipes" title={<>Some recipes were<br />never <span style={{ color: C.barro }}>written.</span></>} /> },
  { s: 9, el: () => <Statement title={<>“Le echas <span style={{ color: C.comal }}>un puñito</span>.”</>} sub="A handful. No one ever measured it, and when that person is gone, so is the recipe." /> },
  { s: 8, el: () => (
    <AbsoluteFill style={{ padding: 60 }}>
      <Img src={staticFile("cap/home.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", borderRadius: 32 }} />
      <div style={{ position: "absolute", left: 70, bottom: 70, width: 90, height: 90, background: C.bg }} />
    </AbsoluteFill>
  ) },
  { s: 10, el: () => <Split eyebrow="Step 1 · Record" title="Film them cooking." notes={["No script. No measuring.", "This demo uses a short test recording: a bowl of cereal."]} media={<Clip src="clip/milk.mp4" caption="Real test recording" />} /> },
  { s: 13, el: () => (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 160px" }}>
      <Rise><Eyebrow>Step 2 · Meta models do the listening and watching</Eyebrow></Rise>
      {MODELS.map(([m, d], i) => (
        <Rise key={m} delay={20 + i * 40} style={{ background: C.card, borderRadius: 28, padding: "32px 44px", marginTop: 28 }}>
          <div style={{ fontFamily: display, fontSize: 56, color: C.barro }}>{m}</div>
          <div style={{ fontSize: 42, marginTop: 8 }}>{d}</div>
        </Rise>
      ))}
    </AbsoluteFill>
  ) },
  { s: 18, el: (dur) => <Split eyebrow="The living recipe" title="Every step keeps its source." notes={["Each step opens its moment in the video.", "“A ojo” stays “a ojo”: the phrase and the frame, never a number.", "The box comes from SAM 3.1."]} media={<Pan src="cap/recipe.png" width={760} ratio={4500 / 1650} from={0} to={1280} dur={dur} start={60} />} /> },
  { s: 15, el: () => (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 160px" }}>
      <Rise><H size={72}>It knows what was left unsaid.</H></Rise>
      <div style={{ marginTop: 28 }}>
        {QUESTIONS.map(([k, q], i) => (
          <Rise key={q} delay={30 + i * 40} style={{ marginTop: 24, background: C.card, borderRadius: 24, padding: "22px 36px" }}>
            <span style={{ color: C.ciruela, fontSize: 32 }}>? {k}</span>
            <div style={{ fontSize: 44, marginTop: 4 }}>{q}</div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  ) },
  { s: 14, el: () => <Split eyebrow="Step 3 · Ask" title="They answer with their voice." notes={["A link by WhatsApp. No app, no account.", "Answer added to its step: “La leche siempre fría, directito del refri.”", "Test answer: synthetic voice."]} media={
    <div style={{ width: 500, height: 920, overflow: "hidden", borderRadius: 32, border: `2px solid ${C.laurel}55` }}>
      <Img src={staticFile("cap/ask.png")} style={{ width: 500, height: 920, objectFit: "cover", objectPosition: "top" }} />
    </div>
  } /> },
  { s: 14, el: () => (
    <AbsoluteFill style={{ justifyContent: "center", padding: "0 160px" }}>
      <Rise><Eyebrow>What we measured, and what we didn't</Eyebrow></Rise>
      <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
        {RESULTS.map(([n, d], i) => (
          <Rise key={d} delay={15 + i * 25} style={{ flex: 1, background: C.card, borderRadius: 28, padding: 36 }}>
            <div style={{ fontFamily: display, fontSize: 104, color: C.barro }}>{n}</div>
            <div style={{ fontSize: 36, lineHeight: 1.25 }}>{d}</div>
          </Rise>
        ))}
      </div>
      <Rise delay={120} style={{ fontSize: 40, marginTop: 44, color: C.laurel, lineHeight: 1.3 }}>
        One test recording, not a benchmark. Accuracy on a labeled set is still to be measured, and SAM runs on still frames today.
      </Rise>
    </AbsoluteFill>
  ) },
  { s: 10, el: () => <Statement eyebrow="Built during the hackathon, from October 27" title="This recipe won’t be lost." size={100} sub="handful-recipes.vercel.app · github.com/AndyCG03/handful-recipes · Team Devisi Coder" /> },
];

const TOTAL = SCENES.reduce((a, s) => a + sec(s.s), 0);

const Demo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Series>
      {SCENES.map((scene, i) => (
        <Series.Sequence key={i} durationInFrames={sec(scene.s)}>
          <Fade dur={sec(scene.s)}>{scene.el(sec(scene.s))}</Fade>
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const MyComposition = () => (
  <Composition id="HandfulDemo" component={Demo} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
