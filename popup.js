function enableToggle() {
	chrome.storage.sync.set({
		'enabled': document.getElementById('enableBtn').checked
	}, function() {});
}

window.onload = function() {
	var check = document.getElementById('enableBtn');
	chrome.storage.sync.get('enabled', function(result) {
		check.checked = result.enabled;
	});
	
	check.addEventListener('click', enableToggle, false);
}
