
var jschan    = require('jschan');
var inherits  = require('inherits');
var Server    = require('./lib/server');
var Client    = require('./lib/client');

function SPDYServer(opts) {
  if (!(this instanceof SPDYServer)) {
    return new SPDYServer(opts);
  }

  Server.call(this, opts);
}

inherits(SPDYServer, Server);

SPDYServer.prototype._buildServer = function(opts) {
  var server = jschan.spdyServer(opts);
  server.listen(opts.port || 0);

  this.address = server.address.bind(server);

  server.on('listening', this.emit.bind(this, 'ready', this));

  return server;
};

module.exports.server = SPDYServer;

function SPDYClient(opts) {
  if (!(this instanceof SPDYClient)) {
    return new SPDYClient(opts);
  }

  Client.call(this, opts);
}

inherits(SPDYClient, Client);

SPDYClient.prototype._buildSession = function(opts) {
  return jschan.spdyClientSession(opts);
};

module.exports.client = SPDYClient;
