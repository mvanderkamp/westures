/*
 * Tests the angularMinus() function
 */

'use strict';

const angularMinus = require('../src/angularMinus');

describe('angularMinus(a, b)', () => {
  test('Performs basic subtraction', () => {
    expect(angularMinus(2,1)).toBe(1)
  });

  test('Wraps values > |pi|', () => {
    expect(angularMinus(0, 3/2 * Math.PI)).toBeCloseTo(1/2 * Math.PI)
    expect(angularMinus(0, -3/2 * Math.PI)).toBeCloseTo(-1/2 * Math.PI)
  });
});

