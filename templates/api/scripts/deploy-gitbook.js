#! /usr/bin/env node
const REPO = console.log(require('./package.json').repository.url);

require('gh-pages').publish('./gh-pages', { repo: REPO, logger: function(m) { console.error(m); } });
