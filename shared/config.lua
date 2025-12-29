Config = {}

-- ================================================
-- CORE PHONE SETTINGS
-- ================================================

Config.Framework = 'qb-core' -- 'qb-core', 'esx', or 'standalone'
Config.DefaultPIN = nil -- Set to string for default PIN, nil for no PIN
Config.MaxPINAttempts = 3
Config.PINLockoutTime = 300 -- seconds

-- ================================================
-- BATTERY SYSTEM
-- ================================================

Config.BatteryDrain = {
    Enabled = true,
    DrainRate = 1, -- % per minute when phone is open
    IdleDrainRate = 0.1, -- % per minute when phone is closed
    DeadBatteryAt = 0,
    ChargingRate = 5, -- % per minute when charging
}

-- ================================================
-- DEFAULT APPS
-- ================================================

Config.DefaultApps = {
    {id = 'phone', name = 'Phone', icon = 'phone.png', color = '#34C759', position = 1, system = true},
    {id = 'contacts', name = 'Contacts', icon = 'contacts.png', color = '#8E8E93', position = 2, system = true},
    {id = 'messages', name = 'Messages', icon = 'messages.png', color = '#34C759', position = 3, system = true},
    {id = 'camera', name = 'Camera', icon = 'camera.png', color = '#5E5CE6', position = 4, system = true},
    {id = 'gallery', name = 'Gallery', icon = 'gallery.png', color = '#FF2D55', position = 5, system = true},
    {id = 'settings', name = 'Settings', icon = 'settings.png', color = '#8E8E93', position = 6, system = true},
    {id = 'banking', name = 'Bank', icon = 'banking.png', color = '#007AFF', position = 7, system = true},
    {id = 'emergency', name = 'Emergency', icon = 'emergency.png', color = '#FF3B30', position = 8, system = true},
}

-- ================================================
-- APP STORE APPS
-- ================================================

Config.AppStoreApps = {
    {id = 'twitter', name = 'X', price = 0, icon = 'twitter.png', color = '#000000'},
    {id = 'notes', name = 'Notes', price = 0, icon = 'notes.png', color = '#FFD60A'},
    {id = 'calendar', name = 'Calendar', price = 0, icon = 'calendar.png', color = '#FF3B30'},
    {id = 'maps', name = 'Maps', price = 0, icon = 'maps.png', color = '#34C759'},
    {id = 'crypto', name = 'Crypto Wallet', price = 500, icon = 'crypto.png', color = '#FF9500'},
}

-- ================================================
-- HACK PHONE SYSTEM
-- ================================================

Config.HackPhone = {
    Enabled = true,
    RequireJob = {'hacker'}, -- Jobs that can use hack phone
    RequireItem = nil, -- Optional: Item name required (e.g., 'hacker_license')
    
    -- Costs (in-game money)
    TrackingCost = 1000,
    UnlockCost = 2500,
    MessageInjectionCost = 500,
    CameraAccessCost = 3000,
    DatabaseQueryCost = 5000,
    
    -- Duration & Success Rates
    TrackingDuration = 300, -- seconds (5 minutes)
    UnlockSuccessRate = 70, -- % success chance
    CameraAccessDuration = 60, -- seconds
    
    -- Police Alert System
    PoliceAlert = {
        Enabled = true,
        AlertChance = 30, -- % chance police get alerted on hack attempts
        AlertJobs = {'police'},
        AlertMessage = 'Suspicious phone activity detected'
    },
    
    -- Rate Limiting
    RateLimit = {
        Enabled = true,
        MaxAttempts = 5,
        TimeWindow = 600 -- seconds (10 minutes)
    }
}

-- ================================================
-- EMERGENCY SERVICES
-- ================================================

Config.EmergencyNumbers = {
    police = '911',
    ems = '911',
    fire = '911'
}

Config.EmergencyJobNames = {
    police = 'police',
    ems = 'ambulance',
    fire = 'fire'
}

-- ================================================
-- MESSAGES SYSTEM
-- ================================================

