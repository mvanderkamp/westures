
.PHONY: core lint fix bundle tags docs

core: lint bundle docs tags

lint:
	npx eslint src;

fix:
	npx eslint src --fix;

bundle:
	npx browserify 'index.js' \
		--standalone westures \
		--outfile 'bundle.js';

docs:
	npx jsdoc -c .jsdocrc.json;

tags:
	ctags -R src;

