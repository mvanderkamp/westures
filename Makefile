
.PHONY: release lint fix parcel tags docs

lint:
	npx eslint src;

release: lint parcel docs tags

fix:
	npx eslint src --fix;

parcel:
	npx parcel build 'index.js';

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

