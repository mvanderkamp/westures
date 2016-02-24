import ZingTouch from './../src/ZingTouch.js';
import Binder from './../src/core/classes/Binder.js';
import state from './../src/core/state.js';

/**
 * Tests the user-facing API, ensuring the object functions while not exposing private members.
 */
describe('ZingTouch', function () {

  it('should be instantiated', function () {
    expect(ZingTouch).to.not.equal(null);
  });

  it('should not expose internal state', function () {
    expect(ZingTouch.state).to.be.undefined;
  });

  it('should have an unbind method', function () {
    expect(ZingTouch.unbind).to.exist;
  });

});

describe('ZingTouch.bind(element)', function () {
  it('should exist', function () {
    expect(ZingTouch.bind).to.exist;
  });

  it('should throw an error if the element parameter is invalid', function () {
    expect(function () {
      ZingTouch.bind({});

    }).to.throw(Error);
  });

  it('should return a chainable Binder object if only an element parameter is provided', function () {
    var ztBound = ZingTouch.bind(document.body);
    expect(ztBound).to.be.an.instanceof(Binder);
  });

  it('should return a chainable Binder object that contains all of the registered gestures', function () {
    var ztBound = ZingTouch.bind(document.body);
    var registeredGestures = Object.keys(state.registeredGestures);
    for (var gesture in ztBound) {
      if (gesture !== 'element') {
        expect(registeredGestures).to.include(gesture);
      }
    }
  });

  it('should properly create a Binding after a chained function', function () {
    var handler = function (event) {};

    expect(state.retrieveBindings(document.body).length).to.equal(0);
    ZingTouch.bind(document.body)
      .tap(handler, false);

    expect(state.retrieveBindings(document.body).length).to.equal(1);

  });
});

describe('ZingTouch.bind(element, gesture, handler, [capture])', function () {
  it('should exist', function () {
    expect(ZingTouch.bind).to.exist;
  });

  it('should throw an error if the element parameter is invalid', function () {
    expect(function () {
      ZingTouch.bind({}, 'tap', function () {}, false);

    }).to.throw(Error);
  });

  it('should throw an error if the gesture parameter is invalid', function () {
    expect(function () {
      ZingTouch.bind(document.body, {}, function () {}, false);

    }).to.throw(Error);
  });

  it('should throw an error if the handler parameter is invalid', function () {
    expect(function () {
      ZingTouch.bind(document.body, 'tap', {}, false);

    }).to.throw(Error);
  });

  it('should accept a Gesture object as the gesture parameter', function () {
    expect.true.to.be.false;
  });

  //it('should return a chainable Binder object if only an element parameter is provided', function () {
  //  var ztBound = ZingTouch.bind(document.body);
  //  expect(ztBound).to.be.an.instanceof(Binder);
  //});
  //
  //it('should return a chainable Binder object that contains all of the registered gestures', function () {
  //  var ztBound = ZingTouch.bind(document.body);
  //  var registeredGestures = Object.keys(state.registeredGestures);
  //  for (var gesture in ztBound) {
  //    if (gesture !== 'element') {
  //      expect(registeredGestures).to.include(gesture);
  //    }
  //  }
  //});
  //
  //it('should properly create a Binding after a chained function', function () {
  //  var handler = function (event) {};
  //
  //  expect(state.retrieveBindings(document.body).length).to.equal(0);
  //  ZingTouch.bind(document.body)
  //    .tap(handler, false);
  //
  //  expect(state.retrieveBindings(document.body).length).to.equal(1);
  //
  //});
});
