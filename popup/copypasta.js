function writeBodyHtml(html) {
    document.querySelector('body').innerHTML = html
}

function copyInformationsFromFacebookEvent(zone) {
    browser.tabs.executeScript({file: '/content_scripts/facebook.js'}).then(() => {
        const getting = browser.runtime.getBackgroundPage();
        getting.then(async (page) => {
            page.setZone(zone)
            const facebookEvent = await page.getFacebookEvent()
            if (facebookEvent) {

                /** @type {Date} */
                const time = facebookEvent.time
                const timeString = time.getFullYear() + '-' + ((time.getMonth() + 1).toString().padStart(2, '0')) + '-' + (time.getDate().toString().padStart(2, '0')) + ' ' + (time.getHours().toString().padStart(2, '0')) + ':' + (time.getMinutes().toString().padStart(2, '0'))

                writeBodyHtml(`
                    <h1 style="text-align: center;">Event Facebook Copié !<h1>
                    <ul style="margin-right: 20px;">
                        <li>Zone : <b>${facebookEvent.zone?.category?.name || 'Aucune'}</b></li>
                        <li>Titre : <b>${facebookEvent.title}</b></li>
                        <li>Date : <b>${timeString}</b></li>
                        <li>Nom du lieu : <b>${facebookEvent.placeName}</b></li>
                        <li>Adresse du lieu : <b>${facebookEvent.placeAddress ? facebookEvent.placeAddress : 'Aucune'}</b></li>
                        <li>Ville : <b>${facebookEvent.city ? facebookEvent.city : 'Aucune'}</b></li>
                        <li>Description : <br><b>${facebookEvent.description.replaceAll('\n', '<br>')}</b></li>
                        <li>Image : <img src="${facebookEvent.imageLink}" style="display block; width: 100%;"></li>
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
    getting.then(async (page) => {
        const facebookEvent = await page.getFacebookEvent()
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
        const radioButtonsName = 'category-id'
        const submitButtonId = 'submit-button'
        
        writeBodyHtml(`
            <div style="padding: 0 20px;">
                <h1 style="text-align: center;">Sélection des Zones<h1>
                <ul style="list-style-type: none; padding: 0;">
                    ${zones.map(zone => {
                        const category = zone.category
                        const categoryId = category.id
                        const inputCategoryId = 'cat-' + categoryId

                        return `<li>
                            <input
                                type="radio"
                                id="${inputCategoryId}"
                                name="${radioButtonsName}"
                                value="${categoryId}"
                            >
                            <label for="${inputCategoryId}">${category.name}</label>
                        </li>`
                    }).join('')}
                </ul>
                <button
                    id="${submitButtonId}"
                    type="submit"
                    style="width: 100%; text-align: center;"
                >Valider</button>
            </div>
        `)

        const findZoneByCategoryId = (categoryId) => zones.find(zone => zone.category.id === categoryId)

        document.querySelector('#' + submitButtonId).addEventListener('click', () => {
            const checkedRadio = document.querySelector(`input[name="${radioButtonsName}"]:checked`)
            if (checkedRadio) {
                const selectedZone = findZoneByCategoryId(parseInt(checkedRadio.value))

                if (selectedZone) {
                    copyInformationsFromFacebookEvent(selectedZone)
                }
            }
        })
        
        return
    }

    if (currentUrl.includes('https://agenda-maistrau.fr/wp-admin/post-new.php')) {
        pasteFacebookEventInformationsToArticle()
        return
    }

    writeBodyHtml(`<h1>Tu t'es probablement planté de page :D</h1>`)
});
