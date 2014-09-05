
'use strict';

var inherits  = require('inherits');
var Writable  = require('readable-stream').Writable;

function Client(opts) {
  Writable.call(this, { objectMode: true, highWaterMark: 16 });

  this.session = this._buildSession(opts);

  this.session.on('error', this.emit.bind(this, 'error'));

  this.session.on('error', function() {
    if (!that._closing) {
      that.session = that._buildSession(opts);
    }
  });

  var that = this;
  this.session.on('close', function() {
    if (!that._closing) {
      that.session = that._buildSession(opts);
    }
    this.removeAllListeners('error');
    this.on('error', function() {});
  });
}

inherits(Client, Writable);

Client.prototype._write = function(msg, enc, done) {
  var channel = this.session.WriteChannel();
  channel.write(msg, function() {
    msg._channel.pipe(channel);
    done();
  });
};

Client.prototype._buildSession = function() {
  throw new Error('not implemented yet');
};

Client.prototype.close = function(cb) {
  this._closing = true;
  this.session.close(cb);
  return this;
};


module.exports = Client;
