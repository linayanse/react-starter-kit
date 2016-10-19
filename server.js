var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config');
var compiler = webpack(config)

new WebpackDevServer(compiler, {
  hot: true,
  historyApiFallback: true,
  color: true,
  stats: { colors: true }
}).listen(7070, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:7070/');
});
