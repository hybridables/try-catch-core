<p align="center">
  <a href="https://github.com/hybridables">
    <img height="250" width="250" src="https://avatars1.githubusercontent.com/u/10666022?v=3&s=250">
  </a>
</p>

# try-catch-core [![NPM version](https://img.shields.io/npm/v/try-catch-core.svg?style=flat)](https://www.npmjs.com/package/try-catch-core) [![NPM monthly downloads](https://img.shields.io/npm/dm/try-catch-core.svg?style=flat)](https://npmjs.org/package/try-catch-core) [![npm total downloads][downloads-img]][downloads-url]

> Low-level package to handle completion and errors of sync or asynchronous functions, using [once][] and [dezalgo][] libs. Useful for and used in higher-level libs such as [always-done][] to handle completion of anything.

[![codeclimate][codeclimate-img]][codeclimate-url] 
[![codestyle][standard-img]][standard-url] 
[![linux build][travis-img]][travis-url] 
[![windows build][appveyor-img]][appveyor-url] 
[![codecov][coverage-img]][coverage-url] 
[![dependency status][david-img]][david-url]

## Install
```
npm i try-catch-core --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const fs = require('fs')
const tryCatchCore = require('try-catch-core')

tryCatchCore((cb) => {
  fs.readFile('./package.json', 'utf8', cb)
}, (err, res) => {
  if (err) return console.error(err)

  let json = JSON.parse(res)
  console.log(json.name) // => 'try-catch-core'
})
```

## Background
Why this exists? What is useful for? What's its core purpose and why not to use something other? Why not plain try/catch block? What is this?

### What is this?
Simply said, just try/catch block. But on steroids. Simple try/catch block with a callback to be called when some function completes - no matter that function is asynchronous or synchronous, no matter it throws.

### Why this exists?
> There are few reasons why this is built.

- **simplicity:** built on [try-catch-callback][], [once][] and [dezalgo][] - with few lines of code
- **flexibility:** allows to pass custom function context and custom arguments
- **guarantees:** completion is always handled and always in next tick
- **low-level:** allows to build more robust wrappers around it in higher level, such as [always-done][] to handle completion of **anything** - observables, promises, streams, synchronous and async/await functions.

### What is useful for?
It's always useful to have low-level libs as this one. Because you can build more higher level libs on top of this one. For example you can create one library to handle completion of generator functions. It would be simply one type check, converting that generator function to function that returns a promise, than handle that promise in the callback.

Brilliant example of higher level lib is [always-done][] which just pass given function to this lib, and handles the returned value inside callback with a few checks.

Another thing can be to be used as _"thunkify"_ lib, because if you does not give a callback it returns a function (thunk) that accepts a callback.

### Why not plain try/catch?
Guarantees. This package gives you guarantees that you will get correct result and/or error of execution of some function. And removes the boilerplate stuff. Also works with both synchronous and asynchronous functions. But the very main thing that it does is that it calls the given callback in the next tick of event loop and that callback always will be called only once.

