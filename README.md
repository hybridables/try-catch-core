<p align="center">
  <a href="https://github.com/hybridables">
    <img height="250" width="250" src="https://avatars1.githubusercontent.com/u/10666022?v=3&s=250">
  </a>
</p>

# [try-catch-core][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url] 

> Asynchronous and sync tryCatch in one place. The callback is securely wrapped with a [dezalgo][] and [once][].

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

## Install
```
npm i try-catch-core --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const tryCatchCore = require('try-catch-core')
```

### [tryCatchCore](index.js#L79)
> Executes given `fn` and pass results/errors to the `callback` if given, otherwise returns a thunk.

**Why this can be useful?**
 __1)__ Because this can be used to handle completion
and errors of anything like Observable, Promises,
Streams, Child Processes and Synchronous functions.
__2)__ Can also be tricked the `fn` to accept generator
functions, so later you can just yield what you want.
__3)__ Or what about to be used as _"thunkify"_ lib?

**Params**

* `<fn>` **{Function}**: function to call    
* `[cb]` **{Function}**: done callback to be used    
* `returns` **{Function}** `thunk`: only if `cb` is not a function  

**Example**

```js
var fs = require('fs')
var tryCatch = require('try-catch-core')

// successful synchronous handling
tryCatch(function () {
  return 'foo bar'
}, function done (err, res) {
  console.log(err) // => null
  console.log(res) // => 'foo bar'
})

// failing sync handling
tryCatch(function () {
  throw new Error('qux baz')
}, function done (err) {
  console.log(err) // => Error: qux baz
})

// async error handling
tryCatch(function (done) {
  fs.readFile('not-existing', done)
}, function done (err) {
  console.log(err)
  // => Error: ENOENT, no such file or directory
})

// successful async handling
tryCatch(function (done) {
  fs.readFile('./package.json', 'utf-8', done)
}, function done (err, str) {
  console.log(err) // => null
  console.log(JSON.parse(str).name) // => 'try-catch-core'
})

// returning thunk
var thunk = tryCatch(function () {
  return JSON.parse('{"foo":"bar qux"}')
})
thunk(function done (err, obj) {
  console.log(err) // => null
  console.log(obj.foo) // => 'bar qux'
})
```

## Related
- [catchup](https://www.npmjs.com/package/catchup): Graceful error handling. Because core `domain` module is deprecated. This share almost… [more](https://github.com/tunnckocore/catchup#readme) | [homepage](https://github.com/tunnckocore/catchup#readme "Graceful error handling. Because core `domain` module is deprecated. This share almost the same API.")
- [function-arguments](https://www.npmjs.com/package/function-arguments): Get arguments of a function, useful for and used in dependency injectors… [more](https://github.com/tunnckocore/function-arguments#readme) | [homepage](https://github.com/tunnckocore/function-arguments#readme "Get arguments of a function, useful for and used in dependency injectors. Works for regular functions, generator functions and arrow functions.")
- [gana-compile](https://www.npmjs.com/package/gana-compile): Pretty small synchronous template engine built on ES2015 Template Strings, working on… [more](https://github.com/tunnckocore/gana-compile#readme) | [homepage](https://github.com/tunnckocore/gana-compile#readme "Pretty small synchronous template engine built on ES2015 Template Strings, working on `node@0.10` too. No RegExps, support for helpers and what you want. Use [gana][] if you wanna both async and sync support.")
- [gana](https://www.npmjs.com/package/gana): Small and powerful template engine with only sync and async compile. The… [more](https://github.com/tunnckocore/gana#readme) | [homepage](https://github.com/tunnckocore/gana#readme "Small and powerful template engine with only sync and async compile. The mid-level between [es6-template][] and [gana-compile][].")
- [is-async-function](https://www.npmjs.com/package/is-async-function): Is function really asynchronous function? Trying to guess that based on check… [more](https://github.com/tunnckocore/is-async-function#readme) | [homepage](https://github.com/tunnckocore/is-async-function#readme "Is function really asynchronous function? Trying to guess that based on check if [common-callback-names][] exists as function arguments names or you can pass your custom.")
- [relike](https://www.npmjs.com/package/relike): Simple promisify async or sync function with sane defaults. Lower level than… [more](https://github.com/hybridables/relike#readme) | [homepage](https://github.com/hybridables/relike#readme "Simple promisify async or sync function with sane defaults. Lower level than `promisify` thing. Can be used to create `promisify` method.")
- [try-catch-callback](https://www.npmjs.com/package/try-catch-callback): try/catch block with a callback, used in [try-catch-core][]. Use it when you… [more](https://github.com/tunnckocore/try-catch-callback#readme) | [homepage](https://github.com/tunnckocore/try-catch-callback#readme "try/catch block with a callback, used in [try-catch-core][]. Use it when you don't care about asyncness so much and don't want guarantees. If you care use [try-catch-core][].")
- [try-require-please](https://www.npmjs.com/package/try-require-please): Try to require the given module, failing loudly with default message if… [more](https://github.com/tunnckocore/try-require-please#readme) | [homepage](https://github.com/tunnckocore/try-require-please#readme "Try to require the given module, failing loudly with default message if module does not exists.")

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/hybridables/try-catch-core/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[common-callback-names]: https://github.com/tunnckocore/common-callback-names
[dezalgo]: https://github.com/npm/dezalgo
[gana]: https://github.com/tunnckocore/gana
[once]: https://github.com/isaacs/once

[npmjs-url]: https://www.npmjs.com/package/try-catch-core
[npmjs-img]: https://img.shields.io/npm/v/try-catch-core.svg?label=try-catch-core

[license-url]: https://github.com/hybridables/try-catch-core/blob/master/LICENSE
[license-img]: https://img.shields.io/npm/l/try-catch-core.svg

[downloads-url]: https://www.npmjs.com/package/try-catch-core
[downloads-img]: https://img.shields.io/npm/dm/try-catch-core.svg

[codeclimate-url]: https://codeclimate.com/github/hybridables/try-catch-core
[codeclimate-img]: https://img.shields.io/codeclimate/github/hybridables/try-catch-core.svg

[travis-url]: https://travis-ci.org/hybridables/try-catch-core
[travis-img]: https://img.shields.io/travis/hybridables/try-catch-core/master.svg

[coveralls-url]: https://coveralls.io/r/hybridables/try-catch-core
[coveralls-img]: https://img.shields.io/coveralls/hybridables/try-catch-core.svg

[david-url]: https://david-dm.org/hybridables/try-catch-core
[david-img]: https://img.shields.io/david/hybridables/try-catch-core.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg

[es6-template]: https://github.com/tunnckocore/es6-template
[gana-compile]: https://github.com/tunnckocore/gana-compile
[try-catch-core]: https://github.com/tunnckocore/try-catch-core