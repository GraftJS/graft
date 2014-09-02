
var jschan    = require('jschan');
var inherits  = require('inherits');
var Server    = require('./lib/server');
var Client    = require('./lib/client');

function WSServer(opts) {
  if (!(this instanceof WSServer)) {
    return new WSServer(opts);
  }

  Server.call(this, opts);
}

inherits(WSServer, Server);

WSServer.prototype._buildServer = function(opts) {
  var server = jschan.websocketServer(opts.server);

  if (!opts.server) {
    server.listen(opts.port || 0);
  }

  this.address = server.address.bind(server);

  server.on('listening', this.emit.bind(this, 'ready', this));

  return server;
};

module.exports.server = WSServer;

function WSClient(opts) {
  if (!(this instanceof WSClient)) {
    return new WSClient(opts);
  }

  Client.call(this, opts);
}

inherits(WSClient, Client);

WSClient.prototype._buildSession = function(opts) {
  return jschan.websocketClientSession(opts);
};

module.exports.client = WSClient;
