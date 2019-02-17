const regex = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.get(['authtoken'],function(result) {
		if(typeof result.authtoken === 'undefined') {
			chrome.storage.sync.set({
				authtoken : ""
			}, function() {

			});
		}
	});
	
});

//Clicking on the button will give the extension access to the current tab,
// so the icon will not be disabled after the condition below no longer
// applies.
// Therefore we have to switch to a more powerful approach to manage the
// extension state
/*
 * chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
 * chrome.declarativeContent.onPageChanged.addRules([ { conditions : [ new
 * chrome.declarativeContent.PageStateMatcher({ pageUrl : { urlMatches:
 * '^(http(s)??\\:\\/\\/)?(www\\.)?((youtube\\.com\\/watch\\?v=)|(youtu.be\\/))([a-zA-Z0-9\\-_])+' } }) ],
 * actions : [ new chrome.declarativeContent.ShowPageAction() ] } ]); });
 */

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if(typeof(changeInfo.url) !== 'undefined') {
		if (regex.test(changeInfo.url)) {
			chrome.pageAction.show(tabId, function() {
			});
		} else {
			chrome.pageAction.hide(tabId, function() {
			});
		}
	}
});