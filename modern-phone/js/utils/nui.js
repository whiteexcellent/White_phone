/**
 * White Phone OS - FiveM NUI Bridge
 * Communication with FiveM + Standalone mock mode
 */

// Check if we're running inside FiveM
export const isInGame = typeof window.GetParentResourceName !== 'undefined';

/**
 * Get parent resource name (FiveM only)
 * @returns {string} Resource name or 'standalone'
 */
export function getResourceName() {
    if (isInGame) {
        return window.GetParentResourceName();
    }
    return 'standalone';
}

/**
 * Send message to FiveM client/server
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
export function sendNuiMessage(event, data = {}) {
    if (isInGame) {
        fetch(`https://${getResourceName()}/${event}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).catch(err => {
            console.error(`[NUI] Failed to send message '${event}':`, err);
        });
    } else {
        // Standalone mode - just log
        console.log(`[Mock NUI] ${event}:`, data);
    }
}

/**
 * Listen for NUI messages from FiveM
 * @param {string} event - Event name
 * @param {Function} callback - Event handler
 * @returns {Function} Unsubscribe function
 */
export function onNuiMessage(event, callback) {
    const handler = (e) => {
        if (e.data.action === event || e.data.type === event) {
            callback(e.data);
        }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
}

/**
 * Mock NUI events for standalone testing
 */
export class MockNUI {
    constructor() {
        this.enabled = !isInGame;
    }

    /**
     * Simulate opening phone
     */
    openPhone() {
        if (!this.enabled) return;

        window.postMessage({
            action: 'open',
            type: 'open'
        }, '*');
    }

    /**
     * Simulate closing phone
     */
    closePhone() {
        if (!this.enabled) return;

        window.postMessage({
            action: 'close',
            type: 'close'
        }, '*');
    }

    /**
     * Simulate receiving a notification
     */
    sendNotification(notification) {
        if (!this.enabled) return;

        window.postMessage({
            action: 'notification',
            type: 'notification',
            data: notification
        }, '*');
    }

    /**
     * Simulate receiving a message
     */
    sendMessage(message) {
        if (!this.enabled) return;

        window.postMessage({
            action: 'message',
            type: 'message',
            data: message
        }, '*');
    }

    /**
     * Simulate receiving a call
     */
    sendCall(call) {
        if (!this.enabled) return;

        window.postMessage({
            action: 'call',
            type: 'call',
            data: call
        }, '*');
    }

    /**
     * Update phone data
     */
    updateData(data) {
        if (!this.enabled) return;

        window.postMessage({
            action: 'updateData',
            type: 'updateData',
            data
        }, '*');
    }
}

// Create global mock NUI instance
export const mockNUI = new MockNUI();

// Expose to window for console testing
if (!isInGame) {
    window.mockNUI = mockNUI;
    console.log('📱 Standalone Mode - Use window.mockNUI for testing');
}
