/*!
 * each-promise <https://github.com/tunnckoCore/each-promise>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var once = require('once')
var dezalgo = require('dezalgo')
var tryCatch = require('try-catch-callback')
var isAsyncFn = require('is-async-function')
var extendShallow = require('extend-shallow')

var utils = {}
utils.once = once
utils.extend = extendShallow
utils.dezalgo = dezalgo
utils.isAsync = isAsyncFn
utils.tryCatchCallback = tryCatch

/**
 * Expose `utils` modules
 */

module.exports = utils
