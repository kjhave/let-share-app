import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProfileCard from '@/components/ProfileCard';
import { useRouter } from 'expo-router';
import { makeContract } from '@/services/contract';
import { fetchSecurely } from '@/utils/storage';
import { getContactInfor } from '@/services/account';
import { useToast } from '@/components/ToastContext';
import { useDebouncedValue } from '@/hooks';

type IProfileType = {
    name: string,
    id: string,
}

export default function ContractMakingPage() {
    const router = useRouter();

    const [otherCode, setOtherCode] = useState('');
    const debouncedCode = useDebouncedValue(otherCode, 400);
    const [otherProfile, setOtherProfile] = useState<IProfileType>({ name: '', id: '' });
    const fetchOtherIdRef = useRef(0);

    useEffect(() => {
        if (!debouncedCode.trim()) {
            setOtherProfile({ name: '', id: '' });
            return;
        }

        const fetchOtherId = ++fetchOtherIdRef.current;
        const fetchResults = async () => {
            try {
                const res = await getContactInfor(otherCode);

                if (fetchOtherId === fetchOtherIdRef.current) {
                    setOtherProfile({ id: res.userId, name: res.name });
                }
            } catch (err) {
                if (fetchOtherId === fetchOtherIdRef.current) {
                    setOtherProfile({ name: '', id: '' });
                }
            }
        };

        fetchResults();
    }, [debouncedCode]);

    const [contractName, setContractName] = useState('');
    const [contractType, setContractType] = useState<'lend' | 'borrow'>('lend');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    
    const [userId, setUserId] = useState("");

    const { showToast } = useToast();
    
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

    const handleAmountChange = (amt: string) => {
        if (!(/^(0|[1-9][0-9]*)?$/.test(amt)))   return;
        setAmount(amt);
    }

    const handleMakeContract = async () => {
        if (!amount)    return;
        try {
            const fromId    = contractType === 'lend' ? userId : otherProfile.id;
            const toId      = contractType === 'lend' ? otherProfile.id : userId;
            await makeContract({
                name: contractName,
                fromId: fromId,
                toId: toId,
                amount: parseInt(amount, 10),
                description: description
            });

            showToast('Contract created successfully!', { type: 'success' });
        router.back();
        } catch(err){
            showToast('Failed to created contract!', { type: 'error' });
            console.log("Error when making contract: ", err);
        }
    }

    return (
        <View className='flex-1 bg-white relative'>
            <KeyboardAvoidingView
                className="flex-1 bg-white"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ padding: 16 }}
                    keyboardShouldPersistTaps="handled"
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

                    {/* Contract Type */}
                    <Text className="text-base font-medium mb-1">Contract Type</Text>
                    <View className="flex-row mb-2 gap-2">
                        <Pressable
                            className={`px-4 py-2 rounded-lg border ${
                                contractType === 'lend' ? 'bg-[#0D3B66]' : 'bg-white'
                            }`}
                            onPress={() => setContractType('lend')}
                        >
                            <Text className={contractType === 'lend' ? 'text-white' : 'text-black'}>
                                Lend
                            </Text>
                        </Pressable>
                        <Pressable
                            className={`px-4 py-2 rounded-lg border ${
                                contractType === 'borrow' ? 'bg-[#0D3B66]' : 'bg-white'
                            }`}
                            onPress={() => setContractType('borrow')}
                        >
                            <Text className={contractType === 'borrow' ? 'text-white' : 'text-black'}>
                                Borrow
                            </Text>
                        </Pressable>
                    </View>
                    <Text className="text-xs text-gray-500 mb-4">
                        You are the {contractType === 'lend' ? 'lender' : 'borrower'} in this contract.
                    </Text>

                    {/* otherID Field */}
                    <Text className="text-sm font-medium text-gray-700 mb-1">Contract with (ID)</Text>

                    <TextInput
                        value={otherCode}
                        onChangeText={setOtherCode}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-white text-base"
                        placeholder="Input Code"
                    />

                    {/* Profile preview */}
                    <View className="mt-2 mb-4 w-full items-center">
                        <View className="w-full px-4 min-h-[80px]">
                            {otherProfile?.id ? (
                                <ProfileCard name={otherProfile.name} id={otherProfile.id} />
                            ) : (
                                <Text className="text-sm text-gray-400">Not found</Text>
                            )}
                        </View>
                    </View>

                    {/* Amount */}
                    <Text className="text-base font-medium mb-1">Amount</Text>
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
                            if (text.length <= 128) setDescription(text);
                        }}
                        multiline
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base"
                        style={{ minHeight: 80 }}
                        placeholder="Enter contract description"
                    />
                    <Text className="text-xs text-gray-400 text-right mt-1">
                        {description.length}/128
                    </Text>

                    {/* Submit Button */}
                    <Pressable
                        className="bg-[#0D3B66] py-3 rounded-xl items-center mt-6"
                        onPress={handleMakeContract}
                    >
                        <Text className="text-white text-base font-semibold">Create Contract</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>

        </View>
    );
}
