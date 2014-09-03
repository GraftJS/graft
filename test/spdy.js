
'use strict';

var allTransportTests = require('./all_transports');
var graft             = require('../graft');
var spdy              = require('../spdy');
var fs                = require('fs');

describe('spdy graft', function() {

  allTransportTests(function createServer() {
    return spdy.server({
      key: fs.readFileSync(__dirname + '/certificates/key.pem'),
      cert: fs.readFileSync(__dirname + '/certificates/cert.pem'),
      ca: fs.readFileSync(__dirname + '/certificates/csr.pem')
    }).pipe(graft());
  }, function createClient(server) {
    var result = graft();
    server.on('ready', function(server) {
      result.pipe(spdy.client({ port: server.address().port }));
    });
    return result;
  });
});
