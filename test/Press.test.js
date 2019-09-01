/*
 * Tests Press class
 */

/* global expect, describe, test */

'use strict';

const Press = require('src/Press.js');

describe('Press', () => {
  describe('constructor', () => {
    test('Returns a Press object', () => {
      expect(new Press()).toBeInstanceOf(Press);
    });
  });

  describe('phase hooks', () => {
  });

  describe('other prototype methods', () => {
  });
});

