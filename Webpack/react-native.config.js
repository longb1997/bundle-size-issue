module.exports = {
  commands: require('@callstack/repack/commands'),
  assets: ['./src/assets/fonts/'], // stays the same
  project: {
    ios: {},
    android: {},
  },
  reactNativePath: './node_modules/react-native',
};
