const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin') 
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {merge} = require('webpack-merge') 
const baseConfig = require('./webpack.config.base.js')

const isDev = process.env.NODE_ENV === 'development'

const defaultPluins = [
	new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new HTMLPlugin(),
    new VueLoaderPlugin()
	]

const devServer = {
	  port: 8000,
	  host:'localhost',
	  overlay: {
	    errors: true,
	  },
	  hot: true
	  //open: true,	
}

let config

if (isDev) {
	config = merge(baseConfig, {
		devtool:'#cheap-module-eval-source-map',
		output:{
			filename:'name.[hash:8].js',
		},
		module:{
			rules:[
				{
				  test: /\.styl/,
				  use: [
				    'style-loader',
				    'css-loader',
				    {
				      loader: 'postcss-loader',
				      options: {
				        sourceMap: true
				      }
				    },
				    'stylus-loader'
				  ]
				},
				{
				  test: /\.css$/i, //i表示大小写不敏感
				  use: [
				    'style-loader',
				    'css-loader'
				  ]
				}
			]
		},
		devServer,
		plugins:defaultPluins.concat([
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		])		
	})


  //config.optimization.noEmitOnErrors = true  // 默认 true

} else {
  // 将不变的js单独打包
  
  config = merge({
	entry:{
		app: path.join(__dirname, '../src/index.js'),
		vendor: ['vue']
	  },
	optimization:{
		runtimeChunk: true,
		splitChunks: {
		  chunks: 'all',
		  cacheGroups: {
					commons: {
						chunks: "initial",
						minChunks: 2,
						maxInitialRequests: 5, // The default limit is too small to showcase the effect
						minSize: 0 // This is example is too small to create commons chunks
					},
					vendor: {
						test: /node_modules/,
						chunks: "initial",
						name: "vendor",
						priority: 10,
						enforce: true
					}
				},
		}
	},
	module:{
		rules:[
			{
			  test: /\.styl/,
			  use: [
			    {
			      loader: MiniCssExtractPlugin.loader,
			    },
			    'css-loader',
			    {
			      loader: 'postcss-loader',
			      options: { sourceMap: true }
			    },
			    'stylus-loader'
			  ]
			},
			{
			  test: /\.css$/i, //i表示大小写不敏感
			  use: [
			    {
			      loader: MiniCssExtractPlugin.loader,
			    },
			    'css-loader',
			  ],
			}
		]
	},
	plugins:defaultPluins.concat([
		new MiniCssExtractPlugin({
		filename: 'styles.[chunkhash:8].css',
		chunkFilename: '[id].css',
		ignoreOrder: false
    })])
  })



}

module.exports = config