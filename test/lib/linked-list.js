'use strict'
const test = require('tap').test
const createLinkedList = require('../../lib/linked-list.js')

test('List is iterable', function (t) {
  t.deepEquals(Array.from(createLinkedList()), [])
  t.end()
})

test('Adding to the list will add elements', function (t) {
  const list = createLinkedList()
  list.add()
  t.deepEquals(Array.from(list), [undefined])
  t.end()
})

test('Setting values to the linked list will pass the data', function (t) {
  const list = createLinkedList()
  const a = list.add()
  a.value = 1
  const b = list.add()
  b.value = 2
  t.equals(list.first, a, 'The first added element should become the first to iterate over')
  t.equals(list.first.next, b, 'The second node should have been added as next to the previous')
  t.equals(list.last.next, list.last, 'The last entry after the last should be last again')
  t.equals(list.last.prev, b, 'The previous entry of last should be the second entry')
  t.deepEquals(Array.from(list), [1, 2], 'Iterating should result in the correct order')
  t.end()
})