**[back to top](#readme)**

## API

### [tryCatchCore](index.js#L51)
> Executes given `fn` and pass results/errors to the `callback` if given, otherwise returns a thunk. In below example you will see how passing custom arguments can be useful and why such options exists.

**Params**

* `<fn>` **{Function}**: function to be called.    
* `[opts]` **{Object}**: optional options, such as `context` and `args`, passed to [try-catch-callback][]    
* `[opts.context]` **{Object}**: context to be passed to `fn`    
* `[opts.args]` **{Array}**: custom argument(s) to be pass to `fn`, given value is arrayified    
* `[opts.passCallback]` **{Boolean}**: pass `true` if you want `cb` to be passed to `fn` args.    
* `[cb]` **{Function}**: callback with `cb(err, res)` signature.    
* `returns` **{Function}** `thunk`: if `cb` not given.  

**Example**

```js
var tryCatch = require('try-catch-core')
var options = {
  context: { num: 123, bool: true }
  args: [require('assert')]
}

// `next` is always there, until
// you pass `passCallback: false` to options
tryCatch(function (assert, next) {
  assert.strictEqual(this.num, 123)
  assert.strictEqual(this.bool, true)
  next()
}, function (err) {
  console.log('done', err)
})
```

**[back to top](#readme)**

## Supports
> Handle completion of synchronous functions (functions that retunrs something) and asynchronous (also known as callbacks), but not `async/await` or other functions that returns promises, streams and etc - for such thing use [always-done][].

### Successful completion of sync functions

```js
const tryCatchCore = require('try-catch-core')

tryCatchCore(() => {
  return 123
}, (err, res) => {
  console.log(err, res) // => null, 123
})
```

**[back to top](#readme)**

### Failing completion of synchronous

```js
const tryCatchCore = require('try-catch-core')

tryCatchCore(() => {
  foo // ReferenceError
  return 123
}, (err) => {
  console.log(err) // => ReferenceError: foo is not defined
})
```

**[back to top](#readme)**

### Completion of async functions (callbacks)

```js
const fs = require('fs')
const tryCatchCore = require('try-catch-core')

tryCatchCore((cb) => {
  // do some async stuff
  fs.readFile('./package.json', 'utf8', cb)
}, (e, res) => {
  console.log(res) // => contents of package.json
})
```

**[back to top](#readme)**

### Failing completion of callbacks

```js
const fs = require('fs')
const tryCatchCore = require('try-catch-core')

tryCatchCore((cb) => {
  fs.stat('foo-bar-baz', cb)
}, (err) => {
  console.log(err) // => ENOENT Error, file not found
})
```

**[back to top](#readme)**

### Passing custom context

```js
const tryCatchCore = require('try-catch-core')
const opts = {
  context: { foo: 'bar' }
}

tryCatchCore(function () {
  console.log(this.foo) // => 'bar'
}, opts, () => {
  console.log('done')
})
```

**[back to top](#readme)**

### Passing custom arguments
> It may be strange, but this allows you to pass more arguments to that first function and the last argument always will be "callback" until `fn` is async or sync but with `passCallback: true` option.

```js
const tryCatchCore = require('try-catch-core')
const options = {
  args: [1, 2]
}

tryCatchCore((a, b) => {
  console.log(arguments.length) // => 2
  console.log(a) // => 1
  console.log(b) // => 2

  return a + b + 3
}, options, (e, res) => {
  console.log(res) // => 9
})
```

**[back to top](#readme)**

### Returning a thunk
> Can be used as _thunkify_ lib without problems, just don't pass a done callback.

```js
const fs = require('fs')
const tryCatchCore = require('try-catch-core')
const readFileThunk = tryCatchCore((cb) => {
  fs.readFile('./package.json', cb)
})

readFileThunk((err, res) => {
  console.log(err, res) // => null, Buffer
})
```

**[back to top](#readme)**

## Related
- [catchup](https://www.npmjs.com/package/catchup): Graceful error handling. Because core `domain` module is deprecated. This share almost… [more](https://github.com/tunnckocore/catchup#readme) | [homepage](https://github.com/tunnckocore/catchup#readme "Graceful error handling. Because core `domain` module is deprecated. This share almost the same API.")
- [function-arguments](https://www.npmjs.com/package/function-arguments): Get arguments of a function, useful for and used in dependency injectors… [more](https://github.com/tunnckocore/function-arguments#readme) | [homepage](https://github.com/tunnckocore/function-arguments#readme "Get arguments of a function, useful for and used in dependency injectors. Works for regular functions, generator functions and arrow functions.")
- [gana-compile](https://www.npmjs.com/package/gana-compile): Pretty small synchronous template engine built on ES2015 Template Strings, working on… [more](https://github.com/tunnckocore/gana-compile#readme) | [homepage](https://github.com/tunnckocore/gana-compile#readme "Pretty small synchronous template engine built on ES2015 Template Strings, working on `node@0.10` too. No RegExps, support for helpers and what you want. Use [gana][] if you wanna both async and sync support.")
- [gana](https://www.npmjs.com/package/gana): Small and powerful template engine with only sync and async compile. The… [more](https://github.com/tunnckocore/gana#readme) | [homepage](https://github.com/tunnckocore/gana#readme "Small and powerful template engine with only sync and async compile. The mid-level between [es6-template][] and [gana-compile][].")
- [is-async-function](https://www.npmjs.com/package/is-async-function): Is function really asynchronous function? Trying to guess that based on check… [more](https://github.com/tunnckocore/is-async-function#readme) | [homepage](https://github.com/tunnckocore/is-async-function#readme "Is function really asynchronous function? Trying to guess that based on check if [common-callback-names][] exists as function arguments names or you can pass your custom.")
- [relike](https://www.npmjs.com/package/relike): Simple promisify async or sync function with sane defaults. Lower level than… [more](https://github.com/hybridables/relike#readme) | [homepage](https://github.com/hybridables/relike#readme "Simple promisify async or sync function with sane defaults. Lower level than `promisify` thing. Can be used to create `promisify` method.")
- [try-catch-callback](https://www.npmjs.com/package/try-catch-callback): try/catch block with a callback, used in [try-catch-core][]. Use it when you… [more](https://github.com/hybridables/try-catch-callback#readme) | [homepage](https://github.com/hybridables/try-catch-callback#readme "try/catch block with a callback, used in [try-catch-core][]. Use it when you don't care about asyncness so much and don't want guarantees. If you care use [try-catch-core][].")
- [try-require-please](https://www.npmjs.com/package/try-require-please): Try to require the given module, failing loudly with default message if… [more](https://github.com/tunnckocore/try-require-please#readme) | [homepage](https://github.com/tunnckocore/try-require-please#readme "Try to require the given module, failing loudly with default message if module does not exists.")

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/hybridables/try-catch-core/issues/new).  
Please read the [contributing guidelines](CONTRIBUTING.md) for advice on opening issues, pull requests, and coding standards.  
If you need some help and can spent some cash, feel free to [contact me at CodeMentor.io](https://www.codementor.io/tunnckocore?utm_source=github&utm_medium=button&utm_term=tunnckocore&utm_campaign=github) too.

**In short:** If you want to contribute to that project, please follow these things

1. Please DO NOT edit [README.md](README.md), [CHANGELOG.md](CHANGELOG.md) and [.verb.md](.verb.md) files. See ["Building docs"](#building-docs) section.
2. Ensure anything is okey by installing the dependencies and run the tests. See ["Running tests"](#running-tests) section.
3. Always use `npm run commit` to commit changes instead of `git commit`, because it is interactive and user-friendly. It uses [commitizen][] behind the scenes, which follows Conventional Changelog idealogy.
4. Do NOT bump the version in package.json. For that we use `npm run release`, which is [standard-version][] and follows Conventional Changelog idealogy.

Thanks a lot! :)

## Building docs
Documentation and that readme is generated using [verb-generate-readme][], which is a [verb][] generator, so you need to install both of them and then run `verb` command like that

```
$ npm install verbose/verb#dev verb-generate-readme --global && verb
```

_Please don't edit the README directly. Any changes to the readme must be made in [.verb.md](.verb.md)._

## Running tests
Clone repository and run the following in that cloned directory

```
$ npm install && npm test
```

## Author
**Charlike Mike Reagent**

+ [github/tunnckoCore](https://github.com/tunnckoCore)
+ [twitter/tunnckoCore](https://twitter.com/tunnckoCore)
+ [codementor/tunnckoCore](https://codementor.io/tunnckoCore)

## License
Copyright © 2016-2017, [Charlike Mike Reagent](http://www.tunnckocore.tk). MIT

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.2, on March 01, 2017._  
_Project scaffolded using [charlike][] cli._

[always-done]: https://github.com/hybridables/always-done
[common-callback-names]: https://github.com/tunnckocore/common-callback-names
[dezalgo]: https://github.com/npm/dezalgo
[es6-template]: https://github.com/tunnckocore/es6-template
[gana-compile]: https://github.com/tunnckocore/gana-compile
[gana]: https://github.com/tunnckocore/gana
[once]: https://github.com/isaacs/once
[try-catch-callback]: https://github.com/hybridables/try-catch-callback
[try-catch-core]: https://github.com/hybridables/try-catch-core

[downloads-url]: https://www.npmjs.com/package/try-catch-core
[downloads-img]: https://img.shields.io/npm/dt/try-catch-core.svg

[codeclimate-url]: https://codeclimate.com/github/hybridables/try-catch-core
[codeclimate-img]: https://img.shields.io/codeclimate/github/hybridables/try-catch-core.svg

[travis-url]: https://travis-ci.org/hybridables/try-catch-core
[travis-img]: https://img.shields.io/travis/hybridables/try-catch-core/master.svg?label=linux

[appveyor-url]: https://ci.appveyor.com/project/tunnckoCore/try-catch-core
[appveyor-img]: https://img.shields.io/appveyor/ci/tunnckoCore/try-catch-core/master.svg?label=windows

[coverage-url]: https://codecov.io/gh/hybridables/try-catch-core
[coverage-img]: https://img.shields.io/codecov/c/github/hybridables/try-catch-core/master.svg

[david-url]: https://david-dm.org/hybridables/try-catch-core
[david-img]: https://img.shields.io/david/hybridables/try-catch-core.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[charlike]: https://github.com/tunnckocore/charlike
[commitizen]: https://github.com/commitizen/cz-cli
[standard-version]: https://github.com/conventional-changelog/standard-version
[verb-generate-readme]: https://github.com/verbose/verb-generate-readme
[verb]: https://github.com/verbose/verb