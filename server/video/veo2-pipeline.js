/**
 * server/video/veo2-pipeline.js
 * ══════════════════════════════════════════════════════════════════════════════
 * JurisTech Solutions — Google Veo 2 Realistic Human Video Pipeline
 *
 * Replaces the old Shotstack HTML-slide system with genuinely realistic
 * AI-generated human presenters via Google's Veo 2 model.
 *
 * Pipeline:
 *   1. Gemini Flash → scene-by-scene Veo 2 prompts (Arabic legal professional)
 *   2. Veo 2 API  → realistic 8-second human video clips
 *   3. FFmpeg     → concat clips + merge ElevenLabs audio
 *   4. Returns    → merged MP4 Buffer ready for YouTube upload
 *
 * Copyright-Safety:
 *   - All humans are AI-generated (no real people)
 *   - No third-party footage
 *   - ElevenLabs commercial license for TTS
 *   - No music (royalty concern eliminated)
 *
 * Fallback Chain: Veo 2 → Kling AI → Enhanced Text Slides
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';

// ── ElevenLabs Voice IDs ──────────────────────────────────────────────────────
// Arabic male voice (Gulf accent)
export const VOICE_AR_MALE   = 'pqHfZKP75CvOlQylNhV4';
// English male voice (corporate)
export const VOICE_EN_MALE   = 'nPczCjzI2devNBz1zQrb';
// Arabic female voice (professional)
export const VOICE_AR_FEMALE = 'XrExE9yKIg1WjnnlVkGX';
// English female voice (advisor)
export const VOICE_EN_FEMALE = '21m00Tcm4TlvDq8ikWAM';

// ── Veo 2 Persona Prompts ─────────────────────────────────────────────────────
// These prompts produce realistic, copyright-safe AI humans for JurisTech

const VEO2_PERSONAS = {
  arabicMaleCEO: `Professional Arab male executive in his early 40s, wearing an elegant charcoal business suit with a subtle gold tie, speaking directly to camera in a modern law office with floor-to-ceiling windows showing Dubai city skyline at golden hour. Natural conversational hand gestures, confident posture, warm professional lighting from the right side. Photorealistic 4K quality, shallow depth of field blurring the background. Vertical 9:16 frame.`,

  arabicFemaleCounsel: `Professional Arab female legal counsel in her mid-30s, wearing a navy blue blazer over a white blouse, speaking to camera in a premium corporate boardroom with glass walls and Abu Dhabi skyline. Natural gestures emphasizing key points, professional hijab in deep burgundy, warm studio lighting. Photorealistic 4K, vertical 9:16 frame.`,

  internationalMaleCFO: `Professional male executive in his late 40s (Mediterranean appearance), wearing a dark navy suit, in a modern international law firm office with bookshelves and city skyline background. Speaking professionally to camera with measured gestures. 4K cinematic lighting, 9:16 vertical format.`,

  boardroomGroup: `Two Arab business executives reviewing digital documents on a large screen in a premium boardroom, one male CEO pointing to risk analysis charts, one female CFO taking notes on a tablet. Corporate professional setting, warm ambient lighting, glass walls with city view. Wide shot, 9:16 vertical crop from center.`,
};

const VEO2_LANDSCAPE_PERSONAS = {
  meetingRoom: `Two Arab business professionals in a modern Riyadh law firm conference room, reviewing contract documents spread on the table, one pointing to key clauses. Professional attire — the male executive in charcoal suit, female counsel in navy blazer. Warm professional lighting. 16:9 cinematic documentary style, 4K.`,

  platformDemo: `Professional Arab male legal technology consultant in his 30s, seated at a premium desk with large curved monitors displaying contract analysis dashboards (JurisTech interface), speaking to camera with confident explanation gestures. Modern tech office with city view background. 16:9 cinematic, 4K.`,
};

// ── Step 1: Generate Scene Prompts via Gemini Flash ───────────────────────────

/**
 * Generates a set of scene-by-scene Veo 2 prompts for the video.
 * Uses Gemini Flash to create content-specific visual descriptions.
 *
 * @param {string} topic - The video topic in English
 * @param {string} format - 'short' (9:16) or 'landscape' (16:9)
 * @param {string} language - 'ar' or 'en'
 * @returns {Promise<{scenes: string[], voiceScript: string, titleEn: string, titleAr: string, descriptionEn: string, descriptionAr: string, tags: string[]}>}
 */
