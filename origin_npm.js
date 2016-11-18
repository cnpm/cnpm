'use strict';

const debug = require('debug')('cnpm:origin');
const match = require('auto-correct');
const spawn = require('cross-spawn');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const parseArgv = require('./parse_argv');

const program = parseArgv();
const rawArgs = program.rawArgs.slice(2);
const args = [];
let isInstall = false;
let installer = 'npminstall';

for (let i = 0; i < rawArgs.length; i++) {
  let arg = rawArgs[i];
  if (arg[0] !== '-') {
    arg = correct(arg);
  }
  if (i === 0 && (arg === 'i' || arg === 'install')) {
    isInstall = true;
    continue;
  }

  // support `$ cnpm i --by=npm`
  if (arg.indexOf('--by=') === 0) {
    installer = arg.split('=', 2)[1];
    continue;
  }

  args.push(arg);
}

var CWD = process.cwd();

if (program.userconfig && !fs.existsSync(program.userconfig)) {
  // make sure userconfig exists
  // or it will throw: npm ERR! Error: default value must be string or number
  fs.writeFileSync(program.userconfig, 'email =\n');
}

args.unshift('--registry=' + program.registry);
if (program.disturl) {
  args.unshift('--disturl=' + program.disturl);
}
if (program.userconfig) {
  args.unshift('--userconfig=' + program.userconfig);
}
if (program.proxy) {
  args.unshift('--proxy=' + program.proxy);
}

var npmBin;

if (isInstall) {
  npmBin = path.join(__dirname, 'node_modules', '.bin', installer);
  if (installer === 'npminstall') {
    args.unshift('--china');
  } else {
    // other installer, like npm
    args.unshift('install');
  }
  // maybe outside installer, just use installer as binary name
  if (!fs.existsSync(npmBin)) {
    npmBin = installer;
  }
} else {
  npmBin = path.join(__dirname, 'node_modules', '.bin', 'npm');
}

debug('%s %s', npmBin, args.join(' '));

const env = Object.assign({}, process.env);

const npm = spawn(npmBin, args, {
  env: env,
  cwd: CWD,
  stdio: [
    process.stdin,
    process.stdout,
    process.stderr,
  ]
});

npm.on('exit', (code, signal) => {
  process.exit(code);
});

function correct(command) {
  const cmds = [
    'install',
    'publish',
    'adduser',
    'author',
    'config',
    'unpublish',
  ];
  for (const cmd of cmds) {
    if (match(command, cmd)) {
      return cmd;
    }
  }
  return command;
}
