import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Role, User } from "../types/auth";

export interface AuthState {
  role: Role | null;
  user: User | null;
  setRole: (role: Role | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      setRole: (role) => set({ role }),
      setUser: (user) => set({ user, role: user?.role || null }),
      logout: () => set({ user: null, role: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
      }),
    }
  )
);
