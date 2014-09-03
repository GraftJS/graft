
'use strict';

var graft = require('../../graft')();
var ws    = require('../../ws');
var ret   = graft.ReadChannel();

graft.pipe(ws.client({ port: 3000 }));

graft.write({
  a: 2,
  b: 2,
  returnChannel: ret
});

ret.on('data', function(msg) {
  alert(msg);
});
