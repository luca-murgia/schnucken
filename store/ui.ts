import { create } from "zustand";

// Client-only UI state (Zustand). Server data stays in RSC/Prisma — this store
// is strictly for ephemeral interface state such as the mobile nav.
interface UIState {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}));
