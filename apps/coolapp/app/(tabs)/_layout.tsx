import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen
				name="work"
				options={{
					title: "Work",
					tabBarIcon: ({ color, size }) => (
						<Ionicons color={color} name="add-circle" size={size} />
					),
				}}
			/>

			<Tabs.Screen
				name="dashboard"
				options={{
					title: "Dashboard",
					tabBarIcon: ({ color, size }) => (
						<Ionicons color={color} name="grid" size={size} />
					),
				}}
			/>
		</Tabs>
	);
}
