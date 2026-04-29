"use client";

interface UnsavedModalProps {
  isOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export default function UnsavedModal({
  isOpen,
  onSave,
  onDiscard,
}: UnsavedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-base shadow-2xl rounded-2xl p-6 w-full max-w-xs border border-subtle flex flex-col items-center text-center animate-scale-up">
        <div className="mb-4 text-rose opacity-80">
          <span
            className="material-symbols-outlined text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_stories
          </span>
        </div>

        <h2 className="font-serif text-xl text-primary mb-3">Leaving so soon?</h2>

        <p className="text-sm text-secondary mb-6 text-balance px-2">
          You have unsaved memories here. Would you like to save them before you
          go?
        </p>

        <div className="flex w-full gap-3">
          <button
            onClick={onDiscard}
            className="flex-1 py-3 rounded-full font-semibold border border-subtle text-secondary hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors btn-press"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 rounded-full font-bold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 transition-colors btn-press"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
