window.onload = function() {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		var activeTab = tabs[0];
		submitURL(activeTab.url);
	});
};
function submitURL(url) {
	chrome.storage.sync.get(['authtoken'],function(result) {
		let headers = new Headers();
		headers.append("Content-Type", "text/plain");
		if (result.authtoken) headers.append("Authorization", "Bearer " + result.authtoken);
		fetch("https://musikbot.elite12.de/api/v2/songs", {
			method: 'POST',
			body: url,
			headers: headers
		})
		.then((res) => {
			if(!res.ok) throw new Error(res.status === 401 ? "Auth Token ungültig" : res.statusText);
			return res;
		})
		.then((res) => res.json())
		.then((res) => {
			handleResponse(res)
		})
		.catch(reason => {
			handleResponse(null,reason)
		});
	});
	
}

function handleResponse(response,error){
	let type;
	let message;
	if(response) {
		if(!response.success) type = "msg_error";
		else if(response.warn) type = "msg_notify";
		else type = "msg_success";
		message = response.message;
	}
	else {
		type = "msg_error";
		message = error;
	}

	$("#loading").fadeOut(300,function() {
		$("body").append("<div style=\"display:none\" class=\"message "+type+"\">"+message+"</div>");
		$(".message").fadeIn(300);
	});
}