"use client";

import { useReducer, useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import BottomNav from "@/components/BottomNav";
import { SlidersStep } from "@/components/SlidersStep";
import { DensityMeter } from "@/components/DensityMeter";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
  distillationReducer,
  getInitialState,
  calcDensity,
  STEP_ORDER,
  STEP_LABELS,
  DEFAULT_SLIDERS,
  type DistillationState,
} from "@/lib/distillationState";
import { INTERVIEW_QUESTIONS } from "@/lib/interviewQuestions";
import { stageAndDistill } from "@/lib/stageAndDistill";

// ── Shuffle & pick 5 questions ──
function pickQuestions() {
  const shuffled = [...INTERVIEW_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5);
}

// ── Icons per step ──
const STEP_ICONS: Record<string, string> = {
  identity: "person",
  interview: "psychology",
  sliders: "tune",
  voice: "mic",
  archives: "folder_open",
  review: "auto_awesome",
};

export default function DistillPage() {
  const router = useRouter();
  const userId = useSettingsStore((s) => s.user.id);
  const avatarUrl = useSettingsStore((s) => s.profile.avatarUrl);
  const [state, dispatch] = useReducer(distillationReducer, undefined, getInitialState);
  const [questions] = useState(pickQuestions);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [archiveFiles, setArchiveFiles] = useState<File[]>([]);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [distilling, setDistilling] = useState(false);
  const [distillProgress, setDistillProgress] = useState(0);
  const [distillError, setDistillError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const currentIdx = STEP_ORDER.indexOf(state.step);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === STEP_ORDER.length - 1;
  const density = calcDensity(state, !!voiceBlob, archiveFiles.length > 0);

  // Scroll to top when step changes
  useEffect(() => {
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state.step]);

  // ── Voice recording ──
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setVoiceBlob(blob);
        setVoiceUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setDistillError("Microphone access denied. Please allow mic permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // ── Navigation ──
  const goNext = () => {
    const next = STEP_ORDER[currentIdx + 1];
    if (next) dispatch({ type: "SET_STEP", step: next });
  };
  const goPrev = () => {
    const prev = STEP_ORDER[currentIdx - 1];
    if (prev) dispatch({ type: "SET_STEP", step: prev });
  };

  const canProceed = useMemo(() => {
    switch (state.step) {
      case "identity": return state.identity.name.trim() && state.identity.relation.trim();
      case "interview": return Object.keys(answers).length >= 5;
      case "sliders": return true;
      case "voice": return true;
      case "archives": return true;
      case "review": return density >= 10;
      default: return false;
    }
  }, [state.step, state.identity, answers, density]);

  // ── Submit ──
  const handleDistill = async () => {
    if (!userId) return;
    setDistilling(true);
    setDistillError("");

    const qaAnswers = questions
      .filter((q) => answers[q.id]?.trim())
      .map((q) => ({ question: q.text, questionId: q.id, answer: answers[q.id] }));

    dispatch({ type: "CLEAR_QA" });
    qaAnswers.forEach((qa) => dispatch({ type: "ADD_QA", payload: qa }));

    // Upload avatar if selected
    let avatarUrl: string | null = null;
    if (avatarFile) {
      const supabase = createClient();
      const ext = avatarFile.name.split(".").pop() || "jpg";
      const tempId = `distill_${Date.now()}`;
      const path = `${tempId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("persona-avatars")
        .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });
      if (!error) {
        const { data } = supabase.storage.from("persona-avatars").getPublicUrl(path);
        avatarUrl = data.publicUrl;
      }
    }

    const result = await stageAndDistill({
      userId,
      identity: { ...state.identity, avatar_url: avatarUrl },
      qaAnswers,
      sliderMetrics: state.slider_metrics,
      voiceBlob,
      archiveFiles,
      onProgress: setDistillProgress,
    });

    setDistilling(false);
    if (result.success) {
      router.push("/library");
    } else {
      setDistillError(result.error || "Distillation failed. Please try again.");
    }
  };

  // ── Render step content ──
  const renderStep = () => {
    switch (state.step) {
      // ── IDENTITY ──────────────────────────────
      case "identity":
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              Every preserved voice begins with a name. Tell us who this person is to you.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
                  Their Name
                </label>
                <input
                  type="text"
                  value={state.identity.name}
                  onChange={(e) => dispatch({ type: "SET_IDENTITY", payload: { ...state.identity, name: e.target.value } })}
                  placeholder="e.g. Grandma Rose"
                  className="w-full py-3.5 px-5 rounded-2xl bg-surface text-primary border border-subtle shadow-sm placeholder:text-secondary/50 outline-none focus:border-rose/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
                  Your Relationship
                </label>
                <input
                  type="text"
                  value={state.identity.relation}
                  onChange={(e) => dispatch({ type: "SET_IDENTITY", payload: { ...state.identity, relation: e.target.value } })}
                  placeholder="e.g. Grandmother, Mentor, Old Friend"
                  className="w-full py-3.5 px-5 rounded-2xl bg-surface text-primary border border-subtle shadow-sm placeholder:text-secondary/50 outline-none focus:border-rose/50 transition-colors"
                />
              </div>
              {/* Avatar upload */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
                  Their Photo <span className="text-secondary/40 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => avatarInputRef.current?.click()}
                    className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-subtle/60 bg-surface flex items-center justify-center cursor-pointer hover:border-rose/50 transition-colors flex-shrink-0"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                    ) : state.identity.name ? (
                      <span className="font-serif text-2xl text-primary/40">{state.identity.name.charAt(0)}</span>
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-secondary/30">photo_camera</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-secondary">
                      {avatarFile ? avatarFile.name : "Tap to add a photo"}
                    </p>
                    {avatarFile && (
                      <button
                        onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                        className="text-xs text-rose underline underline-offset-4 text-left"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>
          </div>
        );

      // ── INTERVIEW ──────────────────────────────
      case "interview":
        return (
          <div className="space-y-8">
            <p className="text-secondary text-sm leading-relaxed">
              Answer these 5 questions and we will understand the shape of their soul.
            </p>
            {questions.map((q, i) => (
              <div key={q.id} className="space-y-3">
                <label className="block font-serif text-primary text-base leading-relaxed">
                  <span className="text-rose/60 text-xs font-sans font-bold uppercase tracking-widest mr-2">
                    {i + 1}.
                  </span>
                  {q.text}
                </label>
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Type your answer here..."
                  rows={3}
                  className="w-full py-3 px-5 rounded-2xl bg-surface text-primary border border-subtle shadow-sm placeholder:text-secondary/50 outline-none focus:border-rose/50 transition-colors resize-none"
                />
              </div>
            ))}
          </div>
        );

      // ── SLIDERS ──────────────────────────────
      case "sliders":
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              Dial in their personality. These sliders calibrate how their AI persona will think and speak.
            </p>
            <SlidersStep
              metrics={state.slider_metrics}
              onChange={(metrics) => dispatch({ type: "SET_SLIDERS", payload: metrics })}
            />
          </div>
        );

      // ── VOICE ──────────────────────────────────
      case "voice":
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              Share a voice memory — something only they would say, or a story in their own words.
            </p>
            <div className="bg-surface rounded-3xl border-2 border-dashed border-subtle p-8 flex flex-col items-center gap-4">
              {voiceUrl ? (
                <div className="w-full space-y-4">
                  <audio src={voiceUrl} controls className="w-full" />
                  <button
                    onClick={() => { setVoiceUrl(null); setVoiceBlob(null); }}
                    className="text-rose text-sm underline underline-offset-4"
                  >
                    Remove recording
                  </button>
                </div>
              ) : isRecording ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-rose animate-pulse flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-white">mic</span>
                  </div>
                  <p className="text-rose font-medium animate-pulse">Recording...</p>
                  <button
                    onClick={stopRecording}
                    className="px-6 py-3 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-sm btn-press"
                  >
                    Stop Recording
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-rose/10 flex items-center justify-center text-rose">
                    <span className="material-symbols-outlined text-3xl">mic</span>
                  </div>
                  <p className="text-secondary text-sm text-center">
                    Record a voice note, or skip and come back later.
                  </p>
                  <button
                    onClick={startRecording}
                    className="px-6 py-3 rounded-full bg-rose text-white font-bold shadow-sm btn-press"
                  >
                    Start Recording
                  </button>
                </>
              )}
            </div>
          </div>
        );

      // ── ARCHIVES ──────────────────────────────
      case "archives":
        return (
          <div className="space-y-6">
            <p className="text-secondary text-sm leading-relaxed">
              Upload letters, photos, or voice notes. We will thoughtfully distill them to capture the essence of their voice.
            </p>
            <div
              className="bg-surface rounded-3xl border-2 border-dashed border-subtle p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-rose/40 transition-colors"
              onClick={() => document.getElementById("archive-input")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                setArchiveFiles((prev) => [...prev, ...files]);
              }}
            >
              <span className="material-symbols-outlined text-4xl text-rose/60">cloud_upload</span>
              <p className="text-primary font-medium">Drop files here or click to browse</p>
              <p className="text-secondary text-xs">Images, PDFs, text files — anything that holds their voice</p>
              <input
                id="archive-input"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) setArchiveFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
                }}
              />
            </div>
            {archiveFiles.length > 0 && (
              <div className="space-y-2">
                {archiveFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-surface rounded-2xl p-3 border border-subtle/60">
                    <span className="material-symbols-outlined text-secondary">description</span>
                    <span className="flex-1 text-sm text-primary truncate">{f.name}</span>
                    <button
                      onClick={() => setArchiveFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="text-rose/60 hover:text-rose"
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      // ── REVIEW ──────────────────────────────
      case "review":
        return (
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-4 py-4">
              <DensityMeter density={density} state={state} hasVoice={!!voiceBlob} hasArchives={archiveFiles.length > 0} />
              <p className="text-secondary text-sm text-center">
                {density < 30
                  ? "Add more detail — memories, stories, and slider tuning raise the density."
                  : density < 60
                  ? "Good foundation. More voice or archives will deepen the soul."
                  : density < 90
                  ? "Nearly there. A rich soul is forming."
                  : "Incredible depth. Ready to distill."}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-surface rounded-2xl border border-subtle/60 p-5 space-y-3">
              <h3 className="font-serif text-lg text-primary">Soul Summary</h3>
              <div className="text-sm text-secondary space-y-1">
                {avatarPreview && (
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-subtle/40">
                    <img src={avatarPreview} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-subtle/60" />
                    <span className="text-primary font-medium">Photo added</span>
                  </div>
                )}
                <p><strong className="text-primary">Name:</strong> {state.identity.name || "—"}</p>
                <p><strong className="text-primary">Relation:</strong> {state.identity.relation || "—"}</p>
                <p><strong className="text-primary">Interview:</strong> {Object.keys(answers).filter((k) => answers[+k]?.trim()).length}/5 answered</p>
                <p><strong className="text-primary">Sliders:</strong> {state.slider_metrics.outlook !== 50 || state.slider_metrics.affection !== 50 || state.slider_metrics.formality !== 50 ? "Customized" : "Default (balanced)"}</p>
                <p><strong className="text-primary">Voice:</strong> {voiceBlob ? "Recorded ✓" : "None"}</p>
                <p><strong className="text-primary">Archives:</strong> {archiveFiles.length > 0 ? `${archiveFiles.length} file(s)` : "None"}</p>
              </div>
            </div>

            {distillError && (
              <div className="bg-rose/10 border border-rose/20 rounded-2xl p-4 text-rose text-sm">
                {distillError}
              </div>
            )}

            <button
              onClick={handleDistill}
              disabled={distilling || !canProceed}
              className="w-full py-4 rounded-2xl font-bold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed btn-press"
            >
              {distilling ? `Distilling... ${distillProgress}%` : "Begin Distillation"}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <header className="bg-surface border-b border-subtle/50 shadow-sm shadow-black/5 sticky top-0 z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <Link
            href="/settings/profile"
            className="absolute left-4 w-10 h-10 rounded-full overflow-hidden border border-subtle shadow-sm btn-press"
          >
            {avatarUrl ? (
              <img alt="Profile" src={avatarUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-secondary text-xl bg-surface">
                person
              </span>
            )}
          </Link>
          <h1 className="text-xl font-serif font-bold text-primary tracking-tight">The Heirloom</h1>
        </div>
      </header>

      <main ref={mainRef} className="flex-grow w-full max-w-2xl mx-auto px-6 py-6 pb-32 flex flex-col gap-6 overflow-y-auto">
        {/* ── Progress steps ── */}
        <div className="relative flex flex-row justify-between w-full">
          <div className="absolute top-4 left-[8%] right-[8%] border-t-2 border-dotted border-subtle/40 z-0" />
          {STEP_ORDER.map((step, i) => {
            const isActive = i <= currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <div key={step} className="flex flex-col items-center flex-1 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-xs transition-all duration-300 ${
                    isCurrent
                      ? "bg-rose text-white scale-110"
                      : isActive
                      ? "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-800"
                      : "bg-surface text-secondary border border-subtle"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{STEP_ICONS[step]}</span>
                </div>
                <span
                  className={`text-[10px] text-center mt-1.5 font-medium leading-tight hidden sm:block ${
                    isCurrent ? "text-primary" : isActive ? "text-secondary" : "text-secondary/40"
                  }`}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Current step heading ── */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary">
            {STEP_LABELS[state.step]}
          </h2>
          <p className="text-xs text-secondary/60 mt-1">
            Step {currentIdx + 1} of {STEP_ORDER.length}
          </p>
        </div>

        {/* ── Step content ── */}
        <div className="flex-1">{renderStep()}</div>

        {/* ── Navigation buttons ── */}
        <div className="flex gap-3 pt-4 border-t border-subtle/30">
          {!isFirst && (
            <button
              onClick={goPrev}
              className="flex-1 py-3.5 rounded-2xl font-medium bg-surface text-primary border border-subtle shadow-sm btn-press"
            >
              Back
            </button>
          )}
          {!isLast && (
            <button
              onClick={goNext}
              disabled={!canProceed}
              className={`flex-1 py-3.5 rounded-2xl font-bold shadow-sm btn-press ${
                canProceed
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                  : "bg-surface text-secondary/40 border border-subtle/40 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
