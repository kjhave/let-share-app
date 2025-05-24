import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';

interface Friend {
    id: string;
    name: string;
}

interface Props {
    friend: Friend | null;
    onClose: () => void;
}

export default function ProfilePopup({ friend, onClose }: Props) {
    if (!friend) return null;

    return (
        <Modal transparent visible animationType="none">
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <Animated.View
                    className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg"
                    entering={FadeIn.duration(150).springify()}
                    exiting={FadeOut.duration(150)}
                    layout={ZoomIn.springify()}
                >
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold">{friend.name}</Text>
                        <Pressable onPress={onClose}>
                            <Feather name="x" size={20} color="black" />
                        </Pressable>
                    </View>

                    <View className="space-y-2">
                        <Text className="text-gray-700">ID: {friend.id}</Text>
                        <Text className="text-gray-500 italic">More info coming soon...</Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}