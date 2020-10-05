const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = (ext) => isDev ? `bundle.${ext}` : `bundle[hash].${ext}`
const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ]

  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'), // исходники приложения
  mode: 'development', // если не пишем флаги, то по дефолту dev mode
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'), // js на выходе
    path: path.resolve(__dirname, 'dist'), // куда складываем
  },
  resolve: {
    extensions: ['.js'],
    alias: { // import '../src заменяет на @
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: isDev,
  },
  plugins: [
    new CleanWebpackPlugin(), // чистит папик
    new HTMLWebpackPlugin({
      template: 'index.html', // подключает бандл к html
      minify: {
        removeComments: isProd, // удаление комментов
        collapseWhitespace: isProd, // удалениее пробелов
      },
    }),
    new CopyPlugin({
      patterns: [
        {from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        }, // favicon
      ],
    }),
    new MiniCssExtractPlugin({ // выносит из js css в отдельный файл
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          'css-loader', // Translates CSS into CommonJS
          'sass-loader', // Compiles Sass to CSS
        ],
      },

      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },

    ],
  },
}
