// Distillation Wizard — State Machine
// Blobs live in useRef (not state) to avoid re-render storms.
// Structured data lives in useReducer.

export interface QAPair {
  question: string;
  questionId: number;
  answer: string;
}

export interface IdentityPayload {
  name: string;
  relation: string;
  avatar_url: string | null;
}

export interface SliderMetrics {
  // Core dials
  outlook: number;       // emotional_baseline_valence  0-100
  affection: number;      // empathy_quotient            0-100
  formality: number;      // formality_variance          0-100
  // Quirk dials (only 2 active per session)
  quirk1_id: string | null;
  quirk1_value: number;
  quirk2_id: string | null;
  quirk2_value: number;
}

export type WizardStep = "identity" | "interview" | "sliders" | "voice" | "archives" | "review";

export interface DistillationState {
  step: WizardStep;
  identity: IdentityPayload;
  qa_calibration: QAPair[];
  slider_metrics: SliderMetrics;
}

export type DistillationAction =
  | { type: "SET_STEP"; step: WizardStep }
  | { type: "SET_IDENTITY"; payload: IdentityPayload }
  | { type: "ADD_QA"; payload: QAPair }
  | { type: "CLEAR_QA" }
  | { type: "SET_SLIDERS"; payload: Partial<SliderMetrics> }
  | { type: "RESET" };

export const DEFAULT_SLIDERS: SliderMetrics = {
  outlook: 50,
  affection: 50,
  formality: 50,
  quirk1_id: null,
  quirk1_value: 50,
  quirk2_id: null,
  quirk2_value: 50,
};

export const DEFAULT_IDENTITY: IdentityPayload = {
  name: "",
  relation: "",
  avatar_url: null,
};

export const STEP_ORDER: WizardStep[] = [
  "identity",
  "interview",
  "sliders",
  "voice",
  "archives",
  "review",
];

export const STEP_LABELS: Record<WizardStep, string> = {
  identity: "Who are they?",
  interview: "Tell us about them",
  sliders: "Fine-tune their soul",
  voice: "Share a memory",
  archives: "Upload their words",
  review: "Review & distill",
};

export function distillationReducer(
  state: DistillationState,
  action: DistillationAction
): DistillationState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };

    case "SET_IDENTITY":
      return { ...state, identity: action.payload };

    case "ADD_QA": {
      const existing = state.qa_calibration.filter(
        (q) => q.questionId !== action.payload.questionId
      );
      return { ...state, qa_calibration: [...existing, action.payload] };
    }

    case "CLEAR_QA":
      return { ...state, qa_calibration: [] };

    case "SET_SLIDERS":
      return { ...state, slider_metrics: { ...state.slider_metrics, ...action.payload } };

    case "RESET":
      return {
        step: "identity",
        identity: DEFAULT_IDENTITY,
        qa_calibration: [],
        slider_metrics: DEFAULT_SLIDERS,
      };

    default:
      return state;
  }
}

export function getInitialState(): DistillationState {
  return {
    step: "identity",
    identity: DEFAULT_IDENTITY,
    qa_calibration: [],
    slider_metrics: DEFAULT_SLIDERS,
  };
}

// Density calculator — called separately from component
export function calcDensity(
  state: DistillationState,
  hasVoice: boolean,
  hasArchives: boolean
): number {
  let d = 0;
  if (state.identity.name && state.identity.relation) d += 10;
  if (state.qa_calibration.length >= 5) d += 20;
  else if (state.qa_calibration.length > 0) d += Math.floor((state.qa_calibration.length / 5) * 20);
  const coreChanged =
    state.slider_metrics.outlook !== 50 ||
    state.slider_metrics.affection !== 50 ||
    state.slider_metrics.formality !== 50;
  const quirksSet = state.slider_metrics.quirk1_id !== null && state.slider_metrics.quirk2_id !== null;
  if (coreChanged && quirksSet) d += 10;
  else if (coreChanged || quirksSet) d += 5;
  if (hasVoice) d += 30;
  if (hasArchives) d += 29;
  return Math.min(99, d);
}
