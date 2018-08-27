'use strict';

/**
 * @file Tap.js
 * Tests Tap class
 */
const Tap = require('./../../src/gestures/Tap.js');

/** @test {Tap} */
describe('Tap', function() {
  it('should be instantiated', function() {
    expect(Tap).to.not.equal(null);
  });

  it('should return a Tap object.', function() {
    let _tap = new Tap();
    expect(_tap instanceof Tap).to.be.true;
  });

  it('should return accept delay and number of inputs as parameters',
    function() {
      let _tap = new Tap({
        maxDelay: 2000,
        numInputs: 2,
      });
      expect(_tap.maxDelay).to.equal(2000);
      expect(_tap.numInputs).to.equal(2);
    });
});
