module.exports = make
module.exports.ctor = ctor

var through2 = require("through2")

function ctor(options, fn) {
  if (typeof options == "function") {
    fn = options
    options = {}
  }
  options._index = 0
  return through2.ctor(options, function (chunk, encoding, callback) {
    if (this.options.wantStrings) chunk = chunk.toString()
    this.push(fn(chunk, this.options._index++))
    return callback()
  })
}

function make(options, fn) {
  return ctor(options, fn)()
}