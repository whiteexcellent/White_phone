-- ================================================
-- CLIENT - HACK PHONE HANDLER
-- ================================================

RegisterNUICallback('hackTrackNumber', function(data, cb)
    TriggerServerEvent('hackphone:server:trackNumber', currentDeviceId, data.targetNumber)
    cb('ok')
end)

RegisterNUICallback('hackCrackPIN', function(data, cb)
    TriggerServerEvent('hackphone:server:crackPIN', currentDeviceId, data.targetNumber)
    cb('ok')
end)

RegisterNUICallback('hackInjectMessage', function(data, cb)
    TriggerServerEvent('hackphone:server:injectMessage', currentDeviceId, data.targetNumber, data.content)
    cb('ok')
end)

RegisterNUICallback('hackDatabaseQuery', function(data, cb)
    TriggerServerEvent('hackphone:server:databaseQuery', currentDeviceId, data.queryType, data.searchTerm)
    cb('ok')
end)

RegisterNUICallback('hackAccessCamera', function(data, cb)
    TriggerServerEvent('hackphone:server:accessCamera', currentDeviceId, data.targetNumber)
    cb('ok')
end)

-- Receive hack results
RegisterNetEvent('hackphone:client:trackResult', function(success, coords, duration)
    SendNUIMessage({
        action = 'hackTrackResult',
        data = {success = success, coords = coords, duration = duration}
    })
    
    if success then
        -- Show blip on map
        local blip = AddBlipForCoord(coords.x, coords.y, coords.z)
        SetBlipSprite(blip, 458)
        SetBlipColour(blip, 1)
        SetBlipScale(blip, 0.8)
        BeginTextCommandSetBlipName("STRING")
        AddTextComponentString("Tracked Phone")
        EndTextCommandSetBlipName(blip)
        
        -- Remove blip after duration
        SetTimeout(duration * 1000, function()
            RemoveBlip(blip)
        end)
    end
end)

RegisterNetEvent('hackphone:client:crackResult', function(success, pin)
    SendNUIMessage({
        action = 'hackCrackResult',
        data = {success = success, pin = pin}
    })
end)

RegisterNetEvent('hackphone:client:queryResults', function(results)
    SendNUIMessage({
        action = 'hackQueryResults',
        data = results
    })
end)

RegisterNetEvent('hackphone:client:cameraAccess', function(duration)
    SendNUIMessage({
        action = 'hackCameraAccess',
        data = {duration = duration}
    })
end)
