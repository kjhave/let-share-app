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

import ContractSplitterForm, { type IContractSplitter} from '@/components/ContractSplitterForm';

export default function PayBillPage() {
    const router = useRouter();
     const { mode } = useLocalSearchParams();
    const { showToast } = useToast();

    const allowedModes = ['normal', 'hangout'] as const;
    type Mode = typeof allowedModes[number];

    const [contractName, setContractName] = useState('');
    const [splitters, setSplitters] = useState<IContractSplitter[]>([]);
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
            { userId: '', itemList: [], amount: 0 }
        ]);
    };

    const handleSetSplitter = (splitter: IContractSplitter, idx: number) => {
        const updated = [...splitters];
        setTotalAmount(totalAmount - updated[idx].amount + splitter.amount);

        updated[idx] = splitter;

        setSplitters(updated);
    }

    const removeSplitter = (index: number) => {
        const newTotalAmount = totalAmount - splitters[index].amount;
        setTotalAmount(newTotalAmount)

        setSplitters(prev => prev.filter((_, i) => i !== index));
    };

    const handleMakeBillShare = async () => {
        try {
            const contractSplitters = splitters.map(splitter => ({
                userId: splitter.userId || '',
                itemList: splitter.itemList.map(item => {
                    return {
                        itemName: item.itemName,
                        itemPrice: parseInt(item.itemPrice || "0", 10),
                    };
                }),
            }));
            
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

            {/* Splitters Section */}
            <Text className="text-base font-medium mb-2">Splitters</Text>
            <Text className="text-xs text-gray-500 mb-4">
                *Including yourself
            </Text>

            {splitters.map((splitter, index) => (
                <ContractSplitterForm
                    key={index}
                    splitter={splitter}
                    setSplitter={(splitter: IContractSplitter) => handleSetSplitter(splitter, index)}
                    removeSplitter={() => removeSplitter(index)}
                />
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