'use strict'
const setImmediate = require('setimmediate2').setImmediate
const linkedList = require('./lib/linked-list.js')

function noop () {}

function once (fn) {
  let called = false
  if (fn.length < 2) {
    return function (err) {
      if (called === true) return
      called = true
      fn(err)
    }
  }
  return function (err, data) {
    if (called === true) return
    called = true
    fn(err, data)
  }
}

function _mapEach (items, process, concurrency, next) {
  next = once(next)

  const iter = items[Symbol.iterator]()
  const result = next.length > 1 ? linkedList() : undefined
  let total = 0
  let done = 0
  let finish = concurrency > 0 ? setImmediate.bind(null, step) : noop

  function step () {
    if (concurrency > 0 && done + concurrency <= total) {
      return
    }
    const item = iter.next()
    if (item.done) {
      finish = function () {
        if (done === total) {
          next(null, result)
        }
      }
      finish()
      return
    }
    total += 1

    const node = (result !== undefined) ? result.add() : undefined

    process(item.value, function (err, value) {
      if (err) {
        next(err)
      }
      if (node !== undefined) {
        node.value = value
      }
      done += 1
      finish()
    })
    step()
  }

  setImmediate(step)
}

function mapEach (items, process, concurrency, next) {
  if (typeof next === 'number') {
    return mapEach(items, process, next, concurrency)
  }
  if (typeof concurrency !== 'number') {
    return mapEach(items, process, 0, concurrency)
  }
  if (typeof process !== 'function') {
    throw new Error('Process needs to be a function!')
  }
  if (!items || typeof items[Symbol.iterator] !== 'function') {
    throw new Error('Items needs to be a collection')
  }

  concurrency = concurrency | 0

  if (typeof next !== 'function') {
    return new Promise(function (resolve, reject) {
      _mapEach(items, process, concurrency, function (err, data) {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }
  _mapEach(items, process, concurrency, next)
}

exports.mapEach = mapEach
