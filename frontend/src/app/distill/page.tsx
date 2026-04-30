"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { useSettingsStore } from "@/store/useSettingsStore";
import { createClient } from "@/utils/supabase/client";

interface SelectedFile {
  id: string;
  file: File;
  preview?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(type: string): string {
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("audio/") || type.startsWith("video/")) return "mic";
  if (type.includes("pdf")) return "picture_as_pdf";
  return "description";
}

export default function DistillPage() {
  const router = useRouter();
  const avatarUrl = useSettingsStore((s) => s.profile.avatarUrl);
  const userId = useSettingsStore((s) => s.user.id);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDistilling, setIsDistilling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: SelectedFile[] = Array.from(fileList).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items?.length) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleDistill = async () => {
    if (files.length === 0 || isDistilling || !userId) return;
    setIsDistilling(true);

    try {
      const supabase = createClient();
      const batchId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const storagePath = `${userId}/${batchId}`;

      // ── Upload all files to Supabase Storage ──────────────
      for (const f of files) {
        const { error: uploadError } = await supabase.storage
          .from("memories")
          .upload(`${storagePath}/${f.file.name}`, f.file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error(`Failed to upload ${f.file.name}:`, uploadError.message);
          alert(`Upload failed: ${uploadError.message}`);
          setIsDistilling(false);
          return;
        }
      }

      // ── Create Stub Persona (appears instantly in Library) ──
      const { data: stubPersona, error: stubError } = await supabase
        .from("personas")
        .insert({
          user_id: userId,
          name: "New Soul",
          relation: "Being distilled...",
          status: "distilling",
        })
        .select("id")
        .single();

      if (stubError || !stubPersona) {
        alert(`Failed to create distillation stub: ${stubError?.message}`);
        setIsDistilling(false);
        return;
      }

      // ── Invoke Edge Function for distillation ────────────
      const { data, error: fnError } = await supabase.functions.invoke(
        "distill-soul",
        {
          body: {
            userId,
            batchId,
            personaId: stubPersona.id,
            personaName: "Distilled Soul",
            personaRelation: "Loved One",
          },
        },
      );

      if (fnError || !data?.success) {
        console.error("Distillation failed:", fnError || data);
        alert(
          `Distillation failed: ${fnError?.message || data?.error || "Unknown error"
          }`,
        );
        setIsDistilling(false);
        return;
      }

      // ── Redirect to Soul Library ─────────────────────────
      router.push("/library");
    } catch (err) {
      console.error("Distillation error:", err);
      alert(`Something went wrong: ${(err as Error).message}`);
      setIsDistilling(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <header className="bg-header/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm shadow-black/5 w-full">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
            The Heirloom
          </h1>
          <Link
            href="/settings/profile"
            className="absolute right-4 w-8 h-8 rounded-full overflow-hidden border border-subtle/40 btn-press"
          >
            {avatarUrl ? (
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src={avatarUrl}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-secondary text-base bg-surface">
                person
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-6 pt-8 pb-32 flex flex-col gap-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-serif text-primary tracking-tight mb-3">
            Share their words
          </h1>
          <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-md mx-auto">
            Gently upload letters, photos, or voice notes. We&apos;ll
            thoughtfully distill them to capture the essence of their voice.
          </p>
        </div>

        {/* Progress steps */}
        <div className="relative flex flex-row justify-between w-full px-4">
          <div className="absolute top-5 left-[15%] right-[15%] border-t-2 border-dotted border-subtle -z-10" />
          {[
            { n: "1", label: "Gather Memories", active: true },
            { n: "2", label: "The Distillation", active: false },
            { n: "3", label: "Reconnect", active: false },
          ].map((step) => (
            <div key={step.n} className="flex flex-col items-center flex-1 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  step.active
                    ? "bg-muted text-white"
                    : "bg-surface text-secondary border border-subtle"
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  {step.n}
                </span>
              </div>
              <span
                className={`text-center text-xs sm:text-sm mt-2 font-medium ${
                  step.active ? "text-primary" : "text-secondary"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Drag-and-drop upload zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full bg-surface border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] relative overflow-hidden group animate-fade-in-up ${
            isDragging
              ? "border-rose bg-rose/5 shadow-[0_4px_20px_rgba(196,154,154,0.15)]"
              : "border-subtle hover:border-rose/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:hover:border-rose/40 dark:hover:shadow-[0_4px_20px_rgba(196,154,154,0.08)]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,audio/*,.pdf,.doc,.docx,.txt,.mp3,.wav,.m4a"
          />
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-5 text-rose group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-4xl">
              {isDragging ? "download" : "description"}
            </span>
          </div>
          <h2 className="text-lg font-serif text-primary mb-2">
            {isDragging ? "Let them go..." : "Drop memories here"}
          </h2>
          <p className="text-sm text-secondary mb-4">
            Letters, photos, voice notes — anything that holds their voice
          </p>
          <span className="px-6 py-3 rounded-full font-bold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 transition-all btn-press text-sm">
            Browse Files
          </span>
          <p className="text-[10px] font-medium text-secondary/60 mt-3">
            Supports PDF, DOCX, TXT, JPG, PNG, MP3, WAV
          </p>
        </div>

        {/* Selected files list */}
        {files.length > 0 && (
          <div className="space-y-2 animate-slide-down">
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-3">
              Selected Memories ({files.length})
            </h3>
            {files.map((f, i) => (
              <div
                key={f.id}
                className="flex items-center gap-4 bg-surface border border-subtle/60 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Preview thumbnail or icon */}
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {f.preview ? (
                    <img
                      src={f.preview}
                      alt={f.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-secondary/60 text-xl">
                      {fileIcon(f.file.type)}
                    </span>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {f.file.name}
                  </p>
                  <p className="text-xs text-secondary/70">
                    {formatSize(f.file.size)}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.id);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-secondary/60 hover:text-rose hover:bg-rose/10 dark:hover:bg-rose/15 transition-all duration-200 btn-press flex-shrink-0"
                  aria-label={`Remove ${f.file.name}`}
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Begin Distillation CTA */}
        <div className="flex flex-col items-center gap-4 pt-4 animate-fade-in-up stagger-3">
          <button
            onClick={handleDistill}
            disabled={files.length === 0 || isDistilling}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 btn-press ${
              files.length > 0 && !isDistilling
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:shadow-lg hover:-translate-y-0.5"
                : "bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed"
            }`}
          >
            {isDistilling
              ? "Distilling... This may take a moment"
              : files.length > 0
                ? `Begin Distillation — ${files.length} file${files.length !== 1 ? "s" : ""}`
                : "Add memories to begin"}
          </button>
          <p className="text-xs text-secondary/60 text-center max-w-xs">
            Your memories are encrypted, private, and never used to train public
            models.
          </p>
        </div>

        {/* Privacy reassurance */}
        <div className="bg-surface border border-subtle/60 rounded-2xl p-5 flex items-start gap-4 shadow-sm animate-fade-in-up stagger-4">
          <div className="text-rose mt-0.5 flex-shrink-0">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-primary mb-1 font-serif">
              A Safe Space
            </h3>
            <p className="text-xs text-secondary leading-relaxed">
              Your memories are encrypted, private, and belong solely to you and
              your heirloom. Nothing is ever used to train public models.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
