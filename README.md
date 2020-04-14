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

  onResize() {}

  onDestroy() {}
}
`````

### Features

+ Automatically init / destroy modules depending on media queries.
+ Add namespaced delegated events via `this.addEvent()` that get automatically removed when the module is destroyed.

### Lifecycle Functions

##### `onInit()`

##### `onResize()`

##### `onDestroy()`

##### `onInit()`

### Methods

##### `this.addEvent( type, selector, handler, options )`
Add delegated namespaced events that get automatically removed when the module s destroyed.
`type` — `click`, `touchstart`, `module/action`
`selector` — `.class`, `[data-role="element"]`, `window`, `null = document`
`handler` — `function( event )`
`options` — options passed to addEventListener like `{ capture: true }` 

##### `this.triggerEvent( type, data, element )`
Trigger `type` event on `element` (defaults to `document`) passing an optional `data` object.


##### `this.selector( role )`
Returns an attribute selector based on the modules namespace and the passed role. 
`this.selector( 'content' )` returns `[data-{namespace}-role="content"]`

##### `destroy()`
Manually destroy the module instance.






