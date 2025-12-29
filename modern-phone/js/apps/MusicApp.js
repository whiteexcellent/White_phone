/**
 * White Phone OS - Music App
 * Music player with playback controls
 */

import { phoneStore } from '../core/state.js';
import { createElement } from '../utils/helpers.js';

export class MusicApp {
    constructor() {
        this.container = null;
        this.isPlaying = false;
        this.currentSong = this.getMockSongs()[0];
        this.progress = 0;
        this.songs = this.getMockSongs();
    }

    /**
     * Render Music app
     */
    render() {
        this.container = createElement(`
            <div class="music-app">
                <!-- App Header -->
                <div class="app-header app-header-gradient" style="background: linear-gradient(135deg, ${this.currentSong.color}dd, ${this.currentSong.color}88);">
                    <button class="app-back-btn" id="music-back-btn">← Back</button>
                    <h1 class="app-title">Music</h1>
                    <div></div>
                </div>
                
                <!-- Now Playing -->
                <div class="music-player">
                    <!-- Album Art -->
                    <div class="music-album-art" id="music-album-art">
                        <div class="music-album-cover" style="background: ${this.currentSong.color}">
                            <span style="font-size: 120px;">${this.currentSong.icon}</span>
                        </div>
                    </div>
                    
                    <!-- Song Info -->
                    <div class="music-info">
                        <h2 class="music-title">${this.currentSong.title}</h2>
                        <p class="music-artist">${this.currentSong.artist}</p>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div class="music-progress-container">
                        <span class="music-time">${this.formatTime(this.progress)}</span>
                        <div class="music-progress-bar">
                            <div class="music-progress-fill" id="music-progress-fill" style="width: ${this.progress}%;"></div>
                        </div>
                        <span class="music-time">${this.formatTime(this.currentSong.duration)}</span>
                    </div>
                    
                    <!-- Controls -->
                    <div class="music-controls">
                        <button class="music-control-btn" id="music-prev-btn">
                            <span style="font-size: 32px;">⏮</span>
                        </button>
                        <button class="music-control-btn music-play-btn" id="music-play-btn">
                            <span style="font-size: 48px;" id="music-play-icon">${this.isPlaying ? '⏸' : '▶'}</span>
                        </button>
                        <button class="music-control-btn" id="music-next-btn">
                            <span style="font-size: 32px;">⏭</span>
                        </button>
                    </div>
                    
                    <!-- Additional Controls -->
                    <div class="music-extra-controls">
                        <button class="music-extra-btn">🔀</button>
                        <button class="music-extra-btn">💗</button>
                        <button class="music-extra-btn">🔁</button>
                    </div>
                </div>
                
                <!-- Queue -->
                <div class="music-queue">
                    <h3 class="music-queue-title">Up Next</h3>
                    <div class="music-queue-list">
                        ${this.songs.slice(1, 4).map(song => `
                            <div class="music-queue-item pressable">
                                <div class="music-queue-icon" style="background: ${song.color}">
                                    ${song.icon}
                                </div>
                                <div class="music-queue-info">
                                    <div class="music-queue-song">${song.title}</div>
                                    <div class="music-queue-artist">${song.artist}</div>
                                </div>
                                <span class="music-queue-duration">${this.formatTime(song.duration)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `);

        // Setup back button
        this.container.querySelector('#music-back-btn').addEventListener('click', () => {
            phoneStore.closeApp();
        });

        // Setup controls
        this.setupControls();

        return this.container;
    }

    /**
     * Setup playback controls
     */
    setupControls() {
        const playBtn = this.container.querySelector('#music-play-btn');
        const playIcon = this.container.querySelector('#music-play-icon');
        const prevBtn = this.container.querySelector('#music-prev-btn');
        const nextBtn = this.container.querySelector('#music-next-btn');

        playBtn.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            playIcon.textContent = this.isPlaying ? '⏸' : '▶';

            if (this.isPlaying) {
                this.startProgress();
                // Expand Dynamic Island with music
                phoneStore.expandDynamicIsland('music');
            } else {
                this.stopProgress();
                phoneStore.collapseDynamicIsland();
            }

            // Animation
            playBtn.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(0.9)' },
                { transform: 'scale(1)' }
            ], {
                duration: 200,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            });
        });

        prevBtn.addEventListener('click', () => {
            this.playPrevious();
        });

        nextBtn.addEventListener('click', () => {
            this.playNext();
        });
    }

    /**
     * Start progress simulation
     */
    startProgress() {
        if (this.progressInterval) clearInterval(this.progressInterval);

        this.progressInterval = setInterval(() => {
            this.progress += 0.5;
            if (this.progress >= 100) {
                this.progress = 0;
                this.playNext();
            }

            const progressFill = this.container.querySelector('#music-progress-fill');
            if (progressFill) {
                progressFill.style.width = `${this.progress}%`;
            }
        }, 1000);
    }

    /**
     * Stop progress
     */
    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    /**
     * Play next song
     */
    playNext() {
        const currentIndex = this.songs.indexOf(this.currentSong);
        const nextIndex = (currentIndex + 1) % this.songs.length;
        this.playSong(this.songs[nextIndex]);
    }

    /**
     * Play previous song
     */
    playPrevious() {
        const currentIndex = this.songs.indexOf(this.currentSong);
        const prevIndex = (currentIndex - 1 + this.songs.length) % this.songs.length;
        this.playSong(this.songs[prevIndex]);
    }

    /**
     * Play a song
     */
    playSong(song) {
        this.currentSong = song;
        this.progress = 0;

        // Update UI - would normally re-render but for demo just update key elements
        const title = this.container.querySelector('.music-title');
        const artist = this.container.querySelector('.music-artist');
        const albumArt = this.container.querySelector('.music-album-cover');

        if (title) title.textContent = song.title;
        if (artist) artist.textContent = song.artist;
        if (albumArt) {
            albumArt.style.background = song.color;
            albumArt.querySelector('span').textContent = song.icon;
        }
    }

    /**
     * Format time in MM:SS
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Get mock songs
     */
    getMockSongs() {
        return [
            { title: 'Los Santos FM', artist: 'Radio Los Santos', icon: '🎵', color: '#FF2D55', duration: 245 },
            { title: 'West Coast Classics', artist: 'West Coast Radio', icon: '🎸', color: '#007AFF', duration: 198 },
            { title: 'FlyLo FM', artist: 'Flying Lotus', icon: '🎧', color: '#AF52DE', duration: 312 },
            { title: 'The Lab', artist: 'Dr. Dre', icon: '🎤', color: '#34C759', duration: 267 },
            { title: 'Worldwide FM', artist: 'Gilles Peterson', icon: '🌍', color: '#FFCC00', duration: 289 }
        ];
    }

    /**
     * Destroy component
     */
    destroy() {
        this.stopProgress();
        phoneStore.collapseDynamicIsland();
    }
}
