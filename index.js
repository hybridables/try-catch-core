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
 * a thunk. In below example you will see how passing
 * custom arguments can be useful and why such options
 * exists.
 *
 * **Example**
 *
 * ```js
 * var tryCatch = require('try-catch-core')
 * var options = {
 *   context: { num: 123, bool: true }
 *   args: [require('assert')]
 * }
 *
 * // `next` is always there, until
 * // you pass `passCallback: false` to options
 * tryCatch(function (assert, next) {
 *   assert.strictEqual(this.num, 123)
 *   assert.strictEqual(this.bool, true)
 *   next()
 * }, function (err) {
 *   console.log('done', err)
 * })
 * ```
 *
 * @param  {Function} `<fn>` function to be called.
 * @param  {Object} `[opts]` optional options, such as `context` and `args`, passed to [try-catch-callback][]
 * @param  {Object} `[opts.context]` context to be passed to `fn`
 * @param  {Array} `[opts.args]` custom argument(s) to be pass to `fn`, given value is arrayified
 * @param  {Boolean} `[opts.passCallback]` pass `true` if you want `cb` to be passed to `fn` args.
 * @param  {Function} `[cb]` callback with `cb(err, res)` signature.
 * @return {Function} `thunk` if `cb` not given.
 * @throws {TypError} if `fn` not a function.
 * @throws {TypError} if no function is passed to `thunk`.
 * @api public
 */

module.exports = function tryCatchCore (fn, opts, cb) {
  if (typeof fn !== 'function') {
    throw new TypeError('try-catch-core: expect `fn` to be a function')
  }
  if (typeof opts === 'function') {
    cb = opts
    opts = null
  }
  if (typeof cb !== 'function') {
    return function thunk (done) {
      tryCatch.call(this, fn, opts, done)
    }
  }
  tryCatch.call(this, fn, opts, cb)
}

function tryCatch (fn, opts, cb) {
  if (typeof cb !== 'function') {
    throw new TypeError('try-catch-core: expect `cb` to be a function')
  }
  var isAsyncFn = utils.isAsync(fn)
  cb = isAsyncFn
    ? utils.once(utils.dezalgo(cb))
    : utils.once(cb)
  opts = utils.extend({}, opts)
  opts.passCallback = typeof opts.passCallback === 'boolean'
    ? opts.passCallback
    : isAsyncFn // if `fn` is async, pass callback automatically

  utils.tryCatchCallback.call(this, fn, opts, cb)
}
