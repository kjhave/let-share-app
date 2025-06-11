// components/AddFriendModal.tsx
import { View, Text, Pressable, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useToast } from '../ToastContext';
import * as Clipboard from 'expo-clipboard';

import { Dimensions } from 'react-native';
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export default function AddFriendModal({
    usercode,
    onClose,
    onFind, 
    friendCode,
    setFriendCode,
    foundUser,
    notFound,
    onSendRequest,
}: {
    usercode: string;
    onClose: () => void;
    onFind: () => void;
    friendCode: string;
    setFriendCode: (val: string) => void;
    foundUser?: { id: string; name: string } | null;
    notFound?: boolean;
    onSendRequest: () => void;
}) {
    const { showToast } = useToast();
    const copyFriendCode = async () => {
        try {
            await Clipboard.setStringAsync(usercode);
            showToast("Copy friend code successfully", { type: "success" });
        }
        catch(error){
            showToast("Failed to copy friend code", { type: "error" });
            console.log("Error when trying to copy friend code", error);
        }
    }

    return (
        <View 
            style={{    
                position: 'absolute',
                width: screenWidth,
                height: screenHeight,
                top: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <View
                style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: 16,
                    width: '90%',
                    padding: 16,
                    zIndex: 10
                }}
            >
                <Pressable className="absolute top-3 right-3 z-20 h-7 w-7 p-1" onPress={onClose}>
                    <Feather name="x" size={20} color="#333" />
                </Pressable>

                <Text className="text-lg font-bold mb-2">Add Friend</Text>
                <Text className="text-sm text-gray-600 mb-4">
                    Copy your friend code below
                </Text>

                <View className="flex-row items-center justify-between mb-4 bg-gray-100 rounded px-3 py-2">
                    <Text className="font-mono">{usercode}</Text>
                    <Pressable onPress={copyFriendCode}>
                        <Feather name="copy" size={18} color="#0D3B66" />
                    </Pressable>
                </View>

                <Text className="text-sm text-gray-600 mb-2">
                    Or find your friend by friend code
                </Text>
                <View className="flex-row items-center bg-gray-100 rounded px-3 py-2 mb-4">
                    <TextInput
                        value={friendCode}
                        onChangeText={setFriendCode}
                        placeholder="Enter friend code"
                        className="flex-1 text-black"
                    />
                    <Pressable onPress={onFind}>
                        <Feather name="search" size={18} color="#0D3B66" />
                    </Pressable>
                </View>

                {notFound ? (
                    <Text className="text-red-500 text-sm">Not found</Text>
                ) : foundUser ? (
                    <View className="bg-gray-50 rounded p-3">
                        <Text className="font-semibold">{foundUser.name}</Text>
                        <Text className="text-xs text-gray-500">
                            #{foundUser.id}
                        </Text>
                        <Pressable
                            className="mt-2 bg-[#0D3B66] rounded px-3 py-1 self-start"
                            onPress={onSendRequest}
                        >
                            <Text className="text-white">Send Request</Text>
                        </Pressable>
                    </View>
                ) : null}
            </View>        
        </View>
    );
}