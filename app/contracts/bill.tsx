import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProfileCard from '@/components/ProfileCard';
import { useRouter } from 'expo-router';

type IProfileType = {
    name: string;
    id: string;
};

type ISplitter = {
    id: string;
    profile: IProfileType | null;
    amount: string;
};

export default function ContractMaking1ToNPage() {
    const router = useRouter();

    const [contractName, setContractName] = useState('');
    const [payerId, setPayerId] = useState('');
    const [payerProfile, setPayerProfile] = useState<IProfileType | null>(null);
    const [payerAmount, setPayerAmount] = useState('');
    const [splitters, setSplitters] = useState<ISplitter[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [description, setDescription] = useState('');

    const handlePayerId = (userId: string) => {
        setPayerId(userId);
        setPayerProfile({ id: userId, name: 'mockedPayerName' });
    };

    const addSplitter = () => {
        setSplitters(prev => [
            ...prev,
            { id: '', profile: null, amount: '' }
        ]);
    };

    const removeSplitter = (index: number) => {
        const newTotalAmount = totalAmount - parseInt(splitters[index].amount || '0', 10);
        setTotalAmount(newTotalAmount)

        setSplitters(prev => prev.filter((_, i) => i !== index));
    };;

    const handleSplitterIdChange = (index: number, id: string) => {
        const updated = [...splitters];
        updated[index].id = id;
        updated[index].profile = { id, name: `MockedSplitter${index + 1}` };
        setSplitters(updated);
    };

    const handlePayerAmountChange = (amt: string) => {
        if (!(/^(0|[1-9][0-9]*)?$/.test(amt)))   return;

        const newTotalAmount = totalAmount + parseInt(amt || '0', 10) - parseInt(payerAmount || '0', 10);
        setTotalAmount(newTotalAmount);
        
        setPayerAmount(amt);
    }

    const handleSplitterAmountChange = (index: number, amt: string) => {
        if (!(/^(0|[1-9][0-9]*)?$/.test(amt)))   return;
        const updated = [...splitters];

        const newTotalAmount = totalAmount + parseInt(amt || '0', 10) - parseInt(updated[index].amount || '0', 10);
        setTotalAmount(newTotalAmount);
        
        updated[index].amount = amt;
        setSplitters(updated);
    };

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
            <Text className="text-sm font-medium text-gray-700 mb-1 mt-4">Payer ID</Text>
            <TextInput
                value={payerId}
                onChangeText={handlePayerId}
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base"
            />
            <View className="mt-2 mb-2 w-full items-center">
                <View className="w-full px-4 min-h-[80px]">
                    {payerProfile ? (
                        <ProfileCard name={payerProfile.name} id={payerId} />
                    ) : (
                        <Text className="text-sm text-gray-400">No user found</Text>
                    )}
                </View>
            </View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Payer Amount</Text>
            <TextInput
                value={payerAmount}
                onChangeText={handlePayerAmountChange}
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mb-4"
            />

            {/* Splitters Section */}
            <Text className="text-base font-medium mb-2">Splitters</Text>

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

                    <Text className="text-sm font-medium text-gray-700 mb-1">Splitter ID</Text>

                    <TextInput
                        value={splitter.id}
                        onChangeText={(id) => handleSplitterIdChange(index, id)}
                        placeholder="Splitter ID"
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mb-2"
                    />

                    <View className="w-['95%'] px-4 min-h-[80px] self-end">
                        {splitter.profile?.id ? (
                            <ProfileCard name={splitter.profile.name} id={splitter.id} />
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
            <Pressable className="bg-[#0D3B66] py-3 rounded-xl items-center mt-4">
                <Text className="text-white text-base font-semibold">Create Bill Share</Text>
            </Pressable>
        </ScrollView>
    );
}