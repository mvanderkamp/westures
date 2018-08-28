'use strict';

/**
 * @file utils.js
 * Tests the user-facing API, ensuring the object functions
 * while not exposing private members.
 */

const util = require('./../../src/core/util.js');

/** @test {util} */
describe('util', function() {
  test('should be instantiated', function() {
    expect(util).toBeTruthy();
  });
});

/** @test {util.normalizeEvent} */
describe('util.normalizeEvent', function() {
  test('should expect to emit start', function() {
    expect(util.normalizeEvent[ 'mousedown' ]).toEqual('start');
    expect(util.normalizeEvent[ 'touchstart' ]).toEqual('start');
  });

  test('should expect to emit move', function() {
    expect(util.normalizeEvent[ 'mousemove' ]).toEqual('move');
    expect(util.normalizeEvent[ 'touchmove' ]).toEqual('move');
  });

  test('should expect to emit end', function() {
    expect(util.normalizeEvent[ 'mouseup' ]).toEqual('end');
    expect(util.normalizeEvent[ 'touchend' ]).toEqual('end');
  });

  test('should expect to emit null for unknown events', function() {
    expect(util.normalizeEvent[ 'foobar' ]).toBeUndefined();
  });
});

/** @test {util.isWithin} */
describe('util.isWithin', function() {
  test('should expect be true when points are within a tolerance', function() {
    expect(util.isWithin(0, 0, 0, 0, 10)).toBe(true);
    expect(util.isWithin(10, 10, 10, 10, 0)).toBe(true);
    expect(util.isWithin(0, -10, 9, 0, 10)).toBe(true);
  });

  test('should expect be false when points are outside a tolerance', function() {
    expect(util.isWithin(0, 0, 0, 0, -1)).toBe(false);
    expect(util.isWithin(10, 10, 20, 20, 0)).toBe(false);
  });
});

/** @test {util.distanceBetweenTwoPoints} */
describe('util.distanceBetweenTwoPoints', function() {
  test('should return a distance of 5', function() {
    expect(util.distanceBetweenTwoPoints(0, 4, 0, 3)).toEqual(5);
  });

  test('should return a distance of 0', function() {
    expect(util.distanceBetweenTwoPoints(0, 0, 0, 0)).toEqual(0);
  });

  test('should return a distance of 0', function() {
    expect(util.distanceBetweenTwoPoints('foo', 0, 0, 0)).toBe(NaN);
  });
});

/** @test {util.getAngle} */
describe('util.getAngle', function() {
  test('should return an angle of PI/4', function() {
    expect(util.getAngle(0, 0, 3, 3)).toBeCloseTo(Math.PI / 4);
  });

  test('should return an angle of 0', function() {
    expect(util.getAngle(0, 0, 0, 0)).toBeCloseTo(0);
  });

  test('should return an angle of PI', function() {
    expect(util.getAngle(0, 0, -3, 0)).toBeCloseTo(Math.PI);
  });
});

