-- ==========================================
-- NOTES, MAIL, CALENDAR - SERVER SIDE
-- ==========================================

-- ==================== NOTES ====================

-- Get notes
RegisterNetEvent('white-phone:server:notes:get', function()
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local notes = MySQL.query.await([[
        SELECT * FROM phone_notes WHERE phone_account_id = ? ORDER BY updated_at DESC
    ]], {accountId})
    
    TriggerClientEvent('white-phone:client:notes:list', src, notes)
end)

-- Save note
RegisterNetEvent('white-phone:server:notes:save', function(noteId, title, content, color)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    if noteId then
        -- Update existing
        MySQL.query([[
            UPDATE phone_notes SET title = ?, content = ?, color = ? WHERE id = ? AND phone_account_id = ?
        ]], {title, content, color, noteId, accountId})
    else
        -- Create new
        noteId = MySQL.insert.await([[
            INSERT INTO phone_notes (phone_account_id, title, content, color) VALUES (?, ?, ?, ?)
        ]], {accountId, title, content, color})
    end
    
    TriggerEvent('white-phone:server:notes:get', src)
end)

-- Delete note
RegisterNetEvent('white-phone:server:notes:delete', function(noteId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    MySQL.query('DELETE FROM phone_notes WHERE id = ? AND phone_account_id = ?', {noteId, accountId})
    TriggerEvent('white-phone:server:notes:get', src)
end)

-- ==================== MAIL ====================

-- Get emails
RegisterNetEvent('white-phone:server:mail:get', function()
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local emails = MySQL.query.await([[
        SELECT * FROM phone_emails WHERE phone_account_id = ? ORDER BY created_at DESC LIMIT 50
    ]], {accountId})
    
    TriggerClientEvent('white-phone:client:mail:list', src, emails)
end)

-- Send email (admin/system only)
RegisterNetEvent('white-phone:server:mail:send', function(targetNumber, sender, subject, body)
    local accountId = exports['white-phone']:GetPhoneAccountId(targetNumber)
    if not accountId then return end
    
    MySQL.insert([[
        INSERT INTO phone_emails (phone_account_id, sender, subject, body) VALUES (?, ?, ?, ?)
    ]], {accountId, sender, subject, body})
    
    -- Notify if online
    for _, playerId in ipairs(GetPlayers()) do
        local playerNumber = exports['white-phone']:GetPhoneNumber(playerId)
        if playerNumber == targetNumber then
            TriggerClientEvent('white-phone:client:notification', tonumber(playerId), {
                appId = 'mail',
                appName = 'Mail',
                appIcon = '📧',
                appColor = '#007AFF',
                title = sender,
                body = subject,
                time = 'now'
            })
            break
        end
    end
end)

-- Mark email as read
RegisterNetEvent('white-phone:server:mail:markRead', function(emailId)
    MySQL.query('UPDATE phone_emails SET `read` = TRUE WHERE id = ?', {emailId})
end)

-- Delete email
RegisterNetEvent('white-phone:server:mail:delete', function(emailId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    MySQL.query('DELETE FROM phone_emails WHERE id = ? AND phone_account_id = ?', {emailId, accountId})
end)

-- ==================== CALENDAR ====================

-- Get events
RegisterNetEvent('white-phone:server:calendar:get', function()
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local events = MySQL.query.await([[
        SELECT * FROM phone_calendar_events WHERE phone_account_id = ? ORDER BY start_time ASC
    ]], {accountId})
    
    TriggerClientEvent('white-phone:client:calendar:events', src, events)
end)

-- Create event
RegisterNetEvent('white-phone:server:calendar:create', function(title, description, startTime, endTime, location, color)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    MySQL.insert([[
        INSERT INTO phone_calendar_events (phone_account_id, title, description, start_time, end_time, location, color)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ]], {accountId, title, description, startTime, endTime, location, color})
    
    TriggerEvent('white-phone:server:calendar:get', src)
end)

-- Delete event
RegisterNetEvent('white-phone:server:calendar:delete', function(eventId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    MySQL.query('DELETE FROM phone_calendar_events WHERE id = ? AND phone_account_id = ?', {eventId, accountId})
    TriggerEvent('white-phone:server:calendar:get', src)
end)

print('^2[White Phone] Notes, Mail, Calendar apps loaded^0')
