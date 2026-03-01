import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WorkPage from "../app/work/page";

/* ================= ROUTER ================= */
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

/* ================= AUTH ================= */
vi.mock("../../lib/auth-client", () => ({
	authClient: {
		signOut: vi.fn(),
	},
}));

/* ================= REACT QUERY ================= */
vi.mock("@tanstack/react-query", () => ({
	useMutation: () => ({
		mutate: vi.fn(),
	}),
	useQueryClient: () => ({
		invalidateQueries: vi.fn(),
	}),
}));

/* ================= STORE ================= */
vi.mock("@repo/store", () => ({
	useUIStore: () => ({
		expandedId: null,

		editTodo: null,
		sheetOpen: false,

		openConfirm: vi.fn(),
		closeConfirm: vi.fn(),
		confirm: {},

		descOpen: false,
		activeTodo: null,

		openDesc: vi.fn(),
		closeDesc: vi.fn(),

		openSheet: vi.fn(),
		closeSheet: vi.fn(),
		setEditTodo: vi.fn(),
		clearEditTodo: vi.fn(),
	}),
}));

/* ================= API ================= */
vi.mock("@/lib/api-client", () => ({
	todoApi: {
		useQuery: () => ({
			data: [
				{
					id: 1,
					text: "Test Task",
					description: "Test Desc",
					status: "todo",
					startAt: "2026-02-25T10:00:00.000Z",
					endAt: "2026-02-25T12:00:00.000Z",
				},
			],
			isLoading: false,
			error: null,
		}),

		useMutation: () => ({
			mutate: vi.fn(),
		}),
	},
}));

describe("Board UI", () => {
	it("shows all board columns and task", () => {
		render(<WorkPage />);

		/* Check column titles */

		expect(screen.getByText("todo")).toBeDefined();
		expect(screen.getByText("backlog")).toBeDefined();
		expect(screen.getByText("inprogress")).toBeDefined();
		expect(screen.getByText("done")).toBeDefined();
		expect(screen.getByText("cancelled")).toBeDefined();

		/* Check task is rendered */

		expect(screen.getByText("Test Task")).toBeDefined();
		expect(screen.getByText(/Test Desc/i)).toBeDefined();
	});
});
