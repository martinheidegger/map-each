'use strict'
module.exports = function createLinkedList () {
  const last = {
    prev: null,
    value: null,
    done: true
  }
  last.next = last
  const list = {
    first: last,
    last: last
  }
  list.add = function () {
    const node = {
      value: null,
      next: list.last,
      prev: list.last.prev,
      done: false
    }
    if (node.prev !== null) {
      node.prev.next = node
    }
    list.last.prev = node
    if (list.first === list.last) {
      list.first = node
    }
    return node
  }
  list[Symbol.iterator] = function () {
    let current = list.first
    return {
      next: function () {
        let _current = current
        current = current.next
        return _current
      }
    }
  }
  return list
}
