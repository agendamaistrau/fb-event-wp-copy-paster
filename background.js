var facebookEvent = null

function getFacebookEvent() {
    return facebookEvent
}

function handleMessage(request, sender, sendResponse) {
    if (request) {
        facebookEvent = request
    }

    sendResponse(facebookEvent);
}
  
browser.runtime.onMessage.addListener(handleMessage);