Config.Messages = {
    MaxMessageLength = 500,
    AllowMediaMessages = true,
    MediaUploadURL = 'https://your-image-host.com/upload', -- Change this to your image hosting service
    DeleteAfterDays = 30, -- Auto-delete messages older than X days (0 = never)
}

-- ================================================
-- TWITTER/X SETTINGS
-- ================================================

Config.Twitter = {
    Enabled = true,
    MaxTweetLength = 280,
    MaxBioLength = 160,
    AllowMedia = true,
    VerifiedBadgeItem = 'verified_badge', -- Item required for verified status
    MaxTweetsPerHour = 20,
}

-- ================================================
-- BANKING INTEGRATION
-- ================================================

Config.Banking = {
    Integration = 'qb-banking', -- Your banking resource name
    AllowQRPayments = true,
    MaxTransferAmount = 999999,
    TransferFee = 0, -- % fee on transfers (0 = no fee)
}

-- ================================================
-- CAMERA SETTINGS
-- ================================================

Config.Camera = {
    AllowPhotos = true,
    AllowVideos = false, -- Video recording (more complex, optional)
    PhotoQuality = 0.8, -- 0.0 to 1.0
    MaxPhotosInGallery = 100,
    AutoDeleteOldPhotos = true,
}

-- ================================================
-- LOCATION & GPS
-- ================================================

Config.Location = {
    AllowLiveSharing = true,
    ShareDuration = 3600, -- seconds (1 hour max)
    UpdateInterval = 5, -- seconds between location updates
}

-- ================================================
-- NOTIFICATIONS
-- ================================================

Config.Notifications = {
    CacheTime = 300, -- seconds
    MaxNotifications = 50,
    AutoClearAfterDays = 7,
    PlaySound = true,
    Vibrate = true,
}

-- ================================================
-- PERFORMANCE
-- ================================================

Config.Performance = {
    MaxCachedMessages = 100,
    MaxCachedContacts = 200,
    ImageCompressionQuality = 0.8,
    DatabaseCleanupInterval = 3600, -- seconds (1 hour)
}

-- ================================================
-- SIM CARD SYSTEM (OPTIONAL)
-- ================================================

Config.SIMCard = {
    Enabled = false, -- Enable SIM card swapping feature
    RequireItem = 'sim_card',
    AllowWiFiWithoutSIM = true, -- Can use phone without SIM (WiFi only mode)
}

-- ================================================
-- PHONE INSURANCE (OPTIONAL)
-- ================================================

Config.Insurance = {
    Enabled = false,
    Plans = {
        basic = {price = 500, maxClaims = 2, duration = 30}, -- days
        premium = {price = 1500, maxClaims = 5, duration = 30},
    }
}

-- ================================================
-- KEYBINDS
-- ================================================

Config.Keybinds = {
    OpenPhone = 'F1', -- Key to open phone (if not using item)
    TakePhoto = 'ENTER', -- Key to take photo when camera is open
}

-- ================================================
-- DEBUG MODE
-- ================================================

Config.Debug = false -- Enable debug prints

-- ================================================
-- SECURITY & ANTI-EXPLOIT
-- ================================================

Config.Security = {
    -- Session Management
    SingleDeviceSession = true,
    SessionTimeout = 900, -- 15 minutes of inactivity
    
    -- Anti-Exploit
    EventThrottleMs = 100,
    MaxEventsPerMinute = 60,
    LogSuspiciousActivity = true,
    
    -- Device Validation
    ValidateDeviceOwnership = true,
    BlockDuplicateSessions = true,
    
    -- PIN Security
    PINLockoutEscalation = true, -- Each lockout doubles duration
    MaxLockoutDuration = 3600, -- 1 hour max
    
    -- Rate Limiting
    RateLimits = {
        sendMessage = 500, -- ms between sends
        makeCall = 2000,
        uploadPhoto = 3000,
        sendTweet = 1000,
        bankTransfer = 2000,
    }
}

