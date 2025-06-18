import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as Repack from '@callstack/repack';
import {createRequire} from 'module';
import {ReanimatedPlugin} from '@callstack/repack-plugin-reanimated';
import {RsdoctorRspackPlugin} from '@rsdoctor/rspack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const resolve = require.resolve;

/**
 * Webpack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about webpack configuration: https://webpack.js.org/configuration/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */
export default env => {
  const {
    mode = 'development',
    context = __dirname,
    entry = './index.js',
    platform = process.env.PLATFORM,
    minimize = mode === 'production',
    devServer = undefined,
  } = env;
  const dirname = Repack.getDirname(import.meta.url);

  if (!platform) {
    throw new Error('Missing platform');
  }
  process.env.BABEL_ENV = mode;

  return {
    mode,
    entry,
    devtool: 'source-map',
    context,
    resolve: {
      ...Repack.getResolveOptions(platform),
      alias: {
        realm$: path.join(
          path.dirname(resolve('realm/package.json')),
          'dist/platform/react-native/index.js',
        ),
        'node-emoji$': new URL(
          './node_modules/node-emoji/src/index.ts',
          import.meta.url,
        ).pathname,
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    output: {
      uniqueName: 'expense',
    },
    optimization: {
      minimize,
      chunkIds: 'named',
    },
    module: {
      rules: [
        ...Repack.getJsTransformRules(),
        ...Repack.getAssetTransformRules(),
        {
          test: /\.jsx?$/,
          type: 'javascript/auto',
          include: Repack.getModulePaths([
            '@react-native-masked-view',
            'rn-fetch-blob',
          ]),
          use: {
            loader: '@callstack/repack/flow-loader',
            options: {all: true},
          },
        },
        {
          test: /\.[jt]sx?$/,
          type: 'javascript/auto',
          exclude: [/node_modules/],
          use: {
            loader: 'builtin:swc-loader',
            options: {
              env: {
                targets: {'react-native': '0.76.9'},
              },
              jsc: {
                parser: {
                  syntax: 'typescript',
                  jsx: true,
                  dynamicImport: true,
                  decorators: true,
                  topLevelAwait: true,
                },
                assumptions: {
                  setPublicClassFields: true,
                  privateFieldsAsProperties: true,
                },
                externalHelpers: true,
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
        },
        {
          test: Repack.getAssetExtensionsRegExp(
            Repack.ASSET_EXTENSIONS.filter(ext => ext !== 'svg'),
          ),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
            },
          },
        },
        {
          test: /\.svg$/,
          include: /assets\/source\//,
          type: 'asset/source',
        },
        {
          test: /\.svg$/,
          include: /assets\/inline\//,
          type: 'asset/inline',
        },
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),

      new Repack.plugins.ModuleFederationPluginV2({
        name: 'rspack',
        filename: 'rspack.container.bundle',
        dts: false,
        exposes: {
          './Root': './App.tsx',
        },
        experiments: {
          externalRuntime: true,
          optimization: {
            disableSnapshot: true,
            target: 'web',
          },
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: '18.3.1',
          },
          'react-native': {
            singleton: true,
            eager: true,
            requiredVersion: '0.76.9',
          },
          'react-native-reanimated': {
            singleton: true,
            eager: true,
            requiredVersion: '3.17.1',
          },
          'react-use': {
            singleton: true,
            eager: true,
            requiredVersion: '^17.4.0',
          },
          'react-use/lib': {
            singleton: true,
            eager: true,
            requiredVersion: '^17.4.0',
          },
          'react-native-safe-area-context': {
            singleton: true,
            eager: true,
            requiredVersion: '^4.4.1',
          },
          'react-native-gesture-handler': {
            singleton: true,
            eager: true,
            requiredVersion: '2.22.1',
          },
          'react-native-screens': {
            singleton: true,
            eager: true,
            requiredVersion: '3.37.0',
          },
          '@react-navigation/native-stack': {
            singleton: true,
            eager: true,
            requiredVersion: '6.10.1',
          },
          '@react-navigation/stack': {
            singleton: true,
            eager: true,
            requiredVersion: '6.4.1',
          },
          '@react-navigation/native': {
            singleton: true,
            eager: true,
            requiredVersion: '6.1.18',
          },
          'react-native-community': {
            singleton: true,
            eager: true,
            requiredVersion: '*',
          },
          'react-native-community/hooks': {
            singleton: true,
            eager: true,
            requiredVersion: '*',
          },
          'node-emoji': {
            singleton: true,
            eager: true,
            requiredVersion: '2.1.0',
          },
          'styled-components': {
            singleton: true,
            eager: true,
            requiredVersion: '5.3.6',
          },
          'styled-components/native': {
            singleton: true,
            eager: true,
            requiredVersion: '5.3.6',
          },
          lodash: {
            singleton: true,
            eager: true,
            requiredVersion: '^4.17.21',
          },
          realm: {
            singleton: true,
            eager: true,
            requiredVersion: '^12.14.1',
          },
          '@react-native-masked-view/masked-view': {eager: true},
          '@gorhom': {singleton: true, eager: true, requiredVersion: '*'},
          '@gorhom/bottom-sheet': {
            singleton: true,
            eager: true,
            requiredVersion: '*',
          },
          'crypto-js': {singleton: true, eager: true, requiredVersion: '*'},
        },
      }),
      new ReanimatedPlugin(),
      process.env.RSDOCTOR &&
        new RsdoctorRspackPlugin({
          // plugin options
        }),
    ],
  };
};
