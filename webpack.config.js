var webpack = require("webpack");
module.exports = {
	context: __dirname + '/src',
	entry : {
		build : "./kiwoom-helper.js"
	},
	output: {
		filename : "kiwoom-helper.js",
		path: __dirname + "/dist"
	},
	devtool: "source-map",
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
	}
};