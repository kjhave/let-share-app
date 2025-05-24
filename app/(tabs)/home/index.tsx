import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchSecurely } from '@/utils/storage';
import PressableButton from '@/components/PressableButton';
import { useRouter } from 'expo-router';

export default function HomeTabScreen() {
    const [userName, setUserName] = useState<string>("khanh");
    const [userId, setUserId] = useState<string>("#0");

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

        fetchUser();
    }, []);

    if (!userName || !userId) {
        return <Text>Loading user...</Text>;
    }

    const router = useRouter();

    const handleContractMakingFunction = () => {
        router.push('/contracts/make');
    }

    const handlePayBillFunction = () => {
        router.push('/contracts/bill');
    }

    const handleShowFinancialRelationship = () => {

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

                <PressableButton title={"Show Financial Relationships"} onPress={handleShowFinancialRelationship} />
            </View>
        </View>
    );
}
