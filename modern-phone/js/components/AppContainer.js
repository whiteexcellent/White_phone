/**
 * White Phone OS - App Container Component
 * Wrapper for currently open app
 */

import { phoneStore } from '../core/state.js';
import { createElement } from '../utils/helpers.js';

export class AppContainer {
    constructor() {
        this.container = null;
        this.unsubscribe = null;
        this.currentAppComponent = null;
    }

    /**
     * Render app container
     * @returns {HTMLElement} App container
     */
    render() {
        this.container = createElement(`
            <div class="app-container" id="app-container">
                <div class="app-content" id="app-content">
                    <!-- App will be rendered here -->
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
     * Update app container
     */
    update(state) {
        if (!this.container) return;

        if (state.currentApp) {
            // Show container
            this.container.style.display = 'flex';

            // Load app
            this.loadApp(state.currentApp);
        } else {
            // Hide container
            this.container.style.display = 'none';

            // Unload app
            this.unloadApp();
        }
    }

    /**
     * Load an app
     */
    async loadApp(appId) {
        const contentContainer = this.container.querySelector('#app-content');
        if (!contentContainer) return;

        // Unload previous app
        this.unloadApp();

        try {
            let AppClass;

            // Dynamically import the app
            switch (appId) {
                case 'messages':
                    const { MessagesApp } = await import('../apps/MessagesApp.js');
                    AppClass = MessagesApp;
                    break;
                case 'phone':
                    const { PhoneApp } = await import('../apps/PhoneApp.js');
                    AppClass = PhoneApp;
                    break;
                case 'twitter':
                    const { TwitterApp } = await import('../apps/TwitterApp.js');
                    AppClass = TwitterApp;
                    break;
                case 'music':
                    const { MusicApp } = await import('../apps/MusicApp.js');
                    AppClass = MusicApp;
                    break;
                case 'photos':
                    const { PhotosApp } = await import('../apps/PhotosApp.js');
                    AppClass = PhotosApp;
                    break;
                case 'settings':
                    const { SettingsApp } = await import('../apps/SettingsApp.js');
                    AppClass = SettingsApp;
                    break;
                default:
                    // Fallback to placeholder
                    this.showPlaceholder(appId);
                    return;
            }

            // Create and render the app
            this.currentAppComponent = new AppClass();
            const appElement = this.currentAppComponent.render();

            // Clear container and append app
            contentContainer.innerHTML = '';
            contentContainer.appendChild(appElement);

        } catch (error) {
            console.error('Failed to load app:', appId, error);
            this.showPlaceholder(appId);
        }
    }

    /**
     * Show placeholder for unavailable apps
     */
    showPlaceholder(appId) {
        const contentContainer = this.container.querySelector('#app-content');
        const app = phoneStore.getState().apps.find(a => a.id === appId);

        if (!contentContainer) return;

        contentContainer.innerHTML = `
            <div class="app-placeholder">
                <div class="app-header">
                    <button class="app-back-btn" id="app-back-btn">← Back</button>
                    <h1 class="app-title">${app?.name || 'App'}</h1>
                    <div></div>
                </div>
                
                <div class="app-body">
                    <span class="text-6xl">${app?.icon || '📱'}</span>
                    <h2 class="text-xl font-semibold mt-4">${app?.name || 'App'}</h2>
                    <p class="text-sm opacity-70 mt-2">Coming soon!</p>
                    <p class="text-xs opacity-50 mt-4">This app is not yet implemented.</p>
                </div>
            </div>
        `;

        // Setup back button
        const backBtn = contentContainer.querySelector('#app-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                phoneStore.closeApp();
            });
        }
    }

    /**
     * Unload current app
     */
    unloadApp() {
        if (this.currentAppComponent && this.currentAppComponent.destroy) {
            this.currentAppComponent.destroy();
        }
        this.currentAppComponent = null;
    }

    /**
     * Destroy component
     */
    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.unloadApp();
    }
}
