/*
 * Tests Pull class
 */

/* global expect, describe, test */

'use strict';

const Pull = require('src/Pull.js');

describe('Pull', () => {
  describe('constructor', () => {
    test('Returns a Pull object', () => {
      expect(new Pull()).toBeInstanceOf(Pull);
    });
  });

  describe('phase hooks', () => {
  });

  describe('other prototype methods', () => {
  });
});

