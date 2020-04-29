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
    this._viewport = {
      prevWidth: 0,
      prevHeight: 0,
      width: 0,
      height: 0
    }

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
      if (!selector || selector === document || selector === window) {
        handler.call(this, event);
      // if selector is present and event is not bubbled up o the root
      } else if (event.target !== document) {
        
        // target === selector
        if (event.target.matches(selector)) {
          handler.call(this, event);

        // target is child of selector AND we are not in the capture phase
        } else if (
          event.target.closest &&
          event.target.closest(selector) &&
          !options.capture
        ) {
          event.actualTarget = event.target.closest(selector);

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
    this._initiated = true;
    document.documentElement.classList.add('initiated--' + this._namespace);

    if (this.onInit) {
      this.onInit();
    }    
  }

  destroy() {
    this._removeEvents();

    if (this.onDestroy) {
      this.onDestroy();
    }    

    document.documentElement.classList.remove('initiated--' + this._namespace);
    this._initiated = false;
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

    this._viewport.prevWidth = this._viewport.width || 0;
    this._viewport.prevHeight = this._viewport.height || 0;
    this._viewport.width = window.innerWidth;
    this._viewport.height = window.innerHeight;

    if (this.onResize) {
      this.onResize( 
        this._viewport, 
        ( this._viewport.width < 800 && this._viewport.width === this._viewport.prevWidth && Math.abs( this._viewport.height - this._viewport.prevHeight ) < 100 ) 
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
