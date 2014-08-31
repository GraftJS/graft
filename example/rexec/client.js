// ported from jschan/examples/rexec

'use strict';

var usage = process.argv[0] + ' ' + process.argv[1] + ' command <args..>';

if (!process.argv[2]) {
  console.log(usage);
  process.exit(1);
}

// by default graft always has in-memory transport
var graft = require('../../');

// enable the optional spdy-client
var spdy = require('../../spdy');
var client = spdy.client({port: 9323});

// all messages cross over spdy now
graft.pipe(client);

// define a set of streams and channels
function clientCmd() {
  return {
    Args: process.argv.slice(3),
    Cmd: process.argv[2],
    StatusChan: graft.createReadChannel(),
    Stderr: process.stderr,
    Stdout: process.strdout,
    Stdin:  process.stdin
  };
}

// send those nested streams as a message
var request = graft.write(clientCmd());

// immediately returns the sent message
request.pipe(function(msg) {
  // TODO: not sure about what happens here right now
  //
  // graft(msg.StatusChan).pipe(statusCheck);
});

// When we get a status, end the whole app
function statusCheck(chan) {
  graft.end();
  setImmediate(function() {
    console.log('ended with status', chan.Status);
    process.exit(chan.Status);
  });
}
