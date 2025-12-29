/**
 * White Phone OS - Control Center Component
 * Quick settings panel
 */

import { phoneStore } from '../core/state.js';
import { setupSwipeDetection } from '../core/gestures.js';
import { createElement } from '../utils/helpers.js';

export class ControlCenter {
    constructor() {
        this.container = null;
        this.unsubscribe = null;
        this.gestureDetector = null;
    }

    /**
     * Render control center
     * @returns {HTMLElement} Control center container
     */
    render() {
        this.container = createElement(`
            <div class="control-center" id="control-center">
                <div class="control-center-panel glass">
                    <!-- Controls Grid -->
                    <div class="control-grid">
                        <!-- Connection toggles -->
                        <button class="control-toggle" id="toggle-wifi">
                            <span class="control-icon">📡</span>
                            <span class="control-label">Wi-Fi</span>
                        </button>
                        
                        <button class="control-toggle" id="toggle-bluetooth">
                            <span class="control-icon">🔵</span>
                            <span class="control-label">Bluetooth</span>
                        </button>
                        
                        <button class="control-toggle" id="toggle-airplane">
                            <span class="control-icon">✈️</span>
                            <span class="control-label">Airplane</span>
                        </button>
                        
                        <button class="control-toggle" id="toggle-dnd">
                            <span class="control-icon">🌙</span>
                            <span class="control-label">Do Not Disturb</span>
                        </button>
                    </div>
                    
                    <!-- Sliders -->
                    <div class="control-sliders">
                        <div class="control-slider-container">
                            <span class="control-slider-label">☀️ Brightness</span>
                            <input type="range" class="ios-slider" min="0" max="100" value="75" id="brightness-slider">
                        </div>
                        
                        <div class="control-slider-container">
                            <span class="control-slider-label">🔊 Volume</span>
                            <input type="range" class="ios-slider" min="0" max="100" value="50" id="volume-slider">
                        </div>
                    </div>
                </div>
            </div>
        `);

        // Setup interactions
        this.setupToggles();
        this.setupSwipe();

        // Subscribe to state
        this.subscribe();

        // Initial update
        this.update(phoneStore.getState());

        return this.container;
    }

    /**
     * Setup toggle buttons
     */
    setupToggles() {
        // WiFi
        this.container.querySelector('#toggle-wifi').addEventListener('click', () => {
            const state = phoneStore.getState();
            phoneStore.setWifi(!state.wifi);
        });

        // Bluetooth
        this.container.querySelector('#toggle-bluetooth').addEventListener('click', () => {
            const state = phoneStore.getState();
            phoneStore.setBluetooth(!state.bluetooth);
        });

        // Airplane
        this.container.querySelector('#toggle-airplane').addEventListener('click', () => {
            const state = phoneStore.getState();
            phoneStore.setAirplaneMode(!state.airplaneMode);
        });

        // Do Not Disturb
        this.container.querySelector('#toggle-dnd').addEventListener('click', () => {
            const state = phoneStore.getState();
            phoneStore.setDoNotDisturb(!state.doNotDisturb);
        });
    }

    /**
     * Setup swipe to close
     */
    setupSwipe() {
        this.gestureDetector = setupSwipeDetection(this.container, {
            onSwipeUp: () => {
                phoneStore.closeControlCenter();
            },
            onTap: (data) => {
                // Close when tapping outside panel
                if (data.target === this.container) {
                    phoneStore.closeControlCenter();
                }
            }
        });
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
     * Update control center
     */
    update(state) {
        if (!this.container) return;

        // Show/hide
        if (state.controlCenterOpen) {
            this.container.style.display = 'flex';
            this.container.classList.add('active');
        } else {
            this.container.style.display = 'none';
            this.container.classList.remove('active');
        }

        // Update toggle states
        this.updateToggle('#toggle-wifi', state.wifi);
        this.updateToggle('#toggle-bluetooth', state.bluetooth);
        this.updateToggle('#toggle-airplane', state.airplaneMode);
        this.updateToggle('#toggle-dnd', state.doNotDisturb);
    }

    /**
     * Update toggle button state
     */
    updateToggle(selector, isActive) {
        const toggle = this.container.querySelector(selector);
        if (toggle) {
            if (isActive) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }
        }
    }

    /**
     * Destroy component
     */
    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        if (this.gestureDetector) {
            this.gestureDetector.destroy();
        }
    }
}
