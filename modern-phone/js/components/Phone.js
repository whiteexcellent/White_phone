/**
 * White Phone OS - Phone Component
 * Main phone wrapper with 3D effects and interactions
 */

import { phoneStore } from '../core/state.js';
import { createParallax } from '../core/animations.js';
import { DynamicIsland } from './DynamicIsland.js';
import { StatusBar } from './StatusBar.js';
import { LockScreen } from './LockScreen.js';
import { HomeScreen } from './HomeScreen.js';
import { ControlCenter } from './ControlCenter.js';
import { NotificationCenter } from './NotificationCenter.js';
import { AppContainer } from './AppContainer.js';
import { createElement } from '../utils/helpers.js';

export class Phone {
    constructor() {
        this.container = null;
        this.screen = null;
        this.wallpaper = null;
        this.unsubscribe = null;

        // Sub-components
        this.dynamicIsland = new DynamicIsland();
        this.statusBar = new StatusBar();
        this.lockScreen = new LockScreen();
        this.homeScreen = new HomeScreen();
        this.controlCenter = new ControlCenter();
        this.notificationCenter = new NotificationCenter();
        this.appContainer = new AppContainer();
    }

    /**
     * Render phone component
     * @returns {HTMLElement} Phone container
     */
    render() {
        // Create phone structure
        this.container = createElement(`
            <div class="phone-container entering">
                <!-- Phone Bezel/Frame -->
                <div class="phone-bezel"></div>
                
                <!-- Optional physical buttons -->
                <div class="phone-button-power"></div>
                <div class="phone-button-volume-up"></div>
                <div class="phone-button-volume-down"></div>
                
                <!-- Phone Screen -->
                <div class="phone-screen" id="phone-screen">
                    <!-- Wallpaper Layer -->
                    <div class="phone-wallpaper locked" id="wallpaper"></div>
                    
                    <!-- Dynamic Island -->
                    <div id="dynamic-island-container"></div>
                    
                    <!-- Status Bar -->
                    <div id="status-bar-container"></div>
                    
                    <!-- Screen Content -->
                    <div class="screen-layer-content">
                        <!-- Lock Screen -->
                        <div id="lock-screen-container"></div>
                        
                        <!-- Home Screen -->
                        <div id="home-screen-container"></div>
                        
                       <!-- App Container -->
                        <div id="app-container"></div>
                    </div>
                    
                    <!-- Overlays -->
                    <div class="screen-layer-overlay">
                        <!-- Control Center -->
                        <div id="control-center-container"></div>
                        
                        <!-- Notification Center -->
                        <div id="notification-center-container"></div>
                    </div>
                    
                    <!-- Home Indicator -->
                    <div class="home-indicator"></div>
                </div>
            </div>
        `);

        // Get references
        this.screen = this.container.querySelector('#phone-screen');
        this.wallpaper = this.container.querySelector('#wallpaper');

        // Render sub-components
        this.renderSubComponents();

        // Setup interactions
        this.setupInteractions();

        // Setup parallax effect
        this.setupParallax();

        // Subscribe to state changes
        this.subscribe();

        // Set wallpaper
        this.updateWallpaper();

        return this.container;
    }

    /**
     * Render all sub-components
     */
    renderSubComponents() {
        // Dynamic Island
        const islandContainer = this.container.querySelector('#dynamic-island-container');
        islandContainer.appendChild(this.dynamicIsland.render());

        // Status Bar
        const statusContainer = this.container.querySelector('#status-bar-container');
        statusContainer.appendChild(this.statusBar.render());

        // Lock Screen
        const lockContainer = this.container.querySelector('#lock-screen-container');
        lockContainer.appendChild(this.lockScreen.render());

        // Home Screen
        const homeContainer = this.container.querySelector('#home-screen-container');
        homeContainer.appendChild(this.homeScreen.render());

        // Control Center
        const controlContainer = this.container.querySelector('#control-center-container');
        controlContainer.appendChild(this.controlCenter.render());

        // Notification Center
        const notifContainer = this.container.querySelector('#notification-center-container');
        notifContainer.appendChild(this.notificationCenter.render());

        // App Container
        const appContainer = this.container.querySelector('#app-container');
        appContainer.appendChild(this.appContainer.render());
    }

    /**
     * Setup interactions
     */
    setupInteractions() {
        // Home indicator click - go home
        const homeIndicator = this.container.querySelector('.home-indicator');
        homeIndicator.addEventListener('click', () => {
            phoneStore.goHome();
        });

        // Keyboard shortcuts are in main.js
    }

    /**
     * Setup parallax effect
     */
    setupParallax() {
        if (this.wallpaper) {
            createParallax(this.wallpaper, {
                strength: 10,
                type: 'mouse'
            });
        }
    }

    /**
     * Subscribe to state changes
     */
    subscribe() {
        this.unsubscribe = phoneStore.subscribe((state) => {
            this.updateWallpaperState(state.isLocked);
        });
    }

    /**
     * Update wallpaper
     */
    updateWallpaper() {
        if (this.wallpaper) {
            // Use Unsplash for dynamic wallpaper
            this.wallpaper.style.backgroundImage =
                `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')`;
        }
    }

    /**
     * Update wallpaper state based on lock status
     */
    updateWallpaperState(isLocked) {
        if (this.wallpaper) {
            if (isLocked) {
                this.wallpaper.classList.remove('unlocked');
                this.wallpaper.classList.add('locked');
            } else {
                this.wallpaper.classList.remove('locked');
                this.wallpaper.classList.add('unlocked');
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

        // Destroy sub-components
        this.dynamicIsland.destroy();
        this.statusBar.destroy();
        this.lockScreen.destroy();
        this.homeScreen.destroy();
        this.controlCenter.destroy();
        this.notificationCenter.destroy();
        this.appContainer.destroy();
    }
}
