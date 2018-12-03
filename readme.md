# westures 

Westures is intended to be a lightweight JavaScript gesture detection library.
Whether it achieves that goal at this point is... yet to be determined.

This module includes `westures-core` as well as a base set of gestures.

Westures is a fork of [ZingTouch](https://github.com/zingchart/zingtouch).

## Advisory

This is an alpha release of this project. It is very much still in development,
and has not been tested beyond a handful of devices using the latest versions of
Chrome and Firefox. If you find a problem with it, please let me know.

That said, please do give it a try, and if something breaks, please let me know!
Or, even better, figure out why it broke, figure out a solution, and submit a
pull request!

## Table of Contents

__NOTE:__ _This readme is still under construction!_

- [Overview](#overview)
- [Basic Usage](#basic-usage)
- [Implementing Custom Gestures](#implementing-custom-gestures)

## Overview

There are five gestures defined in this module:

- _Tap_: Single finger taps have been tested, multi-finger have not yet.
- _Pinch_: Two or more fingers, reports the distance and change in distance.
- _Pan_: Single finger sliding around the screen.
- _Rotate_: Two fingers, reports change in angle and midpoint.
- _Swipe_: Single finger sliding very quickly across the screen. Emits at end
  only.

## Basic Usage

### Importing the module

```javascript
const wes = require('westures');
```

### Declaring a Region

First, decide what region should listen for events. If you want elements to
continue responding to input events from the `move` and `end` phases even if the
pointer moves outside the element, you should use an region that contains the
element. This can even be the window object if you want these events to fire
event if the pointer goes outside the browser window.

For example:

```javascript
const region = new wes.Region(window);
```

Of course, if you have lots of interactable elements on your page, you may want
to consider using smaller elements as binding regions, or even the interactable
element itself.

For example, if you have a canvas element with id `draw-stuff` that you want to
interact with, you could do:

```javascript
const region = new wes.Region(document.querySelector('#draw-stuff'));
```

### Binding an element within a Region

Suppose you have a div (id 'pannable') within which you want to detect a Pan
gesture. Your handler is called `panner`.

```javascript
region.bind(document.querySelector('#pannable'), new wes.Pan(), panner);
```

The `panner` function will now be called whenever a Pan hook returns non-null
data. The data returned by the hook will be available inside `panner` as such:

```javascript
function panner(data) {
  // data.x ...
  // data.y ...
  // and so on, depending on the Gesture
}
```

## Implementing Custom Gestures

The core technique used by Westures (originally conceived for ZingTouch) is to
process all user inputs and filter them through three key lifecycle phases:
`start`, `move`, and `end`. Gestures are defined by how they respond to these
phases.  To respond to the phases, a gesture extends the `Gesture` class
provided by this module and overrides the method (a.k.a. "hook") corresponding
to the name of the phase. 

The hook, when called, will receive the current State object of the region. To
maintain responsiveness, the functionality within a hook should be short and as
efficient as possible.

For example, a simple way to implement a 'Tap' gesture would be as follows:

```javascript
const { Gesture } = require('westures');

class Tap extends Gesture {
  end(state) {
    const {x,y} = state.getInputsInPhase('end')[0].current.point;
    return {x,y};
  }
}
```

The default hooks for all Gestures simply return null. Data will only be
forwarded to bound handlers when a non-null value is returned by a hook.

