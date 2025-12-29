/**
 * White Phone OS - Phone App
 * Dialer and contacts application
 */

import { phoneStore } from '../core/state.js';
import { createElement } from '../utils/helpers.js';
import { hapticFeedback } from '../core/animations.js';

export class PhoneApp {
    constructor() {
        this.container = null;
        this.currentNumber = '';
        this.currentTab = 'recents';
        this.contacts = this.getMockContacts();
        this.recents = this.getMockRecents();
    }

    /**
     * Render Phone app
     */
    render() {
        this.container = createElement(`
            <div class="phone-app">
                <!-- App Header -->
                <div class="app-header">
                    <button class="app-back-btn" id="phone-back-btn">← Back</button>
                    <h1 class="app-title">Phone</h1>
                    <div></div>
                </div>
                
                <!-- Tabs -->
                <div class="phone-tabs">
                    <button class="phone-tab active" data-tab="recents">Recents</button>
                    <button class="phone-tab" data-tab="contacts">Contacts</button>
                    <button class="phone-tab" data-tab="keypad">Keypad</button>
                </div>
                
                <!-- Tab Content -->
                <div class="phone-content" id="phone-content">
                    <!-- Content will be rendered here -->
                </div>
            </div>
        `);

        // Setup back button
        this.container.querySelector('#phone-back-btn').addEventListener('click', () => {
            phoneStore.closeApp();
        });

        // Setup tabs
        this.container.querySelectorAll('.phone-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Render initial tab
        this.renderTab(this.currentTab);

        return this.container;
    }

    /**
     * Switch tab
     */
    switchTab(tabName) {
        this.currentTab = tabName;

        // Update active tab
        this.container.querySelectorAll('.phone-tab').forEach(tab => {
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Render content
        this.renderTab(tabName);
    }

    /**
     * Render tab content
     */
    renderTab(tabName) {
        const contentContainer = this.container.querySelector('#phone-content');

        switch (tabName) {
            case 'recents':
                this.renderRecents(contentContainer);
                break;
            case 'contacts':
                this.renderContacts(contentContainer);
                break;
            case 'keypad':
                this.renderKeypad(contentContainer);
                break;
        }
    }

    /**
     * Render recents tab
     */
    renderRecents(container) {
        container.innerHTML = `
            <div class="phone-recents">
                ${this.recents.map(recent => `
                    <div class="recent-item pressable">
                        <div class="recent-icon ${recent.type}">
                            ${recent.type === 'incoming' ? '📞' : recent.type === 'outgoing' ? '📱' : '📵'}
                        </div>
                        <div class="recent-info">
                            <div class="recent-name">${recent.name}</div>
                            <div class="recent-time">${recent.time}</div>
                        </div>
                        <button class="recent-call-btn">📞</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render contacts tab
     */
    renderContacts(container) {
        container.innerHTML = `
            <div class="phone-contacts">
                <div class="contact-search">
                    <input type="text" placeholder="Search contacts..." class="contact-search-input">
                </div>
                <div class="contact-list">
                    ${this.contacts.map(contact => `
                        <div class="contact-item pressable">
                            <div class="contact-avatar" style="background: ${contact.color}">
                                ${contact.avatar}
                            </div>
                            <div class="contact-info">
                                <div class="contact-name">${contact.name}</div>
                                <div class="contact-number">${contact.number}</div>
                            </div>
                            <button class="contact-call-btn">📞</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render keypad tab
     */
    renderKeypad(container) {
        container.innerHTML = `
            <div class="phone-keypad">
                <div class="keypad-display">
                    <div class="keypad-number" id="keypad-number">${this.currentNumber || ''}</div>
                </div>
                
                <div class="keypad-grid">
                    ${this.getKeypadButtons().map(btn => `
                        <button class="keypad-btn pressable" data-value="${btn.value}">
                            <span class="keypad-btn-number">${btn.number}</span>
                            ${btn.letters ? `<span class="keypad-btn-letters">${btn.letters}</span>` : ''}
                        </button>
                    `).join('')}
                    
                    <button class="keypad-btn keypad-btn-special" data-value="*">
                        <span class="keypad-btn-number">*</span>
                    </button>
                    
                    <button class="keypad-btn" data-value="0">
                        <span class="keypad-btn-number">0</span>
                        <span class="keypad-btn-letters">+</span>
                    </button>
                    
                    <button class="keypad-btn keypad-btn-special" data-value="#">
                        <span class="keypad-btn-number">#</span>
                    </button>
                </div>
                
                <div class="keypad-actions">
                    <button class="keypad-call-btn" id="keypad-call-btn">
                        <span class="text-3xl">📞</span>
                    </button>
                </div>
            </div>
        `;

        // Setup keypad buttons
        container.querySelectorAll('.keypad-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.getAttribute('data-value');
                this.addToNumber(value);
                hapticFeedback(btn, 'light');
            });
        });

        // Setup call button
        container.querySelector('#keypad-call-btn').addEventListener('click', () => {
            if (this.currentNumber) {
                this.makeCall(this.currentNumber);
            }
        });
    }

    /**
     * Get keypad buttons
     */
    getKeypadButtons() {
        return [
            { number: '1', value: '1', letters: '' },
            { number: '2', value: '2', letters: 'ABC' },
            { number: '3', value: '3', letters: 'DEF' },
            { number: '4', value: '4', letters: 'GHI' },
            { number: '5', value: '5', letters: 'JKL' },
            { number: '6', value: '6', letters: 'MNO' },
            { number: '7', value: '7', letters: 'PQRS' },
            { number: '8', value: '8', letters: 'TUV' },
            { number: '9', value: '9', letters: 'WXYZ' }
        ];
    }

    /**
     * Add digit to number
     */
    addToNumber(digit) {
        this.currentNumber += digit;
        const display = this.container.querySelector('#keypad-number');
        if (display) {
            display.textContent = this.currentNumber;
        }
    }

    /**
     * Make a call
     */
    makeCall(number) {
        console.log('Calling:', number);
        // In real implementation, this would trigger NUI event
        alert(`Calling ${number}...`);
        this.currentNumber = '';
    }

    /**
     * Get mock contacts
     */
    getMockContacts() {
        return [
            { name: 'Alice Brown', number: '(555) 123-4567', avatar: '👩', color: '#FF2D55' },
            { name: 'Bob Smith', number: '(555) 234-5678', avatar: '👨', color: '#007AFF' },
            { name: 'Carol White', number: '(555) 345-6789', avatar: '👧', color: '#34C759' },
            { name: 'David Jones', number: '(555) 456-7890', avatar: '🧑', color: '#FFCC00' },
            { name: 'Eve Davis', number: '(555) 567-8901', avatar: '👩', color: '#AF52DE' }
        ];
    }

    /**
     * Get mock recents
     */
    getMockRecents() {
        return [
            { name: 'John Doe', type: 'incoming', time: '2 minutes ago' },
            { name: 'Jane Smith', type: 'outgoing', time: '1 hour ago' },
            { name: 'Unknown', type: 'missed', time: '2 hours ago' },
            { name: 'Mike Johnson', type: 'outgoing', time: 'Yesterday' },
            { name: 'Sarah Wilson', type: 'incoming', time: 'Yesterday' }
        ];
    }

    /**
     * Destroy component
     */
    destroy() {
        // Cleanup
    }
}
