import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ToastNotification } from './NotificationToast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type Toast = {
    id: string;
    message: string;
    title?: string;
    type?: ToastType;
};

type ToastContextType = {
    showToast: (msg: string, opts?: { title?: string; type?: ToastType }) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, opts?: { title?: string; type?: ToastType }) => {
        const id = Date.now().toString();
        const toast: Toast = { id, message, ...opts };
        setToasts((prev) => [...prev, toast]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <View className="absolute top-4 left-0 right-0 items-center z-50 px-4">
                {toasts.map((curToast) => (
                    <ToastNotification
                        key={curToast.id}
                        toast={curToast}
                        onClose={() => removeToast(curToast.id)}
                    />
                ))}
            </View>
            
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};