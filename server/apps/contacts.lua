-- ==========================================
-- CONTACTS APP - SERVER SIDE
-- ==========================================

-- Get all contacts
RegisterNetEvent('white-phone:server:contacts:get', function()
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local contacts = MySQL.query.await([[
        SELECT * FROM phone_contacts WHERE phone_account_id = ? ORDER BY name ASC
    ]], {accountId})
    
    TriggerClientEvent('white-phone:client:contacts:list', src, contacts)
end)

-- Add contact
RegisterNetEvent('white-phone:server:contacts:add', function(name, phoneNumber, avatar)
    local src = source
    local myPhoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not myPhoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(myPhoneNumber)
    if not accountId then return end
    
    -- Validate phone number exists
    local exists = MySQL.query.await([[
        SELECT phone_number FROM phone_devices WHERE phone_number = ?
    ]], {phoneNumber})
    
    if not exists or #exists == 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Contacts',
            message = 'Phone number does not exist'
        })
        return
    end
    
    -- Check for duplicates
    local duplicate = MySQL.query.await([[
        SELECT id FROM phone_contacts WHERE phone_account_id = ? AND phone_number = ?
    ]], {accountId, phoneNumber})
    
    if duplicate and #duplicate > 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Contacts',
            message = 'Contact already exists'
        })
        return
    end
    
    -- Add contact
    MySQL.insert([[
        INSERT INTO phone_contacts (phone_account_id, name, phone_number, avatar)
        VALUES (?, ?, ?, ?)
    ]], {accountId, name, phoneNumber, avatar})
    
    TriggerEvent('white-phone:server:contacts:get', src)
    
    TriggerClientEvent('white-phone:client:notify', src, {
        type = 'success',
        title = 'Contacts',
        message = 'Contact added'
    })
end)

-- Update contact
RegisterNetEvent('white-phone:server:contacts:update', function(contactId, name, phoneNumber, avatar)
    local src = source
    local myPhoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not myPhoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(myPhoneNumber)
    if not accountId then return end
    
    MySQL.query([[
        UPDATE phone_contacts SET name = ?, phone_number = ?, avatar = ?
        WHERE id = ? AND phone_account_id = ?
    ]], {name, phoneNumber, avatar, contactId, accountId})
    
    TriggerEvent('white-phone:server:contacts:get', src)
end)

-- Delete contact
RegisterNetEvent('white-phone:server:contacts:delete', function(contactId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    MySQL.query('DELETE FROM phone_contacts WHERE id = ? AND phone_account_id = ?', {contactId, accountId})
    TriggerEvent('white-phone:server:contacts:get', src)
end)

-- Toggle favorite
RegisterNetEvent('white-phone:server:contacts:toggleFavorite', function(contactId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    MySQL.query([[
        UPDATE phone_contacts SET favorite = NOT favorite WHERE id = ? AND phone_account_id = ?
    ]], {contactId, accountId})
    
    TriggerEvent('white-phone:server:contacts:get', src)
end)

-- Block contact
RegisterNetEvent('white-phone:server:contacts:toggleBlock', function(contactId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    MySQL.query([[
        UPDATE phone_contacts SET blocked = NOT blocked WHERE id = ? AND phone_account_id = ?
    ]], {contactId, accountId})
    
    TriggerEvent('white-phone:server:contacts:get', src)
end)

print('^2[White Phone] Contacts app loaded^0')
