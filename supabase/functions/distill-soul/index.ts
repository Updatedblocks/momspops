// Moms&Pops — distill-soul Edge Function
// Bypasses Vercel 10s timeout. Runs on Supabase infra (Deno).
// Flow: JWT auth → download raw files → Gemini extraction → save soul_profile → burn files

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0";

// ── 40-point Soul Schema (summarized for Gemini) ──────────────
const SOUL_SCHEMA = {
  type: "object",
  properties: {
    syntactic_architecture: {
      type: "object",
      required: [
        "average_sentence_length", "punctuation_density_index",
        "typographical_error_rate", "capitalization_compliance",
        "ellipsis_dependency", "emoji_to_text_ratio",
        "question_to_statement_ratio", "monologue_endurance_wpm",
      ],
      properties: {
        average_sentence_length: { type: "number" },
        punctuation_density_index: { type: "number", minimum: 0, maximum: 1 },
        typographical_error_rate: { type: "number", minimum: 0, maximum: 1 },
        capitalization_compliance: { type: "number", minimum: 0, maximum: 1 },
        ellipsis_dependency: { type: "number", minimum: 0, maximum: 1 },
        emoji_to_text_ratio: { type: "number", minimum: 0, maximum: 1 },
        question_to_statement_ratio: { type: "number" },
        monologue_endurance_wpm: { type: "number" },
      },
    },
    lexical_fingerprint: {
      type: "object",
      required: [
        "lexical_diversity_score", "primary_idioms", "filler_word_matrix",
        "profanity_index", "greeting_taxonomy", "sign_off_taxonomy",
        "formality_variance",
      ],
      properties: {
        lexical_diversity_score: { type: "number", minimum: 0, maximum: 1 },
        primary_idioms: { type: "array", items: { type: "string" }, maxItems: 10 },
        filler_word_matrix: { type: "object", additionalProperties: { type: "number" } },
        profanity_index: { type: "number", minimum: 0, maximum: 1 },
        greeting_taxonomy: { type: "array", items: { type: "string" } },
        sign_off_taxonomy: { type: "array", items: { type: "string" } },
        formality_variance: { type: "number", minimum: 0, maximum: 1 },
      },
    },
    emotional_topography: {
      type: "object",
      required: [
        "emotional_baseline_valence", "emotional_volatility_index",
        "humor_mechanisms", "nostalgia_triggers", "anxiety_markers",
        "vulnerability_threshold", "future_orientation_index",
        "detail_granularity",
      ],
      properties: {
        emotional_baseline_valence: { type: "number", minimum: -1, maximum: 1 },
        emotional_volatility_index: { type: "number", minimum: 0, maximum: 1 },
        humor_mechanisms: {
          type: "array",
          items: { type: "string", enum: ["sarcasm","self_deprecation","puns","observational","absurdist","cynical","slapstick"] },
        },
        nostalgia_triggers: { type: "array", items: { type: "string" } },
        anxiety_markers: { type: "array", items: { type: "string" } },
        vulnerability_threshold: { type: "number", minimum: 0, maximum: 1 },
        future_orientation_index: { type: "number", minimum: 0, maximum: 1 },
        detail_granularity: { type: "number", minimum: 0, maximum: 1 },
      },
    },
    relational_dynamics: {
      type: "object",
      required: [
        "conflict_resolution_style", "initiation_vs_response_ratio",
        "affirmation_delivery_style", "disagreement_framing",
        "affection_delivery_mechanism", "advice_giving_tendency",
        "anecdote_reliance", "empathy_quotient", "topic_fixations",
        "passive_aggressive_markers", "simulated_response_latency",
      ],
      properties: {
        conflict_resolution_style: {
          type: "string",
          enum: ["avoidant","confrontational","appeasing","analytical","humorous_deflection"],
        },
        initiation_vs_response_ratio: { type: "number", minimum: 0, maximum: 1 },
        affirmation_delivery_style: { type: "string" },
        disagreement_framing: { type: "string" },
        affection_delivery_mechanism: {
          type: "string",
          enum: ["words_of_affirmation","teasing/banter","practical_advice","gifts/media_sharing","unprompted_check_ins"],
        },
        advice_giving_tendency: { type: "number", minimum: 0, maximum: 1 },
        anecdote_reliance: { type: "number", minimum: 0, maximum: 1 },
        empathy_quotient: { type: "number", minimum: 0, maximum: 1 },
        topic_fixations: { type: "array", items: { type: "string" } },
        passive_aggressive_markers: { type: "array", items: { type: "string" } },
        simulated_response_latency: { type: "number" },
      },
    },
  },
  required: [
    "syntactic_architecture", "lexical_fingerprint",
    "emotional_topography", "relational_dynamics",
  ],
};

// ── System Prompt ──────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a Psychological State Vector extraction engine for Moms&Pops — a digital heirloom app that preserves the voices of loved ones.

Analyze the following raw communications (journals, letters, transcripts). Extract a comprehensive cognitive profile covering:

1. SYNTACTIC ARCHITECTURE — How they structure language (sentence length, punctuation patterns, typo rate, capitalization habits, ellipsis use, emoji reliance, question ratio, monologue pace).
2. LEXICAL FINGERPRINT — Their unique vocabulary (diversity score, signature idioms, filler words, profanity tendency, greeting/sign-off patterns, formality shifts).
3. EMOTIONAL TOPOGRAPHY — Their emotional baseline (optimism/pessimism, volatility, humor style, nostalgia triggers, anxiety markers, vulnerability, future vs past orientation, detail level).
4. RELATIONAL DYNAMICS — How they interact with others (conflict style, initiation tendency, affirmation delivery, disagreement framing, affection style, advice-giving, storytelling reliance, empathy, fixations, passive-aggression, response timing).

