function loadHandian(url) {
	// init panel
	closeHandian();
	var panel = initPanel();
	
	// remove previous handian
	var previousContent = document.getElementById('handian-content');
	if (previousContent) {
		panel.removeChild(previousContent);
	}
  
    // add new content
	var content = document.createElement('iframe');
	content.frameBorder = '0';
	content.src = url;
	content.id = 'handian_content';	
	content.style['display'] = 'none';
	content.style['width'] = '100%';
	content.style['height'] = (window.innerHeight - 40) + 'px';
	content.addEventListener('load', function() {
	var loading = document.getElementById('handian-loading');
	if (loading) {
		panel.removeChild(loading);
	}
	content.style.removeProperty('display');
	});  
	panel.appendChild(content);
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
