let keycloak = new Keycloak({
    url: 'https://id.elite12.de',
    realm: 'elite12',
    clientId: 'musikbot-chrome'
});
let promises = [];

keycloak.init({
    checkLoginIframe: false,
    enableLogging: true
});

function getToken() {
    return new Promise(function (resolve, reject) {
        if (keycloak === undefined || !keycloak.authenticated) {
            promises.push({
                resolve,
                reject
            });
            chrome.windows.create({
                focused: true,
                type: "popup",
                url: "ui/login.html"
            })
        } else {
            keycloak.updateToken(5).then(value => resolve(keycloak.token));
        }
    })
}

function setKeycloak(t) {
    keycloak = t;
    promises.forEach(value => {
        value.resolve(keycloak.token);
    })
    promises = [];
}

function getKeycloak(t) {
    return keycloak;
}


// Clicking on the button will give the extension access to the current tab,
// so the icon will not be disabled after the condition below no longer
// applies.
// Therefore we have to switch to a more powerful approach to manage the
// extension state
chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
                urlMatches: '^(http(s)??\\:\\/\\/)?(www\\.)?((youtube\\.com\\/watch\\?v=)|(youtu.be\\/))([a-zA-Z0-9\\-_])+'
            }
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (typeof (changeInfo.url) !== 'undefined') {
        chrome.pageAction.hide(tabId, function () {
        });
    }
});