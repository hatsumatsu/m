```
        __
       /\  \
      |::\  \
      |:|:\  \
    __|:|\:\  \
   /::::|_\:\__\
   \:\~~\  \/__/
    \:\  \
     \:\  \
      \:\__\
       \/__/

```

Tiny ES6 module template for progressive enhancement.

### Installation

`npm install @superstructure.net/m`

### Usage

Create your module...

```javascript
import M from '@superstructure.net/m';

export default class MyModule extends M {
    constructor(mediaQuery) {
        super(mediaQuery);
    }

    onInit() {}

    onResize(viewport, isUIResize) {}

    onDestroy() {}
}
```

... and use it like

```javascript
import MyModule from './myModule.js';

new MyModule('( min-width: 800px )');
```

Classes extended from M are automatically initiated and destroyed based on the provided media query.

### Lifecycle Functions

##### `onInit()`

##### `onResize( viewport, isUIResize )`

`viewport`: `{ width: 0, height: 0, prevWidth: 0, prevHeight: 0 }`

`isUIResize`: Boolean indicating whether the resize was triggered by a visibility change of the Browser UI on mobile devices.

##### `onDestroy()`

### Methods

##### `this.selector( role )`

Returns an attribute selector based on the module’s name and the provided role.
`this.selector( 'content' )` returns `[data-MyModule-role="content"]`

##### `destroy()`

Manually destroy the instance.

### Internal properties

`this._initiated`: Boolean representing the module’s current init state. If `true` the `<html>` element has a class of `initiated--MyModule`.

`this._name`: The module’s name e.g. `MyModule`.

`this._mediaQuery`: The module’s media query.
