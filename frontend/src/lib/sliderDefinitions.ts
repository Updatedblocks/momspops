// Complete Soul Spectrum Slider definitions
// 3 Core Dials (always present) + Quirk Pool (randomly pick 2)

export interface SpectrumDial {
  id: string;
  label: string;
  field: string;
  leftAnchor: string;
  rightAnchor: string;
  feedback: Record<number, string>; // key = approximate %, value = dynamic text
  isQuirk?: boolean;
}

// ── 3 CORE DIALS (Always Present) ────────────────────────

export const CORE_DIALS: SpectrumDial[] = [
  {
    id: "outlook",
    label: "The Outlook Spectrum",
    field: "outlook",
    leftAnchor: "The Cynic / Realist",
    rightAnchor: "The Eternal Optimist",
    feedback: {
      10: "Expects the worst, usually right.",
      50: "Balanced and grounded.",
      90: "Finds the silver lining in a hurricane.",
    },
  },
  {
    id: "empathy",
    label: "The Empathy Spectrum",
    field: "affection",
    leftAnchor: "Tough Love / Stoic",
    rightAnchor: "Bleeding Heart / Nurturer",
    feedback: {
      10: '"Rub some dirt on it."',
      50: "Supportive, but practical.",
      90: "Cries when you cry.",
    },
  },
  {
    id: "formality",
    label: "The Formality Spectrum",
    field: "formality",
    leftAnchor: "Chaotic / Unfiltered",
    rightAnchor: "Proper / Buttoned-Up",
    feedback: {
      10: "All lowercase, typos, zero punctuation.",
      50: "Casual but readable.",
      90: "Uses periods at the end of texts. Terrifying.",
    },
  },
];

// ── 8 QUIRK DIALS (2 randomly selected per session) ──────

export const QUIRK_POOL: SpectrumDial[] = [
  {
    id: "chat_frequency",
    label: "The Chat Frequency",
    field: "advice", // reused field, will be mapped in quirk context
    leftAnchor: "The Quiet Observer",
    rightAnchor: "The Double-Texter",
    feedback: {
      10: "Takes 3 business days to reply.",
      50: "A steady, equal conversationalist.",
      90: "Sends 5 rapid-fire texts before you even wake up.",
    },
    isQuirk: true,
  },
  {
    id: "problem_solver",
    label: "The Problem-Solver",
    field: "advice",
    leftAnchor: "The Venting Vault",
    rightAnchor: "The Fixer",
    feedback: {
      10: 'Just sits there and says "That sucks."',
      50: "Asks if you want advice or just to vent.",
      90: "Already mapped out a 5-step plan to fix your life.",
    },
    isQuirk: true,
  },
  {
    id: "storyteller",
    label: "The Storyteller",
    field: "vulnerability",
    leftAnchor: "Facts Only",
    rightAnchor: "Life is a Movie",
    feedback: {
      10: "Gets straight to the point.",
      50: "Occasionally reminisces.",
      90: "Turns a grocery trip into a 20-minute saga.",
    },
    isQuirk: true,
  },
  {
    id: "focus",
    label: "The Focus",
    field: "vulnerability",
    leftAnchor: "Big Picture",
    rightAnchor: "Detail Obsessed",
    feedback: {
      10: '"Just tell me the end."',
      50: "Standard memory.",
      90: "Remembers the exact color of the car from 10 years ago.",
    },
    isQuirk: true,
  },
  {
    id: "timeline",
    label: "The Timeline",
    field: "vulnerability",
    leftAnchor: "Living in the Past",
    rightAnchor: "Future Focused",
    feedback: {
      10: '"Back in my day..."',
      50: "Present in the moment.",
      90: '"What\'s the 5-year plan?"',
    },
    isQuirk: true,
  },
  {
    id: "guard",
    label: "The Guard",
    field: "vulnerability",
    leftAnchor: "Fort Knox",
    rightAnchor: "Open Book",
    feedback: {
      10: "Deflects deep questions with humor.",
      50: "Opens up eventually.",
      90: "Will tell a stranger their deepest traumas.",
    },
    isQuirk: true,
  },
  {
    id: "volatility",
    label: "The Volatility",
    field: "vulnerability",
    leftAnchor: "The Steady Rock",
    rightAnchor: "The Rollercoaster",
    feedback: {
      10: "Unfazed by literal explosions.",
      50: "Normal human reactions.",
      90: "Mood changes 4 times in a single hour.",
    },
    isQuirk: true,
  },
  {
    id: "conflict",
    label: "The Conflict Style",
    field: "vulnerability",
    leftAnchor: "The Peacemaker",
    rightAnchor: "The Challenger",
    feedback: {
      10: '"Whatever you want."',
      50: "Talks it out logically.",
      90: '"Let\'s argue about this right now."',
    },
    isQuirk: true,
  },
];

// ── Helper: pick 2 random quirks ─────────────────────────

export function pickQuirkDials(): SpectrumDial[] {
  const shuffled = [...QUIRK_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

// ── Helper: get feedback text for a value ────────────────

export function getFeedbackText(dial: SpectrumDial, value: number): string {
  const keys = Object.keys(dial.feedback)
    .map(Number)
    .sort((a, b) => a - b);
  let closest = keys[0];
  for (const k of keys) {
    if (Math.abs(value - k) < Math.abs(value - closest)) closest = k;
  }
  return dial.feedback[closest] || "";
}
