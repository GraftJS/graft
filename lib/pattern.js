
'use strict';

var isPlainObject = require('is-plain-object');
var isString      = require('is-string');
var extend        = require('object-extend');
var jsonic        = require('jsonic');

module.exports = function initPattern() {
  var i = 0;
  var args = new Array(arguments.length);

  for (;i < args.length; i++) {
    args[i] = arguments[i];
  }

  for (i = 0; i < args.length; i++) {
    if (isString(args[i])) {
      args[i] = jsonic(args[i]);
    }
    else if (!isPlainObject(args[i])) {
      args[i] = null;
    }
  }

  return extend.apply(null, args);
};
