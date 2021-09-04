const path = require('path');

module.exports = {
  context: path.resolve(__dirname, './'),
  entry: './public/js/main.js',
  devtool: 'source-map',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
      {
        test: /\.xml$/i,
        use: ['xml-loader'],
      },
      {
        test: /\.html$/i,
        use: ['text-loader'],
      },
    ],
  },
  resolveLoader: {
    modules: ['node_modules'],
    alias: {
      // back compatibal with requireJs grammar 'text!templates/contact_info.html'
      text: 'text-loader'
    }
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css", ".html", '...'],
    enforceExtension: false,
    modules: [
      path.join(__dirname, 'public/js'),
      'node_modules'
    ],
    alias: {
      async          : 'async',
      jQuery         : 'jquery',
      ajaxForm       : 'jquery-form',
      imageCrop      : 'jquery-jcrop',
      jqueryui       : 'jquery-ui',
      spinJs         : 'spin',
      ladda          : 'spin/dist/spin.min.js',
      Underscore     : 'underscore',
      Backbone       : 'backbone',
      socketio       : 'socket.io',
      templates      : path.join(__dirname, './public/templates'),
      text           : 'test-loader',
      common         : path.join(__dirname, './public/js/common.js'),
      communication  : path.join(__dirname, './public/js/communication.js'),
      helpers$        : path.join(__dirname, './public/js/helpers.js'),
      helpers        : path.join(__dirname, './public/js/helpers'),
      constants$      : path.join(__dirname, './public/js/constants.js'),
      constants      : path.join(__dirname, './public/js/constants'),
      dateFormat     : path.join(__dirname, './public/js/libs/date.format.js'),
      d3             : path.join(__dirname, './public/js/libs/d3.v3.min.js'),
      topojson       : path.join(__dirname, './public/js/libs/topojson.v0.min/index.js'),
      jqueryBarcode  : path.join(__dirname, './public/js/libs/jquery-barcode.min.js'),
      malihuScrollBar: path.join(__dirname, './public/js/libs/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar'),
      moment         : path.join(__dirname, './public/js/libs/moment/moment.js'),
      backstratch    : path.join(__dirname, './public/js/libs/jquery-backstretch/jquery.backstretch.min.js'),
      wickedpicker   : path.join(__dirname, './public/js/libs/wickedpicker/dist/wickedpicker.min'),
      bxSlider       : path.join(__dirname, './public/js/libs/bxslider-4/dist/jquery.bxslider.min'),
      dragtable      : path.join(__dirname, './public/js/libs/dragtable/jquery.dragtable'),
      gapi           : '//apis.google.com/js/platform'
    }
  }
};
