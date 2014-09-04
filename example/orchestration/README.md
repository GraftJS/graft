Orchestration Example
=====================

In order to use this example, you need to use
[Webpack](http://npm.im/webpack):

```bash
cd examples/orchestration
npm install webpack -g
webpack
node adder
node server
```

Point your browser to http://localhost:3000, and you should get an alert
:).

Look at the code, the actual calculation is done by the `adder`
microservice!
