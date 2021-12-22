var facebookEvent = null

async function getFacebookEvent() {
    return facebookEvent
}

function setZone(zone) {
    if (facebookEvent) {
        facebookEvent.zone = {
            category: {... zone.category},
            articleEnd: zone.articleEnd
        }
    }
}

function handleMessage(request, sender, sendResponse) {
    if (request) {
        facebookEvent = request
    }

    sendResponse(facebookEvent);
}
  
browser.runtime.onMessage.addListener(handleMessage);
