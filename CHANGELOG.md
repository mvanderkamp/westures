# Changelog

## 1.0.0

- Official first release! The engine is no longer considered to be in beta.
- Refactor Smoothable to be a data type, not a mixin.
- Remove the Binding class and integrate with the Gesture class. It was more of
  a hindrance than a help on its own.
- Provide automatic detection of enabled and disabled gestures, including using
  keys to enable and disable, in a simple way such that gestures don't need to
  check if their enabled inside their hooks.
- 'cancel' phase is now properly called.
- Region class now takes an optional 'options' object instead of lots of
  arguments.
- Remove the 'getProgressOfGesture' method from the Input class. Gestures should
  track their progress internally, on their own instance!
- Remove the 'radius' property from the outgoing data. It didn't seem useful and
  was just cluttering the output.
- Use Sets for tracking Gestures inside the Region instead of Arrays. (Faster
  access operations).
- Update the Press gesture to allow multiple presses, one after the other, by
  adding successive inputs. Effectively makes it a multi-touch press! Single
  touch press is still possible using the min/maxInputs options!
- Use a Pivotable base gesture type for Swivel and Pull.
- Improved documentation by showing all of westures-core
- Change pivotCenter -> dynamicPivot, default to false
- Clean up Rotate implementation to reduce reliance on side effects
- Switch to using pointer events by default, combined with setting touch-action:
  none on the gesture elements (not the region itself).
- Provide options on the Region for choosing whether to prefer pointer events
  over mouse/touch events (preferPointer) and what to set the touch-action
  property to on gesture elements (touchAction).
- Default to using the window as the region if no element provided.
- Add mouseleave to the CANCEL_EVENTS
- Include the core engine as a git submodule instead of relying on the npm package.
    - Keeps the core code out of node_modules which simplifies a lot of things...

## 0.7.8

- Add a Pull gesture. Pull is to Pinch as Swivel is to Rotate. In other words,
  the data is calculated relative to a fixed point, rather than relative to the
  other input points.

## 0.7.7

- Simplify the Swivel class a bit.

## 0.7.6

- Update dev support packages and switch to parcel-bundler for the distributable
  instead of browserify. This bundle is now found in the dist/ folder, along
  with a source map. Support for the old 'bundle.js' and 'bundle.min.js' is
  approximately maintained by providing two copies of 'dist/index.js' under
  those names. They will be removed in subsequent releases.

## 0.7.5

- Improvements to the Press gesture. No longer fails as touches are added,
  supports layering of Presses. For example, you can have presses that respond
  to 1,2,3,... however many touches all attached to the same element, and they
  will each fire in turn as touches are added (but not as they are removed!).
    - [POSSIBLE BREAKING] The 'numInputs' option was renamed to 'minInputs'.
- Remove confusing and unnceessary console.warn() statements from core engine.

## 0.7.4

- Add a check that ensures smoothing will only ever be applied on devices that
  need it. That is, devices with 'coarse' pointers.

## 0.7.3

- [POSSIBLE BREAKING] But only for those who have implemented their own
  Smoothable gesture with a non-zero identity value (e.g. Rotate has an identity
  of 0, as that represents no change, and Pinch has an identity of 1, as that
  represents no change). Such gestures will now need to declare their own
  identity value *after* calling super() in the constructor.
    - The smoothing algorithm used by the Smoothable mixin has been
      simplified.  There is no delay to emits, as analysis of the data
      revealed this really only occurred for the first emit. Instead a
      simple rolling average is maintained.
    - Additionally, note that `this.smooth(data, field)` must be called instead
      of `this.emit(data, field)`
- Add an experimental Press gesture.

## 0.7.2

- Fix bug in gestures that used the Smoothable mixin which prevented their
  default 'smoothing' setting from being used.
- Turn on smoothing by default in Pan.

## 0.7.1

- Add `babelify` transform for `bundle.js`. Should add Edge support, and at the
  very least opens up the possibility of expanding browser support a bit.

## 0.7.0

- Use new Smoothable mixin from `westures-core` for Pan, Pinch, Rotate, and
  Swivel. Set smoothing as enabled by default, except in Pan (may enable
  later...)
- Place the `angularMinus` function into its own file, so that it can be used by
  both Rotate and Swivel.
