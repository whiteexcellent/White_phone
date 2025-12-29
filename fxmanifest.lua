fx_version 'cerulean'
game 'gta5'

author 'White Phone OS Team'
description 'Advanced Phone System for FiveM'
version '2.0.0'

-- Shared
shared_scripts {
    'shared/config.lua',
    'shared/utils.lua'
}

-- Server
server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua',
    'server/apps/contacts.lua',
    'server/apps/messages.lua',
    'server/apps/calls.lua',
    'server/apps/twitter.lua',
    'server/apps/banking.lua',
    'server/apps/camera.lua',
    'server/apps/emergency.lua',
    'server/apps/utility.lua',
    'server/hackphone/main.lua'
}

-- Client
client_scripts {
    'client/main.lua',
    'client/phone.lua',
    'client/camera.lua',
    'client/notifications.lua',
    'client/hackphone/main.lua'
}

-- UI
ui_page 'html-react/index.html'

files {
    'html-react/index.html',
    'html-react/assets/*.js',
    'html-react/assets/*.css',
    'html-react/assets/*.png',
    'html-react/assets/*.jpg',
    'html-react/assets/*.svg'
}

-- Dependencies
dependencies {
    'oxmysql',
    '/server:5848',
    '/onesync'
}

-- Exports
exports {
    'GetPhoneNumber',
    'GetPhoneAccountId',
    'SendNotification'
}

lua54 'yes'
