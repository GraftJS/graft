
'use strict';

var graft = require('../../graft');
var through = require('through2');
var port = process.argv[2] || 3003;

function build() {
  return graft().pipe(through.obj(function(msg, enc, cb) {
    var result = msg.a + msg.b;
    msg.returnChannel.end(result);
    cb();
  }));
}

module.exports = build;

if (require.main === module) {
  require('../../spdy')
    .server({ port: port })
    .on('ready', function() {
      console.log('Added listening on port', port);
    })
    .pipe(build());
}
