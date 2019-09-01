/*
 * Tests Swipe class
 */

/* global expect, describe, test */

'use strict';

const Swipe = require('src/Swipe.js');

describe('Swipe', () => {
  describe('constructor', () => {
    test('Returns a Swipe object', () => {
      expect(new Swipe()).toBeInstanceOf(Swipe);
    });
  });

  describe('phase hooks', () => {
  });

  describe('other prototype methods', () => {
  });
});

