const Phone = {
    state: {
        isOpen: true,
        isLocked: true,
        currentApp: null,
        currentPage: 0,
        notifications: [],
        controlCenterOpen: false,
        notificationCenterOpen: false
    },

    config: {
        apps: [
            // Page 1
            { id: 'phone', name: 'Phone', icon: '📞', color: '#34C759', dock: true, badge: 0 },
            { id: 'messages', name: 'Messages', icon: '💬', color: '#34C759', dock: true, badge: 3 },
            { id: 'mail', name: 'Mail', icon: '📧', color: '#007AFF', badge: 12 },
            { id: 'safari', name: 'Safari', icon: '🧭', color: '#007AFF', dock: true },

            { id: 'photos', name: 'Photos', icon: '🖼️', color: '#FF2D55' },
            { id: 'camera', name: 'Camera', icon: '📷', color: '#5E5CE6', dock: true },
            { id: 'maps', name: 'Maps', icon: '🗺️', color: '#32D74B' },
            { id: 'weather', name: 'Weather', icon: '🌤️', color: '#007AFF' },

            { id: 'clock', name: 'Clock', icon: '⏰', color: '#FF9500' },
            { id: 'calendar', name: 'Calendar', icon: '📅', color: '#FF3B30' },
            { id: 'notes', name: 'Notes', icon: '📝', color: '#FFD60A' },
            { id: 'reminders', name: 'Reminders', icon: '✅', color: '#FF3B30' },

            { id: 'settings', name: 'Settings', icon: '⚙️', color: '#8E8E93' },
            { id: 'files', name: 'Files', icon: '📁', color: '#007AFF' },
            { id: 'contacts', name: 'Contacts', icon: '👤', color: '#8E8E93' },
            { id: 'calculator', name: 'Calculator', icon: '🔢', color: '#FF9500' },

            { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2', badge: 5 },
            { id: 'bank', name: 'Bank', icon: '💳', color: '#32D74B' },
            { id: 'emergency', name: 'Emergency', icon: '🚨', color: '#FF3B30' },
            { id: 'music', name: 'Music', icon: '🎵', color: '#FF2D55' }
        ]
    },

    init() {
        console.log('📱 White Phone OS v2.0 Initializing...');

        this.renderApps();
        this.startClock();
        this.updateDate();
        this.setupListeners();
        this.addMockNotifications();

        // Auto-unlock after 2 seconds for demo
        setTimeout(() => {
            if (this.state.isLocked) {
                this.unlock();
            }
        }, 2000);

        console.log('✅ Phone initialized successfully');
    },

    // ==================== LOCK/UNLOCK ====================
    unlock() {
        const lockScreen = document.getElementById('lock-screen');
        const homeScreen = document.getElementById('home-screen');
        const wallpaper = document.getElementById('wallpaper');

        this.state.isLocked = false;

        // Animate lock screen out
        lockScreen.style.transform = 'translateY(-100%)';

        // Show home screen
        setTimeout(() => {
            homeScreen.classList.remove('hidden');
            homeScreen.classList.add('active');
            wallpaper.classList.add('blurred');
        }, 200);

        console.log('🔓 Phone unlocked');
    },

    lock() {
        const lockScreen = document.getElementById('lock-screen');
        const homeScreen = document.getElementById('home-screen');
        const wallpaper = document.getElementById('wallpaper');

        this.state.isLocked = true;

        // Hide home screen
        homeScreen.classList.remove('active');
        wallpaper.classList.remove('blurred');

        // Show lock screen
        setTimeout(() => {
            lockScreen.style.transform = 'translateY(0)';
            homeScreen.classList.add('hidden');
        }, 300);

        console.log('🔒 Phone locked');
    },

    // ==================== APP MANAGEMENT ====================
    renderApps() {
        const grid = document.getElementById('app-grid-0');
        const dock = document.getElementById('dock');

        this.config.apps.forEach(app => {
            if (app.dock) {
                // Render in dock
                const dockIcon = this.createAppIcon(app, true);
                dock.appendChild(dockIcon);
            } else {
                // Render in grid
                const appItem = this.createAppItem(app);
                grid.appendChild(appItem);
            }
        });
    },

    createAppIcon(app, isDock = false) {
        const icon = document.createElement('div');
        icon.className = 'app-icon' + (app.badge > 0 ? ' has-badge' : '');
        icon.style.background = app.color;
        icon.innerHTML = `<span style="font-size: ${isDock ? '28px' : '32px'};">${app.icon}</span>`;

        if (app.badge > 0) {
            icon.setAttribute('data-badge', app.badge > 99 ? '99+' : app.badge);
        }

        icon.onclick = () => this.openApp(app.id);
        return icon;
    },

    createAppItem(app) {
        const item = document.createElement('div');
        item.className = 'app-item';

        const icon = this.createAppIcon(app);
        const name = document.createElement('div');
        name.className = 'app-name';
        name.textContent = app.name;

        item.appendChild(icon);
        item.appendChild(name);

        return item;
    },

    openApp(appId) {
        if (this.state.currentApp) return;

        const app = this.config.apps.find(a => a.id === appId);
        if (!app) return;

        const appContainer = document.getElementById('app-container');
        appContainer.innerHTML = this.getAppHTML(app);

        const appScreen = appContainer.querySelector('.app-screen');

        requestAnimationFrame(() => {
            appScreen.classList.add('active');
        });

        this.state.currentApp = appId;
        console.log(`📱 Opened: ${app.name}`);
    },

    closeApp() {
        if (!this.state.currentApp) return;

        const appScreen = document.querySelector('.app-screen');
        appScreen.classList.remove('active');

        setTimeout(() => {
            document.getElementById('app-container').innerHTML = '';
            this.state.currentApp = null;
        }, 350);
    },

    getAppHTML(app) {
        // Get app-specific content
        const content = this.getAppContent(app.id);

        return `
            <div class="app-screen">
                <div class="app-header">
                    <div class="header-action" onclick="Phone.closeApp()">
                        <i class="fas fa-chevron-left"></i> Back
                    </div>
                    <div class="header-title">${app.name}</div>
                    <div class="header-action"></div>
                </div>
                <div class="app-content">
                    ${content}
                </div>
            </div>
        `;
    },

    getAppContent(appId) {
        const contents = {
            phone: this.getPhoneContent(),
            messages: this.getMessagesContent(),
            settings: this.getSettingsContent(),
            twitter: this.getTwitterContent(),
            bank: this.getBankContent(),
            photos: this.getPhotosContent(),
            mail: this.getMailContent(),
            calendar: this.getCalendarContent()
        };

        return contents[appId] || this.getDefaultContent(appId);
    },

    getDefaultContent(appId) {
        return `
            <div class="card">
                <div class="card-header">${appId.charAt(0).toUpperCase() + appId.slice(1)}</div>
                <div class="card-body">
                    This is a demo app. Full functionality requires FiveM server integration.
                </div>
            </div>
            <div class="list-group">
                <div class="list-item">
                    <div class="list-icon" style="background: #007AFF;">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="list-content">
                        <div class="list-title">Feature 1</div>
                        <div class="list-subtitle">Demo feature description</div>
                    </div>
                    <div class="list-arrow">›</div>
                </div>
                <div class="list-item">
                    <div class="list-icon" style="background: #32D74B;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="list-content">
                        <div class="list-title">Feature 2</div>
                        <div class="list-subtitle">Another demo feature</div>
                    </div>
                    <div class="list-arrow">›</div>
                </div>
            </div>
        `;
    },

    // ==================== APP CONTENTS ====================
    getPhoneContent() {
        return `
            <div class="list-group">
                <div class="list-item">
                    <div class="avatar">JD</div>
                    <div class="list-content">
                        <div class="list-title">John Doe</div>
                        <div class="list-subtitle">Mobile • 2 min ago</div>
                    </div>
                    <i class="fas fa-phone" style="color: #32D74B;"></i>
                </div>
                <div class="list-item">
                    <div class="avatar" style="background: #FF3B30;">AS</div>
                    <div class="list-content">
                        <div class="list-title">Alice Smith</div>
                        <div class="list-subtitle">Mobile • 15 min ago</div>
                    </div>
                    <i class="fas fa-phone" style="color: #32D74B;"></i>
                </div>
                <div class="list-item">
                    <div class="avatar" style="background: #FF9500;">MB</div>
                    <div class="list-content">
                        <div class="list-title">Mike Brown</div>
                        <div class="list-subtitle">Mobile • 1 hour ago</div>
                    </div>
                    <i class="fas fa-phone" style="color: #32D74B;"></i>
                </div>
            </div>
            <button class="btn btn-primary btn-large btn-block">
                <i class="fas fa-phone"></i> New Call
            </button>
        `;
    },

    getMessagesContent() {
        return `
            <div class="list-group">
                <div class="list-item">
                    <div class="avatar">JD</div>
                    <div class="list-content">
                        <div class="list-title">John Doe</div>
                        <div class="list-subtitle">Hey, are you free tonight?</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 12px; color: rgba(255,255,255,0.5);">2m</div>
                        <span class="badge badge-primary" style="margin-top: 4px;">2</span>
                    </div>
                </div>
                <div class="list-item">
                    <div class="avatar" style="background: #FF3B30;">AS</div>
                    <div class="list-content">
                        <div class="list-title">Alice Smith</div>
                        <div class="list-subtitle">Thanks for the help! 👍</div>
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">1h</div>
                </div>
                <div class="list-item">
                    <div class="avatar" style="background: #FF9500;">MB</div>
                    <div class="list-content">
                        <div class="list-title">Mike Brown</div>
                        <div class="list-subtitle">See you tomorrow</div>
                    </div>
                    <div style="font-size: 12px; color: rgba(255,255,255,0.5);">3h</div>
                </div>
            </div>
        `;
    },

    getSettingsContent() {
        return `
            <div class="list-group">
                <div class="list-item">
                    <div class="list-icon" style="background: #007AFF;">
                        <i class="fas fa-wifi"></i>
                    </div>
                    <div class="list-content">
                        <div class="list-title">Wi-Fi</div>
                        <div class="list-subtitle">Home Network</div>
                    </div>
                    <div class="list-arrow">›</div>
                </div>
                <div class="list-item">
                    <div class="list-icon" style="background: #007AFF;">
                        <i class="fas fa-bluetooth"></i>
                    </div>
                    <div class="list-content">
                        <div class="list-title">Bluetooth</div>
                        <div class="list-subtitle">Off</div>
                    </div>
                    <div class="list-arrow">›</div>
                </div>
            </div>
            <div class="list-group">
                <div class="list-item">
                    <div class="list-icon" style="background: #FF3B30;">
                        <i class="fas fa-bell"></i>
                    </div>
                    <div class="list-content">
                        <div class="list-title">Notifications</div>
                    </div>
                    <div class="list-arrow">›</div>
                </div>
                <div class="list-item">
                    <div class="list-icon" style="background: #5E5CE6;">
                        <i class="fas fa-moon"></i>
                    </div>
                    <div class="list-content">
                        <div class="list-title">Do Not Disturb</div>
                    </div>
                    <div class="toggle-switch" onclick="this.classList.toggle('active')"></div>
                </div>
            </div>
        `;
    },

    getTwitterContent() {
        return `
            <div class="card" style="margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <div class="avatar">EM</div>
                    <div>
                        <div style="font-weight: 600;">Elon Musk</div>
                        <div style="font-size: 13px; opacity: 0.6;">@elonmusk • 2h</div>
                    </div>
                </div>
                <div style="margin-bottom: 12px;">
                    Just launched another rocket 🚀 #SpaceX
                </div>
                <div style="display: flex; gap: 20px; opacity: 0.7;">
                    <span><i class="far fa-comment"></i> 234</span>
                    <span><i class="fas fa-retweet"></i> 1.2K</span>
                    <span><i class="far fa-heart"></i> 5.6K</span>
                </div>
            </div>
            <div class="card">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <div class="avatar" style="background: #FF3B30;">JD</div>
                    <div>
                        <div style="font-weight: 600;">John Doe</div>
                        <div style="font-size: 13px; opacity: 0.6;">@johndoe • 5h</div>
                    </div>
                </div>
                <div>
                    Beautiful day in Los Santos! 🌞
                </div>
            </div>
        `;
    },

    getBankContent() {
        return `
            <div class="card">
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 14px; opacity: 0.7; margin-bottom: 8px;">Available Balance</div>
                    <div style="font-size: 48px; font-weight: 300;">$12,450</div>
                </div>
            </div>
            <div class="list-group">
                <div class="list-item">
                    <div class="list-icon" style="background: #32D74B;">
                        <i class="fas fa-arrow-down"></i>
                    </div>
                    <div class="list-content">
                        <div class="list-title">Salary Deposit</div>
                        <div class="list-subtitle">Today, 09:00 AM</div>
                    </div>
                    <div style="color: #32D74B; font-weight: 600;">+$5,000</div>
                </div>
                <div class="list-item">
                    <div class="list-icon" style="background: #FF3B30;">
                        <i class="fas fa-arrow-up"></i>
                    </div>
                    <div class="list-content">
                        <div class="list-title">Grocery Store</div>
                        <div class="list-subtitle">Yesterday, 06:30 PM</div>
                    </div>
                    <div style="color: #FF3B30; font-weight: 600;">-$150</div>
                </div>
            </div>
            <button class="btn btn-primary btn-large btn-block">
                <i class="fas fa-paper-plane"></i> Send Money
            </button>
        `;
    },

    getPhotosContent() {
        return `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
                ${Array(9).fill(0).map((_, i) => `
                    <div style="aspect-ratio: 1; background: linear-gradient(135deg, #667eea ${i * 10}%, #764ba2 100%); border-radius: 8px;"></div>
                `).join('')}
            </div>
        `;
    },

    getMailContent() {
        return `
            <div class="list-group">
                <div class="list-item">
                    <div class="avatar">AP</div>
                    <div class="list-content">
                        <div class="list-title">Apple</div>
                        <div class="list-subtitle">Your receipt from Apple Store</div>
                    </div>
                    <div style="font-size: 12px; opacity: 0.5;">10:30 AM</div>
                </div>
                <div class="list-item">
                    <div class="avatar" style="background: #1DA1F2;">TW</div>
                    <div class="list-content">
                        <div class="list-title">Twitter</div>
                        <div class="list-subtitle">You have 5 new followers</div>
                    </div>
                    <div style="font-size: 12px; opacity: 0.5;">Yesterday</div>
                </div>
            </div>
        `;
    },

    getCalendarContent() {
        return `
            <div class="card">
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Today's Events</div>
                <div style="display: flex; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 4px; background: #007AFF; border-radius: 2px;"></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">Team Meeting</div>
                        <div style="font-size: 14px; opacity: 0.7;">10:00 AM - 11:00 AM</div>
                    </div>
                </div>
                <div style="display: flex; gap: 12px;">
                    <div style="width: 4px; background: #32D74B; border-radius: 2px;"></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600;">Lunch with Client</div>
                        <div style="font-size: 14px; opacity: 0.7;">12:30 PM - 02:00 PM</div>
                    </div>
                </div>
            </div>
        `;
    },

    // ==================== CONTROL CENTER ====================
    openControlCenter() {
        const cc = document.getElementById('control-center');
        cc.classList.remove('hidden');
        requestAnimationFrame(() => {
            cc.classList.add('active');
        });
        this.state.controlCenterOpen = true;
    },

    closeControlCenter() {
        const cc = document.getElementById('control-center');
        cc.classList.remove('active');
        setTimeout(() => {
            cc.classList.add('hidden');
        }, 400);
        this.state.controlCenterOpen = false;
    },

    // ==================== NOTIFICATION CENTER ====================
    openNotificationCenter() {
        const nc = document.getElementById('notification-center');
        nc.classList.remove('hidden');
        requestAnimationFrame(() => {
            nc.classList.add('active');
        });
        this.state.notificationCenterOpen = true;
    },

    closeNotificationCenter() {
        const nc = document.getElementById('notification-center');
        nc.classList.remove('active');
        setTimeout(() => {
            nc.classList.add('hidden');
        }, 400);
        this.state.notificationCenterOpen = false;
    },

    addMockNotifications() {
        const lockNotifs = document.getElementById('lock-notifications');
        const notifList = document.getElementById('notification-list');

        const notifications = [
            { app: 'Messages', icon: '💬', color: '#34C759', title: 'John Doe', body: 'Hey, are you free tonight?', time: '2m ago' },
            { app: 'Twitter', icon: '🐦', color: '#1DA1F2', title: 'New Follower', body: '@alice_smith started following you', time: '1h ago' },
            { app: 'Mail', icon: '📧', color: '#007AFF', title: 'Apple', body: 'Your receipt from Apple Store', time: '3h ago' }
        ];

        notifications.forEach(notif => {
            const html = `
                <div class="notification-item">
                    <div class="notification-header">
                        <div class="notification-icon" style="background: ${notif.color};">${notif.icon}</div>
                        <div class="notification-app">${notif.app}</div>
                        <div class="notification-time">${notif.time}</div>
                    </div>
                    <div class="notification-title">${notif.title}</div>
                    <div class="notification-body">${notif.body}</div>
                </div>
            `;
            lockNotifs.innerHTML += html;
            notifList.innerHTML += html;
        });
    },

    // ==================== CLOCK & DATE ====================
    startClock() {
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const timeStr = `${hours}:${minutes}`;

            document.getElementById('clock-time').textContent = timeStr;
            document.getElementById('lock-time').textContent = timeStr;
        };

        updateClock();
        setInterval(updateClock, 1000);
    },

    updateDate() {
        const now = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('en-US', options);

        document.getElementById('lock-date').textContent = dateStr;
    },

    // ==================== EVENT LISTENERS ====================
    setupListeners() {
        // ESC key
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                if (this.state.currentApp) {
                    this.closeApp();
                } else if (this.state.controlCenterOpen) {
                    this.closeControlCenter();
                } else if (this.state.notificationCenterOpen) {
                    this.closeNotificationCenter();
                } else if (!this.state.isLocked) {
                    this.lock();
                }
            }
        });

        // Lock screen unlock
        document.getElementById('lock-screen').addEventListener('click', (e) => {
            if (e.target.closest('.lock-action-btn')) return;
            if (this.state.isLocked) {
                this.unlock();
            }
        });

        // Home indicator
        document.querySelector('.home-indicator').addEventListener('click', () => {
            if (this.state.currentApp) {
                this.closeApp();
            } else if (!this.state.isLocked) {
                this.lock();
            }
        });

        // Search bar (opens spotlight)
        document.getElementById('home-search')?.addEventListener('click', () => {
            console.log('🔍 Spotlight search (not implemented in demo)');
        });
    }
};

window.onload = () => Phone.init();
