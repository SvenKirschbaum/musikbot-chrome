$( document ).ready(function() {
	chrome.storage.sync.get(['authtoken'],function(result) {
		$("#apitoken").val(result.authtoken);
	});
	$("#apitoken").change(function () {
		chrome.storage.sync.set({authtoken: $("#apitoken").val()}, function() {
	    	
	    });
	})
});