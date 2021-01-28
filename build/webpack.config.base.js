const path = require('path')

const createVueLoaderOptions = require('./vue-loader.config.js')
const isDev = process.env.NODE_ENV === 'development'

const config = {
  //或者在 package.json 的 scripts 中配置 webpack --mode=development
  //mode: 'development',
  target: 'web',
  entry: path.join(__dirname, '../src/layout/index.js'),
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{
			loader:'vue-loader',
			options:createVueLoaderOptions(isDev)
		}],
		
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
	  {
	    test: /\.js&/,
	    loader: 'babel-loader',
		exclude:/node_modules/
	  },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'resources/[path][name].[hash:8].[ext]'
            }
          }
        ]
      },
    ]
  }
}



module.exports = config