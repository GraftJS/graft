'use strict';

var spawn = require('child_process').spawn;

// by default graft always has in-memory transport
var graft = require('graft');

// enable the optional spdy-server
var spdy = require('graft/spdy');
var server = spdy.server(9323);

// all messages cross over spdy now
graft.pipe(server).pipe(graft);

// handle received messages
graft.pipe(handleMsg);

// start listening / emitting
graft.start();

// run a local process and pipe stdio across spdy
function handleMsg(msg) {
  var opts = { stdio: [ 'pipe', 'pipe', 'pipe' ] };

  var child = spawn(msg.Cmd, msg.Args, opts);

  msg.Stdin.pipe(child.stdin);
  child.stdout.pipe(msg.Stdout);
  child.stderr.pipe(msg.Stderr);

  child.on('exit', function(status) {
    msg.StatusChan.write({ Status: status });
  });
}
