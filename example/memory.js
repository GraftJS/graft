'use strict';

var graft   = require('..')();
var assert  = require('assert');
var through = require('through2');
var called  = false;

graft.pipe(through.obj(function(msg, enc, cb) {
  if (msg.topic === 'foo') {
    graft.write({ topic: 'bar' }, cb);
  }
}));

graft.pipe(through.obj(function(msg, enc, cb) {
  if (msg.topic === 'bar') {
    called = true;
    assert('response', msg);
  }
  cb();
}));

setTimeout(function() {
  assert(called, 'no response');
}, 200);

graft.write({ topic: 'foo' });
