/**
 * White Phone OS - Dynamic Island Component
 * Interactive notification area with morphing animations
 */

import { phoneStore } from '../core/state.js';
import { createElement } from '../utils/helpers.js';

export class DynamicIsland {
    constructor() {
        this.container = null;
        this.unsubscribe = null;
    }

    /**
     * Render Dynamic Island
     * @returns {HTMLElement} Island container
     */
    render() {
        this.container = createElement(`
            <div class="dynamic-island" id="dynamic-island">
                <!-- Compact View - Camera/Sensors -->
                <div class="island-content">
                    <div class="island-compact">
                        <div class="island-camera"></div>
                        <div class="island-sensor"></div>
                    </div>
                    
                    <!-- Expanded View - Live Activities -->
                    <div class="island-expanded-content">
                        <div id="island-activity-content"></div>
                    </div>
                </div>
            </div>
        `);

        // Setup interactions
        this.setupInteractions();

        // Subscribe to state
        this.subscribe();

        return this.container;
    }

    /**
     * Setup interactions
     */
    setupInteractions() {
        this.container.addEventListener('click', () => {
            const state = phoneStore.getState();

            if (state.dynamicIslandExpanded) {
                // Collapse
                phoneStore.collapseDynamicIsland();
            } else if (state.dynamicIslandActivity) {
                // Expand to show activity
                phoneStore.expandDynamicIsland(state.dynamicIslandActivity);
            }
        });
    }

    /**
     * Subscribe to state changes
     */
    subscribe() {
        this.unsubscribe = phoneStore.subscribe((state) => {
            this.updateIsland(state);
        });
    }

    /**
     * Update island state
     */
    updateIsland(state) {
        if (!this.container) return;

        const { dynamicIslandExpanded, dynamicIslandActivity } = state;

        if (dynamicIslandExpanded && dynamicIslandActivity) {
            this.container.classList.add('expanded');
            this.renderActivity(dynamicIslandActivity);
        } else {
            this.container.classList.remove('expanded');
        }
    }

    /**
     * Render activity content
     */
    renderActivity(activity) {
        const contentContainer = this.container.querySelector('#island-activity-content');

        if (activity === 'music') {
            contentContainer.innerHTML = `
                <div class="flex items-center gap-3 w-full">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                        🎵
                    </div>
                    <div class="flex-1">
                        <div class="font-semibold text-sm">Now Playing</div>
                        <div class="text-xs opacity-70">Los Santos Radio</div>
                    </div>
                    <div class="flex gap-2">
                        <button class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">⏮</button>
                        <button class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">⏸</button>
                        <button class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">⏭</button>
                    </div>
                </div>
            `;
        } else if (activity === 'call') {
            contentContainer.innerHTML = `
                <div class="flex flex-col items-center gap-2 w-full">
                    <div class="w-12 h-12 rounded-full bg-ios-green flex items-center justify-center text-2xl">
                        📞
                    </div>
                    <div class="text-center">
                        <div class="font-semibold text-sm">Incoming Call</div>
                        <div class="text-xs opacity-70">John Doe</div>
                    </div>
                </div>
            `;
        } else if (activity === 'timer') {
            contentContainer.innerHTML = `
                <div class="flex items-center gap-3 w-full justify-center">
                    <div class="text-2xl">⏱️</div>
                    <div class="font-mono text-xl font-bold">05:43</div>
                </div>
            `;
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
