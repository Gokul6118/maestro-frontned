import { create } from "zustand";

export interface ChartStore {
	setTimeRange: (range: string) => void;
	timeRange: string;
}

export const useChartStore = create<ChartStore>((set) => ({
	timeRange: "90d",
	setTimeRange: (range) => set({ timeRange: range }),
}));
