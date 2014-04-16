cnpm
=======

[![NPM](https://nodei.co/npm/cnpm.png?downloads=true&stars=true)](https://nodei.co/npm/cnpm/)

![logo](https://raw.github.com/cnpm/cnpmjs.org/master/logo.png)

cnpm: npm client for [cnpmjs.org](http://cnpmjs.org)

## Install

```bash
$ npm install cnpm -g --registry=http://r.cnpmjs.org
```

If you're in China, maybe you should download it from our China CDN:

```bash
$ wget http://dist.u.qiniudn.com/cnpm/cnpm-latest.tgz
$ tar zxvf cnpm-latest.tgz
$ ./cnpm/bin/cnpm install anything
```

## Usage

Support all commands just like `npm`.

### Sync packages from `npm`

```bash
$ cnpm sync [moduleName]
```

### Open package document or git web url

```bash
$ cnpm doc [name]
$ cnpm doc -g [name] # open git web url directly
```

## Build your own private registry npm cli

```bash
$ npm install cnpm -g

# then alias it
$ alias tnpm='cnpm --registry=http://registry.npm.example.com \
 --disturl=http://dist.cnpmjs.org \
 --registryweb=http://npm.example.com \
 --cache=$HOME/.npm/.cache/tnpm \
 --userconfig=$HOME/.tnpmrc'

# or put this in your .zshrc / .bashrc
$ echo "alias tnpm='cnpm --registry=http://registry.npm.example.com \
 --disturl=http://dist.cnpmjs.org \
 --registryweb=http://npm.example.com \
 --cache=$HOME/.npm/.cache/tnpm \
 --userconfig=$HOME/.tnpmrc'" >> $HOME/.zshrc && source $HOME/.zshrc
```

## License

(The MIT License)

Copyright(c) cnpmjs.org and other contributors.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
