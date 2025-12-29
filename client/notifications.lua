-- ================================================
-- CLIENT - NOTIFICATIONS HANDLER
-- ================================================

local notifications = {}

RegisterNetEvent('phone:client:addNotification', function(notifData)
    table.insert(notifications, notifData)
    
    SendNUIMessage({
        action = 'addNotification',
        data = notifData
    })
    
    -- Play sound based on type
    if notifData.type == 'message' then
        PlaySound(-1, "Menu_Accept", "Phone_SoundSet_Default", 0, 0, 1)
    elseif notifData.type == 'call' then
        PlaySound(-1, "Remote_Ring", "Phone_SoundSet_Michael", 0, 0, 1)
    end
end)

RegisterNUICallback('clearNotification', function(data, cb)
    for i, notif in ipairs(notifications) do
        if notif.id == data.id then
            table.remove(notifications, i)
            break
        end
    end
    cb('ok')
end)

RegisterNUICallback('clearAllNotifications', function(data, cb)
    notifications = {}
    cb('ok')
end)
