through2-map
============

[![NPM](https://nodei.co/npm/through2-map.png)](https://nodei.co/npm/through2-map/)

This is a super thin wrapper around [through2](http://npm.im/through2) that works like `Array.prototype.map` but for streams.

For when through2 is just too verbose :wink:

Note you will **NOT** be able to skip chunks. This is intended for modification only. If you want filter the stream content, use either `through2` or `through2-filter`. This transform also does not have a `flush` function.

**IMPORTANT:** If you return `null` from your function, the stream will end there.

```js

var map = require("through2-map")

var truncate = map(function (chunk) {
  return chunk.slice(0, 10)
})

// vs. with through2:
var truncate = through2(function (chunk, encoding, callback) {
  this.push(chunk.slice(0, 10))
  return callback()
})

// Then use your map:
source.pipe(truncate).pipe(sink)

// Additionally accepts `wantStrings` argument to conver buffers into strings
var stripTags = map({wantStrings: true}, function (str) {
  // OMG don't actually use this
  return str.replace(/<.*?>/g, "")
})

// Works like `Array.prototype.map` meaning you can specify a function that
// takes up to two* arguments: fn(chunk, index)
var spaceout = map({wantStrings: true}, function (chunk, index) {
  return (index % 2 == 0) ? chunk + "\n\n" : chunk
})

// vs. with through2:
var spaceout = through2(function (chunk, encoding, callback) {
  if (this.index == undefined) this.index = 0
  var buf = (this.index++ % 2 == 0) ? Buffer.concat(chunk, new Buffer("\n\n")) : chunk
  this.push(buf)
  return callback()
})

```

*Differences from `Array.prototype.map`:
  * Cannot insert `null` elements into the stream without aborting.
  * No third `array` callback argument. That would require realizing the entire stream, which is generally counter-productive to stream operations.
  * `Array.prototype.map` doesn't modify the source Array, which is somewhat nonsensical when applied to streams.

API
---

`require("through2-map")([options,] fn)`
---

Create a `stream.Transform` instance that will call `fn(chunk, index)` on each stream segment.

`var Tx = require("through2-map").ctor([options,] fn)`
---

Create a reusable `stream.Transform` TYPE that can be called via `new Tx` or `Tx()` to create an instance.

`require("through2-map").obj([options,] fn)`
---

Create a `through2-map` instance that defaults to `objectMode: true`.

`require("through2-map").objCtor([options,] fn)`
---

Just like ctor, but with `objectMode: true` defaulting to true.

Options
-------

  * wantStrings: Automatically call chunk.toString() for the super lazy.
  * all other through2 options

LICENSE
=======

MIT
