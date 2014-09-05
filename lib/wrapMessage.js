
'use strict';

function wrapMessage(msg, channel) {
  // better be sure that these does not get overwritten
  delete msg._session;
  delete msg._channel;

  var proto = {
    _session: channel._session,
    _channel: channel
  };

  var newMsg = Object.create(proto);

  for (var key in msg) {
    if (msg.hasOwnProperty(key)) {
      newMsg[key] = msg[key];
    }
  }

  return newMsg;
}

module.exports = wrapMessage;
