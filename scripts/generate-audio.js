/**
 * generate-audio.js
 * Generates ElevenLabs voiceover audio for all slides into public/audio/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('ERROR: ELEVENLABS_API_KEY environment variable not set');
  process.exit(1);
}

const lesson = JSON.parse(fs.readFileSync(path.join(__dirname, '../content/lesson.json'), 'utf8'));

const AUDIO_DIR = path.join(__dirname, '../public/audio');
fs.mkdirSync(AUDIO_DIR, { recursive: true });

// Voice IDs
const BELLA_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Bella - Professional, Bright, Warm
let japaneseVoiceId = null;

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: Buffer.concat(chunks), headers: res.headers });
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getJapaneseVoice() {
  if (japaneseVoiceId) return japaneseVoiceId;
  
  const res = await httpsRequest({
    hostname: 'api.elevenlabs.io',
    path: '/v1/voices',
    method: 'GET',
    headers: { 'xi-api-key': API_KEY }
  });
  
  const data = JSON.parse(res.body.toString());
  const voices = data.voices || [];
  
  // Find Japanese female voice
  const japVoice = voices.find(v =>
    v.labels &&
    v.labels.gender === 'female' &&
    (v.labels.language === 'ja' || v.labels.accent === 'japanese' ||
     (v.name && /japanese|hana|yuki|sakura|aoi|japanese/i.test(v.name)))
  ) || voices.find(v =>
    v.labels && v.labels.gender === 'female' && v.labels.use_case === 'narration'
  ) || voices.find(v =>
    v.labels && v.labels.gender === 'female'
  );
  
  if (japVoice) {
    japaneseVoiceId = japVoice.voice_id;
    console.log(`  Using Japanese voice: ${japVoice.name} (${japVoice.voice_id})`);
  } else {
    // Fallback to Bella
    japaneseVoiceId = BELLA_VOICE_ID;
    console.log('  No Japanese voice found, falling back to Bella');
  }
  
  return japaneseVoiceId;
}

async function generateAudio(text, voiceId, modelId, destPath) {
  if (fs.existsSync(destPath)) {
    console.log(`  ✓ Already exists, skipping`);
    return;
  }
  
  const body = JSON.stringify({
    text,
    model_id: modelId,
    voice_settings: { stability: 0.5, similarity_boost: 0.75 }
  });
  
  const res = await httpsRequest({
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${voiceId}`,
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }, body);
  
  if (res.statusCode !== 200) {
    throw new Error(`ElevenLabs API error ${res.statusCode}: ${res.body.toString().slice(0, 200)}`);
  }
  
  fs.writeFileSync(destPath, res.body);
  const size = (res.body.length / 1024).toFixed(0);
  console.log(`  ✓ Saved ${path.basename(destPath)} (${size}KB)`);
}

async function main() {
  const s = lesson.slides;
  console.log('Generating ElevenLabs audio...\n');
  
  await getJapaneseVoice();
  
  const tasks = [
    // English narration (Bella)
    { name: 'hook',      text: s.hook.audio_script_en,      voice: BELLA_VOICE_ID,    model: 'eleven_turbo_v2_5', file: 'hook.mp3'      },
    { name: 'scene',     text: s.scene.audio_script_en,     voice: BELLA_VOICE_ID,    model: 'eleven_turbo_v2_5', file: 'scene.mp3'     },
    { name: 'challenge', text: s.challenge.audio_script_en, voice: BELLA_VOICE_ID,    model: 'eleven_turbo_v2_5', file: 'challenge.mp3' },
    { name: 'vocab',     text: s.vocab.audio_script_en,     voice: BELLA_VOICE_ID,    model: 'eleven_turbo_v2_5', file: 'vocab.mp3'     },
    { name: 'outro',     text: s.outro.audio_script_en,     voice: BELLA_VOICE_ID,    model: 'eleven_turbo_v2_5', file: 'outro.mp3'     },
    // Japanese dialogue
    ...s.dialogue.audio_scripts_ja.map((text, i) => ({
      name: `dialogue_${i + 1}`,
      text,
      voice: japaneseVoiceId,
      model: 'eleven_multilingual_v2',
      file: `dialogue_${i + 1}.mp3`
    }))
  ];
  
  for (const task of tasks) {
    console.log(`Generating: ${task.name}`);
    console.log(`  Text: "${task.text.slice(0, 60)}..."`);
    try {
      await generateAudio(task.text, task.voice, task.model, path.join(AUDIO_DIR, task.file));
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
    }
    // Rate limit
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Write audio manifest for Remotion
  const manifest = tasks.reduce((acc, t) => {
    acc[t.name] = `./public/audio/${t.file}`;
    return acc;
  }, {});
  
  fs.writeFileSync(
    path.join(__dirname, '../content/audio-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('\nDone generating audio.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
