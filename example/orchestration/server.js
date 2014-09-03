
'use strict';

var graft   = require('../../graft');
var ws      = require('../../ws');
var spdy    = require('../../spdy');
var http    = require('http');
var server  = http.createServer();
//var adder   = require('./adder');
var send    = require('send');
var url     = require('url');

ws
  .server({ server: server })
  .pipe(graft())
  //.pipe(adder()) // calling it locally
  .pipe(spdy.client({ port: 3003 })); // calling it remotely

server.on('request', function(req, res){
  console.log(req.method, req.url);

  function error(err) {
    res.statusCode = err.status || 500;
    res.end(err.message);
  }

  function redirect() {
    res.statusCode = 301;
    res.setHeader('Location', req.url + '/');
    res.end('Redirecting to ' + req.url + '/');
  }

  send(req, url.parse(req.url).pathname, {root: __dirname})
    .on('error', error)
    .on('directory', redirect)
    .pipe(res);
});

server.listen(3000);

