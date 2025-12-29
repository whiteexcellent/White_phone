/**
 * White Phone OS - Status Bar Component
 * Top status bar with time, battery, signal, etc.
 */

import { phoneStore } from '../core/state.js';
import { createElement, formatTime } from '../utils/helpers.js';

export class StatusBar {
    constructor() {
        this.container = null;
        this.unsubscribe = null;
    }

    /**
     * Render status bar
     * @returns {HTMLElement} Status bar container
     */
    render() {
        this.container = createElement(`
            <div class="status-bar">
                <div class="status-bar-left">
                    <span id="status-time"></span>
                </div>
                <div class="status-bar-right">
                    <span id="status-signal" class="status-icon"></span>
                    <span id="status-wifi" class="status-icon"></span>
                    <span id="status-battery" class="status-icon"></span>
                </div>
            </div>
        `);

        // Subscribe to state
        this.subscribe();

        // Initial update
        this.update(phoneStore.getState());

        return this.container;
    }

    /**
     * Subscribe to state changes
     */
    subscribe() {
        this.unsubscribe = phoneStore.subscribe((state) => {
            this.update(state);
        });
    }

    /**
     * Update status bar
     */
    update(state) {
        if (!this.container) return;

        // Update time
        const timeEl = this.container.querySelector('#status-time');
        if (timeEl) {
            timeEl.textContent = formatTime(state.currentTime);
        }

        // Update signal strength
        const signalEl = this.container.querySelector('#status-signal');
        if (signalEl) {
            const bars = '📶'.repeat(Math.min(state.signal, 5));
            signalEl.textContent = bars || '📵';
        }

        // Update WiFi
        const wifiEl = this.container.querySelector('#status-wifi');
        if (wifiEl) {
            wifiEl.textContent = state.wifi ? '📡' : '';
        }

        // Update battery
        const battEl = this.container.querySelector('#status-battery');
        if (battEl) {
            const level = state.battery;
            let icon = '🔋';
            if (level >= 90) icon = '🔋';
            else if (level >= 50) icon = '🔋';
            else if (level >= 20) icon = '🪫';
            else icon = '🪫';

            battEl.textContent = `${icon} ${level}%`;
        }
    }

    /**
     * Destroy component
     */
    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}
