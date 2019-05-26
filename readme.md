
# Pezull.js

Pezull.js is a Javascript library which simulates hover effect on touch devices
It works by selecting the 'active area', where the selected class is added to the elements entering it.
#### [Demo](https://jsfiddle.net/mny9fox8/5/)

## Installation

Install pezull.js using your favorite package manager.

#### Install with [npm](https://www.npmjs.com/):

```
npm install pezull
```
#### Install with [yarn](https://yarnpkg.com):

```
yarn add pezull
```

#### Using with cdn

[https://unpkg.com/pezull](https://unpkg.com/pezull)

## How it works

Pezull.js sets an _active area_, and on scroll listens for elements with the 'pezull' class to enter it. On enter, the class 'hovering' is added to those elements, and on leave, it is removed.
_pezull_ and _hovering_ are the default classes and can be altered by passing them on the options object.

## Usage

Import the library:

```javascript
var Pezull = require('pezull').default;
```
Initialize it:
```
Pezull();
```

Add your custom css to the active class
```
.hovering {  
    background: rebeccapurple;
    color: white;
}
```

## Options

Pezull accepts an options object to alter the way it works. You can see the default options below

```javascript

Pezull({
    activeAreaTop: '20vh',
    activeAreaHeight: '60vh',
    breakpoint: 767,
    activeClass: 'hovering',
    listenerClass: 'pezull',
    dev: false,
    touchOnly: false
});
```

#### activeAreaTop
_default: : '20vh'_
Sets the offset of the active area from the top of the screen.
Accepts a _{number}_ or a _{String}_ of css units (at the moment supports 'px', 'vw', and 'vh')
When passing a number, it will be considered as pixels.

#### activeAreaHeight
_default: : '60vh'_
Sets the height of the active area.
Accepts a _{number}_ or a _{String}_ of css units (at the moment supports 'px', 'vw', and 'vh')
When passing a number, it will be considered as pixels.

#### breakpoint
_default: : 767_
Sets the maximum width of the viewport for pezull to be initialized.
Accepts a _{number}_ which is considered as pixels.

#### activeClass
_default: : 'hovering'_
Class which will be added to the elements that are inside the active area.
Accepts a _{String}_.

#### listenerClass
_default: : 'pezull'_
Class which needs to be added to the chosen elements, for the active class to be added to them on enter of the active area.
Accepts a _{String}_.

#### dev
_default: : false_
Visualizes the ac21tive area to make implementation easier.
Accepts a _{boolean}_.

#### touchOnly
_default: : true_
Initializes pezull only if its on a touch device.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
