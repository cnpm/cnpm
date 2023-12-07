#!/usr/bin/env node

const utils = require('../lib/utils');
const argv = require('../lib/parse_argv')();

const userURL = argv.registryweb + '/~' + argv.args[1];

utils.openurl(userURL);
