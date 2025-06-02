import React, { createContext, useContext, useState, ReactNode } from 'react';
import NotificationToast from './NotificationToast';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    message: string;
    type?: ToastType;
    duration?: number;
}

interface ToastContextProps {
    show: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<Toast | null>(null);

    const show = (message: string, type: ToastType = 'info', duration = 3000) => {
        setToast({ message, type, duration });
    };

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {toast && (
                <NotificationToast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => setToast(null)}
                />
            )}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextProps => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};