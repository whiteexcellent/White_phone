/**
 * White Phone OS - Settings App
 * System settings and preferences
 */

import { phoneStore } from '../core/state.js';
import { createElement } from '../utils/helpers.js';

export class SettingsApp {
    constructor() {
        this.container = null;
        this.currentView = 'main';
    }

    /**
     * Render Settings app
     */
    render() {
        this.container = createElement(`
            <div class="settings-app">
                <!-- App Header -->
                <div class="app-header">
                    <button class="app-back-btn" id="settings-back-btn">← Back</button>
                    <h1 class="app-title">Settings</h1>
                    <div></div>
                </div>
                
                <!-- Settings List -->
                <div class="settings-list" id="settings-list">
                    <!-- Settings will be rendered here -->
                </div>
            </div>
        `);

        // Setup back button
        this.container.querySelector('#settings-back-btn').addEventListener('click', () => {
            phoneStore.closeApp();
        });

        // Render main settings
        this.renderMainSettings();

        return this.container;
    }

    /**
     * Render main settings list
     */
    renderMainSettings() {
        const listContainer = this.container.querySelector('#settings-list');

        const settings = [
            { icon: '✈️', title: 'Airplane Mode', type: 'toggle', value: phoneStore.getState().airplaneMode },
            { icon: '📡', title: 'Wi-Fi', type: 'link', subtitle: 'Connected to "Home Network"' },
            { icon: '🔵', title: 'Bluetooth', type: 'toggle', value: phoneStore.getState().bluetooth },
            { icon: '📶', title: 'Cellular', type: 'link', subtitle: '5G' },
            { type: 'divider' },
            { icon: '🔔', title: 'Notifications', type: 'link' },
            { icon: '🔊', title: 'Sounds & Haptics', type: 'link' },
            { icon: '🌙', title: 'Do Not Disturb', type: 'toggle', value: phoneStore.getState().doNotDisturb },
            { icon: '⏰', title: 'Screen Time', type: 'link' },
            { type: 'divider' },
            { icon: '🌐', title: 'General', type: 'link' },
            { icon: '🎨', title: 'Display & Brightness', type: 'link' },
            { icon: '🔐', title: 'Privacy & Security', type: 'link' },
            { icon: '🔋', title: 'Battery', type: 'link', subtitle: phoneStore.getState().battery + '%' },
            { type: 'divider' },
            { icon: '👤', title: 'Account', type: 'link' },
            { icon: '📱', title: 'About', type: 'link', subtitle: 'White Phone OS v2.0' }
        ];

        listContainer.innerHTML = settings.map(setting => {
            if (setting.type === 'divider') {
                return '<div class="settings-divider"></div>';
            }

            return `
                <div class="settings-item pressable" data-setting="${setting.title}">
                    <div class="settings-item-left">
                        <div class="settings-icon">${setting.icon}</div>
                        <div class="settings-info">
                            <div class="settings-title">${setting.title}</div>
                            ${setting.subtitle ? `<div class="settings-subtitle">${setting.subtitle}</div>` : ''}
                        </div>
                    </div>
                    <div class="settings-item-right">
                        ${setting.type === 'toggle' ?
                    `<label class="settings-toggle">
                                <input type="checkbox" ${setting.value ? 'checked' : ''}>
                                <span class="settings-toggle-slider"></span>
                            </label>` :
                    '<span class="settings-arrow">›</span>'
                }
                    </div>
                </div>
            `;
        }).join('');

        // Setup toggles
        this.setupToggles();
    }

    /**
     * Setup toggle switches
     */
    setupToggles() {
        const airplaneToggle = this.container.querySelector('[data-setting="Airplane Mode"] input');
        const bluetoothToggle = this.container.querySelector('[data-setting="Bluetooth"] input');
        const dndToggle = this.container.querySelector('[data-setting="Do Not Disturb"] input');

        if (airplaneToggle) {
            airplaneToggle.addEventListener('change', (e) => {
                phoneStore.setAirplaneMode(e.target.checked);
            });
        }

        if (bluetoothToggle) {
            bluetoothToggle.addEventListener('change', (e) => {
                phoneStore.setBluetooth(e.target.checked);
            });
        }

        if (dndToggle) {
            dndToggle.addEventListener('change', (e) => {
                phoneStore.setDoNotDisturb(e.target.checked);
            });
        }
    }

    /**
     * Destroy component
     */
    destroy() {
        // Cleanup
    }
}
