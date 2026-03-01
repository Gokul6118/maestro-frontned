import { create } from "zustand";

type Mode = "login" | "signup";

export interface AuthStore {
	clearMessage: () => void;
	message: string;
	mode: Mode;
	setMessage: (msg: string) => void;
	setMode: (mode: Mode) => void;
	setshowPassword: (show: boolean) => void;
	showpassword: boolean;
	toggleMode: () => void;
	togglePassword: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	mode: "login",
	message: "",
	showpassword: false,
	setshowPassword: (show) => set({ showpassword: show }),
	togglePassword: () => set((state) => ({ showpassword: !state.showpassword })),

	setMode: (mode) => set({ mode }),

	setMessage: (message) => set({ message }),

	toggleMode: () =>
		set((state) => ({
			mode: state.mode === "login" ? "signup" : "login",
			message: "",
		})),

	clearMessage: () => set({ message: "" }),
}));
