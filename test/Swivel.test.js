/*
 * Tests Swivel class
 */

/* global expect, describe, test */

'use strict';

const Swivel = require('src/Swivel.js');

describe('Swivel', () => {
  describe('constructor', () => {
    test('Returns a Swivel object', () => {
      expect(new Swivel()).toBeInstanceOf(Swivel);
    });
  });

  describe('phase hooks', () => {
  });

  describe('other prototype methods', () => {
  });
});

