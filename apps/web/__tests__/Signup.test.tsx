import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthPage from "./../app/page";

vi.mock("@repo/store", () => ({
	useAuthStore: () => ({
		mode: "Signup",
		message: "",
		showpassword: false,

		togglePassword: vi.fn(),
		toggleMode: vi.fn(),
		setMessage: vi.fn(),
		clearMessage: vi.fn(),
	}),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		replace: vi.fn(),
	}),
}));

vi.mock("../lib/auth-client", () => ({
	authClient: {},
}));

describe("AuthPage text test", () => {
	it("contains Login text", () => {
		render(<AuthPage />);

		expect(screen.getAllByText("Create Account").length).toBeGreaterThan(0);
	});
});
