// NUI Message and Response Types
export interface NUIMessage<T = any> {
    action: string;
    data?: T;
}

export interface NUIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

// FiveM Global Function Declaration
declare global {
    function GetParentResourceName(): string;
}

// Check if running in FiveM
const isFiveM = typeof window !== 'undefined' && 'invokeNative' in window;

// Mock GetParentResourceName for browser
if (typeof window !== 'undefined' && !isFiveM) {
    (window as any).GetParentResourceName = () => 'white-phone';
}

/**
 * Fetch data from NUI (FiveM Lua backend)
 */
export async function fetchNui<T = any>(
    event: string,
    data?: any
): Promise<NUIResponse<T>> {
    if (!isFiveM) {
        // Browser mock
        console.log(`[NUI Mock] ${event}:`, data);
        return {
            success: true,
            data: {} as T,
        };
    }

    try {
        const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'white-phone';
        const response = await fetch(
            `https://${resourceName}/${event}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
        );

        return await response.json();
    } catch (error) {
        console.error(`[NUI Error] ${event}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

/**
 * Listen for NUI messages from Lua
 */
export function onNuiMessage<T = any>(
    action: string,
    handler: (data: T) => void
) {
    const listener = (event: MessageEvent<NUIMessage<T>>) => {
        if (event.data.action === action) {
            handler(event.data.data as T);
        }
    };

    window.addEventListener('message', listener);

    // Return cleanup function
    return () => window.removeEventListener('message', listener);
}

/**
 * Send message to NUI (close phone, etc.)
 */
export function sendNuiMessage(action: string, data?: any) {
    if (isFiveM) {
        fetchNui(action, data);
    } else {
        console.log(`[NUI Send] ${action}:`, data);
    }
}

/**
 * Utility to check if running in FiveM
 */
export function isInFiveM(): boolean {
    return isFiveM;
}
