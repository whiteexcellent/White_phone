/**
 * White Phone OS - Twitter/X App
 * Social media feed application
 */

import { phoneStore } from '../core/state.js';
import { createElement } from '../utils/helpers.js';
import { getRelativeTime } from '../utils/helpers.js';

export class TwitterApp {
    constructor() {
        this.container = null;
        this.tweets = this.getMockTweets();
    }

    /**
     * Render Twitter app
     */
    render() {
        this.container = createElement(`
            <div class="twitter-app">
                <!-- App Header -->
                <div class="app-header app-header-dark">
                    <button class="app-back-btn" id="twitter-back-btn">← Back</button>
                    <h1 class="app-title" style="font-size: 24px;">𝕏</h1>
                    <div></div>
                </div>
                
                <!-- Tweet Feed -->
                <div class="twitter-feed" id="twitter-feed">
                    ${this.tweets.map(tweet => this.renderTweet(tweet)).join('')}
                </div>
                
                <!-- Compose Button -->
                <button class="twitter-compose-btn">✎</button>
            </div>
        `);

        // Setup back button
        this.container.querySelector('#twitter-back-btn').addEventListener('click', () => {
            phoneStore.closeApp();
        });

        // Setup tweet interactions
        this.setupInteractions();

        return this.container;
    }

    /**
     * Render single tweet
     */
    renderTweet(tweet) {
        return `
            <div class="tweet-item" data-tweet-id="${tweet.id}">
                <div class="tweet-avatar" style="background: ${tweet.userColor}">
                    ${tweet.userAvatar}
                </div>
                <div class="tweet-content">
                    <div class="tweet-header">
                        <span class="tweet-username">${tweet.username}</span>
                        <span class="tweet-handle">@${tweet.handle}</span>
                        <span class="tweet-dot">·</span>
                        <span class="tweet-time">${getRelativeTime(tweet.timestamp)}</span>
                    </div>
                    <div class="tweet-text">${tweet.text}</div>
                    ${tweet.image ? `<div class="tweet-image" style="background-image: url('${tweet.image}')"></div>` : ''}
                    <div class="tweet-actions">
                        <button class="tweet-action" data-action="reply">
                            <span>💬</span>
                            <span>${tweet.replies || ''}</span>
                        </button>
                        <button class="tweet-action tweet-retweet-btn ${tweet.retweeted ? 'active' : ''}" data-action="retweet">
                            <span>🔄</span>
                            <span>${tweet.retweets || ''}</span>
                        </button>
                        <button class="tweet-action tweet-like-btn ${tweet.liked ? 'active' : ''}" data-action="like">
                            <span>${tweet.liked ? '❤️' : '🤍'}</span>
                            <span>${tweet.likes || ''}</span>
                        </button>
                        <button class="tweet-action" data-action="share">
                            <span>📤</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup tweet interactions
     */
    setupInteractions() {
        // Like button animation
        this.container.querySelectorAll('[data-action="like"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tweetItem = btn.closest('.tweet-item');
                const tweetId = tweetItem.getAttribute('data-tweet-id');
                const tweet = this.tweets.find(t => t.id === tweetId);

                if (tweet) {
                    tweet.liked = !tweet.liked;
                    tweet.likes = (tweet.likes || 0) + (tweet.liked ? 1 : -1);

                    // Update button
                    btn.classList.toggle('active');
                    btn.querySelector('span:first-child').textContent = tweet.liked ? '❤️' : '🤍';
                    btn.querySelector('span:last-child').textContent = tweet.likes || '';

                    // Animation
                    btn.animate([
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.3)' },
                        { transform: 'scale(1)' }
                    ], {
                        duration: 300,
                        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                    });
                }
            });
        });

        // Retweet button
        this.container.querySelectorAll('[data-action="retweet"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tweetItem = btn.closest('.tweet-item');
                const tweetId = tweetItem.getAttribute('data-tweet-id');
                const tweet = this.tweets.find(t => t.id === tweetId);

                if (tweet) {
                    tweet.retweeted = !tweet.retweeted;
                    tweet.retweets = (tweet.retweets || 0) + (tweet.retweeted ? 1 : -1);

                    // Update button
                    btn.classList.toggle('active');
                    btn.querySelector('span:last-child').textContent = tweet.retweets || '';
                }
            });
        });
    }

    /**
     * Get mock tweets
     */
    getMockTweets() {
        return [
            {
                id: '1',
                username: 'Los Santos PD',
                handle: 'LSPD',
                userAvatar: '👮',
                userColor: '#1DA1F2',
                text: 'Traffic advisory: Heavy congestion on the LS Freeway. Use alternate routes. Stay safe! 🚓',
                likes: 234,
                retweets: 45,
                replies: 12,
                timestamp: Date.now() - 1800000,
                liked: false,
                retweeted: false
            },
            {
                id: '2',
                username: 'Maze Bank',
                handle: 'MazeBank',
                userAvatar: '🏦',
                userColor: '#17BF63',
                text: 'New UPDATE: 0% APR on all new accounts this month! Visit any branch to learn more. 💰 #Finance #LosSantos',
                image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
                likes: 1520,
                retweets: 328,
                replies: 89,
                timestamp: Date.now() - 3600000,
                liked: true,
                retweeted: false
            },
            {
                id: '3',
                username: 'Weazel News',
                handle: 'WeazelNews',
                userAvatar: '📺',
                userColor: '#E1306C',
                text: 'BREAKING: Major heist at the Pacific Standard Bank! Suspects still at large. More details coming soon. #LosSantos #News',
                likes: 3420,
                retweets: 892,
                replies: 234,
                timestamp: Date.now() - 7200000,
                liked: false,
                retweeted: true
            },
            {
                id: '4',
                username: 'Vinewood Stars',
                handle: 'VinewoodStars',
                userAvatar: '⭐',
                userColor: '#F7B731',
                text: 'Red carpet premiere tonight at the Vinewood Bowl! Who are you most excited to see? ✨🎬',
                likes: 567,
                retweets: 123,
                replies: 45,
                timestamp: Date.now() - 10800000,
                liked: false,
                retweeted: false
            },
            {
                id: '5',
                username: 'LS Weather',
                handle: 'LSWeather',
                userAvatar: '⛅',
                userColor: '#00B4D8',
                text: 'Beautiful sunny day ahead! High of 78°F with clear skies. Perfect beach weather! 🏖️☀️',
                likes: 189,
                retweets: 34,
                replies: 8,
                timestamp: Date.now() - 14400000,
                liked: false,
                retweeted: false
            }
        ];
    }

    /**
     * Destroy component
     */
    destroy() {
        // Cleanup
    }
}
