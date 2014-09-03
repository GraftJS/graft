
'use strict';

var Transform = require('readable-stream').Transform;
var inherits  = require('inherits');

function Wherer(graft) {
  var wrapped;

  if (graft) {
    wrapped = Object.create(graft);

    wrapped.where = function(pattern, stream) {
      return this
        .pipe(new Wherer())
        .where(pattern, stream);
    };

    return wrapped;
  }

  if (!(this instanceof Wherer)) {
    return new Wherer();
  }

  Transform.call(this, { objectMode: true, highWaterMark: 16 });

  this._patterns = [];
}

inherits(Wherer, Transform);

Wherer.prototype.where = function(pattern, stream) {
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

function deepMatch(pattern, obj) {
  var match = true;

  for (var key in pattern) {
    if (typeof pattern[key] === 'object') {
      match = deepMatch(pattern[key], obj[key]);
    } else {
      match = pattern[key] === obj[key];
    }

    if (!match) {
      break;
    }
  }

  return match;
}

Wherer.prototype._transform = function(req, enc, done) {
  var i;

  for (i = 0; i < this._patterns.length; i++) {
    if (deepMatch(this._patterns[i].pattern, req.msg)) {
      this._patterns[i].stream.write(req, done);
      return;
    }
  }

  this.push(req);
  done();
};

module.exports = Wherer;
