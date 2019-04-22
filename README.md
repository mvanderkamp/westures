# westures 

[![Maintainability](
https://api.codeclimate.com/v1/badges/fc7d7ace5a3018dc4071/maintainability)
](https://codeclimate.com/github/mvanderkamp/westures/maintainability)
[![devDependencies Status](
https://david-dm.org/mvanderkamp/westures/dev-status.svg)
](https://david-dm.org/mvanderkamp/westures?type=dev)

The goal of Westures is to be a robust n-pointer multitouch gesture detection
library for JavaScript. This means that each gesture should be capable of
working seamlessly as touch points are added and removed, with no limit on the
number of touch points, and with each touch point contributing to the gesture.
It should also be capable of working across a wide range of devices.

Visit this page for an example of the system in action: [Westures Example](
https://mvanderkamp.github.io/westures-example/). Note that this is best viewed
on a touch device.

The library aims to achieve its goals without using any dependencies except for
its own core engine, yet maintain usability across the main modern browsers.
Transpilation may be necessary for this last point to be achieved, as the
library is written using many of the newer features of the JavaScript language.
A transpiled bundle is provided, but the browser target list is arbitrary and
the bundle (currently) includes a fair amount of bloat from Babel and
Browserify. In most cases you will probably be better off performing bundling
and transpilation yourself.

This module includes
[westures-core](https://mvanderkamp.github.io/westures-core/) 
as well as a base set of gestures.

Westures is a fork of [ZingTouch](https://github.com/zingchart/zingtouch).

## Quick Example

```javascript
// Import the module.
const wes = require('westures');

// Declare a region.
const region = new wes.Region(document.body);

// Add a gesture to an element within the region.
const pannable = document.querySelector('#pannable');
region.addGesture(pannable, new wes.Pan(), (data) => {
  // data.translation.x ...
  // data.translation.y ...
  // and so on, depending on the Gesture
});
```

## Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Implementing Custom Gestures](#implementing-custom-gestures)
- [What's Changed](#changes)
- [Links](#links)

## Overview

There are seven gestures defined in this module:

Name   | # of Inputs | Emit Phase | Description
-------|-------------|------------|------------
Tap    | 1+          | End        | Generic taps. Configure with options.
Pinch  | 2+          | Move       | Inputs moving together or apart.
Rotate | 2+          | Move       | Inputs rotating around each other.
Pan    | 1+          | Move       | Inputs sliding around the screen.
Swipe  | 1+          | End        | Inputs swiping the screen.
Swivel | 1+          | Move       | Inputs rotating around a fixed pivot point.
Track  | 1+          | All        | Track all active pointers.

See the [documentation](https://mvanderkamp.github.io/westures/) for more
information about each gesture.

Note that all x,y positions are obtained from the corresponding `clientX` and
`clientY` properties of the input event.

## Basic Usage

### Importing the module

```javascript
const wes = require('westures');
```

### Declaring a Region

First, decide what region should listen for events. This could be the
interactable element itself, or a larger region (possibly containing many
interactable elements). Behaviour may differ slightly based on the approach you
take, as a Region will perform locking operations on its interactable elements
and their bound gestures so as to limit interference between elements during
gestures, and no such locking occurs between Regions.

If you have lots of interactable elements on your page, you may find it
convenient to use smaller elements as regions. Test it out in case, and see what
works better for you.

```javascript
const region = new wes.Region(document.body);
```
### Binding an element within a Region

When you add a gesture to a region, you need to provide a handler as well as an
Element along with the gesture. The gesture will only be recognized when the
first pointer to interact with the region was inside the given Element.
Therefore unless you want to try something fancy the gesture element should
probably be contained inside the region element. It could even be the region
element.

Now for an example. Suppose you have a div (id 'pannable') within which you want
to detect a Pan gesture (assume that such a gesture is available). Your handler
is called `panner`.

```javascript
region.addGesture(document.querySelector('#pannable'), new wes.Pan(), panner);
```

The `panner` function will now be called whenever a Pan hook returns non-null
data. The data returned by the hook will be available inside `panner` as such:

```javascript
function panner(data) {
  // data.translation.x ...
  // data.translation.y ...
  // and so on, depending on the Gesture
}
```

## Implementing Custom Gestures

The core technique used by Westures (originally conceived for ZingTouch) is to
process all user inputs and filter them through four key lifecycle phases:
`start`, `move`, `end`, and `cancel`. Gestures are defined by how they respond
to these phases. To respond to the phases, a gesture extends the `Gesture` class
provided by this module and overrides the method (a.k.a. "hook") corresponding
to the name of the phase. 

The hook, when called, will receive the current State object of the region. To
maintain responsiveness, the functionality within a hook should be short and as
efficient as possible.

For example, a simple way to implement a 'Tap' gesture would be as follows:

```javascript
const { Gesture } = require('westures');

class Tap extends Gesture {
  constructor() {
    super('tap');
  }

  end(state) {
    return state.getInputsInPhase('end')[0].current.point;
  }
}
```

There are problems with this example, so it should not be used as an actual Tap
gesture, it is just here to represent the basic idea of a custom gesture.

The default hooks for all Gestures simply return null. Data will only be
forwarded to bound handlers when a non-null value is returned by a hook.

For information about what data is accessible via the State object, see the full
documentation [here](https://mvanderkamp.github.io/westures-core/State.html).
Note that his documentation was generated with `jsdoc`.

### Data Passed to Handlers

As you can see from above, it is the gesture which decides when data gets passed
to handlers, and for the most part what that data will be. Note though that a
few propertiess will get added to the outgoing data object before the handler is
called. Those properties are:

Name     | Type    | Value
---------|---------|-------
centroid | Point2D | The centroid of the input points.
event    | Event   | The input event which caused the gesture to be recognized
phase    | String  | 'start', 'move', or 'end'
type     | String  | The name of the gesture as specified by its designer.
target   | Element | The Element that is associated with the recognized gesture.

## Changes

See the [changelog](
https://github.com/mvanderkamp/westures/blob/master/CHANGELOG.md) for the most
recent updates.

### Changes From ZingTouch

The fundamental idea of ZingTouch, the three-phase hook structure, remains more
or less the same. Most of the changes have to do with streamlining and
simplifying the code such that it is easier to use and has a wider range of
capabilities. The most significant of these is full simultaneous multi-touch
gesture support. Beyond that, here are some specific changes:

- Reorganized and simplified code structure.
  - The arbiter-interpreter-dispatcher scheme has been significantly simplified.
    - There is no arbiter. instead the Region class has an 'arbitrate' function.
    - There is no interpreter. Instead the Binding class has an 'evaluateHook'
      function.
    - There is no dispatcher. The handlers are called directly.
  - Fewer levels of code and fewer attempts to ram multiple types of
    functionality into a single function. I've tried to keep all functions clear
    and simple.
- Creation and use of a Point2D class.
- Redesigned technique for handling inputs allows continuous use of touches.
  ZingTouch had a tendency to stop responding to touches if some gesture ended,
  this should no longer be the case. Users should now be able to seamlessly flow
  from one gesture to another (or even multiple simultaneously) without having
  to restart their touches.
- Support for using the window object as a region.
- Simplified hook interaction. A single 'state' object is passed, as that is
  all that is really needed.
- Simplified handler interaction. As the handlers are called directly instead of
  as the callback for an event, the parameters do not need to be wrapped up
  inside the 'details' property of an event object.
- Renamed 'bind' to 'addGesture' and 'unbind' to 'removeGestures'.
- Implemented a Smoothable mixin to be used for movement-based gestures.

## Advisory

This is an alpha release of this project. It is very much still in development,
and has not been tested beyond a handful of devices using the latest versions of
Chrome and Firefox. If you find a problem with it, please let me know.

That said, please do give it a try, and if something breaks, please let me know!
Or, even better, figure out why it broke, figure out a solution, and submit a
pull request!

## Links

### westures

- [npm](https://www.npmjs.com/package/westures)
- [github](https://github.com/mvanderkamp/westures)
- [documentation](https://mvanderkamp.github.io/westures/)

### westures-core

- [npm](https://www.npmjs.com/package/westures-core)
- [github](https://github.com/mvanderkamp/westures-core)
- [documentation](https://mvanderkamp.github.io/westures-core/)

