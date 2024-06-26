"use strict";

module.exports = make
module.exports.ctor = ctor
module.exports.objCtor = objCtor
module.exports.obj = obj

const through2 = require("through2")

function ctor(options, fn) {
  if (typeof options == "function") {
    fn = options
    options = {}
  }

  var Map = through2.ctor(options, function (chunk, encoding, callback) {
    if (this.options.wantStrings) chunk = chunk.toString()
    try {
      this.push(fn.call(this, chunk, this._index++))
      return callback()
    } catch (e) {
      return callback(e)
    }
  })
  Map.prototype._index = 0
  return Map
}

function make(options, fn) {
  return ctor(options, fn)()
}

function objCtor(options, fn) {
  if (typeof options === "function") {
    fn = options
    options = {}
  }
  options = Object.assign({objectMode: true, highWaterMark: 16}, options)
  return ctor(options, fn)
}

function obj(options, fn) {
  if (typeof options === "function") {
    fn = options
    options = {}
  }
  options = Object.assign({objectMode: true, highWaterMark: 16}, options)
  return make(options, fn)
}
