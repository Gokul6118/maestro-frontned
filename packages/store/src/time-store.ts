import { create } from "zustand";

export interface TimeStore {
	closeAll: () => void;
	closeEndDate: () => void;
	closeEndTime: () => void;
	closeStartDate: () => void;
	closeStartTime: () => void;

	openEndDate: () => void;

	openEndTime: () => void;

	openStartDate: () => void;

	openStartTime: () => void;
	showEndDate: boolean;
	showEndTime: boolean;
	showStartDate: boolean;
	showStartTime: boolean;
}

export const useTimeStore = create<TimeStore>((set) => ({
	showStartDate: false,
	showStartTime: false,
	showEndDate: false,
	showEndTime: false,

	closeAll: () =>
		set({
			showStartDate: false,
			showStartTime: false,
			showEndDate: false,
			showEndTime: false,
		}),

	openStartDate: () =>
		set({
			showStartDate: true,
			showStartTime: false,
			showEndDate: false,
			showEndTime: false,
		}),

	closeStartDate: () => set({ showStartDate: false }),

	openStartTime: () =>
		set({
			showStartDate: false,
			showStartTime: true,
			showEndDate: false,
			showEndTime: false,
		}),

	closeStartTime: () => set({ showStartTime: false }),

	openEndDate: () =>
		set({
			showStartDate: false,
			showStartTime: false,
			showEndDate: true,
			showEndTime: false,
		}),

	closeEndDate: () => set({ showEndDate: false }),

	openEndTime: () =>
		set({
			showStartDate: false,
			showStartTime: false,
			showEndDate: false,
			showEndTime: true,
		}),

	closeEndTime: () => set({ showEndTime: false }),
}));
