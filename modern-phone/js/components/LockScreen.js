/**
 * White Phone OS - Lock Screen Component
 * Lock screen with swipe-to-unlock gesture
 */

import { phoneStore } from '../core/state.js';
import { setupSwipeDetection } from '../core/gestures.js';
import { createElement, formatTime, formatDate } from '../utils/helpers.js';

export class LockScreen {
    constructor() {
        this.container = null;
        this.unsubscribe = null;
        this.gestureDetector = null;
    }

    /**
     * Render lock screen
     * @returns {HTMLElement} Lock screen container
     */
    render() {
        this.container = createElement(`
            <div class="lock-screen" id="lock-screen">
                <div class="lock-screen-content">
                    <!-- Time Display -->
                    <div class="lock-time-container">
                        <div class="lock-time" id="lock-time">09:41</div>
                        <div class="lock-date" id="lock-date">Monday, December 29</div>
                    </div>
                    
                    <!-- Notifications Preview -->
                    <div class="lock-notifications" id="lock-notifications">
                        <!-- Notifications will be rendered here -->
                    </div>
                    
                    <!-- Bottom Actions -->
                    <div class="lock-actions">
                        <button class="lock-action-btn">
                            <span class="text-2xl">🔦</span>
                        </button>
                        <div class="lock-swipe-indicator">
                            <div class="lock-swipe-bar"></div>
                            <span class="lock-swipe-text">Swipe up to unlock</span>
                        </div>
                        <button class="lock-action-btn">
                            <span class="text-2xl">📷</span>
                        </button>
                    </div>
                </div>
            </div>
        `);

        // Setup gestures
        this.setupSwipe();

        // Subscribe to state
        this.subscribe();

        // Initial update
        this.update(phoneStore.getState());

        return this.container;
    }

    /**
     * Setup swipe to unlock
     */
    setupSwipe() {
        this.gestureDetector = setupSwipeDetection(this.container, {
            onSwipeUp: () => {
                phoneStore.unlock();
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
     * Update lock screen
     */
    update(state) {
        if (!this.container) return;

        // Show/hide based on lock state
        if (state.isLocked) {
            this.container.style.display = 'flex';
        } else {
            this.container.style.display = 'none';
        }

        // Update time
        const timeEl = this.container.querySelector('#lock-time');
        if (timeEl) {
            timeEl.textContent = formatTime(state.currentTime);
        }

        // Update date
        const dateEl = this.container.querySelector('#lock-date');
        if (dateEl) {
            dateEl.textContent = formatDate(state.currentTime);
        }

        // Update notifications preview
        this.updateNotifications(state.notifications);
    }

    /**
     * Update notifications preview
     */
    updateNotifications(notifications) {
        const container = this.container.querySelector('#lock-notifications');
        if (!container) return;

        // Show only unread notifications (max 3)
        const unread = notifications.filter(n => !n.read).slice(0, 3);

        if (unread.length === 0) {
            container.innerHTML = '<div class="lock-no-notif">No notifications</div>';
            return;
        }

        container.innerHTML = unread.map(notif => `
            <div class="lock-notif-item glass-light">
                <div class="lock-notif-icon" style="background: ${notif.appColor}">
                    ${notif.appIcon}
                </div>
                <div class="lock-notif-content">
                    <div class="lock-notif-header">
                        <span class="font-semibold">${notif.appName}</span>
                        <span class="text-xs opacity-70">${notif.time}</span>
                    </div>
                    <div class="lock-notif-title">${notif.title}</div>
                    <div class="lock-notif-body">${notif.body}</div>
                </div>
            </div>
        `).join('');
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
