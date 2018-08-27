'use strict';

/**
 * @file Region.spec..js
 * Tests Region class
 */
const Region = require('./../../../src/core/classes/Region.js');
const Binder = require('./../../../src/core/classes/Binder.js');

/** @test {Region} */
describe('Region', function() {
  test('should be instantiated', function() {
    expect(Region).toBeTruthy();
  });
});

/** @test {Region.bind} */
describe('Region.bind(element)', function() {
  let region = new Region(document.body);
  test('should exist', function() {
    expect(region.bind).toBeDefined();
  });

  test('should throw an error if the element parameter is invalid', function() {
    expect(function() {
      region.bind({});
    }).toThrow('Bind must contain an element');
  });

  test(`should return a chainable Binder object if only an element parameter is
   provided`, function() {
    let ztBound = region.bind(document.body);
    expect(ztBound).toBeInstanceOf(Binder);
  });

  test(`should return a chainable Binder object that contains all of the
   registered gestures`, function() {
    let ztBound = region.bind(document.body);
    let registeredGestures = Object.keys(region.state.registeredGestures);
    for (let gesture in ztBound) {
      if (gesture !== 'element') {
        expect(registeredGestures).toContain(gesture);
      }
    }
  });
});
