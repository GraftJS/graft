
'use strict';

var Transform = require('readable-stream').Transform;
var inherits  = require('inherits');
var Request   = require('./lib/request');
var jschan    = require('jschan');

function Graft() {
  if (!(this instanceof Graft)) {
    return new Graft();
  }
  Transform.call(this, { objectMode: true });

  var that = this;

  function readFirst() {
    /*jshint validthis:true */
    this.removeListener('readable', readFirst);
    that.push(new Request(that._session, this, this.read()));
  }

  this._session = jschan.memorySession();
  this._session.on('channel', function(channel) {
    channel.on('readable', readFirst);
  });

  this._nextChannel = this._session.WriteChannel();

  this.on('pipe', function(source) {
    source.on('ready', that.emit.bind(that, 'ready'));

    this.on('end', function() {
      source.end();
    });
  });
}

inherits(Graft, Transform);

Graft.prototype._transform = function flowing(obj, enc, done) {
  if (obj.session && obj.channel && obj.msg) {
    // it quacks like a duck, so it's a duck - s/duck/request/g
    this.push(obj);
  } else {
    var channel = this._nextChannel;
    this._nextChannel = this._session.WriteChannel();
    channel.write(obj);
  }

  done();
};

Graft.prototype.close = function(cb) {

  function complete() {
    /*jshint validthis:true */
    this._session.close(function(err) {
      if (err) {
        return cb(err);
      }
      return cb();
    });
  }

  if (this._readableState.endEmitted) {
    complete.call(this);
  } else {
    this.on('end', complete);
  }

  if (!this._readableState.flowing) {
    this.resume();
  }

  this.end();
};

Graft.prototype.ReadChannel   = function() {
  return this._nextChannel.ReadChannel();
};

Graft.prototype.WriteChannel   = function() {
  return this._nextChannel.WriteChannel();
};

module.exports = Graft;
