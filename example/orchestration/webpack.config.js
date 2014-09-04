module.exports = {
  context: __dirname,
  entry: './client.js',
  output: {
    path: __dirname + '/dist/',
    filename: 'bundle.js',
    publicPath: "/dist/"
  }
};
