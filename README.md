`````
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

`````

Tiny ES6 module template for progressive enhancement.

### Installation

`npm install @superstructure.net/m`


### Usage

`````
import M from @superstructure.net/m;

export default class MyModule extends M {
  constructor() {
    super({
      namespace: 'myModule',
      mediaQuery: '( min-width: 800px )'
    });
  }

  onInit() {}

  onResize( viewport, isUIResize ) {}

  onDestroy() {}
}
`````

### Features

+ Automatically init / destroy modules depending on media queries.
+ Add namespaced delegated events via `this.addEvent()` that get automatically removed when the module is destroyed.

### Lifecycle Functions

##### `onInit()`

##### `onResize( viewport, isUIResize )`
`viewport`: `{ width: 0, height: 0, prevWidth: 0, prevHeight: 0 }`
`isUIResize`: boolean indicating whether the resize was triggered by a visibility change of the Browser UI on mobile.

##### `onDestroy()`

### Methods

##### `this.addEvent( type, selector, handler, options )`
Add delegated namespaced events that get automatically removed when the module s destroyed.

`type`: like `click`, `touchstart`, `module/action`

`selector`: like `.class`, `[data-role="element"]`, `window`, `null = document`

`handler`: like `this.onClick`

`options`: [options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) passed to `addEventListener` like `{ capture: true }` 

##### `this.triggerEvent( type, data, element )`
Trigger `type` event on `element` (defaults to `document`) passing an optional `data` object.


##### `this.selector( role )`
Returns an attribute selector based on the modules namespace and the passed role. 
`this.selector( 'content' )` returns `[data-{namespace}-role="content"]`

##### `destroy()`
Manually destroy the module instance.






