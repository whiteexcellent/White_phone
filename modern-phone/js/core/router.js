/**
 * White Phone OS - Simple SPA Router
 * Hash-based routing with View Transitions
 */

import { viewTransition } from '../core/animations.js';

export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.beforeHooks = [];
        this.afterHooks = [];

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        console.log('📍 Router initialized');
    }

    /**
     * Register a route
     * @param {string} path - Route path (e.g., '/app/messages')
     * @param {Function} handler - Route handler function
     */
    register(path, handler) {
        this.routes.set(path, handler);
        return this;
    }

    /**
     * Navigate to a route
     * @param {string} path - Target path
     * @param {Object} options - Navigation options
     */
    async navigate(path, options = {}) {
        const { replace = false, transition = true } = options;

        // Run before hooks
        for (const hook of this.beforeHooks) {
            const result = await hook(path, this.currentRoute);
            if (result === false) return; // Cancel navigation
        }

        // Update hash
        if (replace) {
            window.location.replace(`#${path}`);
        } else {
            window.location.hash = path;
        }

        // Handle route with optional transition
        if (transition && document.startViewTransition) {
            await viewTransition(() => this.handleRoute());
        } else {
            await this.handleRoute();
        }

        // Run after hooks
        for (const hook of this.afterHooks) {
            await hook(path, this.currentRoute);
        }
    }

    /**
     * Go back
     */
    back() {
        window.history.back();
    }

    /**
     * Handle current route
     */
    async handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const [path, queryString] = hash.split('?');

        // Parse query parameters
        const params = new URLSearchParams(queryString);
        const query = Object.fromEntries(params);

        // Find matching route
        const handler = this.routes.get(path);

        if (handler) {
            this.currentRoute = path;
            await handler({ path, query });
        } else {
            console.warn(`[Router] No handler for route: ${path}`);
            // Optionally navigate to 404
        }
    }

    /**
     * Register before navigation hook
     * @param {Function} hook - Hook function
     */
    beforeEach(hook) {
        this.beforeHooks.push(hook);
        return this;
    }

    /**
     * Register after navigation hook
     * @param {Function} hook - Hook function
     */
    afterEach(hook) {
        this.afterHooks.push(hook);
        return this;
    }

    /**
     * Get current path
     */
    getCurrentPath() {
        return this.currentRoute || '/';
    }

    /**
     * Initialize router - handle initial route
     */
    init() {
        this.handleRoute();
        return this;
    }
}

// Create global router instance
export const router = new Router();
