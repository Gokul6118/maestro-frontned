import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthPage from "../app/page";

vi.mock("@repo/store", () => ({
	useAuthStore: () => ({
		mode: "login", // 👈 login
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

describe("AuthPage - Login mode", () => {
	it("shows only Email and Password (no Name)", () => {
		render(<AuthPage />);

		expect(screen.getByLabelText("Email")).toBeDefined();

		expect(screen.getByLabelText("Password")).toBeDefined();

		expect(screen.queryByLabelText("Name")).toBeNull();
	});
});
