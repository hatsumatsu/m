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
        this._resizeTimer = null;
        this._viewport = {
            prevWidth: undefined,
            prevHeight: undefined,
            width: undefined,
            height: undefined,
        };

        this._initiated = false;

        this._bindEvents();
        this._onResize(false);
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

    destroy() {
        if (this.onDestroy) {
            this.onDestroy();
        }

        document.documentElement.classList.remove('initiated--' + this._name);
        this._initiated = false;
    }

    _bindEvents() {
        window.addEventListener('resize', (this._handleResize = this._handleResize.bind(this)));
    }

    _handleResize() {
        if (this._resizeTimer) {
            clearTimeout(this._resizeTimer);
        }

        this._resizeTimer = setTimeout(() => {
            this._onResize();
        }, 100);
    }

    _onResize(runHook = true) {
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

        this._checkMediaQuery();

        if (runHook && this._initiated && this.onResize) {
            this.onResize(
                this._viewport,
                this._viewport.width < 800 &&
                    this._viewport.width === this._viewport.prevWidth &&
                    Math.abs(this._viewport.height - this._viewport.prevHeight) < 120
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
