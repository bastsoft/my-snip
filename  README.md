# BTR - browser task runner


## Simplest example

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function (){
        btr.contextMenu('body', {
            'test run' : alert.bind(null, 'hello world')
        });
    };
document.head.appendChild(el).src = 'https://cdn.rawgit.com/bastsoft/btr/v0.2.0/btr.js';})();
```