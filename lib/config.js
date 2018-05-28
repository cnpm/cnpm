'use strict';

const debug = require('debug')('cnpm:config');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const ini = require('ini');

let root;
if (process.platform === 'win32') {
  root = process.env.USERPROFILE || process.env.APPDATA || process.env.TMP || process.env.TEMP;
} else {
  root = process.env.HOME || process.env.TMPDIR || '/tmp';
}

let prefix = null;
try {
  prefix = cp.execSync('npm config get prefix').toString().trim();
} catch (err) {
  // ignore it
  debug('npm config cli error: %s', err);
}

let proxy = '';
const userconfig = path.join(root, '.cnpmrc');
if (fs.existsSync(userconfig)) {
  let cnpmrc;
  try {
    cnpmrc = ini.parse(fs.readFileSync(userconfig, 'utf-8'));
  } catch (err) {
    console.warn('[cnpm:config] [WARN] read %s ini format error', userconfig);
  }

  if (cnpmrc && cnpmrc.proxy) {
    proxy = cnpmrc.proxy;
  }
}

module.exports = {
  cnpmHost: 'https://npm.taobao.org',
  cnpmRegistry: 'https://registry.npm.taobao.org',
  disturl: 'https://npm.taobao.org/mirrors/node', // download dist tarball for node-gyp
  iojsDisturl: 'https://npm.taobao.org/mirrors/iojs',
  cache: path.join(root, '.cnpm'), // cache folder name
  userconfig,
  proxy,
  prefix,
};
