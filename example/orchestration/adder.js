
var graft = require('../../graft');
var through = require('through2');
var port = process.argv[2] || 3003;

function build() {
  return graft().pipe(through.obj(function(req, enc, cb) {
    var result = req.msg.a + req.msg.b;
    req.msg.returnChannel.end(result);
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
