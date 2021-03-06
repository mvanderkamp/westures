
.PHONY: default release lint fix parcel tags docs coverage

default: lint

lint:
	npx eslint src;
	npx eslint test;
	npx eslint index.js;

release: lint parcel docs tags

fix:
	npx eslint src --fix;
	npx eslint test --fix;
	npx eslint index.js --fix;

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

coverage:
	npx jest --coverage && cat ./coverage/lcov.info | npx coveralls
