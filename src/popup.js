var gb = {
	enabled: true
};

function enableToggle() {
	gb.enabled = !gb.enabled;

	chrome.storage.sync.set({
		'enabled': gb.enabled
	}, function() {});

	updateHtml();
}

function updateHtml() {
	document.getElementById('enableBtn').className = gb.enabled ?
			'enabled' : 'disabled';
	document.getElementById('enableVal').innerHTML = gb.enabled ? '已' : '未';

	chrome.browserAction.setIcon({
		path: 'handian48' + (gb.enabled ? '' : '-disabled') + '.png'
	});
}

window.onload = function() {
	var check = document.getElementById('enableBtn');
	check.addEventListener('click', enableToggle, false);

	chrome.storage.sync.get('enabled', function(result) {
		gb.enabled = result.enabled;
		updateHtml();
	});
}
