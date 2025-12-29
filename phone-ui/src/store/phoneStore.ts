import { create } from 'zustand';

// Types
interface Notification {
    id: string;
    appId: string;
    appName: string;
    appIcon: string;
    appColor: string;
    title: string;
    body: string;
    time: string;
    timestamp: number;
    read: boolean;
}

interface App {
    id: string;
    name: string;
    icon: string;
    color: string;
    badge?: number;
    dock?: boolean;
    system?: boolean;
    position?: number;
}

interface PhoneState {
    isOpen: boolean;
    isLocked: boolean;
    currentApp: string | null;
    currentPage: number;
    battery: number;
    signal: number;
    wifi: boolean;
    bluetooth: boolean;
    airplaneMode: boolean;
    doNotDisturb: boolean;
}

interface PhoneStore extends PhoneState {
    // State
    notifications: Notification[];
    apps: App[];

    // Actions
    setIsOpen: (isOpen: boolean) => void;
    setIsLocked: (isLocked: boolean) => void;
    setCurrentApp: (appId: string | null) => void;
    setCurrentPage: (page: number) => void;
    setBattery: (battery: number) => void;
    setSignal: (signal: number) => void;
    setWifi: (wifi: boolean) => void;
    setBluetooth: (bluetooth: boolean) => void;
    setAirplaneMode: (mode: boolean) => void;
    setDoNotDisturb: (dnd: boolean) => void;

    // Notification actions
    addNotification: (notification: Notification) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    markNotificationRead: (id: string) => void;

    // App actions
    setApps: (apps: App[]) => void;
    updateAppBadge: (appId: string, badge: number) => void;

    // Utility actions
    unlock: () => void;
    lock: () => void;
    openApp: (appId: string) => void;
    closeApp: () => void;
    goHome: () => void;
}

export const usePhoneStore = create<PhoneStore>((set, get) => ({
    // Initial state - DEMO MODE: Phone is open and visible
    isOpen: true,
    isLocked: true,
    currentApp: null,
    currentPage: 0,
    battery: 87,
    signal: 5,
    wifi: true,
    bluetooth: true,
    airplaneMode: false,
    doNotDisturb: false,
    notifications: [
        {
            id: '1',
            appId: 'messages',
            appName: 'Messages',
            appIcon: '💬',
            appColor: '#007AFF',
            title: 'John Doe',
            body: 'Hey, are you coming to the party tonight?',
            time: '2m ago',
            timestamp: Date.now(),
            read: false,
        },
        {
            id: '2',
            appId: 'twitter',
            appName: 'X',
            appIcon: '𝕏',
            appColor: '#000000',
            title: 'Trending in Los Santos',
            body: '#MazeBank is now offering 0% APR for new accounts!',
            time: '15m ago',
            timestamp: Date.now() - 900000,
            read: false,
        }
    ],
    apps: [],

    // Basic setters
    setIsOpen: (isOpen) => set({ isOpen }),
    setIsLocked: (isLocked) => set({ isLocked }),
    setCurrentApp: (currentApp) => set({ currentApp }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setBattery: (battery) => set({ battery }),
    setSignal: (signal) => set({ signal }),
    setWifi: (wifi) => set({ wifi }),
    setBluetooth: (bluetooth) => set({ bluetooth }),
    setAirplaneMode: (airplaneMode) => set({ airplaneMode }),
    setDoNotDisturb: (doNotDisturb) => set({ doNotDisturb }),

    // Notification actions
    addNotification: (notification) =>
        set((state) => ({
            notifications: [notification, ...state.notifications],
        })),

    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clearNotifications: () => set({ notifications: [] }),

    markNotificationRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),

    // App actions
    setApps: (apps) => set({ apps }),

    updateAppBadge: (appId, badge) =>
        set((state) => ({
            apps: state.apps.map((app) =>
                app.id === appId ? { ...app, badge } : app
            ),
        })),

    // Utility actions
    unlock: () => set({ isLocked: false }),

    lock: () => set({ isLocked: true, currentApp: null }),

    openApp: (appId) => {
        const { currentApp } = get();
        if (!currentApp) {
            set({ currentApp: appId });
        }
    },

    closeApp: () => set({ currentApp: null }),

    goHome: () => {
        const { currentApp } = get();
        if (currentApp) {
            set({ currentApp: null });
        } else {
            set({ isLocked: true });
        }
    },
}));
