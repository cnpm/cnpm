'use strict';

var debug = require('debug')('cnpm:config');
var path = require('path');
var fs = require('fs');
var cp = require('child_process');

var root;
if (process.platform === 'win32') {
  root = process.env.USERPROFILE || process.env.APPDATA || process.env.TMP || process.env.TEMP;
} else {
  root = process.env.HOME || process.env.TMPDIR || '/tmp';
}

var prefix = null;
try {
  prefix = cp.execSync('npm config get prefix').toString().trim();
} catch (err) {
  // ignore it
  debug('npm config cli error: %s', err);
}

module.exports = {
  cnpmHost: 'https://npm.taobao.org',
  cnpmRegistry: 'https://registry.npm.taobao.org',
  disturl: 'https://npm.taobao.org/mirrors/node', // download dist tarball for node-gyp
  iojsDisturl: 'https://npm.taobao.org/mirrors/iojs',
  cache: path.join(root, '.cnpm'),  //cache folder name
  userconfig: path.join(root, '.cnpmrc'),
  proxy: '',
  prefix: prefix,
};
