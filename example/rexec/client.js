// ported from jschan/examples/rexec

'use strict';

var usage = process.argv[0] + ' ' + process.argv[1] + ' command <args..>';

if (!process.argv[2]) {
  console.log(usage);
  process.exit(1);
}

// by default graft always has in-memory transport
var graft = require('graft');

// enable the optional spdy-client
var spdy = require('graft/spdy');
var client = spdy.client({port: 9323});

// all messages cross over spdy now
graft.pipe(client).pipe(graft);

// start listening / emitting messages.
graft.start();

// define a set of streams and channels
function clientCmd() {
  return {
    Args: process.argv.slice(3),
    Cmd: process.argv[2],
    StatusChan: graft.readChannel(),
    Stderr: graft.byteStream(),
    Stdout: graft.byteStream(),
    Stdin:  graft.byteStream()
  };
}

// send those nested streams as a message
var request = graft.write(clientCmd());

// immediately returns the sent message
request.pipe(function(msg) {

  // set up std* to those pipes
  process.stdin.pipe(msg.Stdin);
  msg.Stdout.pipe(process.stdout);
  msg.Stderr.pipe(process.stderr);

  // split off into a 'sub-graft'
  graft(msg.StatusChan)
    .pipe(statusCheck);
});

// When we get a status, end the whole app
function statusCheck(chan) {
  graft.end();
  setImmediate(function() {
    console.log('ended with status', chan.Status);
    process.exit(chan.Status);
  });
}