export async function generateVeo2Script(topic, format = 'short', language = 'ar') {
  if (!GEMINI_API_KEY) {
    console.warn('[Veo2Pipeline] No GEMINI_API_KEY — using fallback script');
    return buildFallbackScript(topic, format, language);
  }

  const aspectLabel = format === 'short' ? '9:16 vertical YouTube Short' : '16:9 landscape YouTube video';
  const personaKey = format === 'short'
    ? (language === 'ar' ? 'arabicMaleCEO' : 'internationalMaleCFO')
    : 'meetingRoom';
  const basePersona = format === 'short'
    ? VEO2_PERSONAS[personaKey]
    : VEO2_LANDSCAPE_PERSONAS[personaKey];

  const prompt = `You are the Creative Director of JurisTech Solutions YouTube channel. Generate a complete production package for a ${aspectLabel} about: "${topic}"

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "titleAr": "Arabic title max 80 chars, compelling and professional",
  "titleEn": "English title max 80 chars, compelling for legal professionals",
  "descriptionAr": "Arabic YouTube description 400 chars with CTA and hashtags, mention juristech.solutions",
  "descriptionEn": "English YouTube description 400 chars with CTA and hashtags, mention juristech.solutions",
  "voiceScriptAr": "Full Arabic voiceover script for ${format === 'short' ? '55' : '240'} seconds. Formal Gulf Arabic. Professional legal tone. End with CTA: تفضل بزيارة juristech.solutions",
  "voiceScriptEn": "Full English voiceover script for ${format === 'short' ? '55' : '240'} seconds. Professional C-Suite tone. End with CTA: Visit juristech.solutions",
  "scenes": [
    "Scene 1 Veo2 prompt: ${basePersona} Looking at camera with opening hook expression. Scene starts with slight zoom in.",
    "Scene 2 Veo2 prompt: ${basePersona} Explaining key point with both hands gesturing, looking slightly left then back to camera.",
    "Scene 3 Veo2 prompt: ${basePersona} Leaning forward slightly, making a critical point with index finger raised.",
    "Scene 4 Veo2 prompt: ${basePersona} Nodding and smiling, delivering call to action with confident open hand gesture."
  ],
  "tags": ["JurisTech", "Legal Tech", "AI Contracts", "Contract Analysis", "Legal AI", "Arabic Legal Tech", "Business Law", "Contract Risk", "GCC Legal", "UAE Law"]
}

IMPORTANT:
- scenes array must have exactly ${format === 'short' ? '4' : '7'} items
- Each scene prompt must start with the persona description then add specific action/expression
- Make voiceScripts genuinely educational and valuable, not generic marketing
- Arabic must be in formal Modern Standard Arabic (فصحى) suitable for Gulf business executives`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048, responseMimeType: 'application/json' },
      }),
    });

    if (!res.ok) throw new Error(`Gemini API ${res.status}`);
    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    console.log(`[Veo2Pipeline] Script generated: "${parsed.titleEn}"`);
    return parsed;
  } catch (err) {
    console.error('[Veo2Pipeline] Gemini script error:', err.message);
    return buildFallbackScript(topic, format, language);
  }
}

function buildFallbackScript(topic, format, language) {
  return {
    titleAr: `${topic} — منصة JurisTech Solutions القانونية`,
    titleEn: `${topic} | JurisTech Solutions`,
    descriptionAr: `اكتشف كيف تحلل JurisTech Solutions العقود فورياً بالذكاء الاصطناعي. تفضل بزيارة juristech.solutions | تواصل: founder@juristech.solutions`,
    descriptionEn: `Discover how JurisTech Solutions uses AI for instant contract analysis. Visit juristech.solutions | Contact: founder@juristech.solutions`,
    voiceScriptAr: `مرحباً بكم في JurisTech Solutions، المنصة الذكية للقانون والأعمال. ${topic}. تفضل بزيارة موقعنا على juristech.solutions للتجربة المجانية.`,
    voiceScriptEn: `Welcome to JurisTech Solutions, the AI-powered legal intelligence platform. ${topic}. Visit juristech.solutions for your free trial today.`,
    scenes: [
      `${VEO2_PERSONAS.arabicMaleCEO} Looking at camera with confident professional expression.`,
      `${VEO2_PERSONAS.arabicMaleCEO} Explaining a key point with open hand gestures.`,
      `${VEO2_PERSONAS.arabicMaleCEO} Leaning forward making a critical point.`,
      `${VEO2_PERSONAS.arabicMaleCEO} Smiling confidently with CTA gesture.`,
    ],
    tags: ['JurisTech', 'Legal Tech', 'AI Contracts', 'Arabic Legal', 'UAE Law', 'Saudi Legal', 'Contract Analysis', 'Business Law', 'GCC', 'LegalAI'],
  };
}

