import { Modal, Text, TouchableOpacity, View } from "react-native";

interface Props {
	message: string;
	onClose: () => void;
	onConfirm: () => void;
	open: boolean;
	title: string;
}

export function ConfirmDialog({
	open,
	title,
	message,
	onClose,
	onConfirm,
}: Props) {
	return (
		<Modal animationType="fade" transparent visible={open}>
			<View className="flex-1 items-center justify-center bg-black/50">
				<View className="w-4/5 rounded-xl bg-white p-5">
					{/* Title */}
					<Text className="mb-2 font-bold text-lg">{title}</Text>

					{/* Message */}
					<Text className="mb-5 text-gray-600">{message}</Text>

					{/* Buttons */}
					<View className="flex-row justify-end space-x-4">
						<TouchableOpacity onPress={onClose}>
							<Text className="mr-4 text-gray-500">Cancel</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={onConfirm} testID="confirm-btn">
							<Text className="font-semibold text-blue-600">Confirm</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}
