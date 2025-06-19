// PlaygroundPage.tsx
import { useState, useEffect } from 'react';
import { View, Text, Dimensions, Pressable, TextInput } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    FadeIn,
    FadeOut,
    SlideInDown,
    SlideOutDown,
    ZoomIn,
    ZoomOut
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';


import PressableButton from '@/components/PressableButton';

// Custom components
import StateTabs, { TabItem } from '@/components/StateTabs';
import ParticipantsTab from '@/components/Hangout/ParticipantsTab';
import ContractTab from '@/components/Hangout/ContractTab';
import {
    getUserHangoutStatus,
    leaveHangout,
    sendHangoutInvitation,
    getHangoutParticipants,
    type HangoutParticipant,
} from '@/services/hangout';

import { useToast } from '@/components/ToastContext';
import * as Clipboard from 'expo-clipboard';
import { getContactInfor } from '@/services/account';

const SCREEN_WIDTH = Dimensions.get('window').width;

const TABS: TabItem[] = [
    { key: 'participants', label: 'Participants', icon: 'users' },
    { key: 'contracts', label: 'Contracts', icon: 'file-text' },
];

export default function PlaygroundPage({ hangoutName = 'Hangout Party '+'🎉' }) {
    const router = useRouter();
    const { showToast } = useToast();

    const [activeTab, setActiveTab] = useState<'participants' | 'contracts'>('participants');
    const translateX = useSharedValue(0);

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showMakeContract, setShowMakeContract] = useState(false);

    const [friendCode, setFriendCode] = useState('');
    const [friendProfile, setFriendProfile] = useState<{ id: string, name: string }>({ id: '', name: ''});
    const [hangoutCode, setHangoutCode] = useState('');

    const [participants, setParticipants] = useState<HangoutParticipant[]>([]);

    
    const fetchParticipants = async (): Promise<void> => {
        try {
            const code = await getUserHangoutStatus();

            if (!code) {
                throw new Error("No hangout code found");
            }

            const friends = await getHangoutParticipants(code);
            setParticipants(friends);
        } catch (error) {
            showToast("Couldn't fetch participants", { type: "error" });
            console.error("Error fetching participant list:", error);
        }
    };


    useEffect(() => {
        const fetchHangoutCode = async () => {
            try {
                const code = await getUserHangoutStatus();
                if (!code) {
                    showToast('You are not part of any hangout', { title: "Hang out", type: 'error' });
                    router.back();
                    return;
                }

                setHangoutCode(code);
            } catch (err) {
                console.error("Error fetching hangout code:", err);
                showToast('Failed to fetch hangout code', { title: "Hang out", type: 'error' });
            }
        }

        fetchHangoutCode();
        fetchParticipants();
    }, []);

    const handleTabChange = (tab: string) => {
        if (tab !== 'participants' && tab !== 'contracts') return;
        setActiveTab(tab);
        translateX.value = withTiming(tab === 'participants' ? 0 : -SCREEN_WIDTH);
    };

    const slidingTab = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handleLeaveHangout = async () => {
        try {
            await leaveHangout();
            showToast('You have left the hangout', { title: "Hang out", type: 'success' });
            router.back();
        } catch(err) {
            showToast('Failed to leave hangout', { title: "Hang out", type: 'error' });
            console.log('Error leaving hangout:', err);
        }
    }

    const handleSendInvitation = async () => {
        if (friendProfile.id === 'usernotfound'){
            showToast("Couldn't find your friend", { title: "Hang out", type: 'error' });
            return;
        }

        try {
            await sendHangoutInvitation({
                hangoutCode: hangoutCode,
                friendId: friendProfile.id
            });
            showToast('Sent hangout invitation successfully', { title: "Hang out", type: 'success' });
        } catch(err){
            showToast('Failed to send hangout invitation', { title: "Hang out", type: 'error' });
            console.log("Error sending hangout invitation: ",  err);
        }
    }

    const copyHangoutCode = async () => {
        try {
            await Clipboard.setStringAsync(hangoutCode);
            showToast("Copy hang out code successfully", { type: "success" });
        }
        catch(error){
            showToast("Failed to copy hang out code", { type: "error" });
            console.log("Error when trying to copy hang out code", error);
        }
    }

    const onFindFriend = async () => {
        try {
            const friend = await getContactInfor(friendCode);
            setFriendProfile({
                id: friend.userId,
                name: friend.name
            })
        } catch(err) {
            setFriendProfile({
                id: 'usernotfound',
                name: ''
            });
        }
    }

    const handleMakePersonalContract = () => {
        router.push({
            pathname: "/contracts/[mode]/make",
            params: { mode: 'hangout' },
        })
        setShowMakeContract(false);
    }
    
    const handleMakeBillShare = () => {
        router.push({
            pathname: "/contracts/[mode]/bill",
            params: { mode: 'hangout' },
        })
        setShowMakeContract(false);
    }

    return (
        <View className="relative flex-1 bg-white pt-12 p-4 overflow-hidden">
            <View className="flex-row items-center justify-between mb-4">
                <Pressable
                    onPress={() => router.back()}
                    className="p-2 rounded-full z-20 bg-gray-100"
                >
                    <Feather name="arrow-left" size={20} color="#333" />
                </Pressable>
                <Text className="text-xl font-bold text-gray-800 flex-1 text-center">
                    {hangoutName}
                </Text>
                <Pressable
                    onPress={handleLeaveHangout}
                    className="p-2 rounded-full z-20 bg-gray-100"
                >
                    <Feather name="log-out" size={20} color="#333" />
                </Pressable>
            </View>

            <StateTabs TABS={TABS} activeTab={activeTab} onChange={handleTabChange} />

            <Animated.View
                style={[{
                    flexGrow: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SCREEN_WIDTH * 2 - 16 * 2,
                }, slidingTab]}
            >
                <View style={{ width: SCREEN_WIDTH - 16 * 2 }}>
                    <ParticipantsTab
                        participants={participants}
                        showInviteModal={showInviteModal}
                        setShowInviteModal={() => setShowInviteModal(true)}
                    />
                </View>
                <View style={{ width: SCREEN_WIDTH - 16 * 2 }}>
                    <ContractTab
                        participants={participants}
                        showMakeContract={showMakeContract}
                        setShowMakeContract={() => setShowMakeContract(true)}
                    />
                </View>
            </Animated.View>


            {/* Invite Modal */}
            {showInviteModal && (
                <>
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        className="absolute inset-0 bg-black/30"
                        style={{ zIndex: 10 }}
                    >
                        <Pressable className="flex-1" onPress={() => setShowInviteModal(false)} />
                    </Animated.View>

                    <Animated.View
                        entering={SlideInDown}
                        exiting={SlideOutDown}
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[80%]"
                        style={{ zIndex: 20 }}
                    >
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold">Invite friend</Text>
                            <Pressable onPress={() => setShowInviteModal(false)}>
                                <Feather name="x" size={24} color="black" />
                            </Pressable>
                        </View>

                        <Text className="text-sm font-medium text-gray-700 mb-1">Copy hang out code below</Text>
                        <View className="flex-row items-center justify-between mb-4 bg-gray-100 rounded px-3 py-2">
                            <Text className="font-mono">{hangoutCode}</Text>
                            <Pressable onPress={copyHangoutCode}>
                                <Feather name="copy" size={18} color="#0D3B66" />
                            </Pressable>
                        </View>

                        <Text className="text-sm font-medium text-gray-700 mb-1">Send to Friend by code</Text>
                        <View className="
                            flex-row items-center
                            px-3 mb-4
                            bg-white
                            border border-gray-300 rounded-lg
                        ">
                            <TextInput
                                value={friendCode}
                                onChangeText={(e) => setFriendCode(e)}
                                className="flex-1 text-black"
                                placeholder="Enter friend code to invite"
                            />
                            <Pressable onPress={onFindFriend}>
                                <Feather name="search" size={18} color="#0D3B66" />
                            </Pressable>
                        </View>

                        {friendProfile.id === 'usernotfound' ? (
                            <Text className="text-red-500 text-sm mb-4">Not found</Text>
                        ) : friendProfile.id !=='' ? (
                            <View className="bg-gray-50 rounded p-3 mb-4">
                                <Text className="font-semibold">{friendProfile.name}</Text>
                                <Text className="text-xs text-gray-500">
                                    #{friendProfile.id}
                                </Text>
                            </View>
                        ) : null}
                        
                        <Pressable
                            onPress={handleSendInvitation}
                            className="bg-[#0D3B66] py-2 rounded-lg items-center mb-6"
                        >
                            <Text className="text-white text-base font-medium">Send</Text>
                        </Pressable>
                    </Animated.View>
                </>
            )}

            {showMakeContract && (
                <>
                    {/* Overlay - static fade */}
                    <Animated.View
                        entering={FadeIn}
                        exiting={FadeOut}
                        className="absolute inset-0 bg-black/30"
                        style={{ zIndex: 45 }}
                    >
                        <Pressable className="flex-1" onPress={() => setShowMakeContract(false)} />
                    </Animated.View>

                    {/* Modal content - slide up */}
                    <Animated.View
                        entering={ZoomIn}
                        exiting={ZoomOut}
                        className="absolute top-1/3 left-[5%] right-[5%] bg-white rounded-2xl p-4 max-h-[80%]"
                        style={{ zIndex: 50 }}
                    >
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold">Choose type</Text>
                            <Pressable onPress={() => setShowMakeContract(false)}>
                                <Feather name="x" size={24} color="black" />
                            </Pressable>
                        </View>

                        <View
                            className='flex-1 gap-4'
                        >
                                <PressableButton
                                    title="Contract"
                                    onPress={handleMakePersonalContract}
                                    bgColor='#0D3B66'
                                    textColor='#fff'
                                />

                                <PressableButton
                                    title="Bill share"
                                    onPress={handleMakeBillShare}
                                />
                        </View>
                    </Animated.View>
                </>
            )}
        </View>
    );
}
