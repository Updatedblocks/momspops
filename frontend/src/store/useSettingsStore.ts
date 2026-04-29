import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SoulProfile } from "@/types/soul";

export type TextSize = "small" | "base" | "large";
export type ShaderStrength = "off" | "subtle" | "warm" | "vivid";

// ── Persona ────────────────────────────────────────
export interface PersonaData {
  id: string;
  name: string;
  relation: string;
  tone: string;
  soul_profile?: SoulProfile;
  status: string;
}

// ── Auth User ─────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  isAuthenticated: boolean;
}

// ── User Profile ──────────────────────────────────
export interface ProfileData {
  fullName: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  echo_balance: number;
  tier: string;
}

// ── Store ─────────────────────────────────────────
interface SettingsState {
  // Auth
  user: AuthUser;
  // Appearance
  textSize: TextSize;
  shaderStrength: ShaderStrength;
  // Notifications
  spontaneousMsgs: boolean;
  messagePreviews: boolean;
  dndEnabled: boolean;
  dndStart: string;
  dndEnd: string;
  reminders: boolean;
  // Profile
  profile: ProfileData;
  // Personas
  personas: PersonaData[];
}

interface SettingsActions {
  // Auth
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
  // Appearance
  setTextSize: (size: TextSize) => void;
  setShaderStrength: (strength: ShaderStrength) => void;
  // Notifications
  setSpontaneousMsgs: (on: boolean) => void;
  setMessagePreviews: (on: boolean) => void;
  setDndEnabled: (on: boolean) => void;
  setDndStart: (time: string) => void;
  setDndEnd: (time: string) => void;
  setReminders: (on: boolean) => void;
  // Profile
  setProfile: (profile: ProfileData) => void;
  // Personas
  setPersonas: (personas: PersonaData[]) => void;
  updatePersona: (id: string, data: Partial<PersonaData>) => void;
}

const defaultUser: AuthUser = {
  id: "",
  email: "",
  isAuthenticated: false,
};

const defaultProfile: ProfileData = {
  fullName: "Eleanor Vance",
  displayName: "Eleanor",
  email: "eleanor.v@example.com",
  avatarUrl: "",
  bio: "Collector of quiet moments and old books.",
  echo_balance: 50,
  tier: "echoes",
};

const defaultPersonas: PersonaData[] = [
  { id: "mom", name: "Mom", relation: "Mother", tone: "warm, caring", status: "draft" },
  { id: "dad", name: "Dad", relation: "Father", tone: "steady, wise", status: "draft" },
  { id: "grandpa", name: "Grandpa", relation: "Grandfather", tone: "playful, nostalgic", status: "draft" },
];

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      // Auth
      user: defaultUser,
      // Appearance
      textSize: "base",
      shaderStrength: "subtle" as ShaderStrength,
      // Notifications
      spontaneousMsgs: false,
      messagePreviews: true,
      dndEnabled: false,
      dndStart: "22:00",
      dndEnd: "08:00",
      reminders: false,
      // Profile
      profile: defaultProfile,
      // Personas
      personas: defaultPersonas,

      // ── Actions ──────────────────────────────
      // Auth
      setUser: (user) => set({ user }),
      clearAuth: () =>
        set({
          user: defaultUser,
          personas: defaultPersonas,
          profile: defaultProfile,
        }),
      // Appearance
      setTextSize: (textSize) => set({ textSize }),
      setShaderStrength: (shaderStrength) => set({ shaderStrength }),
      setSpontaneousMsgs: (spontaneousMsgs) => set({ spontaneousMsgs }),
      setMessagePreviews: (messagePreviews) => set({ messagePreviews }),
      setDndEnabled: (dndEnabled) => set({ dndEnabled }),
      setDndStart: (dndStart) => set({ dndStart }),
      setDndEnd: (dndEnd) => set({ dndEnd }),
      setReminders: (reminders) => set({ reminders }),
      setProfile: (profile) => set({ profile }),
      setPersonas: (personas) => set({ personas }),
      updatePersona: (id, data) =>
        set((s) => ({
          personas: s.personas.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),
    }),
    { name: "momspops-settings", partialize: (state) => {
      const { user: _user, ...rest } = state;
      return rest;
    } }
  )
);
