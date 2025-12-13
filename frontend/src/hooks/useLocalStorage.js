import { useState, useEffect } from 'react';

// Helper to reliably trigger a local storage event from anywhere
export const triggerStorageEvent = (key, value) => {
    window.dispatchEvent(new CustomEvent('ProgressHub-storage', {
        detail: { key, newValue: typeof value === 'string' ? value : JSON.stringify(value) }
    }));
};

export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                const stringified = JSON.stringify(valueToStore);
                window.localStorage.setItem(key, stringified);
                triggerStorageEvent(key, stringified);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handleNativeStorage = (e) => {
            if (e.key === key && e.newValue !== null) {
                setStoredValue(JSON.parse(e.newValue));
            }
        };

        const handleCustomStorage = (e) => {
            if (e.detail.key === key) {
                setStoredValue(JSON.parse(e.detail.newValue));
            }
        };

        window.addEventListener('storage', handleNativeStorage);
        window.addEventListener('ProgressHub-storage', handleCustomStorage);

        return () => {
            window.removeEventListener('storage', handleNativeStorage);
            window.removeEventListener('ProgressHub-storage', handleCustomStorage);
        };
    }, [key]);

    return [storedValue, setValue];
}
