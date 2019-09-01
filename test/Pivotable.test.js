/*
 * Tests Pivotable class
 */

/* global expect, describe, test */

'use strict';

const Pivotable = require('src/Pivotable.js');

describe('Pivotable', () => {
  describe('constructor', () => {
    test('Returns a Pivotable object', () => {
      expect(new Pivotable()).toBeInstanceOf(Pivotable);
    });
  });

  describe('phase hooks', () => {
  });

  describe('other prototype methods', () => {
  });
});

