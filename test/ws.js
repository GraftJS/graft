
var allTransportTests = require('./all_transports');
var graft             = require('../graft');
var ws                = require('../ws');
var fs                = require('fs');

describe('websocket graft', function() {

  allTransportTests(function createServer() {
    return ws.server().pipe(graft());
  }, function createClient(server) {
    var result = graft();
    server.on('ready', function(server) {
      result.pipe(ws.client({ port: server.address().port }));
    })
    return result;
  })
});
