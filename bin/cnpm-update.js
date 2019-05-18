'use strict';

const runscript = require('../lib/run-npminstall-script');
const bin = require.resolve('npminstall/bin/update.js');

runscript(bin);
