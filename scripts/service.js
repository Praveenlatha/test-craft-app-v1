const generateIdeas = 'pages/generatedIdeas.html';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
    if (message.action === 'element-picked') {
        await chrome.storage.local.set({
            ['selected-element']: message.source,
            ['element-picked']: true,
        });
        if (message.screenShot) {
            chrome.storage.local.set({ ['element-screenshot']: message.screenShot });
        }
    }

    // if (message.action === "take-screenshot") {
    //     const dataUrl = await chrome.tabs.captureVisibleTab(null, {format: 'jpg', quality: 30});
    //     await chrome.storage.local.set({ ['page-screenshot']: dataUrl });
    // }

    if (message.action === "screenshot-taken") {
        await chrome.storage.local.set({ ['page-screenshot']: message.screenshot });
    }

    // switch (request.action) {
    //     case 'generate-ideas':
    //         chrome.sidePanel.setOptions({ path: generateIdeas });
    //         break;
    
    //     default:
    //         break;
    // }

});