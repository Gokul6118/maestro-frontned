import type { TodoForm } from "@repo/schemas";
import { create } from "zustand";

/* ================= TYPES ================= */

export interface Todo {
	description: string;
	endAt: string;
	id: number;
	startAt: string;
	status: "todo" | "backlog" | "inprogress" | "done" | "cancelled";
	text: string;
}

type ConfirmPayload = TodoForm | number | null;

export interface UIStore {
	activeTodo: Todo | null;
	clearEditTodo: () => void;

	closeConfirm: () => void;
	closeDesc: () => void;
	closeSheet: () => void;

	confirm: {
		open: boolean;
		action: "add" | "edit" | "delete" | null;
		payload: ConfirmPayload;
	};

	descOpen: boolean;
	editTodo: Todo | null;

	expandedId: number | null;

	openConfirm: (
		action: "add" | "edit" | "delete",
		payload?: ConfirmPayload
	) => void;

	openDesc: (todo: Todo) => void;
	openSheet: () => void;
	setEditTodo: (todo: Todo) => void;
	setExpandedId: (id: number | null) => void;
	sheetOpen: boolean;
}

/* ================= STORE ================= */

export const useUIStore = create<UIStore>((set) => ({
	sheetOpen: false,

	openSheet: () => set({ sheetOpen: true }),

	closeSheet: () => set({ sheetOpen: false }),

	editTodo: null,

	setEditTodo: (todo) =>
		set({
			editTodo: { ...todo },
			sheetOpen: true,
		}),

	clearEditTodo: () =>
		set({
			editTodo: null,
			sheetOpen: false,
		}),

	expandedId: null,

	setExpandedId: (id) => set({ expandedId: id }),

	confirm: {
		open: false,
		action: null,
		payload: null,
	},

	openConfirm: (action, payload = null) =>
		set({
			confirm: {
				open: true,
				action,
				payload,
			},
		}),

	closeConfirm: () =>
		set({
			confirm: {
				open: false,
				action: null,
				payload: null,
			},
		}),

	descOpen: false,

	activeTodo: null,

	openDesc: (todo) =>
		set({
			descOpen: true,
			activeTodo: todo,
		}),

	closeDesc: () =>
		set({
			descOpen: false,
			activeTodo: null,
		}),
}));
