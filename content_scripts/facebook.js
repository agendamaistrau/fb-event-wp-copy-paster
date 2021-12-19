(async function() {

    const eventTitleSelector = '.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.pby63qed'
    const placeNameSelector = '.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.ltmttdrg.g0qnabr5.ojkyduve'
    const placeAddressSelector = '[data-visualcompletion="ignore-dynamic"] .d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.fe6kdd0r.mau55g9w.c8b282yb.d3f4x2em.iv3no6db.jq4qci2q.a3bd9o3v.b1v8xokw.m9osqain.hzawbc8m'
    const descriptionSelector = '.dati1w0a.hv4rvrfc>.p75sslyk>span'
    const coverImgSelector = '[data-imgperflogname="profileCoverPhoto"]'

    const titleElement = document.querySelector(eventTitleSelector)

    if (! titleElement) {
        alert('Mauvais selector pour le titre')
        return
    }

    const title = titleElement.innerText

    const bodyHTML = document.body.innerHTML
    const splitOnCurrentStartTimestampKey = bodyHTML.split('current_start_timestamp":', 2)

    if (splitOnCurrentStartTimestampKey.length < 2) {
        alert('La date n\'a pas été trouvée dans le code de la page (La clé "current_start_timestamp" n\'est pas là)')
        return
    }

    const splitOnValueSeparator = splitOnCurrentStartTimestampKey[1].split(',', 2)
    const timestamp = parseInt(splitOnValueSeparator[0])

    const time = new Date(timestamp * 1000 /* Convert Unix Timestamp to JavaScript Timestamp */)

    const placeNameElement = document.querySelector(placeNameSelector)

    if (! placeNameElement) {
        alert('Mauvais selector pour le lieu')
        return
    }

    const placeName = placeNameElement.innerText

    const placeAddressElement = document.querySelector(placeAddressSelector)
    const placeAddress = placeAddressElement ? placeAddressElement.innerText : null

    const descriptionElement = document.querySelector(descriptionSelector)

    const buttonSelector = '[role="button"]'
    const buttonElement = descriptionElement.querySelector(buttonSelector)

    if (buttonElement) {
        buttonElement.click()
        await new Promise(resolve => setTimeout(resolve, 1000))

        const voirMoinsButtonElement = descriptionElement.querySelector(buttonSelector)

        if (voirMoinsButtonElement) {
            voirMoinsButtonElement.remove()
        }
    }

    const descriptionHTML = descriptionElement.innerHTML

    const splitStartDescription = descriptionHTML.split('<img alt="')

    let newDescriptionHTML = ''
    for (const splitStartFragmentIndex in splitStartDescription) {
        const splitStartFragment = splitStartDescription[splitStartFragmentIndex]

        if (splitStartFragmentIndex === '0') {
            newDescriptionHTML += splitStartFragment
            continue
        }

        const doubleQuote = '"'
        const splitOnClosingDoubleQuote = splitStartFragment.split(doubleQuote)
        const emoji = splitOnClosingDoubleQuote.shift()
        newDescriptionHTML += emoji

        const afterEmoji = splitOnClosingDoubleQuote.join(doubleQuote)
        const HTMLTagClose = '>'
        const splitOnHTMLTagClose = afterEmoji.split(HTMLTagClose)
        splitOnHTMLTagClose.shift()

        newDescriptionHTML += splitOnHTMLTagClose.join(HTMLTagClose)
    }

    descriptionElement.innerHTML = newDescriptionHTML

    const description = descriptionElement.innerText

    const coverImgElement = document.querySelector(coverImgSelector)

    if (! coverImgElement) {
        alert('Mauvais selector pour l\'image de couverture')
        return
    }

    const imageLink = coverImgElement.src

    if (! imageLink) {
        alert('Le lien de l\'image de couverture n\'est pas trouvable (probablement un mauvais selector)')
        return
    }

    const facebookEvent = {title, time, placeName, placeAddress, description, imageLink}

    browser.runtime.sendMessage(
        undefined,
        facebookEvent
    ).then(response => {
        // nothing
    }).catch(alert)
})()
