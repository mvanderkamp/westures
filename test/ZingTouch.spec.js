import {ZingTouch} from './../src/ZingTouch.js';

/** @test {ZingTouch} */
describe('ZingTouch', function () {

  it('should be instantiated', function () {
    expect(ZingTouch).to.not.equal(null);
  });

  it('should have constructors for all of the gestures', function () {

    var gestures = ['Expand', 'Gesture', 'Pan', 'Pinch', 'Rotate', 'Swipe', 'Tap'];
    for (var key in ZingTouch) {
      expect(gestures.indexOf(key) !== -1);
    }
  });

});
