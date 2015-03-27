# BTR - browser task runner

[![Code Climate](https://codeclimate.com/github/bastsoft/btr.png)](https://codeclimate.com/github/bastsoft/btr)

## Installation

```js
javascript:(function(){var el = document.createElement('script');
    el.onload = function () { btr.loadGist({ id: 'GIST_ID', file: 'GIST_FILE' });};
document.head.appendChild(el).src = 'https://cdn.rawgit.com/bastsoft/btr/v0.0.2/btr-min.js';})();
```

## See tasks example:

[https://gist.github.com/bastsoft/5ec0eb5d78fbcb6715c3](https://gist.github.com/bastsoft/5ec0eb5d78fbcb6715c3)

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
