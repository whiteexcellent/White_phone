-- ==========================================
-- BANKING APP - SERVER SIDE
-- ==========================================

-- Get bank account info
RegisterNetEvent('white-phone:server:bank:getAccount', function()
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local bankAccount = MySQL.query.await([[
        SELECT * FROM phone_bank_accounts WHERE phone_account_id = ?
    ]], {accountId})
    
    if not bankAccount or #bankAccount == 0 then
        -- Create bank account
        local accountNumber = 'ACC-' .. math.random(100000, 999999)
        local balance = GetPlayerMoney(src, 'bank')
        
        MySQL.insert.await([[
            INSERT INTO phone_bank_accounts (phone_account_id, account_number, balance, account_type)
            VALUES (?, ?, ?, 'checking')
        ]], {accountId, accountNumber, balance})
        
        bankAccount = {{
            id = MySQL.insert.await('SELECT LAST_INSERT_ID() as id')[1].id,
            account_number = accountNumber,
            balance = balance,
            account_type = 'checking'
        }}
    else
        -- Sync with framework money
        local frameworkBalance = GetPlayerMoney(src, 'bank')
        if math.abs(bankAccount[1].balance - frameworkBalance) > 0.01 then
            MySQL.query([[
                UPDATE phone_bank_accounts SET balance = ? WHERE id = ?
            ]], {frameworkBalance, bankAccount[1].id})
            bankAccount[1].balance = frameworkBalance
        end
    end
    
    TriggerClientEvent('white-phone:client:bank:accountInfo', src, bankAccount[1])
end)

-- Get transaction history
RegisterNetEvent('white-phone:server:bank:getTransactions', function(limit)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local bankAccount = MySQL.query.await([[
        SELECT id FROM phone_bank_accounts WHERE phone_account_id = ?
    ]], {accountId})
    
    if not bankAccount or #bankAccount == 0 then return end
    
    local transactions = MySQL.query.await([[
        SELECT * FROM phone_bank_transactions
        WHERE account_id = ?
        ORDER BY created_at DESC
        LIMIT ?
    ]], {bankAccount[1].id, limit or 50})
    
    TriggerClientEvent('white-phone:client:bank:transactions', src, transactions)
end)

-- Transfer money
RegisterNetEvent('white-phone:server:bank:transfer', function(recipientAccount, amount, description)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    amount = tonumber(amount)
    if not amount or amount <= 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Banking',
            message = 'Invalid amount'
        })
        return
    end
    
    -- Anti-abuse check
    if amount > Config.Banking.MaxTransferAmount then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Banking',
            message = 'Transfer amount exceeds limit'
        })
        return
    end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    -- Get sender account
    local senderAccount = MySQL.query.await([[
        SELECT * FROM phone_bank_accounts WHERE phone_account_id = ?
    ]], {accountId})
    
    if not senderAccount or #senderAccount == 0 then return end
    senderAccount = senderAccount[1]
    
    -- Check balance
    if senderAccount.balance < amount then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Banking',
            message = 'Insufficient funds'
        })
        return
    end
    
    -- Get recipient account
    local recipientAcc = MySQL.query.await([[
        SELECT * FROM phone_bank_accounts WHERE account_number = ?
    ]], {recipientAccount})
    
    if not recipientAcc or #recipientAcc == 0 then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Banking',
            message = 'Recipient account not found'
        })
        return
    end
    recipientAcc = recipientAcc[1]
    
    -- Perform transfer
    local newSenderBalance = senderAccount.balance - amount
    local newRecipientBalance = recipientAcc.balance + amount
    
    -- Update sender
    MySQL.query([[
        UPDATE phone_bank_accounts SET balance = ? WHERE id = ?
    ]], {newSenderBalance, senderAccount.id})
    
    -- Update recipient
    MySQL.query([[
        UPDATE phone_bank_accounts SET balance = ? WHERE id = ?
    ]], {newRecipientBalance, recipientAcc.id})
    
    -- Remove money from sender (framework)
    RemovePlayerMoney(src, 'bank', amount)
    
    -- Add money to recipient (framework)
    for _, playerId in ipairs(GetPlayers()) do
        local playerNumber = exports['white-phone']:GetPhoneNumber(playerId)
        if playerNumber then
            local playerAccountId = exports['white-phone']:GetPhoneAccountId(playerNumber)
            if playerAccountId == recipientAcc.phone_account_id then
                AddPlayerMoney(playerId, 'bank', amount)
                
                -- Notify recipient
                TriggerClientEvent('white-phone:client:notification', playerId, {
                    appId = 'bank',
                    appName = 'Bank',
                    appIcon = '💳',
                    appColor = '#32D74B',
                    title = 'Money Received',
                    body = ('$%s from %s'):format(amount, senderAccount.account_number),
                    time = 'now'
                })
                break
            end
        end
    end
    
    -- Log sender transaction
    MySQL.insert([[
        INSERT INTO phone_bank_transactions (account_id, type, amount, description, recipient_account, balance_after)
        VALUES (?, 'transfer', ?, ?, ?, ?)
    ]], {senderAccount.id, -amount, description or 'Transfer', recipientAccount, newSenderBalance})
    
    -- Log recipient transaction
    MySQL.insert([[
        INSERT INTO phone_bank_transactions (account_id, type, amount, description, recipient_account, balance_after)
        VALUES (?, 'deposit', ?, ?, ?, ?)
    ]], {recipientAcc.id, amount, description or 'Transfer received', senderAccount.account_number, newRecipientBalance})
    
    -- Notify sender
    TriggerClientEvent('white-phone:client:notify', src, {
        type = 'success',
        title = 'Banking',
        message = ('Successfully transferred $%s'):format(amount)
    })
    
    -- Refresh sender's account
    TriggerEvent('white-phone:server:bank:getAccount', src)
