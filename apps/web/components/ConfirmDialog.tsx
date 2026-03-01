import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";

export function ConfirmDialog({
	open,
	onClose,
	onConfirm,
	title,
	message,
}: any) {
	return (
		<Dialog onOpenChange={onClose} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<p className="text-gray-600 text-sm">{message}</p>

				<DialogFooter>
					<Button onClick={onClose} variant="outline">
						Cancel
					</Button>

					<Button onClick={onConfirm} variant="destructive">
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
