!function t(e,n,o){function i(c,u){if(!n[c]){if(!e[c]){var l="function"==typeof require&&require;if(!u&&l)return l(c,!0);if(r)return r(c,!0);var a=new Error("Cannot find module '"+c+"'");throw a.code="MODULE_NOT_FOUND",a}var s=n[c]={exports:{}};e[c][0].call(s.exports,function(t){var n=e[c][1][t];return i(n?n:t)},s,s.exports,t,e,n,o)}return n[c].exports}for(var r="function"==typeof require&&require,c=0;c<o.length;c++)i(o[c]);return i}({1:[function(t){window.btr={};var e=t("./module/utils.js"),n=t("./module/config.js"),o=t("./module/load.js"),i=t("./module/gist.js"),r=t("./module/contextMenu.js"),c=t("./module/relay.js"),u=t("./module/tumbler.js");e.extend(window.btr,o),e.extend(window.btr,i),e.extend(window.btr,r),e.extend(window.btr,c),e.extend(window.btr,u),window.btr.save=function(){e.saveToJsonFile(btr.config.gists,"save.json")},window.btr.newConfig=n},{"./module/config.js":2,"./module/contextMenu.js":3,"./module/gist.js":5,"./module/load.js":6,"./module/relay.js":7,"./module/tumbler.js":8,"./module/utils.js":9}],2:[function(t,e){var n=t("./utils.js");window.btr.config={gistUrl:"https://gist.github.com/"},e.exports=function(t){return n.extend(window.btr.config,t||[]),window.btr.config}},{"./utils.js":9}],3:[function(t,e){function n(t,e){var n=o(e),i=c.uniqId(),r=document.querySelectorAll(t);n.setAttribute("type","context"),n.setAttribute("id",i),r.forEach(function(t){t.setAttribute("contextmenu",i),document.body.appendChild(n)}),u()}function o(t){var e=document.createElement("menu");return Object.keys(t).forEach(function(n){var o=t[n].constructor===Object?i:r;e.appendChild(o(n,t[n]))}),e}function i(t,e){var n=o(e);return n.setAttribute("label",t),n}function r(t,e){var n=document.createElement("menuitem");return n.setAttribute("label",t),n.addEventListener("click",e,!1),n}var c=t("./utils.js"),u=t("./contextMenuPolyfill.js"),l=function(t,e){"object"==typeof t?t.forEach(function(t){n(t,e)}):n(t,e)};e.exports={contextMenu:l}},{"./contextMenuPolyfill.js":4,"./utils.js":9}],4:[function(t,e){function n(t,e){var n=Number(t.style.width.replace("px",""));e=9*e+35,t.style.width=(e>n?e:n)+"px"}function o(t){var e=t.getAttribute("id"),n=document.querySelectorAll("[contextmenu="+e+"]");n.forEach(function(t){t.setAttribute("oncontextmenu","return btr.onContextMenuClick(event, "+e+")")}),document.addEventListener("click",function(){t.style.display="none"})}var i=t("./utils.js");NodeList.prototype.forEach=Array.prototype.forEach,HTMLElement.prototype.wrap=function(t){t.length||(t=[t]);for(var e=t.length-1;e>=0;e-=1){var n=e>0?this.cloneNode(!0):this,o=t[e],i=o.parentNode,r=o.nextSibling;n.appendChild(o),r?i.insertBefore(n,r):i.appendChild(n)}};var r=function(){document.getElementsByTagName("head")[0].appendChild(document.createElement("style")).innerHTML='     menu {        z-index: 2147483000;        position:absolute;        display: none;        background-color: #eee;        margin:0;        padding: .5em 0;        font-family: monospace;        font-size: 14px;    }    menu div{        height:1em    }    menuitem:hover{        background-color: #39f;        cursor: pointer;    }    menu div:hover>menuitem{        background-color: #39f;    }    menu>div>menuitem:before {        content: ">";        position: relative;        right: -90%;    }    menu div:hover>menu{        display: block;        position: relative;        top: -1.5em;        right: -100%;    }    menuitem{        display: block;        padding: 0 .5em    }        ',document.querySelectorAll('menu[type="context"]').forEach(function(t){o(t),t.querySelectorAll("menuitem").forEach(function(t){var e=t.getAttribute("label");n(t.parentElement,e.length),t.innerHTML=e}),t.querySelectorAll("menu").forEach(function(t){var e=document.createElement("menuitem"),o=document.createElement("div"),i=t.getAttribute("label");n(t.parentElement,i.length),o.appendChild(e).innerHTML=i,o.wrap(t)})})};btr.onContextMenuClick=function(t,e){return e&&e.style&&(e.style.left=t.clientX+window.pageXOffset+"px",e.style.top=t.clientY+window.pageYOffset+"px",e.style.display="block"),t.stopPropagation(),!1},e.exports=i.debounce(100,function(){/Firefox/.test(window.navigator.userAgent)||r()})},{"./utils.js":9}],5:[function(t,e){function n(t,e){-1!==a.gistUrl.indexOf("api")?d._loadGistFromAPI(t,e):d._loadGistFromJSONP(t,e)}function o(t){var e=null;return i(function(n,o){o===t&&(e=n[o])}),e}function i(t){var e=a.gists;Object.keys(e||{}).forEach(function(n){Object.keys(e[n]||{}).forEach(function(o){t(e[n],o)})})}function r(t,e){a.gists||(a.gists={}),a.gists[a.gistUrl]||(a.gists[a.gistUrl]={}),a.gists[a.gistUrl][t]||(a.gists[a.gistUrl][t]=e)}function c(t){var e=t.split('<div class="gist-file">').slice(1),n={},o=document.createElement("div"),i=function(t){return o.innerHTML=(t||"").replace(/<\/div>/g,"</div>\n"),o.textContent.replace(/\n\n/g,"")};return e.forEach(function(t){var e=t.split('<div class="gist-meta">'),o=i(e[1].split("</a>")[1]+"</a>").replace(/[\n  ]/g,"");n[o]={content:i(e[0].split('<td class="line-data">')[1])}}),n}var u=t("./load.js"),l=t("./config.js"),a=l(),s=function(t){var e=null;return i(function(n,o){n[o][t]&&(e=new Function("",n[o][t].content))}),e},d=function(t,e){var n=t.file;t.url&&l({gistUrl:t.url}),n&&(e=function(){s(n)()}),t.id&&(t=t.id),d._loadGistFromId(t,e)};d._loadGistFromId=function(t,e){o(t)?e():n(t,e)},d._loadGistFromJSONP=function(t,e){u.loadJsonP(a.gistUrl+t+".json",function(n){var o=c(n.div);r(t,o),e()})},d._loadGistFromAPI=function(){},e.exports={loadGist:d,functionGist:s}},{"./config.js":2,"./load.js":6}],6:[function(t,e){function n(t,e){t.reverse(),t.forEach(function(t){var n="object"==typeof t?o:i;e=n.bind(this,t,e)},this),e()}function o(t,e){(t[0]?e:i.bind(this,t[1],e))()}function i(t,e){var n=-1===t.indexOf(".css")?r.bind(this,t):c.bind(this,t),o=n(function(){e&&e(),o.parentNode.removeChild(o)});document.getElementsByTagName("head")[0].appendChild(o)}function r(t,e){var n=document.createElement("script");return n.type="text/javascript",n.src=t,e&&(n.onreadystatechange=e,n.onload=e),n}function c(t,e){var n=document.createElement("link");return n.rel="stylesheet",n.type="text/css",n.href=t,e(),n}var u=t("./utils.js"),l=function(t,e){return"object"!=typeof t?i.bind(this,t,e):void n(t,e)},a=function(t,e){var n=u.uniqId();window["fun"+n]=function(t){e(t),delete window["fun"+n]},l([t+"?callback=fun"+n])};e.exports={load:l,loadJsonP:a}},{"./utils.js":9}],7:[function(t,e){function n(t){var e="",n={};return Object.keys(t).forEach(function(i){"object"==typeof t[i]?(t[i]=o(i,t[i]),n[(localStorage[i]?"☑ ":"☐ ")+i]=t[i]):n[i]=t[i],e+='localStorage.removeItem("'+i+'"); '}),n["by default"]=new Function("",e),n}function o(t,e){var n={};return localStorage[t]&&e[localStorage[t]](),Object.keys(e).forEach(function(o){var i=localStorage[t]===o?"☑ ":"☐ ";n[i+o]=function(){e[o](),localStorage[t]=o}}),n["by default"]=function(){localStorage.removeItem(t)},n}var i=function(t,e){var i={};return t&&!e&&(e=t,t=void 0),i=t?o(t,e):n(e)};e.exports={relay:i}},{}],8:[function(t,e){var n=function(t){var e={};return Object.keys(t).forEach(function(n){var o=localStorage[n]?"☑ ":"☐ ";e[o+n]=function(){localStorage[n]=localStorage[n]?"":"yes",localStorage[n]&&t[n]()},localStorage[n]&&t[n]()}),e["on all"]=function(){Object.keys(t).forEach(function(e){localStorage[e]="yes",t[e]()})},e["off all"]=function(){Object.keys(t).forEach(function(t){localStorage[t]=""})},e};e.exports={tumbler:n}},{}],9:[function(t,e){var n=function(){return String.fromCharCode(65+Math.floor(26*Math.random()))+Date.now()},o=function(t,e){var n=new Blob([JSON.stringify(t,void 0,4)],{type:"text/json"}),o=document.createEvent("MouseEvents"),i=document.createElement("a");i.download=e,i.href=window.URL.createObjectURL(n),i.dataset.downloadurl=["text/json",i.download,i.href].join(":"),o.initEvent("click",!0,!0),i.dispatchEvent(o)},i=function(t,e){Object.keys(e).forEach(function(n){t[n]=e[n]})},r=function(t,e){var n=null;return function(){n&&clearTimeout(n),n=setTimeout(e,t)}};e.exports={uniqId:n,saveToJsonFile:o,extend:i,debounce:r}},{}]},{},[1]);