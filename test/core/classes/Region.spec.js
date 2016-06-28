/**
 * @file Region.spec..js
 * Tests Region class
 */
import Region from './../../../src/core/classes/Region.js';
import Binder from './../../../src/core/classes/Binder.js';

/** @test {Region} */
describe('Region', function () {
  it('should be instantiated', function () {
    expect(Region).to.not.equal(null);
  });
});

/** @test {Region.bind} */
describe('Region.bind(element)', function () {
  var region = new Region(document.body);
  it('should exist', function () {
    expect(region.bind).to.exist;
  });

  it('should throw an error if the element parameter is invalid', function () {
    expect(function () {
      region.bind({});
    }).to.throw('Bind must contain an element');
  });

  it('should return a chainable Binder object if only an element parameter is provided', function () {
    var ztBound = region.bind(document.body);
    expect(ztBound).to.be.an.instanceof(Binder);
  });

  it('should return a chainable Binder object that contains all of the registered gestures', function () {
    var ztBound = region.bind(document.body);
    var registeredGestures = Object.keys(region.state.registeredGestures);
    for (var gesture in ztBound) {
      if (gesture !== 'element') {
        expect(registeredGestures).to.include(gesture);
      }
    }
  });
});
