import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(toolDirectory, "..");
const manifestPath = resolve(projectDirectory, "audio", "narration.json");
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set. Run generate-google-tts.ps1 so the key can be entered privately.");
  process.exit(1);
}

const requestedId = process.argv.includes("--all")
  ? null
  : process.argv[process.argv.indexOf("--id") + 1] || "shares-intro";

const entries = JSON.parse(await readFile(manifestPath, "utf8"));
const selectedEntries = requestedId ? entries.filter(entry => entry.id === requestedId) : entries;

if (!selectedEntries.length) {
  console.error(`No narration entry matched "${requestedId}".`);
  process.exit(1);
}

function pcmToWave(pcm, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const header = Buffer.alloc(44);
  const byteRate = sampleRate * channels * bitsPerSample / 8;
  const blockAlign = channels * bitsPerSample / 8;

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function requestSpeech(entry, attempt = 1) {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      model: "gemini-3.1-flash-tts-preview",
      input: entry.prompt,
      response_format: { type: "audio" },
      generation_config: {
        speech_config: [{ voice: entry.voice || "Kore" }]
      }
    })
  });

  if (response.status >= 500 && attempt < 3) {
    console.warn(`Google returned ${response.status}; retrying (${attempt + 1}/3)...`);
    return requestSpeech(entry, attempt + 1);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `Google TTS request failed with status ${response.status}.`;
    throw new Error(message);
  }

  const base64Audio = payload?.output_audio?.data || payload?.outputAudio?.data || findAudioData(payload);
  if (!base64Audio) {
    if (attempt < 2) {
      console.warn("Google returned no audio data; retrying once because the TTS model is in Preview...");
      return requestSpeech(entry, attempt + 1);
    }
    throw new Error("Google returned no audio data after two attempts. The preview model may be temporarily unavailable.");
  }

  return Buffer.from(base64Audio, "base64");
}

function findAudioData(value, path = "") {
  if (!value || typeof value !== "object") return null;

  const audioContext = /audio/i.test(path)
    || value.type === "audio"
    || value.mime_type?.startsWith?.("audio/")
    || value.mimeType?.startsWith?.("audio/");

  if (audioContext && typeof value.data === "string" && value.data.length > 100) {
    return value.data;
  }

  for (const [key, child] of Object.entries(value)) {
    if (key === "data" && !audioContext) continue;
    const found = findAudioData(child, `${path}.${key}`);
    if (found) return found;
  }
  return null;
}

await mkdir(resolve(projectDirectory, "audio"), { recursive: true });

for (const entry of selectedEntries) {
  console.log(`Generating ${entry.id} with voice ${entry.voice || "Kore"}...`);
  const pcm = await requestSpeech(entry);
  const destination = resolve(projectDirectory, "audio", entry.file);
  await writeFile(destination, pcmToWave(pcm));
  console.log(`Saved ${destination}`);
}

console.log("Audio generation complete. The API key was read from memory and was not written to the course.");
