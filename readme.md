# ZingTouch
---

A modern JavaScript touch gesture library. Allows developers to configure pre-existing gestures and even create their own using ZingTouch's life cycle.

### Quick Links
* Demos
* Codebase Documentation
* CDN

### Table of Contents
* [Overview](#overview)
* [Usage](#usage)
	* [Methods](#methods)
	* [Gestures](#gestures)
	* [Creating New Gestures](#creating-new-gestures)
* [Browser Support](#browser-support)
* [Contributing](#contributing)
* [License](#license)

# Overview

ZingTouch is built to make implementing gestures for the browser as easy or complex as you need it to be. ZingTouch comes with 6 main gestures : Tap, Swipe, Pinch, Expand, Pan, and Rotate. These 6 gestures can be modified to make custom variations such as requiring multiple inputs, or by tightening/loosening some of the constraints of those gestures. For those who want even more control, you can even create a brand new Gesture and hook the start/move/end events from ZingTouch's life cycle.

---

# Usage


## Methods

### bind(element, gesture, handler, [capture])
Binds a single element to a gesture, executing the handler when the gesture is emitted.

**Parameters**

* element - A DOM element
* gesture - Either the key (string) of a default or registered gesture, or an instance of the `Gesture` class itself.
* handler - A function to be called every time the gesture is emitted.
	* The handler function has an Event object emitted from the [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) interface. Any information relavant to the gesture will be in `event.detail`.
* `capture` - An optional boolean to designate the event to be fired on the capture or bubbling phase.

**Examples**

```
var myElement = document.getElementById('mydiv');
ZingTouch.bind(myElement, 'tap', function(e) {
	console.log('Tap gesture emitted: ' + e.detail);
});
```

```
var myTapGesture = new ZingTouch.Tap({ maxDelay : 100 });
ZingTouch.bind(myElement, myTapGesture, function(e) {
		console.log('My custom tap gesture emitted: ' + e.detail);
}, false);
```

**Notes**

1. Instance Gestures that are passed to bind will be stored and maintained in memory, therefore it is reccomended to reuse gestures object where possible, or to use the `ZingTouch.register` syntax -- they essentially do the same thing. Either works fine, but try to avoid using the following pattern where an instance variable is created at every bind :

```
var delay = 100;
for (var i = 0; i < 100; i++){
	ZingTouch.bind(myElement, new ZingTouch.Tap({maxDelay : delay}),function(e){...});
}

```
---

### bind(element)
Passing a qualified DOM element to the bind function will return an object that can be chainable with the 6 main gestures, or any other gestures that you may have registered with `ZingTouch.register`

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
var chainableObject = ZingTouch.bind(myElement);

chainableObject
	.tap(function(e){
		console.log(e.detail);
	})
	.swipe(function(e){
		console.log(e.detail);
	}, true)
```
---

### unbind(element, [gesture])
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
ZingTouch.unbind(myElement, 'tap');
```

Unbind from all gestures

```
var myElement = document.getElementById('mydiv');
ZingTouch.unbind(myElement);
```

Unbind from a gesture instance.

```
var myElement = document.getElementById('mydiv');
var myTapGesture = new ZingTouch.Tap({ maxDelay : 100 });
ZingTouch.bind(myElement, myTapGesture, function(e) {});

ZingTouch.unbind(myElement, myTapGesture);

```
---

### register(key, gesture)
Register a gesture of the Gesture class to ZingTouch. Allows the newly registered Gesture to be accessible in the bind/unbind syntax including the chainable object of bind.

**Parameters**

* `key` - A string to identify the new gesture.
* `gesture` - An instance of the Gesture class

**Returns**

* The gesture object registered

**Examples**

```
var myTapGesture = new ZingTouch.Tap({ maxDelay : 60 });
ZingTouch.register('shortTap', myTapGesture);
```
And the usages :

```
ZingTouch.bind(myElement, 'shortTap', function(e){});
```

```
ZingTouch.bind(myElement).shortTap(function(e){});
```
---

### unregister(key)
Unregisters a gesture that was previously registered. Unregistering a gesture will automatically unbind any elements that were bound to this gesture.

**Parameters**

* `key` - A string to identify the gesture that will be unregistered.

**Returns**

* The gesture that was unregistered.

**Example**

```
ZingTouch.unregister('shortTap');
```


--

## Gestures
Gesture classes can be instatiated to generate modified versions.

---
### Tap
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
new Tap({
	maxDelay: 200,
	numInputs: 2,
	moveTolerance: 125
})
```

#### Emits

* `interval` - a time measured in milliseconds between the start of the gesture, and the end.

---

### Swipe
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
new Swipe({
	numInputs: 2,
	maxRestTime: 100,
	escapeVelocity: 0.25
})
```

#### Emits

* `velocity` - The value of pixels/milliseconds the gesture was travelling until it's ending point.

---

### Pinch
An expand is detected when the user has two inputs on the screen and moves one or both closer towards the other input.

#### Example
```
new Pinch()
```

#### Emits

* `distance` - The distance in pixels between the two inputs.

---

### Expand
An expand is detected when the user has two inputs on the screen and moves one or both away from the other input.

#### Example
```
new Expand()
```

#### Emits

* `expand` - The distance in pixels between the two inputs.

---

### Pan
A pan is detected when the user touches the screen and moves about the area.

#### Options
* `options.numInputs` *optional* - The number of inputs to trigger the event.
	* Default: 1

#### Example
```
new Pan({
	numInputs: 2
})
```

#### Emits

* `distanceFromOrigin` - The distance in pixels traveled from the current position from the starting position

---

### Rotate
A Rotate is detected when the use has two inputs moving about a circle on the edges of a diameter.

#### Example
```
new Rotate()
```

#### Emits

* `angle` - The angle of the initial right most input, in relation to the unit circle.
* `distance` - The angular distance travlled by the initial right most post.
* `change` - The change of angle between the last position and the current position. Positive denotes a counter-clockwise motion, while negative denotes a clockwise motion.


## Creating New Gestures

# Browser Support

# Contributing

Build dependencies : 

* Build Tool: [Webpack](https://webpack.github.io/)
	* `npm install -g webpack` 
* Documentation Generator: [ESDoc](https://esdoc.org/)
 	* `npm install -g esdoc` 

### npm scripts
* `npm run build:dev` - Builds the unminified library with webpack
* `npm run build:prod` - Builds the minified library with webpack
* `npm run docs` - Builds the docs with esdocs

# License

&copy; 2016 ZingChart, Inc. 