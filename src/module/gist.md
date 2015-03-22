```js
btr.newConfig({
    gistUrl: 'https://github.yandex-team.ru/gist/'
});

btr.loadGist('a10f513b9618ca7d1f0e', function () {
    btr.functionGist('testSnippet')();
});
```
