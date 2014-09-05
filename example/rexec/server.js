'use strict';

var spawn = require('child_process').spawn;
var through2 = require('through2');

var graft = require('../..')();

// enable the optional spdy-server
var spdy = require('../../spdy');
var server = spdy.server({ port: 9323 });

// all messages cross over spdy now
server.pipe(graft);

// run a local process and pipe stdio across spdy
function handleMsg(msg, enc, callback) {
  var opts = { stdio: [ 'pipe', 'pipe', 'pipe' ] };

  var child = spawn(msg.Cmd, msg.Args, opts);

  msg.Stdin.pipe(child.stdin);
  child.stdout.pipe(msg.Stdout);
  child.stderr.pipe(msg.Stderr);

  child.on('exit', function(status) {
    msg.StatusChan.end({ Status: status });
  });

  callback();
}

// handle received messages
graft.pipe(through2.obj(handleMsg));
