import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
    id: string;
    message: string;
    title?: string;
    type?: ToastType;
};

const iconMap: Record<ToastType, JSX.Element> = {
    success: <Ionicons name="checkmark-circle" size={20} color="#22c55e" />,
    error: <Ionicons name="close-circle" size={20} color="#ef4444" />,
    info: <Ionicons name="information-circle" size={20} color="#3b82f6" />,
    warning: <Ionicons name="warning" size={20} color="#facc15" />,
};

const colorMap: Record<ToastType, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-400',
};

const toastTypeLabel: Record<ToastType, string> = {
    success: 'Success',
    error: 'Error',
    info: 'Info',
    warning: 'Warning',
};

export const ToastNotification: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const type = toast.type || 'info';

    return (
        <Animated.View
            entering={FadeInDown.springify().duration(300)}
            exiting={FadeOutUp.springify().duration(400)}
            className="w-full max-w-[90%] mb-2 rounded-xl shadow-md bg-white flex-row overflow-hidden"
            style={{ elevation: 4 }}
        >
            <View className={`w-2 ${colorMap[type]}`} />
            <View className="flex-1 flex-row items-start px-3 py-2">
                <View className="pt-1 pr-2">{iconMap[type]}</View>
                <View className="flex-1">
                    <Text className="font-semibold text-sm text-black mb-0.5">
                        {toast.title || toastTypeLabel[type]}
                    </Text>
                    <Text className="text-xs text-gray-700">{toast.message}</Text>
                </View>
                <Pressable onPress={() => onClose()}>
                    <Ionicons name="close" size={16} color="#999" />
                </Pressable>
            </View>
        </Animated.View>
    );
};