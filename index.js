/*!
 * try-catch-core <https://github.com/hybridables/try-catch-core>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Executes given `fn` and pass results/errors
 * to the `callback` if given, otherwise returns
 * a thunk.
 *
 * **Example**
 *
 * ```js
 * var fs = require('fs')
 * var tryCatch = require('try-catch-core')
 *
 * // successful synchronous handling
 * tryCatch(function () {
 *   return 'foo bar'
 * }, function done (err, res) {
 *   console.log(err) // => null
 *   console.log(res) // => 'foo bar'
 * })
 *
 * // failing sync handling
 * tryCatch(function () {
 *   throw new Error('qux baz')
 * }, function done (err) {
 *   console.log(err) // => Error: qux baz
 * })
 *
 * // async error handling
 * tryCatch(function (done) {
 *   fs.readFile('not-existing', done)
 * }, function done (err) {
 *   console.log(err)
 *   // => Error: ENOENT, no such file or directory
 * })
 *
 * // successful async handling
 * tryCatch(function (done) {
 *   fs.readFile('./package.json', 'utf-8', done)
 * }, function done (err, str) {
 *   console.log(err) // => null
 *   console.log(JSON.parse(str).name) // => 'try-catch-core'
 * })
 *
 * // returning thunk
 * var thunk = tryCatch(function () {
 *   return JSON.parse('{"foo":"bar qux"}')
 * })
 * thunk(function done (err, obj) {
 *   console.log(err) // => null
 *   console.log(obj.foo) // => 'bar qux'
 * })
 * ```
 *
 * @param  {Function} `<fn>` function to call
 * @param  {Function} `[cb]` done callback to be used
 * @return {Function} `thunk` only if `cb` is not a function
 * @api public
 */

module.exports = function tryCatchCore (fn, cb, opts) {
  if (typeof fn !== 'function') {
    throw new TypeError('try-catch-core: expect `fn` to be a function')
  }
  if (typeof cb !== 'function') {
    return function thunk (done) {
      tryCatch.call(this, fn, done, cb || opts)
    }
  }
  tryCatch.call(this, fn, cb, opts)
}

function tryCatch (fn, cb, opts) {
  if (typeof cb !== 'function') {
    throw new TypeError('try-catch-core: expect `cb` to be a function')
  }
  cb = utils.isAsync(fn)
    ? utils.once(utils.dezalgo(cb))
    : utils.once(cb)
  opts = opts && typeof opts === 'object'
    ? opts
    : {}
  opts.passCallback = typeof opts.passCallback === 'boolean'
    ? opts.passCallback
    : true

  utils.tryCatchCallback.call(this, fn, cb, opts)
}
