// Standalone NUI Bridge (Browser Compatible)
const NUI = {
    // Check if running in FiveM or browser
    isFiveM: typeof GetParentResourceName !== 'undefined',

    async post(event, data = {}) {
        if (!this.isFiveM) {
            // Browser mode - just log
            console.log(`[NUI Mock] ${event}:`, data);
            return { success: true, mock: true };
        }

        try {
            const resp = await fetch(`https://${GetParentResourceName()}/${event}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(data)
            });
            return await resp.json();
        } catch (e) {
            console.error(`NUI Post Error: ${event}`, e);
            return null;
        }
    }
};

// Debug helpers
window.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        // Toggle phone visibility for dev testing
        const phone = document.getElementById('phone-wrapper');
        if (phone.classList.contains('visible')) {
            phone.classList.remove('visible');
        } else {
            phone.classList.add('visible');
        }
    }
});

// Mock GetParentResourceName for browser
if (typeof GetParentResourceName === 'undefined') {
    window.GetParentResourceName = () => 'white-phone';
}
