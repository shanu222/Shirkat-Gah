import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  savedFilters: Record<string, unknown>;
  setSavedFilter: (module: string, filters: unknown) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      savedFilters: {},
      setSavedFilter: (module, filters) =>
        set((s) => ({ savedFilters: { ...s.savedFilters, [module]: filters } })),
    }),
    { name: 'shirkat-ui' },
  ),
);

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
}));
