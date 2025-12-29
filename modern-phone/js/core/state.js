/**
 * White Phone OS - Proxy-based Reactive State Management
 * Similar to Zustand but vanilla JavaScript
 */

/**
 * Creates a reactive store with Proxy-based state management
 * @param {Object} initialState - Initial state object
 * @param {Function} actionsCreator - Function that receives set/get and returns actions
 * @returns {Object} Store with state, actions, and subscribe method
 */
export function createStore(initialState, actionsCreator) {
    const listeners = new Set();
    let state = { ...initialState };

    /**
     * Subscribe to state changes
     * @param {Function} listener - Callback function called on state change
     * @returns {Function} Unsubscribe function
     */
    const subscribe = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    /**
     * Get current state
     * @returns {Object} Current state
     */
    const getState = () => state;

    /**
     * Set state and notify listeners
     * @param {Object|Function} partial - Partial state or updater function
     */
    const setState = (partial) => {
        const nextState = typeof partial === 'function'
            ? partial(state)
            : partial;

        state = { ...state, ...nextState };

        // Notify all listeners
        listeners.forEach(listener => listener(state));
    };

    // Create actions with set/get access
    const actions = actionsCreator ? actionsCreator(setState, getState) : {};

    // Return store interface
    return {
        getState,
        setState,
        subscribe,
        ...actions
    };
}

/**
 * Phone Store - Main application state
 */
export const phoneStore = createStore(
    // Initial State
    {
        isOpen: true,          // In standalone mode, always open
        isLocked: true,        // Start with lock screen
        currentApp: null,      // Currently open app ID
        currentPage: 0,        // Home screen page number

        // System status
        battery: 87,
        signal: 5,
        wifi: true,
        bluetooth: true,
        airplaneMode: false,
        doNotDisturb: false,

        // Time
        currentTime: new Date(),

        // Notifications
        notifications: [
            {
                id: '1',
                appId: 'messages',
                appName: 'Messages',
                appIcon: '💬',
                appColor: '#34C759',
                title: 'John Doe',
                body: 'Hey, are you coming to the party tonight?',
                time: '2m ago',
                timestamp: Date.now(),
                read: false
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
                read: false
            }
        ],

        // Apps list (will be populated from apps.json)
        apps: [],

        // Control Center state
        controlCenterOpen: false,
        notificationCenterOpen: false,

        // Dynamic Island state
        dynamicIslandExpanded: false,
        dynamicIslandActivity: null, // 'music', 'call', 'timer', etc.
    },

    // Actions Creator
    (set, get) => ({
        // Basic setters
        setIsOpen: (isOpen) => set({ isOpen }),
        setIsLocked: (isLocked) => set({ isLocked }),
        setCurrentApp: (currentApp) => set({ currentApp }),
        setCurrentPage: (page) => set({ currentPage: page }),

        // System status
        setBattery: (battery) => set({ battery }),
        setSignal: (signal) => set({ signal }),
        setWifi: (wifi) => set({ wifi }),
        setBluetooth: (bluetooth) => set({ bluetooth }),
        setAirplaneMode: (mode) => set({ airplaneMode: mode }),
        setDoNotDisturb: (dnd) => set({ doNotDisturb: dnd }),

        // Time update
        setCurrentTime: (time) => set({ currentTime: time }),

        // Notification actions
        addNotification: (notification) => {
            const { notifications } = get();
            set({ notifications: [notification, ...notifications] });
        },

        removeNotification: (id) => {
            const { notifications } = get();
            set({ notifications: notifications.filter(n => n.id !== id) });
        },

        clearNotifications: () => set({ notifications: [] }),

        markNotificationRead: (id) => {
            const { notifications } = get();
            set({
                notifications: notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                )
            });
        },

        // App actions
        setApps: (apps) => set({ apps }),

        updateAppBadge: (appId, badge) => {
            const { apps } = get();
            set({
                apps: apps.map(app =>
                    app.id === appId ? { ...app, badge } : app
                )
            });
        },

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

        // Control Center
        toggleControlCenter: () => {
            const { controlCenterOpen } = get();
            set({
                controlCenterOpen: !controlCenterOpen,
                notificationCenterOpen: false // Close notification center
            });
        },

        closeControlCenter: () => set({ controlCenterOpen: false }),

        // Notification Center
        toggleNotificationCenter: () => {
            const { notificationCenterOpen } = get();
            set({
                notificationCenterOpen: !notificationCenterOpen,
                controlCenterOpen: false // Close control center
            });
        },

        closeNotificationCenter: () => set({ notificationCenterOpen: false }),

        // Dynamic Island
        expandDynamicIsland: (activity) => {
            set({
                dynamicIslandExpanded: true,
                dynamicIslandActivity: activity
            });
        },

        collapseDynamicIsland: () => {
            set({
                dynamicIslandExpanded: false,
                dynamicIslandActivity: null
            });
        },
    })
);

// Update time every second
setInterval(() => {
    phoneStore.setCurrentTime(new Date());
}, 1000);

// Log state changes in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    phoneStore.subscribe((state) => {
        console.log('📱 State Updated:', state);
    });
}
