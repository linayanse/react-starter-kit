var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
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
    app: path.resolve(__dirname, 'src/index.js'),
    // 分离第三方
    vendors: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[hash].js'
  },
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
        loader: 'url-loader?limit=65536&name=images/[name].[hash].[ext]'
      },
      // Fonts
      {
        test: /\.(woff2?|otf|eot|svg|ttf)$/i,
        loader: 'url?name=fonts/[name].[hash].[ext]'
      },
      // LESS & CSS
      // TODO SourceMap
      // 全局样式
      {
        test: /\.less$/,
        include: path.resolve(__dirname, 'src/styles'),
        loader: ExtractTextPlugin.extract(['css', 'postcss', 'less?sourceMap'])
      },
      // 组件样式
      {
        test: /\.less$/,
        exclude: path.resolve(__dirname, 'src/styles'),
        loader: ExtractTextPlugin.extract([cssLoaderConfig, 'postcss', 'less?sourceMap'])
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract([cssLoaderConfig, 'postcss'])
      },
      // Babel
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          /**
           * 规则
           * ES7 stage-2: http://babeljs.io/docs/plugins/preset-stage-2/
           */
          presets: ['es2015', 'react', 'stage-2'],
          plugins: ['transform-runtime'],
          cacheDirectory: true
        }
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
    new ExtractTextPlugin('app.[hash].css'),
    new CleanWebpackPlugin('build'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'build/index.html'),
      template: path.resolve(__dirname, 'src/template.html')
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments:false
      },
      compressor: {
        warnings: false
      }
    }),
    definePlugin
  ]
};
