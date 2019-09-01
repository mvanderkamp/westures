/*
 * Tests Rotate class
 */

/* global expect, describe, test */

'use strict';

const Rotate = require('src/Rotate.js');

describe('Rotate', () => {
  describe('constructor', () => {
    test('Returns a Rotate object', () => {
      expect(new Rotate()).toBeInstanceOf(Rotate);
    });
  });

  describe('phase hooks', () => {
  });

  describe('other prototype methods', () => {
  });
});

