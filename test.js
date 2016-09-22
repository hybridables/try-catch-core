/*!
 * try-catch-core <https://github.com/tunnckoCore/try-catch-core>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var fs = require('fs')
var test = require('mukla')
var tryCatchCore = require('./index')
var utils = require('./utils')

test('should throw TypeError if `fn` (the 1st arg) not a function', function (done) {
  function fixture () {
    tryCatchCore(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /try-catch-core: expect `fn` to be a function/)
  done()
})

test('should throw TypeError if no function is passed to `thunk`', function (done) {
  var thunk = tryCatchCore(function () {
    return 'foobar'
  })
  function fixture () {
    thunk(123)
  }
  test.throws(fixture, TypeError)
  test.throws(fixture, /try-catch-core: expect `cb` to be a function/)
  done()
})

test('should return thunk if `cb` (the 2nd arg) not a function', function (done) {
  var thunk = tryCatchCore(function (next) {
    next(null, 123)
  })
  test.strictEqual(typeof thunk, 'function')
  test.strictEqual(utils.isAsync(thunk), true)

  thunk(function (err, num) {
    test.ifError(err)
    test.strictEqual(num, 123)
    done()
  })
})

test('should be able `fn` to return sync result and get it in `cb`', function (done) {
  tryCatchCore(function () {
    return 'foo bar'
  }, function cb (err, res) {
    test.ifError(err)
    test.strictEqual(res, 'foo bar')
    done()
  })
})

test('should pass error to `cb` if throws in `fn`', function (done) {
  tryCatchCore(function () {
    qux // eslint-disable-line no-undef
    return 'foo bar'
  }, function cb (err, res) {
    test.ifError(!err)
    test.strictEqual(err.name, 'ReferenceError')
    test.strictEqual(err.message, 'qux is not defined')
    test.strictEqual(res, undefined)
    done()
  })
})

test('should pass error from `fs.readFile` to `cb`', function (done) {
  tryCatchCore(function (next) {
    fs.readFile('not-existing', next)
  }, function cb (err, res) {
    test.ifError(!err)
    test.strictEqual(err.name, 'Error')
    test.ok(/no such file or directory/.test(err.message))
    test.strictEqual(res, undefined)
    done()
  })
})

test('should pass result from `fs.readFile` to the callback', function (done) {
  tryCatchCore(function (next) {
    fs.readFile('package.json', 'utf-8', next)
  }, function cb (err, str) {
    test.ifError(err)
    test.strictEqual(typeof str, 'string')
    test.strictEqual(JSON.parse(str).name, 'try-catch-core')
    test.strictEqual(JSON.parse(str).license, 'MIT')
    done()
  })
})
