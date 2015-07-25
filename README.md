__Warning: This library is under active development, and should not be considered production ready__

![Graft](https://rawgit.com/GraftJS/graft.io/master/static/images/graft_logo.svg)

The [Graft project](http://graft.io) explores what the web could become, if we extended microservice architectures into the client.

  * <a href="#motivation">Motivation</a>
  * <a href="#api">API</a>
  * <a href="#libchan">About LibChan</a>
  * <a href="#contributors">Contributors</a>
  * <a href="#license">License</a>

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/GraftJS/graft?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

__Interested in Graft and jsChan?__ Watch @mcollina presentation at [NodeConf.eu 2014](http://nodeconf.eu/), ["Full Stack Through Microservices"](https://github.com/mcollina/nodeconfeu-2014-full-stack-through-microservices)

Motivation
----------

When you graft something, it involves joining together parts to create a new whole.
One that is hopefully more adaptable, resilient and ultimately interesting.

> "Instead of pretending everything is a local function even over the network ..., what if we did it the other way around?
> Pretend your components are communicating over a network even when they aren't?"
>   -- Docker's [Solomon Hykes](http://github.com/shykes) on [LibChan](http://github.com/docker/libchan) - [[link]](https://news.ycombinator.com/item?id=7874317)

### [Explore our concepts and influences](http://wayfinder.co/pathways/5365c71219e552110093ba31/graft-full-stack-node-js-through-microservices)

---

#### Our Projects

* [__graft__](https://github.com/GraftJS/graft): the library that ties everything together.
* [__jschan__](https://github.com/GraftJS/jschan): our 'standard carrier'. A port of [libchan](https://github.com/Docker/libchan).
* [__aetherboard__](https://github.com/AetherBoard/aetherboard): our 'hello world' demo. A collaborative whiteboard.

#### Our Process

* discover how to connect tools through microservices.
* explore the tools that are already available.
* adapt those that could be integrated.
* innovate to build those that don't exist yet.

#### Our Principles

* favor small tools that serve only one purpose, but do so well.
* eschew state, because it only leads to trouble.
* focus on javascript, because it is universal.
* evaluate and document, not prescribe.
* educate.

#### Our Goals

* be the premier javascript implementation of libchan.
* be completely supported for node.js as soon as possible.
* use Node.JS streams to replicate the semantics of Go Channels.
* be functional and usable on the browser as we test the waters.
* use virtual stream objects to provide an api similar to [Gulp](http://gulpjs.org).
* attempt control flow abstractions similar to [HighlandJS](http://highlandjs.org).
* experiment, document and learn.

---

<a name="api"></a>

API
---

  * <a href="#graft"><code><b>graft()<b></code></a>
  * <a href="#graft.ReadChannel"><code>graft.<b>ReadChannel()</b></code></a>
  * <a href="#graft.WriteChanel"><code>graft.<b>WriteChanel()</b></code></a>
  * <a href="#graft.branch"><code>graft.<b>branch()</b></code></a>
  * <a href="#graft.where"><code>graft.<b>where()</b></code></a>
  * <a href="#request">Request Interface</a>
  * <a href="#spdyclient"><code>spdy.<b>client()</b></code></a>
  * <a href="#spdyserver"><code>spdy.<b>server()</b></code></a>
  * <a href="#wsclient"><code>ws.<b>client()</b></code></a>
  * <a href="#wsserver"><code>ws.<b>server()</b></code></a>

-------------------------------------------------------

<a name="graft"></a>
### graft()

The main object of this library. A `Graft` instance is a
[`Transform`](http://nodejs.org/api/stream.html#stream_class_stream_transform)
stream with `objectMode: true`.
The objects on the _output_ of a `Graft` instance are
[Request](#request)s. On the input side, you can write just _normal JS
objects_, and everything else you can [write to a jsChan
channel](https://github.com/GraftJS/jschan#what-can-we-write-as-a-message).
These objects will be automatically wrapped up in a [Request](#request).

Internally, each `Graft` instance is backed by
[jschan.memorySession()`](https://github.com/GraftJS/jschan#memorySession).

In order to process the requests, you can just:

```js
var graft = require('graft')();
var through = require('through2');

graft.pipe(through.obj(function(msg, enc, cb) {
  console.log(msg); // prints { hello: 'world' }
  // process your request
  cb();
}));

graft.write({ hello: 'world' });

```

<a name="graft.ReadChannel"></a>
#### graft.ReadChannel()

Returns a nested read channel, this channel will wait for data from the
other party.

<a name="graft.WriteChannel"></a>
#### graft.WriteChannel()

Returns a nested write channel, this channel will buffer data up until
is received by the other party.

<a name="graft.branch"></a>
#### graft.branch(function(req), stream)

Passes the request to the first argument, and if that returns a _truthy_
value, it calls `write(req)` on the associated stream.
It respect backpressure.

<a name="graft.where"></a>
#### graft.where(obj, stream)

Shortcut for the most common usage of `graft.branch()`, it allows to
rewrite:

```js
graft.branch(function(msg) {
  return msg.hello === 'world'
}, stream)
```

into:

```js
graft.where({ hello: 'world' }, stream)
```

-------------------------------------------------------

<a name="request"></a>
### Request Interface

Each __Graft__ request is the _first message sent on a top-level channel_, and it is composed of:

* all the properties of the message
* __`_channel`__, the associated channel
* __`_session`__, the associated session

Each request will have its own channel, but the session is generic for
every client.

The `_channel` and `_session` properties will not be enumerable.

-------------------------------------------------------

<a name="spdyclient"></a>
### spdy.client()

Creates a new spdy client to pipe to:

```js
var graft = require('graft')();
var spdy = require('graft/spdy');

graft.pipe(spdy.client({ port: 12345 }));

graft.write({ hello: 'world' });
```

-------------------------------------------------------

<a name="spdyserver"></a>
### spdy.server()

Creates a new spdy server that you can pipe to a graft instance:

```js
var graft = require('graft')();
var spdy = require('graft/spdy');
var through = require('through2');

spdy
  .server({ port: 12345 })
  .pipe(graft)
  .pipe(through.obj(function(msg, enc, cb) {
    console.log(msg); // prints { hello: 'world' }
    // process your request
    cb();
  }));
```

-------------------------------------------------------

<a name="wsclient"></a>
### ws.client()

Creates a new ws client to pipe to:

```js
var graft = require('graft')();
var ws = require('graft/ws');

graft.pipe(ws.client({ port: 12345 }));

graft.write({ hello: 'world' });
```

It works even from a Browser, using
[WebPack](http://npm.im/webpack) or [Browserify](http://npm.im/browserify).

-------------------------------------------------------

<a name="wsserver"></a>
### ws.server()

Creates a new ws server that you can pipe to a graft instance:

```js
var graft = require('graft')();
var ws = require('graft/ws');
var through = require('through2');

ws
  .server({ port: 12345 })
  .pipe(graft)
  .pipe(through.obj(function(msg, enc, cb) {
    console.log(msg); // prints { hello: 'world' }
    // process your request
    cb();
  }));
```

You can even pass an existing http server that will be hooked up, like
so:

```js
var graft   = require('graft');
var ws      = require('graft/ws');
var http    = require('http');
var server  = http.createServer();

ws
  .server({ server: server })
  .pipe(graft())
```

<a name="libchan"></a>
About LibChan
-------------

Libchan is the connective tissue to all our endeavours. It is a microservices library announced by the Docker project,
and it is going to form the basis of all of the tools they build in the future.

It's most unique characteristic is that it replicates the semantics of go channels across network connections, while allowing for nested channels to be transferred in messages. This would let you to do things like attach a reference to a remote file on an HTTP response, that could be opened on the remote end for reading or writing.

The protocol uses SPDY as it's default transport with MSGPACK as it's default serialization format. Both are able to be switched out, with http1+websockets and protobuf fallbacks planned.

While the RequestResponse pattern is the primary focus, Asynchronous Message Passing is still possible, due to the low level nature of the protocol.

<a name="contributors"></a>
Contributors
------------

* [Adrian Rossouw](http://github.com/Vertice) - Co-Founder
* [Peter Elgers](https://github.com/pelger) - Co-Founder
* [Matteo Collina](https://github.com/mcollina) - Co-Founder


<a name="license"></a>
License
-------

MIT
