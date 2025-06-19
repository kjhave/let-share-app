import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { fetchSecurely } from '@/utils/storage';
import PressableButton from '@/components/PressableButton';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { getFinancialRelationshipList, type financialLinkedUserType } from '@/services/contract';

export default function HomeTabScreen() {
    const [userName, setUserName] = useState<string>("khanh");
    const [userId, setUserId] = useState<string>("#0");

    const [financialRelationship, setFinancialRelationship] = useState<financialLinkedUserType[]>([]);

    const fetchUserfinancialRelationships = async () => {
        try {
            const data = await getFinancialRelationshipList();
            setFinancialRelationship(data);
        } catch(err) {
            console.log("Error fetching user finanacial relationship set: ", err);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            const storedName = await fetchSecurely('name');
            const storedUserId = await fetchSecurely('userId');
            console.log(storedName, storedUserId);
            if (storedName) {
                setUserName(storedName);
            }

            if (storedUserId) {
                setUserId(storedUserId);
            }
        };

        fetchUserfinancialRelationships();
        fetchUser();
    }, []);

    if (!userName || !userId) {
        return <Text>Loading user...</Text>;
    }

    const router = useRouter();

    const handleContractMakingFunction = () => {
        router.push({
            pathname: '/contracts/[mode]/make',
            params: { mode: 'normal' },
        });
    }

    const handlePayBillFunction = () => {
        router.push({
            pathname: '/contracts/[mode]/make',
            params: { mode: 'normal' },
        });
    }

    const handleHangOutFunction = () => {
        router.push('/contracts/hangout');
    }

    const [showFinancialRelationship, setShowFinancialRelationship] = useState(false);

    const handleShowFinancialRelationship = () => {
        setShowFinancialRelationship(true);
    }

    return (
        <View className="flex-1 bg-white p-4">
            {/* Header section */}
            <View className="bg-[#0D3B66] rounded-xl p-6 mb-8 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-[#FFFFFF]">Let Share</Text>
                <View className="items-end">
                    <Text className="text-lg text-[#FFFFFF] font-semibold">{userName}</Text>
                    <Text className="text-sm text-[#B0CDEB]">{userId}</Text>
                </View>
            </View>

            {/* Body section */}
            <View className="flex gap-4 space-y-4">
                <PressableButton title={"Make Contract"} onPress={handleContractMakingFunction} />

                <PressableButton title={"Pay Bill"} onPress={handlePayBillFunction} />

                <PressableButton title={"Let's Hang Out"} onPress={handleHangOutFunction} />

                <PressableButton title={"Show Financial Relationships"} onPress={handleShowFinancialRelationship} />
            </View>

            {showFinancialRelationship &&
                <Animated.View
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    className="absolute border-black border-x-2 border-t-2 bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 h-full"
                    style={{ zIndex: 100 }}
                >
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold">User finanacial relations</Text>
                        <Pressable onPress={() => setShowFinancialRelationship(false)}>
                            <Feather name="x" size={24} color="black" />
                        </Pressable>
                    </View>

                    <ScrollView
                        contentContainerStyle={{
                            paddingTop: 16,
                            paddingBottom: 100,
                            paddingHorizontal: 16,
                            width: "100%",
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {financialRelationship.map((relation, idx) => {
                            return (
                                <View
                                    key={idx}
                                    className=""
                                >
                                    <Text className="text-lg font-semibold mb-1 max-w-full">User: </Text>
                                    <View className="border border-gray-300 rounded-xl px-4 py-2 mb-4">
                                        <Text>Name: {relation.name}</Text>
                                        <Text>Id: {relation.userId}</Text>
                                    </View>

                                    <Text className="text-lg font-semibold mb-1 max-w-full">{relation.amount>0?"Type: Debtor":"Type: Creditor"}</Text>

                                    <Text className="text-lg font-semibold mb-1 max-w-full">Amount: {Math.abs(relation.amount)}</Text>

                                    <View className="h-px bg-black my-2" />
                                </View>
                            );
                        })}
                    </ScrollView>
                </Animated.View>
            }
        </View>
    );
}
