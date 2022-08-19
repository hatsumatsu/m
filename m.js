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
    constructor(mediaQuery) {
        super(mediaQuery);
    }

    onInit() {}

    onResize(viewport, isUIResize) {} 

    onDestroy() {}
} 

 *
 * 
 */

export default class M {
  constructor(mediaQuery = 'screen') {
    this._name = this.constructor.name.toLowerCase();

    this._mediaQuery = mediaQuery;
    this._mediaQueryList = window.matchMedia(mediaQuery);

    this._resizeDelay = 500;
    this._resizeDebounce = null;
    this._runResizeHook = false;
    this._viewport = {
      prevWidth: undefined,
      prevHeight: undefined,
      width: undefined,
      height: undefined
    };

    this._initiated = false;

    this._onResize();
    this._onMediaQueryChange();

    this._bindEvents();
  }

  selector(role) {
    if (!role) {
      return;
    }

    return '[data-' + this._name + '-role~="' + role + '"]';
  }

  /**
   * Internal functions
   */
  _init() {
    this._initiated = true;
    document.documentElement.classList.add('initiated--' + this._name);

    if (this.onInit) {
      this.onInit();
    }
  }

  _destroy() {
    if (this.onDestroy) {
      this.onDestroy();
    }

    document.documentElement.classList.remove('initiated--' + this._name);
    this._initiated = false;
  }

  _bindEvents() {
    /**
     * MediaQueryList listener
     */
    if (this._mediaQueryList.addEventListener) {
      this._mediaQueryList.addEventListener('change', () => {
        this._handleMediaQueryChange();
      });
    } else if (this._mediaQueryList.addListener) {
      this._mediaQueryList.addListener(() => {
        this._handleMediaQueryChange();
      });
    }

    /**
     * Resize event
     */
    window.addEventListener('resize', () => {
      this._handleResize();
    });
  }

  _handleMediaQueryChange() {
    this._runResizeHook = false;
    this._onMediaQueryChange();
  }

  _handleResize() {
    clearTimeout(this._resizeDebounce);

    this._resizeDebounce = setTimeout(() => {
      this._onResize();
    }, this._resizeDelay);
  }

  _onMediaQueryChange() {
    if (this._mediaQueryList.matches) {
      if (!this._initiated) {
        this._init();
      }
    } else {
      if (this._initiated) {
        this._destroy();
      }
    }
  }

  _onResize() {
    this._viewport.prevWidth = this._viewport.width || window.innerWidth;
    this._viewport.prevHeight = this._viewport.height || window.innerHeight;
    this._viewport.width = window.innerWidth;
    this._viewport.height = window.innerHeight;

    // calculate 100vh
    const _div = document.createElement('div');
    _div.style.height = '100vh';
    document.body.appendChild(_div);
    this._viewport.height100vh = _div.clientHeight;
    document.body.removeChild(_div);

    if (this._runResizeHook && this._initiated && this.onResize) {
      this.onResize(
        this._viewport,
        this._viewport.width < 840 &&
          this._viewport.width === this._viewport.prevWidth &&
          Math.abs(this._viewport.height - this._viewport.prevHeight) < 120
      );
    }

    this._runResizeHook = true;
  }
}
