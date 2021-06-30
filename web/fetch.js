export function fetchscript(url, callback) {
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = url;

    if (callback) {
        script.onreadystatechange = callback;
        script.onload = callback;
    }

    return script;
}

export function fetchjsonp(url) {
    return new Promise(function(resolve, reject) {
        try{
            const id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + (+(new Date));
            const addSymbol = url.indexOf("?") !== -1 ? "&" : "?";
            const handler = fetchscript.bind(this, url + addSymbol + 'callback=fun' + id);
            const elem = handler(function () {
                if (elem.readyState && elem.readyState !== "complete" && elem.readyState !== "loaded") {
                    return false;
                }

                elem.parentNode.removeChild(elem);
            });
        
            window['fun' + id] = function (data) {
                resolve(data);
                window['fun' + id] = null;
            };

            document.getElementsByTagName('head')[0].appendChild(elem);
        }catch(e){
            reject(e);
        }
    });
}