import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProfileCard from '@/components/ProfileCard';
import DropDownList from '@/components/DropDownList';
import { useRouter } from 'expo-router';
import { makeContract } from '@/services/contract';
import { getContactInfor } from '@/services/account';

type IProfileType = {
    name: string,
    id: string,
}

export default function ContractMakingPage() {
    const router = useRouter();

    //lender state
    const [lenderId, setLenderId] = useState('');
    const [lenderProfile, setLenderProfile] = useState<IProfileType | null>( null );
    const [showLenderDropdown, setShowLenderDropdown] = useState(false);

    //borrower state
    const [borrowerId, setBorrowerId] = useState('');
    const [borrowerProfile, setBorrowerProfile] = useState<IProfileType | null>( null );
    const [showBorrowerDropdown, setShowBorrowerDropdown] = useState(false);

    //share state
    const [contractName, setContractName] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [friendList, setFriendList] = useState<{ id: string; name: string }[]>([]);


    const handleLenderId = (userId: string) => {
        setLenderId(userId);
    }

    const handleSearchLender = async () => {
        try {
            const profile = await getContactInfor(lenderId);
            if (profile === null || !profile.name)
                throw new Error("User not found");

            setLenderProfile({
                id: lenderId,
                name: profile.name
            });
        } catch(err) {
            console.log("Error while fetching lender Profile", err);
            setLenderProfile({
                id: "User not found",
                name: "User not found"
            });
        }
    }

    const selectLender = (item: any) => {
        if (item === null || !item.id || !item.name){
            setLenderProfile({
                id: "User not found",
                name: "User not found"
            });
            return;
        }

        setLenderId(item.id);
        setLenderProfile({
            id: item.id,
            name: item.name
        })
    }

    const handleBorrowerId = async (userId: string) => {
        setBorrowerId(userId);
        try {
            const profile = await getContactInfor(userId);
            if (profile === null || !profile.name){
                setBorrowerProfile({
                    id: "User not found",
                    name: "User not found"
                });
                return;
            }

            setBorrowerProfile({
                id: userId,
                name: profile.name
            });
        } catch(err) {
            console.log("Error while fetching borrower Profile", err);
            setBorrowerProfile({
                id: "User not found",
                name: "User not found"
            });
        }
    }

    const handleAmountChange = (amt: string) => {
        if (!(/^(0|[1-9][0-9]*)?$/.test(amt)))   return;
        setAmount(amt);
    }

    const handleMakeContract = async () => {
        if (!amount)    return;
        await makeContract(lenderId, borrowerId, parseInt(amount, 10));
    }

    return (
        <View
            className="flex-1 bg-white p-4"
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
                <View className="flex-row items-center space-x-2 mb-2 gap-2">
                    <TextInput
                        value={lenderId}
                        onChangeText={handleLenderId}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-white text-base"
                        placeholder="Enter Lender ID"
                    />
                    <Pressable
                        className="p-2 border border-gray-300 rounded-lg"
                        onPress={handleSearchLender}
                    >
                        <Feather name="search" size={20} color="black" />
                    </Pressable>
                    <Pressable
                        className="p-2 border border-gray-300 rounded-lg"
                        onPress={() => setShowLenderDropdown(true)}
                    >
                        <Feather name="chevron-down" size={20} color="black" />
                    </Pressable>
                </View>

                <DropDownList
                    items={friendList}
                    onSelect={(item) => selectLender(item)}
                    isVisible={showLenderDropdown}
                    onClose={() => setShowLenderDropdown(false)}
                />

                {/* Profile preview */}
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
            <Pressable
                className="bg-[#0D3B66] py-3 rounded-xl items-center"
                onPress={handleMakeContract}
            >
                <Text className="text-white text-base font-semibold">Create Contract</Text>
            </Pressable>
        </View>
    );
}
