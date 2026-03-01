import { create } from "zustand";

export interface RowData {
	header: string;
	id: number;
	limit: string;
	status: string;
	target: string;
	type: string;
}

export interface TableStore {
	data: RowData[];
	setData: (data: RowData[]) => void;
}

export const useTableStore = create<TableStore>((set) => ({
	data: [],
	setData: (data) => set({ data }),
}));
