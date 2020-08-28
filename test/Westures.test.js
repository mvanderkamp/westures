/*
 * Test file for the westures index.
 */

/* global expect, describe, test */

'use strict';

const westures = require('index.js');
const core = require('core/index.js');


describe('westures', () => {
  test('has constructors for all of the gestures', () => {
    const gestures = [
      'Gesture',
      'Pan',
      'Pinch',
      'Press',
      'Pull',
      'Rotate',
      'Swipe',
      'Swivel',
      'Tap',
      'Track',
    ];
    expect(Object.keys(westures)).toEqual(expect.arrayContaining(gestures));
  });

  test('includes all of westures-core', () => {
    const coreKeys = Object.keys(core);
    expect(Object.keys(westures)).toEqual(expect.arrayContaining(coreKeys));
  });
});

