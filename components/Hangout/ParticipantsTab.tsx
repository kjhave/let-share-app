import { View, Text, Pressable, ScrollView } from 'react-native';

import { Feather } from '@expo/vector-icons';

// services
import { type HangoutParticipant } from '@/services/hangout';
import ParticipantCard from '../ProfileCard';

export default function ParticipantsTab({
    participants,
    showInviteModal,
    setShowInviteModal,
}: {
    participants: HangoutParticipant[],
    showInviteModal: boolean,
    setShowInviteModal: () => void,
}) {
    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 100,
                    width: "100%"
                }}
                showsVerticalScrollIndicator={false}
            >
                {
                    participants.map((participant) => (
                        <ParticipantCard
                            key={participant.id}
                            name={participant.name}
                            id={participant.id}
                        />
                    ))
                }
            </ScrollView>
            
            {!showInviteModal &&
                <View className="absolute bottom-6 left-0 right-0 items-center">
                    <Pressable
                        onPress={setShowInviteModal}
                        className="bg-blue-600 px-6 py-3 rounded-full flex-row items-center shadow-md"
                    >
                        <Feather name="user-plus" size={20} color="white" />
                        <Text className="text-white ml-2 font-semibold text-base">Add User</Text>
                    </Pressable>
                </View>
            }
        </View>
    );
}