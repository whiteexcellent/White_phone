// ==================== CORE TYPES ====================

export interface PhoneState {
    isOpen: boolean;
    isLocked: boolean;
    currentApp: string | null;
    currentPage: number;
    battery: number;
    signal: number;
    wifi: boolean;
    bluetooth: boolean;
    airplaneMode: boolean;
    doNotDisturb: boolean;
}

export interface Notification {
    id: string;
    appId: string;
    appName: string;
    appIcon: string;
    appColor: string;
    title: string;
    body: string;
    time: string;
    timestamp: number;
    read: boolean;
}

export interface App {
    id: string;
    name: string;
    icon: string;
    color: string;
    badge?: number;
    dock?: boolean;
    system?: boolean;
    position?: number;
}

// ==================== APP-SPECIFIC TYPES ====================

export interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
    favorite?: boolean;
    blocked?: boolean;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    mediaUrl?: string;
    timestamp: number;
    read: boolean;
    delivered: boolean;
}

export interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantAvatar?: string;
    lastMessage: string;
    lastMessageTime: number;
    unreadCount: number;
}

export interface Call {
    id: string;
    contactId: string;
    contactName: string;
    contactNumber: string;
    type: 'incoming' | 'outgoing' | 'missed';
    duration: number;
    timestamp: number;
}

export interface Tweet {
    id: string;
    authorId: string;
    authorName: string;
    authorHandle: string;
    authorAvatar?: string;
    content: string;
    mediaUrl?: string;
    likes: number;
    retweets: number;
    replies: number;
    timestamp: number;
    liked?: boolean;
    retweeted?: boolean;
}

export interface BankTransaction {
    id: string;
    type: 'deposit' | 'withdrawal' | 'transfer';
    amount: number;
    description: string;
    recipient?: string;
    timestamp: number;
    balance: number;
}

export interface Photo {
    id: string;
    url: string;
    thumbnail?: string;
    timestamp: number;
    location?: string;
}

// ==================== NUI TYPES ====================

export interface NUIMessage<T = any> {
    action: string;
    data?: T;
}

export interface NUIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

// ==================== WIDGET TYPES ====================

export interface Widget {
    id: string;
    type: 'weather' | 'calendar' | 'battery' | 'stocks' | 'news';
    size: 'small' | 'medium' | 'large';
    position: number;
    data: any;
}

export interface WeatherData {
    location: string;
    temperature: number;
    condition: string;
    icon: string;
    high: number;
    low: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startTime: number;
    endTime: number;
    location?: string;
    color: string;
}

// ==================== SETTINGS TYPES ====================

export interface PhoneSettings {
    theme: 'light' | 'dark' | 'auto';
    wallpaper: string;
    ringtone: string;
    vibration: boolean;
    brightness: number;
    volume: number;
    notifications: boolean;
    doNotDisturb: {
        enabled: boolean;
        schedule?: {
            start: string;
            end: string;
        };
    };
}
