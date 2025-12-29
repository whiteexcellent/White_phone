/**
 * White Phone OS - Messages App
 * iMessage-style messaging application
 */

import { phoneStore } from '../core/state.js';
import { createElement } from '../utils/helpers.js';
import { entrance, exit } from '../core/animations.js';

export class MessagesApp {
    constructor() {
        this.container = null;
        this.conversations = this.getMockConversations();
        this.currentConversation = null;
    }

    /**
     * Render Messages app
     */
    render() {
        this.container = createElement(`
            <div class="messages-app">
                <!-- App Header -->
                <div class="app-header">
                    <button class="app-back-btn" id="messages-back-btn">← Back</button>
                    <h1 class="app-title">Messages</h1>
                    <button class="app-action-btn">✎</button>
                </div>
                
                <!-- Conversations List -->
                <div class="messages-list" id="messages-list">
                    <!-- Conversations will be rendered here -->
                </div>
                
                <!-- Chat View -->
                <div class="messages-chat" id="messages-chat" style="display: none;">
                    <!-- Chat will be rendered here -->
                </div>
            </div>
        `);

        // Setup back button
        this.container.querySelector('#messages-back-btn').addEventListener('click', () => {
            if (this.currentConversation) {
                this.closeChat();
            } else {
                phoneStore.closeApp();
            }
        });

        // Render conversations
        this.renderConversations();

        return this.container;
    }

    /**
     * Render conversations list
     */
    renderConversations() {
        const listContainer = this.container.querySelector('#messages-list');

        listContainer.innerHTML = this.conversations.map((conv, index) => `
            <div class="message-item pressable" data-conv-index="${index}">
                <div class="message-avatar" style="background: ${conv.color}">
                    ${conv.avatar}
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-name">${conv.name}</span>
                        <span class="message-time">${conv.lastTime}</span>
                    </div>
                    <div class="message-preview">
                        ${conv.lastMessage}
                    </div>
                </div>
                ${conv.unread ? `<div class="message-unread-badge">${conv.unread}</div>` : ''}
            </div>
        `).join('');

        // Add click handlers
        listContainer.querySelectorAll('.message-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openChat(index);
            });
        });
    }

    /**
     * Open chat view
     */
    openChat(index) {
        this.currentConversation = this.conversations[index];

        const listContainer = this.container.querySelector('#messages-list');
        const chatContainer = this.container.querySelector('#messages-chat');

        // Hide list, show chat
        exit(listContainer, 'slideLeft').finished.then(() => {
            listContainer.style.display = 'none';
            chatContainer.style.display = 'flex';
            entrance(chatContainer, 'slideLeft');
        });

        // Render chat
        this.renderChat();

        // Update title
        this.container.querySelector('.app-title').textContent = this.currentConversation.name;
    }

    /**
     * Close chat view
     */
    closeChat() {
        const listContainer = this.container.querySelector('#messages-list');
        const chatContainer = this.container.querySelector('#messages-chat');

        // Hide chat, show list
        exit(chatContainer, 'slideRight').finished.then(() => {
            chatContainer.style.display = 'none';
            listContainer.style.display = 'block';
            entrance(listContainer, 'slideRight');
        });

        this.currentConversation = null;

        // Update title
        this.container.querySelector('.app-title').textContent = 'Messages';
    }

    /**
     * Render chat view
     */
    renderChat() {
        const chatContainer = this.container.querySelector('#messages-chat');

        chatContainer.innerHTML = `
            <div class="chat-messages" id="chat-messages">
                ${this.currentConversation.messages.map(msg => this.renderMessage(msg)).join('')}
            </div>
            
            <div class="chat-input-container">
                <button class="chat-attach-btn">+</button>
                <input type="text" class="chat-input" id="chat-input" placeholder="iMessage">
                <button class="chat-send-btn" id="chat-send-btn">↑</button>
            </div>
        `;

        // Setup send button
        const sendBtn = chatContainer.querySelector('#chat-send-btn');
        const input = chatContainer.querySelector('#chat-input');

        const sendMessage = () => {
            const text = input.value.trim();
            if (text) {
                this.sendMessage(text);
                input.value = '';
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Scroll to bottom
        setTimeout(() => {
            const messagesContainer = chatContainer.querySelector('#chat-messages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    /**
     * Render single message
     */
    renderMessage(msg) {
        const isMe = msg.from === 'me';
        return `
            <div class="chat-message ${isMe ? 'chat-message-me' : 'chat-message-them'}">
                <div class="chat-bubble">
                    ${msg.text}
                </div>
                <div class="chat-message-time">${msg.time}</div>
            </div>
        `;
    }

    /**
     * Send a message
     */
    sendMessage(text) {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        const message = {
            from: 'me',
            text,
            time
        };

        this.currentConversation.messages.push(message);

        // Re-render chat
        this.renderChat();
    }

    /**
     * Get mock conversations
     */
    getMockConversations() {
        return [
            {
                name: 'John Doe',
                avatar: '👨',
                color: '#007AFF',
                lastMessage: 'Hey, are you coming to the party tonight?',
                lastTime: '2m ago',
                unread: 2,
                messages: [
                    { from: 'them', text: 'Hey! How are you?', time: '10:30' },
                    { from: 'me', text: 'Good! You?', time: '10:32' },
                    { from: 'them', text: 'Great! Are you free tonight?', time: '10:35' },
                    { from: 'them', text: 'Hey, are you coming to the party tonight?', time: '10:36' }
                ]
            },
            {
                name: 'Jane Smith',
                avatar: '👩',
                color: '#FF2D55',
                lastMessage: 'See you tomorrow!',
                lastTime: '1h ago',
                unread: 0,
                messages: [
                    { from: 'them', text: 'Don\'t forget about the meeting', time: '09:00' },
                    { from: 'me', text: 'I won\'t, thanks!', time: '09:15' },
                    { from: 'them', text: 'See you tomorrow!', time: '09:20' }
                ]
            },
            {
                name: 'Mike Johnson',
                avatar: '🧑',
                color: '#34C759',
                lastMessage: 'Thanks for your help!',
                lastTime: '2h ago',
                unread: 0,
                messages: [
                    { from: 'them', text: 'Can you help me with this?', time: '08:00' },
                    { from: 'me', text: 'Sure, what do you need?', time: '08:05' },
                    { from: 'them', text: 'Thanks for your help!', time: '08:30' }
                ]
            },
            {
                name: 'Sarah Wilson',
                avatar: '👧',
                color: '#FFCC00',
                lastMessage: 'That sounds great!',
                lastTime: '1d ago',
                unread: 0,
                messages: [
                    { from: 'me', text: 'Want to grab lunch?', time: 'Yesterday' },
                    { from: 'them', text: 'That sounds great!', time: 'Yesterday' }
                ]
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
