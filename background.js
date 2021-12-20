var facebookEvent = null

async function getFacebookEvent() {
    facebookEvent.imageContent = await new Promise(resolve => {
        const fileRequest = new XMLHttpRequest()
        fileRequest.onreadystatechange = function() {
            if (fileRequest.status == 200 && fileRequest.readyState == 4) {
                resolve(fileRequest.responseText)
            }
        }
        fileRequest.open('GET', facebookEvent.imageLink, true)
        fileRequest.send()
    })

    return facebookEvent
}

function setZone(zone) {
    if (facebookEvent) {
        facebookEvent.zone = zone
    }
}

function handleMessage(request, sender, sendResponse) {
    if (request) {
        facebookEvent = request
    }

    sendResponse(facebookEvent);
}
  
browser.runtime.onMessage.addListener(handleMessage);
