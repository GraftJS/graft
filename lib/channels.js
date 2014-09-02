
var inherits    = require('inherits');
var PassThrough = require('readable-stream').PassThrough;

function GenericWriteChannel() {
  if (!(this instanceof GenericWriteChannel)) {
    return new GenericWriteChannel();
  }
  PassThrough.call(this, { objectMode: true, highWaterMark: 16 });
}

inherits(GenericWriteChannel, PassThrough);

function GenericReadChannel() {
  if (!(this instanceof GenericReadChannel)) {
    return new GenericReadChannel();
  }
  PassThrough.call(this, { objectMode: true, highWaterMark: 16 });
}

inherits(GenericReadChannel, PassThrough);

function replace(obj, parent) {
  if (typeof obj !== 'object') {
    return obj;
  }

  var chan;

  for (var key in obj) {
    if (obj[key] && obj.hasOwnProperty(key)) {
      if (obj[key] instanceof GenericWriteChannel) {
        chan = parent.createWriteChannel();
        obj[key].pipe(chan);
        obj[key] = chan;
      } else if (obj[key] instanceof GenericReadChannel) {
        chan = parent.createReadChannel();
        chan.pipe(obj[key]);
        obj[key] = chan;
      } else if (!(obj[key]._read || obj[key]._write)) {
        obj[key] = replace(obj[key], parent);
      }
    }
  }

  return obj;
}

module.exports = {
  GenericReadChannel: GenericReadChannel,
  GenericWriteChannel: GenericWriteChannel,
  replace: replace
};
