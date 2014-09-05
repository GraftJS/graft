
'use strict';

var graft   = require('../');
var expect  = require('must');

describe('.branch', function() {
  var first;
  var second;

  beforeEach(function() {
    first = graft();
    second = graft();
  });

  it('must route matching messages to the second instance', function(done) {
    first
      .branch(function(msg) {
        return msg.hello === 'world';
      }, second)
      .on('data', function() {
        done(new Error('not expected'));
      });

    second.on('data', function(msg) {
      expect(msg.hello).to.eql('world');
      expect(msg.name).to.eql('matteo');
      done();
    });

    first.write({ hello: 'world', name: 'matteo' });
  });

  it('must keep not matching messages on the pipeline', function(done) {
    first
      .branch(function(msg) {
        return msg.hello === 'world';
      }, second)
      .on('data', function(msg) {
        expect(msg.hello).to.equal('matteo');
        done();
      });

    first.write({ hello: 'matteo' });
  });

  it('must stay the same instance', function() {
    var b = first
              .branch(function(msg) {
                return msg.hello === 'world';
              }, second);

    expect(b).to.be(first);
  });

  describe('.where shortcut', function() {

    it('must route matching messages to the second instance', function(done) {
      first
        .where({ hello: 'world' }, second)
        .on('data', function() {
          done(new Error('not expected'));
        });

      second.on('data', function(msg) {
        expect(msg.hello).to.eql('world');
        expect(msg.name).to.eql('matteo');
        done();
      });

      first.write({ hello: 'world', name: 'matteo' });
    });

    it('must keep not matching messages on the pipeline', function(done) {
      first
        .where({ hello: 'world' }, second)
        .on('data', function(msg) {
          expect(msg.hello).to.eql('matteo');
          done();
        });

      first.write({ hello: 'matteo' });
    });

    it('must stay the same instance', function() {
      var b = first.where({ hello: 'world' }, second);

      expect(b).to.be(first);
    });
  });
});

