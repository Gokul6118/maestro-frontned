import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";

type Todo = {
	status: string;
	endAt: string;
};

type Props = {
	todos: Todo[];
};

export function SectionCards({ todos }: Props) {
	const total = todos.length;

	const inProgress = todos.filter((t) => t.status === "inprogress").length;

	const done = todos.filter((t) => t.status === "done").length;

	const overdue = todos.filter(
		(t) => new Date(t.endAt) < new Date() && t.status !== "done"
	).length;

	return (
		<div className="grid gap-4 md:grid-cols-4">
			<Card>
				<CardHeader>Total Tasks</CardHeader>
				<CardContent className="font-bold text-2xl">{total}</CardContent>
			</Card>

			<Card>
				<CardHeader>In Progress</CardHeader>
				<CardContent className="font-bold text-2xl">{inProgress}</CardContent>
			</Card>

			<Card>
				<CardHeader>Completed</CardHeader>
				<CardContent className="font-bold text-2xl">{done}</CardContent>
			</Card>

			<Card>
				<CardHeader>Overdue</CardHeader>
				<CardContent className="font-bold text-2xl text-red-500">
					{overdue}
				</CardContent>
			</Card>
		</div>
	);
}
