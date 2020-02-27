const fs = require('fs');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const OUTPUT_DIR = '../dist';
const PROJECT_NAME = 'storybook-stencil-example';

module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/addon-notes/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
  ],
  async webpackFinal(config) {
    config.entry.push(path.join(__dirname, OUTPUT_DIR, `${PROJECT_NAME}.js`));
    fs.readdirSync(
      path.join(__dirname, OUTPUT_DIR, 'collection/components')
    ).map(file => {
      jsFilePath = path.join(
        __dirname,
        OUTPUT_DIR,
        `collection/components/${file}/${file}.js`
      );
      try {
        if (fs.existsSync(jsFilePath)) {
          config.entry.push(jsFilePath);
        }
      } catch (err) {
        console.error(err);
      }

      cssFilePath = path.join(
        __dirname,
        OUTPUT_DIR,
        `collection/components/${file}/${file}.css`
      );
      try {
        if (fs.existsSync(cssFilePath)) {
          config.entry.push(cssFilePath);
        }
      } catch (err) {
        console.error(err);
      }
    });

    config.plugins.push(
      new CopyPlugin([
        {
          from: '**/*',
          to: './',
          context: 'dist',
        },
      ])
    );

    config.plugins.push(new WriteFilePlugin());

    return config;
  },
};
