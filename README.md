# BTR - browser task runner

[![Code Climate](https://codeclimate.com/github/bastsoft/btr.png)](https://codeclimate.com/github/bastsoft/btr)

## Simplest example

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function (){
        btr.contextMenu('body', {
            'test run' : alert.bind(null, 'hello world')
        });
    };
document.head.appendChild(el).src = 'https://cdn.rawgit.com/bastsoft/btr/v0.1.0/btr.js';})();
```

## Template download gist (including for IE)

```js
javascript:(function(){
    var el = document.createElement('script');
    el.onload = el.onreadystatechange = function () {
        if (el.readyState && el.readyState !== "complete" && el.readyState !== "loaded") {
            return false;
        }
        btr.loadGist({ id: 'GIST_ID', file: 'GIST_FILE' });
    };
    document.getElementsByTagName('head')[0].appendChild(el).src = 'https://cdn.rawgit.com/bastsoft/btr/v0.1.0/btr.js';
})();
```

## See tasks example:

[https://gist.github.com/bastsoft/5ec0eb5d78fbcb6715c3](https://gist.github.com/bastsoft/5ec0eb5d78fbcb6715c3)

## Example gist

```js
javascript:(function(){
    var el = document.createElement('script');
    el.onload = el.onreadystatechange = function () {
        if (el.readyState && el.readyState !== "complete" && el.readyState !== "loaded") {
            return false;
        }
        btr.loadGist({ id: '11e76234c80c3ea46702', file: 'main.js' });
    };
    document.getElementsByTagName('head')[0].appendChild(el).src = 'https://cdn.rawgit.com/bastsoft/btr/v0.1.0/btr.js';
})();
```

##contextMenu

example:
```js
btr.contextMenu('querySelector', {
    item : function(){
        //something
    }
});
})
```

### relay (Batch processing tasks)

Save one state per key

example:

```js
state: btr.relay({
    key1: {
        variant1: someThingFunction,
        variant2: someThingFunction2
    },
    key2: {
        variant1: someThingFunction,
        variant2: someThingFunction2
    }
})
```
### tumbler (Batch processing tasks)
multiple key

example:
```js
  name: btr.tumbler({
    key1: someThingFunction,
    key2: someThingFunction
  })
```
