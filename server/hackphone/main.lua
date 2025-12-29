-- ==========================================
-- HACK PHONE - ADVANCED FEATURES
-- ==========================================

local TrackedTargets = {}

-- Track a phone number
RegisterNetEvent('white-phone:server:hackphone:track', function(targetNumber)
    local src = source
    local hackerNumber = exports['white-phone']:GetPhoneNumber(src)
    if not hackerNumber then return end
    
    -- Verify hacker has hack phone
    local hackerDevice = MySQL.query.await([[
        SELECT device_type FROM phone_devices WHERE phone_number = ?
    ]], {hackerNumber})
    
    if not hackerDevice or #hackerDevice == 0 or hackerDevice[1].device_type ~= 'hackphone' then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Hack Phone',
            message = 'Requires hack phone'
        })
        return
    end
    
    -- Check if target exists
    local target = MySQL.query.await([[
        SELECT device_id FROM phone_devices WHERE phone_number = ?
    ]], {targetNumber})
    
    if not target or #target == 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Hack Phone',
            message = 'Target not found'
        })
        return
    end
    
    -- Start tracking
    local trackId = 'TRACK-' .. os.time()
    TrackedTargets[trackId] = {
        hacker = src,
        hackerNumber = hackerNumber,
        targetNumber = targetNumber,
        deviceId = target[1].device_id
    }
    
    -- Log action
    MySQL.insert([[
        INSERT INTO phone_hack_logs (hacker_device_id, target_number, action_type, action_data)
        VALUES (?, ?, 'track', ?)
    ]], {hackerDevice[1].device_id, targetNumber, trackId})
    
    TriggerClientEvent('white-phone:client:hackphone:trackingStarted', src, {
        trackId = trackId,
        targetNumber = targetNumber
    })
    
    -- Start tracking thread
    CreateThread(function()
        while TrackedTargets[trackId] do
            -- Find target player
            for _, playerId in ipairs(GetPlayers()) do
                local playerNumber = exports['white-phone']:GetPhoneNumber(playerId)
                if playerNumber == targetNumber then
                    local ped = GetPlayerPed(playerId)
                    local coords = GetEntityCoords(ped)
                    
                    -- Save tracking data
                    MySQL.insert([[
                        INSERT INTO phone_tracking_data (target_number, tracker_device_id, coords)
                        VALUES (?, ?, ?)
                    ]], {targetNumber, hackerDevice[1].device_id, ('%s,%s,%s'):format(coords.x, coords.y, coords.z)})
                    
                    -- Send to hacker
                    TriggerClientEvent('white-phone:client:hackphone:trackingUpdate', src, {
                        trackId = trackId,
                        coords = coords
                    })
                    
                    break
                end
            end
            
            Wait(Config.HackPhone.TrackingUpdateInterval * 1000)
        end
    end)
end)

-- Stop tracking
RegisterNetEvent('white-phone:server:hackphone:stopTracking', function(trackId)
    if TrackedTargets[trackId] then
        TrackedTargets[trackId] = nil
        TriggerClientEvent('white-phone:client:hackphone:trackingStopped', source, trackId)
    end
end)

