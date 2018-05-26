'use strict';

const os = require('os');
const fs = require('fs');
const program = require('commander');
const config = require('./config');
const pkg = require('../package.json');
const help = require('./help');

let argv = null;

module.exports = cmd => {
  if (!argv) {
    argv = program
      .option('-v, --version', 'show full versions')
      .option('-r, --registry [registry]', 'registry url, default is ' + config.cnpmRegistry)
      .option('-w, --registryweb [registryweb]', 'web url, default is ' + config.cnpmHost)
      .option('--disturl [disturl]', 'dist url for node-gyp, default is ' + config.disturl)
      .option('-c, --cache [cache]', 'cache folder, default is ' + config.cache)
      .option('-u, --userconfig [userconfig]', 'userconfig file, default is ' + config.userconfig)
      .option('-y, --yes', 'yes all confirm')
      .option('--ignore-custom-config', 'ignore custom .cnpmrc')
      .option('--proxy [proxy]', 'set a http proxy, no default');
  }

  if (cmd === 'doc') {
    argv.option('-g, --git', '[doc options] open git url');
  } else if (cmd === 'sync') {
    argv.option('--sync-publish', '[sync options] sync as publish')
      .option('--no-deps', '[sync options] do not sync dependencies and devDependencies');
  }

  // commander's bug, fix here
  // https://github.com/visionmedia/commander.js/pull/189
  let cacheInfo;
  argv.on('cache', function(cache) {
    if (typeof cache === 'string') {
      cacheInfo = cache;
      return;
    }
    argv.args = [ 'cache' ].concat(cache || []);
  });

  argv.on('version', function() {
    console.log('cnpm@%s (%s)%snpm@%s (%s)%snode@%s (%s)%snpminstall@%s (%s)%sprefix=%s %s%s %s %s %sregistry=%s',
      pkg.version,
      __filename,
      os.EOL,
      require('npm/package.json').version,
      require.resolve('npm'),
      os.EOL,
      process.version.substring(1),
      process.execPath,
      os.EOL,
      require('npminstall/package.json').version,
      require.resolve('npminstall'),
      os.EOL,
      config.prefix,
      os.EOL,
      os.platform(),
      os.arch(),
      os.release(),
      os.EOL,
      config.cnpmRegistry
    );
    process.exit(0);
  });

  // custom help message
  // output command help, default options help info will output by default
  argv.on('--help', function() {
    if (!argv.registry) {
      if (argv.ignoreCustomConfig) {
        argv.userconfig = 'none';
      } else {
        argv.userconfig = argv.userconfig || config.userconfig;
      }
      argv.registry = getDefaultRegistry(argv.userconfig);
    }
    help(argv);
  });
  argv.parse(process.argv.slice());

  if (argv.ignoreCustomConfig) {
    argv.userconfig = 'none';
  }

  argv.userconfig = argv.userconfig || config.userconfig;
  if (!argv.registry) {
    // try to use registry in uerconfig
    argv.registry = getDefaultRegistry(argv.userconfig);
  }
  if (!argv.disturl) {
    const isIOJS = process.execPath.indexOf('iojs') >= 0;
    argv.disturl = isIOJS ? config.iojsDisturl : config.disturl;
  }
  if (!argv.proxy) {
    argv.proxy = config.proxy;
  }
  if (argv.disturl === 'none') {
    delete argv.disturl;
  }
  if (argv.userconfig === 'none') {
    delete argv.userconfig;
  }
  argv.registryweb = argv.registryweb || config.cnpmHost;
  argv.cache = cacheInfo || config.cache;

  if (!argv.args.length) {
    help(argv);
  }

  // filter rawArgs
  const rawArgs = argv.rawArgs;
  const needs = [];
  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg.indexOf('--userconfig=') === 0 || arg.indexOf('-u=') === 0) {
      continue;
    }
    if (arg === '--ignore-custom-config') {
      continue;
    }
    if (arg.indexOf('--disturl=') === 0) {
      continue;
    }
    if (arg.indexOf('--registryweb=') === 0 || arg.indexOf('-w=') === 0) {
      continue;
    }
    if (arg.indexOf('--registry=') === 0 || arg.indexOf('-r=') === 0) {
      continue;
    }
    needs.push(arg);
  }
  argv.rawArgs = needs;

  return argv;
};

function getDefaultRegistry(userconfig) {
  if (userconfig !== 'none' && fs.existsSync(userconfig)) {
    const content = fs.readFileSync(userconfig, 'utf8');
    // registry = {registry-url}
    const m = /^registry\s*=\s*(.+)$/m.exec(content);
    if (m) {
      return m[1];
    }
  }
  return config.cnpmRegistry;
}
