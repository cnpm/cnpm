'use strict';

const debug = require('debug')('cnpm:run-npminstall-script');
const cp = require('child_process');

module.exports = (bin, args = [], options = {}) => {
  args.unshift('--china');
  args.unshift('--fix-bug-versions');

  options.stdio = [
    process.stdin,
    process.stdout,
    process.stderr,
    'ipc',
  ];
  options.env = Object.assign({}, process.env, options.env);
  options.cwd = options.cwd || process.cwd();

  debug('%s %s', bin, args.join(' '));

  const child = cp.fork(bin, args, options);

  child.on('exit', code => {
    process.exit(code);
  });

  return child;
};
