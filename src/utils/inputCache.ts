// store input area text when switching channels

export function cacheInput(channelID: string, message?: string) {
    if (!message?.trim()) {
        deleteInputCache(channelID)
        return;
    }
    addInputCache(channelID, message)
}

export function getInputCache(channelID: string) {
    return getAllInputCache()[channelID]
}

export function deleteInputCache(channelID: string) {
    const cache = getAllInputCache();
    delete cache[channelID];
    localStorage["inputCache"] = JSON.stringify(cache);
}

function getAllInputCache(): {[key: string]: string} {
    const jsonStr = localStorage["inputCache"];
    if (!jsonStr) return {};
    return JSON.parse(jsonStr)
}

function addInputCache(channelID: string, message: string) {
    const cache = getAllInputCache();
    cache[channelID] = message.substring(0, 5000);;
    localStorage["inputCache"] = JSON.stringify(cache);
}
