const Pezull = {
  default: (id, options) => {
    let windowWidth = document.documentElement.clientWidth;

    let _options = {
      breakpoint: 767,
      classes: {
        listener: 'pezull',
        active: 'pezull-active'
      },
      activeArea: 80,
      dev: false,
      touchOnly: Pezull.checkTouchDevice()
    };

    options = Object.assign(_options, options);
    if (windowWidth > options.break) return;

    if (options.dev) {
      Pezull.showDevArea(id);
    }

    Pezull.rolloverEffect(options);

  },

  showDevArea: (id) => {
    let areaElement = document.createElement('div');
    areaElement.setAttribute('id', id);
    document.getElementsByTagName('body')[0].appendChild(areaElement);
  },

  checkTouchDevice: () => {
    return 'ontouchstart' in document.documentElement;
  },


  rolloverEffect: (options) => {
    // pezullElements: elements containing listener class
    let pezullElements = document.getElementsByClassName(options.classes.listener);

    let windowHeight = document.documentElement.clientHeight; // TBDELETED
    let activeAreaHeight = windowHeight * options.activeArea / 100

    let margins = (windowHeight - activeAreaHeight) / 2

    window.addEventListener('scroll', function(e) {
      for (let element of pezullElements) {
        let elementTop = element.getBoundingClientRect().top;

        if (elementTop > margins && elementTop < margins + activeAreaHeight) {
          element.classList.add(options.classes.active);
        } else {
          element.classList.remove(options.classes.active);
        }
      }
    });
  }
}

module.exports.default = Pezull.default;
