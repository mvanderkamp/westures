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
      'Point2D',
    ];
    expect(Object.keys(Westures)).toEqual(expect.arrayContaining(gestures));
  });
});

