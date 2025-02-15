const path = require('path');

module.exports = {
  entry: {
    background: '@/background/background.ts',
    update_playback_text: '@/background/update_playback_text.ts',
    content_scripts: '#/main.ts',
    popup: '@/popup/popup.ts',
    settings: '@/settings/settings.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, 'src/content_scripts'),
    },
  },
  // Recommended for Firefox extensions
  optimization: {
    splitChunks: false,
  },
  devtool: 'cheap-source-map',
};
