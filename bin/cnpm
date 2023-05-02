#!/usr/bin/env node

const debug = require('node:util').debuglog('cnpm');
const argv = require('../lib/parse_argv')();

const action = argv.args[0];

const extendsMethd = {
  web: 1,
  check: 1,
  doc: 1,
  sync: 1,
  user: 1,
};

debug('cnpm %s', action);

if (extendsMethd[action]) {
  require('./cnpm-' + action);
} else {
  debug('origin npm with origin registry: $ npm %s', action);
  require('../lib/origin_npm');
}
