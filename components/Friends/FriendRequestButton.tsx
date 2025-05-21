import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function FriendRequestButton({ onPress }: { onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="
                flex items-center justify-center
                absolute bottom-5 right-5 z-10
                h-16 w-16 
                bg-blue-500 rounded-full shadow-lg
            "
        >
            <Feather name="user-plus" size={24} color="white" />
        </TouchableOpacity>
    );
}