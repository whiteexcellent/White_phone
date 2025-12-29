-- ================================================
-- CLIENT - PHONE HANDLER
-- ================================================

-- NUI Callbacks for phone actions
RegisterNUICallback('getContacts', function(data, cb)
    TriggerServerEvent('phone:server:getContacts', currentDeviceId)
    cb('ok')
end)

RegisterNUICallback('addContact', function(data, cb)
    TriggerServerEvent('phone:server:addContact', currentDeviceId, data.name, data.number, data.photo)
    cb('ok')
end)

RegisterNUICallback('deleteContact', function(data, cb)
    TriggerServerEvent('phone:server:deleteContact', data.contactId)
    cb('ok')
end)

RegisterNUICallback('sendMessage', function(data, cb)
    TriggerServerEvent('phone:server:sendMessage', currentDeviceId, data.targetNumber, data.content, data.mediaUrl)
    cb('ok')
end)

RegisterNUICallback('makeCall', function(data, cb)
    TriggerServerEvent('phone:server:makeCall', currentDeviceId, data.targetNumber)
    cb('ok')
end)

RegisterNUICallback('answerCall', function(data, cb)
    TriggerServerEvent('phone:server:answerCall')
    cb('ok')
end)

RegisterNUICallback('endCall', function(data, cb)
    TriggerServerEvent('phone:server:endCall')
    cb('ok')
end)

RegisterNUICallback('uploadPhoto', function(data, cb)
    TriggerServerEvent('phone:server:uploadPhoto', currentDeviceId, data.photoData)
    cb('ok')
end)

RegisterNUICallback('emergencyCall', function(data, cb)
    local coords = GetEntityCoords(PlayerPedId())
    TriggerServerEvent('phone:server:emergencyCall', currentDeviceId, data.service, data.location, {x = coords.x, y = coords.y, z = coords.z})
    cb('ok')
end)

-- Receive events from server
RegisterNetEvent('phone:client:contactsLoaded', function(contacts)
    SendNUIMessage({
        action = 'contactsLoaded',
        data = contacts
    })
end)

RegisterNetEvent('phone:client:messagesLoaded', function(messages)
    SendNUIMessage({
        action = 'messagesLoaded',
        data = messages
    })
end)

RegisterNetEvent('phone:client:newMessage', function(message)
    SendNUIMessage({
        action = 'newMessage',
        data = message
    })
    
    -- Play notification sound
    PlaySound(-1, "Menu_Accept", "Phone_SoundSet_Default", 0, 0, 1)
end)

RegisterNetEvent('phone:client:incomingCall', function(callData)
    SendNUIMessage({
        action = 'incomingCall',
        data = callData
    })
    
    -- Play ringtone
    PlaySound(-1, "Remote_Ring", "Phone_SoundSet_Michael", 0, 0, 1)
end)

RegisterNetEvent('phone:client:callAnswered', function()
    SendNUIMessage({
        action = 'callAnswered'
    })
end)

RegisterNetEvent('phone:client:callEnded', function()
    SendNUIMessage({
        action = 'callEnded'
    })
    
    StopSound(-1)
end)
