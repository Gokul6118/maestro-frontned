"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TodoForm, todoFormSchema } from "@repo/schemas";
import { useUIStore } from "@repo/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Calendar } from "@workspace/ui/components/calendar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@workspace/ui/components/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Textarea } from "@workspace/ui/components/textarea";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import type React from "react";
import { useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { todoApi } from "@/lib/api-client";
import { authClient } from "../../lib/auth-client";

type Todo = {
	id: number;
	text: string;
	description: string;
	status: "todo" | "backlog" | "inprogress" | "done" | "cancelled";
	startAt: string;
	endAt: string;
};
export default function WorkPage() {
	const router = useRouter();

	const logoutMutation = useMutation({
		mutationFn: async () => {
			await authClient.signOut();
		},

		onSuccess: () => {
			router.push("/");
		},

		onError: () => {
			alert("Logout failed");
		},
	});

	const {
		expandedId,

		openConfirm,
		closeConfirm,
		confirm,
		editTodo,
		sheetOpen,
		openSheet,
		closeSheet,
		setEditTodo,
		clearEditTodo,
		descOpen,
		activeTodo,
		openDesc,
		closeDesc,
	} = useUIStore();

	const {
		data: items = [],
		isLoading,
		error,
	} = todoApi.useQuery("get", "/api");

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
	const patchMutation = todoApi.useMutation("patch", "/api/{id}", {
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["get", "/api"],
			});
		},
	});
	const deleteMutation = todoApi.useMutation("delete", "/api/{id}", {
		onSuccess: async () => {
			// Force refetch and WAIT
			await queryClient.refetchQueries({
				queryKey: ["get", "/api"],
			});
		},
	});

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TodoForm>({
		resolver: zodResolver(todoFormSchema),

		defaultValues: {
			text: "",
			description: "",
			startDate: "",
			startTime: "",
			endDate: "",
			endTime: "",
			status: "todo",
		},
	});

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

		if (action === "delete") {
			deleteMutation.mutate({
				params: {
					path: { id: String(payload) },
				},
			});
		}

		if (
			(action === "add" || action === "edit") &&
			payload &&
			typeof payload !== "number"
		) {
			processSubmit(payload);
		}

		closeConfirm();
	};
	function stripTime(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}
	const today = stripTime(new Date());
	const onDragStart = (e: React.DragEvent, id: number) => {
		e.dataTransfer.setData("taskId", String(id));
	};

	const allowDrop = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const onDrop = (e: React.DragEvent, status: Todo["status"]) => {
		e.preventDefault();

		const id = Number(e.dataTransfer.getData("taskId"));

		patchMutation.mutate({
			params: {
				path: { id: String(id) },
			},
			body: {
				status,
			},
		});
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

		return "bg-white-100";
	};

	const byStatus = (s: Todo["status"]) =>
		items.filter((i: Todo) => i.status === s);

	if (isLoading) {
		return <div className="p-6">Loading...</div>;
	}

	if (error) {
		const err = error as Error;

		return (
			<div className="p-6 text-red-600">
				{err.message || "Something went wrong"}
			</div>
		);
	}

	const TaskCard = ({ item }: { item: Todo }) => {
		const isExpanded = expandedId === item.id;

		return (
			<div
				className={`mb-3 cursor-pointer rounded-xl border p-4 shadow hover:shadow-md ${getRemainingClass(item.endAt, item.status)}`}
				data-testid="todo-card"
				draggable
				onClick={() => openDesc(item)}
				onDragStart={(e) => onDragStart(e, item.id)}
			>
				<p className="font-semibold">{item.text}</p>

				<p className="mt-1 text-gray-600 text-sm">
					{isExpanded
						? item.description
						: item.description.slice(0, 60) + "..."}
				</p>

				<p className="mt-2 text-gray-500 text-xs">
					{new Date(item.startAt).toLocaleString()} →{" "}
					{new Date(item.endAt).toLocaleString()}
				</p>

				<div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
					<Button
						className="bg-blue-500 text-white"
						data-testid="edit-todo-btn"
						onClick={() => {
							setEditTodo(item);
							openSheet();

							const s = new Date(item.startAt);
							const e = new Date(item.endAt);

							setValue("text", item.text);
							setValue("description", item.description);
							setValue("startDate", format(s, "yyyy-MM-dd"));
							setValue("startTime", format(s, "HH:mm"));
							setValue("endDate", format(e, "yyyy-MM-dd"));
							setValue("endTime", format(e, "HH:mm"));
							setValue("status", item.status);
						}}
						size="sm"
					>
						Edit
					</Button>

					<Button
						className="bg-red-500 text-white"
						data-testid="delete-btn"
						onClick={() => openConfirm("delete", item.id)}
						size="sm"
					>
						Delete
					</Button>
				</div>
			</div>
		);
	};

	return (
		<>
			<button
				className="mt-10 ml-4 bg-black p-3 text-white"
				onClick={() => logoutMutation.mutate()}
			>
				Logout
			</button>

			{/* Sheet */}
			<div className="flex justify-end">
				<Sheet
					onOpenChange={(open) => (open ? openSheet() : closeSheet())}
					open={sheetOpen}
				>
					<SheetTrigger asChild>
						<Button
							onClick={() => {
								reset();
								clearEditTodo();
								openSheet();
							}}
						>
							Add Todo
						</Button>
					</SheetTrigger>

					<SheetContent className="w-[420px]" side="right">
						<SheetHeader>
							<SheetTitle>{editTodo ? "Edit Todo" : "Add Todo"}</SheetTitle>
						</SheetHeader>

						<form
							className="mt-6 space-y-5 px-6"
							onSubmit={handleSubmit(onSubmit)}
						>
							<div className="space-y-1">
								<Label>Title</Label>

								<Input placeholder="Enter title" {...register("text")} />

								{errors.text && (
									<p className="text-red-500 text-sm">{errors.text.message}</p>
								)}
							</div>

							<div className="space-y-1">
								<Label>Description</Label>

								<Textarea
									placeholder="Enter description"
									{...register("description")}
								/>
							</div>

							{/* STATUS */}
							<div className="space-y-1">
								<Label>Status</Label>

								<Select
									defaultValue="todo"
									onValueChange={(val) => setValue("status", val as any)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="todo">Todo</SelectItem>
										<SelectItem value="backlog">Backlog</SelectItem>
										<SelectItem value="inprogress">In Progress</SelectItem>
										<SelectItem value="done">Done</SelectItem>
										<SelectItem value="cancelled">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* START DATE */}
							<div className="space-y-1">
								<Label>Start Date</Label>

								<Popover>
									<PopoverTrigger asChild>
										<Button
											className="w-full justify-start text-left font-normal"
											variant="outline"
										>
											{watch("startDate")
												? format(new Date(watch("startDate")), "PPP")
												: "Pick a date"}
										</Button>
									</PopoverTrigger>

									<PopoverContent className="w-auto p-0">
										<Calendar
											disabled={(date) => stripTime(date) < today}
											initialFocus
											mode="single"
											onSelect={(date) => {
												if (date) {
													setValue("startDate", format(date, "yyyy-MM-dd"));

													const end = watch("endDate");
													if (
														end &&
														stripTime(new Date(end)) < stripTime(date)
													) {
														setValue("endDate", "");
													}
												}
											}}
											selected={
												watch("startDate")
													? new Date(watch("startDate"))
													: undefined
											}
										/>
									</PopoverContent>
								</Popover>
							</div>

							{/* START TIME */}
							<div className="space-y-1">
								<Label>Start Time</Label>

								<Input type="time" {...register("startTime")} />
							</div>

							{/* END DATE */}
							<div className="space-y-1">
								<Label>End Date</Label>

								<Popover>
									<PopoverTrigger asChild>
										<Button
											className="w-full justify-start text-left font-normal"
											variant="outline"
										>
											{watch("endDate")
												? format(new Date(watch("endDate")), "PPP")
												: "Pick a date"}
										</Button>
									</PopoverTrigger>

									<PopoverContent className="w-auto p-0">
										<Calendar
											disabled={(date) => {
												const start = watch("startDate");

												const d = stripTime(date);

												// ❌ Past days
												if (d < today) {
													return true;
												}

												// ❌ Before start date
												if (start && d < stripTime(new Date(start))) {
													return true;
												}

												return false; // ✅ allow today & future
											}}
											initialFocus
											mode="single"
											onSelect={(date) => {
												if (date) {
													setValue("endDate", format(date, "yyyy-MM-dd"));
												}
											}}
											selected={
												watch("endDate")
													? new Date(watch("endDate"))
													: undefined
											}
										/>
									</PopoverContent>
								</Popover>
							</div>

							{/* END TIME */}
							<div className="space-y-1">
								<Label>End Time</Label>

								<Input type="time" {...register("endTime")} />
							</div>

							{/* SUBMIT */}
							<Button className="w-full" type="submit">
								{editTodo ? "Update" : "Add Todo"}
							</Button>
						</form>
					</SheetContent>
				</Sheet>
			</div>

			{/* Board */}
			<div className="mt-6 grid grid-cols-1 gap-6 rounded-xl bg-gray-50 p-4 md:grid-cols-5">
				{(
					[
						"todo",
						"backlog",
						"inprogress",
						"done",
						"cancelled",
					] as Todo["status"][]
				).map((s) => (
					<div
						className="rounded-xl bg-white p-4 shadow"
						key={s}
						onDragOver={allowDrop}
						onDrop={(e) => onDrop(e, s)}
					>
						<h3 className="mb-3 font-semibold capitalize">{s}</h3>

						{byStatus(s).map((item: Todo) => (
							<TaskCard item={item} key={item.id} />
						))}
					</div>
				))}
			</div>

			{/* Confirm */}
			<ConfirmDialog
				message="Are you sure?"
				onClose={closeConfirm}
				onConfirm={handleConfirm}
				open={confirm.open}
				title="Confirm Action"
			/>

			{/* Description */}
			<Dialog onOpenChange={closeDesc} open={descOpen}>
				<DialogContent className="max-h-[70vh] max-w-md overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{activeTodo?.text}</DialogTitle>
					</DialogHeader>

					<p className="text-gray-600 text-sm">{activeTodo?.description}</p>
				</DialogContent>
			</Dialog>
		</>
	);
}
