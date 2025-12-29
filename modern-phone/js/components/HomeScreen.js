/**
 * White Phone OS - Home Screen Component
 * App icons grid with pages and dock
 */

import { phoneStore } from '../core/state.js';
import { setupSwipeDetection } from '../core/gestures.js';
import { createElement } from '../utils/helpers.js';

export class HomeScreen {
    constructor() {
        this.container = null;
        this.unsubscribe = null;
        this.gestureDetector = null;
    }

    /**
     * Render home screen
     * @returns {HTMLElement} Home screen container
     */
    render() {
        this.container = createElement(`
            <div class="home-screen" id="home-screen">
                <!-- App Grid Pages -->
                <div class="home-pages" id="home-pages">
                    <!-- Pages will be rendered here -->
                </div>
                
                <!-- Page Dots -->
                <div class="home-page-dots" id="page-dots">
                    <!-- Dots will be rendered here -->
                </div>
                
                <!-- Dock -->
                <div class="home-dock" id="home-dock">
                    <!-- Dock apps will be rendered here -->
                </div>
            </div>
        `);

        // Setup gestures
        this.setupSwipe();

        // Subscribe to state
        this.subscribe();

        // Initial render
        this.update(phoneStore.getState());

        return this.container;
    }

    /**
     * Setup swipe between pages
     */
    setupSwipe() {
        const pagesContainer = this.container.querySelector('#home-pages');

        this.gestureDetector = setupSwipeDetection(pagesContainer, {
            onSwipeLeft: () => {
                const state = phoneStore.getState();
                const maxPage = Math.ceil(state.apps.length / 20) - 1;
                if (state.currentPage < maxPage) {
                    phoneStore.setCurrentPage(state.currentPage + 1);
                }
            },
            onSwipeRight: () => {
                const state = phoneStore.getState();
                if (state.currentPage > 0) {
                    phoneStore.setCurrentPage(state.currentPage - 1);
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
     * Update home screen
     */
    update(state) {
        if (!this.container) return;

        // Show/hide based on lock state
        if (!state.isLocked && !state.currentApp) {
            this.container.style.display = 'flex';
        } else {
            this.container.style.display = 'none';
        }

        // Render apps
        this.renderApps(state.apps, state.currentPage);

        // Render dock
        this.renderDock(state.apps);

        // Render page dots
        this.renderPageDots(state.apps.length, state.currentPage);
    }

    /**
     * Render app icons
     */
    renderApps(apps, currentPage) {
        const pagesContainer = this.container.querySelector('#home-pages');
        if (!pagesContainer) return;

        // Filter non-dock apps and sort by position
        const regularApps = apps.filter(app => !app.dock).sort((a, b) => a.position - b.position);

        // 20 apps per page (4x5 grid)
        const appsPerPage = 20;
        const pageStart = currentPage * appsPerPage;
        const pageEnd = pageStart + appsPerPage;
        const pageApps = regularApps.slice(pageStart, pageEnd);

        pagesContainer.innerHTML = `
            <div class="home-grid">
                ${pageApps.map(app => this.renderAppIcon(app)).join('')}
            </div>
        `;

        // Add click handlers
        pagesContainer.querySelectorAll('.home-app-icon').forEach((el, index) => {
            el.addEventListener('click', () => {
                const app = pageApps[index];
                phoneStore.openApp(app.id);
            });
        });
    }

    /**
     * Render single app icon
     */
    renderAppIcon(app) {
        const badge = app.badge ? `<div class="app-badge">${app.badge}</div>` : '';

        return `
            <div class="home-app-icon pressable" data-app-id="${app.id}">
                <div class="app-icon-bg" style="background: ${app.color}">
                    <span class="app-icon-emoji">${app.icon}</span>
                </div>
                ${badge}
                <span class="app-icon-label">${app.name}</span>
            </div>
        `;
    }

    /**
     * Render dock apps
     */
    renderDock(apps) {
        const dockContainer = this.container.querySelector('#home-dock');
        if (!dockContainer) return;

        // Filter dock apps
        const dockApps = apps.filter(app => app.dock).sort((a, b) => a.position - b.position);

        dockContainer.innerHTML = `
            <div class="dock-container glass">
                ${dockApps.map(app => this.renderAppIcon(app)).join('')}
            </div>
        `;

        // Add click handlers
        dockContainer.querySelectorAll('.home-app-icon').forEach((el, index) => {
            el.addEventListener('click', () => {
                const app = dockApps[index];
                phoneStore.openApp(app.id);
            });
        });
    }

    /**
     * Render page indicator dots
     */
    renderPageDots(totalApps, currentPage) {
        const dotsContainer = this.container.querySelector('#page-dots');
        if (!dotsContainer) return;

        const regularApps = totalApps; // Should filter non-dock
        const pageCount = Math.ceil(regularApps / 20);

        if (pageCount <= 1) {
            dotsContainer.innerHTML = '';
            return;
        }

        const dots = Array.from({ length: pageCount }, (_, i) => {
            const active = i === currentPage ? 'active' : '';
            return `<div class="page-dot ${active}"></div>`;
        }).join('');

        dotsContainer.innerHTML = dots;
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
