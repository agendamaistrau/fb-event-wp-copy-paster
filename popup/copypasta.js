function writeBodyHtml(html) {
    document.querySelector('body').innerHTML = html
}

function copyInformationsFromFacebookEvent() {
    browser.tabs.executeScript({file: '/content_scripts/facebook.js'}).then(() => {
        const getting = browser.runtime.getBackgroundPage();
        getting.then((page) => {
            const facebookEvent = page.getFacebookEvent()
            if (facebookEvent) {

                /** @type {Date} */
                const time = facebookEvent.time
                const timeString = time.getFullYear() + '-' + ((time.getMonth() + 1).toString().padStart(2, '0')) + '-' + (time.getDate().toString().padStart(2, '0')) + ' ' + (time.getHours().toString().padStart(2, '0')) + ':' + (time.getMinutes().toString().padStart(2, '0'))

                writeBodyHtml(`
                    <h1 style="text-align: center;">Event Facebook Copié !<h1>
                    <ul style="margin-right: 20px;">
                        <li>Titre : <b>${facebookEvent.title}</b></li>
                        <li>Date : <b>${timeString}</b></li>
                        <li>Nom du lieu : <b>${facebookEvent.placeName}</b></li>
                        <li>Adresse du lieu : <b>${facebookEvent.placeAddress ? facebookEvent.placeAddress : 'Aucune'}</b></li>
                        <li>Description : <b>${facebookEvent.description}</b></li>
                    </ul>
                `)

                return
            }

            writeBodyHtml(`<h1>Pas d'event Facebook trouvé :'(</h1>`)
            
        }, (error) => {
            document.querySelector('body').innerHTML = JSON.stringify(error)
        });
    })
}

function pasteFacebookEventInformationsToArticle() {
    const getting = browser.runtime.getBackgroundPage();
    getting.then((page) => {
        const facebookEvent = page.getFacebookEvent()
        if (facebookEvent) {
            browser.tabs.executeScript({
                code: `var facebookEvent = ${JSON.stringify(facebookEvent)};`
            }).then(() => {
                browser.tabs.executeScript({file: '/content_scripts/agenda-maistrau.js'}).then(() => {
                    writeBodyHtml(`<h1>Collé !</h1>`)
                })
            })

            return
        }
        writeBodyHtml(`<h1>Pas d'event Facebook trouvé :'(</h1>`)
        
    }, (error) => {
        document.querySelector('body').innerHTML = JSON.stringify(error)
    });
}

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {   
	const currentTab = tabs[0];
    const currentUrl = currentTab.url

    if (currentUrl.includes('https://www.facebook.com/events/')) {
        copyInformationsFromFacebookEvent()
        return
    }

    if (currentUrl.includes('https://agenda-maistrau.fr/wp-admin/post-new.php')) {
        pasteFacebookEventInformationsToArticle()
        return
    }

    writeBodyHtml(`<h1>Tu t'es probablement planté de page :D</h1>`)
});