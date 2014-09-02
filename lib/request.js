

function Request(session, channel, msg) {
  this.session = session;
  this.channel = channel;
  this.msg = msg;
}

module.exports = Request;
