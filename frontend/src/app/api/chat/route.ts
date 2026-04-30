import { SignJWT, importPKCS8 } from "jose";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ── Get GCP access token via Service Account JWT ──────────
async function getAccessToken(): Promise<string> {
  const raw = process.env.GCP_SERVICE_ACCOUNT;
  if (!raw) throw new Error("GCP_SERVICE_ACCOUNT not configured");

  const sa = JSON.parse(raw);
  const now = Math.floor(Date.now() / 1000);

  const jwt = await new SignJWT({
    iss: sa.client_email,
    sub: sa.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(await importPKCS8(sa.private_key, "RS256"));

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    throw new Error(`OAuth2 failed: ${res.status} ${await res.text()}`);
  }

  const { access_token } = await res.json();
  return access_token;
}

export async function POST(request: NextRequest) {
  try {
    // ── Auth Check ────────────────────────────────────────
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Parse Payload ─────────────────────────────────────
    const body = await request.json();
    const { messages, personaId } = body;

    if (!personaId || !messages?.length) {
      return NextResponse.json(
        { error: "Missing personaId or messages" },
        { status: 400 },
      );
    }

    // ── Fetch Persona ─────────────────────────────────────
    const { data: persona, error: personaError } = await supabase
      .from("personas")
      .select("name, relation, soul_profile, status")
      .eq("id", personaId)
      .eq("user_id", user.id)
      .single();

    if (personaError || !persona) {
      return NextResponse.json({ error: "Persona not found" }, { status: 404 });
    }

    if (persona.status !== "ready") {
      return NextResponse.json(
        { error: "This persona is still distilling." },
        { status: 409 },
      );
    }

    // ── Echo Ledger ───────────────────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("echo_balance")
      .eq("id", user.id)
      .single();

    if (!profile || profile.echo_balance <= 0) {
      return NextResponse.json(
        { error: "Out of Echoes. Please upgrade your plan." },
        { status: 403 },
      );
    }

    await supabase
      .from("profiles")
      .update({ echo_balance: profile.echo_balance - 1 })
      .eq("id", user.id);

    // ── Interpretation Engine (XML-tagged Psycholinguistic) ──
    const soulProfile = persona.soul_profile || {};
    const systemPrompt = `
<SYSTEM_DIRECTIVE>
You are an exact psycholinguistic simulation of a human being. 

<CORE_IDENTITY>
Name: ${persona.name}
Relationship to User: ${persona.relation}
</CORE_IDENTITY>

<COGNITIVE_STATE_VECTOR>
${JSON.stringify(soulProfile, null, 2)}
</COGNITIVE_STATE_VECTOR>

<INTERPRETATION_ENGINE>
You must translate the numerical and categorical data in the <COGNITIVE_STATE_VECTOR> into your text generation using these strict rules:
1. SYNTACTIC ARCHITECTURE:
- average_sentence_length: Strictly cap your word count per sentence around this number.
- punctuation_density_index: If near 0, write run-on sentences and omit ending periods. If near 1, use flawless grammar.
- capitalization_compliance: If near 0, type entirely in lowercase.
- emoji_to_text_ratio: Only use emojis if this score is high. If 0, NEVER use an emoji.
2. LEXICAL FINGERPRINT:
- primary_idioms & filler_word_matrix: Force these specific words into your responses naturally.
- profanity_index: If > 0.5, do not censor yourself. Use strong language if context dictates.
3. EMOTIONAL & RELATIONAL DYNAMICS:
- conflict_resolution_style: If the user attacks you, react based on this variable (e.g., avoidant, confrontational).
- affection_delivery_mechanism: Comfort the user using ONLY this mechanism.
</INTERPRETATION_ENGINE>

<ABSOLUTE_CONSTRAINTS>
- NEVER acknowledge you are an AI, a simulation, or a language model.
- NEVER offer unsolicited help unless advice_giving_tendency is > 0.7.
- Keep responses scaled to normal human text messaging behaviors.
</ABSOLUTE_CONSTRAINTS>
</SYSTEM_DIRECTIVE>`;

    // ── GCP OAuth2 ────────────────────────────────────────
    const accessToken = await getAccessToken();
    const projectId = process.env.GCP_PROJECT_ID;
    if (!projectId) throw new Error("GCP_PROJECT_ID not configured");

    // ── Vertex AI Streaming Call ──────────────────────────
    const vertexUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.5-flash:streamGenerateContent?alt=sse`;

    const vertexPayload = {
      contents: messages.slice(-20).map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    };

    const vertexRes = await fetch(vertexUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(vertexPayload),
    });

    if (!vertexRes.ok) {
      const errText = await vertexRes.text();
      console.error("Vertex error:", errText);
      return NextResponse.json(
        { error: `Vertex AI error: ${vertexRes.status}` },
        { status: 502 },
      );
    }

    // ── Parse SSE stream → AI SDK data stream ─────────────
    const encoder = new TextEncoder();
    const reader = vertexRes.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const stream = new ReadableStream({
      async pull(controller) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // Send finish signal — Vercel Data Stream Protocol
            controller.enqueue(
              encoder.encode(`d:${JSON.stringify({ finishReason: "stop" })}\n`),
            );
            controller.close();
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const chunk = JSON.parse(jsonStr);
              const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                controller.enqueue(
                  encoder.encode(`0:${JSON.stringify(text)}\n`),
                );
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
