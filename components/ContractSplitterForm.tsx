import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ProfileCard from './ProfileCard';
import { useDebouncedValue } from '@/hooks';
import { getContactInfor } from '@/services/account';

export type IContractSplitter = {
    userId: string;
    itemList: Array<{
        itemName: string,
        itemPrice: string,
    }>;
    amount: number;
};

export default function ContractSplitterForm({
    splitter,
    setSplitter,
    removeSplitter,
}: {
    splitter: IContractSplitter,
    setSplitter: (splitter: IContractSplitter) => void,
    removeSplitter: () => void,
}) {
    const [splitterCode, setSplitterCode] = useState('');
    const debouncedCode = useDebouncedValue(splitterCode, 400);
    const [profile, setProfile] = useState<{ name: string, id: string }>({ name: '', id: '' });
    const fetchIdRef = useRef(0);

    useEffect(() => {
        if (!debouncedCode.trim()) {
            setProfile({ name: '', id: '' });
            return;
        }

        const fetchOtherId = ++fetchIdRef.current;
        const fetchResults = async () => {
            try {
                const res = await getContactInfor(splitterCode);

                if (fetchOtherId === fetchIdRef.current) {
                    setProfile({ id: res.userId, name: res.name });
                    setSplitter({
                        ...splitter,
                        userId: res.userId
                    });
                }
            } catch (err) {
                if (fetchOtherId === fetchIdRef.current) {
                    setProfile({ name: '', id: '' });
                }
            }
        };

        fetchResults();
    }, [debouncedCode]);

    const handleChangeItemName = (name: string, idx: number) => {
        const updated = [...splitter.itemList];
        
        updated[idx].itemName = name;

        setSplitter({
            ...splitter,
            itemList: updated,
        });
    };

    const handleChangeItemPrice = (price: string, idx: number) => {
        if (!(/^(0|[1-9][0-9]*)?$/.test(price)))   return;
        const updated = [...splitter.itemList];

        const newTotalAmount = splitter.amount + parseInt(price || '0', 10) - parseInt(updated[idx].itemPrice || '0', 10);
        updated[idx].itemPrice = price;

        setSplitter({
            ...splitter,
            itemList: updated,
            amount: newTotalAmount
        });
    };

    const addItem = () => {
        const newItemSet = splitter.itemList;
        newItemSet.push({
            itemName: "",
            itemPrice: "",
        });

        setSplitter({
            ...splitter,
            itemList: newItemSet,
        });
    }

    const removeItem = (idx: number) => {
        setSplitter({
            ...splitter,
            itemList: splitter.itemList.filter((_, i) => i !== idx),
            amount: splitter.amount - parseInt(splitter.itemList[idx].itemPrice || "0", 10),
        });
    }

    return (
        <View
            className="relative w-[94%] self-center bg-gray-50 border border-gray-200 rounded-xl px-4 pb-3 pt-6 mb-3"
        >
            <Pressable
                onPress={() => removeSplitter()}
                className="absolute right-2 top-2 z-10"
            >
                <Feather name="x-circle" size={28} color="black" />
            </Pressable>

            <Text className="text-sm font-medium text-gray-700 mb-1">Splitter Code</Text>

            <TextInput
                value={splitterCode}
                onChangeText={setSplitterCode}
                placeholder="Splitter Code"
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mb-2"
            />

            <View className="w-['95%'] px-4 min-h-[80px] self-end">
                {profile?.id !== "" ? (
                    <ProfileCard name={profile.name} id={profile.id} />
                ) : (
                    <Text className="text-sm text-gray-400">No user found</Text>
                )}
            </View>

            <Text className="text-sm font-medium text-gray-700 mb-1">Splitter Item</Text>
            
            {splitter.itemList.map((item, idx) => {
                return (
                    <View
                        key={idx}
                        className={"flex flex-row justify-between flex-wrap"}
                    >
                        <TextInput
                            value={item.itemName}
                            onChangeText={(name) => handleChangeItemName(name, idx)}
                            placeholder="Name"
                            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mb-2"
                        />

                        <TextInput
                            value={item.itemPrice}
                            onChangeText={(price) => handleChangeItemPrice(price, idx)}
                            placeholder="0"
                            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mb-2"
                        />

                        <Pressable onPress={() => removeItem(idx)} className="w-full items-end mb-4">
                            <Feather name="minus" size={28} color="#0D3B66" />
                        </Pressable>
                        
                        <View className="w-full h-px bg-black mt-4 mb-8" />
                    </View>
                );
            })}

            <Pressable onPress={addItem} className="w-full items-center mb-4">
                <Feather name="plus" size={28} color="#0D3B66" />
            </Pressable>

            <View
                className={"flex flex-row justify-between"}
            >
                <Text className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mb-2">Total:</Text>

                <Text className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-base mb-2">{splitter.amount}</Text>
            </View>

            <Text className="text-sm font-medium text-gray-700 mb-1">Splitter Item</Text>
        </View>
    )
}