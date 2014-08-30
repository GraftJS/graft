'use strict';

var graft   = require('..')();
var assert  = require('assert');
var through = require('through2');
var called  = false;

graft.pipe(through.obj(function(req, enc, cb) {
  if (req.msg.topic === 'foo') {
    graft.write({ topic: 'bar' });
  }
  cb();
}));

graft.pipe(through.obj(function(req, enc, cb) {
  if (req.msg.topic === 'bar') {
    called = true;
    assert('response', req.msg);
  }
  cb();
}));

setTimeout(function() {
  assert(called, 'no response');
}, 200);

graft.write({ topic: 'foo' });
