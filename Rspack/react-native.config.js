const webpackCommands = require('@callstack/repack/commands/rspack');
// avoid overriding default commands from community-cli-plugin
const commands = webpackCommands.filter(cmd => cmd.name.startsWith('webpack'));

module.exports = {
  commands: commands,
  assets: ['./src/assets/fonts/'], // stays the same
};
