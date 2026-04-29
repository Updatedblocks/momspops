"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useSettingsStore } from "@/store/useSettingsStore";

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
  const avatarUrl = useSettingsStore((s) => s.profile.avatarUrl);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDistill = () => {
    // TODO: Wire to Supabase upload + Gemini distillation pipeline
    alert(
      `Ready to distill ${files.length} file${files.length !== 1 ? "s" : ""}. This will be wired to the Gemini pipeline.`
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FDFBF7]">
      {/* Top bar */}
      <header className="bg-[#FAF9F6]/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm shadow-black/5 w-full">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <h1 className="text-2xl font-serif font-bold text-[#2C2C2C] tracking-tight not-italic">
            The Heirloom
          </h1>
          <Link
            href="/settings/profile"
            className="absolute right-4 w-8 h-8 rounded-full overflow-hidden border border-stone-200 btn-press"
          >
            {avatarUrl ? (
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src={avatarUrl}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-stone-500 text-base bg-[#FDFBF7]">
                person
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-6 pt-8 pb-32 flex flex-col gap-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2C2C2C] tracking-tight mb-3">
            Share their words
          </h1>
          <p className="text-sm sm:text-base text-stone-500 leading-relaxed max-w-md mx-auto">
            Gently upload letters, photos, or voice notes. We&apos;ll
            thoughtfully distill them to capture the essence of their voice.
          </p>
        </div>

        {/* Progress steps */}
        <div className="relative flex flex-row justify-between w-full px-4">
          <div className="absolute top-5 left-[15%] right-[15%] border-t-2 border-dotted border-stone-200 -z-10" />
          {[
            { n: "1", label: "Gather Memories", active: true },
            { n: "2", label: "The Distillation", active: false },
            { n: "3", label: "Reconnect", active: false },
          ].map((step) => (
            <div key={step.n} className="flex flex-col items-center flex-1 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  step.active
                    ? "bg-[#E8DCC4] text-white"
                    : "bg-white text-stone-500 border border-stone-200"
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  {step.n}
                </span>
              </div>
              <span
                className={`text-center text-xs sm:text-sm mt-2 font-medium ${
                  step.active ? "text-[#2C2C2C]" : "text-stone-500"
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
          className={`w-full bg-white border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] relative overflow-hidden group animate-fade-in-up ${
            isDragging
              ? "border-[#C49A9A] bg-rose-50/30 shadow-[0_4px_20px_rgba(196,154,154,0.15)]"
              : "border-stone-200 hover:border-[#C49A9A]/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
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
          <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mb-5 text-[#C49A9A] group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-4xl">
              {isDragging ? "download" : "description"}
            </span>
          </div>
          <h2 className="text-lg font-serif text-[#2C2C2C] mb-2">
            {isDragging ? "Let them go..." : "Drop memories here"}
          </h2>
          <p className="text-sm text-stone-500 mb-4">
            Letters, photos, voice notes — anything that holds their voice
          </p>
          <span className="px-6 py-3 rounded-full font-bold bg-[#2C2C2C] text-[#FDFBF7] hover:opacity-90 transition-all btn-press text-sm">
            Browse Files
          </span>
          <p className="text-[10px] font-medium text-stone-400 mt-3">
            Supports PDF, DOCX, TXT, JPG, PNG, MP3, WAV
          </p>
        </div>

        {/* Selected files list */}
        {files.length > 0 && (
          <div className="space-y-2 animate-slide-down">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 ml-1 mb-3">
              Selected Memories ({files.length})
            </h3>
            {files.map((f, i) => (
              <div
                key={f.id}
                className="flex items-center gap-4 bg-white border border-stone-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Preview thumbnail or icon */}
                <div className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {f.preview ? (
                    <img
                      src={f.preview}
                      alt={f.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-stone-400 text-xl">
                      {fileIcon(f.file.type)}
                    </span>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2C2C2C] truncate">
                    {f.file.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {formatSize(f.file.size)}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.id);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-[#C49A9A] hover:bg-rose-50 transition-all duration-200 btn-press flex-shrink-0"
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
            disabled={files.length === 0}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 btn-press ${
              files.length > 0
                ? "bg-[#2C2C2C] text-[#FDFBF7] hover:shadow-lg hover:-translate-y-0.5"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {files.length > 0
              ? `Begin Distillation — ${files.length} file${files.length !== 1 ? "s" : ""}`
              : "Add memories to begin"}
          </button>
          <p className="text-xs text-stone-400 text-center max-w-xs">
            Your memories are encrypted, private, and never used to train public
            models.
          </p>
        </div>

        {/* Privacy reassurance */}
        <div className="bg-white border border-stone-100 rounded-2xl p-5 flex items-start gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] animate-fade-in-up stagger-4">
          <div className="text-[#C49A9A] mt-0.5 flex-shrink-0">
            <span className="material-symbols-outlined">lock</span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#2C2C2C] mb-1 font-serif">
              A Safe Space
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
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
