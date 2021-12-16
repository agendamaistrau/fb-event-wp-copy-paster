(function() {

    const eventTitleSelector = '.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.pby63qed'

    const titleElement = document.querySelector(eventTitleSelector)

    if (! titleElement) {
        alert('Mauvais selector pour le titre')
        return
    }

    const title = titleElement.innerText

    browser.runtime.sendMessage(
        undefined,
        {title}
    ).then(response => {
        // nothing
    }).catch(alert)
})()
