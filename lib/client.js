
'use strict';

var inherits  = require('inherits');
var Writable  = require('readable-stream').Writable;

function Client(opts) {
  Writable.call(this, { objectMode: true, highWaterMark: 16 });

  this.session = this._buildSession(opts);

  this.session.on('error', this.emit.bind(this, 'error'));

  this.session.on('close', function() {
    this.removeAllListeners('error');
    this.on('error', function() {});
  });
}

inherits(Client, Writable);

Client.prototype._write = function(req, enc, done) {
  var channel = this.session.WriteChannel();
  channel.write(req.msg, function() {
    req.channel.pipe(channel);
    done();
  });
};

Client.prototype._buildSession = function() {
  throw new Error('not implemented yet');
};


module.exports = Client;
