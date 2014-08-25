'use strict';

var graft = require('graft');
var assert  = require('assert');

var called = false;

graft()
  .pipe(function(msg) {
    if (msg.topic === 'foo') {
      msg.write({ topic: 'bar' });
    }
  })
  .pipe(function(msg) {
    if (msg.topic === 'bar') {
      called = true;
      assert('response', msg);
    }
  });

setTimeout(function() {
  assert(called, 'no response');
}, 200);

graft.start();

graft.write({ hello: 'foo' });
