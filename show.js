function loadHandian(url) {
	// init panel
	closeHandian();
	var panel = initPanel();
	
	// remove previous handian
	var content = document.getElementById('handian-content');
	if (content) {
		panel.removeChild(content);
	}

	// load handian
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () { 
		if (xhr.readyState == 4 && xhr.status == 200) {
			var loading = document.getElementById('handian-loading');
			if (loading) {
				panel.removeChild(loading);
			}
			
			// url based on handian
			var cnt = xhr.responseText.replace(/"\/images\//g, 
					'"http:\/\/www.zdic.net\/images\/');
			cnt = cnt.replace(/"\/p\//g, '"http:\/\/www.zdic.net\/p\/');
			cnt = cnt.replace(/"\/css\//g, '"http:\/\/www.zdic.net\/css\/');
			cnt = cnt.replace(/"\/js\//g, '"http:\/\/www.zdic.net\/js\/');
			
			var content = document.createElement('div');
			content.innerHTML = cnt;
			content.id = 'handian_content';
			
			panel.appendChild(content);
		}
	}
	xhr.open("GET", url, true);
	xhr.setRequestHeader('Content-type', 'text/html');
	xhr.send();
}

function closeHandian() {
	var panel = document.getElementById('handian');
	if (panel) {
		document.body.removeChild(panel);
	}
}

function initPanel() {
	var panel = document.createElement('div');
	panel.id = 'handian';
	panel.style['width'] = '400px';
	panel.style['position'] = 'fixed';
	panel.style['left'] = '0'; 
	panel.style['top'] = '0';
	panel.style['background-color'] = '#ffe';
	panel.style['max-height'] = '100%';
	panel.style['z-index'] = '1000';
	panel.style['text-align'] = 'left';
	panel.style['padding'] = '20px';
	panel.style['overflow'] = 'auto';
	
	var loading = document.createElement('p');
	loading.innerHTML = '查询中，请稍候……';
	loading.id = 'handian-loading';
	panel.appendChild(loading);
	
	// disable handwriting
	var zui = document.createElement('style');
	zui.type = 'text/css';
	zui.innerHTML = '.zui { display: none; }';
	panel.appendChild(zui);
	
	document.body.appendChild(panel);
	return panel;
}

document.addEventListener('mouseup', function(event) {
	chrome.storage.sync.get('enabled', function(result) {
		if (result.enabled) {
			var sel = window.getSelection().toString();
			var reg = /[^\u0000-\u00FF]/;
			if (sel && reg.test(sel)) {
				loadHandian('http://www.zdic.net/search/?c=3&q=' + sel);
			} else {
				closeHandian();
			}
		} else {
			closeHandian();
		}
	});
    
});
