/**!
 * cnpm - config.js
 *
 * Copyright(c) cnpmjs.org and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var path = require('path');

var root;
if (process.platform === 'win32') {
  root = process.env.USERPROFILE || process.env.APPDATA || process.env.TMP || process.env.TEMP;
} else {
  root = process.env.HOME || process.env.TMPDIR || '/tmp';
}

module.exports = {
  cnpmHost: 'http://cnpmjs.org',
  cnpmRegistry: 'http://registry.cnpmjs.org',
  cache: path.join(process.env.HOME, '.npm/.cache/cnpm'),  //cache folder name
  customConfig: path.join(root, '.cnpmrc.json')
};
