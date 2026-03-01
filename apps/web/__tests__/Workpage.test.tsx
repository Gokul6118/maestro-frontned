import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WorkPage from "../app/work/page";

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

vi.mock("@repo/store", () => ({
	useUIStore: () => ({
		expandedId: null,

		openConfirm: vi.fn(),
		closeConfirm: vi.fn(),
		confirm: {},

		editTodo: null,

		sheetOpen: true,
		openSheet: vi.fn(),
		closeSheet: vi.fn(),

		setEditTodo: vi.fn(),
		clearEditTodo: vi.fn(),

		descOpen: false,
		activeTodo: null,
		openDesc: vi.fn(),
		closeDesc: vi.fn(),
	}),
}));

vi.mock("../../lib/auth-client", () => ({
	authClient: {
		signOut: vi.fn(),
	},
}));

vi.mock("@tanstack/react-query", () => ({
	useMutation: () => ({
		mutate: vi.fn(),
	}),
	useQueryClient: () => ({
		invalidateQueries: vi.fn(),
	}),
}));

vi.mock("@/lib/api-client", () => ({
	todoApi: {
		useQuery: () => ({
			data: [],
			isLoading: false,
			error: null,
		}),

		useMutation: () => ({
			mutate: vi.fn(),
		}),
	},
}));

/* ---------------- TEST ---------------- */

describe("WorkPage - Add Todo Form", () => {
	it("shows all fields in Add Todo form", () => {
		render(<WorkPage />);

		fireEvent.click(screen.getByRole("button", { name: "Add Todo" }));

		expect(screen.getByPlaceholderText("Enter title")).toBeDefined();

		expect(screen.getByPlaceholderText("Enter description")).toBeDefined();

		expect(screen.getByText("Status")).toBeDefined();

		expect(screen.getByText("Start Date")).toBeDefined();

		expect(screen.getByText("Start Time")).toBeDefined();

		expect(screen.getByText("End Date")).toBeDefined();

		expect(screen.getByText("End Time")).toBeDefined();

		expect(screen.getByRole("button", { name: /add todo/i })).toBeDefined();
	});
});
