import * as SecureStore from 'expo-secure-store';

export const saveSecurely = async (key: string, value: string): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await SecureStore.setItemAsync(key, jsonValue);
    } catch (error) {
        console.error('Error saving to secure storage', error);
    }
}

export const fetchSecurely = async (key: string): Promise<string|null> => {
    try {
        const jsonValue = await SecureStore.getItemAsync(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error retrieving from secure storage', error);
        return null;
    }
}

export const deleteSecurely = async (key: string): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error('Error removing from secure storage', error);
    }
}