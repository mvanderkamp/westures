# Westures 

It's a JavaScript gesture library, and hey, it might even work sometimes!

### Two things:
1. I'm pretty stupid sometimes.
2. Because of (1), I follow the KISS principle: Keep It Simple Stupid!
3. Because of (2), I've tried to keep everything in this library quite simple.
   No fancy features. I've tried to avoid functions that have different
   semantics depending on which type of object you pass in (beyond basic fail
   states if you forget to pass something in or pass in something invalid).
4. If you're wondering why this list of 'Two things' has four items, see (1).

Perhaps more importantly, this is a fork of 
[ZingTouch](https://github.com/zingchart/zingtouch). Which looks much flashier.
You should probably go there. They've even got a website! Ooh!

### Table of Contents
* [Overview](#overview)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Browser Compatibility](#browser-compatibility)
* [Pitfalls](#pitfalls)
* [Contributing](#contributing)
* [License](#license)

# Overview

The main thing Westures offers is a central core for processing input events and
transforming those events into gestures. I've tried to make the core relatively
robust, but if you read [(1)](#two-things) above you know I might need some help
fixing bugs. See [Contributing](#contributing) below if you want to do that.

This core consists of a lifecycle for each input, which moves through three
phases:

* start
* move
* end

At each phase, progress for any given gesture is saved directly on the input
object. Gestures can be designed to emit data at any point in their lifecycle.

To demonstrate this core functionality, and to provide some use out-of-the-box,
a few gestures are already implemented:

* Tap
* Swipe
* Pinch
* Pan
* Rotate

Although I wouldn't trust Swipe if I were you.

# Getting Started

### Include the library


***Node / CommonJS***

```js
const Westures = require('westures');
```

### Create a Region

```js
const wes = new Westures.Region(document.body);
```

### Bind an element to a gesture

```js
const myElement = document.getElementById('my-div');

wes.bind(myElement, new Westures.Tap(), function(e){
  //Actions here
});
```

# Usage

## Table of Contents
**[Constructs](#constructs)**

* [Region](#region)

**[Gestures](#gestures)**

* [Tap](#tap)
* [Pan](#pan)
* [Swipe](#swipe)
* [Pinch](#pinch)
* [Rotate](#rotate)
* [Gesture](#gesture)

**[Methods](#methods)**

* [Region.bind](#regionbindelement-gesture-handler-capture)
* [Region.unbind](#regionunbindelement-gesture)

## Constructs

### Region

```js
new Westures.Region(element, [capture], [preventDefault])
```
 * element - The element to set the listener upon
 * capture - Whether the region listens for captures or bubbles.
 * preventDefault - Disables browser functionality such as scrolling and zooming
   over the region.

Regions specify an area to listen for all window events. Westures need to
listen to all window events in order to determine if a gesture is recognized.
Note that you can reuse regions for multiple elements and gesture bindings. They
simply specify an area where to listen for gestures.

Suppose you had an element that you wanted to track gestures on. We set the
region on that element along with binding it to a gesture.

```js
const touchArea = document.getElementById('toucharea');
const myRegion = new Westures.Region(touchArea);

myRegion.bind(touchArea, new Westures.Pan(), function(e){
  console.log(e.detail);
});
```

But humans aren't perfect. Suppose the element #toucharea were to listen for the
`Pan` gesture. The tracking of the window events will stop when the user reaches
the edges of #toucharea. But what if the user didn't finish until say 10-50px
***outside*** the element? Regions are here to help.

Suppose you set the Region to the parent of the #toucharea element instead.

```js
const parentTouchArea = touchArea.parentNode;
const myParentRegion = new Westures.Region(parentTouchArea);

myParentRegion.bind(touchArea, new Westures.Pan(), function(e){
  console.log(e.detail);
});
```

The pan gesture is now tracked inside the `#parent-toucharea` element.  This
allows some forgiveness when the user tries to pan on the `#toucharea`, but
lifts their finger somewhere in the `#parent-toucharea`.

If you really want to go for broke, you can use the `window` element as the
Region.

### Multiple Regions

Regions only are aware of themselves and their contents, not across regions.
This allows for control at a larger scale so you can group similar gestures
together. On large pages with lots of interactive elements, it may be advisable
to split up your application into regions for better performance -- the less
bindings a single region has to iterate through to detect a gesture, the better.

## Gestures
Gesture classes can be instatiated to generate modified versions.

### Tap

A tap is detected when the user touches the screen and releases in quick
succession.

#### Options

* `options.maxDelay` *optional* - The maximum delay between a start and end
  event. This number is measured in milliseconds.
  * default: 300
* `options.tolerance` *optional* - A tolerance value which allows the user to
  move their finger about a radius measured in pixels. This allows the Tap
  gesture to be triggered more easily since a User might move their finger
  slightly during a tap event.
  * default: 10

#### Example

```js
new Westures.Tap({
  maxDelay: 200,
  tolerance: 125
})
```

#### Emits

... some data

---

### Swipe

You should probably stay away from Swipes for the time being.

---

### Pinch

A pinch is detected when the user has two or more inputs on the screen and moves
them together or apart.

#### Example
```js
new Westures.Pinch();
```

#### Emits

... some data

---

### Pan

A pan is detected when the user touches the screen and moves about the area.

#### Options
* `options.threshold` *optional* - The minimum number of pixels the input has to
  move to trigger this gesture.
   * Default: 1

#### Example
```js
new Westures.Pan({
  threshold: 2
})
```

#### Emits

... some data

---

### Rotate

A Rotate is detected when the user has two inputs moving about in a circle.

#### Example
```js
new Westures.Rotate()
```

#### Emits

... some data

---

## Methods

### Region.bind(element, gesture, handler)
Binds a single element to a gesture, executing the handler when the gesture is
emitted.

**Parameters**

* element - A DOM element
* gesture - Either the key (string) of a default or registered gesture, or an
  instance of the `Gesture` class itself.
* handler - A function to be called every time the gesture is emitted.
  * The handler function has an Event object emitted from the 
  [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
  interface. Any information relavant to the gesture will be in `event.detail`.

Generally speaking, only reuse a Gesture object for multiple bindings if their
Regions do not overlap (and preferably have a decent gap in between them).

---

### Region.unbind(element, [gesture])
Unbinds an element from a specific gesture, or all gestures if none is
specified.

**Parameters**

* `element` - A DOM element
* `gesture` *optional* - Either a registered gesture's key (String) or the
  gesture object used to bind the element.

**Returns**

* array - An array of bindings containing the gestures that were unbound.


**Examples**

Unbind from a specific gesture

```js
const myElement = document.getElementById('mydiv');
myRegion.unbind(myElement, 'tap');
```

Unbind from all gestures

```js
const myElement = document.getElementById('mydiv');
myRegion.unbind(myElement);
```

Unbind from a gesture instance.

```js
const myElement = document.getElementById('mydiv');
const myRegion = new Westures.Region(document.body);
const myTapGesture = new Westures.Tap({ maxDelay : 100 });

myRegion.bind(myElement, myTapGesture, function(e) {});

myRegion.unbind(myElement, myTapGesture);

```
---

# Westures Life Cycle

Utilizing the Westures life cycle (start, move, end) allows you to create new
gestures and to interface with the mobile event cycle in a much finer detail. It
will allow you to hook into events and to apply external functions during
events. 

While you could try to extend the gestures that have been provided, it might be
advisable to implement your own gestures if the provided ones are
unsatisfactory.

Details on how to do so will be forthcoming...

---

# Pitfalls

**Binding an event and DOM mutation to an element**
Westures treats a gesture as a non-mutable event, meaning that the element is
bound to is not expected to change between the start and end. Binding a
transformation of an element's bounding box to the middle of a gesture event
could provide unwanted results. 

Example: Binding a pan event directly to an element that you want to move around
every time the callback is fired. The initial state of when the gesture was
registered changes throughout the event, and the initial reference point is no
longer valid. 

Solution: Attach the gesture listener to a non-mutating element such as a parent
container, and modify your target element in the callback. This will provide a
more predictable state that zingtouch can recognize.  ---

# Contributing

Something something blah blah be responsible.

## Browser Compatibility

---

# License

MIT License

