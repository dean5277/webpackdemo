const path = require('path')
const glob = require('glob')
const webpack = require("webpack")
const cleanWebpackPlugin = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const purifyCssWebpack = require("purifycss-webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const extractTextPlugin = require("extract-text-webpack-plugin")
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  mode: 'development',
  entry: {
    demo: './src/views/demo.js',
    jquery: 'jquery'
  },
  output: {
    path:path.resolve(__dirname, 'dist'),
    // 打包多出口文件
    // 生成 a.bundle.js  b.bundle.js  jquery.bundle.js
    filename: './js/[name].bundle.js'
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': resolve('src')
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    host: "localhost",
    port: 8083,
    open: true,
    compress: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: "/node_modules/"
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
            loader: "url-loader",
            options: {
              limit: 50,
              outputPath: "images"
            }
          }
        ]
      },

    ]
  },
  plugins: [
  new webpack.HotModuleReplacementPlugin(),
    // 调用之前先清除
    new cleanWebpackPlugin(["dist"]),
    // 4.x之前可用uglifyjs-webpack-plugin用以压缩文件，4.x可用--mode更改模式为production来压缩文件
    // new uglifyjsWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: 'static',
        ignore: ['.*']
      }
    ]),
    new purifyCssWebpack({
      // glob为扫描模块，使用其同步方法
      paths: glob.sync(path.join(__dirname, "src/views/*.html"))
    }),
    // 分离css插件参数为提取出去的路径
    new extractTextPlugin("css/index.css"),
    // 全局暴露统一入口
    new webpack.ProvidePlugin({
      $: "jquery"
    }),
    // 自动生成html模板
    new HtmlWebpackPlugin({
      filename: "demo.html",
      title: "demo",
      chunks: ['demo',"jquery"],  // 按需引入对应名字的js文件
      template: "./src/views/demo.html"
    })
  ],
  // 提取js，lib1名字可改
  optimization: {
    splitChunks: {
      cacheGroups: {
        lib1: {
          chunks: "initial",
          name: "jquery",
          enforce: true
        }
      }
    }
  }
}
