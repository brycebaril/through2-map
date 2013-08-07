var test = require("tape").test

var map = require("../")
var spigot = require("stream-spigot")
var concat = require("concat-stream")

test("ctor", function (t) {
  t.plan(2)

  var Map = map.ctor(function (record) {
    record.foo.toUpperCase()
    return record
  })

  function combine(records) {
    t.equals(records.length, 5, "Correct number of remaining records")
    t.notOk(records.filter(function (r) { /^[A-Z]$/.exec(r.foo) }).length, "Everything uppercased")
  }

  spigot([
    {foo: "bar"},
    {foo: "baz"},
    {foo: "bif"},
    {foo: "blah"},
    {foo: "buzz"},
  ], {objectMode: true})
    .pipe(new Map({objectMode: true}))
    .pipe(concat(combine))
})

test("ctor options", function (t) {
  t.plan(7)

  var Map = map.ctor({objectMode: true, foo: "bar"}, function (record) {
    t.equals(this.options.foo, "bar", "can see options")
    record.foo.toUpperCase()
    return record
  })

  function combine(records) {
    t.equals(records.length, 5, "Correct number of remaining records")
    t.notOk(records.filter(function (r) { /^[A-Z]$/.exec(r.foo) }).length, "Everything uppercased")
  }

  spigot([
    {foo: "bar"},
    {foo: "baz"},
    {foo: "bif"},
    {foo: "blah"},
    {foo: "buzz"},
  ], {objectMode: true})
    .pipe(new Map({objectMode: true}))
    .pipe(concat(combine))
})

test("ctor buffer wantStrings index", function (t) {
  t.plan(1)

  var Map = map.ctor({wantStrings: true}, function (chunk, index) {
    return (index % 2 == 0) ? chunk.toUpperCase() : chunk
  })

  function combine(result) {
    t.equals(result.toString(), "AbCdEf", "result is correct")
  }

  spigot([
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
  ]).pipe(new Map())
    .pipe(concat(combine))
})

test("simple", function (t) {
  t.plan(2)

  var m = map({objectMode: true}, function (record) {
    record.foo.toUpperCase()
    return record
  })

  function combine(records) {
    t.equals(records.length, 5, "Correct number of remaining records")
    t.notOk(records.filter(function (r) { /^[A-Z]$/.exec(r.foo) }).length, "Everything uppercased")
  }

  spigot([
    {foo: "bar"},
    {foo: "baz"},
    {foo: "bif"},
    {foo: "blah"},
    {foo: "buzz"},
  ], {objectMode: true})
    .pipe(m)
    .pipe(concat(combine))
})

test("simple buffer", function (t) {
  t.plan(1)

  var f = map({objectMode: true}, function (chunk) {
    return chunk.slice(0, 5)
  })

  function combine(result) {
    t.equals(result.toString(), "abcdefglmnopuvwxyz", "result is correct")
  }

  spigot([
    "a",
    "b",
    "cdefghijk",
    "lmnopqrst",
    "u",
    "vwxyz",
  ]).pipe(f)
    .pipe(concat(combine))
})

test("end early", function (t) {
  t.plan(1)

  var f = map({objectMode: true}, function (chunk) {
    return null
  })

  function combine(result) {
    t.notOk(result, "Ended on the first chunk")
  }

  spigot([
    "a",
    "b",
    "cdefghijk",
    "lmnopqrst",
    "u",
    "vwxyz",
  ]).pipe(f)
    .pipe(concat(combine))
})