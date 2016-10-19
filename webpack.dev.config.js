var path = require('path');
var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// CSS Loader配置 启用CSS Modules、驼峰命名
var cssLoaderConfig = 'css?camelCase&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]';
// 环境变量
var definePlugin = new webpack.DefinePlugin({
  // 开发
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  // 内测
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});
// TODO 代码分隔

module.exports = {
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:7070',
      'webpack/hot/dev-server',
      path.resolve(__dirname, 'src/index.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  devServer: {
    port: 7070
  },
  devtool: 'cheap-module-eval-source-map',
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        loaders: ['eslint']
      }
    ],
    loaders: [
      // Images
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=65536&name=images/[name].[ext]'
      },
      // Fonts
      {
        test: /\.(woff2?|otf|eot|svg|ttf)$/i,
        loader: 'url?name=fonts/[name].[ext]'
      },
      // LESS & CSS
      // TODO SourceMap
      // 全局样式
      {
        test: /\.less$/,
        include: path.resolve(__dirname, 'src/styles'),
        loaders: ['style', 'css', 'postcss', 'less?sourceMap']
      },
      // 组件样式
      {
        test: /\.less$/,
        exclude: path.resolve(__dirname, 'src/styles'),
        loaders: ['style', cssLoaderConfig, 'postcss', 'less?sourceMap']
      },
      {
        test: /\.css$/,
        loaders: ['style', cssLoaderConfig, 'postcss']
      },
      // Babel
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        /**
         * 规则
         * ES7 stage-2: http://babeljs.io/docs/plugins/preset-stage-2/
         */
        loaders: ['react-hot', 'babel']
      }
    ]
  },
  postcss: function () {
    return [require('autoprefixer')];
  },
  resolve: {
    // 略写文件扩展名
    extensions: ['', '.js', '.json']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new OpenBrowserPlugin({url: 'http://localhost:7070'}),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'build/index.html'),
      template: path.resolve(__dirname, 'src/template.html')
    }),
    definePlugin
  ]
};
