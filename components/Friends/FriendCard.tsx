import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FriendCardProps {
    name: string;
    id: string;
    onPress?: () => void;
}

export default function FriendCard({ name, id, onPress }: FriendCardProps) {
    return (
        <Pressable onPress={onPress} className="bg-white p-4 rounded-xl shadow-md mb-3">
            <Text className="text-lg font-semibold">{name}</Text>
            <Text className="text-sm text-gray-500">ID: {id}</Text>
        </Pressable>
    );
}