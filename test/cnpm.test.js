'use strict';

var spawn = require('cross-spawn');
var should = require('should');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var coffee = require('coffee');
var cnpm = path.join(__dirname, '..', 'bin', 'cnpm');
var fixtures = path.join(__dirname, 'fixtures');
var cwd = path.join(fixtures, 'foo');

var RUN_ON_CI = process.env.CI;

function run(args, callback) {
  return spawn('node', args, {
    cwd: cwd,
  }).on('exit', callback);
}

describe('test/cnpm.test.js', () => {
  after(() => {
    fse.removeSync(path.join(cwd, 'node_modules'));
  });

  it('should version', () => {
    return coffee.fork(cnpm, [ '-v' ])
      .debug()
      .expect('stdout', /cnpm@\d+\.\d+\.\d+ \(/)
      .expect('code', 0)
      .end();
  });

  it('should show all cnpm config', function (done) {
    var args = [
      cnpm,
      'config',
      'ls',
      '-l'
    ];
    var stdout = '';
    var child = spawn('node', args).on('exit', function (code) {
      code.should.equal(0);
      done();
    });
    child.stdout.pipe(process.stdout);
  });

  it('should user custom registry in userconf', function (done) {
    var args = [
      cnpm,
      '--userconfig=' + path.join(fixtures, 'userconf'),
    ];
    var stdout = '';
    var child = spawn('node', args).on('exit', function (code) {
      stdout.should.containEql('npm command use --registry=http://127.0.0.1/registry');
      code.should.equal(0);
      done();
    });
    child.stdout.on('data', function (data) {
      stdout += data.toString();
    });
  });

  it('should --help user custom registry in userconf', function (done) {
    var args = [
      cnpm,
      '--help',
      '--userconfig=' + path.join(fixtures, 'userconf'),
    ];
    var stdout = '';
    var child = run(args, function (code) {
      stdout.should.containEql('npm command use --registry=http://127.0.0.1/registry');
      code.should.equal(0);
      done();
    });
    child.stdout.on('data', function (data) {
      stdout += data.toString();
    });
  });

  it('should user default registry in userconf dont contain registry', function (done) {
    var args = [
      cnpm,
      '--userconfig=' + path.join(fixtures, 'userconf-no-registry'),
    ];
    var stdout = '';
    var child = run(args, function (code) {
      stdout.should.match(/npm command use --registry=https?:\/\/registry.npm.taobao.org/);
      code.should.equal(0);
      done();
    });
    child.stdout.on('data', function (data) {
      stdout += data.toString();
    });
  });

  it('should ingore custom user config', function (done) {
    var args = [
      cnpm,
      '--help',
      '--ignore-custom-config',
    ];
    var stdout = '';
    var child = run(args, function (code) {
      stdout.should.match(/npm command use --registry=https?:\/\/registry.npm.taobao.org/);
      code.should.equal(0);
      done();
    });
    child.stdout.on('data', function (data) {
      stdout += data.toString();
    });
  });

  it('should install pedding', function (done) {
    var args = [
      cnpm,
      'install',
      'pedding',
    ];
    if (RUN_ON_CI) {
      args.push('--registry=https://registry.npmjs.org');
      args.push('--disturl=none');
      args.push('--userconfig=none');
    }
    run(args, function (code) {
      code.should.equal(0);
      done();
    });
  });


  it('should install cnpm', function (done) {
    var args = [
      cnpm,
      'install',
      'cnpm',
    ];
    if (RUN_ON_CI) {
      args.push('--registry=https://registry.npmjs.org');
      args.push('--disturl=none');
      args.push('--userconfig=none');
    }
    run(args, function (code) {
      code.should.equal(0);
      done();
    });
  });

  it('should install npm', function (done) {
    var args = [
      cnpm,
      'install',
      'npm',
    ];
    if (RUN_ON_CI) {
      args.push('--registry=https://registry.npmjs.org');
      args.push('--disturl=none');
      args.push('--userconfig=none');
    }
    run(args, function (code) {
      code.should.equal(0);
      done();
    });
  });

  it('should show full versions', function (done) {
    var args = [
      cnpm,
      '-v',
    ];
    if (RUN_ON_CI) {
      args.push('--registry=https://registry.npmjs.org');
      args.push('--disturl=none');
      args.push('--userconfig=none');
    }
    var child = run(args, function (code) {
      code.should.equal(0);
      done();
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

  it('should install and pre-build cpp module', function (done) {
    var args = [
      cnpm,
      'install',
      'node-murmurhash',
    ];
    if (RUN_ON_CI) {
      args.push('--registry=https://registry.npmjs.org');
      args.push('--disturl=none');
      args.push('--userconfig=none');
    }
    var child = run(args, function (code) {
      code.should.equal(0);
      done();
    });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

  // WTF? TRAVIS download from taobao npm is too slow! skip this!
  if (!RUN_ON_CI) {
    it('should install node-sass from mirror', function (done) {
      var args = [
        cnpm,
        'install',
        'node-sass',
      ];
      if (RUN_ON_CI) {
        args.push('--registry=https://registry.npmjs.org');
        args.push('--disturl=none');
        args.push('--userconfig=none');
      }
      var child = run(args, function (code) {
        code.should.equal(0);
        fs.existsSync(path.join(cwd, 'node_modules/node-sass'));
        done();
      });
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    });
  }
});
