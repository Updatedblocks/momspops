// ── Cognitive Types — Moms&Pops Soul Distillation Schema v1.0 ──
// Mirrors the 40-point soul.json JSON Schema for strict DB ↔ TS alignment.

// ═══════════════════════════════════════════════════════════════
// SYNTACTIC ARCHITECTURE
// ═══════════════════════════════════════════════════════════════
export interface SyntacticArchitecture {
  /** Mean word count per sentence. */
  average_sentence_length: number;
  /** Frequency of punctuation relative to word count. Range: 0–1. */
  punctuation_density_index: number;
  /** Frequency of typos (impulsivity/speed vs. meticulousness). Range: 0–1. */
  typographical_error_rate: number;
  /** Adherence to formal capitalization rules. Range: 0–1. */
  capitalization_compliance: number;
  /** Frequency of '...' indicating trailing thoughts, hesitation, or passive aggression. Range: 0–1. */
  ellipsis_dependency: number;
  /** Reliance on emojis for emotional load-bearing. Range: 0–1. */
  emoji_to_text_ratio: number;
  /** Inquisitiveness vs. declarative communication style. */
  question_to_statement_ratio: number;
  /** Estimated words per minute during uninterrupted audio/voicemail blocks. */
  monologue_endurance_wpm: number;
}

// ═══════════════════════════════════════════════════════════════
// LEXICAL FINGERPRINT
// ═══════════════════════════════════════════════════════════════
export interface LexicalFingerprint {
  /** Unique words divided by total words. Range: 0–1. */
  lexical_diversity_score: number;
  /** Top recurring proprietary phrases, idioms, or colloquialisms. Max 10. */
  primary_idioms: string[];
  /** Key-value pair of filler words and their frequency index. */
  filler_word_matrix: Record<string, number>;
  /** Willingness to utilize taboo language. Range: 0–1. */
  profanity_index: number;
  /** Typical conversation initiators. */
  greeting_taxonomy: string[];
  /** Typical conversation terminators. */
  sign_off_taxonomy: string[];
  /** Degree of linguistic shift based on topic gravity. Range: 0–1. */
  formality_variance: number;
}

// ═══════════════════════════════════════════════════════════════
// EMOTIONAL TOPOGRAPHY
// ═══════════════════════════════════════════════════════════════
export type HumorMechanism =
  | "sarcasm"
  | "self_deprecation"
  | "puns"
  | "observational"
  | "absurdist"
  | "cynical"
  | "slapstick";

export interface EmotionalTopography {
  /** Default state: deeply pessimistic (-1) to aggressively optimistic (1). */
  emotional_baseline_valence: number;
  /** Speed and frequency of mood shifts within a single conversation. Range: 0–1. */
  emotional_volatility_index: number;
  /** Primary modes of humor employed. */
  humor_mechanisms: HumorMechanism[];
  /** Specific topics, years, or people that consistently induce past-focused sentiment. */
  nostalgia_triggers: string[];
  /** Lexical indicators or topics that signal stress or cognitive overload. */
  anxiety_markers: string[];
  /** Willingness to articulate deep, unshielded personal emotions. Range: 0–1. */
  vulnerability_threshold: number;
  /** Frequency of discussing future plans vs. past memories or present states. Range: 0–1. */
  future_orientation_index: number;
  /** Broad abstract strokes (0) vs. hyper-specific sensory details (1). Range: 0–1. */
  detail_granularity: number;
}

// ═══════════════════════════════════════════════════════════════
// RELATIONAL DYNAMICS
// ═══════════════════════════════════════════════════════════════
export type ConflictResolutionStyle =
  | "avoidant"
  | "confrontational"
  | "appeasing"
  | "analytical"
  | "humorous_deflection";

export type AffectionDeliveryMechanism =
  | "words_of_affirmation"
  | "teasing/banter"
  | "practical_advice"
  | "gifts/media_sharing"
  | "unprompted_check_ins";

export interface RelationalDynamics {
  /** Default algorithm for handling interpersonal friction. */
  conflict_resolution_style: ConflictResolutionStyle;
  /** Propensity to start conversations vs. passively waiting. Range: 0–1. */
  initiation_vs_response_ratio: number;
  /** How they show agreement or validation (e.g., 'Exactly!', 'Mm-hmm'). */
  affirmation_delivery_style: string;
  /** How they object (e.g., 'Yes, but...', 'I disagree', passive silence). */
  disagreement_framing: string;
  /** How love/care is primarily communicated digitally. */
  affection_delivery_mechanism: AffectionDeliveryMechanism;
  /** Propensity to offer unsolicited solutions. Range: 0–1. */
  advice_giving_tendency: number;
  /** Tendency to answer questions with tangential personal stories. Range: 0–1. */
  anecdote_reliance: number;
  /** Frequency of mirroring emotional language in response to distress. Range: 0–1. */
  empathy_quotient: number;
  /** Core subjects they repeatedly steer conversations toward. */
  topic_fixations: string[];
  /** Specific phrases or punctuation used when withholding anger. */
  passive_aggressive_markers: string[];
  /** Average simulated delay before replying (ms), based on WhatsApp timestamps. */
  simulated_response_latency: number;
}

// ═══════════════════════════════════════════════════════════════
// ROOT SOUL PROFILE
// ═══════════════════════════════════════════════════════════════
export interface SoulProfile {
  syntactic_architecture: SyntacticArchitecture;
  lexical_fingerprint: LexicalFingerprint;
  emotional_topography: EmotionalTopography;
  relational_dynamics: RelationalDynamics;
}

// ═══════════════════════════════════════════════════════════════
// DB ENTITIES
// ═══════════════════════════════════════════════════════════════

/** Short-Term RAM — rolling conversation window per persona. */
export interface ChatLog {
  id: string;
  persona_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

/** Long-Term Archive — durable compressed memories. */
export interface MemoryNode {
  id: string;
  persona_id: string;
  user_id: string;
  summary: string;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════
// API / MOCK CHAT TYPES
// ═══════════════════════════════════════════════════════════════

export interface Message {
  id: string;
  sender: "user" | "persona";
  content: string;
  timestamp: string;
}

export interface Persona {
  id: string;
  name: string;
  relation: string;
  tone: string;
}

export interface SoulState {
  persona: Persona;
  core_memories: string[];
  recent_context: Message[];
}
