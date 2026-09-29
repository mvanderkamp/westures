'use strict';

/**
 * Headless entry point for Westures. Re-exports everything from the main
 * module but provides a Region subclass that defaults `headless: true`.
 *
 * When imported via the `"node"` condition (i.e. `require('westures')` or
 * `import ... from 'westures'` in a Node.js process), consumers get this
 * build automatically. They can still override headless mode by passing
 * `{ headless: false }` explicitly.
 *
 * @module westures/headless
 */

const base = require('./index.js');

class Region extends base.Region {
  constructor(element, options = {}) {
    super(element, { headless: true, ...options });
  }
}

module.exports = { ...base, Region };
