import { join } from 'path';
import { readFileSync } from 'fs';

import { bootManager } from '@fiorite/core';
import webpack from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { ChildProcess, exec } from 'child_process';
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin'); // Ding


const argv = process.argv;

const CONFIG_FILE = 'fiorite.json';

const interpreter = argv.shift();
const script = argv.shift();
const command = argv.shift() || 'help';

const config = JSON.parse(
  readFileSync(
    join(process.cwd(), CONFIG_FILE),
    { encoding: 'utf-8' },
    )
);

(async () => {
  // Disable auto-boot in order to consume CLI configuration.
  bootManager.disableAutostart();
  const mainScript = join(process.cwd(), config.main);

  await import(mainScript);

  switch (command.toLowerCase()) {
    case 'help':
      console.log('Help! I need somebody help: io [command]');
      console.log('');
      console.log('Commands:');
      console.log('');
      console.log('help           - Returns the same as you can see at the moment.');
      console.log('start          - Starts application.');
      console.log('build          - Builds your application into a single file.');
      // console.log('new [name]     - Creates new application with specified name.');
      // console.log('init [name]    - Initializes new application with specified name.');
      break;

    case 'start':
      const cache = join(process.cwd(), 'node_modules/.cache/@fiorite/cli');
      let child: ChildProcess;

      // bootManager.boot();
      webpack({
        mode: 'development',
        entry: mainScript,
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader?transpileOnly',
              exclude: /node_modules/,
            },
          ],
        },
        target: 'node',
        resolve: {
          extensions: [ '.tsx', '.ts', '.js' ],
          plugins: [new TsconfigPathsPlugin({
            configFile: join(process.cwd(), 'tsconfig.json'),

          })]
        },
        output: {
          filename: 'main.js',
          path: cache,
        },
        externals: [nodeExternals({
          allowlist: [/^@fiorite\//]
        })],
        // plugins: [
        //   // new NodemonPlugin({
        //   //   script: join(cache, 'main.js'),
        //   //   // What to watch.
        //   //   watch: cache,
        //   //   // Detailed log.
        //   //   verbose: false,
        //   // }),
        // ],
      }).watch({}, (err, stats) => {
        if (err) {
          console.error(err);
        } else {
          console.log('');

          console.log(
            stats.toString({
              version: false,
              modules: false,
              colors: true,
            }),
          );

          console.log('');

          if (child) {
            child.kill(9);
          }

          child = exec(interpreter + ' ' + join(cache, 'main.js'));
          child.stdout!.pipe(process.stdout);
          child.stderr!.pipe(process.stderr);
        }
      });
      break;

    case 'build':
      const distScript = join(process.cwd(), config.outDir);

      webpack({
        mode: 'production',
        entry: mainScript,
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
          ],
        },
        target: 'node',
        resolve: {
          extensions: [ '.tsx', '.ts', '.js' ],
          plugins: [new TsconfigPathsPlugin({
            configFile: join(process.cwd(), 'tsconfig.json'),
          })]
        },
        output: {
          filename: 'main.js',
          path: distScript,
        },
        externals: [nodeExternals({
          allowlist: [/^@fiorite\//]
        })],
      }).run((err, stats) => {
        if (err) {
          console.error(err);
        } else {
          console.log(stats.compilation.errors);
        }
      });

      break;
  }
})();

// console.log(argv);
