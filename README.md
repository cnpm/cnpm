cnpm
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]

[npm-image]: https://img.shields.io/npm/v/cnpm.svg?style=flat
[npm-url]: https://npmjs.org/package/cnpm
[travis-image]: https://img.shields.io/travis/cnpm/cnpm.svg?style=flat
[travis-url]: https://travis-ci.org/cnpm/cnpm
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat
[gittip-url]: https://www.gittip.com/fengmk2/
[david-image]: https://img.shields.io/david/cnpm/cnpm.svg?style=flat
[david-url]: https://david-dm.org/cnpm/cnpm

![logo](https://raw.github.com/cnpm/cnpmjs.org/master/logo.png)

cnpm: npm client for [cnpmjs.org](http://cnpmjs.org)

__CNPM is base on npm v2.0, so there is a breaking change for [prefix "^"](https://github.com/npm/node-semver/pull/92).__

## Install

```bash
$ npm install cnpm -g
```

If you're in China, maybe you should install it from our China mirror:

```bash
$ npm install cnpm -g --registry=https://registry.npm.taobao.org
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
$ alias mynpm='cnpm --registry=http://registry.npm.example.com \
 --disturl=https://npm.example.com/dist \
 --registryweb=http://npm.example.com \
 --cache=$HOME/.mynpm/.cache \
 --userconfig=$HOME/.mynpmrc'
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
