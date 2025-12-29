local QBCore = exports['qb-core']:GetCoreObject()
local isPhoneOpen = false
local currentDeviceId = nil

-- ================================================
-- PHONE TOGGLE
-- ================================================

RegisterNetEvent('phone:client:openUI', function(deviceId, phoneData)
    if isPhoneOpen then return end
    
    currentDeviceId = deviceId
    isPhoneOpen = true
    
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open',
        data = phoneData
    })
    
    -- Play animation
    Utils.PlayPhoneAnimation(true)
end)

RegisterNUICallback('closePhone', function(data, cb)
    isPhoneOpen = false
    SetNuiFocus(false, false)
    
    -- Stop animation
    Utils.PlayPhoneAnimation(false)
    
    TriggerServerEvent('phone:server:close')
    cb('ok')
end)

-- Debug Command
RegisterCommand('openphone', function()
    TriggerServerEvent('phone:server:openPhone', 'DEBUG-DEVICE')
end)

-- ================================================
-- ANIMATIONS
-- ================================================

function Utils.PlayPhoneAnimation(open)
    local ped = PlayerPedId()
    local dict = "cellphone@"
    
    if open then
        RequestAnimDict(dict)
        while not HasAnimDictLoaded(dict) do Wait(10) end
        TaskPlayAnim(ped, dict, "cellphone_text_in", 8.0, -8.0, -1, 50, 0, false, false, false)
        
        local phoneProp = CreateObject(GetHashKey("prop_npc_phone_02"), 0, 0, 0, true, true, true)
        AttachEntityToEntity(phoneProp, ped, GetPedBoneIndex(ped, 28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, true, true, false, true, 1, true)
        
        -- Store prop to delete later
        LocalPlayer.state.phoneProp = phoneProp
    else
        StopAnimTask(ped, dict, "cellphone_text_in", 1.0)
        local prop = LocalPlayer.state.phoneProp
        if prop then DeleteEntity(prop) end
    end
end
