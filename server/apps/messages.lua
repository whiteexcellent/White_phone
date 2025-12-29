-- ==========================================
-- MESSAGES APP - SERVER SIDE
-- ==========================================

-- Get conversations for a phone number
RegisterNetEvent('white-phone:server:messages:getConversations', function()
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local conversations = MySQL.query.await([[
        SELECT 
            CASE 
                WHEN sender_number = ? THEN receiver_number
                ELSE sender_number
            END as participant_number,
            MAX(id) as last_message_id,
            MAX(created_at) as last_message_time
        FROM phone_messages
        WHERE sender_number = ? OR receiver_number = ?
        GROUP BY participant_number
        ORDER BY last_message_time DESC
    ]], {phoneNumber, phoneNumber, phoneNumber})
    
    local result = {}
    for _, conv in ipairs(conversations) do
        -- Get last message
        local lastMsg = MySQL.query.await([[
            SELECT content, created_at, sender_number
            FROM phone_messages
            WHERE id = ?
        ]], {conv.last_message_id})
        
        -- Get unread count
        local unread = MySQL.query.await([[
            SELECT COUNT(*) as count
            FROM phone_messages
            WHERE receiver_number = ? AND sender_number = ? AND `read` = FALSE
        ]], {phoneNumber, conv.participant_number})
        
        -- Get contact name
        local contact = MySQL.query.await([[
            SELECT name FROM phone_contacts
            WHERE phone_account_id = (
                SELECT phone_account_id FROM phone_devices WHERE phone_number = ?
            ) AND phone_number = ?
        ]], {phoneNumber, conv.participant_number})
        
        table.insert(result, {
            participantNumber = conv.participant_number,
            participantName = contact[1] and contact[1].name or conv.participant_number,
            lastMessage = lastMsg[1].content,
            lastMessageTime = lastMsg[1].created_at,
            unreadCount = unread[1].count,
            isSent = lastMsg[1].sender_number == phoneNumber
        })
    end
    
    TriggerClientEvent('white-phone:client:messages:conversations', src, result)
end)

-- Get messages in a conversation
RegisterNetEvent('white-phone:server:messages:getMessages', function(participantNumber)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local messages = MySQL.query.await([[
        SELECT id, sender_number, receiver_number, content, media_url, `read`, created_at
        FROM phone_messages
        WHERE (sender_number = ? AND receiver_number = ?)
           OR (sender_number = ? AND receiver_number = ?)
        ORDER BY created_at ASC
    ]], {phoneNumber, participantNumber, participantNumber, phoneNumber})
    
    -- Mark messages as read
    MySQL.query([[
        UPDATE phone_messages
        SET `read` = TRUE
        WHERE receiver_number = ? AND sender_number = ? AND `read` = FALSE
    ]], {phoneNumber, participantNumber})
    
    TriggerClientEvent('white-phone:client:messages:messageList', src, messages)
end)

-- Send a message
RegisterNetEvent('white-phone:server:messages:send', function(receiverNumber, content, mediaUrl)
    local src = source
    local senderNumber = exports['white-phone']:GetPhoneNumber(src)
    if not senderNumber then return end
    
    -- Validate receiver exists
    local receiver = MySQL.query.await([[
        SELECT phone_number FROM phone_devices WHERE phone_number = ?
    ]], {receiverNumber})
    
    if not receiver or #receiver == 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Messages',
            message = 'Invalid phone number'
        })
        return
    end
    
    -- Generate conversation ID
    local numbers = {senderNumber, receiverNumber}
    table.sort(numbers)
    local conversationId = numbers[1] .. '-' .. numbers[2]
    
    -- Insert message
    local messageId = MySQL.insert.await([[
        INSERT INTO phone_messages (conversation_id, sender_number, receiver_number, content, media_url, `read`, delivered)
        VALUES (?, ?, ?, ?, ?, FALSE, TRUE)
    ]], {conversationId, senderNumber, receiverNumber, content, mediaUrl})
    
    -- Send to sender
    TriggerClientEvent('white-phone:client:messages:messageSent', src, {
        id = messageId,
        sender_number = senderNumber,
        receiver_number = receiverNumber,
        content = content,
        media_url = mediaUrl,
        read = false,
        created_at = os.date('%Y-%m-%d %H:%M:%S')
    })
    
    -- Find receiver and send notification
    for _, playerId in ipairs(GetPlayers()) do
        local playerNumber = exports['white-phone']:GetPhoneNumber(playerId)
        if playerNumber == receiverNumber then
            -- Send message to receiver
            TriggerClientEvent('white-phone:client:messages:newMessage', playerId, {
                id = messageId,
                sender_number = senderNumber,
                receiver_number = receiverNumber,
                content = content,
                media_url = mediaUrl,
                read = false,
                created_at = os.date('%Y-%m-%d %H:%M:%S')
            })
            
            -- Send notification
            local senderContact = MySQL.query.await([[
                SELECT name FROM phone_contacts
                WHERE phone_account_id = (
                    SELECT phone_account_id FROM phone_devices WHERE phone_number = ?
                ) AND phone_number = ?
            ]], {receiverNumber, senderNumber})
            
            TriggerClientEvent('white-phone:client:notification', playerId, {
                appId = 'messages',
                appName = 'Messages',
                appIcon = '💬',
                appColor = '#34C759',
                title = senderContact[1] and senderContact[1].name or senderNumber,
                body = content,
                time = 'now'
            })
            
            break
        end
    end
end)

-- Delete a message
RegisterNetEvent('white-phone:server:messages:delete', function(messageId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    -- Verify ownership
    local message = MySQL.query.await([[
        SELECT * FROM phone_messages
        WHERE id = ? AND (sender_number = ? OR receiver_number = ?)
    ]], {messageId, phoneNumber, phoneNumber})
    
    if message and #message > 0 then
        MySQL.query('DELETE FROM phone_messages WHERE id = ?', {messageId})
        TriggerClientEvent('white-phone:client:messages:messageDeleted', src, messageId)
    end
end)

-- Delete entire conversation
RegisterNetEvent('white-phone:server:messages:deleteConversation', function(participantNumber)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    MySQL.query([[
        DELETE FROM phone_messages
        WHERE (sender_number = ? AND receiver_number = ?)
           OR (sender_number = ? AND receiver_number = ?)
    ]], {phoneNumber, participantNumber, participantNumber, phoneNumber})
    
    TriggerClientEvent('white-phone:client:messages:conversationDeleted', src, participantNumber)
end)

print('^2[White Phone] Messages app loaded^0')
