/*
 * Tests Pan class
 */

/* global expect, describe, test */

'use strict';

const Pan = require('src/Pan.js');

describe('Pan', () => {
  describe('constructor', () => {
    test('Returns a Pan object', () => {
      expect(new Pan()).toBeInstanceOf(Pan);
    });
  });

  describe('phase hooks', () => {
  });

  describe('other prototype methods', () => {
  });
});

