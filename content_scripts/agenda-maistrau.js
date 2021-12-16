async function typeText(inputElement, text) {
    inputElement.focus()
    inputElement.value = text
}

(async function() {

    const titleInputSelector = '#title'

    const titleInputElement = document.querySelector(titleInputSelector)

    if (! facebookEvent) {
        alert(`Pas d'event Facebook sauvegardé.`)
        return
    }

    if (! titleInputElement) {
        alert(`Mauvais selector pour l'input du titre`)
        return
    }

    if (facebookEvent.title) {
        await typeText(titleInputElement, facebookEvent.title)
    }

    window.wrappedJSObject.tinymce.get('content').setContent('test')

    browser.runtime.sendMessage(
        undefined,
        null
    ).then(response => {
        // nothing
    }).catch(alert)
})()
