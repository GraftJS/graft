
var Transform = require('readable-stream').Transform;
var inherits  = require('inherits');
var Request   = require('./lib/request');
var jschan    = require('jschan');
var channels  = require('./lib/channels');

function Graft() {
  if (!(this instanceof Graft)) {
    return new Graft()
  }
  Transform.call(this, { objectMode: true })

  var that = this;

  function readFirst() {
    this.removeListener('readable', readFirst);
    that.push(new Request(that._session, this, this.read()));
  }

  this._session = jschan.memorySession();
  this._session.on('channel', function(channel) {
    channel.on('readable', readFirst)
  })
}

inherits(Graft, Transform);

Graft.prototype._transform = function(obj, enc, done) {
  if (obj.session && obj.channel && obj.msg) {
    // it quacks like a duck, so it's a duck - s/duck/request/g
    this.push(obj);
  } else {
    var channel = this._session.createWriteChannel();
    channel.write(channels.replace(obj, channel));
  }
  done();
};

Graft.prototype.createReadChannel   = channels.GenericReadChannel;
Graft.prototype.createWriteChannel  = channels.GenericWriteChannel;

module.exports = Graft;
