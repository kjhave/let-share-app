import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { useToast } from '@/components/ToastContext';
import { useRouter } from 'expo-router';

import { getUserHangoutStatus, type HangoutParticipant } from '@/services/hangout';
import { calculateHangoutContract, getHangoutContracts, relation, submitHangoutRelations, type IContractLog } from '@/services/hangoutContract';
import PressableButton from '../PressableButton';

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

export default function ContractTab({
    participants,
    showMakeContract,
    setShowMakeContract,
}: {
    participants: HangoutParticipant[],
    showMakeContract: boolean,
    setShowMakeContract: () => void,
}) {
    const router = useRouter();
    const { showToast } = useToast();

    const [contracts, setContracts] = useState<IContractLog[]>([]);
    const [contractStatus, setContractStatus] = useState<boolean[]>([]);
    const [selectedCount, setSelectedCount] = useState(0);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailContract, setDetailContract] = useState<IContractLogWithNames|null>(null);

    const [showCalculateModal, setShowCalculateModal] = useState(false);
    const [result, setResult] = useState<{
        user1: {
            id: string,
            name: string,
        },
        user2: {
            id: string,
            name: string,
        },
        amount: number
    }[]>([]);
    
    const fetchContracts = async (): Promise<void> => {
        try {
            const code = await getUserHangoutStatus();

            if (!code) {
                throw new Error("No hangout code found");
            }

            const contracts = await getHangoutContracts();
            setContractStatus(contracts.map(() => false));
            setContracts(contracts
                .filter(p => !p.isSubmitted)
                .map(p => p.contract)
            );
            setSelectedCount(0);
        } catch (error) {
            showToast("Couldn't fetch contracts", { type: "error" });
            console.error("Error fetching contract list:", error);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const handleSelect = (idx: number) => {
        if (contractStatus[idx])    setSelectedCount(prev => prev - 1);
            else    setSelectedCount(prev => prev + 1);

        setContractStatus(prev => {
            const newStatus = [...prev];
            newStatus[idx] = !newStatus[idx];
            return newStatus;
        });
    }

    const findNameById = (id: string): string =>
        participants.find(p => p.id === id)?.name || 'Unknown';

    const handleDetail = (idx: number) => {
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

    const handleCalculate = async () => {
        try {
            const submitContracts = contracts.filter((contract, idx) => contractStatus[idx])
                                            .map(p => p.id);

            const data: relation[] = await calculateHangoutContract({
                submitContracts: submitContracts
            });

            const relations = data.map(p => {
                return {
                    user1: {
                        id: p.userId1,
                        name: findNameById(p.userId1),
                    },
                    user2: {
                        id: p.userId2,
                        name: findNameById(p.userId2),
                    },
                    amount: p.amount
                }
            });

            showToast("Calculated successfully", { type: "success" });
            setResult(relations);
            setShowCalculateModal(true);
        } catch(err) {
            showToast("Something went wrong", { type: "error" });
            console.log("Error calculate hangout contracts: ", err);
        }
    }

    const handleSubmitRelations = async () => {
        try {
            await submitHangoutRelations({
                submitContracts: contracts.filter((contract, idx) => contractStatus[idx])
                                            .map(p => p.id),
                submitRelations: result.map(p => {
                    return {
                        userId1: p.user1.id,
                        userId2: p.user2.id,
                        amount: p.amount
                    }
                })
            });

            showToast("Calculated successfully", { type: "success" });
            setResult([]);
            setShowCalculateModal(false);
            fetchContracts();
        } catch(err) {
            showToast("Something went wrong", { type: "error" });
            console.log("Error submit calculated relations: ", err);
        }
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
                                    backgroundColor: contractStatus[idx]?"#e0f2fe":"#ffffff",
                                    borderColor: contractStatus[idx]?"#38bdf8":"#e5e7eb",
                                    borderWidth: contractStatus[idx]?1:0,
                                }}
                            >
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold max-w-full">Name: {contract.contractName}</Text>
                                    <Text className="text-lg font-semibold max-w-full">Type: {contract.contractSplitters.length === 1? "contract": "bill"}</Text>
                                    <Text className="text-lg font-semibold max-w-full">Total: {contract.contractTotalCost}</Text>
                                </View>

                                <View className="gap-2">
                                    <PressableButton
                                        title="Select"
                                        padding={{x: 16, y: 6}}
                                        bgColor={contractStatus[idx]?"#000":undefined}
                                        borderColor={contractStatus[idx]?"#fff":undefined}
                                        textColor={contractStatus[idx]?"#fff":undefined}
                                        onPress={() => handleSelect(idx)}
                                    />

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

            {!showMakeContract && (selectedCount === 0) &&
                <View className="absolute bottom-6 left-0 right-0 items-center">
                    <Pressable
                        onPress={setShowMakeContract}
                        className="bg-blue-600 px-6 py-3 rounded-full flex-row items-center shadow-md"
                    >
                        <Feather name="file-plus" size={20} color="white" />
                        <Text className="text-white ml-2 font-semibold text-base">Make contract</Text>
                    </Pressable>
                </View>
            }

            {(selectedCount > 0) &&
                <View className="absolute bottom-6 left-0 right-0 items-center">
                    <Pressable
                        onPress={handleCalculate}
                        className="bg-blue-600 px-6 py-3 rounded-full flex-row items-center shadow-md"
                    >
                        <Feather name="activity" size={20} color="white" />
                        <Text className="text-white ml-2 font-semibold text-base">Calculate</Text>
                    </Pressable>
                </View>
            }

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

            {showCalculateModal && result &&
                <Animated.View
                    entering={SlideInDown}
                    exiting={SlideOutDown}
                    className="absolute border-black border-x-2 border-t-2 bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 h-full"
                    style={{ zIndex: 100 }}
                >
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold">Relations after calculated</Text>
                        <Pressable onPress={() => setShowCalculateModal(false)}>
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
                        {result.map((relation, idx) => {
                            return (
                                <View
                                    key={idx}
                                    className=""
                                >
                                    <Text className="text-lg font-semibold mb-1 max-w-full">Creditor: </Text>
                                    <View className="border border-gray-300 rounded-xl px-4 py-2 mb-4">
                                        <Text>Name: {relation.user1.name}</Text>
                                        <Text>Id: {relation.user1.id}</Text>
                                    </View>

                                    <Text className="text-lg font-semibold mb-1 max-w-full">Debtor: </Text>
                                    <View className="border border-gray-300 rounded-xl px-4 py-2 mb-4">
                                        <Text>Name: {relation.user2.name}</Text>
                                        <Text>Id: {relation.user2.id}</Text>
                                    </View>

                                    <Text className="text-lg font-semibold mb-1 max-w-full">Amount: {relation.amount}</Text>

                                    <View className="h-px bg-black my-2" />
                                </View>
                            );
                        })}
                    </ScrollView>
                    <View className="absolute bottom-6 left-0 right-0 items-center">
                        <Pressable
                            onPress={handleSubmitRelations}
                            className="bg-blue-600 px-6 py-3 rounded-full flex-row items-center shadow-md"
                        >
                            <Feather name="send" size={20} color="white" />
                            <Text className="text-white ml-2 font-semibold text-base">Submit</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            }
        </View>
    );
}