// ── Step 2: Generate Veo 2 Video Clips ────────────────────────────────────────

/**
 * Generate a single Veo 2 video clip from a text prompt.
 * Returns a Buffer of MP4 bytes or null if failed.
 *
 * @param {string} prompt - Detailed Veo 2 scene prompt
 * @param {string} aspectRatio - '9:16' or '16:9'
 * @param {number} durationSeconds - 5 to 8 seconds
 * @returns {Promise<Buffer|null>}
 */
export async function generateVeo2Clip(prompt, aspectRatio = '9:16', durationSeconds = 8) {
  if (!GEMINI_API_KEY) {
    console.warn('[Veo2Pipeline] No GEMINI_API_KEY for Veo 2');
    return null;
  }

  try {
    console.log(`[Veo2Pipeline] Submitting Veo 2 clip: "${prompt.substring(0, 80)}..."`);

    // Submit video generation request
    const submitRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-002:predictLongRunning?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{
          prompt,
          video: {
            aspectRatio,
            durationSeconds,
            resolution: aspectRatio === '9:16' ? '1080x1920' : '1920x1080',
          },
          personGeneration: 'allow_adult',
        }],
      }),
    });

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      console.error(`[Veo2Pipeline] Veo 2 submit failed ${submitRes.status}:`, errText.substring(0, 200));
      return null;
    }

    const opData = await submitRes.json();
    const operationName = opData.name;
    if (!operationName) {
      console.error('[Veo2Pipeline] No operation name returned from Veo 2');
      return null;
    }

    console.log(`[Veo2Pipeline] Veo 2 operation started: ${operationName}`);

    // Poll operation until done (max 5 minutes)
    const maxWaitMs = 5 * 60 * 1000;
    const pollInterval = 15000; // 15 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      await new Promise(r => setTimeout(r, pollInterval));

      const pollRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/${operationName}?key=${GEMINI_API_KEY}`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!pollRes.ok) {
        console.warn(`[Veo2Pipeline] Poll failed ${pollRes.status}`);
        continue;
      }

      const pollData = await pollRes.json();

      if (pollData.done) {
        if (pollData.error) {
          console.error('[Veo2Pipeline] Veo 2 operation error:', pollData.error);
          return null;
        }

        // Extract video bytes from response
        const predictions = pollData.response?.predictions;
        if (!predictions || predictions.length === 0) {
          console.error('[Veo2Pipeline] No video predictions in response');
          return null;
        }

        // The prediction may contain a URI or base64 encoded video
        const pred = predictions[0];
        if (pred.bytesBase64Encoded) {
          const videoBuffer = Buffer.from(pred.bytesBase64Encoded, 'base64');
          console.log(`[Veo2Pipeline] ✅ Veo 2 clip ready: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);
          return videoBuffer;
        } else if (pred.video?.uri) {
          // Download from URI
          const videoRes = await fetch(pred.video.uri);
          if (!videoRes.ok) {
            console.error('[Veo2Pipeline] Failed to download video from URI');
            return null;
          }
          const videoBuffer = Buffer.from(await videoRes.arrayBuffer());
          console.log(`[Veo2Pipeline] ✅ Veo 2 clip downloaded: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);
          return videoBuffer;
        } else {
          console.error('[Veo2Pipeline] Unexpected prediction format:', JSON.stringify(pred).substring(0, 200));
          return null;
        }
      }

      const progress = pollData.metadata?.progressPercent || 0;
      console.log(`[Veo2Pipeline] Veo 2 generating... ${progress}% (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`);
    }

    console.error('[Veo2Pipeline] Veo 2 operation timed out after 5 minutes');
    return null;
  } catch (err) {
    console.error('[Veo2Pipeline] generateVeo2Clip error:', err.message);
    return null;
  }
}

/**
 * Generate all video clips for a set of scene prompts.
 * Processes clips sequentially to avoid rate limits.
 *
 * @param {string[]} scenePrompts - Array of Veo 2 prompts
 * @param {string} aspectRatio - '9:16' or '16:9'
 * @returns {Promise<Buffer[]>} - Array of MP4 buffers (some may be null if failed)
 */
export async function generateVeo2VideoClips(scenePrompts, aspectRatio = '9:16') {
  const clips = [];
  for (let i = 0; i < scenePrompts.length; i++) {
    console.log(`[Veo2Pipeline] Generating clip ${i + 1}/${scenePrompts.length}`);
    const clip = await generateVeo2Clip(scenePrompts[i], aspectRatio, 8);
    if (clip) {
      clips.push(clip);
    } else {
      console.warn(`[Veo2Pipeline] Clip ${i + 1} failed, skipping`);
    }
    // Small delay between clips
    if (i < scenePrompts.length - 1) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  return clips;
}

// ── Step 3: Generate ElevenLabs Voiceover ────────────────────────────────────

/**
 * Generate voiceover audio using ElevenLabs TTS.
 *
 * @param {string} text - Script text
 * @param {string} voiceId - ElevenLabs voice ID
 * @returns {Promise<Buffer|null>} - MP3 audio buffer
 */
export async function generateElevenLabsVoice(text, voiceId = VOICE_AR_MALE) {
  if (!ELEVENLABS_API_KEY) {
    console.warn('[Veo2Pipeline] No ELEVENLABS_API_KEY');
    return null;
  }

  // Truncate to ElevenLabs limit (free tier: 500 chars per request, paid: 5000)
  const truncatedText = text.substring(0, 4500);

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: truncatedText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.85,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Veo2Pipeline] ElevenLabs TTS failed ${res.status}:`, errText.substring(0, 200));
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    console.log(`[Veo2Pipeline] ✅ ElevenLabs audio generated: ${(buffer.length / 1024).toFixed(0)} KB`);
    return buffer;
  } catch (err) {
    console.error('[Veo2Pipeline] ElevenLabs error:', err.message);
    return null;
  }
}

