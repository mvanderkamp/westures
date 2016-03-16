# ZingTouch

A modern JavaScript touch gesture library. Allows developers to configure pre-existing gestures and even create their own using ZingTouch's life cycle.

[![Code Climate](https://codeclimate.com/repos/56e9ac9ca5b7c15822004922/badges/245bb5c6c267cd409724/gpa.svg)](https://codeclimate.com/repos/56e9ac9ca5b7c15822004922/feed) [![Documentation](http://zingchart.github.io/zingtouch/docs/badge.svg)](http://zingchart.github.io/zingtouch/docs/index.html)

### Quick Links
* Demos
* [Codebase Documentation](http://zingchart.github.io/zingtouch/docs/index.html)
* CDN

### Table of Contents
* [Overview](#overview)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Browser Support](#browser-support)
* [Contributing](#contributing)
* [License](#license)

# Overview

ZingTouch is built to make implementing gestures for the browser as easy or complex as you need it to be. ZingTouch comes with 6 main gestures : 

* Tap
* Swipe
* Pinch
* Expand
* Pan 
* Rotate

These gestures can be customized including the number of inputs it accepts, or how sensitive the gesture is to be recognized. 

ZingTouch is also a fully capable touch library with lifecycle events that you can hook into to create new Gestures or to act upon certain touch events. We know supporting touch events across multiple browsers can be a pain; ZingTouch makes it easy by defining 3 hooks to pass callbacks to :

* start
* move
* end


# Getting Started

### Include the library


***ES6 / CommonJS***

```
var ZingTouch = require('ZingTouch');
```

or 

***Include the file***

```
<script src='./path/to/zingtouch.js'></script>
```


### Create a Region

```
var zt = new ZingTouch.Region(document.body);
```

### Bind an element to a gesture

```
var myElement = document.getElementById('my-div');

zt.bind(myElement, 'tap', function(e){
	//Actions here
}, false);
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
* [Expand](#expand)
* [Rotate](#rotate)
* [Gesture](#gesture)

**[Methods](#methods)**

* [Region.bind](#regionbindelement-gesture-handler-capture)
* [Region.bindOnce](#regionbindonce)
* [Region.unbind](#regionunbindelement-gesture)
* [Region.register](#regionregisterkey-gesture)
* [Region.unregister](#regionunregisterkey)

## Constructs

### Region

Regions specify an area to listen for all window events. ZingTouch needs to listen to all window events in order to determine if a gesture is recognized. You can reuse regions for multiple elements and gesture bindings. They simply specify an area where to listen for gestures.

Suppose you had an element that you wanted to track gestures on, and we set the region on that element along with binding it to a gesture.

```
var touchArea = document.getElementById('#toucharea')
var myRegion = new ZingTouch.Region(touchArea);

myRegion.bind(touchArea, 'swipe', function(e){
	console.log(e.detail);
});
```

The shaded area in blue shows the area where ZingTouch will now listen for events such as touchstart, touchmove, touchend, etc.

![Region](http://demos.zingchart.com/assets/zingtouch-docs/region.png)


But humans aren't perfect. Suppose the element #toucharea were to listen for the `Swipe` gesture. The tracking of the window events will stop when the user reaches the edges of #toucharea. But what if the user didn't finish until 10-50px *outside* the element? Regions are here to help.

Suppose you set the Region to the parent of the #toucharea element instead.

```
var parentTouchArea = document.getElementById('#parent-toucharea')
var touchArea = document.getElementById('#toucharea')
var myRegion = new ZingTouch.Region(parentTouchArea);

myRegion.bind(touchArea, 'swipe', function(e){
	console.log(e.detail);
});
```

![Parent Region](http://demos.zingchart.com/assets/zingtouch-docs/parent-region.png)

ZingTouch now tracks the swipe gesture inside the `#toucharea` element AND the #parent-toucharea. This allows some forgiveness when the user tries to swipe on the `#toucharea`, but lifts their finger somewhere in the `#parent-toucharea`. 

**Note:** The swipe gesture can only be initiated on the area it is bound to. This means the user has to touch the `#toucharea` element first, but can move out and end within `#parent-toucharea`.


### Multiple Regions

Regions only are aware of themselves and their contents, not across regions. This allows for control at a larger scale so you can group similar gestures together. While you can throw a Region on top of the `document.body`, we suggest splitting up your application into regions for better performance -- the less bindings a single region has to iterate through to detect a gesture, the better.

![Multiple Regions](http://demos.zingchart.com/assets/zingtouch-docs/multiple-regions.png)


## Gestures
Gesture classes can be instatiated to generate modified versions.

### Tap

![Tap Gesture](http://demos.zingchart.com/assets/zingtouch-docs/tap.gif)

A tap is detected when the user touches the screen and releases in quick succession.

#### Options

* `options.maxDelay` *optional* - The maximum delay between a start and end event. This number is measured in milliseconds.
	* default: 300
* `options.numInputs` *optional* - The number of inputs to trigger the tap event.
	* default: 1
* `options.moveTolerance` *optional* - A tolerance value which allows the user to move their finger about a radius measured in pixels. This allows the Tap gesture to be triggered more easily since a User might move their finger slightly during a tap event.
	* default: 10

#### Example

```
new ZingTouch.Tap({
	maxDelay: 200,
	numInputs: 2,
	moveTolerance: 125
})
```

#### Emits

* `interval` - a time measured in milliseconds between the start of the gesture, and the end.

---

### Swipe

![Swipe Gesture](http://demos.zingchart.com/assets/zingtouch-docs/swipe.gif)

A swipe is detected when the user touches the screen and moves in a relatively increasing velocity, leaving the screen at some point before it drops below a certain velocity.

#### Options

* `options.numInputs` *optional* - The number of inputs to trigger the event.
	* Default: 1
* `options.maxRestTime` *optional* - The amount of time allowed in milliseconds inbetween events before a the motion becomes inelligible to be a swipe.
	* Default: 100
* `options.escapeVelocity` *optional* - The minimum velocity (px/ms) that the gesture has to obtain by the end event.
	* Default: 0.2


#### Example
```
new ZingTouch.Swipe({
	numInputs: 2,
	maxRestTime: 100,
	escapeVelocity: 0.25
})
```

#### Emits

* `velocity` - The value of pixels/milliseconds the gesture was travelling until it's ending point.

---

### Pinch

![Pinch Gesture](http://demos.zingchart.com/assets/zingtouch-docs/pinch.gif)

An expand is detected when the user has two inputs on the screen and moves one or both closer towards the other input.

#### Example
```
new ZingTouch.Pinch()
```

#### Emits

* `distance` - The distance in pixels between the two inputs.

---

### Expand

![Expand Gesture](http://demos.zingchart.com/assets/zingtouch-docs/expand.gif)

An expand is detected when the user has two inputs on the screen and moves one or both away from the other input.

#### Example
```
new ZingTouch.Expand()
```

#### Emits

* `expand` - The distance in pixels between the two inputs.

---

### Pan

![Pan Gesture](http://demos.zingchart.com/assets/zingtouch-docs/pan.gif)

A pan is detected when the user touches the screen and moves about the area.

#### Options
* `options.numInputs` *optional* - The number of inputs to trigger the event.
	* Default: 1

#### Example
```
new ZingTouch.Pan({
	numInputs: 2
})
```

#### Emits

* `distanceFromOrigin` - The distance in pixels traveled from the current position from the starting position

---

### Rotate

![Rotate Gesture](http://demos.zingchart.com/assets/zingtouch-docs/rotate.gif)


A Rotate is detected when the use has two inputs moving about a circle on the edges of a diameter.

#### Example
```
new ZingTouch.Rotate()
```

#### Emits

* `angle` - The angle of the initial right most input, in relation to the unit circle.
* `distance` - The angular distance travlled by the initial right most post.
* `change` - The change of angle between the last position and the current position. Positive denotes a counter-clockwise motion, while negative denotes a clockwise motion.

---

### Gesture

A generic gesture. By default, this gesture does not emit but is useful for hooking into ZingTouch's life cycle. See [ZingTouch Life Cycle](#zingtouch-life-cycle) for more information.

#### Example
```
new ZingTouch.Gesture()
```


## Methods

### Region.bind(element, gesture, handler, [capture])
Binds a single element to a gesture, executing the handler when the gesture is emitted.

**Parameters**

* element - A DOM element
* gesture - Either the key (string) of a default or registered gesture, or an instance of the `Gesture` class itself.
* handler - A function to be called every time the gesture is emitted.
	* The handler function has an Event object emitted from the [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) interface. Any information relavant to the gesture will be in `event.detail`.
* `capture` - An optional boolean to designate the event to be fired on the capture or bubbling phase.

**Example #1**

```
var myRegion = new ZingTouch.Region(document.body);
var myElement = document.getElementById('some-div');

myRegion.bind(myElement, 'tap', function(e) {
	console.log('Tap gesture emitted: ' + e.detail.interval);
});
```

**Example #2**

```
var myElement = document.getElementById('some-div');
var myTapGesture = new ZingTouch.Tap({ maxDelay : 100 });
var myRegion = new ZingTouch.Region(document.body);

myRegion.bind(myElement, myTapGesture, function(e) {
	console.log('Custom Tap gesture emitted: ' + e.detail.interval);
}, false);
```

**Notes**

1. Instance Gestures that are passed to bind will be stored and maintained in memory, therefore it is reccomended to reuse gestures object where possible, or to use the `Region.register` syntax -- they essentially do the same thing. Either works fine, but try to avoid using the following pattern where an instance variable is created at every bind :

```
//Poor performance
var delay = 100;
for (var i = 0; i < 100; i++){
	myRegion.bind(myElement, new ZingTouch.Tap({maxDelay : delay}),function(e){...});
}

```

```
//Better performance
var delay = 100;
var customTap = new ZingTouch.Tap({maxDelay : delay});
for (var i = 0; i < 100; i++){
	myRegion.bind(myElement, customTap, function(e){...});
}

```
---

### Region.bind(element)
Passing a qualified DOM element to the bind function will return an object that can be chainable with the 6 main gestures, or any other gestures that you may have registered with `Region.register`

**Parameters**

* element - A DOM element

**Returns**

* A chainable object that takes two parameters :
	* `handler` - A function to be called every time the gesture is emitted.
		* The chainable object has 6 methods available at all times : `.tap()` ,`.swipe()` ,`.pinch()` ,`.expand()` ,`.pan()` ,`.rotate()`. Custom Gesture are accessible using the `ZingTouch.register` method.
		* The handler function has an Event object emitted from the [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) interface. Any information relavant to the gesture will be in `event.detail`.

	* `capture` - An optional boolean to designate the event to be fired on the capture or bubbling phase.


**Example**

```
var myElement = document.getElementById('mydiv');
var myRegion = new ZingTouch.Region(myElement);
var chainableObject = myRegion.bind(myElement);

chainableObject
	.tap(function(e){
		console.log(e.detail);
	})
	.swipe(function(e){
		console.log(e.detail);
	}, true)
```
---

### Region.bindOnce()
Identical to both method signatures of bind, but is "bound once" meaning the event will only be captured once before it is destroyed. 

See [Region.bind](#bind)

---

### Region.unbind(element, [gesture])
Unbinds an element from a specific gesture, or all gestures if none is specified.

**Parameters**

* `element` - A DOM element
* `gesture` *optional* - Either a registered gesture's key (String) or the gesture object used to bind the element.

**Returns**

* array - An array of bindings containing the gestures that were unbound.


**Examples**

Unbind from a specific gesture

```
var myElement = document.getElementById('mydiv');
myRegion.unbind(myElement, 'tap');
```

Unbind from all gestures

```
var myElement = document.getElementById('mydiv');
myRegion.unbind(myElement);
```

Unbind from a gesture instance.

```
var myElement = document.getElementById('mydiv');
var myRegion = new ZingTouch.Region(document.body);
var myTapGesture = new ZingTouch.Tap({ maxDelay : 100 });

myRegion.bind(myElement, myTapGesture, function(e) {});

myRegion.unbind(myElement, myTapGesture);

```
---

### Region.register(key, gesture)
Register a gesture of the Gesture class to each Region. Allows the newly registered Gesture to be accessible in the bind/unbind syntax including the chainable object of bind.

**Parameters**

* `key` - A string to identify the new gesture.
* `gesture` - An instance of the Gesture class

**Returns**

* The gesture object registered

**Examples**

```
var myTapGesture = new ZingTouch.Tap({ maxDelay : 60 });

var myRegion = new ZingTouch.Region(document.body);
myRegion.register('shortTap', myTapGesture);
```
And the usages :

```
myRegion.bind(myElement, 'shortTap', function(e){});
```

```
myRegion.bind(myElement).shortTap(function(e){});
```
---

### Region.unregister(key)
Unregisters a gesture that was previously registered. Unregistering a gesture will automatically unbind any elements that were bound to this gesture.

**Parameters**

* `key` - A string to identify the gesture that will be unregistered.

**Returns**

* The gesture that was unregistered.

**Example**

```
myRegion.unregister('shortTap');
```

---

# ZingTouch Life Cycle

Creating new gestures and utilizing ZingTouch as a touch interface library.

###***In progress***


---

# Browser Support

###***In progress***

**Verified**

* Chrome (49+)
* iOS 9+
* Safari 8

**Planned**

* Android (on Chrome)
* Microsoft Edge
* Safari 6-9+

---

# Contributing

**Code Style**

We use the [Airbnb](https://github.com/airbnb/javascript) code style guide for our JavaScript.

**Build dependencies**

* Build Tool: [Webpack](https://webpack.github.io/)
	* `npm install -g webpack` 
* ES6 translator : [Babel](https://babeljs.io/)

**Comments and Documentation**

* We follow [JSDoc](http://usejsdoc.org/) guidelines but utilize [ESDoc](https://esdoc.org/) to output documentation. We find ESDoc to be friendlier with ES6/class structured codebases.

**Testing**

* Mocha
* Chai (Expect)

### npm scripts
* `npm run build:dev` - Builds the unminified library with webpack
* `npm run build:prod` - Builds the minified library with webpack
* `npm run docs` - Builds the docs with esdocs

---
# License

MIT License 

&copy; 2016 ZingChart, Inc. 
