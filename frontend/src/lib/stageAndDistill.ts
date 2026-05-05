// Staging upload utility for the distillation wizard.
// Uploads blobs to [user_id]/staging/[session_id]/ on Supabase,
// then invokes the distill-soul edge function with structured metadata.

import { createClient } from "@/utils/supabase/client";
import type { QAPair, SliderMetrics, IdentityPayload } from "@/lib/distillationState";

function generateSessionId(): string {
  return `distill_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface StagingPayload {
  userId: string;
  identity: IdentityPayload;
  qaAnswers: QAPair[];
  sliderMetrics: SliderMetrics;
  voiceBlob: Blob | null;
  archiveFiles: File[];
  onProgress?: (pct: number) => void;
}

interface StagingResult {
  success: boolean;
  sessionId: string;
  stagingPath: string;
  error?: string;
  fnResult?: unknown;
}

export async function stageAndDistill({
  userId,
  identity,
  qaAnswers,
  sliderMetrics,
  voiceBlob,
  archiveFiles,
  onProgress,
}: StagingPayload): Promise<StagingResult> {
  const sessionId = generateSessionId();
  const stagingPath = `${userId}/staging/${sessionId}`;
  const supabase = createClient();

  let uploaded = 0;
  const totalItems = (voiceBlob ? 1 : 0) + archiveFiles.length;
  const report = (n: number) => onProgress?.(Math.round((n / totalItems) * 100));

  try {
    // ── Upload voice blob ──────────────────────────
    if (voiceBlob) {
      const voiceExt = voiceBlob.type.includes("webm") ? "webm" : "mp4";
      const { error } = await supabase.storage
        .from("memories")
        .upload(`${stagingPath}/voice_story.${voiceExt}`, voiceBlob, {
          contentType: voiceBlob.type,
          upsert: true,
        });

      if (error) throw new Error(`Voice upload failed: ${error.message}`);
      uploaded++;
      report(uploaded);
    }

    // ── Upload archive files ───────────────────────
    for (const file of archiveFiles) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const { error } = await supabase.storage
        .from("memories")
        .upload(`${stagingPath}/${safeName}`, file, {
          contentType: file.type,
          upsert: true,
        });

      if (error) throw new Error(`File upload failed (${file.name}): ${error.message}`);
      uploaded++;
      report(uploaded);
    }

    // ── Create stub persona in DB ──────────────────
    const { data: stubPersona, error: stubError } = await supabase
      .from("personas")
      .insert({
        user_id: userId,
        name: identity.name || "Distilling Soul",
        relation: identity.relation || "Loved One",
        avatar_url: identity.avatar_url,
        status: "distilling",
      })
      .select("id")
      .single();

    if (stubError || !stubPersona) {
      throw new Error(`Failed to create persona stub: ${stubError?.message}`);
    }

    // ── Invoke edge function ───────────────────────
    const { data, error: fnError } = await supabase.functions.invoke(
      "distill-soul",
      {
        body: {
          userId,
          personaId: stubPersona.id,
          personaName: identity.name,
          personaRelation: identity.relation,
          sessionId,
          stagingPath,
          qaAnswers,
          sliderMetrics,
        },
      }
    );

    if (fnError) throw new Error(`Edge function failed: ${fnError.message}`);

    return {
      success: true,
      sessionId,
      stagingPath,
      fnResult: data,
    };
  } catch (err) {
    return {
      success: false,
      sessionId,
      stagingPath,
      error: (err as Error).message,
    };
  }
}
