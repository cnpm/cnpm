'use strict';

var path = require('path');
var fs = require('fs');
var program = require('commander');

var root;
if (process.platform === 'win32') {
  root = process.env.USERPROFILE || process.env.APPDATA || process.env.TMP || process.env.TEMP;
} else {
  root = process.env.HOME || process.env.TMPDIR || '/tmp';
}

var config = module.exports = {
  cnpmHost: 'https://npm.taobao.org',
  cnpmRegistry: 'https://registry.npm.taobao.org',
  disturl: 'https://npm.taobao.org/mirrors/node', // download dist tarball for node-gyp
  iojsDisturl: 'https://npm.taobao.org/mirrors/iojs',
  cache: path.join(root, '.cnpm'),  //cache folder name
  userconfig: path.join(root, '.cnpmrc'),
  proxy: '',
};
