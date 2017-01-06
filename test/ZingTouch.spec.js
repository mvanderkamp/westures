import ZingTouch from './../src/ZingTouch.js';

/** @test {ZingTouch} */
describe('ZingTouch', function() {
  it('should be instantiated', function() {
    expect(ZingTouch).to.not.equal(null);
  });

  it('should have constructors for all of the gestures', function() {
    let gestures = [
      'Expand',
      'Gesture',
      'Pan',
      'Pinch',
      'Rotate',
      'Swipe',
      'Tap',
    ];
    Object.keys(ZingTouch).forEach((key) => {
      expect(gestures.indexOf(key) !== -1);
    });
  });
});
