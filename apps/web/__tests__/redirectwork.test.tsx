import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthPage from "../app/page";

/* ---------------- Router Mock ---------------- */

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: replaceMock,
	}),
}));

/* ---------------- Store Mock ---------------- */

vi.mock("@repo/store", () => ({
	useAuthStore: () => ({
		mode: "login",
		message: "",
		showpassword: false,

		togglePassword: vi.fn(),
		toggleMode: vi.fn(),
		setMessage: vi.fn(),
		clearMessage: vi.fn(),
	}),
}));

vi.mock("../lib/auth-client", () => {
	return {
		authClient: {
			signIn: {
				email: vi.fn(),
			},
			getSession: vi.fn(),
		},
	};
});

import { authClient } from "../lib/auth-client";

describe("AuthPage - Redirect after login", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("redirects to /work after successful login", async () => {
		vi.mocked(authClient.signIn.email).mockResolvedValue({ error: null });

		vi.mocked(authClient.getSession).mockResolvedValue({
			data: {
				user: { id: "1" },
			},
		});

		render(<AuthPage />);

		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "test@test.com" },
		});

		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByRole("button", { name: "Login" }));

		await waitFor(() => {
			expect(replaceMock).toHaveBeenCalledWith("/work");
		});
	});
});
