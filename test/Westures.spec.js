const Westures = require('../index.js');

/** @test {Westures} */
describe('Westures', function() {
  test('should be instantiated', function() {
    expect(Westures).toBeTruthy();
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
    expect(Object.keys(Westures)).toMatchObject(gestures);
  });
});

