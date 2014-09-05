
'use strict';

var Transform = require('readable-stream').Transform;
var inherits  = require('inherits');
var deepMatch = require('./lib/deepMatch');
var wrap      = require('./lib/wrapMessage');
var jschan    = require('jschan');

function noop() {}

function Graft() {
  if (!(this instanceof Graft)) {
    return new Graft();
  }
  Transform.call(this, { objectMode: true, highWaterMark: 16 });

  var that = this;

  function readFirst() {
    /*jshint validthis:true */
    this.removeListener('readable', readFirst);
    that._transform(wrap(this.read(), this), null, noop);
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

  this._patterns = [];
}

inherits(Graft, Transform);

Graft.prototype._transform = function flowing(obj, enc, done) {
  if (!obj._session && !obj._channel)  {
    // it quacks like a duck, so it's a duck - s/duck/request/g
    var channel = this._nextChannel;
    this._nextChannel = this._session.WriteChannel();
    channel.write(obj);
    return done();
  }

  var i;

  for (i = 0; i < this._patterns.length; i++) {
    if (this._patterns[i].pattern(obj)) {
      this._patterns[i].stream.write(obj, done);
      return;
    }
  }

  this.push(obj);

  done();
};

Graft.prototype.branch = function(pattern, stream) {
  if (!pattern) {
    throw new Error('missing pattern');
  }

  if (!stream) {
    throw new Error('missing destination');
  }

  this._patterns.push({
    pattern: pattern,
    stream: stream
  });

  return this;
};

Graft.prototype.where = function(pattern, stream) {
  return this.branch(function(req) {
    return deepMatch(pattern, req);
  }, stream);
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

Graft.prototype.ReadChannel = function() {
  return this._nextChannel.ReadChannel();
};

Graft.prototype.WriteChannel = function() {
  return this._nextChannel.WriteChannel();
};

module.exports = Graft;
