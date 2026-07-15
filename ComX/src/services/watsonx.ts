/**
 * src/services/watsonx.ts  — WatsonXSAPCommodity
 * IBM watsonx → Gemini → Dummy fallback chain (TypeScript wrapper)
 */

import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const WATSONX_API_KEY    = process.env.WATSONX_API_KEY    || '';
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID || '';
const WATSONX_REGION     = process.env.WATSONX_REGION     || 'us-south';
const WATSONX_MODEL      = process.env.WATSONX_TEXT_MODEL  || 'ibm/granite-3-8b-instruct';
const GEMINI_API_KEY     = process.env.GEMINI_API_KEY      || '';
const GEMINI_MODEL       = process.env.GEMINI_MODEL        || 'gemini-1.5-flash';
const TIMEOUT_MS         = parseInt(process.env.AI_TIMEOUT_MS || '15000', 10);

export interface AIResult {
  text: string;
  provider: 'watsonx' | 'gemini' | 'dummy';
  model: string;
  tokens?: number;
  category?: string;
}

let _iamToken   = '';
let _tokenExpiry = 0;

function httpPost(hostname: string, urlPath: string, headers: Record<string, string>, body: object | string): Promise<{ status: number; body: string }> {
  const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
  const bodyBuf = Buffer.from(bodyStr);
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname, path: urlPath, method: 'POST', headers: { ...headers, 'Content-Length': bodyBuf.length } },
      (res) => {
        let data = '';
        res.on('data', (c: Buffer) => data += c.toString());
        res.on('end', () => resolve({ status: res.statusCode || 0, body: data }));
      }
    );
    req.on('error', reject);
    req.setTimeout(TIMEOUT_MS, () => req.destroy(new Error('timeout')));
    req.write(bodyBuf);
    req.end();
  });
}

async function getIAMToken(): Promise<string> {
  if (_iamToken && Date.now() < _tokenExpiry) return _iamToken;
  const body = `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(WATSONX_API_KEY)}`;
  const r = await httpPost('iam.cloud.ibm.com', '/identity/token',
    { 'Content-Type': 'application/x-www-form-urlencoded' }, body);
  if (r.status !== 200) throw new Error(`IAM failed: ${r.status}`);
  const parsed = JSON.parse(r.body);
  _iamToken    = parsed.access_token;
  _tokenExpiry = Date.now() + (parsed.expires_in - 60) * 1000;
  return _iamToken;
}

async function askWatsonx(prompt: string, maxTokens = 512, temperature = 0.3): Promise<AIResult> {
  if (!WATSONX_API_KEY || !WATSONX_PROJECT_ID) throw new Error('No watsonx credentials');
  const token = await getIAMToken();
  const r = await httpPost(
    `${WATSONX_REGION}.ml.cloud.ibm.com`,
    '/ml/v1/text/generation?version=2023-05-29',
    { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    { model_id: WATSONX_MODEL, input: prompt, parameters: { max_new_tokens: maxTokens, temperature }, project_id: WATSONX_PROJECT_ID }
  );
  if (r.status !== 200) {
    const e = JSON.parse(r.body);
    throw new Error(`watsonx ${r.status}: ${e.errors?.[0]?.message || r.body.slice(0, 100)}`);
  }
  const result = JSON.parse(r.body);
  return { text: result.results?.[0]?.generated_text?.trim() || '', provider: 'watsonx', model: WATSONX_MODEL, tokens: result.results?.[0]?.generated_token_count };
}

async function askGemini(prompt: string, maxTokens = 512, temperature = 0.3): Promise<AIResult> {
  if (!GEMINI_API_KEY) throw new Error('No Gemini key');
  const r = await httpPost(
    'generativelanguage.googleapis.com',
    `/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    { 'Content-Type': 'application/json' },
    { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: maxTokens, temperature } }
  );
  if (r.status !== 200) throw new Error(`Gemini ${r.status}`);
  const result = JSON.parse(r.body);
  return { text: result.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '', provider: 'gemini', model: GEMINI_MODEL };
}

function getDummy(key = 'default'): AIResult {
  const p = path.join(process.cwd(), 'data', 'dummy-ai.json');
  const dummy = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  return { text: dummy?.responses?.[key] || dummy?.default || '[AI unavailable — dummy fallback]', provider: 'dummy', model: 'fallback' };
}

/** Three-tier AI: watsonx → Gemini → Dummy */
export async function askAI(prompt: string, options: { maxTokens?: number; temperature?: number; fallbackKey?: string } = {}): Promise<AIResult> {
  const { maxTokens = 512, temperature = 0.3, fallbackKey = 'default' } = options;

  if (WATSONX_API_KEY && WATSONX_PROJECT_ID) {
    try { const r = await askWatsonx(prompt, maxTokens, temperature); console.log(`[AI] ✅ watsonx/${r.model}`); return r; }
    catch (e: any) { console.warn(`[AI] watsonx: ${e.message} → Gemini`); }
  }
  if (GEMINI_API_KEY) {
    try { const r = await askGemini(prompt, maxTokens, temperature); console.log(`[AI] ✅ Gemini/${r.model}`); return r; }
    catch (e: any) { console.warn(`[AI] Gemini: ${e.message} → dummy`); }
  }
  console.warn('[AI] ⚠️  dummy fallback');
  return getDummy(fallbackKey);
}

/** Map SAP material to commodity weights using AI */
export async function mapMaterialToCommodity(materialName: string, category: string): Promise<AIResult & { weights?: Record<string, number> }> {
  const prompt = `You are a SAP procurement expert. For this material: "${materialName}" (category: ${category}), estimate commodity composition as percentages.\nFormat ONLY as JSON: {"steel": 0, "copper": 0, "aluminum": 0, "nickel": 0, "plastic": 0, "other": 0}\nValues must sum to 100. Return ONLY the JSON.`;
  const result = await askAI(prompt, { maxTokens: 150, temperature: 0, fallbackKey: 'commodity' });
  try {
    const weights = JSON.parse(result.text.replace(/```json|```/g, '').trim());
    return { ...result, weights };
  } catch {
    return { ...result, weights: { steel: 50, copper: 10, aluminum: 20, nickel: 5, plastic: 10, other: 5 } };
  }
}

/** Summarize procurement risk */
export async function summarizeProcurementRisk(materials: Array<{ name: string; category: string; totalValue: number }>): Promise<AIResult> {
  const text = materials.map(m => `- ${m.name} (${m.category}): $${m.totalValue?.toLocaleString()}`).join('\n');
  return askAI(`Identify top 3 procurement risks for these materials and suggest mitigations:\n${text}`,
    { maxTokens: 400, temperature: 0.3, fallbackKey: 'commodity' });
}

export async function healthCheck(): Promise<Record<string, boolean | string>> {
  const status: Record<string, boolean | string> = { watsonx: false, gemini: false, dummy: true };
  if (WATSONX_API_KEY) { try { await askWatsonx('OK', 5, 0); status.watsonx = true; } catch { status.watsonx = false; } }
  if (GEMINI_API_KEY)  { try { await askGemini('OK', 5, 0);  status.gemini  = true; } catch { status.gemini  = false; } }
  status.activeProvider = status.watsonx ? 'watsonx' : status.gemini ? 'gemini' : 'dummy';
  return status;
}
