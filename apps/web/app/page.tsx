"use client";

import { useAuthStore } from "@repo/store";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "./../lib/auth-client";

interface FormData {
	email: string;
	name?: string;
	password: string;
}

export default function AuthPage() {
	const router = useRouter();

	const {
		mode,
		message,
		setMessage,
		togglePassword,
		showpassword,
		toggleMode,
		clearMessage,
	} = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FormData>();

	async function onSubmit(data: FormData) {
		clearMessage();

		try {
			if (mode === "login") {
				const res = await authClient.signIn.email({
					email: data.email,
					password: data.password,
				});

				if (res?.error) {
					setMessage(res.error.message || "Login failed");
					return;
				}

				await new Promise((resolve) => setTimeout(resolve, 300));

				const session = await authClient.getSession();

				if (!session?.data?.user) {
					setMessage("Session not created. Please try again.");
					return;
				}

				router.replace("/work");
				return;
			}

			const res = await authClient.signUp.email({
				name: data.name!,
				email: data.email,
				password: data.password,
			});

			if (res?.error) {
				setMessage(res.error.message || "Signup failed");
				return;
			}

			setMessage("Signup successful. Please login.");

			setTimeout(() => {
				toggleMode();
				reset();
			}, 1500); // show message for 1.5s
		} catch (err: unknown) {
			console.error("AUTH ERROR:", err);

			if (err instanceof Error) {
				setMessage(err.message);
			} else {
				setMessage("Authentication failed");
			}
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="font-bold text-2xl">
						{mode === "login" ? "Login" : "Create Account"}
					</CardTitle>

					<CardDescription>
						{mode === "login"
							? "Enter your credentials to access your account"
							: "Fill in details to create a new account"}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
						{mode === "signup" && (
							<div className="space-y-1">
								<Label htmlFor="name">Name</Label>

								<Input
									id="name"
									placeholder="Your name"
									{...register("name", {
										required: "Name required",
									})}
								/>

								{errors.name && (
									<p className="text-destructive text-sm">
										{errors.name.message}
									</p>
								)}
							</div>
						)}

						{/* ✅ EMAIL */}
						<div className="space-y-1">
							<Label htmlFor="email">Email</Label>

							<Input
								id="email"
								placeholder="you@example.com"
								type="email"
								{...register("email", {
									required: "Email required",
								})}
							/>

							{errors.email && (
								<p className="text-destructive text-sm">
									{errors.email.message}
								</p>
							)}
						</div>

						<div className="space-y-1">
							<Label htmlFor="password">Password</Label>

							<Input
								id="password"
								placeholder="••••••••"
								type={showpassword ? "text" : "password"}
								{...register("password", {
									required: "Password required",
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters",
									},
								})}
							/>

							<button
								className="mt-1 text-blue-500 text-sm"
								onClick={togglePassword}
								type="button"
							>
								{showpassword ? "Hide" : "Show"}
							</button>

							{errors.password && (
								<p className="text-destructive text-sm">
									{errors.password.message}
								</p>
							)}
						</div>

						{message && (
							<p className="text-center text-destructive text-sm">{message}</p>
						)}
						<Button className="w-full" disabled={isSubmitting} type="submit">
							{isSubmitting
								? "Loading..."
								: mode === "login"
									? "Login"
									: "Sign Up"}
						</Button>
					</form>

					<div className="mt-4 text-center text-sm">
						<button
							className="text-primary underline-offset-4 hover:underline"
							onClick={() => {
								toggleMode();
								reset();
								clearMessage();
							}}
							type="button"
						>
							{mode === "login"
								? "Don't have an account? Sign up"
								: "Already have an account? Login"}
						</button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
