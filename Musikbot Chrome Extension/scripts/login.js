const keycloak = new Keycloak({
    url: 'https://id.elite12.de',
    realm: 'elite12',
    clientId: 'musikbot-chrome'
});

keycloak.onReady = () => {
    chrome.extension.getBackgroundPage().setKeycloak(keycloak);
    chrome.tabs.getCurrent((currentTab) => {
        chrome.tabs.remove([currentTab.id]);
    });
}


keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    enableLogging: true
});
