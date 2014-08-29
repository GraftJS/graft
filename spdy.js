
var jschan    = require('jschan');
var inherits  = require('inherits');
var Request   = require('./lib/request');
var Readable  = require('readable-stream').Readable;
var Writable  = require('readable-stream').Writable;

function Server(opts) {
  if (!(this instanceof Server)) {
    return new Server(opts);
  }

  Readable.call(this, { objectMode: true, highWaterMark: 16 });

  opts = opts || {};

  this._server = jschan.spdyServer(opts);
  this._server.listen(opts.port || 0);

  this.address = this._server.address.bind(this._server);

  this._server.on('listening', this.emit.bind(this, 'ready', this));

  var that = this;

  function readFirst() {
    this.removeListener('readable', readFirst);
    that.push(new Request(this._session, this, this.read()));
    that.emit('readable');
  }

  function handleChannel(channel) {
    channel.on('readable', readFirst);
  }

  this._server.on('session', function(session) {
    session.on('channel', handleChannel);
  })
}

inherits(Server, Readable);

Server.prototype._read = function() { return null };

module.exports.server = Server;

function Client(opts) {
  if (!(this instanceof Client)) {
    return new Client(opts);
  }

  Writable.call(this, { objectMode: true, highWaterMark: 16 });

  this.session = jschan.spdyClientSession(opts);
}

inherits(Client, Writable);

Client.prototype._write = function(req, enc, done) {
  // really, nothing to do, it's just a placeholder
  done();
}

module.exports.client = Client;
