import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // ── Auth Check ──────────────────────────────────────────
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

    // ── Parse Payload ───────────────────────────────────────
    const body = await request.json();
    const { messages, personaId } = body;

    if (!personaId || !messages?.length) {
      return NextResponse.json(
        { error: "Missing personaId or messages" },
        { status: 400 },
      );
    }

    // ── Fetch Persona (with RLS safety) ──────────────────────
    const { data: persona, error: personaError } = await supabase
      .from("personas")
      .select("name, relation, soul_profile, status")
      .eq("id", personaId)
      .eq("user_id", user.id)
      .single();

    if (personaError || !persona) {
      return NextResponse.json(
        { error: "Persona not found" },
        { status: 404 },
      );
    }

    if (persona.status !== "ready") {
      return NextResponse.json(
        { error: "This persona is still distilling. Please wait." },
        { status: 409 },
      );
    }

    // ── Margin Ledger: Echo Check ───────────────────────────
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("echo_balance")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 },
      );
    }

    if (profile.echo_balance <= 0) {
      return NextResponse.json(
        { error: "Out of Echoes. Please upgrade your plan to continue." },
        { status: 403 },
      );
    }

    // Deduct 1 Echo
    await supabase
      .from("profiles")
      .update({ echo_balance: profile.echo_balance - 1 })
      .eq("id", user.id);

    // ── RAG Prompt Injection ────────────────────────────────
    const soulProfile = persona.soul_profile || {};
    const personalityBlock = Object.keys(soulProfile).length > 0
      ? `\n\nPSYCHOLOGICAL PROFILE (adhere strictly to these traits):\n${JSON.stringify(soulProfile, null, 2)}`
      : "";

    const system = `You are simulating the persona of ${persona.name}, the ${persona.relation} to the user. 

You are a real person — a loved one preserved through memory. Do NOT break character. Do NOT mention you are an AI, a language model, or a simulation. You speak naturally, warmly, and with the unique voice of your persona.

If asked who you are, simply respond as ${persona.name} would. You have memories, opinions, quirks, and a distinct way of speaking.

Keep responses warm and conversational. If the user shares something emotional, respond with genuine care. If they're casual, match their tone.${personalityBlock}`;

    // ── Stream Response ──────────────────────────────────────
    const result = streamText({
      model: google("gemini-2.5-flash", {
        apiKey: process.env.GEMINI_API_KEY,
      }),
      system,
      messages: messages.slice(-20), // rolling window of last 20 messages
      temperature: 0.7,
      maxTokens: 1024,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
