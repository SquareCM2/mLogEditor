const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Base config that applies to either development or production mode.
const config = {
  entry: './src/index.js',
  output: {
    // Compile the source files into a bundle.
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  // Enable webpack-dev-server to get hot refresh of the app.
  devServer: {
    static: {
        directory: path.resolve(__dirname, 'public'),
    },
    hot: true,
    liveReload: true,
    open: true, // 可选，自动打开浏览器
  },
    resolve: {
	alias: {
		// 精准映射 'process/browser' 到实际文件
		'process/browser': require.resolve('process/browser.js')
	},
      fallback: {
        // 全部设为 false，无需安装 polyfill 包（适用于浏览器端应用）
        fs: false,
        path: require.resolve("path-browserify"),
        os: require.resolve("os-browserify/browser"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        zlib: false,
        http: false,
        https: false,
        url: false,
        assert: false,
        constants: false,
        tty: false,
        vm: false,
        buffer: false,
        querystring: false,
        v8: false,
        worker_threads: false,
        child_process: false,
        module: false,
      },
    },
  module: {
    rules: [
      {
        // Load CSS files. They can be imported into JS files.
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // Generate the HTML index page based on our template.
    // This will output the same index page with the bundle we
    // created above added in a script tag.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
	new HtmlWebpackPlugin({ template: 'src/index.html' }),
	new webpack.ProvidePlugin({
	    process: 'process/browser',
	}),
	new CopyWebpackPlugin({
	    patterns: [
	      { from: 'public/media', to: 'media' }, // 复制媒体文件到输出目录
	      // 如果还有 favicon.ico 等，也可以复制
	      { from: 'public/favicon.ico', to: 'favicon.ico' },
	    ],
	  }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // Set the output path to the `build` directory
    // so we don't clobber production builds.
    config.output.path = path.resolve(__dirname, 'build');

    // Generate source maps for our code for easier debugging.
    // Not suitable for production builds. If you want source maps in
    // production, choose a different one from https://webpack.js.org/configuration/devtool
    config.devtool = 'eval-cheap-module-source-map';

    // Include the source maps for Blockly for easier debugging Blockly code.
    config.module.rules.push({
      test: /(blockly[/\\].*\.js)$/,
      use: [require.resolve('source-map-loader')],
      enforce: 'pre',
    });

    // Ignore spurious warnings from source-map-loader
    // It can't find source maps for some Closure modules and that is expected
    config.ignoreWarnings = [/Failed to parse source map.*blockly/, 
		/Critical dependency:/,
		/Module not found.*@swc\/html/,
      /Module not found.*(uglify-js|@swc\/core|esbuild|@minify-html\/node|lightningcss|@swc\/css|cssnano|csso|inspector)/];
  }
  return config;
};
