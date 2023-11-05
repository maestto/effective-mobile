import fetch from "node-fetch"

export async function sendUserActionToHistoryService(data) {
    try {
        await fetch(`${process.env.HISTORY_SERVICE_URL}/user-history`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Error sending user action data to history service', error)
    }
}