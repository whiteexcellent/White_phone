-- ================================================
-- HACK PHONE - TRACKING SYSTEM
-- ================================================

-- Update tracking locations
CreateThread(function()
    while true do
        Wait(5000) -- Update every 5 seconds
        
        local activeTracking = MySQL.query.await([[
            SELECT * FROM phone_hack_tracking 
            WHERE tracking_active = 1 AND expires_at > NOW()
        ]])
        
        for _, track in ipairs(activeTracking or {}) do
            local targetSrc = GetPlayerByPhoneNumber(track.target_phone_number)
            if targetSrc then
                local targetPed = GetPlayerPed(targetSrc)
                local coords = GetEntityCoords(targetPed)
                
                -- Update location
                MySQL.query([[
                    UPDATE phone_hack_tracking 
                    SET last_location = ? 
                    WHERE id = ?
                ]], {json.encode(coords), track.id})
                
                -- Notify hacker if online
                -- (Would need to track which player owns the hacker device)
            end
        end
    end
end)

-- Cleanup expired tracking
CreateThread(function()
    while true do
        Wait(60000) -- Check every minute
        
        MySQL.query([[
            UPDATE phone_hack_tracking 
            SET tracking_active = 0 
            WHERE expires_at < NOW()
        ]])
    end
end)
