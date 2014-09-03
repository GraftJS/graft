Orchestration Example
=====================

In order to use this example, you need to use
[Browserify](http://npm.im/browserify):

```bash
cd examples/orchestration
npm install browserify -g
browserify client.js > bundle.js
node adder
node server
```

Point your browser to http://localhost:3000, and you should get an alert
:).

Look at the code, the actual calculation is done by the `adder`
microservice!
