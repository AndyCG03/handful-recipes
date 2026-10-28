/**
 * Browser media helpers. Serverless functions have no FFmpeg, so audio extraction and
 * frame capture happen on the device.
 */

const TARGET_RATE = 16_000; // 10 min of 16 kHz mono PCM16 ≈ 19 MB, under Meta's 32 MB request limit

/** Decodes any browser-playable audio/video file and returns 16 kHz mono 16-bit WAV. */
export async function toWav(file: Blob): Promise<Blob> {
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  try {
    const decoded = await ctx.decodeAudioData(await file.arrayBuffer());
    const length = Math.ceil(decoded.duration * TARGET_RATE);
    const offline = new OfflineAudioContext(1, Math.max(length, 1), TARGET_RATE);
    const src = offline.createBufferSource();
    src.buffer = decoded;
    src.connect(offline.destination);
    src.start();
    const rendered = await offline.startRendering();
    return encodeWav(rendered.getChannelData(0), TARGET_RATE);
  } finally {
    void ctx.close();
  }
}

function encodeWav(samples: Float32Array, rate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buffer);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF");
  v.setUint32(4, 36 + samples.length * 2, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, "data");
  v.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}

function loadVideo(src: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    v.crossOrigin = "anonymous";
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    v.onloadedmetadata = () => resolve(v);
    v.onerror = () => reject(new Error("This video format can't be read by the browser."));
    v.src = src;
  });
}

export async function videoDuration(file: File): Promise<number> {
  const url = URL.createObjectURL(file);
  try {
    return (await loadVideo(url)).duration;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Captures JPEG frames at the given seconds from a video URL (object URL or same-origin/CORS URL). */
export async function captureFrames(src: string, seconds: number[], maxWidth = 960): Promise<Blob[]> {
  const v = await loadVideo(src);
  const scale = Math.min(1, maxWidth / v.videoWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(v.videoWidth * scale);
  canvas.height = Math.round(v.videoHeight * scale);
  const g = canvas.getContext("2d");
  if (!g) throw new Error("Canvas not available");
  const out: Blob[] = [];
  for (const sec of seconds) {
    await new Promise<void>((resolve) => {
      v.onseeked = () => resolve();
      v.currentTime = Math.min(Math.max(0, sec), Math.max(0, v.duration - 0.05));
    });
    g.drawImage(v, 0, 0, canvas.width, canvas.height);
    out.push(await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("Frame capture failed"))), "image/jpeg", 0.85)));
  }
  return out;
}
