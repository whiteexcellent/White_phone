/**
 * White Phone OS - Notification Center Component
 * Notifications panel
 */

import { phoneStore } from '../core/state.js';
import { setupSwipeDetection } from '../core/gestures.js';
import { createElement } from '../utils/helpers.js';

export class NotificationCenter {
    constructor() {
        this.container = null;
        this.unsubscribe = null;
        this.gestureDetector = null;
    }

    /**
     * Render notification center
     * @returns {HTMLElement} Notification center container
     */
    render() {
        this.container = createElement(`
            <div class="notification-center" id="notification-center">
                <div class="notification-panel glass">
                    <div class="notification-header">
                        <h2 class="notification-title">Notifications</h2>
                        <button class="notification-clear-btn" id="clear-all-btn">Clear All</button>
                    </div>
                    
                    <div class="notification-list" id="notification-list">
                        <!-- Notifications will be rendered here -->
                    </div>
                </div>
            </div>
        `);

        // Setup interactions
        this.setupClearButton();
        this.setupSwipe();

        // Subscribe to state
        this.subscribe();

        // Initial update
        this.update(phoneStore.getState());

        return this.container;
    }

    /**
     * Setup clear button
     */
    setupClearButton() {
        this.container.querySelector('#clear-all-btn').addEventListener('click', () => {
            phoneStore.clearNotifications();
        });
    }

    /**
     * Setup swipe to close
     */
    setupSwipe() {
        this.gestureDetector = setupSwipeDetection(this.container, {
            onSwipeUp: () => {
                phoneStore.closeNotificationCenter();
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
     * Update notification center
     */
    update(state) {
        if (!this.container) return;

        // Show/hide
        if (state.notificationCenterOpen) {
            this.container.style.display = 'flex';
            this.container.classList.add('active');
        } else {
            this.container.style.display = 'none';
            this.container.classList.remove('active');
        }

        // Render notifications
        this.renderNotifications(state.notifications);
    }

    /**
     * Render notification list
     */
    renderNotifications(notifications) {
        const listContainer = this.container.querySelector('#notification-list');
        if (!listContainer) return;

        if (notifications.length === 0) {
            listContainer.innerHTML = `
                <div class="notification-empty">
                    <span class="text-4xl opacity-50">📭</span>
                    <p class="text-sm opacity-70 mt-2">No notifications</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = notifications.map(notif => `
            <div class="notification-item glass-light" data-notif-id="${notif.id}">
                <div class="notification-item-header">
                    <div class="notification-app-icon" style="background: ${notif.appColor}">
                        ${notif.appIcon}
                    </div>
                    <div class="notification-app-name">${notif.appName}</div>
                    <div class="notification-time">${notif.time}</div>
                    <button class="notification-dismiss-btn" data-notif-id="${notif.id}">✕</button>
                </div>
                <div class="notification-content">
                    <div class="notification-item-title">${notif.title}</div>
                    <div class="notification-item-body">${notif.body}</div>
                </div>
            </div>
        `).join('');

        // Add dismiss handlers
        listContainer.querySelectorAll('.notification-dismiss-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-notif-id');
                phoneStore.removeNotification(id);
            });
        });

        // Add tap handlers to mark as read
        listContainer.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-notif-id');
                phoneStore.markNotificationRead(id);
                // Optionally open the app
                const notif = notifications.find(n => n.id === id);
                if (notif) {
                    phoneStore.closeNotificationCenter();
                    phoneStore.openApp(notif.appId);
                }
            });
        });
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
