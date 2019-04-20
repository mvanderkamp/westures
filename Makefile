
.PHONY: core lint fix bundle tags docs min

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

redoc:
	mv docs/styles/custom.css .;
	rm -rf docs;
	mkdir -p docs/styles;
	mv custom.css docs/styles/;
	npx jsdoc -c .jsdocrc.json;

tags:
	ctags -R src;

min:
	npx terser bundle.js \
	--compress \
	--mangle \
	--output bundle.min.js;

