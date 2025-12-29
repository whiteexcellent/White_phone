-- ==========================================
-- CAMERA & GALLERY APP - SERVER SIDE
-- ==========================================

-- Upload photo
RegisterNetEvent('white-phone:server:camera:upload', function(photoData)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    -- Get player coords for location
    local ped = GetPlayerPed(src)
    local coords = GetEntityCoords(ped)
    local location = ('%.2f, %.2f, %.2f'):format(coords.x, coords.y, coords.z)
    
    -- Insert photo
    local photoId = MySQL.insert.await([[
        INSERT INTO phone_gallery (phone_account_id, url, thumbnail, location)
        VALUES (?, ?, ?, ?)
    ]], {accountId, photoData.url, photoData.thumbnail, location})
    
    TriggerClientEvent('white-phone:client:camera:uploaded', src, {
        id = photoId,
        url = photoData.url,
        thumbnail = photoData.thumbnail,
        location = location,
        created_at = os.date('%Y-%m-%d %H:%M:%S')
    })
end)

-- Get gallery photos
RegisterNetEvent('white-phone:server:gallery:getPhotos', function(limit)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local photos = MySQL.query.await([[
        SELECT * FROM phone_gallery
        WHERE phone_account_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    ]], {accountId, limit or 100})
    
    TriggerClientEvent('white-phone:client:gallery:photos', src, photos)
end)

-- Delete photo
RegisterNetEvent('white-phone:server:gallery:delete', function(photoId)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    -- Verify ownership
    local photo = MySQL.query.await([[
        SELECT * FROM phone_gallery WHERE id = ? AND phone_account_id = ?
    ]], {photoId, accountId})
    
    if photo and #photo > 0 then
        MySQL.query('DELETE FROM phone_gallery WHERE id = ?', {photoId})
        TriggerClientEvent('white-phone:client:gallery:photoDeleted', src, photoId)
    end
end)

print('^2[White Phone] Camera & Gallery app loaded^0')
