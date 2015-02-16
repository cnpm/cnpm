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

## Install

```bash
$ npm install cnpm -g
```

If you're in China, maybe you should install it from our [China mirror](https://npm.taobao.org):

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
 --disturl=http://npm.example.com/dist \
 --registryweb=http://npm.example.com \
 --cache=$HOME/.mynpm/.cache \
 --userconfig=$HOME/.mynpmrc'
```

## License

[MIT](LICENSE.txt)
