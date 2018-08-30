'use strict';

/**
 * @files Point2D.js
 *
 * Tests the Point2D class.
 */

const Point2D = require('../../../src/core/classes/Point2D.js');

describe('Constructor', () => {
  test('does not throw an error given valid input', () => {
    expect(() => new Point2D(0,0)).not.toThrow();
  });

  test('returns a valid instance', () => {
    expect(new Point2D(0,0)).toBeInstanceOf(Point2D);
  });

  test('Defaults to the origin (0,0) if no parameters given', () => {
    expect(new Point2D()).toMatchObject({x:0, y:0});
  });

  test('Uses the given parameters', () => {
    expect(new Point2D(42,-89)).toMatchObject({ x:42, y:-89 });
  });
});

describe('Prototype methods', () => {
  let origin;

  beforeEach(() => {
    origin = new Point2D(0,0);
  });

  describe('add(point)', () => {
    test('returns the addition of two points', () => {
      const pt = new Point2D(42,5);
      const res = origin.add(pt);
      expect(res).toMatchObject(pt);

      const dbl = res.add(pt);
      expect(dbl).toMatchObject({x: 84, y: 10});
    });
  });

  describe('angleTo(point)', () => {
    test('gives the correct angle', () => {
      const pt = new Point2D(3,3);
      expect(origin.angleTo(pt)).toBeCloseTo(Math.PI/4);
      expect(origin.angleTo(origin)).toBe(0);
    });
  });

  describe('clone()', () => {
    test('Returns a clone of the given point', () => {
      const pt = origin.clone();
      expect(pt).toMatchObject(origin);
      expect(pt === origin).toBe(false);

      const off = new Point2D(42, -89);
      const cln = off.clone();
      expect(cln).toMatchObject(off);
      expect(cln === off).toBe(false);
    });
  });

  describe('distanceTo(point)', () => {
    test('gives the correct distance', () => {
      const pt = new Point2D(3,4);
      expect(origin.distanceTo(pt)).toBe(5);
      expect(origin.distanceTo(origin)).toBe(0);
    });
  });
});

