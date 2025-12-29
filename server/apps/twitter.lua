-- ==========================================
-- TWITTER APP - SERVER SIDE
-- ==========================================

-- Get or create Twitter profile
RegisterNetEvent('white-phone:server:twitter:getProfile', function()
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local profile = MySQL.query.await([[
        SELECT * FROM phone_twitter_profiles WHERE phone_account_id = ?
    ]], {accountId})
    
    TriggerClientEvent('white-phone:client:twitter:profile', src, profile[1] or nil)
end)

-- Create Twitter profile
RegisterNetEvent('white-phone:server:twitter:createProfile', function(handle, displayName, bio)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    -- Check if handle is taken
    local existing = MySQL.query.await([[
        SELECT id FROM phone_twitter_profiles WHERE handle = ?
    ]], {handle})
    
    if existing and #existing > 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Twitter',
            message = 'Handle already taken'
        })
        return
    end
    
    -- Create profile
    MySQL.insert.await([[
        INSERT INTO phone_twitter_profiles (phone_account_id, handle, display_name, bio)
        VALUES (?, ?, ?, ?)
    ]], {accountId, handle, displayName, bio})
    
    TriggerEvent('white-phone:server:twitter:getProfile', src)
end)

-- Get tweet feed
RegisterNetEvent('white-phone:server:twitter:getFeed', function(limit)
    local src = source
    
    local tweets = MySQL.query.await([[
        SELECT t.*, p.handle, p.display_name, p.avatar, p.verified
        FROM phone_twitter_tweets t
        JOIN phone_twitter_profiles p ON t.profile_id = p.id
        ORDER BY t.created_at DESC
        LIMIT ?
    ]], {limit or 50})
    
    -- Check if user liked each tweet
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if phoneNumber then
        local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
        if accountId then
            local profile = MySQL.query.await([[
                SELECT id FROM phone_twitter_profiles WHERE phone_account_id = ?
            ]], {accountId})
            
            if profile and profile[1] then
                for _, tweet in ipairs(tweets) do
                    local liked = MySQL.query.await([[
                        SELECT id FROM phone_twitter_likes
                        WHERE tweet_id = ? AND profile_id = ?
                    ]], {tweet.id, profile[1].id})
                    
                    tweet.liked = liked and #liked > 0
                end
            end
        end
    end
    
    TriggerClientEvent('white-phone:client:twitter:feed', src, tweets)
end)

-- Post a tweet
RegisterNetEvent('white-phone:server:twitter:post', function(content, mediaUrl)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local profile = MySQL.query.await([[
        SELECT id FROM phone_twitter_profiles WHERE phone_account_id = ?
    ]], {accountId})
    
    if not profile or #profile == 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Twitter',
            message = 'Create a profile first'
        })
        return
    end
    
    -- Validate content length
    if #content > 280 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Twitter',
            message = 'Tweet too long (max 280 characters)'
        })
        return
    end
    
    -- Insert tweet
    MySQL.insert([[
        INSERT INTO phone_twitter_tweets (profile_id, content, media_url)
        VALUES (?, ?, ?)
    ]], {profile[1].id, content, mediaUrl})
    
    TriggerClientEvent('white-phone:client:notify', src, {
        type = 'success',
        title = 'Twitter',
        message = 'Tweet posted!'
    })
    
    -- Refresh feed for all players
    for _, playerId in ipairs(GetPlayers()) do
        TriggerEvent('white-phone:server:twitter:getFeed', tonumber(playerId))
    end
end)

-- Like a tweet
RegisterNetEvent('white-phone:server:twitter:like', function(tweetId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local profile = MySQL.query.await([[
        SELECT id FROM phone_twitter_profiles WHERE phone_account_id = ?
    ]], {accountId})
    
    if not profile or #profile == 0 then return end
    
    -- Check if already liked
    local existing = MySQL.query.await([[
        SELECT id FROM phone_twitter_likes WHERE tweet_id = ? AND profile_id = ?
    ]], {tweetId, profile[1].id})
    
    if existing and #existing > 0 then
        -- Unlike
        MySQL.query('DELETE FROM phone_twitter_likes WHERE id = ?', {existing[1].id})
        MySQL.query('UPDATE phone_twitter_tweets SET likes_count = likes_count - 1 WHERE id = ?', {tweetId})
    else
        -- Like
        MySQL.insert('INSERT INTO phone_twitter_likes (tweet_id, profile_id) VALUES (?, ?)', {tweetId, profile[1].id})
        MySQL.query('UPDATE phone_twitter_tweets SET likes_count = likes_count + 1 WHERE id = ?', {tweetId})
    end
    
    TriggerEvent('white-phone:server:twitter:getFeed', src)
end)

-- Delete tweet
RegisterNetEvent('white-phone:server:twitter:delete', function(tweetId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local profile = MySQL.query.await([[
        SELECT id FROM phone_twitter_profiles WHERE phone_account_id = ?
    ]], {accountId})
    
    if not profile or #profile == 0 then return end
    
    -- Verify ownership
    local tweet = MySQL.query.await([[
        SELECT * FROM phone_twitter_tweets WHERE id = ? AND profile_id = ?
    ]], {tweetId, profile[1].id})
    
    if tweet and #tweet > 0 then
        MySQL.query('DELETE FROM phone_twitter_tweets WHERE id = ?', {tweetId})
        TriggerEvent('white-phone:server:twitter:getFeed', src)
    end
end)

print('^2[White Phone] Twitter app loaded^0')
