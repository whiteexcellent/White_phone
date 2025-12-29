-- ================================================
-- CLIENT - CAMERA HANDLER
-- ================================================

local cameraActive = false
local frontCam = false

RegisterNUICallback('openCamera', function(data, cb)
    cameraActive = true
    CreateMobilePhone(1)
    CellCamActivate(true, true)
    cb('ok')
end)

RegisterNUICallback('takePhoto', function(data, cb)
    if not cameraActive then 
        cb('error')
        return 
    end
    
    -- Take screenshot and convert to base64
    exports['screenshot-basic']:requestScreenshotUpload(Config.Messages.MediaUploadURL, 'files[]', function(data)
        local resp = json.decode(data)
        if resp and resp.files and resp.files[1] then
            local photoUrl = resp.files[1].url
            
            SendNUIMessage({
                action = 'photoTaken',
                data = {url = photoUrl}
            })
            
            TriggerServerEvent('phone:server:uploadPhoto', currentDeviceId, photoUrl)
        end
    end)
    
    cb('ok')
end)

RegisterNUICallback('closeCamera', function(data, cb)
    cameraActive = false
    DestroyMobilePhone()
    CellCamActivate(false, false)
    cb('ok')
end)

RegisterNUICallback('switchCamera', function(data, cb)
    frontCam = not frontCam
    CellCamActivate(true, frontCam)
    cb('ok')
end)
