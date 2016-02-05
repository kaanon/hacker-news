module.exports = {
  devtool: 'source-map',
  entry: {
    'hackernews': './js/app.js',
  },
  output: {
    filename: './js/[name].js',
    sourceMapFilename: './[name].map?_v=[hash]',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/,  loader: 'babel-loader' },
      { test: /\.jsx$/, loader: 'babel?presets[]=react,presets[]=es2015' }
    ]
  }
};
