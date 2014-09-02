
var Transform = require('readable-stream').Transform;
var inherits  = require('inherits');
var Request   = require('./lib/request');
var jschan    = require('jschan');
var channels  = require('./lib/channels');

function Graft() {
  if (!(this instanceof Graft)) {
    return new Graft();
  }
  Transform.call(this, { objectMode: true });

  var that = this;

  function readFirst() {
    this.removeListener('readable', readFirst);
    that.push(new Request(that._session, this, this.read()));
  }

  this._session = jschan.memorySession();
  this._session.on('channel', function(channel) {
    channel.on('readable', readFirst);
  });

  this.on('pipe', function(source) {
    source.on('ready', that.emit.bind(that, 'ready'));

    this.on('end', function() {
      source.end();
    });
  });
}

inherits(Graft, Transform);

function waiting(obj, enc, done) {
  this._waitingObj = obj;
  this._waitingDone = done;
}

function flowing(obj, enc, done) {
  if (obj.session && obj.channel && obj.msg) {
    // it quacks like a duck, so it's a duck - s/duck/request/g
    this.push(obj);
  } else {
    var channel = this._session.WriteChannel();
    channel.write(channels.replace(obj, channel));
  }

  done();
}

Graft.prototype._transform = waiting;

Graft.prototype.pipe = function(origin, end) {
  if (origin.session) {
    this._session = origin.session;
  }

  this._transform = flowing;

  if (this._waitingObj) {
    this._transform(this._waitingObj, 'object', this._waitingDone);
    delete this._waitingObj;
    delete this._waitingDone;
  }

  return Transform.prototype.pipe.call(this, origin, end);
};

Graft.prototype.close = function(cb) {
  var count = 0;

  function complete() {
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

Graft.prototype.ReadChannel   = channels.GenericReadChannel;
Graft.prototype.WriteChannel  = channels.GenericWriteChannel;

Graft.ReadChannel             = channels.GenericReadChannel;
Graft.WriteChannel            = channels.GenericWriteChannel;

module.exports = Graft;
