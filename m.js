/**
 * 
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

M

Tiny ES6 module template for progressive enhancement.



import M from '@superstructure.net/m';

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

 *
 * 
 */

export default class M {
  constructor(options) {
    this._namespace = options.namespace;
    this._mediaQuery = options.mediaQuery;
    this._events = [];
    this._resizeTimer = null;
    this._viewport = {}
    this._initiated = false;

    this._bindEvents();
    this._checkMediaQuery();
  }

  /**
   * Exposed functions
   */
  addEvent(type, selector = document, handler = () => {}, options = {}) {
    if (!type) {
      return;
    }

    let _event = {};
    _event['type'] = type;
    _event['target'] = selector === window ? window : document;
    _event['options'] = options;
    _event['handler'] = () => {
      // if no selector or selector is root element,
      // directly call handler
      // otherwise check for delegation
      if (!selector || selector === document || selector === window) {
        handler.call(this, event);
      } else if (event.target === document) {
        // ignoring events bubbled to the root...
      } else {
        if (
          event.target.matches(selector) ||
          (!options.capture && event.target.closest(selector))
        ) {
          if( !event.target.matches(selector) && event.target.closest ) {
            event.actualTarget = event.target.closest(selector);
          }

          handler.call(this, event);
        }
      }
    };
    _event['handler'].bind(this);

    _event['target'].addEventListener(type, _event['handler'], options);

    this._events.push(_event);
  }

  triggerEvent(type, data = {}, element = document) {
    if (!type) {
      return;
    }

    let _event = new CustomEvent(type, {
      bubbles: true,
      detail: data
    });

    element.dispatchEvent(_event);
  }

  selector(role) {
    if (!role) {
      return;
    }

    return '[data-' + this._namespace + '-role="' + role + '"]';
  }

  /**
   * Internal functions
   */
  _init() {
    if (this.onInit) {
      this.onInit();
    }

    this._initiated = true;
    document.documentElement.classList.add('initiated--' + this._namespace);
  }

  destroy() {
    this._removeEvents();

    document.documentElement.classList.remove('initiated--' + this._namespace);
    this._initiated = false;

    if (this.onDestroy) {
      this.onDestroy();
    }
  }

  _bindEvents() {
    window.addEventListener(
      'resize',
      (this._handleResize = this._handleResize.bind(this))
    );
  }

  _removeEvents() {
    this._events.forEach(event => {
      event['target'].removeEventListener(
        event['type'],
        event['handler'],
        event['options']
      );
    });

    this._events = [];
  }

  _handleResize() {
    if (this._resizeTimer) {
      clearTimeout(this._resizeTimer);
    }

    this._resizeTimer = setTimeout(() => {
      this._onResize();
    }, 100);
  }

  _onResize() {
    this._checkMediaQuery();

    this.viewport.prevWidth = this.viewport.width;
    this.viewport.prevHeight = this.viewport.height;
    this.viewport.width = window.innerWidth;
    this.viewport.height = window.innerHeight;

    if (this.onResize) {
      this.onResize( 
        this.viewport, 
        ( this.viewport.width < 800 && this.viewport.width === this.viewport.prevWidth && Math.abs( this.viewport.height - this.viewport.prevHeight ) < 100 ) 
        );
    }    
  }

  _checkMediaQuery() {
    if (window.matchMedia(this._mediaQuery).matches) {
      if (!this._initiated) {
        this._init();
      }
    } else {
      if (this._initiated) {
        this.destroy();
      }
    }
  }
}
