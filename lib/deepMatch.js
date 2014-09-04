
'use strict';

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

module.exports = deepMatch;
