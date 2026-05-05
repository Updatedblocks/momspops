"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import UnsavedModal from "@/components/UnsavedModal";

export default function PersonaManagePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const personaId = params.id;
  const [mounted, setMounted] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [origName, setOrigName] = useState("");
  const [origRelation, setOrigRelation] = useState("");
  const [origAvatarUrl, setOrigAvatarUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch persona from Supabase ─────────────────────
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("personas")
        .select("name, relation, status, avatar_url")
        .eq("id", personaId)
        .single();

      if (data) {
        setName(data.name);
        setRelation(data.relation);
        setAvatarUrl(data.avatar_url || null);
        setOrigName(data.name);
        setOrigRelation(data.relation);
        setOrigAvatarUrl(data.avatar_url || null);
      }
      setLoading(false);
      setMounted(true);
    }
    if (personaId) load();
  }, [personaId]);

  const isDirty = name !== origName || relation !== origRelation || avatarUrl !== origAvatarUrl;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${personaId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("persona-avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      alert(`Upload failed: ${error.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("persona-avatars").getPublicUrl(path);
    setAvatarUrl(urlData.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    const supabase = createClient();
    await supabase
      .from("personas")
      .update({ name, relation, avatar_url: avatarUrl })
      .eq("id", personaId);

    router.back();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();

    try {
      // 1. Delete chat logs
      await supabase.from("chat_logs").delete().eq("persona_id", personaId);

      // 2. Delete avatar from storage
      const { data: files } = await supabase.storage
        .from("persona-avatars")
        .list(personaId, { limit: 10 });
      if (files?.length) {
        await supabase.storage
          .from("persona-avatars")
          .remove(files.map((f) => `${personaId}/${f.name}`));
      }

      // 3. Delete memory files from storage (staging + any uploads)
      const { data: memFiles } = await supabase.storage
        .from("memories")
        .list(personaId, { limit: 100 });
      if (memFiles?.length) {
        await supabase.storage
          .from("memories")
          .remove(memFiles.map((f) => `${personaId}/${f.name}`));
      }

      // 4. Delete the persona itself
      await supabase.from("personas").delete().eq("id", personaId);

      router.push("/library");
    } catch (err) {
      setDeleting(false);
      setShowDeleteConfirm(false);
      alert("Delete failed. Please try again.");
    }
  };

  const handleBack = () => {
    if (isDirty) setShowUnsaved(true);
    else router.back();
  };

  const handleDiscard = () => {
    setName(origName);
    setRelation(origRelation);
    setAvatarUrl(origAvatarUrl);
    setShowUnsaved(false);
    router.back();
  };

  if (!mounted || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-secondary text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-header sticky top-0 border-b border-subtle shadow-sm z-40">
        <div className="relative flex items-center justify-center w-full px-6 py-4">
          <button
            aria-label="Go back"
            onClick={handleBack}
            className="absolute left-4 hover:bg-stone-100 dark:hover:bg-stone-800 p-2 rounded-full transition-all duration-300 flex items-center justify-center btn-press"
          >
            <span className="material-symbols-outlined text-rose">arrow_back</span>
          </button>
          <h1 className="text-2xl font-serif font-bold text-primary tracking-tight not-italic">
            {name || "Persona"} Settings
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto p-6 flex flex-col gap-6 pb-32 animate-fade-in-up">
        {/* Avatar */}
        <section className="bg-surface rounded-3xl p-6 shadow-sm border border-subtle/60">
          <div className="flex flex-col items-center gap-4">
            <label className="text-xs font-bold uppercase tracking-widest text-secondary self-start">
              Avatar
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-full overflow-hidden border-2 border-subtle/60 shadow-sm cursor-pointer hover:border-rose/50 transition-all duration-300 flex items-center justify-center bg-muted relative group"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Persona avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-serif text-3xl text-primary/50">{name.charAt(0)}</span>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl">
                  {uploading ? "hourglass_top" : "photo_camera"}
                </span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <p className="text-xs text-secondary">
              {uploading ? "Uploading..." : "Tap to upload a photo"}
            </p>
          </div>
        </section>

        {/* Name */}
        <section className="bg-surface rounded-3xl p-6 shadow-sm border border-subtle/60">
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-bold uppercase tracking-widest text-secondary"
              htmlFor="persona-name"
            >
              Persona Name
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-subtle px-0 py-2 font-serif text-xl text-primary focus:ring-0 focus:border-rose transition-colors duration-300"
              id="persona-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </section>

        {/* Relationship */}
        <section className="bg-surface rounded-3xl p-6 shadow-sm border border-subtle/60">
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-bold uppercase tracking-widest text-secondary"
              htmlFor="persona-relation"
            >
              Relationship
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-subtle px-0 py-2 font-serif text-xl text-primary focus:ring-0 focus:border-rose transition-colors duration-300"
              id="persona-relation"
              type="text"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="Mother, Father, Grandfather..."
            />
          </div>
        </section>

        {/* Archive & Delete */}
        <section className="mt-8 flex flex-col items-center gap-4">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full max-w-sm py-4 px-6 rounded-full border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 flex items-center justify-center gap-2 group btn-press"
            >
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform duration-300">
                delete
              </span>
              <span className="font-medium text-sm">Archive &amp; Delete Persona</span>
            </button>
          ) : (
            <div className="w-full max-w-sm bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-600 text-2xl flex-shrink-0 mt-0.5">warning</span>
                <div>
                  <p className="font-bold text-red-700 dark:text-red-400 text-sm">Permanently delete {name || "this persona"}?</p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                    This will erase all chat history, memories, and the distilled soul. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-full font-medium text-sm border border-subtle text-secondary hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-full font-bold text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deleting ? "Deleting..." : "Yes, Delete Forever"}
                </button>
              </div>
            </div>
          )}
          <p className="text-xs text-secondary text-center max-w-sm leading-relaxed">
            All associated memory data will be permanently wiped from the servers.
          </p>
        </section>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={uploading}
          className="w-full py-3.5 rounded-full font-bold transition-all bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 disabled:opacity-50 btn-press"
        >
          Save Changes
        </button>
      </main>

      <UnsavedModal
        isOpen={showUnsaved}
        onSave={() => {
          setShowUnsaved(false);
          handleSave();
        }}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
