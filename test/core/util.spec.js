'use strict';

/**
 * @file util.js
 * Tests the user-facing API, ensuring the object functions while not exposing
 * private members.
 */

const util = require('../../src/core/util.js');

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

