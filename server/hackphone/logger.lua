-- ================================================
-- HACK PHONE - LOGGER & AUDIT
-- ================================================

-- Get hack logs (admin command)
RegisterCommand('phone:admin:hacklogs', function(source, args)
    if source == 0 then -- Console
        local logs = MySQL.query.await([[
            SELECT * FROM phone_hack_logs 
            ORDER BY created_at DESC 
            LIMIT 50
        ]])
        
        print('^3=== HACK PHONE LOGS ===^7')
        for _, log in ipairs(logs or {}) do
            print(string.format('[%s] %s -> %s | Type: %s | Success: %s', 
                log.created_at, 
                log.hacker_device_id, 
                log.target_phone_number, 
                log.hack_type, 
                log.success == 1 and 'YES' or 'NO'
            ))
        end
    end
end, true)

-- Get evidence (police command)
RegisterCommand('phone:police:evidence', function(source, args)
    local src = source
    local Player = GetPlayer(src)
    if not Player then return end
    
    local playerJob = Config.Framework == 'qb-core' and Player.PlayerData.job.name or Player.getJob().name
    local isPolice = false
    
    for _, job in ipairs(Config.HackPhone.PoliceAlert.AlertJobs) do
        if playerJob == job then
            isPolice = true
            break
        end
    end
    
    if not isPolice then
        SendNotify(src, 'Access denied', 'error')
        return
    end
    
    local evidence = MySQL.query.await([[
        SELECT e.*, hl.target_phone_number, hl.hack_type, hl.created_at as hack_time
        FROM phone_hack_evidence e
        JOIN phone_hack_logs hl ON e.hack_log_id = hl.id
        WHERE e.expires_at > NOW() AND e.collected_by IS NULL
        ORDER BY e.expires_at ASC
    ]])
    
    TriggerClientEvent('phone:client:evidenceList', src, evidence or {})
end)

-- Collect evidence
RegisterNetEvent('phone:server:collectEvidence', function(evidenceId)
    local src = source
    local Player = GetPlayer(src)
    if not Player then return end
    
    local identifier = GetPlayerIdentifier(src)
    
    MySQL.query([[
        UPDATE phone_hack_evidence 
        SET collected_by = ?, collected_at = NOW() 
        WHERE evidence_id = ?
    ]], {identifier, evidenceId})
    
    SendNotify(src, 'Evidence collected', 'success')
end)

-- Cleanup old logs
CreateThread(function()
    while true do
        Wait(3600000) -- Every hour
        
        -- Delete logs older than 30 days
        MySQL.query('DELETE FROM phone_hack_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)')
        
        -- Delete expired evidence
        MySQL.query('DELETE FROM phone_hack_evidence WHERE expires_at < NOW()')
        
        Utils.Debug('Cleaned up old hack logs and evidence')
    end
end)
