### Graft


Graft is a node.js / javascript implementation of [Docker](http://docker.io)'s [libchan](https://github.com/docker/libchan) microservices library.
__This project is currently looking for contributors with experience in the relevant technologies.__

About LibChan
=============

It's most unique characteristic is that it replicates the semantics of go channels across network connections, while allowing for nested channels to be transferred in messages. This would allow you to send a file attached to an HTTP response, and being able to open the file on the remote end for reading or writing.  

The protocol uses SPDY as it's default transport with MSGPACK as it's default serialization format. Both are able to be switched out, with http1+websockets and protobuf fallbacks planned.  

While the RequestResponse pattern is primarily catered for, Asynchronous Message Passing is still possible, due to the low level nature of the protocol.  
[Solomon Hykes](http://github.com/shykes) (the author of libchan and Docker) eloquently stated that microservices differed from traditional SOA in that :   
> instead of pretending everything is a local function even over the network (which turned out to be a bad idea), what if we did it the other way around? Pretend your components are communicating over a network even when they aren't.

We want Graft to
================
* be the premier javascript implementation of libchan.
* be completely supported for node.js as soon as possible.
* use Node.JS streams to replicate the semantics of Go Channels.
* be functional and usable on the browser as we test the waters.
* use virtual stream objects to provide an api similar to [Gulp](http://gulpjs.org).
* attempt control flow abstractions similar to [HighlandJS](http://highlandjs.org).

Contributors
============

[Adrian Rossouw](http://github.com/Vertice)

    * CTO of [Wayfinder](http://wayfinder.co)
    * Co-Founder of [Graft](http://graft.io)
    * Founder of [Aegir](http://communityproject.org)
    * [Former Drupal Core Developer](https://drupal.org/node/956624)
    
[Peter Elgers](https://github.com/pelger)

    * VP of Engineering at [Nearform](http://nearform.com)
    * Co-Founder of [Graft](http://graft.io)
    
[Matteo Collina](https://github.com/mcollina)

    * Contributor to [Graft](http://graft.io)
    * Founder of [mosca](https://github.com/mcollina/mosca)
    * Founder of [levelgraph](https://github.com/mcollina/levelgraph)
    * Founder of [Ponte](https://github.com/eclipse/ponte)
