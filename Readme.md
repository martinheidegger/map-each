# map-each

<a href="https://travis-ci.org/martinheidegger/map-each"><img src="https://travis-ci.org/martinheidegger/map-each.svg?branch=master" alt="Build Status"/></a>
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Maintainability](https://api.codeclimate.com/v1/badges/xxx/maintainability)](https://codeclimate.com/github/martinheidegger/map-each/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/xxx/test_coverage)](https://codeclimate.com/github/martinheidegger/map-each/test_coverage)

`map-each` is a **very small**, **flexible**, **parallel** async mapping helper that has first-class support for [Iterators][]
(unlike other libraries, which mostly break with iterators) and **concurrency**. It also has complete TypeScript header files for
comfortable integration.

[Iterators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols

`npm i map-each --save`

It is similar to [`async-iterate`][], [`now-and-later`][], [`async-parallel`][], ... and many other.

```javascript
const { mapEach } = require('map-each')

mapEach(
  ['a', 'b', 'c']
  function (input, callback) {
    callback()
  },
  function (err) {
    // Done once all functions are done
  }
)
```

[`async-iterate`]: https://www.npmjs.com/package/async-iterate
[`now-and-later`]: https://www.npmjs.com/package/now-and-later
[`async-parallel`]: https://www.npmjs.com/package/async-parallel

There are several things that make this different:

- It returns an `Iterable` object instead of an Array.
- It supports `Promises` in case you prefer to use async/await with your API's
- It supports `concurrency` limits to limit the amount of commands executed at the same time.


## Iterable results

Like in other libraries you can get the result, but unlike other libraries, its not
an Array, so you need to apply an `Array.from` to it.

```javascript
mapEach([
  ['a', 'b']
  function (item, callback) {
    callback(null, 'name:' + item)
  },
], function (err, data) {
  Array.from(data) === ['name:a', 'name:b'] // the order is protected
})
```

_Note:_ This is more of an internal detail, but if the passed-in function doesn't have
a second parameter, the data will not be collected.

```javascript
mapEach([], function () {}, function () {
  console.log(arguments.length) // 1
})

mapEach([], function () {}, function (err, data) {
  console.log(arguments.length) // 2
})
```

## Promise support

If you don't pass in a callback handler at the end, it will automatically return a Promise.

```javascript
mapEach([/*...*/], function () {}).then(function () {
  // all done
})
```

## Concurrency

By passing a concurrency limit to the runner, it will limit the amount of parallel
executions

```javascript
mapEach([/*...*/], function () {}, 1).then(function () {
  // now each operation is run in series.
})
mapEach([/*...*/], function () {}, 2).then(function () {
  // now two operations are run at the same time
})
```

### License

MIT
