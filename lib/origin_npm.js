const debug = require('node:util').debuglog('cnpm:origin');
const cp = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const match = require('auto-correct');
const spawn = require('cross-spawn');
const config = require('./config');
const parseArgv = require('./parse_argv');

const program = parseArgv();
const rawArgs = program.rawArgs.slice(2);
const args = [];
let isInstall = false;
let isUpdate = false;
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
  if (i === 0 && (arg === 'update')) {
    isUpdate = true;
    continue;
  }

  // support `$ cnpm i --by=npm`
  if (arg.indexOf('--by=') === 0) {
    installer = arg.split('=', 2)[1];
    continue;
  }

  args.push(arg);
}

const env = Object.assign({}, process.env);
const CWD = process.cwd();

args.unshift('--registry=' + program.registry);
if (program.disturl) {
  args.unshift('--disturl=' + program.disturl);
}

if (program.userconfig) {
  args.unshift('--userconfig=' + program.userconfig);
}

if (program.proxy) {
  debug('use program.proxy: %s', program.proxy);
  args.unshift('--proxy=' + program.proxy);
} else if (config.proxy) {
  debug('use config.proxy: %s', config.proxy);
  args.unshift('--proxy=' + config.proxy);
}

let npmBin;
let execMethod = spawn;
const stdio = [
  process.stdin,
  process.stdout,
  process.stderr,
];

if (isInstall) {
  npmBin = path.join(__dirname, '..', 'node_modules', '.bin', installer);
  if (installer === 'npminstall') {
    // use fork to spawn can fix install cnpm itself fail on Windows
    execMethod = cp.fork;
    stdio.push('ipc');
    npmBin = require.resolve('npminstall/bin/install.js');
    args.unshift('--china');
    args.unshift('--fix-bug-versions');
  } else {
    // other installer, like npm
    args.unshift('install');
  }
  // maybe outside installer, just use installer as binary name
  if (!fs.existsSync(npmBin)) {
    npmBin = installer;
  }
} else if (isUpdate) {
  execMethod = cp.fork;
  stdio.push('ipc');
  npmBin = require.resolve('npminstall/bin/update.js');
  args.unshift('--china');
  args.unshift('--fix-bug-versions');
} else {
  // https://github.com/npm/cli/issues/2491
  // bundleDeps will not auto create node_modules/.bin/npm-cli
  // cnpm run dev will failed in corepack
  npmBin = path.join(require.resolve('npm'), '..', 'bin', 'npm-cli.js');
}

debug('%s %s', npmBin, args.join(' '));

const child = execMethod(npmBin, args, {
  env,
  cwd: CWD,
  stdio,
});

child.on('exit', code => {
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
