'use strict';

const open = require('open');

exports.openurl = function(url) {
  open(url, function(err, stdout, stderr) {
    if (err) {
      console.log('Can not open browser, please open your browser to visit: ' + url);
      process.exit(0);
    }
    if (stdout || stderr) {
      console.log(stdout, stderr);
    }
    process.exit(0);
  });
};
