import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../global.css";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);
const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(tabs)" />
				</Stack>
			</QueryClientProvider>
		</SafeAreaProvider>
	);
}