// ── Step 4: FFmpeg Merge (Video Clips + Audio) ────────────────────────────────

/**
 * Merge multiple MP4 video clips into one using FFmpeg concat.
 * Then overlays ElevenLabs audio track.
 *
 * Requires: ffmpeg binary available via PATH or FFMPEG_PATH env var.
 * In Vercel Node.js runtime, use ffmpeg-static package.
 *
 * @param {Buffer[]} videoClips - Array of MP4 buffers
 * @param {Buffer|null} audioBuffer - MP3 audio buffer (optional)
 * @returns {Promise<Buffer|null>} - Final merged MP4 buffer
 */
export async function mergeVideoClipsWithAudio(videoClips, audioBuffer) {
  if (!videoClips || videoClips.length === 0) {
    console.warn('[Veo2Pipeline] No video clips to merge');
    return null;
  }

  // Create temp working directory
  const tmpDir = join(tmpdir(), `veo2_${randomBytes(8).toString('hex')}`);
  try {
    mkdirSync(tmpDir, { recursive: true });

    // Write video clips to temp files
    const clipPaths = [];
    for (let i = 0; i < videoClips.length; i++) {
      const clipPath = join(tmpDir, `clip_${i}.mp4`);
      writeFileSync(clipPath, videoClips[i]);
      clipPaths.push(clipPath);
    }

    // Find ffmpeg binary
    let ffmpegBin = process.env.FFMPEG_PATH || 'ffmpeg';
    try {
      // Try ffmpeg-static package
      const { default: ffmpegStatic } = await import('ffmpeg-static');
      if (ffmpegStatic) ffmpegBin = ffmpegStatic;
    } catch {
      // ffmpeg-static not installed, use system ffmpeg
    }

    const outputPath = join(tmpDir, 'output.mp4');

    if (videoClips.length === 1) {
      // Single clip — just mux audio
      if (audioBuffer) {
        const audioPath = join(tmpDir, 'audio.mp3');
        writeFileSync(audioPath, audioBuffer);
        execSync(
          `"${ffmpegBin}" -y -i "${clipPaths[0]}" -i "${audioPath}" ` +
          `-c:v copy -c:a aac -b:a 128k -shortest "${outputPath}"`,
          { timeout: 120000 }
        );
      } else {
        // No audio — just copy video
        execSync(`"${ffmpegBin}" -y -i "${clipPaths[0]}" -c copy "${outputPath}"`, { timeout: 60000 });
      }
    } else {
      // Multiple clips — create concat list then merge
      const concatListPath = join(tmpDir, 'concat_list.txt');
      const concatList = clipPaths.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
      writeFileSync(concatListPath, concatList);

      if (audioBuffer) {
        const audioPath = join(tmpDir, 'audio.mp3');
        writeFileSync(audioPath, audioBuffer);
        const concatVideoPath = join(tmpDir, 'concat.mp4');

        // First concat video clips
        execSync(
          `"${ffmpegBin}" -y -f concat -safe 0 -i "${concatListPath}" -c:v libx264 -preset fast -crf 23 "${concatVideoPath}"`,
          { timeout: 120000 }
        );

        // Then mux with audio
        execSync(
          `"${ffmpegBin}" -y -i "${concatVideoPath}" -i "${audioPath}" ` +
          `-c:v copy -c:a aac -b:a 128k -shortest "${outputPath}"`,
          { timeout: 120000 }
        );
      } else {
        // Concat without audio
        execSync(
          `"${ffmpegBin}" -y -f concat -safe 0 -i "${concatListPath}" -c:v libx264 -preset fast -crf 23 "${outputPath}"`,
          { timeout: 120000 }
        );
      }
    }

    if (!existsSync(outputPath)) {
      throw new Error('FFmpeg output file not created');
    }

    const result = readFileSync(outputPath);
    console.log(`[Veo2Pipeline] ✅ Merged video: ${(result.length / 1024 / 1024).toFixed(2)} MB`);
    return result;
  } catch (err) {
    console.error('[Veo2Pipeline] FFmpeg merge error:', err.message);
    return null;
  } finally {
    // Cleanup temp files
    try {
      execSync(`rmdir /s /q "${tmpDir}"`, { timeout: 10000 });
    } catch {
      try { execSync(`rm -rf "${tmpDir}"`, { timeout: 10000 }); } catch { /* ignore cleanup errors */ }
    }
  }
}

