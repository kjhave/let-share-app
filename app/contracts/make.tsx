import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProfileCard from '@/components/ProfileCard'; // reuse if applicable
import { useRouter } from 'expo-router';

type IProfileType = {
    name: string,
    id: string,
}

export default function ContractMakingPage() {
    const router = useRouter();

    const [contractName, setContractName] = useState('');
    const [lenderId, setLenderId] = useState('');
    const [borrowerId, setBorrowerId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const [lenderProfile, setLenderProfile] = useState<IProfileType | null>( null );
    const [borrowerProfile, setBorrowerProfile] = useState<IProfileType | null>( null );

    const handleLenderId = (userId: string) => {
        setLenderId(userId);
        setLenderProfile({
            id: userId,
            name: "mockedLenderName",
        });
    }

    const handleBorrowerId = (userId: string) => {
        setBorrowerId(userId);
        setBorrowerProfile({
            id: userId,
            name: "mockedLenderName",
        });
    }

    const handleAmountChange = (amt: string) => {
        if (!(/^(0|[1-9][0-9]*)?$/.test(amt)))   return;
        setAmount(amt);
    }

    return (
        <ScrollView
            className="flex-1 bg-white p-4"
            contentContainerStyle={{ paddingBottom: 32 }}
        >
            {/* Back button */}
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

            {/* Lender ID Field */}
            <Text className="text-sm font-medium text-gray-700 mb-1 mt-4">Lender ID</Text>
            <TextInput
                value={lenderId}
                onChangeText={handleLenderId}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base"
            />

            <View className="mt-2 mb-4 w-full items-center">
                <View className="w-full px-4 min-h-[80px]">
                    {lenderProfile?.id ? (
                        <ProfileCard name={lenderProfile.name} id={lenderId} />
                    ) : (
                        <Text className="text-sm text-gray-400">No user found</Text>
                    )}
                </View>
            </View>

            {/* Borrower ID Field */}
            <Text className="text-sm font-medium text-gray-700 mb-1">Borrower ID</Text>
            <TextInput
                value={borrowerId}
                onChangeText={handleBorrowerId}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base"
            />

            <View className="mt-2 mb-4 w-full items-center">
                <View className="w-full px-4 min-h-[80px]">
                    {borrowerProfile?.id ? (
                        <ProfileCard name={borrowerProfile.name} id={borrowerId} />
                    ) : (
                        <Text className="text-sm text-gray-400">No user found</Text>
                    )}
                </View>
            </View>

            {/* Amount */}
            <Text className="text-base font-medium mb-1 mt-4">Amount</Text>
            <TextInput
                className="border border-gray-300 rounded-xl px-4 py-2 mb-4"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
            />

            {/* Description */}
            <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
            <TextInput
                value={description}
                onChangeText={(text) => {
                    if (text.length <= 128) setDescription(text)
                }}
                multiline
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base"
                style={{ minHeight: 80 }}
                placeholder="Enter contract description"
            />
            <Text className="text-xs text-gray-400 text-right mt-1">{description.length}/128</Text>

            {/* Submit Button */}
            <Pressable className="bg-[#0D3B66] py-3 rounded-xl items-center">
                <Text className="text-white text-base font-semibold">Create Contract</Text>
            </Pressable>
        </ScrollView>
    );
}
