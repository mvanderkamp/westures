/*
 * Tests Tap class
 */

/* global expect, describe, test */

'use strict';

const Tap = require('../src/Tap.js');

describe('Tap', () => {
  test('should be instantiated', () => {
    expect(Tap).toBeTruthy();
  });

  test('should return a Tap object.', () => {
    expect(new Tap()).toBeInstanceOf(Tap);
  });

  test('should return accept delay and number of taps as parameters', () => {
    const tap = new Tap(null, null, {
      maxDelay:  2000,
      numTaps:   2,
    });
    expect(tap.maxDelay).toEqual(2000);
    expect(tap.numTaps).toEqual(2);
  });
});

