var NODE_ENV = process.env.NODE_ENV || 'development';
var webpack = require("webpack");
var config = {
	context: __dirname + '/src',
	entry : {
		build : "./kiwoom-helper.js"
	},
	output: {
		filename : NODE_ENV === "production" ? "kiwoom-helper.min.js" : "kiwoom-helper.js",
		path: __dirname + "/dist"
	},
	devtool: NODE_ENV === "production" ? "source-map" : "inline-source-map",
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				query: {
					presets: [
						"es2015"
					]
				}
			}
		]
	},
	plugins: [
	]
};

if (NODE_ENV === 'production') {
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
		  compress: {
		    warnings:     false,
		    drop_console: true
		  },
		})
	);
}
module.exports = config;