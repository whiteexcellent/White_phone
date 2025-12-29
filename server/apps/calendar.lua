-- ================================================
-- CALENDAR APP - SERVER
-- ================================================

RegisterNetEvent('phone:server:getCalendarEvents', function(deviceId)
    local src = source
    local accountId = GetPhoneAccountByDevice(deviceId)
    if not accountId then return end
    
    local events = MySQL.query.await([[
        SELECT * FROM phone_calendar
        WHERE phone_account_id = ?
        ORDER BY event_date ASC
    ]], {accountId})
    
    TriggerClientEvent('phone:client:calendarEventsLoaded', src, events or {})
end)

RegisterNetEvent('phone:server:createCalendarEvent', function(deviceId, title, description, eventDate, reminderTime, location)
    local src = source
    local accountId = GetPhoneAccountByDevice(deviceId)
    if not accountId then return end
    
    MySQL.insert([[
        INSERT INTO phone_calendar (phone_account_id, title, description, event_date, reminder_time, location)
        VALUES (?, ?, ?, ?, ?, ?)
    ]], {accountId, title, description, eventDate, reminderTime, location})
    
    SendNotify(src, 'Event created', 'success')
end)

RegisterNetEvent('phone:server:deleteCalendarEvent', function(eventId)
    local src = source
    MySQL.query('DELETE FROM phone_calendar WHERE id = ?', {eventId})
    SendNotify(src, 'Event deleted', 'success')
end)
