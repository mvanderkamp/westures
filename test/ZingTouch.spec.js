const ZingTouch = require('./../index.js');

/** @test {ZingTouch} */
describe('ZingTouch', function() {
  test('should be instantiated', function() {
    expect(ZingTouch).toBeTruthy();
  });

  test('should have constructors for all of the gestures', function() {
    const gestures = [
      'Gesture',
      'Pan',
      'Pinch',
      'Rotate',
      'Swipe',
      'Tap',
      'Region',
    ];
    expect(Object.keys(ZingTouch)).toMatchObject(gestures);
  });
});

