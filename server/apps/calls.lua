-- ==========================================
-- CALLS APP - SERVER SIDE
-- ==========================================

local ActiveCalls = {}

-- Start a call
RegisterNetEvent('white-phone:server:calls:start', function(receiverNumber)
    local src = source
    local callerNumber = exports['white-phone']:GetPhoneNumber(src)
    if not callerNumber then return end
    
    -- Check if receiver exists
    local receiver = MySQL.query.await([[
        SELECT phone_number FROM phone_devices WHERE phone_number = ?
    ]], {receiverNumber})
    
    if not receiver or #receiver == 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Phone',
            message = 'Invalid phone number'
        })
        return
    end
    
    -- Find receiver player
    local receiverSrc = nil
    for _, playerId in ipairs(GetPlayers()) do
        local playerNumber = exports['white-phone']:GetPhoneNumber(playerId)
        if playerNumber == receiverNumber then
            receiverSrc = tonumber(playerId)
            break
        end
    end
    
    if not receiverSrc then
        -- Receiver offline - log as missed call
        MySQL.insert([[
            INSERT INTO phone_calls (caller_number, receiver_number, type, duration)
            VALUES (?, ?, 'missed', 0)
        ]], {callerNumber, receiverNumber})
        
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Phone',
            message = 'User is unavailable'
        })
        return
    end
    
    -- Create call session
    local callId = 'CALL-' .. os.time() .. '-' .. math.random(1000, 9999)
    ActiveCalls[callId] = {
        caller = src,
        callerNumber = callerNumber,
        receiver = receiverSrc,
        receiverNumber = receiverNumber,
        startTime = os.time(),
        status = 'ringing'
    }
    
    -- Notify caller
    TriggerClientEvent('white-phone:client:calls:outgoing', src, {
        callId = callId,
        receiverNumber = receiverNumber
    })
    
    -- Notify receiver
    local callerContact = MySQL.query.await([[
        SELECT name FROM phone_contacts
        WHERE phone_account_id = (
            SELECT phone_account_id FROM phone_devices WHERE phone_number = ?
        ) AND phone_number = ?
    ]], {receiverNumber, callerNumber})
    
    TriggerClientEvent('white-phone:client:calls:incoming', receiverSrc, {
        callId = callId,
        callerNumber = callerNumber,
        callerName = callerContact[1] and callerContact[1].name or callerNumber
    })
    
    -- Auto-cancel after 30 seconds if not answered
    SetTimeout(30000, function()
        if ActiveCalls[callId] and ActiveCalls[callId].status == 'ringing' then
            TriggerEvent('white-phone:server:calls:end', callId, 'timeout')
        end
    end)
end)

-- Answer a call
RegisterNetEvent('white-phone:server:calls:answer', function(callId)
    local src = source
    
    if not ActiveCalls[callId] then return end
    local call = ActiveCalls[callId]
    
    if call.receiver ~= src then return end
    
    call.status = 'active'
    call.answerTime = os.time()
    
    -- Notify both parties
    TriggerClientEvent('white-phone:client:calls:answered', call.caller, callId)
    TriggerClientEvent('white-phone:client:calls:answered', call.receiver, callId)
    
    -- Enable voice chat (pma-voice integration)
    if Config.VoiceSystem == 'pma-voice' then
        exports['pma-voice']:addPlayerToCall(call.callId, call.caller)
        exports['pma-voice']:addPlayerToCall(call.callId, call.receiver)
    end
end)

-- End a call
RegisterNetEvent('white-phone:server:calls:end', function(callId, reason)
    if not ActiveCalls[callId] then return end
    local call = ActiveCalls[callId]
    
    local duration = 0
    local callType = 'missed'
    
    if call.status == 'active' and call.answerTime then
        duration = os.time() - call.answerTime
        callType = 'outgoing'
    end
    
    -- Log call for caller
    MySQL.insert([[
        INSERT INTO phone_calls (caller_number, receiver_number, type, duration)
        VALUES (?, ?, ?, ?)
    ]], {call.callerNumber, call.receiverNumber, callType, duration})
    
    -- Log call for receiver
    local receiverType = callType == 'outgoing' and 'incoming' or 'missed'
    MySQL.insert([[
        INSERT INTO phone_calls (caller_number, receiver_number, type, duration)
        VALUES (?, ?, ?, ?)
    ]], {call.callerNumber, call.receiverNumber, receiverType, duration})
    
    -- Notify both parties
    TriggerClientEvent('white-phone:client:calls:ended', call.caller, {
        callId = callId,
        duration = duration,
        reason = reason
    })
    TriggerClientEvent('white-phone:client:calls:ended', call.receiver, {
        callId = callId,
        duration = duration,
        reason = reason
    })
    
    -- Disable voice chat
    if Config.VoiceSystem == 'pma-voice' then
        exports['pma-voice']:removePlayerFromCall(call.callId, call.caller)
        exports['pma-voice']:removePlayerFromCall(call.callId, call.receiver)
    end
    
    ActiveCalls[callId] = nil
end)

-- Get call history
RegisterNetEvent('white-phone:server:calls:getHistory', function(limit)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local calls = MySQL.query.await([[
        SELECT * FROM phone_calls
        WHERE caller_number = ? OR receiver_number = ?
        ORDER BY created_at DESC
        LIMIT ?
    ]], {phoneNumber, phoneNumber, limit or 50})
    
    -- Enrich with contact names
    for _, call in ipairs(calls) do
        local otherNumber = call.caller_number == phoneNumber and call.receiver_number or call.caller_number
        local contact = MySQL.query.await([[
            SELECT name FROM phone_contacts
            WHERE phone_account_id = (
                SELECT phone_account_id FROM phone_devices WHERE phone_number = ?
            ) AND phone_number = ?
        ]], {phoneNumber, otherNumber})
        
        call.contactName = contact[1] and contact[1].name or nil
    end
    
    TriggerClientEvent('white-phone:client:calls:history', src, calls)
end)

print('^2[White Phone] Calls app loaded^0')
