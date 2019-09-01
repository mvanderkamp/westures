/*
 * Tests Tap class
 */

/* global expect, describe, test */

'use strict';

const Tap = require('src/Tap.js');

describe('Tap', () => {
  describe('constructor', () => {
    test('Returns a Tap object', () => {
      expect(new Tap()).toBeInstanceOf(Tap);
    });

    test('Accepts delay and number of taps as options parameters', () => {
      const tap = new Tap(null, null, {
        maxDelay:  2000,
        numTaps:   2,
      });
      expect(tap.maxDelay).toEqual(2000);
      expect(tap.numTaps).toEqual(2);
    });
  });

  describe('phase hooks', () => {
  });

  describe('other prototype methods', () => {
  });
});

