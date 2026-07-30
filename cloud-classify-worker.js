/**
 * Weatherglass — Cloud Photo Classification Worker
 *
 * Purpose: lets the app ask an actual AI to identify a cloud genus from a
 * photo, without ever putting an Anthropic API key in the browser. The app
 * sends a photo to THIS Worker; this Worker (running on Cloudflare's
 * servers, not in anyone's browser) holds the real API key as a secret and
 * calls Claude on the app's behalf, then returns just the answer.
 *
 * This is the first real backend component Weatherglass has — everything
 * else in the app runs entirely in the browser. Deliberate, not accidental:
 * an API key can't be kept secret in a static web app any other way.
 *
 * SETUP — see the deployment instructions delivered alongside this file.
 * Summary: deploy this to your own Cloudflare account, set ANTHROPIC_API_KEY
 * as a Worker secret (never paste it directly into this file), then put the
 * Worker's URL into Weatherglass's Settings.
 */

const CLOUD_GENERA = [
  "Cumulus", "Cumulonimbus", "Stratus", "Stratocumulus", "Altocumulus",
  "Altostratus", "Nimbostratus", "Cirrus", "Cirrocumulus", "Cirrostratus"
];

const CLASSIFY_PROMPT = `You are helping identify a cloud photo by its WMO cloud genus classification, for a personal weather journal app. Look carefully at the sky in this photo.

Respond with ONLY a single valid JSON object, no other text before or after it, in exactly this shape:
{"genus": "<one of the ten genera below, or null if the photo doesn't clearly show sky/clouds>", "confidence": "high" | "medium" | "low", "reasoning": "<one plain sentence explaining what you saw that led to this classification>"}

The only valid values for "genus" are exactly these ten (WMO standard genera), or null:
${CLOUD_GENERA.map(g => `"${g}"`).join(", ")}

If multiple cloud types are visible, pick the most visually dominant one. If the photo is not a sky/cloud photo at all (e.g. it's a person, a landscape with no visible sky, an indoor photo), respond with genus: null and explain why in "reasoning".`;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Use POST." }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Worker is missing its ANTHROPIC_API_KEY secret. See deployment instructions." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders(origin) } }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid request body — expected JSON with an 'imageBase64' field." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    const rawImage = body.imageBase64;
    if (!rawImage || typeof rawImage !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'imageBase64' field." }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }

    // Accept either a raw base64 string or a full data: URL
    const dataUrlMatch = rawImage.match(/^data:(image\/\w+);base64,(.*)$/s);
    const mediaType = dataUrlMatch ? dataUrlMatch[1] : (body.mediaType || "image/jpeg");
    const base64Data = dataUrlMatch ? dataUrlMatch[2] : rawImage;

    try {
      const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
              { type: "text", text: CLASSIFY_PROMPT }
            ]
          }]
        })
      });

      if (!anthropicResponse.ok) {
        const errText = await anthropicResponse.text();
        return new Response(JSON.stringify({ error: `Claude API error (${anthropicResponse.status}): ${errText}` }), {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      const data = await anthropicResponse.json();
      const text = (data.content || []).map(c => c.text || "").join("");

      let result;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        result = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      } catch (e) {
        return new Response(JSON.stringify({ error: "Could not parse Claude's response as JSON.", raw: text }), {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
        });
      }

      // Validate the genus is actually one of the ten before trusting it
      if (result.genus !== null && !CLOUD_GENERA.includes(result.genus)) {
        result = { genus: null, confidence: "low", reasoning: `Model returned an unrecognized value: ${result.genus}` };
      }

      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || "Unknown error calling Claude API." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
      });
    }
  }
};
