TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =
VERSION = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

install:
	@npm install --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist

autod: install
	@./node_modules/.bin/autod -w -k npm -e build --prefix "~"
	@$(MAKE) install

jshint: install
	@./node_modules/.bin/jshint .

test: install
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--harmony \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

totoro:
	@totoro --runner test/cnpm.test.js -b 'windowsXP/node/0.10,windowsXP/node/0.11,linux/node/0.10,linux/node/0.11'

build: install
	@rm -rf ./build
	@mkdir -p ./build/cnpm
	@cp -Rf ./bin ./node_modules *.md *.js package.json ./build/cnpm
	@cd ./build && tar -czf cnpm-$(VERSION).tgz ./cnpm
	@qboxrsctl del dist cnpm/cnpm-$(VERSION).tgz
	@qboxrsctl put -c dist cnpm/cnpm-$(VERSION).tgz ./build/cnpm-$(VERSION).tgz
	@qboxrsctl del dist cnpm/cnpm-latest.tgz
	@qboxrsctl cp "dist:cnpm/cnpm-$(VERSION).tgz" "dist:cnpm/cnpm-latest.tgz"
	@echo "download url: http://dist.u.qiniudn.com/cnpm/cnpm-$(VERSION).tgz"

.PHONY: test
