# snip for snippet 

## Simplest example

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function (){
        snip.loadGist({ id: "7c314e6ce97b044a8305f0daa3ffe0f0", file: "snippets.js" });
    };
document.head.appendChild(el).src = 'https://cdn.jsdelivr.net/gh/bastsoft/snip@1.1.7/dist/snip.js';})();
```

## for local snippets

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function (){
        snip.load(window.location.origin  + "/snippets.js?" + Math.random())
    };
document.head.appendChild(el).src = 'https://cdn.jsdelivr.net/gh/bastsoft/snip@1.1.7/dist/snip.js';})();
```
