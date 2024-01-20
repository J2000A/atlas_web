/****************************************
 * i18n.js                              *
 * Script file for internationalization *
 * Author: Héctor Ochoa Ortiz           *
 * Affil.: TUM SVP                      *
 * Last update: 2023-04-27              *
 ****************************************/

function translatePage() {
    // Don't translate if i18n hasn't finished initializing
    if (!i18next.isInitialized) return;

    // Translate each element with a i18n attribute
    document
        .querySelectorAll("[i18n]")
        .forEach(translateElement);
}

function translateString(string) {
    return i18next.t(string);
}

function translateElement(element) {
    const key = element.getAttribute("i18n");
    switch (element.tagName) {
        case "OPTGROUP": // Inside selects
            element.setAttribute("label", translateString(key));
            break;
        case "text": // Inside SVGs
            element.textContent = translateString(key);
            break;
        default:
            element.innerText = translateString(key);
            break;
    }
}

function bindLocaleSwitcher(initialValue) {
    const switcher =
        document.querySelector("[data-i18n-switcher]");
    switcher.value = initialValue;
    switcher.onchange = (e) => {
        // Set the locale to the selected option[value]
        i18next.changeLanguage(e.target.value);
        document.documentElement.setAttribute("lang", e.target.value); 
    };
}

// i18n set up
i18next
    .use(i18nextHttpBackend)
    .use(i18nextBrowserLanguageDetector)
    .init({
        supportedLngs: ["en", "de", "es"],
        fallbackLng: ["en"],
        debug: true,
        backend: {
            loadPath: 'i18n/{{lng}}.json'
        }
    }, function(err, t) {translatePage(); 
        bindLocaleSwitcher(i18next.language);});

// When i18n initialization is finished or the language is changed, translate the page to reflect the changes
i18next.on('languageChanged initialized', () => {
    if (!i18next.isInitialized) return;
    translatePage();
});
