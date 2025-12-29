# 📱 White Phone OS - Next-Gen FiveM Phone System

> A production-ready, real-life smartphone experience for FiveM servers.

[![FiveM](https://img.shields.io/badge/FiveM-Ready-success)](https://fivem.net/)
[![Framework](https://img.shields.io/badge/Framework-QB--Core%20%7C%20ESX-blue)](https://github.com/qbcore-framework)
[![License](https://img.shields.io/badge/License-Custom-red)](LICENSE)

---

## 🌟 Features

### Core Philosophy
- **Device-Based Accounts**: Phone belongs to the device, not the player
- **Real Trading**: Give your phone to someone = they get all your data
- **No Player Links**: Zero dependency on citizenid/steamid/license
- **Premium UI**: iOS/Android hybrid design with smooth animations

### Standard Phone (Item: `phone`)
- 📞 **Phone & Contacts** - Call history, favorites, contact management
- 💬 **Messages** - Real-time messaging with media support
- 📷 **Camera & Gallery** - Photo capture and cloud storage
- 🐦 **Twitter/X** - Social media with likes, retweets, profiles
- 💳 **Banking** - Secure transfers with anti-abuse detection
- 🚨 **Emergency** - 911 calls with GPS sharing
- 📅 **Calendar** - Events and reminders
- ⚙️ **Settings** - Themes, PIN, notifications

### Hack Phone (Item: `hackphone`)
- 🎯 **GPS Tracking** - Track any phone number in real-time
- 🔓 **PIN Cracking** - Break into locked phones
- 💉 **Message Injection** - Send fake messages
- 🗄️ **Database Queries** - Access phone records (police/gov)
- 📹 **Camera Access** - RP-based surveillance
- 📊 **Full Logging** - Every action logged for admins

### Security & Anti-Exploit
- ✅ Duplicate phone detection
- ✅ Session hijacking prevention
- ✅ Rate limiting per action
- ✅ Banking velocity tracking
- ✅ Suspicious transaction flagging
- ✅ Evidence generation for police

---

## 📦 Installation

### 1. Database
```bash
# Import the schema
mysql -u root -p your_database < database.sql
```

### 2. Resource
```bash
# Place in resources folder
resources/[phone]/white-phone/

# Add to server.cfg
ensure white-phone
```

### 3. Configuration
Edit `shared/config.lua`:
```lua
Config.Framework = 'qb-core' -- or 'esx'
```

### 4. Items (QB-Core)
Add to `qb-core/shared/items.lua`:
```lua
['phone'] = {
    name = 'phone',
    label = 'Smartphone',
    weight = 200,
    type = 'item',
    image = 'phone.png',
    unique = true,
    useable = true,
    shouldClose = true,
    description = 'A modern smartphone'
},
['hackphone'] = {
    name = 'hackphone',
    label = 'Hack Phone',
    weight = 200,
    type = 'item',
    image = 'hackphone.png',
    unique = true,
    useable = true,
    shouldClose = true,
    description = 'Modified phone for hacking'
}
```

---

## 🎮 Usage

### For Players
```lua
-- Use phone item from inventory
-- OR
/openphone (debug command)
```

### For Admins
```lua
-- View hack logs (console)
phone:admin:hacklogs

-- Lookup phone info
phone:admin:lookup [phone_number]

-- Wipe device
phone:admin:wipe [device_id]
```

### For Police
```lua
-- View available evidence
/phone:police:evidence

-- Collect evidence
-- (Use in-game UI)
```

---

## ⚙️ Configuration

### Core Settings
```lua
Config.Framework = 'qb-core'
Config.DefaultPIN = nil
Config.MaxPINAttempts = 3
```

### Security
```lua
Config.Security = {
    SingleDeviceSession = true,
    EventThrottleMs = 100,
    LogSuspiciousActivity = true
}
```

### Economy Limits
```lua
Config.Economy = {
    TransferLimits = {
        single = 100000,
        hourly = 50000,
        daily = 200000,
        weekly = 500000
    }
}
```

### Hack Phone
```lua
Config.HackPhone = {
    Enabled = true,
    RequireJob = {'hacker'},
    TrackingCost = 1000,
    UnlockCost = 2500,
    PoliceAlert = {
        Enabled = true,
        AlertChance = 30
    }
}
```

---

## 📊 Database Schema

| Table | Records | Purpose |
|-------|---------|---------|
| `phone_devices` | Physical phones | Device hardware |
| `phone_accounts` | Digital accounts | User data |
| `phone_apps` | Installed apps | App management |
| `phone_contacts` | Contact lists | Address book |
| `phone_messages` | Messages | Chat history |
| `phone_calls` | Call logs | Call records |
| `phone_twitter_*` | Social media | Twitter/X data |
| `phone_gallery` | Media | Photos/videos |
| `phone_bank_transactions` | Banking | Transaction history |
| `phone_hack_logs` | Hack attempts | Security audit |
| `phone_hack_evidence` | Evidence | Police investigation |

**Total Tables**: 25+  
**Total Lines**: 557 (database.sql)

---

## 🎨 UI Design

### Design System
- **Style**: iOS/Android Hybrid
- **Theme**: Dark mode native (OLED black)
- **Typography**: Inter font family
- **Colors**: Premium blue (#007AFF) accent
- **Animations**: CSS-only, 60fps

### Components
- Lock Screen with Dynamic Island
- Home Screen with App Grid
- Dock with 4 primary apps
- Smooth app transitions
- Notification system
- Modal overlays

---

## 🔧 Development

### File Structure
```
white-phone/
├── client/         # Client-side Lua
├── server/         # Server-side Lua
│   ├── apps/       # App backends
│   └── hackphone/  # Hack module
├── shared/         # Shared config
└── html/           # NUI interface
    ├── css/        # Stylesheets
    ├── js/         # JavaScript
    └── assets/     # Images, sounds
```

### Adding New Apps
1. Create server handler in `server/apps/yourapp.lua`
2. Add NUI callbacks in `client/phone.lua`
3. Create UI in `html/js/apps/yourapp.js`
4. Add to `Config.DefaultApps` or `Config.AppStoreApps`

---

## 🐛 Troubleshooting

### Phone won't open
- Check oxmysql is running
- Verify database connection
- Check console for Lua errors

### No apps showing
- Check `phone_apps` table
- Verify `Config.DefaultApps`
- Restart resource

### Calls not working
- Both players must be online
- Check `PhoneSystem.ActiveCalls`
- Verify phone numbers exist

---

## 📝 License

Custom License - See LICENSE file for details.

---

## 🙏 Credits

- **Design**: Inspired by iOS 18 and Android 14
- **Framework**: QB-Core / ESX compatible
- **Database**: MySQL via oxmysql

---

## 📞 Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Join our Discord server
- Check the documentation

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2025-12-29

Made with ❤️ for the FiveM community