- Make Swivel multitouch-capable.
- Change names of emitted data properties to be more idiomatic. 'rotation' for
  Rotate and Swivel instead of delta, 'scale' for Pinch and 'translation' for
  Pan instead of change.
- Point2D#midpoint was renamed to Point2D#centroid
- centroid and radius were added to base data for emits.
- Preference is now given to data from the gesture over base data in the case of
  property name collisions.

## 0.6.3

- Switch to simple average for Pinch and Rotate smoothing
    - This makes the smoothing more general, ensures a 60fps update rate is
      maintained, and generally has a nicer feel to it.
    - Downside is that there will be a bit of drift, but that's why this setting
      is optional!

## 0.6.2

- Add optional smoothing to Pinch and Rotate (on by default).

## 0.6.1

- Treat 'touchcancel' and 'pointercancel' the same way as 'blur'.
    - This is an unfortunate hack, necessitated by an apparent bug in Chrome,
      wherein only the _first_ (primary?) pointer will receive a 'cancel' event.
      The other's are cancelled, but no event is emitted. Their IDs are reused
      for subsequent pointers, making gesture state recoverable, but this is
      still not a good situation.
    - The downside is that this workaround means that if any single pointer is
      cancelled, _all_ of the pointers are treated as cancelled. I don't have
      enough in depth knowledge to say for sure, but I suspect that this doesn't
      have to be the case. If I have time soon I'll post a ticket to Chrome, at
      the very least to find out if this is actually a bug (my read of the spec
      tells me that it is).
    - The upside is that this should be pretty fail-safe, when combined with the
      'blur' listener on the window.

## 0.6.0

- Fix Tap bug preventing rapid taps.
    - 'ended' list wasn't being cleared on an emit, preventing further emits if
      taps came in rapid succession.
- Expand default deadzone radius of Swivel.
- Fix bugs in Swipe:
    - Make sure swipe state is reset on 'start' and after 'end' phases.
    - Prevent delayed emits if the user stops suddenly and doesn't move again
      before releasing the pointer.
- [BREAKING CHANGE] Use inner fields instead of input progress.
    - Breaking because you can't reuse some of the Gesture objects the way you
      could previously.
    - Slightly more efficient, therefore preferable overall.
    - Rotate still uses input progress so that angle changes can be tracked on a
      per-input basis, which is more responsive than anything else I've tried so
      far.

## 0.5.4

- Add 'cancel' phase support for touchcancel and pointercancel.
    - For most gestures, will probably be the same as 'end', but it must be
      different for gestures that emit on 'end'.
- Add a 'blur' listener to window to reset the state when the window loses
  focus.
- Fix Swivel bug in Edge: Edge doesn't provide 'x' and 'y' fields with
  'getBoundingClientRect', so use 'left' and 'top' instead.
- Make Swipes work for multitouch.

## 0.5.3

- Fix buggy Swivel results caused by >1 active inputs.
- Fix bugs in Swipe:
    - Erroneous acceptance of >1 inputs.
    - Velocity going to infinity in some cases (division by 0)
    - Direction calculation could produce errors, switched to using a more
      common mathematical approach.
- Normalize Swipe a bit by taking average velocity instead of max. 

## 0.5.2

- Fix bug in Swivel when using the `pivotCenter` option. Initial angle wasn't
  being set correctly, causing jumps when initiating a Swivel.

## 0.5.0

- Rename Region#bind() -> Region#addGesture() and Region#unbind() ->
  Region#removeGestures().
    - I was not happy with the way that the 'bind' naming clashes with the
      'bind' function on the Function prototype.
- Simplified "unbind" function. It now returns null, as the Bindings should not
  be exposed to the end user.
- Sped up Binding selection in the Region's `arbitrate` function, while
  simultaneously fixing a critical bug!
    - Only the bindings associated with elements on the composed path of the
      first input to touch the surface will be accessed.
    - In other words, this batch of bindings is cached instead of being
      recalculated on every input event.
    - Previously, if the user started one input in one bound element, then
      another input in another bound element, the bindings for both elements
      would think they have full control, leading to some potentially weird
      behaviour.
    - If you want this behaviour, you'll now have to simulate it by creating a
      separate region for each binding.
- Removed Region#getBindingsByInitialPos
- Removed State#someInputWasInitiallyInside
- Improved test coverage a bit

