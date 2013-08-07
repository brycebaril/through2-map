module.exports = make
module.exports.ctor = ctor

var through2 = require("through2")

function ctor(options, fn) {
  if (typeof options == "function") {
    fn = options
    options = {}
  }

  var Map = through2.ctor(options, function (chunk, encoding, callback) {
    if (this.options.wantStrings) chunk = chunk.toString()
    this.push(fn.call(this, chunk, this._index++))
    return callback()
  })
  Map.prototype._index = 0
  return Map
}

function make(options, fn) {
  return ctor(options, fn)()
}