
'use strict';

function wrapMessage(msg, channel) {
  // better be sure that these does not get overwritten
  delete msg._session;
  delete msg._channel;

  Object.defineProperty(msg, '_session', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: channel._session
  });

  Object.defineProperty(msg, '_channel', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: channel
  });

  return msg;
}

module.exports = wrapMessage;
