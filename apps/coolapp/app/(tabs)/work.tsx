import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { type TodoForm, todoFormSchema } from "@repo/schemas";
import { useTimeStore, useUIStore } from "@repo/store";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
	LogBox,
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { todoApi } from "../../lib/api-client";
import { authClient } from "../../lib/auth-client";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);
interface Todo {
	description: string;
	endAt: string;
	id: number;

	startAt: string;

	status: "todo" | "backlog" | "inprogress" | "done" | "cancelled";
	text: string;
}
const STATUS_LIST = [
	{ key: "todo", label: "Todo" },
	{ key: "backlog", label: "Backlog" },
	{ key: "inprogress", label: "In Progress" },
	{ key: "done", label: "Done" },
	{ key: "cancelled", label: "Cancelled" },
] as const;

export default function WorkScreen() {
	const router = useRouter();

	/* ------------------ Store ------------------ */

	const {
		openConfirm,
		closeConfirm,
		confirm,
		editTodo,
		sheetOpen,
		openSheet,
		closeSheet,
		setEditTodo,
		clearEditTodo,
	} = useUIStore();

	const {
		showStartDate,
		showStartTime,
		showEndDate,
		showEndTime,

		openStartDate,
		closeStartDate,

		openStartTime,
		closeStartTime,

		openEndDate,
		closeEndDate,

		openEndTime,
		closeEndTime,
	} = useTimeStore();

	const { data } = todoApi.useQuery("get", "/api");

	const items = (data ?? []) as Todo[];

	const queryClient = useQueryClient();

	const addMutation = todoApi.useMutation("post", "/api", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get", "/api"],
			});
		},
	});

	const updateMutation = todoApi.useMutation("put", "/api/{id}", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get", "/api"],
			});
		},
	});

	const deleteMutation = todoApi.useMutation("delete", "/api/{id}", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get", "/api"],
			});
		},
	});
	const { control, handleSubmit, reset } = useForm<TodoForm>({
		resolver: zodResolver(todoFormSchema),

		defaultValues: {
			text: "",
			description: "",
			status: "todo",
			startDate: "",
			startTime: "",
			endDate: "",
			endTime: "",
		},
	});

	async function logout() {
		try {
			await authClient.signOut();

			await queryClient.clear();
			router.replace("/");
		} catch (err) {
			console.error("Logout failed:", err);
		}
	}

	const openAdd = () => {
		clearEditTodo();
		reset({
			text: "",
			description: "",
			status: "todo",
			startDate: "",
			startTime: "",
			endDate: "",
			endTime: "",
		});
		openSheet();
	};
	const getRemainingClass = (endAt: string, status: string) => {
		if (status !== "inprogress") {
			return "bg-white";
		}

		const now = Date.now();
		const end = new Date(endAt).getTime();

		const hoursLeft = (end - now) / (1000 * 60 * 60);

		if (hoursLeft <= 0) {
			return "bg-red-500 text-white";
		}
		if (hoursLeft < 2) {
			return "bg-red-200";
		}
		if (hoursLeft < 6) {
			return "bg-yellow-200";
		}

		return "bg-white";
	};

	const openEdit = (item: Todo) => {
		setEditTodo(item);

		const start = new Date(item.startAt);
		const end = new Date(item.endAt);

		reset({
			text: item.text,
			description: item.description,
			status: item.status,

			startDate: start.toISOString().split("T")[0],
			startTime: start.toTimeString().slice(0, 5),

			endDate: end.toISOString().split("T")[0],
			endTime: end.toTimeString().slice(0, 5),
		});

		openSheet();
	};
	const onSubmit = (data: TodoForm) => {
		openConfirm(editTodo ? "edit" : "add", data);
	};

	const processSubmit = (data: TodoForm) => {
		if (editTodo) {
			updateMutation.mutate({
				params: {
					path: { id: String(editTodo.id) },
				},
				body: data,
			});
			clearEditTodo();
		} else {
			addMutation.mutate({
				body: data,
			});
		}

		reset();
		closeSheet();
	};
	const handleConfirm = () => {
		const { action, payload } = confirm;

		if (action === "add" || action === "edit") {
			processSubmit(payload);
		}

		if (action === "delete") {
			deleteMutation.mutate({
				params: {
					path: { id: String(payload) },
				},
			});
		}

		closeConfirm();
	};

	const formatDateTime = (iso: string) => {
		const d = new Date(iso);

		return d.toLocaleString("en-IN", {
			timeZone: "Asia/Kolkata",
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		});
	};
	return (
		<SafeAreaView className="flex-1 bg-gray-100">
			<View className="flex-1 p-4">
				<TouchableOpacity
					className="mb-4 rounded-lg bg-black px-5 py-3"
					onPress={logout}
					testID="logout-btn"
				>
					<Text className="text-center text-white">Logout</Text>
				</TouchableOpacity>

				{/* Add */}
				<TouchableOpacity
					className="mb-4 items-center rounded-lg bg-black py-3"
					onPress={openAdd}
					testID="add-todo-btn"
				>
					<Text className="font-semibold text-white">Add Todo</Text>
				</TouchableOpacity>

				<ScrollView
					className="flex-1"
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					{STATUS_LIST.map((status) => {
						const filtered = items.filter((item) => item.status === status.key);

						return (
							<View
								className="mr-4 w-72 rounded-xl bg-gray-200 p-3"
								key={status.key}
							>
								<Text className="mb-3 text-center font-bold text-base">
									{status.label} ({filtered.length})
								</Text>

								<ScrollView showsVerticalScrollIndicator={false}>
									{filtered.length === 0 ? (
										<Text className="mt-10 text-center text-gray-500">
											No tasks
										</Text>
									) : (
										filtered.map((item) => (
											<View
												className={`${getRemainingClass(
													item.endAt,
													item.status
												)} mb-3 rounded-lg p-3 shadow`}
												key={String(item.id)}
												testID={`todo-card-${item.text}`}
											>
												<Text className="font-semibold">{item.text}</Text>

												{/* Description */}
												<Text className="mt-1 text-gray-700 text-sm">
													{item.description}
												</Text>

												{/* Dates */}
												<View className="mt-2 space-y-1">
													<Text className="text-gray-500 text-xs">
														📅 Start: {formatDateTime(item.startAt)}
													</Text>

													<Text className="text-gray-500 text-xs">
														⏰ End: {formatDateTime(item.endAt)}
													</Text>
												</View>
												<View className="mt-3 flex-row gap-2">
													<TouchableOpacity
														className="rounded-md bg-blue-500 px-3 py-1"
														onPress={() => openEdit(item)}
														testID={`edit-btn-${item.text}`}
													>
														<Text className="text-white text-xs">Edit</Text>
													</TouchableOpacity>

													<TouchableOpacity
														className="rounded-md bg-red-500 px-3 py-1"
														onPress={() => openConfirm("delete", item.id)}
														testID={`delete-btn-${item.text}`}
													>
														<Text className="text-white text-xs">Delete</Text>
													</TouchableOpacity>
												</View>
											</View>
										))
									)}
								</ScrollView>
							</View>
						);
					})}
				</ScrollView>
			</View>

			<Modal animationType="slide" visible={sheetOpen}>
				<SafeAreaView className="flex-1 bg-white">
					<ScrollView className="p-5">
						<Text className="mb-6 font-bold text-xl">
							{editTodo ? "Edit Todo" : "Add Todo"}
						</Text>

						{/* Title */}
						<Controller
							control={control}
							name="text"
							render={({ field }) => (
								<TextInput
									className="mb-4 rounded-xl border p-4"
									onChangeText={field.onChange}
									testID="title"
									value={field.value}
								/>
							)}
						/>

						{/* Description */}
						<Controller
							control={control}
							name="description"
							render={({ field }) => (
								<TextInput
									className="mb-4 h-24 rounded-xl border p-4"
									multiline
									onChangeText={field.onChange}
									testID="desc"
									value={field.value}
								/>
							)}
						/>

						{/* Status */}
						<Text className="mb-2 font-medium">Status</Text>

						<Controller
							control={control}
							name="status"
							render={({ field }) => (
								<View className="mb-4 rounded-xl border">
									<Picker
										onValueChange={field.onChange}
										selectedValue={field.value}
										testID="status-picker"
									>
										<Picker.Item label="Todo" value="todo" />
										<Picker.Item label="Backlog" value="backlog" />
										<Picker.Item label="In Progress" value="inprogress" />
										<Picker.Item label="Done" value="done" />
										<Picker.Item label="Cancelled" value="cancelled" />
									</Picker>
								</View>
							)}
						/>

						{/* Start Date */}
						<Text className="mb-2 font-medium">Start Date</Text>

						<Controller
							control={control}
							name="startDate"
							render={({ field }) => (
								<>
									<TouchableOpacity
										className="mb-3 rounded-xl border p-4"
										onPress={openStartDate}
										testID="start-btn"
									>
										<Text>{field.value || "Select Start Date"}</Text>
									</TouchableOpacity>

									{showStartDate && (
										<DateTimePicker
											display="calendar"
											minimumDate={new Date()}
											mode="date"
											onChange={(_e, date) => {
												closeStartDate();

												if (date) {
													field.onChange(date.toISOString().split("T")[0]);
												}
											}}
											value={field.value ? new Date(field.value) : new Date()}
										/>
									)}
								</>
							)}
						/>

						{/* Start Time */}
						<Text className="mb-2 font-medium">Start Time</Text>

						<Controller
							control={control}
							name="startTime"
							render={({ field }) => (
								<>
									<TouchableOpacity
										className="mb-3 rounded-xl border p-4"
										onPress={openStartTime}
										testID="start-time-btn"
									>
										<Text>{field.value || "Select Start Time"}</Text>
									</TouchableOpacity>

									{showStartTime && (
										<DateTimePicker
											display="clock"
											is24Hour
											mode="time"
											onChange={(_e, date) => {
												closeStartTime();

												if (date) {
													field.onChange(date.toTimeString().slice(0, 5));
												}
											}}
											value={
												field.value
													? new Date(`1970-01-01T${field.value}:00`)
													: new Date()
											}
										/>
									)}
								</>
							)}
						/>

						{/* End Date */}
						<Text className="mb-2 font-medium">End Date</Text>

						<Controller
							control={control}
							name="endDate"
							render={({ field }) => (
								<>
									<TouchableOpacity
										className="mb-3 rounded-xl border p-4"
										onPress={openEndDate}
										testID="end-date-btn"
									>
										<Text>{field.value || "Select End Date"}</Text>
									</TouchableOpacity>

									{showEndDate && (
										<DateTimePicker
											display="calendar"
											minimumDate={new Date()}
											mode="date"
											onChange={(_e, date) => {
												closeEndDate();

												if (date) {
													field.onChange(date.toISOString().split("T")[0]);
												}
											}}
											value={field.value ? new Date(field.value) : new Date()}
										/>
									)}
								</>
							)}
						/>

						<Text className="mb-2 font-medium">End Time</Text>

						<Controller
							control={control}
							name="endTime"
							render={({ field }) => (
								<>
									<TouchableOpacity
										className="mb-3 rounded-xl border p-4"
										onPress={openEndTime}
										testID="end-time-btn"
									>
										<Text>{field.value || "Select End Time"}</Text>
									</TouchableOpacity>

									{showEndTime && (
										<DateTimePicker
											display="clock"
											is24Hour
											mode="time"
											onChange={(_e, date) => {
												closeEndTime();

												if (date) {
													field.onChange(date.toTimeString().slice(0, 5));
												}
											}}
											value={
												field.value
													? new Date(`1970-01-01T${field.value}:00`)
													: new Date()
											}
										/>
									)}
								</>
							)}
						/>

						{/* Submit */}
						<TouchableOpacity
							className="mt-6 items-center rounded-xl bg-black py-4"
							onPress={handleSubmit(onSubmit)}
							testID="submit-btn"
						>
							<Text className="font-semibold text-white">
								{editTodo ? "Update" : "Add"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							className="mt-4 items-center"
							onPress={closeSheet}
						>
							<Text className="text-gray-500">Cancel</Text>
						</TouchableOpacity>
					</ScrollView>
				</SafeAreaView>
			</Modal>

			{/* Confirm */}
			<ConfirmDialog
				message="Are you sure?"
				onClose={closeConfirm}
				onConfirm={handleConfirm}
				open={confirm.open}
				title="Confirm Action"
			/>
		</SafeAreaView>
	);
}
