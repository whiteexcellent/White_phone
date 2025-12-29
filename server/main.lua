-- ==========================================
-- WHITE PHONE OS - MAIN SERVER
-- ==========================================

local QBCore = nil
local ESX = nil

-- Framework Detection
if Config.Framework == 'qb-core' then
    QBCore = exports['qb-core']:GetCoreObject()
elseif Config.Framework == 'esx' then
    ESX = exports['es_extended']:getSharedObject()
end

-- ==========================================
-- UTILITY FUNCTIONS
-- ==========================================

function GetPlayerIdentifier(source)
    if Config.Framework == 'qb-core' then
        local Player = QBCore.Functions.GetPlayer(source)
        return Player and Player.PlayerData.citizenid or nil
    elseif Config.Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        return xPlayer and xPlayer.identifier or nil
    else
        return GetPlayerIdentifiers(source)[1]
    end
end

function GetPlayerMoney(source, account)
    if Config.Framework == 'qb-core' then
        local Player = QBCore.Functions.GetPlayer(source)
        if not Player then return 0 end
        if account == 'bank' then
            return Player.PlayerData.money.bank or 0
        else
            return Player.PlayerData.money.cash or 0
        end
    elseif Config.Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if not xPlayer then return 0 end
        return xPlayer.getAccount(account).money or 0
    end
    return 0
end

function AddPlayerMoney(source, account, amount)
    if Config.Framework == 'qb-core' then
        local Player = QBCore.Functions.GetPlayer(source)
        if not Player then return false end
        Player.Functions.AddMoney(account, amount)
        return true
    elseif Config.Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if not xPlayer then return false end
        xPlayer.addAccountMoney(account, amount)
        return true
    end
    return false
end

function RemovePlayerMoney(source, account, amount)
    if Config.Framework == 'qb-core' then
        local Player = QBCore.Functions.GetPlayer(source)
        if not Player then return false end
        return Player.Functions.RemoveMoney(account, amount)
    elseif Config.Framework == 'esx' then
        local xPlayer = ESX.GetPlayerFromId(source)
        if not xPlayer then return false end
        xPlayer.removeAccountMoney(account, amount)
        return true
    end
    return false
end

-- ==========================================
-- PHONE INITIALIZATION
-- ==========================================

function InitializePhone(source, itemData)
    local identifier = GetPlayerIdentifier(source)
    if not identifier then return end
    
    local deviceId = itemData.info and itemData.info.deviceId or GenerateDeviceId()
    local phoneNumber = itemData.info and itemData.info.phoneNumber or GeneratePhoneNumber()
    
    -- Check if device exists
    local result = MySQL.query.await('SELECT * FROM phone_devices WHERE device_id = ?', {deviceId})
    
    if not result or #result == 0 then
        -- Create new phone account
        local accountId = MySQL.insert.await([[
            INSERT INTO phone_accounts (owner_identifier, pin, face_id_enabled, cloud_backup_enabled)
            VALUES (?, NULL, FALSE, TRUE)
        ]], {identifier})
        
        -- Create device
        MySQL.insert.await([[
            INSERT INTO phone_devices (device_id, phone_number, phone_account_id, device_type, battery)
            VALUES (?, ?, ?, 'phone', 100)
        ]], {deviceId, phoneNumber, accountId})
        
        -- Create default settings
        MySQL.insert.await([[
            INSERT INTO phone_settings (phone_account_id, theme, brightness, volume)
            VALUES (?, 'dark', 80, 60)
        ]], {accountId})
        
        -- Update item metadata
        if Config.Framework == 'qb-core' then
            local Player = QBCore.Functions.GetPlayer(source)
            if Player then
                Player.Functions.SetInventory(Player.PlayerData.inventory)
            end
        end
        
        print(('[Phone] New phone initialized: %s - %s'):format(deviceId, phoneNumber))
    end
    
    return {deviceId = deviceId, phoneNumber = phoneNumber}
end

-- ==========================================
-- PHONE USAGE
-- ==========================================

if Config.Framework == 'qb-core' then
    QBCore.Functions.CreateUseableItem('phone', function(source, item)
        local phoneData = InitializePhone(source, item)
        if phoneData then
            TriggerClientEvent('white-phone:client:open', source, phoneData)
        end
    end)
    
    QBCore.Functions.CreateUseableItem('hackphone', function(source, item)
        local phoneData = InitializePhone(source, item)
        if phoneData then
            phoneData.isHackPhone = true
            TriggerClientEvent('white-phone:client:open', source, phoneData)
        end
    end)
elseif Config.Framework == 'esx' then
    ESX.RegisterUsableItem('phone', function(source)
        local xPlayer = ESX.GetPlayerFromId(source)
        if not xPlayer then return end
        
        local item = xPlayer.getInventoryItem('phone')
        if item and item.count > 0 then
            local phoneData = InitializePhone(source, {info = item.metadata or {}})
            if phoneData then
                TriggerClientEvent('white-phone:client:open', source, phoneData)
            end
        end
    end)
    
    ESX.RegisterUsableItem('hackphone', function(source)
        local xPlayer = ESX.GetPlayerFromId(source)
        if not xPlayer then return end
        
        local item = xPlayer.getInventoryItem('hackphone')
        if item and item.count > 0 then
            local phoneData = InitializePhone(source, {info = item.metadata or {}})
            if phoneData then
                phoneData.isHackPhone = true
                TriggerClientEvent('white-phone:client:open', source, phoneData)
            end
        end
    end)
end

-- ==========================================
-- BATTERY MANAGEMENT
-- ==========================================

CreateThread(function()
    while true do
        Wait(Config.BatteryDrainInterval * 1000)
        
        -- Drain battery for all active phones
        MySQL.query('UPDATE phone_devices SET battery = GREATEST(battery - 1, 0) WHERE battery > 0')
    end
end)

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

function GenerateDeviceId()
    return 'DEVICE-' .. math.random(100000, 999999) .. '-' .. os.time()
end

function GeneratePhoneNumber()
    local prefix = Config.PhoneNumberPrefix or '555'
    local number = math.random(1000, 9999)
    return prefix .. '-' .. number
end

function GetPhoneAccountId(phoneNumber)
    local result = MySQL.query.await([[
        SELECT phone_account_id FROM phone_devices WHERE phone_number = ?
    ]], {phoneNumber})
    
    return result and result[1] and result[1].phone_account_id or nil
end

function GetPhoneNumber(source)
    local identifier = GetPlayerIdentifier(source)
    if not identifier then return nil end
    
    local result = MySQL.query.await([[
        SELECT pd.phone_number 
        FROM phone_devices pd
        JOIN phone_accounts pa ON pd.phone_account_id = pa.id
        WHERE pa.owner_identifier = ?
        LIMIT 1
    ]], {identifier})
    
    return result and result[1] and result[1].phone_number or nil
end

-- ==========================================
-- EXPORTS
-- ==========================================

exports('GetPhoneNumber', GetPhoneNumber)
exports('GetPhoneAccountId', GetPhoneAccountId)
exports('SendNotification', function(phoneNumber, notification)
    local accountId = GetPhoneAccountId(phoneNumber)
    if not accountId then return false end
    
    -- Find player with this phone number
    for _, playerId in ipairs(GetPlayers()) do
        local playerNumber = GetPhoneNumber(playerId)
        if playerNumber == phoneNumber then
            TriggerClientEvent('white-phone:client:notification', playerId, notification)
            return true
        end
    end
    
    return false
end)

print('^2[White Phone OS] Server initialized successfully^0')
