const path = require('path')
const glob = require('glob')
const webpack = require("webpack")
const cleanWebpackPlugin = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const purifyCssWebpack = require("purifycss-webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const entries = getEntry('./src/views/*.js')
const extractTextPlugin = require("extract-text-webpack-plugin")
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  mode: 'production',
  entry: entries,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: 'static'
  },
  plugins: [
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
    // 分离css插件参数为提取出去的路径
    new extractTextPlugin("css/index.css"),
    // 全局暴露统一入口
    new webpack.ProvidePlugin({
      $: "jquery"
    })
]
}

function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;

  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    tmp = entry.split('/').splice(-3);
    pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
    entries[pathname] = entry;
  });
  console.log("dev-entrys:");
  console.log(entries);
  return entries;
}

var pages = getEntry('./src/views/*.html');
console.log("dev pages----------------------");
for (var pathname in pages) {
  console.log("filename:" + pathname + '.html');
  console.log("template:" + pages[pathname]);
  // 配置生成的html文件，定义路径等
  var conf = {
    filename: pathname.split('/')[1] + '.html',
    template: pages[pathname], // 模板路径
    minify: { //传递 html-minifier 选项给 minify 输出
      removeComments: true
    },
    inject: 'body', // js插入位置
    chunks: [pathname, "vendor", "manifest"] // 每个html引用的js模块，也可以在这里加上vendor等公用模块
  };
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
  module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}