/**
 * White Phone OS - Photos App
 * Photo gallery with grid and fullscreen view
 */

import { phoneStore } from '../core/state.js';
import { createElement } from '../utils/helpers.js';
import { viewTransition } from '../core/animations.js';

export class PhotosApp {
    constructor() {
        this.container = null;
        this.photos = this.getMockPhotos();
        this.currentPhoto = null;
    }

    /**
     * Render Photos app
     */
    render() {
        this.container = createElement(`
            <div class="photos-app">
                <!-- App Header -->
                <div class="app-header">
                    <button class="app-back-btn" id="photos-back-btn">← Back</button>
                    <h1 class="app-title">Photos</h1>
                    <button class="app-action-btn">⊕</button>
                </div>
                
                <!-- Photo Grid -->
                <div class="photos-grid" id="photos-grid">
                    ${this.photos.map((photo, index) => `
                        <div class="photo-item pressable" data-photo-index="${index}" style="view-transition-name: photo-${index}">
                            <img src="${photo.url}" alt="${photo.title}" class="photo-thumbnail">
                        </div>
                    `).join('')}
                </div>
                
                <!-- Fullscreen View -->
                <div class="photos-fullscreen" id="photos-fullscreen" style="display: none;">
                    <!-- Content will be rendered when opened -->
                </div>
            </div>
        `);

        // Setup back button
        this.container.querySelector('#photos-back-btn').addEventListener('click', () => {
            if (this.currentPhoto !== null) {
                this.closeFullscreen();
            } else {
                phoneStore.closeApp();
            }
        });

        // Setup photo click handlers
        this.setupPhotoHandlers();

        return this.container;
    }

    /**
     * Setup photo click handlers
     */
    setupPhotoHandlers() {
        this.container.querySelectorAll('.photo-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openFullscreen(index);
            });
        });
    }

    /**
     * Open fullscreen view
     */
    async openFullscreen(index) {
        this.currentPhoto = index;
        const photo = this.photos[index];

        const fullscreenContainer = this.container.querySelector('#photos-fullscreen');
        const gridContainer = this.container.querySelector('#photos-grid');

        // Render fullscreen view
        fullscreenContainer.innerHTML = `
            <div class="fullscreen-photo-container">
                <div class="fullscreen-photo-header">
                    <button class="fullscreen-close-btn" id="fullscreen-close-btn">✕</button>
                    <div class="fullscreen-photo-title">${photo.title}</div>
                    <button class="fullscreen-share-btn">📤</button>
                </div>
                
                <div class="fullscreen-photo-content">
                    <img src="${photo.url}" alt="${photo.title}" class="fullscreen-photo-img" style="view-transition-name: photo-${index}">
                </div>
                
                <div class="fullscreen-photo-nav">
                    <button class="fullscreen-nav-btn" id="fullscreen-prev-btn" ${index === 0 ? 'disabled' : ''}>◀</button>
                    <div class="fullscreen-photo-info">${index + 1} / ${this.photos.length}</div>
                    <button class="fullscreen-nav-btn" id="fullscreen-next-btn" ${index === this.photos.length - 1 ? 'disabled' : ''}>▶</button>
                </div>
            </div>
        `;

        // Use View Transition if supported
        if (document.startViewTransition) {
            await viewTransition(() => {
                gridContainer.style.display = 'none';
                fullscreenContainer.style.display = 'flex';
            });
        } else {
            gridContainer.style.display = 'none';
            fullscreenContainer.style.display = 'flex';
        }

        // Setup fullscreen controls
        this.setupFullscreenControls();
    }

    /**
     * Close fullscreen view
     */
    async closeFullscreen() {
        const fullscreenContainer = this.container.querySelector('#photos-fullscreen');
        const gridContainer = this.container.querySelector('#photos-grid');

        // Use View Transition if supported
        if (document.startViewTransition) {
            await viewTransition(() => {
                fullscreenContainer.style.display = 'none';
                gridContainer.style.display = 'grid';
            });
        } else {
            fullscreenContainer.style.display = 'none';
            gridContainer.style.display = 'grid';
        }

        this.currentPhoto = null;
    }

    /**
     * Setup fullscreen controls
     */
    setupFullscreenControls() {
        const closeBtn = this.container.querySelector('#fullscreen-close-btn');
        const prevBtn = this.container.querySelector('#fullscreen-prev-btn');
        const nextBtn = this.container.querySelector('#fullscreen-next-btn');

        closeBtn.addEventListener('click', () => {
            this.closeFullscreen();
        });

        if (prevBtn && !prevBtn.disabled) {
            prevBtn.addEventListener('click', () => {
                this.navigatePhoto(-1);
            });
        }

        if (nextBtn && !nextBtn.disabled) {
            nextBtn.addEventListener('click', () => {
                this.navigatePhoto(1);
            });
        }

        // Swipe gestures would be nice here!
    }

    /**
     * Navigate between photos
     */
    navigatePhoto(direction) {
        const newIndex = Math.max(0, Math.min(this.photos.length - 1, this.currentPhoto + direction));
        if (newIndex !== this.currentPhoto) {
            this.openFullscreen(newIndex);
        }
    }

    /**
     * Get mock photos
     */
    getMockPhotos() {
        return [
            { title: 'Vinewood Sign', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80' },
            { title: 'Beach Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
            { title: 'City Lights', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80' },
            { title: 'Mountain View', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
            { title: 'Ocean Waves', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80' },
            { title: 'Urban Street', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80' },
            { title: 'Nature Trail', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' },
            { title: 'Skyline', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80' },
            { title: 'Park Scene', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80' }
        ];
    }

    /**
     * Destroy component
     */
    destroy() {
        // Cleanup
    }
}
