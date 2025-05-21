import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FriendRequestCardProps {
    name: string;
    id: string;
    onAccept: (friendId: string) => void;
    onDeny: (friendId: string) => void;
}

export default function FriendRequestCard({
    name,
    id,
    onAccept,
    onDeny,
}: FriendRequestCardProps) {
    const handleAcceptRequest = async () => {
        onAccept(id);
    }

    const handleDenyRequest = async () => {
        onDeny(id);
    }

    return (
        <View
            className="bg-white p-4 rounded-2xl mb-3 -mx-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 4, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 6,
            }}
        >
            <Text className="text-lg font-semibold">{name}</Text>
            <Text className="text-sm text-gray-500 mb-2">ID: {id}</Text>

            <View className="flex-row justify-end space-x-3">
                <Pressable
                    onPress={handleDenyRequest}
                    className="bg-red-100 px-3 py-1.5 rounded-full flex-row items-center"
                >
                    <Feather name="x" size={16} color="#DC2626" />
                    <Text className="text-red-600 ml-1 text-sm font-medium">Deny</Text>
                </Pressable>
                <Pressable
                    onPress={handleAcceptRequest}
                    className="bg-green-100 px-3 py-1.5 rounded-full flex-row items-center"
                >
                    <Feather name="check" size={16} color="#16A34A" />
                    <Text className="text-green-600 ml-1 text-sm font-medium">Accept</Text>
                </Pressable>
            </View>
        </View>
    );
}
