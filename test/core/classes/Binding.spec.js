/**
 * @file Binding.js
 * Tests Binding class
 */
import Binding from './../../../src/core/classes/Binding.js';
import Gesture from './../../../src/gestures/Gesture.js';

/** @test {Binding} */
describe('Binding', function () {
  var gesture = new Gesture();
  var element = document.createElement('div');
  var binding = new Binding(element, gesture, function () {}, false, false);

  it('should be instantiated', function () {
    expect(Binding).to.not.equal(null);
  });

  it('should have an element as a member', function () {
    expect(binding.element).to.exist;
  });

  it('should have an Gesture as a member', function () {
    expect(binding.gesture).to.be.an.instanceof(Gesture);
  });

  it('should have an function as a member', function () {
    expect(binding.handler).to.be.an.instanceof(Function);
  });

});
