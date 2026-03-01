import { create } from "zustand";

export interface Stats {
	totalUsers: number;
}

export interface AdminState {
	isAdmin: boolean;
	loading: boolean;
	reset: () => void;
	setIsAdmin: (v: boolean) => void;

	setLoading: (v: boolean) => void;
	setStats: (s: Stats | null) => void;
	stats: Stats | null;
}

export const useAdminStore = create<AdminState>((set) => ({
	loading: true,
	isAdmin: false,
	stats: null,

	setLoading: (v) => set({ loading: v }),
	setIsAdmin: (v) => set({ isAdmin: v }),
	setStats: (s) => set({ stats: s }),

	reset: () =>
		set({
			loading: true,
			isAdmin: false,
			stats: null,
		}),
}));
