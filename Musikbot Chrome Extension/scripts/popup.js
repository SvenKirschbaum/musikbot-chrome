window.onload = function() {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		var activeTab = tabs[0];
		submitURL(activeTab.url);
	});
}
function submitURL(url) {
	chrome.storage.sync.get(['authtoken'],function(result) {
		$.ajax(
		{
			url : "https://musikbot.elite12.de/api/songs",
			data : url,
			method : "POST",
			headers : {
				"Authorization" : "Bearer " + result.authtoken
			},
			contentType : false
		}).done(function(data, textStatus, jqXHR) {
			handleResponse(data, textStatus, jqXHR);
		}).fail(function(data, textStatus, jqXHR) {
			handleResponse(data, textStatus, jqXHR);
		});
	});
	
}

function handleResponse(data, textStatus, jqXHR){
	if(typeof jqXHR != "object") {jqXHR = data}
	var message = jqXHR.responseText;
	var type;
	if(jqXHR.status >= 200 && jqXHR.status <300) {
		type = "msg_success";
	}
	else if(jqXHR.status >= 400 && jqXHR.status <600) {
		type = "msg_error";
	}
	else {
		type = "msg_notify";
	}
	
	if(message) {
		$("#loading").fadeOut(300,function() {
			$("body").append("<div style=\"display:none\" class=\"message "+type+"\">"+message+"</div>");
			$(".message").fadeIn(300);
		});
	}
}