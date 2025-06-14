import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';

// services
import { getHangoutParticipants, type HangoutParticipant, getUserHangoutStatus } from '@/services/hangout';
import ParticipantCard from '../ProfileCard';
import { fetchSecurely } from '@/utils/storage';

export default function ParticipantsTab() {
    const [participants, setParticipants] = useState<HangoutParticipant[]>([]);
    const [userId, setUserId] = useState<{id: string, name: string}|null>(null);

    const fetchParticipants = async (): Promise<void> => {
        try {
            const code = await getUserHangoutStatus();

            if (!code) {
                throw new Error("No hangout code found");
            }

            const friends = await getHangoutParticipants(code);
            setParticipants(friends);
        } catch (error) {
            console.error("Error fetching participant list:", error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = { id: '', name: '' };
                user.id = await fetchSecurely('userId');
                user.name = await fetchSecurely('name');

                setUserId(user);
            } catch (error) {
                console.error("Error fetching host:", error);
            }
        };

        fetchUser();
        fetchParticipants();
    }, []);

    return (
        <View className="py-4">
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 32,
                    width: '100%'
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
        </View>
    );
}