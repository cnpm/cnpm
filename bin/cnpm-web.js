#!/usr/bin/env node

const utils = require('../lib/utils');
const argv = require('../lib/parse_argv')();

utils.openurl(argv.registryweb);
