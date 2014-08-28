
var expect  = require('must');
var graft   = require('../graft');
var through = require('through2');

describe('memory graft', function() {
  it('should receive a message', function(done) {
    var instance = graft()

    instance.pipe(through.obj(function(req, enc, cb) {
      expect(req.msg).to.eql({ hello: 'world' });
      expect(req.session).to.exist();
      expect(req.channel).to.exist();
      cb();
      done();
    }));

    instance.write({ hello: 'world' })
  });

  it('should pass the same session', function(done) {
    var instance = graft()
    var session

    instance.pipe(through.obj(function(req, enc, cb) {
      if (!session) {
        session = req.session;
      } else {
        expect(req.session).to.be(session);
        done();
      }
      cb();
    }));

    instance.write({ hello: 'world' })
    instance.write({ hello: 'world' })
  });

  it('should support a return channel', function(done) {
    var instance      = graft();
    var returnChannel = instance.createReadChannel();

    instance.pipe(through.obj(function(req, enc, cb) {
      var chan = req.msg.returnChannel;
      delete req.msg.returnChannel;
      chan.end(req.msg, cb);
    }));

    instance.write({
      hello: 'world',
      returnChannel: returnChannel
    });

    returnChannel.pipe(through.obj(function(msg, enc, cb) {
      expect(msg).to.eql({ hello: 'world' });
      cb();
      done();
    }))
  });

  it('should support a second write channel', function(done) {
    var instance    = graft();
    var moreChannel = instance.createWriteChannel();

    instance.pipe(through.obj(function(req, enc, cb) {
      var chan = req.msg.moreChannel;
      chan.pipe(through.obj(function(msg, enc, cb) {
        expect(msg).to.eql({ more: 'message' });
        cb();
        done();
      }));
      cb();
    }));

    instance.write({
      hello: 'world',
      moreChannel: moreChannel
    });

    moreChannel.write({ 'more': 'message' })
  });

  it('should be pipeable in another graft instance', function(done) {
    var instance  = graft()
    var instance2 = graft()
    var session;
    var channel;

    instance2
      .pipe(through.obj(function(req, enc, cb) {
        expect(req.msg).to.eql({ hello: 'world' });
        expect(req.session).to.be(session);
        expect(req.channel).to.be(channel);
        done();
        cb();
      }));

    instance
      .pipe(through.obj(function(req, enc, cb) {
        session = req.session;
        channel = req.channel;
        this.push(req);
        cb();
      }))
      .pipe(instance2);


    instance.write({ hello: 'world' })
  });
});
