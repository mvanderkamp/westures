'use strict';

/**
 * @files Point2D.js
 *
 * Tests the Point2D class.
 */

const Point2D = require('../../../src/core/classes/Point2D.js');

let origin;
beforeEach(() => {
  origin = new Point2D(0,0);
});

/** @test {add} */
describe('add(point)', () => {
  test('returns the addition of two points', () => {
    const pt = new Point2D(42,5);
    const res = origin.add(pt);
    expect(res).toMatchObject(pt);
    
    const dbl = res.add(pt);
    expect(dbl).toMatchObject({x: 84, y: 10});
  });
});

/** @test {distanceTo} */
describe('distanceTo', () => {
  test('gives the correct distance', () => {
    const pt = new Point2D(3,4);
    expect(origin.distanceTo(pt)).toBe(5);
    expect(origin.distanceTo(origin)).toBe(0);
  });
});

/** @test {getAngle} */
describe('getAngle', () => {
  test('gives the correct angle', () => {
    const pt = new Point2D(3,3);
    expect(origin.angleTo(pt)).toBeCloseTo(Math.PI/4);
    expect(origin.angleTo(origin)).toBe(0);
  });
});

