import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { useRouter } from 'expo-router';

// import { MMKV } from '@/services/storage'; // Assume you setup MMKV wrapper
import { Feather } from '@expo/vector-icons';

export default function HangOutEntryPage() {
    const router = useRouter();
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinRequests, setJoinRequests] = useState<string[]>([]); // example request codes

    useEffect(() => {

    }, []);

    const handleCreate = () => {
        // For now just navigate
        // router.push('/hangout/create');
    };

    const handleJoinWithCode = () => {
        // Validate joinCode with server
        console.log('Try join with code:', joinCode);
        // If success, save to MMKV and route to activity
    };

    const fetchRequests = () => {
        // Replace with real API later
        setJoinRequests(['ABC123', 'XYZ789']);
    };

    const handleJoinPress = () => {
        setShowJoinModal(true);
    }

    return (
        <View className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold text-center mb-8">Hang Out</Text>

            <Pressable
                onPress={() => router.back()}
                className="absolute top-4 left-4 z-30 p-2"
            >
                <Feather name="arrow-left" size={24} color="black" />
            </Pressable>

            <View className="flex-1 justify-center items-center px-4 gap-2">
                <Pressable
                    onPress={handleCreate}
                    className="w-full mb-3 bg-[#0D3B66] py-6 rounded-xl items-center"
                >
                    <Text className="text-white font-semibold text-base">Create Hang Out</Text>
                </Pressable>

                <Pressable
                    onPress={handleJoinPress}
                    className="w-full border border-gray-400 py-4 rounded-xl items-center"
                >
                    <Text className="text-gray-700 font-medium text-base">Join Hang Out</Text>
                </Pressable>
            </View>

            {/* Join Modal */}
            {showJoinModal && (
                <>
                    {/* Overlay - static fade */}
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        className="absolute inset-0 bg-black/30"
                        style={{ zIndex: 10 }}
                    >
                        <Pressable className="flex-1" onPress={() => setShowJoinModal(false)} />
                    </Animated.View>

                    {/* Modal content - slide up */}
                    <Animated.View
                        entering={SlideInDown}
                        exiting={SlideOutDown}
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[80%]"
                        style={{ zIndex: 20 }}
                    >
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold">Join Hang Out</Text>
                            <Pressable onPress={() => setShowJoinModal(false)}>
                                <Feather name="x" size={24} color="black" />
                            </Pressable>
                        </View>

                        {/* Join with Code */}
                        <Text className="text-sm font-medium text-gray-700 mb-1">Join with Code</Text>
                        <TextInput
                            value={joinCode}
                            onChangeText={setJoinCode}
                            className="border border-gray-300 rounded-lg px-4 py-2 mb-3 bg-white"
                            placeholder="Enter hang out code"
                        />
                        <Pressable
                            onPress={handleJoinWithCode}
                            className="bg-[#0D3B66] py-2 rounded-lg items-center mb-6"
                        >
                            <Text className="text-white text-base font-medium">Join</Text>
                        </Pressable>

                        {/* Pending Requests */}
                        <Text className="text-sm font-medium text-gray-700 mb-2">Pending Join Requests</Text>
                        <ScrollView className="max-h-[180px] px-2 -mx-2">
                            {joinRequests.length === 0 ? (
                                <Text className="text-gray-400">No requests found</Text>
                            ) : (
                                joinRequests.map((code) => (
                                    <Pressable
                                        key={code}
                                        className="border border-gray-300 rounded-lg p-3 mb-2 bg-gray-50"
                                    >
                                        <Text className="text-sm font-medium">Request from: {code}</Text>
                                    </Pressable>
                                ))
                            )}
                        </ScrollView>
                    </Animated.View>
                </>
            )}

        </View>
    );
}