-- Crack PIN
RegisterNetEvent('white-phone:server:hackphone:crackPin', function(targetNumber)
    local src = source
    local hackerNumber = exports['white-phone']:GetPhoneNumber(src)
    if not hackerNumber then return end
    
    -- Verify hack phone
    local hackerDevice = MySQL.query.await([[
        SELECT device_id, device_type FROM phone_devices WHERE phone_number = ?
    ]], {hackerNumber})
    
    if not hackerDevice or #hackerDevice == 0 or hackerDevice[1].device_type ~= 'hackphone' then return end
    
    -- Get target PIN
    local targetAccount = MySQL.query.await([[
        SELECT pa.pin FROM phone_accounts pa
        JOIN phone_devices pd ON pa.id = pd.phone_account_id
        WHERE pd.phone_number = ?
    ]], {targetNumber})
    
    if not targetAccount or #targetAccount == 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Hack Phone',
            message = 'Target not found'
        })
        return
    end
    
    -- Simulate cracking (takes time based on config)
    local crackTime = Config.HackPhone.PinCrackTime
    
    TriggerClientEvent('white-phone:client:hackphone:crackingStarted', src, {
        targetNumber = targetNumber,
        duration = crackTime
    })
    
    SetTimeout(crackTime * 1000, function()
        local pin = targetAccount[1].pin or 'No PIN set'
        
        -- Log action
        MySQL.insert([[
            INSERT INTO phone_hack_logs (hacker_device_id, target_number, action_type, action_data)
            VALUES (?, ?, 'crack_pin', ?)
        ]], {hackerDevice[1].device_id, targetNumber, pin})
        
        TriggerClientEvent('white-phone:client:hackphone:pinCracked', src, {
            targetNumber = targetNumber,
            pin = pin
        })
    end)
end)

-- Inject message
RegisterNetEvent('white-phone:server:hackphone:injectMessage', function(targetNumber, fakeNumber, message)
    local src = source
    local hackerNumber = exports['white-phone']:GetPhoneNumber(src)
    if not hackerNumber then return end
    
    -- Verify hack phone
    local hackerDevice = MySQL.query.await([[
        SELECT device_id, device_type FROM phone_devices WHERE phone_number = ?
    ]], {hackerNumber})
    
    if not hackerDevice or #hackerDevice == 0 or hackerDevice[1].device_type ~= 'hackphone' then return end
    
    -- Generate conversation ID
    local numbers = {fakeNumber, targetNumber}
    table.sort(numbers)
    local conversationId = numbers[1] .. '-' .. numbers[2]
    
    -- Insert fake message
    MySQL.insert([[
        INSERT INTO phone_messages (conversation_id, sender_number, receiver_number, content, `read`, delivered)
        VALUES (?, ?, ?, ?, FALSE, TRUE)
    ]], {conversationId, fakeNumber, targetNumber, message})
    
    -- Log action
    MySQL.insert([[
        INSERT INTO phone_hack_logs (hacker_device_id, target_number, action_type, action_data)
        VALUES (?, ?, 'inject_message', ?)
    ]], {hackerDevice[1].device_id, targetNumber, json.encode({from = fakeNumber, message = message})})
    
    -- Notify target if online
    for _, playerId in ipairs(GetPlayers()) do
        local playerNumber = exports['white-phone']:GetPhoneNumber(playerId)
        if playerNumber == targetNumber then
            TriggerClientEvent('white-phone:client:messages:newMessage', tonumber(playerId), {
                sender_number = fakeNumber,
                receiver_number = targetNumber,
                content = message,
                created_at = os.date('%Y-%m-%d %H:%M:%S')
            })
            break
        end
    end
    
    TriggerClientEvent('white-phone:client:notify', src, {
        type = 'success',
        title = 'Hack Phone',
        message = 'Message injected'
    })
end)

-- Query database (admin only)
RegisterNetEvent('white-phone:server:hackphone:queryDb', function(query)
    local src = source
    
    -- Check admin permission
    if not IsPlayerAceAllowed(src, 'white-phone.admin') then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Hack Phone',
            message = 'Insufficient permissions'
        })
        return
    end
    
    -- Execute query (be careful!)
    local result = MySQL.query.await(query)
    TriggerClientEvent('white-phone:client:hackphone:queryResult', src, result)
end)

-- Get hack logs (admin only)
RegisterNetEvent('white-phone:server:hackphone:getLogs', function(limit)
    local src = source
    
    if not IsPlayerAceAllowed(src, 'white-phone.admin') then return end
    
    local logs = MySQL.query.await([[
        SELECT * FROM phone_hack_logs ORDER BY created_at DESC LIMIT ?
    ]], {limit or 100})
    
    TriggerClientEvent('white-phone:client:hackphone:logs', src, logs)
end)

print('^2[White Phone] Hack Phone module loaded^0')
