import React from 'react';
import {
    View,
    Text,
    Pressable,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

type Friend = {
    id: string;
    name: string;
};

type Props = {
    items: Friend[];
    onSelect: (item: Friend) => void;
    isVisible: boolean;
    onClose: () => void;
    itemHeight?: number;
    visibleCount?: number;
};

const DropDownList: React.FC<Props> = ({
    items = [],
    onSelect,
    isVisible,
    onClose,
    itemHeight = 64,
    visibleCount = 3
}) => {
    if (!isVisible) return null;

    const totalHeight = itemHeight * visibleCount + 16 + (visibleCount - 1) * 8;

    return (
        <View style={styles.overlay}>
            <View
                style={[
                    styles.dropdown,
                    {
                        height: totalHeight,
                    },
                ]}
            >
                <Pressable className="absolute top-3 right-3 z-20 h-7 w-7 p-1" onPress={onClose}>
                    <Feather name="x" size={20} color="#333" />
                </Pressable>

                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => {
                                onSelect(item);
                                onClose();
                            }}
                            style={[styles.item, { height: itemHeight }]}
                        >
                            <Text style={styles.text}>{item.name} ({item.id})</Text>
                        </Pressable>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 30,
    },
    dropdown: {
        marginTop: 4,
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    item: {
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
});

export default DropDownList;