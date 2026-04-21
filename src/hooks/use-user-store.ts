import { create } from "zustand";

interface UserState {
  name: string | null;
  avatar: string | null;
  email: string | null;
  setUser: (user: {
    name?: string | null;
    avatar?: string | null;
    email?: string | null;
  }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: null,
  avatar: null,
  email: null,
  setUser: (user) =>
    set((state) => ({
      name: user.name !== undefined ? user.name : state.name,
      avatar: user.avatar !== undefined ? user.avatar : state.avatar,
      email: user.email !== undefined ? user.email : state.email,
    })),
}));
