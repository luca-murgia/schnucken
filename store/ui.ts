import { create } from "zustand";

// Client-only UI state (Zustand). Server data stays in RSC/Prisma — this store
// is strictly for ephemeral interface state such as the mobile nav and the
// cookie-consent choice.
export type ConsentState = "unknown" | "accepted" | "rejected";

interface UIState {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;

  consent: ConsentState;
  setConsent: (consent: ConsentState) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),

  consent: "unknown",
  setConsent: (consent) => set({ consent }),
}));
