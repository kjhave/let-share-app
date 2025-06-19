import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { useToast } from '@/components/ToastContext';

import { getUserHangoutStatus } from '@/services/hangout';
import { getHangoutContracts, type IContractLog } from '@/services/hangoutContract';
import PressableButton from '@/components/PressableButton';
import { getContactInforList } from '@/services/account';
import { getContractLog } from '@/services/contract';

type IContractLogWithNames = Omit<IContractLog, 'contractPayer' | 'contractSplitters'> & {
    contractPayer: string;
    contractPayerName: string;
    contractSplitters: Array<{
        userId: string;
        userName: string;
        itemList: Array<{
            itemName: string;
            itemPrice: number;
        }>;
    }>;
};

export default function LogScreen() {
    const { showToast } = useToast();

    const [contracts, setContracts] = useState<IContractLog[]>([]);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailContract, setDetailContract] = useState<IContractLogWithNames|null>(null);

    
    const fetchContracts = async (): Promise<void> => {
        try {
            const contracts = await getContractLog();
            setContracts(contracts);
        } catch (error) {
            showToast("Couldn't fetch contracts", { type: "error" });
            console.error("Error fetching contract list:", error);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const handleDetail = async (idx: number) => {
        const IdSet: string[] = [];
        IdSet.push(contracts[idx].contractPayer);
        contracts[idx].contractSplitters.forEach(splitter => {
            IdSet.push(splitter.userId);
        });

        const stakeholders = await getContactInforList(IdSet);

        const findNameById = (id: string): string =>
            stakeholders.find(p => p.userId === id)?.name || 'Unknown';

        const contract = {
            ...contracts[idx],
            contractPayerName: findNameById(contracts[idx].contractPayer),
            contractSplitters: contracts[idx].contractSplitters.map(splitter => ({
                ...splitter,
                userName: findNameById(splitter.userId),
            }))
        };

        setDetailContract(contract);
        setShowDetailModal(true);
    }

    const handleCalculateToltal = (
        splitter: {
            userId: string;
            userName: string;
            itemList: Array<{
                itemName: string;
                itemPrice: number;
            }>
        }
    ): number => {
        return splitter.itemList.reduce((sum, item) => sum += item.itemPrice, 0);
    }

    return (
        <View className="flex-1 bg-white px-4">
            <View className="flex-row items-center justify-between py-2 px-4 my-4 border-2 border-black rounded-xl">
                <Text className="text-xl font-bold text-gray-800 flex-1 text-center">
                    Contract History
                </Text>

                <Pressable
                    onPress={fetchContracts}
                    className="rounded-full z-20 bg-gray-100"
                >
                    <Feather name="repeat" size={20} color="#333" />
                </Pressable>
            </View>

            <View className="flex-1 bg-white">

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        paddingTop: 16,
                        paddingBottom: 100,
                        paddingHorizontal: 16,
                        width: "100%"
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {contracts.map((contract, idx) => {
                        return (
                            <View
                                key={idx}
                                className="flex flex-row gap-4 p-4 rounded-2xl mb-3 -mx-4"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 4, height: 2 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 10,
                                    elevation: 6,
                                    backgroundColor: "#ffffff",
                                    borderColor: "#e5e7eb",
                                }}
                            >
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold max-w-full">Name: {contract.contractName}</Text>
                                    <Text className="text-lg font-semibold max-w-full">Type: {contract.contractSplitters.length === 1? "contract": "bill"}</Text>
                                    <Text className="text-lg font-semibold max-w-full">Total: {contract.contractTotalCost}</Text>
                                </View>

                                <View className="gap-2">
                                    <PressableButton
                                        title="Detail"
                                        padding={{x: 16, y: 6}}
                                        onPress={() => handleDetail(idx)}
                                    />
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>

                {showDetailModal && detailContract &&
                    <Animated.View
                        entering={SlideInDown}
                        exiting={SlideOutDown}
                        className="absolute border-black border-x-2 border-t-2 bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 h-full"
                        style={{ zIndex: 100 }}
                    >
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-semibold">Contract Information</Text>
                            <Pressable onPress={() => setShowDetailModal(false)}>
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
                            <Text className="text-lg font-semibold mb-1 max-w-full">Name: </Text>
                            <Text className="border border-gray-300 rounded-xl px-4 py-2 mb-4">{detailContract.contractName}</Text>

                            <Text className="text-lg font-semibold max-w-full">Type: {detailContract.contractSplitters.length === 1? "contract": "bill"}</Text>

                            <Text className="text-lg font-semibold mb-1 max-w-full">Payer: </Text>
                            <View className="border border-gray-300 rounded-xl px-4 py-2 mb-4">
                                <Text>Name: {detailContract.contractPayerName}</Text>
                                <Text>Id: {detailContract.contractPayer}</Text>
                            </View>

                            <Text className="text-lg font-semibold mb-1 max-w-full">Splitters: </Text>

                            {detailContract.contractSplitters.map((splitter, idx) => {
                                return (
                                    <View
                                        key={idx}
                                    >
                                        <View className="border border-gray-300 rounded-xl px-4 py-2 mb-4">
                                            <Text>Name: {splitter.userName}</Text>
                                            <Text>Id: {splitter.userId}</Text>
                                        </View>

                                        {splitter.itemList.map((item, itemId) => {
                                            return (
                                                <View
                                                    key={itemId}
                                                    className={"flex flex-row justify-between"}
                                                >
                                                    <Text>{item.itemName}</Text>
                                                    <Text>{item.itemPrice}</Text>
                                                </View>
                                            );
                                        })}

                                        <View
                                            className={"flex flex-row justify-between"}
                                        >
                                            <Text>Total:</Text>
                                            <Text>{handleCalculateToltal(splitter)}</Text>
                                        </View>

                                        <View className="h-px bg-black mt-4 mb-8" />
                                    </View>
                                );
                            })}

                            <Text className="text-lg font-semibold max-w-full">Total: {detailContract.contractTotalCost}</Text>

                            <Text className="text-lg font-semibold max-w-full mb-1">Description</Text>
                            <Text
                                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base"
                                style={{ minHeight: 80 }}
                            >
                                {detailContract.contractDescription}
                            </Text>
                        </ScrollView>
                    </Animated.View>
                }
            </View>
        </View>
    );
}