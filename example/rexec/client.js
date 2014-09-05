// ported from jschan/examples/rexec

'use strict';

var usage = process.argv[0] + ' ' + process.argv[1] + ' command <args..>';
var through2 = require('through2');

if (!process.argv[2]) {
  console.log(usage);
  process.exit(1);
}

// by default graft always has in-memory transport
var graft = require('../../')();

// enable the optional spdy-client
graft.pipe(require('../../spdy').client({ port: 9323 }));

// create a return channel
var ret = graft.ReadChannel();

// send the comamnd through Graft
graft.write({
  Args: process.argv.slice(3),
  Cmd: process.argv[2],
  StatusChan: ret,
  Stderr: process.stderr,
  Stdout: process.stdout,
  Stdin:  process.stdin
});

// When we get a status, end the whole app
ret.pipe(through2.obj(function (msg, enc, cb) {
  graft.end();
  setImmediate(function() {
    cb();
    console.log('ended with status', msg.Status);
    process.exit(msg.Status);
  });
}));
