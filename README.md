### Graft

The Graft project is formed to explore the possibilities of a web where servers and clients are able to communicate freely through a microservices architecture. 

> "instead of pretending everything is a local function even over the network (which turned out to be a bad idea), what if we did it the other way around? Pretend your components are communicating over a network even when they aren't."  
> [Solomon Hykes](http://github.com/shykes) (of Docker fame) on LibChan - [[link]](https://news.ycombinator.com/item?id=7874317)

Our first task is to build out [jsChan](http://github.com/GraftJS/jschan): a node/js implementation of [Docker](http://docker.io)'s [libchan](https://github.com/docker/libchan) library.

__This project is currently looking for contributors with experience in the relevant technologies.__

#### About LibChan

It's most unique characteristic is that it replicates the semantics of go channels across network connections, while allowing for nested channels to be transferred in messages. This would let you to do things like attach a reference to a remote file on an HTTP response, that could be opened on the remote end for reading or writing.  

The protocol uses SPDY as it's default transport with MSGPACK as it's default serialization format. Both are able to be switched out, with http1+websockets and protobuf fallbacks planned.  

While the RequestResponse pattern is the primary focus, Asynchronous Message Passing is still possible, due to the low level nature of the protocol.  


#### We want Graft to

* be the premier javascript implementation of libchan.
* be completely supported for node.js as soon as possible.
* use Node.JS streams to replicate the semantics of Go Channels.
* be functional and usable on the browser as we test the waters.
* use virtual stream objects to provide an api similar to [Gulp](http://gulpjs.org).
* attempt control flow abstractions similar to [HighlandJS](http://highlandjs.org).

#### Contributors

[Adrian Rossouw](http://github.com/Vertice)

* CTO of [Wayfinder](http://wayfinder.co)
* Co-Founder of [Graft](http://graft.io) project.
* Founder of [Aegir](http://communityproject.org) project.
* [Former Drupal Core Developer](https://drupal.org/node/956624)

[Peter Elgers](https://github.com/pelger)

* VP of Engineering at [Nearform](http://nearform.com).
* Co-Founder of [Graft](http://graft.io) project.

[Matteo Collina](https://github.com/mcollina)

* Contributor to [Graft](http://graft.io)
* Founder of [Mosca](https://github.com/mcollina/mosca) project.
* Founder of [Levelgraph](https://github.com/mcollina/levelgraph) project.
* Founder of [Ponte](https://github.com/eclipse/ponte) project.
