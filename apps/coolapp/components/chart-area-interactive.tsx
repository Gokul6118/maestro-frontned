import { useEffect, useMemo, useState } from "react";

import { Dimensions, Pressable, Text, View } from "react-native";

import { LineChart } from "react-native-chart-kit";

interface Todo {
	id: number;
	startAt: string;
	status: string;
	text: string;
}

const screenWidth = Dimensions.get("window").width;

export default function ChartAreaInteractiveMobile({
	todos,
}: {
	todos: Todo[];
}) {
	const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

	useEffect(() => {
		setTimeRange("7d");
	}, []);

	const chartData = useMemo(() => {
		const map: Record<string, number> = {};

		todos.forEach((todo) => {
			if (!todo.startAt) {
				return;
			}

			const d = new Date(todo.startAt);

			if (Number.isNaN(d.getTime())) {
				return;
			}

			const date = d.toISOString().split("T")[0];

			map[date] = (map[date] || 0) + 1;
		});

		return Object.entries(map)
			.map(([date, tasks]) => ({
				date,
				tasks,
			}))
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	}, [todos]);

	const filteredData = useMemo(() => {
		if (!chartData.length) {
			return [];
		}

		const today = new Date();

		let days = 90;

		if (timeRange === "30d") {
			days = 30;
		}
		if (timeRange === "7d") {
			days = 7;
		}

		const start = new Date();
		start.setDate(today.getDate() - days);

		return chartData.filter((item) => new Date(item.date) >= start);
	}, [chartData, timeRange]);

	const labels = filteredData.map((item) =>
		new Date(item.date).toLocaleDateString("en-IN", {
			month: "short",
			day: "numeric",
		})
	);

	const values = filteredData.map((item) => item.tasks);

	return (
		<View className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			{/* Header */}
			<View className="mb-3">
				<Text className="font-semibold text-lg">Total Tasks</Text>

				<Text className="mt-1 text-gray-500 text-sm">
					Tasks for the selected period
				</Text>
			</View>

			{/* Toggle */}
			<View className="mb-4 flex-row">
				<RangeBtn
					active={timeRange === "7d"}
					label="7D"
					onPress={() => setTimeRange("7d")}
				/>

				<RangeBtn
					active={timeRange === "30d"}
					label="30D"
					onPress={() => setTimeRange("30d")}
				/>

				<RangeBtn
					active={timeRange === "90d"}
					label="90D"
					onPress={() => setTimeRange("90d")}
				/>
			</View>

			{/* Chart */}
			{values.length > 0 ? (
				<LineChart
					bezier
					chartConfig={{
						backgroundColor: "#ffffff",
						backgroundGradientFrom: "#ffffff",
						backgroundGradientTo: "#ffffff",

						decimalPlaces: 0,

						color: (o = 1) => `rgba(79,70,229,${o})`,

						labelColor: (o = 1) => `rgba(0,0,0,${o})`,

						fillShadowGradient: "#4f46e5",
						fillShadowGradientOpacity: 0.25,

						propsForDots: {
							r: "4",
							strokeWidth: "2",
							stroke: "#4f46e5",
						},
					}}
					data={{
						labels,
						datasets: [{ data: values }],
					}}
					height={240}
					style={{
						borderRadius: 12,
					}}
					width={screenWidth - 48}
					withDots
					withShadow
				/>
			) : (
				<Text className="py-10 text-center text-gray-400">
					No data available
				</Text>
			)}
		</View>
	);
}
function RangeBtn({
	label,
	active,
	onPress,
}: {
	label: string;
	active: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			className={`mr-2 rounded-md border px-3 py-1.5 ${
				active ? "border-indigo-600 bg-indigo-600" : "border-gray-300 bg-white"
			}`}
			onPress={onPress}
		>
			<Text
				className={`font-medium text-xs ${
					active ? "text-white" : "text-gray-700"
				}`}
			>
				{label}
			</Text>
		</Pressable>
	);
}
