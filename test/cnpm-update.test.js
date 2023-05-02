const path = require('node:path');
const coffee = require('coffee');

const cnpm = path.join(__dirname, '..', 'bin', 'cnpm');
const fixtures = path.join(__dirname, 'fixtures');

describe('test/cnpm-update.test.js', () => {
  const root = path.join(fixtures, 'update-package');
  it('should ignore bug version', async () => {
    await coffee.fork(cnpm, [
      'update',
    ], {
      cwd: root,
    })
      .debug()
      .expect('stdout', /\[npmupdate] removing/)
      .expect('stdout', /\[npmupdate] reinstall on /)
      .expect('code', 0)
      .end();
    await coffee.fork(cnpm, [
      'update',
      '--offline',
    ], {
      cwd: root,
    })
      .debug()
      .expect('stderr', /npminstall WARN running on offline mode/)
      .expect('stdout', /\[npmupdate] removing/)
      .expect('stdout', /\[npmupdate] reinstall on /)
      .expect('code', 0)
      .end();
  });
});
