'use strict';

var expect    = require('must');
var graft     = require('../graft');
var through   = require('through2');
var Readable  = require('readable-stream').Readable;

module.exports = function allTransportTests(buildServer, buildClient) {
  var instance;
  var client;

  beforeEach(function() {
    instance = buildServer();
    client = buildClient(instance);
  });

  afterEach(function closeServer(done) {
    instance.close(function() {
      done();
    });
  });

  afterEach(function closeClient(done) {
    client.close(function() {
      done();
    });
  });

  it('should receive a message', function(done) {
    instance.pipe(through.obj(function(msg, enc, cb) {
      expect(msg.hello).to.eql('world');
      expect(msg._session).to.exist();
      expect(msg._channel).to.exist();
      cb();
      done();
    }));

    client.write({ hello: 'world' });
  });

  it('should receive 50 messages', function(done) {
    var count = 0;
    var i;
    var max = 50;
    instance.pipe(through.obj(function(req, enc, cb) {
      count++;
      cb();
      if (count === max) {
        done();
      }
    }));

    for (i = 0; i < max; i++) {
      client.write({ hello: 'world' });
    }
  });

  it('should pass the same session', function(done) {
    var session;

    instance.pipe(through.obj(function(req, enc, cb) {
      if (!session) {
        session = req._session;
      } else {
        expect(req._session).to.be(session);
        done();
      }
      cb();
    }));

    client.write({ hello: 'world' });
    client.write({ hello: 'world' });
  });

  it('should support a return channel', function(done) {
    var returnChannel = client.ReadChannel();

    instance.pipe(through.obj(function(msg, enc, cb) {
      var chan = msg.returnChannel;
      delete msg.returnChannel;
      chan.end(msg, cb);
    }));

    client.write({
      hello: 'world',
      returnChannel: returnChannel
    });

    returnChannel.pipe(through.obj(function(msg, enc, cb) {
      expect(msg.hello).to.eql('world');
      cb();
      done();
    }));
  });

  it('should support unpiping a piped instance', function(done) {
    var instance2 = graft();

    var dest = through.obj(function(msg, enc, cb) {
      expect(msg.hello).to.eql('world');
      client.end();
      cb();
    });

    instance.pipe(instance2);
    instance2.pipe(dest);
    instance2.on('unpipe', function() { done(); });

    client.write({ hello: 'world' });
  });

  it.skip('should support piping to a return channel', function(done) {
    var returnChannel = client.ReadChannel();
    var instance2 = graft();
    var dest = through.obj(function(msg, enc, cb) {
      instance2.pipe(msg.returnChannel);
      cb();
    });

    instance.where({topic: 'subscribe'}, dest);

    returnChannel.on('unpipe', function() { done(); });

    client.write({
      hello: 'world',
      returnChannel: returnChannel
    });

    returnChannel.pipe(through.obj(function(msg, enc, cb) {
      expect(msg.hello).to.eql('world');
      client.end();
      cb();
    }));
  });

  it('should support a second write channel', function(done) {
    var moreChannel = client.WriteChannel();

    instance.pipe(through.obj(function(msg, enc, cb) {
      var chan = msg.moreChannel;
      chan.pipe(through.obj(function(msg, enc, cb) {
        expect(msg.more).to.eql('message');
        cb();
        done();
      }));
      cb();
    }));

    client.write({
      hello: 'world',
      moreChannel: moreChannel
    });

    moreChannel.write({ 'more': 'message' });
  });

  it('should be pipeable in another graft instance', function(done) {
    var instance2 = graft();
    var session;
    var channel;

    instance2
      .pipe(through.obj(function(msg, enc, cb) {
        expect(msg.hello).to.eql('world');
        expect(msg._session).to.be(session);
        expect(msg._channel).to.be(channel);
        done();
        cb();
      }));

    instance
      .pipe(through.obj(function(msg, enc, cb) {
        session = msg._session;
        channel = msg._channel;
        this.push(msg);
        cb();
      }))
      .pipe(instance2);


    client.write({ hello: 'world' });
  });

  it('should support sending a Readable to the other side', function(done) {
    var readable = new Readable();

    readable._read = function() {
      this.push('hello world');
      this.push(null);
    };

    client.write({ bin: readable });

    instance.pipe(through.obj(function(msg, enc, cb) {
      msg.bin.pipe(through(function(chunk, enc, cb) {
        expect(chunk.toString()).to.eql('hello world');
        done();
        cb();
      }));
      cb();
    }));
  });
};
