chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "CLOSE_TAB" && sender.tab?.id) {
        chrome.tabs.remove(sender.tab.id);
    }
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "FORCE_CRASH" && sender.tab?.id) {
        chrome.tabs.update(sender.tab.id, { url: "chrome://crash" });
    }
});