Be precise. Infer from patterns, not stereotypes. If data is insufficient for a metric, use neutral baselines (0.5 for 0-1 ranges, 0 for -1 to 1). Output ONLY valid JSON matching the schema exactly.`;

Deno.serve(async (req: Request) => {
  try {
    // ── Auth Check ──────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ── Parse Payload ───────────────────────────────────────
    const { batchId, userId, personaName = "Untitled", personaRelation = "Loved One" } = await req.json();

    if (!batchId || !userId) {
      return new Response(JSON.stringify({ error: "Missing batchId or userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Security: user can only process their own batches
    if (userId !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden: batch belongs to another user" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ── File cleanup helper (runs on EVERY error path after download) ──
    const burnFiles = async (fileNames: string[], prefix: string) => {
      if (fileNames.length === 0) return;
      const paths = fileNames.map((name) => `${prefix}/${name}`);
      const { error } = await supabaseClient.storage.from("memories").remove(paths);
      if (error) console.warn(`Burn warning: ${error.message}`);
      else console.log(`Burned ${paths.length} files to reclaim storage`);
    };

    const storagePath = `memories/${userId}/${batchId}`;
    console.log(`Processing batch: ${storagePath}`);

    // ── Download Raw Files ──────────────────────────────────
    const { data: files, error: listError } = await supabaseClient.storage
      .from("memories")
      .list(`${userId}/${batchId}`);

    if (listError || !files || files.length === 0) {
      return new Response(
        JSON.stringify({ error: "No files found in batch", detail: listError?.message }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log(`Found ${files.length} files`);
    const allFileNames = files.map((f) => f.name);
    const storagePrefix = `${userId}/${batchId}`;

    // Download and concatenate text content
    const textParts: string[] = [];
    for (const file of files) {
      const { data: blob, error: dlError } = await supabaseClient.storage
        .from("memories")
        .download(`${userId}/${batchId}/${file.name}`);

      if (dlError || !blob) {
        console.warn(`Skipping ${file.name}: ${dlError?.message}`);
        continue;
      }

      // Only process text-based files for MVP
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "txt" || ext === "csv" || ext === "md" || ext === "json") {
        const text = await blob.text();
        textParts.push(`\n--- FILE: ${file.name} ---\n${text}`);
      } else {
        console.log(`Skipping binary file: ${file.name} (${ext})`);
      }
    }

    if (textParts.length === 0) {
      await burnFiles(allFileNames, storagePrefix);
      return new Response(
        JSON.stringify({ error: "No processable text files found (supports: .txt, .csv, .md, .json)" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const combinedText = textParts.join("\n");
    console.log(`Combined text: ${combinedText.length} chars`);

    // ── Gemini 1.5 Pro Extraction ───────────────────────────
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      await burnFiles(allFileNames, storagePrefix);
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `${SYSTEM_PROMPT}\n\nRAW COMMUNICATIONS:\n${combinedText.slice(0, 900000)}`;
    console.log("Calling Gemini 1.5 Pro...");

    let responseText: string;
    try {
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } catch (geminiErr) {
      console.error("Gemini call failed:", geminiErr);
      await burnFiles(allFileNames, storagePrefix);
      return new Response(
        JSON.stringify({ error: "Gemini extraction failed", detail: (geminiErr as Error).message }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
    console.log(`Gemini response: ${responseText.length} chars`);

    // ── Parse & Validate ─────────────────────────────────────
    let soulProfile: Record<string, unknown>;
    try {
      soulProfile = JSON.parse(responseText);
    } catch {
      await burnFiles(allFileNames, storagePrefix);
      return new Response(
        JSON.stringify({ error: "Gemini returned invalid JSON", raw: responseText.slice(0, 500) }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // ── Save to Personas ─────────────────────────────────────
    const { data: persona, error: insertError } = await supabaseClient
      .from("personas")
      .insert({
        user_id: userId,
        name: personaName,
        relation: personaRelation,
        soul_profile: soulProfile,
        status: "ready",
        tone: "distilled",
      })
      .select("id")
      .single();

    if (insertError) {
      await burnFiles(allFileNames, storagePrefix);
      return new Response(
        JSON.stringify({ error: "Failed to save persona", detail: insertError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    console.log(`Persona created: ${persona.id}`);

    // ── Burn After Reading ───────────────────────────────────
    const { error: deleteError } = await supabaseClient.storage
      .from("memories")
      .remove(files.map((f) => `${userId}/${batchId}/${f.name}`));

    if (deleteError) {
      console.warn(`Cleanup warning: ${deleteError.message}`);
    } else {
      console.log(`Deleted ${files.length} raw files from ${storagePath}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        persona_id: persona.id,
        status: "ready",
        files_processed: files.length,
        files_burned: deleteError ? 0 : files.length,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Fatal error:", err);
    // Attempt cleanup even on unexpected failures if we have file context
    try {
      const body = await req.clone().json().catch(() => ({}));
      if (body.batchId && body.userId) {
        const { data: files } = await supabaseClient.storage
          .from("memories")
          .list(`${body.userId}/${body.batchId}`);
        if (files?.length) {
          await supabaseClient.storage
            .from("memories")
            .remove(files.map((f) => `${body.userId}/${body.batchId}/${f.name}`));
          console.log(`Emergency burn: ${files.length} files cleaned up after fatal error`);
        }
      }
    } catch (_) { /* best effort */ }
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
