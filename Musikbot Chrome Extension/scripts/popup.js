window.onload = function() {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		var activeTab = tabs[0];
		chrome.identity.launchWebAuthFlow(
			{
				'url': 'https://id.elite12.de/auth/realms/elite12/protocol/openid-connect/auth?client_id=musikbot-chrome&redirect_uri=https://ndlcpjfpedfkcnhgibfahapkfajedklf.chromiumapp.org/elite12&response_type=token&scope=profile',
				'interactive': true
			},
			function (redirect_url) {
				if (redirect_url) {
					var parsed = parse(redirect_url.substr(chrome.identity.getRedirectURL("oauth2").length + 1));
					token = parsed.access_token;
					submitURL(activeTab.url, token);
				}
			}
		);
	});
};

function submitURL(url, token) {

	let headers = new Headers();
	headers.append("Content-Type", "text/plain");
	headers.append("Authorization", "Bearer " + token);
	fetch("https://musikbot.elite12.de/api/v2/songs", {
		method: 'POST',
		body: url,
		headers: headers
	})
		.then((res) => {
			if (!res.ok) throw new Error(res.status === 401 ? "Auth Token ungültig" : res.statusText);
			return res;
		})
		.then((res) => res.json())
		.then((res) => {
			handleResponse(res)
		})
		.catch(reason => {
			handleResponse(null, reason)
		});

}

function handleResponse(response,error){
	let type;
	let message;
	if (response) {
		if (!response.success) type = "msg_error";
		else if (response.warn) type = "msg_notify";
		else type = "msg_success";
		message = response.message;
	} else {
		type = "msg_error";
		message = error;
	}

	$("#loading").fadeOut(300, function () {
		$("body").append("<div style=\"display:none\" class=\"message " + type + "\">" + message + "</div>");
		$(".message").fadeIn(300);
	});
}

function parse(str) {
	if (typeof str !== 'string') {
		return {};
	}
	str = str.trim().replace(/^(\?|#|&)/, '');
	if (!str) {
		return {};
	}
	return str.split('&').reduce(function (ret, param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;
		key = decodeURIComponent(key);
		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);
		if (!ret.hasOwnProperty(key)) {
			ret[key] = val;
		} else if (Array.isArray(ret[key])) {
			ret[key].push(val);
		} else {
			ret[key] = [ret[key], val];
		}
		return ret;
	}, {});
}