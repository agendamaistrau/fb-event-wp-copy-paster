function writeBodyHtml(html) {
    document.querySelector('body').innerHTML = html
}

function copyInformationsFromFacebookEvent() {
    browser.tabs.executeScript({file: '/content_scripts/facebook.js'}).then(() => {
        const getting = browser.runtime.getBackgroundPage();
        getting.then((page) => {
            const facebookEvent = page.getFacebookEvent()
            if (facebookEvent) {
                writeBodyHtml(`
                    <h1>Event Facebook Copié !<h1>
                    <ul>
                        <li>Titre : ${facebookEvent.title}</li>
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