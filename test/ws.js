
'use strict';

var allTransportTests = require('./all_transports');
var graft             = require('../graft');
var ws                = require('../ws');

describe('websocket graft', function() {

  allTransportTests(function createServer() {
    return ws.server().pipe(graft());
  }, function createClient(server) {
    var result = graft();
    server.on('ready', function(server) {
      result.pipe(ws.client({ port: server.address().port }));
    });
    return result;
  });
});

describe('websocket client', function() {
  var server;
  var client;

  beforeEach(function(done) {
    server = ws.server();
    server.on('ready', function(server) {
      client = ws.client({
        port: server.address().port,
        reconnectTimeout: 100
      });
      done();
    });
  });

  afterEach(function(done) {
    client.close(done);
  });

  afterEach(function(done) {
    server.close(done);
  });

  it('must emit ready when connected', function(done) {
    client.on('ready', function() {
      done();
    });
  });

  it('must automatically reconnect', function(done) {
    client.once('ready', function() {
      client.session.close();
      client.once('ready', function() {
        done();
      });
    });
  });

  it('must reconnect twice', function(done) {
    client.once('ready', function() {
      client.session.close();
      client.once('ready', function() {
        client.session.close();
        client.once('ready', function() {
          done();
        });
      });
    });
  });
});
