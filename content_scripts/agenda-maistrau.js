function typeText(inputElement, text) {
    inputElement.focus()
    inputElement.value = text
}

(async function() {
    const titleInputSelector = '#title'

    const titleInputElement = document.querySelector(titleInputSelector)

    if (! titleInputElement) {
        console.error(`Mauvais selector pour l'input du titre`)
        return
    }

    if (typeof facebookEventTitle === 'undefined') {
        console.error(`Pas de titre d'évènement sauvegardé`)
        return
    }

    if (typeof facebookEventPlaceName === 'undefined') {
        console.error(`Pas de lieu d'évènement sauvegardé`)
        return
    }

    const articleTitle = facebookEventTitle + ' - ' + facebookEventPlaceName + ' - ' + (
        facebookEventCity || facebookEventPlaceAddress || ''
    )

    typeText(titleInputElement, articleTitle)

    let facebookEventFormattedDescription = ''

    if (typeof facebookEventDescription === 'undefined') {
        console.error(`Pas de description d'évènement sauvegardé`)
    } else {
        facebookEventFormattedDescription = facebookEventDescription.replace('\n', '<br>')
    }

    let time = null

    let year = null
    let month = null
    let day = null
    let hour = null
    let minute = null
    
    if (typeof facebookEventTimestamp === 'undefined' || ! facebookEventTimestamp) {
        console.error(`Pas de date d'évènement sauvegardé`)
    } else {
        /** @type {Date} */
        time = new Date(facebookEventTimestamp)

        year = time.getFullYear()
        month = (time.getMonth() + 1).toString().padStart(2, '0')
        day = time.getDate().toString().padStart(2, '0')
        hour = time.getHours().toString().padStart(2, '0')
        minute = time.getMinutes().toString().padStart(2, '0')
    }
    
    const displayedTime = time ? `${day}/${month}/${year} ${hour}:${minute}` : '[Pas de date]'

    let articleContent = `<p>⏰Évènement du ${displayedTime}⏰` + '</p><p>' + 
        facebookEventFormattedDescription + '<p>' +
        facebookEventPlaceName + ', ' + facebookEventPlaceAddress + '</p>'

    if (typeof facebookEventArticleEnd !== 'undefined') {
        articleContent += facebookEventArticleEnd
    }

    window.wrappedJSObject.tinymce.get('content').setContent(articleContent)

    // Créer le champ date_event_article
    const newCustomFieldButtonSelector = '#enternew'
    const newCustomFieldButton = document.querySelector(newCustomFieldButtonSelector)

    if (! newCustomFieldButton) {
        console.error('Bouton "Saisissez un nouveau" manquant')
    } else {
        newCustomFieldButton.click()

        await new Promise(resolve => setTimeout(resolve, 1000))

        // Clé date_event_article
        const customFieldLabelSelector = '#metakeyinput'
        const customFieldLabel = document.querySelector(customFieldLabelSelector)

        if (! customFieldLabel) {
            console.error('Input label champ personnalisé manquant')
        } else {
            typeText(customFieldLabel, 'date_event_article')

            // Valeur de date_event_article
            const customFieldValueSelector = '#metavalue'
            const customFieldValue = document.querySelector(customFieldValueSelector)

            if (! customFieldValue) {
                console.error('Input valeur champ personnalisé manquant')
            } else {
                if (time) {
                    const dateEventTime = `${year}-${month}-${day} ${hour}:${minute}:00`
                    typeText(customFieldValue, dateEventTime)
                }
            }
        }
    }

    // Yoast SEO - Requête Cible
    const yoastSEOQuerySelector = '#focus-keyword-input-metabox'
    const yoastSEOQuery = document.querySelector(yoastSEOQuerySelector)

    if (! yoastSEOQuery) {
        console.error('Input "Requête cible" de "Yoast SEO" manquant')
    } else {
        typeText(yoastSEOQuery, articleTitle)
    }

    // Catégories -> Toutes
    const allCategoriesTabButtonSelector = '[href="#category-all"]'
    const allCategoriesTabButton = document.querySelector(allCategoriesTabButtonSelector)

    if (! allCategoriesTabButton) {
        console.error('Bouton "Catégories" -> "Toutes" manquant')
    } else {
        allCategoriesTabButton.click()

        await new Promise(resolve => setTimeout(resolve, 1000))

        if (typeof facebookEventCategoryId === 'undefined') {
            console.error(`Pas de catégorie de zone sauvegardé`)
        } else {
            // Case à cocher catégorie zone
            const zoneCategoryCheckboxSelector = '#in-category-' + facebookEventCategoryId.toString()
            const zoneCategoryCheckbox = document.querySelector(zoneCategoryCheckboxSelector)

            if (! zoneCategoryCheckbox) {
                console.error('Case à cocher de la zone sélectionnée manquante')
            } else {
                if (! zoneCategoryCheckbox.checked) {
                    zoneCategoryCheckbox.click()
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }
            }
        }

        // Case à cocher catégorie "Toute la provence"
        const provenceCategoryCheckboxSelector = '#in-category-' + '158'
        const provenceCategoryCheckbox = document.querySelector(provenceCategoryCheckboxSelector)

        if (! provenceCategoryCheckbox) {
            console.error('Case à cocher de la catégorie "Toute la Provence" manquante')
        } else {
            if (! provenceCategoryCheckbox.checked) {
                provenceCategoryCheckbox.click()
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        }
    }

    browser.runtime.sendMessage(
        undefined,
        null
    ).then(response => {
        // nothing
    }).catch(console.error)
})()
