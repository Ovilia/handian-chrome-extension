var gb = {
    searchTxt: null,
    enabled: false
};

function loadHandian() {
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
    content.src = 'http://www.zdic.net/search/?c=3&q=' + gb.searchTxt;
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
    
    var button = document.getElementById('handian-btn');
    if (button) {
        button.style['display'] = 'none';
    }
}

function initPanel() {
    var panel = document.createElement('div');
    panel.id = 'handian';
    panel.style['width'] = '400px';
    panel.style['position'] = 'fixed';
    panel.style['left'] = '0'; 
    panel.style['top'] = '0';
    panel.style['background-color'] = '#EEF3F0';
    panel.style['max-height'] = '100%';
    panel.style['z-index'] = '2147483647';
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
    if (event.target === document.getElementById('handian-btn')) {
        loadHandian();
        return;
    }
    chrome.storage.sync.get('enabled', function(result) {
        gb.enabled = result.enabled;
        if (result.enabled) {
            var sel = window.getSelection();
            var pos = sel.getRangeAt(0).getBoundingClientRect();
    
            // add button
            var button = document.getElementById('handian-btn');
            if (!button) {
                button = document.createElement('img');
                button.id = 'handian-btn';
                button.src = 'https://raw.githubusercontent.com/Ovilia/handian-chrome-extension/master/res/handian32.png';
                button.style['position'] = 'absolute';
                button.style['cursor'] = 'pointer';
                button.style['z-index'] = '1000';
                
                document.body.appendChild(button);
            } else {
                button.style['display'] = 'block';
            }
            button.style['left'] = pos.left + window.pageXOffset + 'px';
            button.style['top'] = pos.bottom + window.pageYOffset + 10 + 'px';
            
            var reg = /[^\u0000-\u00FF]/;
            var selText = sel.toString();
            if (selText && reg.test(selText)) {
                var utf = new GB2312UTF8();
                gb.searchTxt = utf.Gb2312ToUtf8(selText);
            } else {
                closeHandian();
            }
        } else {
            closeHandian();
        }
    });
});

/* Convert Gb2312 To Utf8
/* code from http://blog.sina.com.cn/s/blog_8ba818a50100wabh.html */
function GB2312UTF8(){
    this.Dig2Dec=function(s){
        var retV = 0;
        if(s.length == 4){
            for(var i = 0; i < 4; i ++){
                retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
            }
            return retV;
        }
        return -1;
    }
    this.Hex2Utf8=function(s){
        var retS = "";
        var tempS = "";
        var ss = "";
        if(s.length == 16){
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" +  s.substring(4, 10);
            tempS += "10" + s.substring(10,16);
            var sss = "0123456789ABCDEF";
            for(var i = 0; i < 3; i ++){
                retS += "%";
                ss = tempS.substring(i * 8, (eval(i)+1)*8);
                retS += sss.charAt(this.Dig2Dec(ss.substring(0,4)));
                retS += sss.charAt(this.Dig2Dec(ss.substring(4,8)));
            }
            return retS;
        }
        return "";
    }
    this.Dec2Dig=function(n1){
        var s = "";
        var n2 = 0;
        for(var i = 0; i < 4; i++){
            n2 = Math.pow(2,3 - i);
            if(n1 >= n2){
                s += '1';
                n1 = n1 - n2;
            }
            else
                s += '0';
        }
        return s;     
    }
    this.Str2Hex=function(s){
        var c = "";
        var n;
        var ss = "0123456789ABCDEF";
        var digS = "";
        for(var i = 0; i < s.length; i ++){
            c = s.charAt(i);
            n = ss.indexOf(c);
            digS += this.Dec2Dig(eval(n));
        }
        return digS;
    }
    this.Gb2312ToUtf8=function(s1){
        var s = escape(s1);
        var sa = s.split("%");
        var retV ="";
        if(sa[0] != ""){
            retV = sa[0];
        }
        for(var i = 1; i < sa.length; i ++){
            if(sa[i].substring(0,1) == "u"){
                retV += this.Hex2Utf8(this.Str2Hex(sa[i].substring(1,5)));
                if(sa[i].length){
                    retV += sa[i].substring(5);
                }
            } else {
                retV += unescape("%" + sa[i]);
                if(sa[i].length){
                    retV += sa[i].substring(5);
                }
            }
        }
        return retV;
    }
    this.Utf8ToGb2312=function(str1){
        var substr = "";
        var a = "";
        var b = "";
        var c = "";
        var i = -1;
        i = str1.indexOf("%");
        if(i==-1){
            return str1;
        }
        while(i!= -1){
            if(i<3){
                substr = substr + str1.substr(0,i-1);
                str1 = str1.substr(i+1,str1.length-i);
                a = str1.substr(0,2);
                str1 = str1.substr(2,str1.length - 2);
                if(parseInt("0x" + a) & 0x80 == 0){
                substr = substr + String.fromCharCode(parseInt("0x" + a));
                } else if(parseInt("0x" + a) & 0xE0 == 0xC0){ //two byte
                    b = str1.substr(1,2);
                    str1 = str1.substr(3,str1.length - 3);
                    var widechar = (parseInt("0x" + a) & 0x1F) << 6;
                    widechar = widechar | (parseInt("0x" + b) & 0x3F);
                    substr = substr + String.fromCharCode(widechar);
                } else {
                    b = str1.substr(1,2);
                    str1 = str1.substr(3,str1.length - 3);
                    c = str1.substr(1,2);
                    str1 = str1.substr(3,str1.length - 3);
                    var widechar = (parseInt("0x" + a) & 0x0F) << 12;
                    widechar = widechar | ((parseInt("0x" + b) & 0x3F) << 6);
                    widechar = widechar | (parseInt("0x" + c) & 0x3F);
                    substr = substr + String.fromCharCode(widechar);
                }
            } else {
                substr = substr + str1.substring(0,i);
                str1= str1.substring(i);
            }
            i = str1.indexOf("%");
        }
        return substr+str1;
    }
}
