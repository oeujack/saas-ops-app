import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  orgId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}

export interface AuthOrg {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'growth' | 'enterprise';
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  org: AuthOrg | null;
  setAuth: (token: string, user: AuthUser, org: AuthOrg) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      org: null,
      setAuth: (token, user, org) => set({ token, user, org }),
      logout: () => set({ token: null, user: null, org: null }),
    }),
    { name: 'saas-ops-auth' },
  ),
);
