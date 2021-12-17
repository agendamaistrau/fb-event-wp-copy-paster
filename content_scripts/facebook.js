(async function() {

    const eventTitleSelector = '.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.pby63qed'
    const daySelector = '.taijpn5t.cb02d2ww.lrazzd5p.kk32p0x1.j83agx80.oo9gr5id'
    const timeSelector = '.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.lr9zc1uh.a8c37x1j.keod5gw0.nxhoafnm.aigsh9s9.fe6kdd0r.mau55g9w.c8b282yb.d3f4x2em.iv3no6db.jq4qci2q.a3bd9o3v.hnhda86s.hzawbc8m'
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

    const dayElement = document.querySelector(daySelector)

    if (! dayElement) {
        alert('Mauvais selector pour le jour de la date')
        return
    }
    
    const timeElement = document.querySelector(timeSelector)

    if (! timeElement) {
        alert('Mauvais selector pour la date et l\'heure')
        return
    }

    const dayString = dayElement.innerText
    const timeString = timeElement.innerText

    const convertToDate = (dayString, timeString) => {
        const time = new Date()
        time.setDate(dayString)
        
        const splitTimeString = timeString.split(' ')

        let foundMonth = false
        let foundYear = false
        let foundTime = false

        for (const timeStringPartIndex in splitTimeString) {
            /** @type {string} */
            const timeStringPart = splitTimeString[timeStringPartIndex]

            if (! foundTime && timeStringPart.length === 5 && timeStringPart[2] === ':') {
                const [hours, minutes] = timeStringPart.split(':')
                time.setHours(parseInt(hours))
                time.setMinutes(parseInt(minutes))
                foundTime = true
                continue
            }

            if (! foundYear && timeStringPart.length === 4 && parseInt(timeStringPart) !== NaN) {
                time.setFullYear(parseInt(timeStringPart))
                foundYear = true
                continue
            }

            if (! foundMonth) {
                if (timeStringPart.includes('JAN')) {
                    time.setMonth(0)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('FÉV')) {
                    time.setMonth(1)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('MAR') && ! timeStringPart.includes('MARDI')) {
                    time.setMonth(2)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('AVR')) {
                    time.setMonth(3)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('MAI') && ! timeStringPart.includes('DEMAIN')) {
                    time.setMonth(4)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('JUIN')) {
                    time.setMonth(5)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('JUIL')) {
                    time.setMonth(6)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('AO')) {
                    time.setMonth(7)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('SEP')) {
                    time.setMonth(8)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('OCT')) {
                    time.setMonth(9)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('NOV')) {
                    time.setMonth(10)
                    foundMonth = true
                    continue
                }

                if (timeStringPart.includes('DÉC')) {
                    time.setMonth(11)
                    foundMonth = true
                    continue
                }
            }

            if (foundMonth && foundYear && foundTime) {
                break
            }
        }
        
        if (! foundMonth && new Date().getDate() > time.getDate()) {
            time.setMonth((time.getMonth() + 1) % 12)
        }

        return time
    }

    const time = convertToDate(dayString, timeString)

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
