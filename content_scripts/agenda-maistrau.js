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

    const articleTitle = facebookEventTitle + ' - ' + facebookEventPlaceName + ' - ' + (
        facebookEventCity || facebookEventPlaceAddress || ''
    )

    typeText(titleInputElement, articleTitle)

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

    // Créer le champ date_event_article
    const newCustomFieldButtonSelector = '#enternew'
    const newCustomFieldButton = document.querySelector(newCustomFieldButtonSelector)

    if (! newCustomFieldButton) {
        alert('Bouton "Saisissez un nouveau" manquant')
        return
    }

    newCustomFieldButton.click()

    await new Promise(resolve => setTimeout(resolve, 1000))

    // Clé date_event_article
    const customFieldLabelSelector = '#metakeyinput'
    const customFieldLabel = document.querySelector(customFieldLabelSelector)

    if (! customFieldLabel) {
        alert('Input label champ personnalisé manquant')
        return
    }

    typeText(customFieldLabel, 'date_event_article')

    // Valeur de date_event_article
    const customFieldValueSelector = '#metavalue'
    const customFieldValue = document.querySelector(customFieldValueSelector)

    if (! customFieldValue) {
        alert('Input valeur champ personnalisé manquant')
        return
    }

    const dateEventTime = `${year}-${month}-${day} ${hour}:${minute}:00`

    typeText(customFieldValue, dateEventTime)

    // Yoast SEO - Requête Cible
    const yoastSEOQuerySelector = '#focus-keyword-input-metabox'
    const yoastSEOQuery = document.querySelector(yoastSEOQuerySelector)

    if (! yoastSEOQuery) {
        alert('Input "Requête cible" de "Yoast SEO" manquant')
        return
    }

    typeText(yoastSEOQuery, articleTitle)

    // Catégories -> Toutes
    const allCategoriesTabButtonSelector = '[href="#category-all"]'
    const allCategoriesTabButton = document.querySelector(allCategoriesTabButtonSelector)

    if (! allCategoriesTabButton) {
        alert('Bouton "Catégories" -> "Toutes" manquant')
        return
    }

    allCategoriesTabButton.click()

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (typeof facebookEventCategoryId === 'undefined') {
        alert(`Pas de catégorie de zone sauvegardé`)
        return
    }

    // Case à cocher catégorie
    const categoryCheckboxSelector = '#in-category-' + facebookEventCategoryId.toString()
    const categoryCheckbox = document.querySelector(categoryCheckboxSelector)

    if (! categoryCheckbox) {
        alert('Case à cocher de la zone sélectionnée manquante')
        return
    }

    if (! categoryCheckbox.checked) {
        categoryCheckbox.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    browser.runtime.sendMessage(
        undefined,
        null
    ).then(response => {
        // nothing
    }).catch(alert)
})()
