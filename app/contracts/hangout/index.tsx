import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, ZoomIn, ZoomOut } from 'react-native-reanimated';

import PressableButton from '@/components/PressableButton';
import { useToast } from '@/components/ToastContext';
import { useRouter } from 'expo-router';

import { Feather } from '@expo/vector-icons';
import { createHangout, getUserHangoutStatus, getHangoutInvitations, type HangoutInvitationType, acceptHangoutInvitation, joinHangoutWithCode } from '@/services/hangout';

export default function HangOutEntryPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [hangoutName, setHangoutName] = useState('');
    const [hangoutDescription, setHangoutDescription] = useState('');

    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinInvitations, setJoinInvitations] = useState<HangoutInvitationType[]>([]);

    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedReply, setSelectedReply] = useState<number>(0);

    const fetchInvitations = async () => {
        try {
            const invitations: HangoutInvitationType[] = await getHangoutInvitations();
            if (invitations)    setJoinInvitations(invitations);
        } catch(err) {
            console.log("Error fetching hangout invitation: ", err);
        } 
    };

    const checkIfUserHasHangout = async () => {
        try {
            const code = await getUserHangoutStatus();

            if (code)
                router.replace('/contracts/hangout/playground');
        } catch (err) {
            console.error("Error checking hangout status:", err);
            showToast('Failed to check hang out status', { title: "Hang out", type: 'error' });
            router.back();
        }
    }

    useEffect(() => {
        checkIfUserHasHangout();
        fetchInvitations();
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

    const handleJoinWithCode = async () => {
        try {
            await joinHangoutWithCode({ hangoutCode: joinCode });
            await checkIfUserHasHangout();
            showToast('Hang out created successfully', { title: "Hang out", type: 'success' });
        } catch(err){
            showToast("Something went wrong", { title:"hangout", type:"error"});
            console.log("Error joining with code: ", err);
        }

    };

    const handleJoinPress = () => {
        setShowJoinModal(true);
    }

    const handleRequestPress = (id: number) => {
        if (id===null)    return;
        setSelectedReply(id);
        setShowReplyModal(true);
    }

    const handleAcceptReuest = async () => {
        try {
            await acceptHangoutInvitation({
                hangoutCode: joinInvitations[selectedReply].hangoutCode,
                senderId: joinInvitations[selectedReply].userProfile.id,
            });
            await checkIfUserHasHangout();
        } catch(err){
            showToast("Something went wrong", { type: "error" });
            console.log("Error accepting hangout invitation: ", err);
        }
    }

    const handleDeclineRequest = () => {
        setShowReplyModal(false);
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

                        {/* Pending Invitations */}
                        <Text className="text-sm font-medium text-gray-700 mb-2">Pending Join Requests</Text>
                        <ScrollView className="max-h-[180px] px-2 -mx-2">
                            {joinInvitations.length === 0 ? (
                                <Text className="text-gray-400">No invitations found</Text>
                            ) : (
                                joinInvitations.map((invitation, idx) => (
                                    <Pressable
                                        key={idx}
                                        className="
                                            border border-gray-300 rounded-lg
                                            p-3 mb-2
                                            bg-gray-50
                                            flex-1
                                        "
                                        onPress={() => handleRequestPress(idx)}
                                    >
                                        <View>
                                            <Text className="text-sm font-medium">{invitation.hangoutCode}</Text>
                                            <Text className="text-sm font-medium">Request from: {invitation.userProfile.name}</Text>
                                        </View>
                                    </Pressable>
                                ))
                            )}
                        </ScrollView>
                    </Animated.View>
                </>
            )}

            {showReplyModal && (
                <>
                    {/* Overlay - static fade */}
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        className="absolute inset-0 bg-black/30"
                        style={{ zIndex: 45 }}
                    >
                        <Pressable className="flex-1" onPress={() => setShowReplyModal(false)} />
                    </Animated.View>

                    {/* Modal content - slide up */}
                    <Animated.View
                        entering={ZoomIn}
                        exiting={ZoomOut}
                        className="absolute top-1/3 left-[5%] right-[5%] bg-white rounded-2xl p-4 max-h-[80%]"
                        style={{ zIndex: 50 }}
                    >
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold">Want to join this?</Text>
                            <Pressable onPress={() => setShowReplyModal(false)}>
                                <Feather name="x" size={24} color="black" />
                            </Pressable>
                        </View>

                        <View
                            className="
                                border border-gray-300 rounded-lg
                                p-3 mb-2
                                bg-gray-50
                                flex-1
                            "
                        >
                            <Text className="text-sm font-medium">{joinInvitations[selectedReply].hangoutCode}</Text>
                            <Text className="text-sm font-medium">Request from: {joinInvitations[selectedReply].userProfile.name}</Text>
                        </View>

                        <View
                            className='flex-1 flex-row gap-4'
                        >
                            <View className='flex-1'>
                                <PressableButton
                                    title="accept"
                                    onPress={handleAcceptReuest}
                                    bgColor='#0D3B66'
                                    textColor='#fff'
                                />
                            </View>

                            <View className='flex-1'>
                                <PressableButton
                                    title="decline"
                                    onPress={handleDeclineRequest}
                                />
                            </View>
                        </View>
                    </Animated.View>
                </>
            )}

        </View>
    );
}
