** Warning: This library is under active development, and should not be considered production ready **

![Graft](https://rawgit.com/GraftJS/graft.io/master/static/images/graft_logo.svg)

The [Graft project](http://graft.io) explores what the web could become, if we extended microservice architectures into the client.  

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

#### About LibChan

Libchan is the connective tissue to all our endeavours. It is a microservices library announced by the Docker project,
and it is going to form the basis of all of the tools they build in the future.

It's most unique characteristic is that it replicates the semantics of go channels across network connections, while allowing for nested channels to be transferred in messages. This would let you to do things like attach a reference to a remote file on an HTTP response, that could be opened on the remote end for reading or writing.  

The protocol uses SPDY as it's default transport with MSGPACK as it's default serialization format. Both are able to be switched out, with http1+websockets and protobuf fallbacks planned.  

While the RequestResponse pattern is the primary focus, Asynchronous Message Passing is still possible, due to the low level nature of the protocol.  

---

#### Contributors

[Adrian Rossouw](http://github.com/Vertice)

* CTO of [Wayfinder](http://wayfinder.co)
* Co-Founder of [Graft](http://graft.io) project.
* Founder of [Aegir](http://communityproject.org) project.
* Founder of [Waif](http://github.com/wayfin/waif) project.
* [Former Drupal Core Developer](https://drupal.org/node/956624)

[Peter Elgers](https://github.com/pelger)

* VP of Engineering at [Nearform](http://nearform.com).
* Co-Founder of [Graft](http://graft.io) project.

[Matteo Collina](https://github.com/mcollina)

* Co-Founder of [Graft](http://graft.io)
* Founder of [Mosca](https://github.com/mcollina/mosca) project.
* Founder of [Levelgraph](https://github.com/mcollina/levelgraph) project.
* Founder of [Ponte](https://github.com/eclipse/ponte) project.
