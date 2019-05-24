TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 60000
MOCHA_OPTS =

install:
	@npm install --registry=https://r.npm.taobao.org

autod: install
	@./node_modules/.bin/autod -w --prefix "~" \
		-e build \
		-d npm,pangyp \
		-D jshint,mocha

jshint: install
	@./node_modules/.bin/jshint .

test: install
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

totoro:
	@totoro --runner test/cnpm.test.js -b 'windowsXP/node/0.10,windowsXP/node/0.11,linux/node/0.10,linux/node/0.11'

.PHONY: test
