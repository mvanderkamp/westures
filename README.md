# westures

[![Maintainability](
https://api.codeclimate.com/v1/badges/fc7d7ace5a3018dc4071/maintainability)
](https://codeclimate.com/github/mvanderkamp/westures/maintainability)
[![devDependencies Status](
https://david-dm.org/mvanderkamp/westures/dev-status.svg)
](https://david-dm.org/mvanderkamp/westures?type=dev)

Westures is a robust n-pointer multitouch gesture detection library for
JavaScript. This means that each gesture is capable of working seamlessly as
touch points are added and removed, with no limit on the number of touch points,
and with each touch point contributing to the gesture. It is also be capable of
working across a wide range of devices.

Visit this page for an example of the system in action: [Westures Example](
https://mvanderkamp.github.io/westures-example/).

The library achieves its goals without using any dependencies except for its own
core engine, yet maintains usability across the main modern browsers.
Transpilation may be necessary for this last point to be achieved, as the
library is written using many of the newer features of the JavaScript language.
A transpiled bundle is provided, but the browser target list is arbitrary and
likely includes some bloat. In most cases you will be better off performing
bundling, transpilation, and minification yourself.

This module includes
[westures-core](https://mvanderkamp.github.io/westures-core/)
as well as a base set of gestures.

Westures is a fork of [ZingTouch](https://github.com/zingchart/zingtouch).

## Quick Example

```javascript
// Import the module.
const wes = require('westures');

// Declare a region. The default is the window object, but other elements like
// the document body work too.
const region = new wes.Region();

// Combine an element and a handler into a Gesture. (An element with id
// 'pannable' must be available).
const pan = new wes.Pan(document.querySelector('#pannable'), (data) => {
  console.log(data.translation.x, data.translation.y);
})

// And add the gesture to the region.
region.addGesture(pan)
```

## Table of Contents

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Implementing Custom Gestures](#implementing-custom-gestures)
- [What's Changed](#changes)
- [Nomenclature and Origins](#nomenclature-and-origins)
- [Issues](#Issues)
- [Links](#links)

## Overview

There are nine gestures defined in this module:

Name   | # of Inputs | Emit Phase | Recognized Input Behaviour
------ | ----------- | ---------- | -----------------
Pan    | 1+          | Move       | Sliding around the screen
Pinch  | 2+          | Move       | Moving together or apart
Press  | 1+          | Move       | Held down without moving
Pull   | 1+          | Move       | Moving away from or toward a fixed point
Rotate | 2+          | Move       | Rotating around each other
Swipe  | 1+          | End        | Moving quickly then released
Swivel | 1+          | Move       | Rotating around a fixed pivot point
Tap    | 1+          | End        | Quickly pressing and releasing
Track  | 1+          | All        | Track locations of all active pointers

See the [documentation](https://mvanderkamp.github.io/westures/) for more
information about each gesture.

Note that all x,y positions are obtained from the corresponding `clientX` and
`clientY` properties of the input event.

## Basic Usage

- [Declaring a Region](#declaring-a-region)
- [Instantiating a Gesture](#instantiating-a-gesture)
- [Adding a Gesture to a Region](#adding-a-gesture-to-a-region)

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

By default, the window object is used.

```javascript
const region = new wes.Region();
```

### Instantiating a Gesture

When you instantiate a gesture, you need to provide a handler as well as an
Element. The gesture will only be recognized when the first pointer to interact
with the region was inside the given Element. Therefore unless you want to try
something fancy the gesture element should probably be contained inside the
region element. It could even be the region element.

Now for an example. Suppose you have a div (id 'pannable') within which you want
to detect a Pan gesture. First we need to find the element.

```javascript
const pannable = document.querySelector('#pannable');
```

And we also need a handler. This function will be called whenever a gesture hook
returns non-null data. For Pan, this is just the move phase, but the handler
doesn't need to know that. The data returned by the hook will be available
inside the handler.

```javascript
function panLogger(data) {
  console.log(data.translation.x, data.translation.y);
}
```

Now we're ready to combine the element and its handler into a gesture.

```javascript
pan = new wes.Pan(pannable, panLogger);
```

We're not quite done though, as none of this will actually work until you add
the gesture to the region.

### Adding a Gesture to a Region

Simple:

```javascript
region.addGesture(pan);
```

Now the `panLogger` function will be called whenever a `pan` gesture is
detected on the `#pannable` element inside the region.

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

const TIMEOUT = 100;

class Tap extends Gesture {
  constructor() {
    super('tap');
    this.startTime = null;
  }

  start(state) {
    this.startTime = Date.now();
  }

  end(state) {
    if (Date.now() - this.startTime <= TIMEOUT) {
        return state.getInputsInPhase('end')[0].current.point;
    }
    return null;
  }
}
```

There are problems with this example, and it should probably not be used as an
actual Tap gesture, it is merely to illustrate the basic idea.

The default hooks for all Gestures simply return null. Data will only be
forwarded to bound handlers when a non-null value is returned by a hook.
Returned values should be packed inside an object. For example, instead of just
`return 42;`, a custom hook should do `return { value: 42 };`

If your Gesture subclass needs to track any kind of complex state, remember that
it may be necessary to reset the state in the `cancel` phase.

For information about what data is accessible via the State object, see the full
documentation [here](https://mvanderkamp.github.io/westures-core/State.html).
Note that his documentation was generated with `jsdoc`.

### Data Passed to Handlers

As you can see from above, it is the gesture which decides when data gets passed
to handlers, and for the most part what that data will be. Note though that a
few properties will get added to the outgoing data object before the handler is
called. Those properties are:

Name     | Type     | Value
-------- | -------- | -----
centroid | Point2D  | The centroid of the input points.
event    | Event    | The input event which caused the gesture to be recognized
phase    | String   | `'start'`, `'move'`, `'end'`, or `'cancel'`
type     | String   | The name of the gesture as specified by its designer.
target   | Element  | The Element that is associated with the recognized gesture.

If data properties returned by a hook have a name collision with one of these
properties, the value from the hook gets precedent and the default is
overwritten.

## Changes

See the [changelog](
https://github.com/mvanderkamp/westures/blob/master/CHANGELOG.md) for the most
recent updates.

## Nomenclature and Origins

In my last year of univerisity, I was working on an API for building
multi-device interfaces called "WAMS" (Workspaces Across Multiple Surfaces),
which included the goal of supporting multi-device gestures.

After an extensive search I found that none of the available multitouch
libraries for JavaScript provided the fidelity I needed, and concluded that I
would need to write my own, or at least fork an existing one. ZingTouch proved
to the be the most approachable, so I decided it would make a good starting
point.

The name "westures" is a mash-up of "WAMS" and "gestures".

## Issues

If you find any issues, please let me know!

## Links

### westures

- [npm](https://www.npmjs.com/package/westures)
- [github](https://github.com/mvanderkamp/westures)
- [documentation](https://mvanderkamp.github.io/westures/)

### westures-core

- [npm](https://www.npmjs.com/package/westures-core)
- [github](https://github.com/mvanderkamp/westures-core)
- [documentation](https://mvanderkamp.github.io/westures-core/)

