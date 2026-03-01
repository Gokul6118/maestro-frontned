import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import ChartAreaInteractive from "./../../components/chart-area-interactive";
import { todoApi } from "../../lib/api-client";

interface Todo {
	description: string;
	endAt: string;
	id: number;
	startAt: string;
	status: "todo" | "backlog" | "inprogress" | "done" | "cancelled";
	text: string;
}

export default function Dashboard() {
	const { data, isLoading, error } = todoApi.useQuery("get", "/api");

	const todos: Todo[] = data ?? [];
	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ActivityIndicator size="large" />
				<Text className="mt-2 text-gray-600">Loading dashboard...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-white px-4">
				<Text className="text-center text-red-500">
					Failed to load dashboard
				</Text>
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white">
			<FlatList
				data={todos}
				keyExtractor={(item) => item.id.toString()}
				ListHeaderComponent={
					<>
						<Text className="mb-4 px-4 pt-3 font-bold text-2xl">Dashboard</Text>

						<View className="mb-4 px-4">
							<ChartAreaInteractive todos={todos} />
						</View>

						<Text className="mb-2 px-4 font-semibold text-lg">Tasks</Text>
					</>
				}
				renderItem={({ item }) => (
					<View className="mx-4 mb-3 rounded-xl bg-gray-100 p-4">
						<Text className="font-semibold text-base">{item.text}</Text>

						<Text className="mt-1 text-gray-600 text-sm">
							{item.description}
						</Text>

						<Text className="mt-2 font-medium text-indigo-600 text-xs">
							{item.status.toUpperCase()}
						</Text>
					</View>
				)}
				showsVerticalScrollIndicator={false}
			/>
		</SafeAreaView>
	);
}
