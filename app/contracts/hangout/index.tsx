import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import PressableButton from '@/components/PressableButton';
import { useToast } from '@/components/ToastContext';
import { useRouter } from 'expo-router';

import { Feather } from '@expo/vector-icons';
import { createHangout, getUserHangoutStatus } from '@/services/hangout';

export default function HangOutEntryPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [hangoutName, setHangoutName] = useState('');
    const [hangoutDescription, setHangoutDescription] = useState('');

    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinRequests, setJoinRequests] = useState<string[]>([]); // example request codes

    const checkIfUserHasHangout = async () => {
        try {
            const code = await getUserHangoutStatus();

            if (code)
                router.push('/contracts/hangout/playground');
        } catch (err) {
            console.error("Error checking hangout status:", err);
            showToast('Failed to check hang out status', { title: "Hang out", type: 'error' });
            router.back();
        }
    }

    useEffect(() => {
        checkIfUserHasHangout();
    }, []);

    const handleCreatePress = () => {
        setShowCreateModal(true);
    };

    const handleCreateHangout = async () => {
        if (!hangoutName.trim()) {
            showToast('Please enter a hang out name', { title: "Hang out", type: 'error' });
            return;
        }

        try {
            await createHangout({
                name: hangoutName,
                description: hangoutDescription
            })

            await checkIfUserHasHangout();
            showToast('Hang out created successfully', { title: "Hang out", type: 'success' });
        } catch(err) {
            console.error("Error creating hangout:", err);
            showToast('Failed to create hang out', { title: "Hang out", type: 'error' });
            return;
        }

        setShowCreateModal(false);
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

            <View className="flex-1 justify-center items-center px-4 gap-6">
                <PressableButton
                    title="Create Hang Out"
                    onPress={handleCreatePress}
                    bgColor="#0D3B66"
                    textColor="#FFFFFF"
                    padding={{ y: 24, x: 0 }}
                    primary={true}
                />

                <PressableButton
                    title="Join Hang Out"
                    onPress={handleJoinPress}
                    bgColor="#ffffff"
                    textColor="#374151"
                    borderColor="#9ca3af"
                    padding={{ y: 16, x: 0 }}
                />
            </View>

            {/* Create Modal */}
            {showCreateModal && (
                <>
                    {/* Overlay - static fade */}
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        className="absolute inset-0 bg-black/30"
                        style={{ zIndex: 10 }}
                    >
                        <Pressable className="flex-1" onPress={() => setShowCreateModal(false)} />
                    </Animated.View>

                    {/* Modal content - slide up */}
                    <Animated.View
                        entering={SlideInDown}
                        exiting={SlideOutDown}
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[80%]"
                        style={{ zIndex: 20 }}
                    >
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold">Create Hang Out</Text>
                            <Pressable onPress={() => setShowCreateModal(false)}>
                                <Feather name="x" size={24} color="black" />
                            </Pressable>
                        </View>

                        {/* Join with Code */}
                        <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
                        <TextInput
                            value={hangoutName}
                            onChangeText={setHangoutName}
                            className="border border-gray-300 rounded-lg px-4 py-2 mb-3 bg-white"
                            placeholder="Enter hang out name"
                        />
                        <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
                        <TextInput
                            value={hangoutDescription}
                            onChangeText={setHangoutDescription}
                            className="border border-gray-300 rounded-lg px-4 py-2 mb-3 min-h-24 bg-white"
                            placeholder="Enter hang out description (optional)"
                            multiline={true}
                            textAlignVertical="top"
                        />
                        <Pressable
                            onPress={handleCreateHangout}
                            className="bg-[#0D3B66] py-2 rounded-lg items-center mb-6"
                        >
                            <Text className="text-white text-base font-medium">Create</Text>
                        </Pressable>
                    </Animated.View>
                </>
            )}

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
