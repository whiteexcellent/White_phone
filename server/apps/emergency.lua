-- ==========================================
-- EMERGENCY APP - SERVER SIDE
-- ==========================================

-- Create emergency call
RegisterNetEvent('white-phone:server:emergency:call', function(serviceType)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    -- Get player location
    local ped = GetPlayerPed(src)
    local coords = GetEntityCoords(ped)
    local location = GetStreetNameFromHashKey(GetStreetNameAtCoord(coords.x, coords.y, coords.z))
    local coordsStr = ('%.2f, %.2f, %.2f'):format(coords.x, coords.y, coords.z)
    
    -- Create emergency call
    local callId = MySQL.insert.await([[
        INSERT INTO phone_emergency_calls (caller_number, service_type, location, coords, status)
        VALUES (?, ?, ?, ?, 'pending')
    ]], {phoneNumber, serviceType, location, coordsStr})
    
    -- Notify emergency services
    local serviceName = serviceType == 'police' and 'LSPD' or serviceType == 'ems' and 'EMS' or 'Fire Department'
    local jobName = serviceType == 'police' and 'police' or serviceType == 'ems' and 'ambulance' or 'fire'
    
    -- Send to all players with the job
    for _, playerId in ipairs(GetPlayers()) do
        local playerJob = GetPlayerJob(playerId)
        if playerJob == jobName then
            TriggerClientEvent('white-phone:client:emergency:alert', tonumber(playerId), {
                callId = callId,
                callerNumber = phoneNumber,
                serviceType = serviceType,
                location = location,
                coords = coords
            })
        end
    end
    
    -- Log for admin
    print(('[Emergency] %s call from %s at %s'):format(serviceType:upper(), phoneNumber, location))
    
    -- Notify caller
    TriggerClientEvent('white-phone:client:notify', src, {
        type = 'success',
        title = 'Emergency',
        message = ('%s has been notified'):format(serviceName)
    })
end)

-- Accept emergency call
RegisterNetEvent('white-phone:server:emergency:accept', function(callId)
    local src = source
    
    MySQL.query([[
        UPDATE phone_emergency_calls SET status = 'active' WHERE id = ?
    ]], {callId})
    
    -- Get call details
    local call = MySQL.query.await([[
        SELECT * FROM phone_emergency_calls WHERE id = ?
    ]], {callId})
    
    if call and call[1] then
        -- Notify caller
        for _, playerId in ipairs(GetPlayers()) do
            local playerNumber = exports['white-phone']:GetPhoneNumber(playerId)
            if playerNumber == call[1].caller_number then
                TriggerClientEvent('white-phone:client:notify', tonumber(playerId), {
                    type = 'info',
                    title = 'Emergency',
                    message = 'Help is on the way!'
                })
                break
            end
        end
    end
end)

-- Complete emergency call
RegisterNetEvent('white-phone:server:emergency:complete', function(callId)
    MySQL.query([[
        UPDATE phone_emergency_calls SET status = 'completed' WHERE id = ?
    ]], {callId})
end)

-- Get player job (framework-specific)
function GetPlayerJob(source)
    if Config.Framework == 'qb-core' then
        local Player = QBCore.Functions.GetPlayer(source)
        return Player and Player.PlayerData.job.name or nil
    elseif Config.Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        return xPlayer and xPlayer.job.name or nil
    end
    return nil
end

print('^2[White Phone] Emergency app loaded^0')
