
'use strict';

var inherits  = require('inherits');
var Writable  = require('readable-stream').Writable;


function Client(opts) {
  Writable.call(this, { objectMode: true, highWaterMark: 16 });

  var that = this;

  function tearDown() {
    /*jshint validthis:true */
    if (!that._closing) {
      setTimeout(build, opts.reconnectTimeout || 1000);
    }
    this.close();
    this.removeAllListeners('close');
    this.removeAllListeners('error');
    this.on('error', function() {});
  }

  function build() {
    that.session = that._buildSession(opts);
    that.session.on('error', tearDown);
    that.session.on('close', tearDown);
  }

  build();
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
