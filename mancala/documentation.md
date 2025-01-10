This code defines several classes and functions related to vector operations, line segments, and animations.

## Vector Class
The `Vector` class represents a 2D vector and has the following methods:
- `distance(x1, y1, x2, y2)`: returns the distance between two points with coordinates `(x1, y1)` and `(x2, y2)`.
- `getDir(x, y)`: returns the direction in degrees of a vector with components `x` and `y`.
- `rad(deg)`: converts an angle from degrees to radians.
- `getPointIn(dir, dist, ox, oy)`: returns a new `Vector` instance representing a point at a distance `dist` and direction `dir` from an origin point with coordinates `(ox, oy)`.
- `constructor(x, y)`: creates a new `Vector` instance with components `x` and `y`.
- `mult(m)`: returns a new `Vector` instance with components scaled by `m`.
- `add(x, y)`: returns a new `Vector` instance with components translated by `x` and `y`.
- `clone()`: returns a new `Vector` instance with the same components.

## Line Class
The `Line` class represents a line segment and has the following methods:
- `constructor(px1, py1, px2, py2)`: creates a new `Line` instance with endpoints `(px1, py1)` and `(px2, py2)`.
- `setPos(px1, py1, px2, py2)`: updates the endpoints of the line segment.
- `getPosA()`: returns a new `Vector` instance representing the first endpoint of the line segment.
- `getPosB()`: returns a new `Vector` instance representing the second endpoint of the line segment.
- `touches(line)`: returns the intersection point of this line segment and another line segment `line`, or `undefined` if they do not intersect.
- `draw(color)`: draws the line segment on a 2D canvas context with the specified `color`.


## Animation Class
The `Animation` class represents an animated sequence of images and has the following methods:
- `xml(path, fn)`: sends an XMLHttpRequest to retrieve data from the specified `path` and calls `fn` with the response text when it is received.
- `constructor(element, data)`: creates a new `Animation` instance for the HTML `img` element with ID `element` using image data in the JSON format `data`.
- `pad(n)`: pads a number `n` with leading zeros to match the number of digits in the total number of frames in the animation.
- `loop()`: advances the animation to the next frame and updates the HTML `img` element if the elapsed time since the last update exceeds the desired frame rate.
- `play(name, is_loop)`: starts playing the animation sequence with the specified `name` and looping behavior `is_loop`, and returns a promise that resolves when the animation finishes.
- `stop()`: stops the animation and calls the `end` function.


## Hitbox Class
The `Hitbox` class is used to define a hitbox in a 2D space, which is a rectangular area used for collision detection. This class has the following properties and methods:

### Properties

- `pos`: an object representing the position of the center of the hitbox, with `x` and `y` properties indicating the coordinates.
- `w`: a number representing the width of the hitbox.
- `h`: a number representing the height of the hitbox.
- `lines`: an array of four `Line` objects that represent the four sides of the hitbox.
- `angles`: an array of four angles in radians representing the angles of the corners of the hitbox.
- `scale`: an object representing the scale of the hitbox, with `x` and `y` properties indicating the scale factors.
- `offset`: an object representing the offset of the hitbox, with `x` and `y` properties indicating the offset values from the center of the hitbox.
- `dir`: a number representing the direction of the hitbox in radians.

### Methods

- `constructor(pos, w, h)`: creates a new `Hitbox` object with the given position, width, and height. Initializes the `lines`, `angles`, `scale`, `offset`, and `dir` properties, and calls the `update` method.
- `update()`: updates the `angles` and `lines` properties of the hitbox based on its `pos`, `w`, `h`, `scale`, `offset`, and `dir` properties.
- `DRAW(color)`: draws the hitbox on a canvas with the given color. Draws a small dot at the center of the hitbox, and the four `Line` objects in the `lines` array.
- `touches(hitbox)`: checks if the hitbox collides with another hitbox. Takes another `Hitbox` object as argument and returns `true` if they touch, otherwise returns `false`.
- `set direction(d)`: sets the direction of the hitbox in radians and calls the `update` method. Returns the new direction value.
- `set position(v)`: sets the position of the hitbox to the given vector `v` and calls the `update` method. Returns the new position vector.
- `set width(w)`: sets the width of the hitbox to the given value `w` and calls the `update` method. Returns the new width value.
- `set height(h)`: sets the height of the hitbox to the given value `h` and calls the `update` method. Returns the new height value.
- `set setScale(v)`: sets the `scale` property of the hitbox to the given vector `v` and calls the `update` method. Returns the new `scale` vector.
- `set setOffset(v)`: sets the `offset` property of the hitbox to the given vector `v` and calls the `update` method. Returns the new `offset` vector.

### Static properties

- `show`: a boolean indicating whether to show the hitbox or not. Used in the `DRAW` method to determine whether to draw the hitbox or not.


## Sprite Class
The `Sprite` class is a subclass of `Hitbox`. It extends `Hitbox` by adding the ability to load and display an image on the canvas. It also adds methods for animations, movement, and attacking.

The `Sprite` class has a constructor that creates an instance with a position and dimensions set to (-100,-100) and 1x1. The `draw()` method is called every frame to draw the sprite onto a 2D canvas. If the `visible` property is set to `false`, nothing is drawn. If an `animation` is set, it is played every frame. If `sliding` is set to `true`, the sprite moves in a straight line towards a target position using a sliding animation. The `addAnimation(animation_path)` method loads an XML file that defines an animation, and returns a Promise that resolves when the animation is loaded. The `addMovement(callback)` method sets the `move` property to a callback function that is called every frame. The `attack(callback)` method sets the `attack` property to a callback function that is called every frame.

The `slideTo(x,y,segs)` method moves the sprite in a straight line towards a target position `(x,y)`. The `segs` parameter sets the number of frames for the sliding animation. It returns a Promise that resolves when the animation is complete.

The `Sprite` class also adds a private property `#iter`, which is the current frame of the sliding animation, and a private property `#max_iter`, which is the total number of frames for the sliding animation. The `#slide_x` and `#slide_y` properties are the distance the sprite moves per frame during the sliding animation. The `#end_slide` property is a callback function that is called when the sliding animation is complete.