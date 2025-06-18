import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProfileCard from '@/components/ProfileCard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchSecurely } from '@/utils/storage';
import { useToast } from '@/components/ToastContext';
import { makeBillShare } from '@/services/contract';
import { getContactInfor } from '@/services/account';
import { makeHangoutBillShare } from '@/services/hangoutContract';

type IProfileType = {
    name: string;
    id: string;
};

type ISplitter = {
    code: string;
    profile: IProfileType | null;
    amount: string;
    canUpdated: boolean;
};

export default function PayBillPage() {
    const router = useRouter();
     const { mode } = useLocalSearchParams();
    const { showToast } = useToast();

    const allowedModes = ['normal', 'hangout'] as const;
    type Mode = typeof allowedModes[number];

    const [contractName, setContractName] = useState('');
    const [userAmount, setUserAmount] = useState('');
    const [splitters, setSplitters] = useState<ISplitter[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [description, setDescription] = useState('');

    const [userId, setUserId] = useState("");
    
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const user = await fetchSecurely("userId");
                setUserId(user);
            } catch (err) {
                console.error("Error fetching user id:", err);
            }
        }

        fetchUserId();
    }, []);

    const addSplitter = () => {
        setSplitters(prev => [
            ...prev,
            { id: '', profile: null, amount: '' , code: '', canUpdated: true }
        ]);
    };

    const removeSplitter = (index: number) => {
        const newTotalAmount = totalAmount - parseInt(splitters[index].amount || '0', 10);
        setTotalAmount(newTotalAmount)

        setSplitters(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateSplitter = async (index: number) => {
        const updated = [...splitters];
        const code = updated[index].code;

        try {
            const profile = await getContactInfor(code);
            updated[index].profile = { id: profile.userId || '', name: profile.name || 'Not found' };
        } catch (err) {
            // console.error("Error fetching profile:", err);
            updated[index].profile = { id: '', name: 'Not found' };
        }
        finally {
            updated[index].canUpdated = true;
            setSplitters(updated);
        }
    }

    const handleSplitterCodeChange = async (index: number, code: string) => {
        const updated = [...splitters];
        updated[index].code = code;

        if (updated[index].canUpdated) {
            updated[index].canUpdated = false;
            setTimeout(() => handleUpdateSplitter(index), 1000);
        }

        setSplitters(updated);
    };

    const handleUserAmountChange = (amt: string) => {
        if (!(/^(0|[1-9][0-9]*)?$/.test(amt)))   return;

        const newTotalAmount = totalAmount + parseInt(amt || '0', 10) - parseInt(userAmount || '0', 10);
        setTotalAmount(newTotalAmount);
        
        setUserAmount(amt);
    }

    const handleSplitterAmountChange = (index: number, amt: string) => {
        if (!(/^(0|[1-9][0-9]*)?$/.test(amt)))   return;
        const updated = [...splitters];

        const newTotalAmount = totalAmount + parseInt(amt || '0', 10) - parseInt(updated[index].amount || '0', 10);
        setTotalAmount(newTotalAmount);
        
        updated[index].amount = amt;
        setSplitters(updated);
    };

    const handleMakeBillShare = async () => {
        try {
            const payerAmount = parseInt(userAmount || '0', 10);
            const contractSplitters = splitters.map(splitter => ({
                userId: splitter.profile?.id || '',
                itemList: [{
                    itemName: "Money",
                    itemPrice: parseInt(splitter.amount || '0', 10)
                }]
            }));

            if (payerAmount > 0)
                contractSplitters.push({
                    userId: userId,
                    itemList: [{
                        itemName: "Money",
                        itemPrice: payerAmount
                    }]
                });
            
            if (mode === "normal" ){
                await makeBillShare({
                    name: contractName,
                    contractPayer: userId,
                    contractSplitters: contractSplitters,
                    description,
                    totalAmount: totalAmount
                });
            } else if (mode === "hangout"){
                await makeHangoutBillShare({
                    name: contractName,
                    contractPayer: userId,
                    contractSplitters: contractSplitters,
                    description,
                    totalAmount: totalAmount
                });
            }

            showToast("Bill share created successfully", { type: 'success' });
            router.back();
        } catch (err) {
            showToast("Failed to create bill share", { type: 'error' });
            console.log("Error making bill share:", err);
        }
    }

    return (
        <ScrollView className="flex-1 bg-white p-4" contentContainerStyle={{ paddingBottom: 32 }}>
            {/* Back Button */}
            <Pressable onPress={() => router.back()} className="mb-4 w-10 h-10 justify-center items-center">
                <Feather name="home" size={24} color="black" />
            </Pressable>

            {/* Contract Name */}
            <Text className="text-base font-medium mb-1">Contract Name</Text>
            <TextInput
                className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
                placeholder="Enter contract name"
                value={contractName}
                onChangeText={setContractName}
            />

            {/* Payer */}
            <Text className="text-sm font-medium text-gray-700 mb-1">Your Amount</Text>
            <TextInput
                value={userAmount}
                onChangeText={handleUserAmountChange}
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mb-4"
            />

            {/* Splitters Section */}
            <Text className="text-base font-medium mb-2">Other splitters</Text>

            {splitters.map((splitter, index) => (
                <View
                    key={index}
                    className="relative w-[94%] self-center bg-gray-50 border border-gray-200 rounded-xl px-4 pb-3 pt-6 mb-3"
                >
                    <Pressable
                        onPress={() => removeSplitter(index)}
                        className="absolute right-2 top-2 z-10"
                    >
                        <Feather name="x-circle" size={28} color="black" />
                    </Pressable>

                    <Text className="text-sm font-medium text-gray-700 mb-1">Splitter Code</Text>

                    <TextInput
                        value={splitter.code}
                        onChangeText={(code) => handleSplitterCodeChange(index, code)}
                        placeholder="Splitter Code"
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mb-2"
                    />

                    <View className="w-['95%'] px-4 min-h-[80px] self-end">
                        {splitter.profile?.id ? (
                            <ProfileCard name={splitter.profile.name} id={splitter.profile.id} />
                        ) : (
                            <Text className="text-sm text-gray-400">No user found</Text>
                        )}
                    </View>

                    <Text className="text-sm font-medium text-gray-700 mb-1">Splitter Amount</Text>

                    <TextInput
                        value={splitter.amount}
                        onChangeText={(amt) => handleSplitterAmountChange(index, amt)}
                        keyboardType="numeric"
                        placeholder="Amount"
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mt-2"
                    />
                </View>
            ))}

            {/* + Add Splitter */}
            <Pressable onPress={addSplitter} className="w-full items-center mb-4">
                <Feather name="plus-circle" size={28} color="#0D3B66" />
            </Pressable>

            {/* Total Amount */}
            <Text className="text-sm font-medium text-gray-700 mb-1">Total Amount</Text>
            <Text className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-300 text-base mb-4">
                {totalAmount}
            </Text>

            {/* Description */}
            <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
            <TextInput
                value={description}
                onChangeText={(text) => {
                    if (text.length <= 128) setDescription(text);
                }}
                multiline
                placeholder="Enter contract description"
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base"
                style={{ minHeight: 80 }}
            />
            <Text className="text-xs text-gray-400 text-right mt-1">{description.length}/128</Text>

            {/* Submit */}
            <Pressable
                className="bg-[#0D3B66] py-3 rounded-xl items-center mt-4"
                onPress={handleMakeBillShare}
            >
                <Text className="text-white text-base font-semibold">Create Bill Share</Text>
            </Pressable>
        </ScrollView>
    );
}