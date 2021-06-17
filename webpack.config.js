const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const PACKAGE_JSON = require("./package.json");

const isProd = process.argv[process.argv.indexOf("--mode") + 1] === "production";

module.exports = {
  entry: ["./src/index.mjs"],
  context: __dirname,
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "gcp-resource-manager.js",
    publicPath: "/dist/",
    library: "gcp-resource-manager",
    globalObject: "this",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.json*$/,
        exclude: /node_modules/,
        use: {
          loader: "json-loader"
        }
      }
    ]
  },
  stats: "errors-only",
  devtool: isProd ? false : "source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(PACKAGE_JSON.version),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
