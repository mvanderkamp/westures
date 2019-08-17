/*
 * Test file for the westures index.
 */

/* global expect, describe, test */

'use strict';

const Westures = require('../index.js');

describe('Westures', () => {
  test('should be instantiated', () => {
    expect(Westures).toBeTruthy();
  });

  test('should have constructors for all of the gestures', () => {
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