-- ================================================
-- CLOUD BACKUP
-- ================================================

Config.Cloud = {
    Enabled = true,
    FreeStorageMB = 50,
    PremiumStorageMB = 500,
    PremiumPrice = 5000, -- In-game currency
    
    BackupRetentionDays = 30,
    MaxBackupsPerAccount = 5,
    RestoreCooldown = 3600, -- 1 hour between restores
    
    -- What can be backed up
    BackupOptions = {
        contacts = true,
        messages = true,
        gallery = false, -- Storage intensive
        apps = true,
        settings = true,
    }
}

-- ================================================
-- FIND MY PHONE
-- ================================================

Config.FindMyPhone = {
    Enabled = true,
    TrackingCost = 0, -- Free for own phone
    RemoteLockEnabled = true,
    RemoteWipeEnabled = true,
    RingEnabled = true,
    DisplayMessageEnabled = true,
    
    -- Location update interval when tracking
    UpdateInterval = 5, -- seconds
    MaxTrackingDuration = 3600, -- 1 hour
}

-- ================================================
-- ECONOMY & BANKING ANTI-ABUSE
-- ================================================

Config.Economy = {
    -- Transaction Limits
    TransferLimits = {
        single = 100000,
        hourly = 50000,
        daily = 200000,
        weekly = 500000,
    },
    
    -- Anti-Money Laundering
    FlagThreshold = 3, -- Flags before account review
    AutoFreezeOnHighRisk = false, -- Auto-freeze flagged accounts
    
    -- Suspicious Patterns
    DetectRoundNumbers = true,
    DetectCircularTransfers = true,
    DetectStructuring = true,
    StructuringThreshold = 9000, -- Detect splits near this amount
    
    -- Admin Notification
    NotifyAdminsOnFlag = true,
    AdminDiscordWebhook = '', -- Optional
}

-- ================================================
-- OF-STYLE CONTENT APP
-- ================================================

Config.OFApp = {
    Enabled = true,
    AppName = 'FansOnly', -- Customize name
    
    -- Platform Economics
    PlatformFee = 0.20, -- 20% cut
    MinSubscriptionPrice = 5,
    MaxSubscriptionPrice = 100,
    MinTipAmount = 1,
    MaxTipAmount = 1000,
    
    -- Payouts
    PayoutThreshold = 100,
    PayoutCooldown = 86400, -- 24 hours
    
    -- Anti-Abuse
    MaxContentPerDay = 20,
    MaxSubscriptionsPerHour = 10,
    NewCreatorCooldown = 3600, -- 1 hour before can post
    
    -- Verification
    VerificationPrice = 500,
    VerifiedBadgeIcon = 'verified.png',
}

-- ================================================
-- PUSH NOTIFICATIONS
-- ================================================

Config.PushNotifications = {
    Enabled = true,
    
    -- Notification Types
    Types = {
        message = {sound = 'message.ogg', priority = 'high'},
        call = {sound = 'ringtone.ogg', priority = 'urgent'},
        twitter = {sound = 'notification.ogg', priority = 'normal'},
        banking = {sound = 'cash.ogg', priority = 'high'},
        emergency = {sound = 'emergency.ogg', priority = 'urgent'},
    },
    
    -- Grouping
    GroupSimilarNotifications = true,
    MaxVisibleNotifications = 5,
    
    -- Do Not Disturb
    DNDEnabled = true,
    DNDSchedule = {
        start = '23:00',
        ['end'] = '07:00',
    }
}

-- ================================================
-- APP PERMISSIONS
-- ================================================

Config.AppPermissions = {
    Enabled = true,
    
    -- Default permissions for system apps
    SystemAppDefaults = {
        camera = {'camera', 'gallery'},
        gallery = {'gallery'},
        maps = {'gps'},
        emergency = {'gps', 'microphone'},
    },
    
    -- Permission types
    PermissionTypes = {'camera', 'gps', 'contacts', 'gallery', 'microphone', 'notifications'},
}

return Config
