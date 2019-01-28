/**
 * @file Tap.js
 * Tests Tap class
 */

'use strict';

const Tap = require('../src/Tap.js');

/** @test {Tap} */
describe('Tap', function() {
  test('should be instantiated', function() {
    expect(Tap).toBeTruthy();
  });

  test('should return a Tap object.', function() {
    expect(new Tap()).toBeInstanceOf(Tap);
  });

  test('should return accept delay and number of inputs as parameters',
    function() {
      let _tap = new Tap({
        maxDelay: 2000,
        numInputs: 2,
      });
      expect(_tap.maxDelay).toEqual(2000);
      expect(_tap.numInputs).toEqual(2);
    });
});

