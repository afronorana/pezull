# Pezull

Pezull is a Javascript library which makes it easy to add 'hover' effects on touch devices.

## Installation

Use the package manager [npm](https://#/) to install Pezull.

```bash
npm install pezull
```

## Usage

Add HTML element

```html
<div id='pezull-area'></>
```
Then import and init the library
```javascript
import pezull

Pezull('#pezull-area');
```

## Options

Pezull at the moment is very limited, and offers only three options which can be seen below
```javascript

Pezull('#pezull-area', {
    breakpoint: 767,
    classes: {
        active: 'pezull-active',
    },
    activeArea: 80
});
```
### breakpoint
Breakpint accepts a number from where the pezull is inited.

### dev
dev accepts a boolean, when set to true, an active-area div is drawn


### classes
classes object has the classnames that are attached to the elements on different cases, explained below.

    active: 'pezull-active' // Contains the class that is binded to the elements that enter the active area

### activeArea
Accepts a number 1-100, which is the percentage of the active area height.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
