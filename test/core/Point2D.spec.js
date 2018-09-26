'use strict';

/**
 * @files Point2D.js
 *
 * Tests the Point2D class.
 */

const Point2D = require('../../src/core/Point2D.js');

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

  describe('averageDistanceTo(points)', () => {
    let left = new Point2D(3,4);
    let right = new Point2D(-3,-4);

    test('gives the correct distance', () => {
      expect(origin.averageDistanceTo([left,right])).toBe(5);
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

  describe('isInside(element)', () => {
    const element = {
      getBoundingClientRect: jest.fn()
    };
    element.getBoundingClientRect.mockReturnValue({
      left: 10,
      top: 30,
      width: 50,
      height: 50,
    });
  
    test('Returns true for points inside the element', () => {
      const tl = new Point2D(10,30);
      const tr = new Point2D(60,30);
      const mid = new Point2D(40,50);
      const br = new Point2D(60,80);
      const bl = new Point2D(10,80);
      const points = [tl,tr,mid,br,bl];
      
      points.forEach( p => {
        expect(p.isInside(element)).toBe(true);
      });
    });
  
    test('Returns false for points outside the element', () => {
      expect(origin.isInside(element)).toBe(false);
    });
  });

  describe('midpointTo(point)', () => {
    test('Returns the midpoint of two points', () => {
      const right = new Point2D(84,90);
      const result = new Point2D(42,45);
      expect(origin.midpointTo(right)).toMatchObject(result);
    });
  });

  describe('subtract(point)', () => {
    test('Returns the subtraction of two points', () => {
      const left = new Point2D(42,45);
      const right = new Point2D(84,100);
      const result = new Point2D(42, 55);
      expect(right.subtract(left)).toMatchObject(result);
    });
  });

  describe('totalDistanceTo(points)', () => {
    let left = new Point2D(3,4);
    let right = new Point2D(-3,-4);
  
    test('gives the correct distance', () => {
      expect(origin.totalDistanceTo([left,right])).toBe(10);
    });
  });
});

describe('Static methods', () => {
  describe('sum(points)', () => {
    test('Returns the origin if given no arguments', () => {
      expect(Point2D.sum()).toMatchObject({x: 0, y: 0});
    });

    test('Returns the origin if given an empty array', () => {
      expect(Point2D.sum([])).toMatchObject({x: 0, y: 0});
    });

    test('Returns the point if given an array of one point', () => {
      const p = new Point2D(42,43);
      expect(Point2D.sum([p])).toEqual(p);
    });

    test('Adds up all the points in an array', () => {
      const p = new Point2D(42,43);
      const q = new Point2D(8,7);
      const r = new Point2D(-5, +5);
      const s = new Point2D(1,2);
      const t = new Point2D(46,57);
      expect(Point2D.sum([p,q,r,s])).toEqual(t);
    });
  });

  describe('midpoint(points)', () => {
    test('Throws an error if given no arguments', () => {
      expect(() => Point2D.midpoint()).toThrow();
    });

    test('Throws an error if given an empty array', () => {
      expect(() => Point2D.midpoint([])).toThrow();
    });

    test('Returns the point if given an array of one point', () => {
      const p = new Point2D(42,43);
      expect(Point2D.midpoint([p])).toEqual(p);
    });

    test('Finds the midpoint of an array of points', () => {
      const p = new Point2D(42,43);
      const q = new Point2D(8,7);
      const r = new Point2D(-5, +5);
      const s = new Point2D(1,2);
      const t = new Point2D(46 / 4, 57 / 4);
      expect(Point2D.midpoint([p,q,r,s])).toEqual(t);
    });
  });
});

