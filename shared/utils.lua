Utils = {}

function Utils.Debug(...)
    if Config.Debug then
        print('^4[White Phone]^7', ...)
    end
end

function Utils.GenerateDeviceID()
    return 'DEV-' .. math.random(100000, 999999)
end

function Utils.GenerateAccountID()
    return 'ACC-' .. math.random(1000000, 9999999)
end

function Utils.GeneratePhoneNumber()
    return '555-' .. math.random(1000, 9999)
end
