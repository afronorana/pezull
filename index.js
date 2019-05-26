const Pezull = {
  windowHeight: document.documentElement.clientHeight,
  windowWidth: document.documentElement.clientWidth,

  /**
   * This function sets default options, overwrites new options
   * and inits activateClases()
   * @param {Object} options
   */
  default: (options) => {
    let _options = {
      activeAreaTop: 50,
      activeAreaHeight: 40,
      breakpoint: 767,
      activeClass: 'hovering',
      listenerClass: 'pezull',
      dev: false,
      touchOnly: false
    };

    options = Object.assign(_options, options);

    if (Pezull.windowWidth > options.break) return;
    if (options.touchOnly && !Pezull.isTouchDevice()) return;
    if (options.dev) {Pezull.showDevArea(options);}

    Pezull.activateClasses(options);
  },

  /**
   * This function appends a div to body, to make devlopment more clear
   * @param {Object} options
   */
  showDevArea: (options) => {
    let areaElement = document.createElement('div');

    areaElement.style = `
            position: fixed;
            width: 100%;
            pointer-events: none;
            opacity: .2;
            background-image: linear-gradient(45deg, transparent 25%, #ff0000 25%, #ff0000 50%, transparent 50%, transparent 75%, #ff0000 75%, #ff0000 100%);
            background-size: 56.57px 56.57px;
        `;

    areaElement.style.height = Pezull.convertTopPx(
        options.activeAreaHeight) + 'px';
    areaElement.style.top = Pezull.convertTopPx(options.activeAreaTop) +
        'px';
    document.getElementsByTagName('body')[0].appendChild(areaElement);
  },

  /**
   * This function checks if it is a touch device
   * @returns {boolean}
   */
  isTouchDevice: () => {
    return 'ontouchstart' in document.documentElement;
  },

  /**
   * This function converts css units to pixels.
   * @param {string/number} input css units
   * @returns {number} units in px.
   */
  convertTopPx: (cssUnits) => {
    let unitsInPx;

    if (typeof (cssUnits) === 'number')
      unitsInPx = cssUnits;
    else {
      let unitsType = cssUnits.slice(-2);
      let amount = cssUnits.slice(0, -2);
      switch (unitsType) {
        case 'px':
          unitsInPx = amount;
          break;
        case 'vw': {
          unitsInPx = amount * Pezull.windowWidth / 100;
          break;
        }
        case 'vh': {
          unitsInPx = amount * Pezull.windowHeight / 100;
          break;
        }
        default: {
          throw '\'activeAreaTop\' accepts Number, px, vw or vh';
        }
      }
    }
    return parseInt(unitsInPx);
  },

  /**
   * This function adds/removes class to the elements inside the area
   * @param {Object} options
   */
  activateClasses: (options) => {
    let pezullElements = document.getElementsByClassName(
        options.listenerClass);

    let activeAreaHeight = Pezull.convertTopPx(options.activeAreaHeight);
    let margins = Pezull.convertTopPx(options.activeAreaTop);

    window.addEventListener('scroll', function(e) {
      for (let element of pezullElements) {
        let elementTop = element.getBoundingClientRect().top;
        if (elementTop > margins && elementTop < margins +
            activeAreaHeight) {
          element.classList.add(options.activeClass);
        } else {
          element.classList.remove(options.activeClass);
        }
      }
    });
  }
};

module.exports.default = Pezull.default;
