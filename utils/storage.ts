//Save Securely Infor
import * as SecureStore from 'expo-secure-store';

export const saveSecurely = async (key: string, value: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await SecureStore.setItemAsync(key, jsonValue);
    } catch (error) {
        console.error('Error saving to secure storage', error);
    }
}

export const fetchSecurely = async (key: string): Promise<any|null> => {
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

//Normal storage
import storage from '@react-native-async-storage/async-storage';

export const saveToStorage = async (key: string, value: any) => {
    try {
        await storage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.log("Error saving to local storage: ", err);
    }
};

export const getFromStorage = async (key: string) => {
    try {
        const raw = await storage.getItem(key);
        if (!raw)   return null;

        return JSON.parse(raw);
    } catch (err) {
        console.log("Error getting from local storage: ", err);
        return null;
    }
};

export const deleteFromStorage = async (key: string) => {
    try {
        await storage.removeItem(key);
    } catch (err) {
        console.log("Error deleting from local storage: ", err);
    }
};

export const clearStorage = async () => {
    try {
        await storage.clear();
    } catch (err) {
        console.log("Error clearing from local storage: ", err);
    }
};

export const clearUserStorage = async () => {
    try {
        const allKeys = await storage.getAllKeys();
        const appKeys = allKeys.filter((key) => key.startsWith('user_'));
        await storage.multiRemove(appKeys);
    } catch (err) {
        console.log("Error deleting user data from local storage: ", err);
    }
};