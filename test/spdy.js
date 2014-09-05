
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

describe('spdy client', function() {
  var server;
  var client;

  beforeEach(function(done) {
    server = spdy.server();
    server.on('ready', function(server) {
      client = spdy.client({ port: server.address().port });
      done();
    });
  });

  afterEach(function(done) {
    client.close(function() {
      done();
    });
  });

  afterEach(function(done) {
    server.close(function() {
      done();
    });
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
});
