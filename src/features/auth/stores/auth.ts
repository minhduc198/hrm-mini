import { create } from "zustand";
import { Role, User } from "../types/auth";

export interface AuthState {
  role: Role | null;
  user: User | null;
  setRole: (role: Role | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  user: null, 
  setRole: (role) => set({ role }),
  setUser: (user) => set({ user, role: user?.role || null }),
  logout: () => set({ user: null, role: null }),
}));