// ── Step 5: Kling AI Fallback ─────────────────────────────────────────────────

/**
 * Fallback video generator using Kling AI API (if Veo 2 is unavailable).
 * Kling AI also generates realistic human videos.
 *
 * @param {string} prompt - Video scene prompt
 * @param {string} aspectRatio - '9:16' or '16:9'
 * @returns {Promise<Buffer|null>}
 */
export async function generateKlingAiClip(prompt, aspectRatio = '9:16') {
  const KLING_API_KEY = process.env.KLING_API_KEY || '';
  if (!KLING_API_KEY) {
    console.warn('[Veo2Pipeline] No KLING_API_KEY for fallback');
    return null;
  }

  try {
    console.log('[Veo2Pipeline] Trying Kling AI fallback...');

    const submitRes = await fetch('https://api.klingai.com/v1/videos/text2video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KLING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_name: 'kling-v2-master',
        prompt,
        aspect_ratio: aspectRatio,
        duration: '5',
        mode: 'std',
        cfg_scale: 0.5,
      }),
    });

    if (!submitRes.ok) {
      console.warn('[Veo2Pipeline] Kling AI submit failed:', submitRes.status);
      return null;
    }

    const submitData = await submitRes.json();
    const taskId = submitData.data?.task_id;
    if (!taskId) return null;

    // Poll for completion
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 15000));
      const pollRes = await fetch(`https://api.klingai.com/v1/videos/text2video/${taskId}`, {
        headers: { 'Authorization': `Bearer ${KLING_API_KEY}` },
      });
      const pollData = await pollRes.json();
      if (pollData.data?.task_status === 'succeed') {
        const videoUrl = pollData.data?.task_result?.videos?.[0]?.url;
        if (videoUrl) {
          const videoRes = await fetch(videoUrl);
          const buffer = Buffer.from(await videoRes.arrayBuffer());
          console.log(`[Veo2Pipeline] ✅ Kling AI clip: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
          return buffer;
        }
      }
      if (pollData.data?.task_status === 'failed') {
        console.error('[Veo2Pipeline] Kling AI task failed');
        return null;
      }
    }
    return null;
  } catch (err) {
    console.error('[Veo2Pipeline] Kling AI error:', err.message);
    return null;
  }
}

// ── Main Pipeline Orchestrator ────────────────────────────────────────────────

/**
 * Main function: Generate a complete video ready for YouTube upload.
 *
 * @param {Object} opts
 * @param {string} opts.topic - Video topic (English)
 * @param {string} opts.format - 'short' (9:16) or 'landscape' (16:9)
 * @param {string} opts.language - 'ar' (Arabic) or 'en' (English) — determines voice
 * @returns {Promise<{
 *   videoBuffer: Buffer|null,
 *   script: Object,
 *   success: boolean,
 *   engine: string,
 *   title: string,
 *   description: string,
 *   tags: string[]
 * }>}
 */
export async function generateJurisTechVideo(opts = {}) {
  const {
    topic = 'AI Contract Analysis | JurisTech Solutions',
    format = 'short',
    language = 'ar',
  } = opts;

  const aspectRatio = format === 'short' ? '9:16' : '16:9';
  const voiceId = language === 'ar' ? VOICE_AR_MALE : VOICE_EN_MALE;

  console.log(`[Veo2Pipeline] 🎬 Starting video generation: "${topic}" [${format}/${language}]`);

  // Step 1: Generate script
  const script = await generateVeo2Script(topic, format, language);
  const voiceScript = language === 'ar' ? script.voiceScriptAr : script.voiceScriptEn;
  const title = language === 'ar' ? (script.titleAr || script.titleEn) : script.titleEn;
  const description = language === 'ar'
    ? `${script.descriptionAr}\n\n${script.descriptionEn}\n\n#JurisTech #قانون #عقود #ذكاء_اصطناعي #LegalTech`
    : `${script.descriptionEn}\n\n#JurisTech #LegalTech #AIContracts #ContractLaw #BusinessLaw`;

  // Step 2: Generate ElevenLabs voiceover
  const audioBuffer = await generateElevenLabsVoice(voiceScript, voiceId);

  // Step 3: Attempt Veo 2 video generation
  let videoClips = [];
  let engine = 'none';

  if (GEMINI_API_KEY) {
    console.log('[Veo2Pipeline] 🎯 Attempting Veo 2 clip generation...');
    videoClips = await generateVeo2VideoClips(script.scenes || [], aspectRatio);
    if (videoClips.length > 0) engine = 'veo2';
  }

  // Step 4: Fallback to Kling AI if Veo 2 failed
  if (videoClips.length === 0 && process.env.KLING_API_KEY) {
    console.log('[Veo2Pipeline] ⚠️ Veo 2 failed — trying Kling AI fallback...');
    const basePrompt = format === 'short' ? VEO2_PERSONAS.arabicMaleCEO : VEO2_LANDSCAPE_PERSONAS.meetingRoom;
    const klingClip = await generateKlingAiClip(`${basePrompt} ${topic}`, aspectRatio);
    if (klingClip) {
      videoClips = [klingClip];
      engine = 'kling';
    }
  }

  // Step 5: Merge video + audio if we have video clips
  let finalVideoBuffer = null;
  if (videoClips.length > 0) {
    console.log(`[Veo2Pipeline] 🔧 Merging ${videoClips.length} clips + audio...`);
    finalVideoBuffer = await mergeVideoClipsWithAudio(videoClips, audioBuffer);
    if (!finalVideoBuffer) {
      // Merge failed — use first clip with audio separately if possible
      console.warn('[Veo2Pipeline] Merge failed — using raw clip');
      finalVideoBuffer = videoClips[0];
    }
  } else if (audioBuffer) {
    // No video, but we have audio — log and continue (will be uploaded without video)
    console.warn('[Veo2Pipeline] No video clips available. Audio only (will upload as audio file — NOT ideal).');
    engine = 'audio_only';
  }

  console.log(`[Veo2Pipeline] ✅ Pipeline complete — engine: ${engine}, video: ${finalVideoBuffer ? 'YES' : 'NO'}, audio: ${audioBuffer ? 'YES' : 'NO'}`);

  return {
    videoBuffer: finalVideoBuffer,
    audioBuffer,
    script,
    success: Boolean(finalVideoBuffer),
    engine,
    title,
    description,
    tags: script.tags || [],
  };
}

export default { generateJurisTechVideo, generateVeo2Script, generateVeo2Clip, generateElevenLabsVoice, mergeVideoClipsWithAudio };
