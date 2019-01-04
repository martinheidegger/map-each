'use strict'
const test = require('tap').test
const mapEach = require('../index.js').mapEach
const setImmediate = require('setimmediate2').setImmediate

test('simply executing an array', function () {
  return mapEach([], function () {})
})

test('a non-collection should throw an error', function (t) {
  t.throws(function () {
    mapEach(null, function () {})
  }, 'Items needs to be a collection')
  t.end()
})

test('a non-processor should thrown an error', function (t) {
  t.throws(function () {
    mapEach([])
  }, 'process needs to be a function')
  t.end()
})

test('passing a callback should use that instead of array', function (t) {
  const p = mapEach([], function () {}, function (err) {
    t.equals(err, null)
    t.end()
  })
  t.equal(p, undefined)
})

test('each task should be run in parallel', function (t) {
  const stack = []
  stack.push('start:start')
  mapEach(
    ['a', 'b'],
    delay(stack),
    function () {
      t.deepEquals(stack, [
        'start:start',
        'end:start',
        'start:a',
        'start:b',
        'end:a',
        'end:b'
      ])
      t.end()
    })
  stack.push('end:start')
})

test('an error should be passed to the result', function (t) {
  mapEach(
    ['a'],
    function (_, cb) {
      cb(new Error('x'))
    },
    function (err) {
      t.equals(err.message, 'x')
      t.end()
    }
  )
})

test('the first error should be passed to the result, not the error of the first in-order function', function (t) {
  mapEach(
    ['a', 'b'],
    function (name, cb) {
      if (name === 'a') {
        setTimeout(cb, 10, new Error('x'))
      } else {
        cb(new Error('y'))
      }
    },
    function (err) {
      t.equals(err.message, 'y')
      t.end()
    })
})

test('The error should be propagated to the promise', function (t) {
  return t.rejects(mapEach(['a'],
    function a (name, cb) {
      cb(new Error('x'))
    }
  ))
})

test('each result should be passed to the result', function (t) {
  return mapEach(['a', 'b'],
    function (input, cb) {
      cb(null, 'name:' + input)
    })
    .then(function (data) {
      t.deepEquals(Array.from(data), ['name:a', 'name:b'])
    })
})

test('data is not collected without a handler that has enough params', function (t) {
  mapEach([], function () {}, function () {
    t.equals(arguments.length, 1)
    mapEach([], function () {}, function (err, data) {
      t.error(err)
      t.notEquals(data, null)
      t.end()
    })
  })
})

test('delays should not mess up the result order', function (t) {
  const times = {
    a: 10,
    b: 5,
    c: 2
  }
  return mapEach(
    ['a', 'b', 'c'],
    function (input, cb) {
      setTimeout(cb, times[input], null, 'name:' + input)
    }
  )
    .then(function (data) {
      t.deepEquals(Array.from(data), ['name:a', 'name:b', 'name:c'])
    })
})

test('concurrency argument order should be variable', function (t) {
  const stack = []
  return mapEach(
    ['a', 'b'],
    delay(stack),
    function () {
      t.deepEquals(stack, [
        'start:a',
        'end:a',
        'start:b',
        'end:b'
      ])
      t.end()
    },
    1
  )
})

test('concurrency should be respected', function (t) {
  const stack = []
  return mapEach(
    ['a', 'b', 'c', 'd', 'e'],
    delay(stack),
    2
  ).then(function () {
    t.deepEquals(stack, [
      'start:a',
      'start:b',
      'end:a',
      'end:b',
      'start:c',
      'start:d',
      'end:c',
      'end:d',
      'start:e',
      'end:e'
    ])
  })
})

function delay (stack) {
  return function (input, cb) {
    stack.push('start:' + input)
    setImmediate(function () {
      stack.push('end:' + input)
      cb()
    })
  }
}
