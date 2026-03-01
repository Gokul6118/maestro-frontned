import { zodResolver } from "@hookform/resolvers/zod";
import { type AuthType, authSchema } from "@repo/schemas";
import { useAuthStore } from "@repo/store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { useSession } from "../hooks/useSession";
import { authClient } from "../lib/auth-client";

export default function AuthScreen() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useSession();

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
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AuthType>({
		resolver: zodResolver(authSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (!isLoading && user) {
			router.replace("/work");
		}
	}, [user, isLoading]);

	useEffect(() => {
		reset({
			email: "",
			password: "",
			name: undefined,
		});
	}, [mode]);

	async function onSubmit(data: AuthType) {
		clearMessage();

		if (mode === "signup" && !data.name) {
			setMessage("Name is required");
			return;
		}

		try {
			if (mode === "login") {
				const res = await authClient.signIn.email({
					email: data.email,
					password: data.password,
				});

				if (!res || res.error || !res.data?.user) {
					setMessage("Invalid email or password");
					return;
				}

				await queryClient.invalidateQueries({
					queryKey: ["session"],
				});

				router.replace("/work");
				return;
			}

			const res = await authClient.signUp.email({
				name: data.name!,
				email: data.email,
				password: data.password,
			});

			if (!res || res.error) {
				setMessage(res?.error?.message || "Signup failed");
				return;
			}

			toggleMode();
			reset();
			setMessage("Signup successful. Please login.");
		} catch (err: any) {
			setMessage(err?.message || "Authentication failed");
		}
	}
	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={40}
			style={{ flex: 1 }}
		>
			<ScrollView
				contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
				keyboardShouldPersistTaps="handled"
			>
				<View className="flex-1 justify-center bg-gray-100 px-5">
					<View className="rounded-xl bg-white p-6 shadow-md">
						<Text className="text-center font-bold text-2xl">
							{mode === "login" ? "Login" : "Create Account"}
						</Text>

						<Text className="mb-5 text-center text-gray-500">
							{mode === "login"
								? "Enter your credentials"
								: "Create your account"}
						</Text>

						{mode === "signup" && (
							<>
								<Text className="mt-3 font-semibold">Name</Text>

								<Controller
									control={control}
									name="name"
									render={({ field }) => (
										<TextInput
											className="mt-1 rounded-lg border border-gray-300 p-3"
											onChangeText={field.onChange}
											placeholder="Your name"
											value={field.value || ""}
										/>
									)}
								/>

								{errors.name && (
									<Text className="mt-1 text-red-500 text-xs">
										{errors.name.message}
									</Text>
								)}
							</>
						)}

						<Text className="mt-3 font-semibold">Email</Text>

						<Controller
							control={control}
							name="email"
							render={({ field }) => (
								<TextInput
									autoCapitalize="none"
									className="mt-1 rounded-lg border border-gray-300 p-3"
									keyboardType="email-address"
									onChangeText={field.onChange}
									placeholder="you@example.com"
									testID="email"
									value={field.value}
								/>
							)}
						/>

						{errors.email && (
							<Text className="mt-1 text-red-500 text-xs">
								{errors.email.message}
							</Text>
						)}

						<Text className="mt-3 font-semibold">Password</Text>

						<Controller
							control={control}
							name="password"
							render={({ field }) => (
								<TextInput
									className="mt-1 rounded-lg border border-gray-300 p-3"
									onChangeText={field.onChange}
									placeholder="••••••••"
									secureTextEntry={!showpassword}
									testID="password"
									value={field.value}
								/>
							)}
						/>

						<TouchableOpacity onPress={togglePassword}>
							<Text className="mt-1 text-black text-xs">
								{showpassword ? "Hide" : "Show"} Password
							</Text>
						</TouchableOpacity>

						{errors.password && (
							<Text className="mt-1 text-red-500 text-xs">
								{errors.password.message}
							</Text>
						)}

						{message && (
							<Text className="mt-2 text-center text-red-500">{message}</Text>
						)}

						<TouchableOpacity
							className="mt-5 items-center rounded-lg bg-black py-3"
							disabled={isSubmitting}
							onPress={handleSubmit(onSubmit)}
							testID="login-btn"
						>
							{isSubmitting ? (
								<ActivityIndicator color="#fff" />
							) : (
								<Text className="font-semibold text-white">
									{mode === "login" ? "Login" : "Sign Up"}
								</Text>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								toggleMode();
								reset();
								clearMessage();
							}}
						>
							<Text className="mt-4 text-center text-blue-600">
								{mode === "login"
									? "Don't have an account? Sign up"
									: "Already have an account? Login"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
