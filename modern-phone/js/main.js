/**
 * White Phone OS - Main Entry Point
 * Bootstraps the entire application
 */

import { phoneStore } from './core/state.js';
import { isInGame, onNuiMessage } from './utils/nui.js';
import { Phone } from './components/Phone.js';

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/**
 * Initialize application
 */
async function init() {
    console.log('🚀 White Phone OS - Initializing...');

    try {
        // Load apps data
        await loadAppsData();

        // Create and render phone component
        const phoneRoot = document.getElementById('phone-root');
        const phone = new Phone();
        phoneRoot.appendChild(phone.render());

        // Hide loading screen
        hideLoadingScreen();

        // Setup NUI listeners (for FiveM integration)
        setupNUIListeners();

        // Setup keyboard shortcuts
        setupKeyboardShortcuts();

        // Log feature support
        logFeatureSupport();

        console.log('✅ White Phone OS - Ready!');

    } catch (error) {
        console.error('❌ Failed to initialize:', error);
    }
}

/**
 * Load apps data from JSON
 */
async function loadAppsData() {
    try {
        const response = await fetch('./data/apps.json');
        const apps = await response.json();
        phoneStore.setApps(apps);
        console.log('📱 Loaded', apps.length, 'apps');
    } catch (error) {
        console.warn('⚠️ Failed to load apps.json, using defaults');
        // Use default apps if JSON fails
        phoneStore.setApps(getDefaultApps());
    }
}

/**
 * Get default apps
 */
function getDefaultApps() {
    return [
        { id: 'phone', name: 'Phone', icon: '📞', color: '#34C759', position: 0, dock: true },
        { id: 'messages', name: 'Messages', icon: '💬', color: '#34C759', position: 1, dock: true },
        { id: 'mail', name: 'Mail', icon: '✉️', color: '#007AFF', position: 2 },
        { id: 'camera', name: 'Camera', icon: '📷', color: '#8E8E93', position: 3, dock: true },
        { id: 'photos', name: 'Photos', icon: '🖼️', color: '#FF2D55', position: 4 },
        { id: 'maps', name: 'Maps', icon: '🗺️', color: '#007AFF', position: 5 },
        { id: 'calendar', name: 'Calendar', icon: '📅', color: '#FF3B30', position: 6 },
        { id: 'notes', name: 'Notes', icon: '📝', color: '#FFCC00', position: 7 },
        { id: 'settings', name: 'Settings', icon: '⚙️', color: '#8E8E93', position: 8, dock: true },
        { id: 'twitter', name: 'X', icon: '𝕏', color: '#000000', position: 9 },
        { id: 'music', name: 'Music', icon: '🎵', color: '#FF2D55', position: 10 },
        { id: 'bank', name: 'Bank', icon: '🏦', color: '#34C759', position: 11 },
        { id: 'emergency', name: 'Emergency', icon: '🚨', color: '#FF3B30', position: 12 }
    ];
}

/**
 * Hide loading screen with animation
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 500);
    }
}

/**
 * Setup FiveM NUI listeners
 */
function setupNUIListeners() {
    // Listen for open/close events
    onNuiMessage('open', () => {
        phoneStore.setIsOpen(true);
    });

    onNuiMessage('close', () => {
        phoneStore.setIsOpen(false);
    });

    // Listen for notifications
    onNuiMessage('notification', (data) => {
        phoneStore.addNotification(data.data);
    });

    // Listen for data updates
    onNuiMessage('updateData', (data) => {
        const { battery, signal, wifi, bluetooth } = data.data;
        if (battery !== undefined) phoneStore.setBattery(battery);
        if (signal !== undefined) phoneStore.setSignal(signal);
        if (wifi !== undefined) phoneStore.setWifi(wifi);
        if (bluetooth !== undefined) phoneStore.setBluetooth(bluetooth);
    });

    console.log('📡 NUI listeners setup');
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const state = phoneStore.getState();

        // ESC - Close app or go back
        if (e.key === 'Escape') {
            if (state.currentApp) {
                phoneStore.closeApp();
            } else if (!state.isLocked) {
                phoneStore.lock();
            } else if (isInGame) {
                // In game, close phone
                sendNuiMessage('closePhone');
            }
        }

        // H - Go home
        if (e.key === 'h' || e.key === 'H') {
            if (!state.isLocked) {
                phoneStore.goHome();
            }
        }

        // L - Toggle lock
        if (e.key === 'l' || e.key === 'L') {
            if (state.isLocked) {
                phoneStore.unlock();
            } else {
                phoneStore.lock();
            }
        }

        // C - Toggle control center (for testing)
        if (e.key === 'c' || e.key === 'C') {
            phoneStore.toggleControlCenter();
        }

        // N - Toggle notifications (for testing)
        if (e.key === 'n' || e.key === 'N') {
            phoneStore.toggleNotificationCenter();
        }
    });

    console.log('⌨️ Keyboard shortcuts setup (ESC, H, L, C, N)');
}

/**
 * Log feature support
 */
function logFeatureSupport() {
    console.log('📊 Feature Support:');
    console.log('  • View Transitions:', window.PHONE_FEATURES.viewTransitions ? '✅' : '❌');
    console.log('  • Container Queries:', window.PHONE_FEATURES.containerQueries ? '✅' : '❌');
    console.log('  • :has() Selector:', window.PHONE_FEATURES.hasSelector ? '✅' : '❌');
    console.log('  • Running in FiveM:', isInGame ? '✅' : '❌ (Standalone Mode)');
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('💥 Global Error:', e.error);
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('💥 Unhandled Promise Rejection:', e.reason);
});
