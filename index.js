/*!
 * try-catch-core <https://github.com/tunnckoCore/try-catch-core>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

module.exports = function tryCatchCore (fn, cb) {
  if (typeof fn !== 'function') {
    throw new TypeError('try-catch-core: expect `fn` to be a function')
  }
  if (typeof cb !== 'function') {
    return function thunk (done) {
      tryCatchCore(fn, done)
    }
  }
  if (utils.isAsync(fn)) {
    fn(utils.once(utils.dezalgo(cb)))
    return
  }

  var ret = null
  cb = utils.once(cb)

  try {
    ret = fn(cb)
  } catch (err) {
    if (!cb.called) return cb(err)
  }

  if (!cb.called) return cb(null, ret)
}
