// This component is a fking bullshit
// I set maxHeight, it disappears
// I set height, flatlist doesn't scroll
// No fking Idea how to fix this

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
    visibleCount = 3,
}) => {
    if (!isVisible || items.length === 0) return null;

    const cnt = Math.min(visibleCount, items.length);
    const dropHeight = itemHeight * cnt + (cnt - 1) * 8 + 64; //8 for spacing, 64 for header height

    return (
        <View style={styles.overlay}>
            <View style={[styles.dropdown, { height: dropHeight }]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>Select a Friend</Text>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Feather name="x" size={20} color="#333" />
                    </Pressable>
                </View>

                {/* Make FlatList scrollable */}
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
                            <Text style={styles.text}>
                                {item.name} ({item.id})
                            </Text>
                        </Pressable>
                    )}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    showsVerticalScrollIndicator={true}
                    style={{ flexGrow: 0 }}
                    contentContainerStyle={{
                        paddingBottom: 8,
                    }}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 4,
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