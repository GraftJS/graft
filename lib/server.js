
'use strict';

var inherits  = require('inherits');
var Request   = require('./request');
var Readable  = require('readable-stream').Readable;

function Server(opts) {
  Readable.call(this, { objectMode: true, highWaterMark: 16 });

  opts = opts || {};

  this._server = this._buildServer(opts);

  var that = this;

  function readFirst() {
    /*jshint validthis:true */
    this.removeListener('readable', readFirst);
    that.push(new Request(this._session, this, this.read()));
    that.emit('readable');
  }

  function handleChannel(channel) {
    channel.on('readable', readFirst);
  }

  this._server.on('session', function(session) {
    session.on('channel', handleChannel);
  });

  this._server.on('error', this.emit.bind(this, 'error'));
}

inherits(Server, Readable);

Server.prototype._buildServer = function() {
  throw new Error('not implemented yet');
};

Server.prototype._read = function() { return null; };

Server.prototype.end = function() {
  var that = this;
  this._server.close(function(err) {
    if (err) {
      return this.emit('error', err);
    }

    that.push(null);
  });
  return this;
};

module.exports = Server;
