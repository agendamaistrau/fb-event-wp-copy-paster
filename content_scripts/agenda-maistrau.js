function typeText(inputElement, text) {
    inputElement.focus()
    inputElement.value = text
}

(async function() {

    const titleInputSelector = '#title'

    const titleInputElement = document.querySelector(titleInputSelector)

    if (! titleInputElement) {
        alert(`Mauvais selector pour l'input du titre`)
        return
    }

    if (typeof facebookEventTitle === 'undefined') {
        alert(`Pas de titre d'évènement sauvegardé`)
        return
    }

    if (typeof facebookEventPlaceName === 'undefined') {
        alert(`Pas de lieu d'évènement sauvegardé`)
        return
    }

    typeText(
        titleInputElement,
        facebookEventTitle + ' - ' + facebookEventPlaceName + ' - ' + (
            facebookEventCity || facebookEventPlaceAddress || ''
        )
    )

    if (typeof facebookEventDescription === 'undefined') {
        alert(`Pas de description d'évènement sauvegardé`)
        return
    }

    if (typeof facebookEventTimestamp === 'undefined') {
        alert(`Pas de date d'évènement sauvegardé`)
        return
    }

    /** @type {Date} */
    const time = new Date(facebookEventTimestamp)

    const year = time.getFullYear()
    const month = (time.getMonth() + 1).toString().padStart(2, '0')
    const day = time.getDate().toString().padStart(2, '0')
    const hour = time.getHours().toString().padStart(2, '0')
    const minute = time.getMinutes().toString().padStart(2, '0')
    const displayedTime = `${day}/${month}/${year} ${hour}:${minute}`

    let articleContent = `<p>⏰Évènement du ${displayedTime}⏰` + '</p><p>' + 
        facebookEventDescription.replace('\n', '<br>') + '<p>' +
        facebookEventPlaceName + ' ' + facebookEventPlaceAddress + '</p>'

    if (typeof facebookEventShortCode !== 'undefined') {
        articleContent += `<h3 style="text-align: center;">Autour de chez vous</h3>` +
            facebookEventShortCode
    }

    window.wrappedJSObject.tinymce.get('content').setContent(articleContent)

    browser.runtime.sendMessage(
        undefined,
        null
    ).then(response => {
        // nothing
    }).catch(alert)
})()