end)

-- Deposit money
RegisterNetEvent('white-phone:server:bank:deposit', function(amount)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    amount = tonumber(amount)
    if not amount or amount <= 0 then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local bankAccount = MySQL.query.await([[
        SELECT * FROM phone_bank_accounts WHERE phone_account_id = ?
    ]], {accountId})
    
    if not bankAccount or #bankAccount == 0 then return end
    bankAccount = bankAccount[1]
    
    -- Check if player has cash
    local cash = GetPlayerMoney(src, 'cash')
    if cash < amount then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Banking',
            message = 'Insufficient cash'
        })
        return
    end
    
    -- Perform deposit
    RemovePlayerMoney(src, 'cash', amount)
    AddPlayerMoney(src, 'bank', amount)
    
    local newBalance = bankAccount.balance + amount
    MySQL.query([[
        UPDATE phone_bank_accounts SET balance = ? WHERE id = ?
    ]], {newBalance, bankAccount.id})
    
    -- Log transaction
    MySQL.insert([[
        INSERT INTO phone_bank_transactions (account_id, type, amount, description, balance_after)
        VALUES (?, 'deposit', ?, 'Cash deposit', ?)
    ]], {bankAccount.id, amount, newBalance})
    
    TriggerClientEvent('white-phone:client:notify', src, {
        type = 'success',
        title = 'Banking',
        message = ('Deposited $%s'):format(amount)
    })
end)

-- Withdraw money
RegisterNetEvent('white-phone:server:bank:withdraw', function(amount)
    local src = source
    local phoneNumber = exports['white-phone']:GetPhoneNumber(src)
    if not phoneNumber then return end
    
    amount = tonumber(amount)
    if not amount or amount <= 0 then return end
    
    local accountId = exports['white-phone']:GetPhoneAccountId(phoneNumber)
    if not accountId then return end
    
    local bankAccount = MySQL.query.await([[
        SELECT * FROM phone_bank_accounts WHERE phone_account_id = ?
    ]], {accountId})
    
    if not bankAccount or #bankAccount == 0 then return end
    bankAccount = bankAccount[1]
    
    if bankAccount.balance < amount then
        TriggerClientEvent('white-phone:client:notify', src, {
            type = 'error',
            title = 'Banking',
            message = 'Insufficient funds'
        })
        return
    end
    
    -- Perform withdrawal
    RemovePlayerMoney(src, 'bank', amount)
    AddPlayerMoney(src, 'cash', amount)
    
    local newBalance = bankAccount.balance - amount
    MySQL.query([[
        UPDATE phone_bank_accounts SET balance = ? WHERE id = ?
    ]], {newBalance, bankAccount.id})
    
    -- Log transaction
    MySQL.insert([[
        INSERT INTO phone_bank_transactions (account_id, type, amount, description, balance_after)
        VALUES (?, 'withdrawal', ?, 'Cash withdrawal', ?)
    ]], {bankAccount.id, -amount, newBalance})
    
    TriggerClientEvent('white-phone:client:notify', src, {
        type = 'success',
        title = 'Banking',
        message = ('Withdrew $%s'):format(amount)
    })
end)

print('^2[White Phone] Banking app loaded^0')
