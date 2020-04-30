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


Classes extended from M are automatically initiated and destroyed based on the provided media queries.

### Lifecycle Functions

##### `onInit()`

##### `onResize( viewport, isUIResize )`
`viewport`: `{ width: 0, height: 0, prevWidth: 0, prevHeight: 0 }`

`isUIResize`: boolean indicating whether the resize was triggered by a visibility change of the Browser UI on mobile.

##### `onDestroy()`

### Methods

##### `this.selector( role )`
Returns an attribute selector based on the modules namespace and the passed role. 
`this.selector( 'content' )` returns `[data-{namespace}-role="content"]`

##### `destroy()`
Manually destroy the instance.






