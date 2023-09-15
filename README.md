# snip for snippet 

## Simplest example

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function (){
        snip.snip({ id: "7c314e6ce97b044a8305f0daa3ffe0f0", file: "snippets.js" });
    };
document.head.appendChild(el).src = 'https://cdn.jsdelivr.net/gh/bastsoft/snip@2.1.0/dist/snip.js';})();
```

## load gist

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function (){
        snip({ 
        id: "cc6e130cf3eb380c31d0b732d95cb6b0", 
        file: "main.js",
        env: {'beryberu-anketa':'/Users/petr/project/zaymigo/beryberu/beryberu-anketa/'}
        });
    };
document.head.appendChild(el).src = 'https://cdn.jsdelivr.net/gh/bastsoft/snip@2.1.0/dist/snip.js';
})();

````

## for local snippets

```js
javascript:(function(){
    var el = document.createElement('script');    
    el.onload = function (){
        snip({
            url: window.location.origin  + "/snippets.js?" + Math.random(),
            env:{TOKEN: "5486132971:AAFF_Od5lUA2RZEHgARsGLnyoCP7y-dmtBY"}
        });  
    };
document.head.appendChild(el).src = "https://cdn.jsdelivr.net/gh/bastsoft/snip@2.1.0/dist/snip.js";
})();
```
