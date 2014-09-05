
'use strict';

var graft = require('./')();
var through = require('through2');

graft.pipe(through.obj(function(msg, enc, cb) {
  console.log(msg); // prints { hello: 'world' }
  // process your request
  cb();
}));

graft.write({ hello: 'world' });
