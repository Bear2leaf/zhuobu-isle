/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _window2 = __webpack_require__(1);

	var _window = _interopRequireWildcard(_window2);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var global = GameGlobal;

	function inject() {
	  _window.addEventListener = function (type, listener) {
	    _window.document.addEventListener(type, listener);
	  };
	  _window.removeEventListener = function (type, listener) {
	    _window.document.removeEventListener(type, listener);
	  };

	  if (_window.canvas) {
	    _window.canvas.addEventListener = _window.addEventListener;
	    _window.canvas.removeEventListener = _window.removeEventListener;
	  }

	  var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
	      platform = _wx$getSystemInfoSync.platform;

	  // 开发者工具无法重定义 window


	  if (platform === 'devtools') {
	    for (var key in _window) {
	      var descriptor = Object.getOwnPropertyDescriptor(global, key);

	      if (!descriptor || descriptor.configurable === true) {
	        Object.defineProperty(window, key, {
	          value: _window[key]
	        });
	      }
	    }

	    for (var _key in _window.document) {
	      var _descriptor = Object.getOwnPropertyDescriptor(global.document, _key);

	      if (!_descriptor || _descriptor.configurable === true) {
	        Object.defineProperty(global.document, _key, {
	          value: _window.document[_key]
	        });
	      }
	    }
	    window.parent = window;
	  } else {
	    for (var _key2 in _window) {
	      global[_key2] = _window[_key2];
	    }
	    global.window = _window;
	    window = global;
	    window.top = window.parent = window;
	  }
	}

	if (!GameGlobal.__isAdapterInjected) {
	  GameGlobal.__isAdapterInjected = true;
	  inject();
	}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.cancelAnimationFrame = exports.requestAnimationFrame = exports.clearInterval = exports.clearTimeout = exports.setInterval = exports.setTimeout = exports.removeChild = exports.appendChild = exports.URL = exports.MutationObserver = exports.HTMLElement = exports.ResizeObserver = exports.FileReader = exports.AudioContext = exports.Audio = exports.ImageData = exports.Image = exports.XMLHttpRequest = exports.navigator = exports.document = undefined;

	var _WindowProperties = __webpack_require__(2);

	Object.keys(_WindowProperties).forEach(function (key) {
	    if (key === "default" || key === "__esModule") return;
	    Object.defineProperty(exports, key, {
	        enumerable: true,
	        get: function get() {
	            return _WindowProperties[key];
	        }
	    });
	});

	var _document = __webpack_require__(4);

	var _document2 = _interopRequireDefault(_document);

	var _navigator = __webpack_require__(18);

	var _navigator2 = _interopRequireDefault(_navigator);

	var _XMLHttpRequest = __webpack_require__(19);

	var _XMLHttpRequest2 = _interopRequireDefault(_XMLHttpRequest);

	var _Image = __webpack_require__(11);

	var _Image2 = _interopRequireDefault(_Image);

	var _ImageData = __webpack_require__(20);

	var _ImageData2 = _interopRequireDefault(_ImageData);

	var _Audio = __webpack_require__(12);

	var _Audio2 = _interopRequireDefault(_Audio);

	var _AudioContext = __webpack_require__(21);

	var _AudioContext2 = _interopRequireDefault(_AudioContext);

	var _FileReader = __webpack_require__(27);

	var _FileReader2 = _interopRequireDefault(_FileReader);

	var _ResizeObserver = __webpack_require__(28);

	var _ResizeObserver2 = _interopRequireDefault(_ResizeObserver);

	var _HTMLElement = __webpack_require__(5);

	var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

	var _MutationObserver = __webpack_require__(29);

	var _MutationObserver2 = _interopRequireDefault(_MutationObserver);

	var _URL = __webpack_require__(30);

	var _URL2 = _interopRequireDefault(_URL);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.document = _document2.default;
	exports.navigator = _navigator2.default;
	exports.XMLHttpRequest = _XMLHttpRequest2.default;
	exports.Image = _Image2.default;
	exports.ImageData = _ImageData2.default;
	exports.Audio = _Audio2.default;
	exports.AudioContext = _AudioContext2.default;
	exports.FileReader = _FileReader2.default;
	exports.ResizeObserver = _ResizeObserver2.default;
	exports.HTMLElement = _HTMLElement2.default;
	exports.MutationObserver = _MutationObserver2.default;
	exports.URL = _URL2.default;


	var windowElement = new _HTMLElement2.default();
	var appendChild = windowElement.appendChild.bind(windowElement);
	var removeChild = windowElement.removeChild.bind(windowElement);
	exports.appendChild = appendChild;
	exports.removeChild = removeChild;
	exports.setTimeout = setTimeout;
	exports.setInterval = setInterval;
	exports.clearTimeout = clearTimeout;
	exports.clearInterval = clearInterval;
	exports.requestAnimationFrame = requestAnimationFrame;
	exports.cancelAnimationFrame = cancelAnimationFrame;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.performance = exports.style = exports.ontouchend = exports.ontouchmove = exports.ontouchstart = exports.screen = exports.devicePixelRatio = exports.innerHeight = exports.innerWidth = undefined;

	var _performance = __webpack_require__(3);

	var _performance2 = _interopRequireDefault(_performance);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
	    screenWidth = _wx$getSystemInfoSync.screenWidth,
	    screenHeight = _wx$getSystemInfoSync.screenHeight,
	    devicePixelRatio = _wx$getSystemInfoSync.devicePixelRatio;

	var innerWidth = exports.innerWidth = screenWidth;
	var innerHeight = exports.innerHeight = screenHeight;
	exports.devicePixelRatio = devicePixelRatio;
	var screen = exports.screen = {
	  availWidth: innerWidth,
	  availHeight: innerHeight
	};
	var ontouchstart = exports.ontouchstart = null;
	var ontouchmove = exports.ontouchmove = null;
	var ontouchend = exports.ontouchend = null;
	var style = exports.style = {};

	exports.performance = _performance2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var performance = void 0;

	if (wx.getPerformance) {
	  var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
	      platform = _wx$getSystemInfoSync.platform;

	  var wxPerf = wx.getPerformance();
	  var initTime = wxPerf.now();

	  var clientPerfAdapter = Object.assign({}, wxPerf, {
	    now: function now() {
	      return (wxPerf.now() - initTime) / 1000;
	    }
	  });

	  performance = platform === 'devtools' ? wxPerf : clientPerfAdapter;
	}

	exports.default = performance;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _window = __webpack_require__(1);

	var window = _interopRequireWildcard(_window);

	var _HTMLElement = __webpack_require__(5);

	var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

	var _Image = __webpack_require__(11);

	var _Image2 = _interopRequireDefault(_Image);

	var _Audio = __webpack_require__(12);

	var _Audio2 = _interopRequireDefault(_Audio);

	var _Canvas = __webpack_require__(15);

	var _Canvas2 = _interopRequireDefault(_Canvas);

	__webpack_require__(16);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var events = {};

	var document = {
	  readyState: 'complete',
	  visibilityState: 'visible',
	  documentElement: window,
	  hidden: false,
	  style: {},
	  fonts: {
	    check: function check() {
	      // tempFuncWrapper("document.font.check", [...arguments])
	      return true;
	    }
	  },
	  ontouchstart: null,
	  ontouchmove: null,
	  ontouchend: null,

	  head: new _HTMLElement2.default('head'),
	  body: new _HTMLElement2.default('body'),

	  createElement: function createElement(tagName) {
	    if (tagName === 'canvas') {
	      return new _Canvas2.default();
	    } else if (tagName === 'audio') {
	      return new _Audio2.default();
	    } else if (tagName === 'img') {
	      return new _Image2.default();
	    }

	    return new _HTMLElement2.default(tagName);
	  },
	  getElementById: function getElementById(id) {
	    if (id === window.canvas.id) {
	      return window.canvas;
	    }
	    return null;
	  },
	  getElementsByTagName: function getElementsByTagName(tagName) {
	    if (tagName === 'head') {
	      return [document.head];
	    } else if (tagName === 'body') {
	      return [document.body];
	    } else if (tagName === 'canvas') {
	      return [window.canvas];
	    }
	    return [];
	  },
	  getElementsByName: function getElementsByName(tagName) {
	    if (tagName === 'head') {
	      return [document.head];
	    } else if (tagName === 'body') {
	      return [document.body];
	    } else if (tagName === 'canvas') {
	      return [window.canvas];
	    }
	    return [];
	  },
	  querySelector: function querySelector(query) {
	    if (query === 'head') {
	      return document.head;
	    } else if (query === 'body') {
	      return document.body;
	    } else if (query === 'canvas') {
	      return window.canvas;
	    } else if (query === '#' + window.canvas.id) {
	      return window.canvas;
	    }
	    return null;
	  },
	  querySelectorAll: function querySelectorAll(query) {
	    if (query === 'head') {
	      return [document.head];
	    } else if (query === 'body') {
	      return [document.body];
	    } else if (query === 'canvas') {
	      return [window.canvas];
	    }
	    return [];
	  },
	  addEventListener: function addEventListener(type, listener) {
	    if (!events[type]) {
	      events[type] = [];
	    }
	    events[type].push(listener);
	  },
	  removeEventListener: function removeEventListener(type, listener) {
	    var listeners = events[type];

	    if (listeners && listeners.length > 0) {
	      for (var i = listeners.length; i--; i > 0) {
	        if (listeners[i] === listener) {
	          listeners.splice(i, 1);
	          break;
	        }
	      }
	    }
	  },
	  dispatchEvent: function dispatchEvent(event) {
	    var listeners = events[event.type];

	    if (listeners) {
	      for (var i = 0; i < listeners.length; i++) {
	        listeners[i](event);
	      }
	    }
	  },
	  elementFromPoint: function elementFromPoint() {
	    return window.canvas;
	  }
	};

	exports.default = document;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Element2 = __webpack_require__(6);

	var _Element3 = _interopRequireDefault(_Element2);

	var _util = __webpack_require__(9);

	var _tempFuncWrapper = __webpack_require__(10);

	var _WindowProperties = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HTMLElement = function (_Element) {
	  _inherits(HTMLElement, _Element);

	  function HTMLElement() {
	    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	    _classCallCheck(this, HTMLElement);

	    var _this = _possibleConstructorReturn(this, (HTMLElement.__proto__ || Object.getPrototypeOf(HTMLElement)).call(this));

	    _this.className = '';
	    _this.childern = [];
	    _this.style = {
	      width: _WindowProperties.innerWidth + 'px',
	      height: _WindowProperties.innerHeight + 'px'
	    };
	    _this.insertBefore = _util.noop;
	    _this.innerHTML = '';

	    _this.tagName = tagName.toUpperCase();
	    return _this;
	  }

	  _createClass(HTMLElement, [{
	    key: 'setAttribute',
	    value: function setAttribute(name, value) {
	      this[name] = value;
	    }
	  }, {
	    key: 'removeAttribute',
	    value: function removeAttribute(name) {
	      delete this[name];
	    }
	  }, {
	    key: 'getAttribute',
	    value: function getAttribute(name) {
	      return this[name];
	    }
	  }, {
	    key: 'getBoundingClientRect',
	    value: function getBoundingClientRect() {
	      return {
	        top: 0,
	        left: 0,
	        width: _WindowProperties.innerWidth,
	        height: _WindowProperties.innerHeight
	      };
	    }
	  }, {
	    key: 'focus',
	    value: function focus() {}
	  }, {
	    key: 'appendChild',
	    value: function appendChild() {}
	  }, {
	    key: 'removeChild',
	    value: function removeChild() {}
	  }, {
	    key: 'removeEventListener',
	    value: function removeEventListener() {
	      (0, _tempFuncWrapper.tempFuncWrapper)('HTMLElement.removeEventListener', [].concat(Array.prototype.slice.call(arguments)));
	    }
	  }, {
	    key: 'addEventListener',
	    value: function addEventListener() {
	      (0, _tempFuncWrapper.tempFuncWrapper)('HTMLElement.addEventListener', [].concat(Array.prototype.slice.call(arguments)));
	      // if (arguments[0] === 'mousedown' || arguments[0] === 'touchstart' || arguments[0] === 'click' && this === document.canvas) {
	      //   wx.onTouchStart((result) => {
	      //     const event = {
	      //       button: 0,
	      //       TouchList: result.touches,
	      //       sourceCapabilities: null,
	      //       preventDefault: () => { },
	      //     };
	      //     console.log(arguments[1], event)
	      //     arguments[1](event);
	      //   })
	      // } else if (arguments[0] === 'mouseup' || arguments[0] === 'touchend') {
	      //   wx.onTouchEnd((result) => {
	      //     const event = {
	      //       button: 0,
	      //       TouchList: result.touches,
	      //       sourceCapabilities: null,
	      //       preventDefault: () => { },
	      //     };
	      //     console.log(arguments[1], event)
	      //     arguments[1](event);
	      //   })
	      // }
	    }
	  }, {
	    key: 'clientWidth',
	    get: function get() {
	      var ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length;

	      return Number.isNaN(ret) ? 0 : ret;
	    }
	  }, {
	    key: 'clientHeight',
	    get: function get() {
	      var ret = parseInt(this.style.fontSize, 10);

	      return Number.isNaN(ret) ? 0 : ret;
	    }
	  }]);

	  return HTMLElement;
	}(_Element3.default);

	exports.default = HTMLElement;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Node2 = __webpack_require__(7);

	var _Node3 = _interopRequireDefault(_Node2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ELement = function (_Node) {
	  _inherits(ELement, _Node);

	  function ELement() {
	    _classCallCheck(this, ELement);

	    var _this = _possibleConstructorReturn(this, (ELement.__proto__ || Object.getPrototypeOf(ELement)).call(this));

	    _this.className = '';
	    _this.children = [];
	    return _this;
	  }

	  return ELement;
	}(_Node3.default);

	exports.default = ELement;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _EventTarget2 = __webpack_require__(8);

	var _EventTarget3 = _interopRequireDefault(_EventTarget2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Node = function (_EventTarget) {
	  _inherits(Node, _EventTarget);

	  function Node() {
	    _classCallCheck(this, Node);

	    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

	    _this.childNodes = [];
	    return _this;
	  }

	  _createClass(Node, [{
	    key: 'appendChild',
	    value: function appendChild(node) {
	      if (node instanceof Node) {
	        this.childNodes.push(node);
	      } else {
	        throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.');
	      }
	    }
	  }, {
	    key: 'cloneNode',
	    value: function cloneNode() {
	      var copyNode = Object.create(this);

	      Object.assign(copyNode, this);
	      return copyNode;
	    }
	  }, {
	    key: 'removeChild',
	    value: function removeChild(node) {
	      var index = this.childNodes.findIndex(function (child) {
	        return child === node;
	      });

	      if (index > -1) {
	        return this.childNodes.splice(index, 1);
	      }
	      return null;
	    }
	  }]);

	  return Node;
	}(_EventTarget3.default);

	exports.default = Node;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _events = new WeakMap();

	var EventTarget = function () {
	  function EventTarget() {
	    _classCallCheck(this, EventTarget);

	    _events.set(this, {});
	  }

	  _createClass(EventTarget, [{
	    key: 'addEventListener',
	    value: function addEventListener(type, listener) {
	      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      var events = _events.get(this);

	      if (!events) {
	        events = {};
	        _events.set(this, events);
	      }
	      if (!events[type]) {
	        events[type] = [];
	      }
	      events[type].push(listener);

	      if (options.capture) {
	        console.warn('EventTarget.addEventListener: options.capture is not implemented.');
	      }
	      if (options.once) {
	        console.warn('EventTarget.addEventListener: options.once is not implemented.');
	      }
	      if (options.passive) {
	        console.warn('EventTarget.addEventListener: options.passive is not implemented.');
	      }
	    }
	  }, {
	    key: 'removeEventListener',
	    value: function removeEventListener(type, listener) {
	      var listeners = _events.get(this)[type];

	      if (listeners && listeners.length > 0) {
	        for (var i = listeners.length; i--; i > 0) {
	          if (listeners[i] === listener) {
	            listeners.splice(i, 1);
	            break;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'dispatchEvent',
	    value: function dispatchEvent() {
	      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      var listeners = _events.get(this)[event.type];

	      if (listeners) {
	        for (var i = 0; i < listeners.length; i++) {
	          listeners[i](event);
	        }
	      }
	    }
	  }]);

	  return EventTarget;
	}();

	exports.default = EventTarget;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.noop = noop;
	function noop() {}

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var tempFuncWrapper = exports.tempFuncWrapper = function tempFuncWrapper(name, args) {
	    console.warn(name + " with " + args + " is called in weapp!");
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _tempFuncWrapper = __webpack_require__(10);

	function Image() {
	  var image = wx.createImage();
	  image.removeAttribute = function () {
	    (0, _tempFuncWrapper.tempFuncWrapper)("Image.removeAttribute");
	  };
	  return image;
	}

	exports.default = Image;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _HTMLAudioElement2 = __webpack_require__(13);

	var _HTMLAudioElement3 = _interopRequireDefault(_HTMLAudioElement2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HAVE_NOTHING = 0;
	var HAVE_METADATA = 1;
	var HAVE_CURRENT_DATA = 2;
	var HAVE_FUTURE_DATA = 3;
	var HAVE_ENOUGH_DATA = 4;

	var _innerAudioContext = new WeakMap();
	var _src = new WeakMap();
	var _loop = new WeakMap();
	var _autoplay = new WeakMap();

	var Audio = function (_HTMLAudioElement) {
	  _inherits(Audio, _HTMLAudioElement);

	  function Audio(url) {
	    _classCallCheck(this, Audio);

	    var _this = _possibleConstructorReturn(this, (Audio.__proto__ || Object.getPrototypeOf(Audio)).call(this));

	    _this.HAVE_NOTHING = HAVE_NOTHING;
	    _this.HAVE_METADATA = HAVE_METADATA;
	    _this.HAVE_CURRENT_DATA = HAVE_CURRENT_DATA;
	    _this.HAVE_FUTURE_DATA = HAVE_FUTURE_DATA;
	    _this.HAVE_ENOUGH_DATA = HAVE_ENOUGH_DATA;
	    _this.readyState = HAVE_NOTHING;


	    _src.set(_this, '');

	    var innerAudioContext = wx.createInnerAudioContext();

	    _innerAudioContext.set(_this, innerAudioContext);

	    innerAudioContext.onCanplay(function () {
	      _this.dispatchEvent({ type: 'load' });
	      _this.dispatchEvent({ type: 'loadend' });
	      _this.dispatchEvent({ type: 'canplay' });
	      _this.dispatchEvent({ type: 'canplaythrough' });
	      _this.dispatchEvent({ type: 'loadedmetadata' });
	      _this.readyState = HAVE_CURRENT_DATA;
	    });
	    innerAudioContext.onPlay(function () {
	      _this.dispatchEvent({ type: 'play' });
	    });
	    innerAudioContext.onPause(function () {
	      _this.dispatchEvent({ type: 'pause' });
	    });
	    innerAudioContext.onEnded(function () {
	      _this.dispatchEvent({ type: 'ended' });
	      _this.readyState = HAVE_ENOUGH_DATA;
	    });
	    innerAudioContext.onError(function () {
	      _this.dispatchEvent({ type: 'error' });
	    });

	    if (url) {
	      _innerAudioContext.get(_this).src = url;
	    }
	    return _this;
	  }

	  _createClass(Audio, [{
	    key: 'load',
	    value: function load() {
	      console.warn('HTMLAudioElement.load() is not implemented.');
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      _innerAudioContext.get(this).play();
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {
	      _innerAudioContext.get(this).pause();
	    }
	  }, {
	    key: 'canPlayType',
	    value: function canPlayType() {
	      var mediaType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	      if (typeof mediaType !== 'string') {
	        return '';
	      }

	      if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
	        return 'probably';
	      }
	      return '';
	    }
	  }, {
	    key: 'cloneNode',
	    value: function cloneNode() {
	      var newAudio = new Audio();
	      newAudio.loop = _innerAudioContext.get(this).loop;
	      newAudio.autoplay = _innerAudioContext.get(this).autoplay;
	      newAudio.src = this.src;
	      return newAudio;
	    }
	  }, {
	    key: 'currentTime',
	    get: function get() {
	      return _innerAudioContext.get(this).currentTime;
	    },
	    set: function set(value) {
	      _innerAudioContext.get(this).seek(value);
	    }
	  }, {
	    key: 'src',
	    get: function get() {
	      return _src.get(this);
	    },
	    set: function set(value) {
	      _src.set(this, value);
	      _innerAudioContext.get(this).src = value;
	    }
	  }, {
	    key: 'loop',
	    get: function get() {
	      return _innerAudioContext.get(this).loop;
	    },
	    set: function set(value) {
	      _innerAudioContext.get(this).loop = value;
	    }
	  }, {
	    key: 'autoplay',
	    get: function get() {
	      return _innerAudioContext.get(this).autoplay;
	    },
	    set: function set(value) {
	      _innerAudioContext.get(this).autoplay = value;
	    }
	  }, {
	    key: 'paused',
	    get: function get() {
	      return _innerAudioContext.get(this).paused;
	    }
	  }]);

	  return Audio;
	}(_HTMLAudioElement3.default);

	exports.default = Audio;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _HTMLMediaElement2 = __webpack_require__(14);

	var _HTMLMediaElement3 = _interopRequireDefault(_HTMLMediaElement2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HTMLAudioElement = function (_HTMLMediaElement) {
	  _inherits(HTMLAudioElement, _HTMLMediaElement);

	  function HTMLAudioElement() {
	    _classCallCheck(this, HTMLAudioElement);

	    return _possibleConstructorReturn(this, (HTMLAudioElement.__proto__ || Object.getPrototypeOf(HTMLAudioElement)).call(this, 'audio'));
	  }

	  return HTMLAudioElement;
	}(_HTMLMediaElement3.default);

	exports.default = HTMLAudioElement;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _HTMLElement2 = __webpack_require__(5);

	var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HTMLMediaElement = function (_HTMLElement) {
	  _inherits(HTMLMediaElement, _HTMLElement);

	  function HTMLMediaElement(type) {
	    _classCallCheck(this, HTMLMediaElement);

	    return _possibleConstructorReturn(this, (HTMLMediaElement.__proto__ || Object.getPrototypeOf(HTMLMediaElement)).call(this, type));
	  }

	  _createClass(HTMLMediaElement, [{
	    key: 'addTextTrack',
	    value: function addTextTrack() {}
	  }, {
	    key: 'captureStream',
	    value: function captureStream() {}
	  }, {
	    key: 'fastSeek',
	    value: function fastSeek() {}
	  }, {
	    key: 'load',
	    value: function load() {}
	  }, {
	    key: 'pause',
	    value: function pause() {}
	  }, {
	    key: 'play',
	    value: function play() {}
	  }]);

	  return HTMLMediaElement;
	}(_HTMLElement3.default);

	exports.default = HTMLMediaElement;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Canvas;

	var _HTMLElement = __webpack_require__(5);

	var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var hasModifiedCanvasPrototype = false;
	var hasInit2DContextConstructor = false;
	var hasInitWebGLContextConstructor = false;

	function Canvas() {
	  var canvas = wx.createCanvas();

	  canvas.type = 'canvas';

	  canvas.__proto__.__proto__ = new _HTMLElement2.default('canvas');
	  if (navigator.platform !== 'devtools') {

	    canvas.parentElement = {
	      offsetWidth: window.innerWidth,
	      offsetHeight: window.innerHeight
	    };
	  }
	  var _getContext = canvas.getContext;

	  canvas.getBoundingClientRect = function () {
	    var ret = {
	      top: 0,
	      left: 0,
	      width: window.innerWidth,
	      height: window.innerHeight
	    };
	    return ret;
	  };

	  return canvas;
	}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(17);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _window = __webpack_require__(1);

	var window = _interopRequireWildcard(_window);

	var _document = __webpack_require__(4);

	var _document2 = _interopRequireDefault(_document);

	var _util = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TouchEvent = function TouchEvent(type) {
	  _classCallCheck(this, TouchEvent);

	  this.target = window.canvas;
	  this.currentTarget = window.canvas;
	  this.touches = [];
	  this.targetTouches = [];
	  this.changedTouches = [];
	  this.preventDefault = _util.noop;
	  this.stopPropagation = _util.noop;

	  this.type = type;
	};

	function touchEventHandlerFactory(type) {
	  return function (event) {
	    var touchEvent = new TouchEvent(type);

	    touchEvent.touches = event.touches.map(function (touch) {
	      touch.target = window.canvas;
	      return touch;
	    });
	    touchEvent.changedTouches = event.changedTouches.map(function (touch) {
	      touch.target = window.canvas;
	      return touch;
	    });
	    touchEvent.targetTouches = Array.prototype.slice.call(event.touches);
	    touchEvent.changedTouches = event.changedTouches;
	    touchEvent.timeStamp = event.timeStamp;
	    _document2.default.dispatchEvent(touchEvent);
	  };
	}

	wx.onTouchStart(touchEventHandlerFactory('touchstart'));
	wx.onTouchMove(touchEventHandlerFactory('touchmove'));
	wx.onTouchEnd(touchEventHandlerFactory('touchend'));
	wx.onTouchCancel(touchEventHandlerFactory('touchcancel'));
	// wx.onTouchStart(touchEventHandlerFactory('pointerdown'))
	// wx.onTouchMove(touchEventHandlerFactory('pointermove'))
	// wx.onTouchEnd(touchEventHandlerFactory('pointerup'))

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
	    platform = _wx$getSystemInfoSync.platform;

	var navigator = {
	  platform: platform, getGamepads: function getGamepads() {
	    return [];
	  }
	};

	exports.default = navigator;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _url = new WeakMap();
	var _method = new WeakMap();
	var _requestHeader = new WeakMap();
	var _responseHeader = new WeakMap();
	var _requestTask = new WeakMap();

	function _triggerEvent(type) {
	  if (typeof this['on' + type] === 'function') {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    this['on' + type].apply(this, args);
	  }
	}

	function _changeReadyState(readyState) {
	  this.readyState = readyState;
	  _triggerEvent.call(this, 'readystatechange');
	}

	var XMLHttpRequest = function () {
	  // TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
	  function XMLHttpRequest() {
	    _classCallCheck(this, XMLHttpRequest);

	    this.onabort = null;
	    this.onerror = null;
	    this.onload = null;
	    this.onloadstart = null;
	    this.onprogress = null;
	    this.ontimeout = null;
	    this.onloadend = null;
	    this.onreadystatechange = null;
	    this.readyState = 0;
	    this.response = null;
	    this.responseText = null;
	    this.responseType = '';
	    this.responseXML = null;
	    this.status = 0;
	    this.statusText = '';
	    this.upload = {};
	    this.withCredentials = false;

	    _requestHeader.set(this, {
	      'content-type': 'application/x-www-form-urlencoded'
	    });
	    _responseHeader.set(this, {});
	  }

	  /*
	   * TODO 这一批事件应该是在 XMLHttpRequestEventTarget.prototype 上面的
	   */


	  _createClass(XMLHttpRequest, [{
	    key: 'abort',
	    value: function abort() {
	      var myRequestTask = _requestTask.get(this);

	      if (myRequestTask) {
	        myRequestTask.abort();
	      }
	    }
	  }, {
	    key: 'getAllResponseHeaders',
	    value: function getAllResponseHeaders() {
	      var responseHeader = _responseHeader.get(this);

	      return Object.keys(responseHeader).map(function (header) {
	        return header + ': ' + responseHeader[header];
	      }).join('\n');
	    }
	  }, {
	    key: 'getResponseHeader',
	    value: function getResponseHeader(header) {
	      return _responseHeader.get(this)[header];
	    }
	  }, {
	    key: 'open',
	    value: function open(method, url /* async, user, password 这几个参数在小程序内不支持*/) {
	      _method.set(this, method);
	      _url.set(this, url);
	      _changeReadyState.call(this, XMLHttpRequest.OPENED);
	    }
	  }, {
	    key: 'overrideMimeType',
	    value: function overrideMimeType() {}
	  }, {
	    key: 'send',
	    value: function send() {
	      var _this = this;

	      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	      if (this.readyState !== XMLHttpRequest.OPENED) {
	        throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");
	      } else {
	        // wx.request({
	        //   data,
	        //   url: _url.get(this),
	        //   method: _method.get(this),
	        //   header: _requestHeader.get(this),
	        //   responseType: this.responseType,
	        //   success: ({ data, statusCode, header }) => {
	        setTimeout(function () {
	          data = wx.getFileSystemManager().readFileSync(_url.get(_this));
	          if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
	            try {
	              data = JSON.stringify(data);
	            } catch (e) {
	              data = data;
	            }
	          }

	          _this.status = 200;
	          // _responseHeader.set(this, header)
	          _triggerEvent.call(_this, 'loadstart');
	          _changeReadyState.call(_this, XMLHttpRequest.HEADERS_RECEIVED);
	          _changeReadyState.call(_this, XMLHttpRequest.LOADING);

	          _this.response = { buffer: data, size: data.byteLength, type: 'octet-stream' };
	          if (data instanceof ArrayBuffer) {
	            _this.responseText = '';
	            var bytes = new Uint8Array(data);
	            var len = bytes.byteLength;

	            for (var i = 0; i < len; i++) {
	              _this.responseText += String.fromCharCode(bytes[i]);
	            }
	          } else {
	            _this.responseText = data;
	          }
	          _changeReadyState.call(_this, XMLHttpRequest.DONE);
	          _triggerEvent.call(_this, 'load', { target: _this });
	          _triggerEvent.call(_this, 'loadend');
	        });
	        // },
	        // fail: ({ errMsg }) => {
	        //   console.error(errMsg);
	        //   // TODO 规范错误
	        //   if (errMsg.indexOf('abort') !== -1) {
	        //     _triggerEvent.call(this, 'abort')
	        //   } else {
	        //     _triggerEvent.call(this, 'error', errMsg)
	        //   }
	        //   _triggerEvent.call(this, 'loadend')
	        // }
	        // })
	      }
	    }
	  }, {
	    key: 'setRequestHeader',
	    value: function setRequestHeader(header, value) {
	      var myHeader = _requestHeader.get(this);

	      myHeader[header] = value;
	      _requestHeader.set(this, myHeader);
	    }
	  }]);

	  return XMLHttpRequest;
	}();

	XMLHttpRequest.UNSEND = 0;
	XMLHttpRequest.OPENED = 1;
	XMLHttpRequest.HEADERS_RECEIVED = 2;
	XMLHttpRequest.LOADING = 3;
	XMLHttpRequest.DONE = 4;
	exports.default = XMLHttpRequest;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Image2 = __webpack_require__(11);

	var _Image3 = _interopRequireDefault(_Image2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ImageData = function (_Image) {
	  _inherits(ImageData, _Image);

	  function ImageData() {
	    _classCallCheck(this, ImageData);

	    return _possibleConstructorReturn(this, (ImageData.__proto__ || Object.getPrototypeOf(ImageData)).apply(this, arguments));
	  }

	  return ImageData;
	}(_Image3.default);

	exports.default = ImageData;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _path = __webpack_require__(22);

	var _tempFuncWrapper = __webpack_require__(10);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AudioContext = function () {
	    function AudioContext() {
	        _classCallCheck(this, AudioContext);
	    }

	    _createClass(AudioContext, [{
	        key: "decodeAudioData",
	        value: function decodeAudioData() {
	            (0, _tempFuncWrapper.tempFuncWrapper)("AudioContext.decodeAudioData", [].concat(Array.prototype.slice.call(arguments)));
	            return new Promise(function (resolve) {
	                return resolve([]);
	            });
	        }
	    }, {
	        key: "createBuffer",
	        value: function createBuffer() {
	            (0, _tempFuncWrapper.tempFuncWrapper)("AudioContext.createBuffer", [].concat(Array.prototype.slice.call(arguments)));
	        }
	    }, {
	        key: "createGain",
	        value: function createGain() {
	            (0, _tempFuncWrapper.tempFuncWrapper)("AudioContext.createGain", [].concat(Array.prototype.slice.call(arguments)));
	            return {
	                connect: function connect() {
	                    (0, _tempFuncWrapper.tempFuncWrapper)("AudioContext.createGain.connect", [].concat(Array.prototype.slice.call(arguments)));
	                }
	            };
	        }
	    }]);

	    return AudioContext;
	}();

	exports.default = AudioContext;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';


	var isWindows = process.platform === 'win32';
	var util = __webpack_require__(24);


	// resolves . and .. elements in a path array with directory names there
	// must be no slashes or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  var res = [];
	  for (var i = 0; i < parts.length; i++) {
	    var p = parts[i];

	    // ignore empty parts
	    if (!p || p === '.')
	      continue;

	    if (p === '..') {
	      if (res.length && res[res.length - 1] !== '..') {
	        res.pop();
	      } else if (allowAboveRoot) {
	        res.push('..');
	      }
	    } else {
	      res.push(p);
	    }
	  }

	  return res;
	}

	// returns an array with empty elements removed from either end of the input
	// array or the original array if no elements need to be removed
	function trimArray(arr) {
	  var lastIndex = arr.length - 1;
	  var start = 0;
	  for (; start <= lastIndex; start++) {
	    if (arr[start])
	      break;
	  }

	  var end = lastIndex;
	  for (; end >= 0; end--) {
	    if (arr[end])
	      break;
	  }

	  if (start === 0 && end === lastIndex)
	    return arr;
	  if (start > end)
	    return [];
	  return arr.slice(start, end + 1);
	}

	// Regex to split a windows path into three parts: [*, device, slash,
	// tail] windows-only
	var splitDeviceRe =
	    /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

	// Regex to split the tail part of the above into [*, dir, basename, ext]
	var splitTailRe =
	    /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

	var win32 = {};

	// Function to split a filename into [root, dir, basename, ext]
	function win32SplitPath(filename) {
	  // Separate device+slash from tail
	  var result = splitDeviceRe.exec(filename),
	      device = (result[1] || '') + (result[2] || ''),
	      tail = result[3] || '';
	  // Split the tail into dir, basename and extension
	  var result2 = splitTailRe.exec(tail),
	      dir = result2[1],
	      basename = result2[2],
	      ext = result2[3];
	  return [device, dir, basename, ext];
	}

	function win32StatPath(path) {
	  var result = splitDeviceRe.exec(path),
	      device = result[1] || '',
	      isUnc = !!device && device[1] !== ':';
	  return {
	    device: device,
	    isUnc: isUnc,
	    isAbsolute: isUnc || !!result[2], // UNC paths are always absolute
	    tail: result[3]
	  };
	}

	function normalizeUNCRoot(device) {
	  return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
	}

	// path.resolve([from ...], to)
	win32.resolve = function() {
	  var resolvedDevice = '',
	      resolvedTail = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1; i--) {
	    var path;
	    if (i >= 0) {
	      path = arguments[i];
	    } else if (!resolvedDevice) {
	      path = process.cwd();
	    } else {
	      // Windows has the concept of drive-specific current working
	      // directories. If we've resolved a drive letter but not yet an
	      // absolute path, get cwd for that drive. We're sure the device is not
	      // an unc path at this points, because unc paths are always absolute.
	      path = process.env['=' + resolvedDevice];
	      // Verify that a drive-local cwd was found and that it actually points
	      // to our drive. If not, default to the drive's root.
	      if (!path || path.substr(0, 3).toLowerCase() !==
	          resolvedDevice.toLowerCase() + '\\') {
	        path = resolvedDevice + '\\';
	      }
	    }

	    // Skip empty and invalid entries
	    if (!util.isString(path)) {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    var result = win32StatPath(path),
	        device = result.device,
	        isUnc = result.isUnc,
	        isAbsolute = result.isAbsolute,
	        tail = result.tail;

	    if (device &&
	        resolvedDevice &&
	        device.toLowerCase() !== resolvedDevice.toLowerCase()) {
	      // This path points to another device so it is not applicable
	      continue;
	    }

	    if (!resolvedDevice) {
	      resolvedDevice = device;
	    }
	    if (!resolvedAbsolute) {
	      resolvedTail = tail + '\\' + resolvedTail;
	      resolvedAbsolute = isAbsolute;
	    }

	    if (resolvedDevice && resolvedAbsolute) {
	      break;
	    }
	  }

	  // Convert slashes to backslashes when `resolvedDevice` points to an UNC
	  // root. Also squash multiple slashes into a single one where appropriate.
	  if (isUnc) {
	    resolvedDevice = normalizeUNCRoot(resolvedDevice);
	  }

	  // At this point the path should be resolved to a full absolute path,
	  // but handle relative paths to be safe (might happen when process.cwd()
	  // fails)

	  // Normalize the tail path
	  resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/),
	                                !resolvedAbsolute).join('\\');

	  return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
	         '.';
	};


	win32.normalize = function(path) {
	  var result = win32StatPath(path),
	      device = result.device,
	      isUnc = result.isUnc,
	      isAbsolute = result.isAbsolute,
	      tail = result.tail,
	      trailingSlash = /[\\\/]$/.test(tail);

	  // Normalize the tail path
	  tail = normalizeArray(tail.split(/[\\\/]+/), !isAbsolute).join('\\');

	  if (!tail && !isAbsolute) {
	    tail = '.';
	  }
	  if (tail && trailingSlash) {
	    tail += '\\';
	  }

	  // Convert slashes to backslashes when `device` points to an UNC root.
	  // Also squash multiple slashes into a single one where appropriate.
	  if (isUnc) {
	    device = normalizeUNCRoot(device);
	  }

	  return device + (isAbsolute ? '\\' : '') + tail;
	};


	win32.isAbsolute = function(path) {
	  return win32StatPath(path).isAbsolute;
	};

	win32.join = function() {
	  var paths = [];
	  for (var i = 0; i < arguments.length; i++) {
	    var arg = arguments[i];
	    if (!util.isString(arg)) {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    if (arg) {
	      paths.push(arg);
	    }
	  }

	  var joined = paths.join('\\');

	  // Make sure that the joined path doesn't start with two slashes, because
	  // normalize() will mistake it for an UNC path then.
	  //
	  // This step is skipped when it is very clear that the user actually
	  // intended to point at an UNC path. This is assumed when the first
	  // non-empty string arguments starts with exactly two slashes followed by
	  // at least one more non-slash character.
	  //
	  // Note that for normalize() to treat a path as an UNC path it needs to
	  // have at least 2 components, so we don't filter for that here.
	  // This means that the user can use join to construct UNC paths from
	  // a server name and a share name; for example:
	  //   path.join('//server', 'share') -> '\\\\server\\share\')
	  if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
	    joined = joined.replace(/^[\\\/]{2,}/, '\\');
	  }

	  return win32.normalize(joined);
	};


	// path.relative(from, to)
	// it will solve the relative path from 'from' to 'to', for instance:
	// from = 'C:\\orandea\\test\\aaa'
	// to = 'C:\\orandea\\impl\\bbb'
	// The output of the function should be: '..\\..\\impl\\bbb'
	win32.relative = function(from, to) {
	  from = win32.resolve(from);
	  to = win32.resolve(to);

	  // windows is not case sensitive
	  var lowerFrom = from.toLowerCase();
	  var lowerTo = to.toLowerCase();

	  var toParts = trimArray(to.split('\\'));

	  var lowerFromParts = trimArray(lowerFrom.split('\\'));
	  var lowerToParts = trimArray(lowerTo.split('\\'));

	  var length = Math.min(lowerFromParts.length, lowerToParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (lowerFromParts[i] !== lowerToParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  if (samePartsLength == 0) {
	    return to;
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < lowerFromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('\\');
	};


	win32._makeLong = function(path) {
	  // Note: this will *probably* throw somewhere.
	  if (!util.isString(path))
	    return path;

	  if (!path) {
	    return '';
	  }

	  var resolvedPath = win32.resolve(path);

	  if (/^[a-zA-Z]\:\\/.test(resolvedPath)) {
	    // path is local filesystem path, which needs to be converted
	    // to long UNC path.
	    return '\\\\?\\' + resolvedPath;
	  } else if (/^\\\\[^?.]/.test(resolvedPath)) {
	    // path is network UNC path, which needs to be converted
	    // to long UNC path.
	    return '\\\\?\\UNC\\' + resolvedPath.substring(2);
	  }

	  return path;
	};


	win32.dirname = function(path) {
	  var result = win32SplitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	win32.basename = function(path, ext) {
	  var f = win32SplitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	win32.extname = function(path) {
	  return win32SplitPath(path)[3];
	};


	win32.format = function(pathObject) {
	  if (!util.isObject(pathObject)) {
	    throw new TypeError(
	        "Parameter 'pathObject' must be an object, not " + typeof pathObject
	    );
	  }

	  var root = pathObject.root || '';

	  if (!util.isString(root)) {
	    throw new TypeError(
	        "'pathObject.root' must be a string or undefined, not " +
	        typeof pathObject.root
	    );
	  }

	  var dir = pathObject.dir;
	  var base = pathObject.base || '';
	  if (!dir) {
	    return base;
	  }
	  if (dir[dir.length - 1] === win32.sep) {
	    return dir + base;
	  }
	  return dir + win32.sep + base;
	};


	win32.parse = function(pathString) {
	  if (!util.isString(pathString)) {
	    throw new TypeError(
	        "Parameter 'pathString' must be a string, not " + typeof pathString
	    );
	  }
	  var allParts = win32SplitPath(pathString);
	  if (!allParts || allParts.length !== 4) {
	    throw new TypeError("Invalid path '" + pathString + "'");
	  }
	  return {
	    root: allParts[0],
	    dir: allParts[0] + allParts[1].slice(0, -1),
	    base: allParts[2],
	    ext: allParts[3],
	    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
	  };
	};


	win32.sep = '\\';
	win32.delimiter = ';';


	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var posix = {};


	function posixSplitPath(filename) {
	  return splitPathRe.exec(filename).slice(1);
	}


	// path.resolve([from ...], to)
	// posix version
	posix.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (!util.isString(path)) {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path[0] === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(resolvedPath.split('/'),
	                                !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	posix.normalize = function(path) {
	  var isAbsolute = posix.isAbsolute(path),
	      trailingSlash = path && path[path.length - 1] === '/';

	  // Normalize the path
	  path = normalizeArray(path.split('/'), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	posix.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	posix.join = function() {
	  var path = '';
	  for (var i = 0; i < arguments.length; i++) {
	    var segment = arguments[i];
	    if (!util.isString(segment)) {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    if (segment) {
	      if (!path) {
	        path += segment;
	      } else {
	        path += '/' + segment;
	      }
	    }
	  }
	  return posix.normalize(path);
	};


	// path.relative(from, to)
	// posix version
	posix.relative = function(from, to) {
	  from = posix.resolve(from).substr(1);
	  to = posix.resolve(to).substr(1);

	  var fromParts = trimArray(from.split('/'));
	  var toParts = trimArray(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};


	posix._makeLong = function(path) {
	  return path;
	};


	posix.dirname = function(path) {
	  var result = posixSplitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	posix.basename = function(path, ext) {
	  var f = posixSplitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	posix.extname = function(path) {
	  return posixSplitPath(path)[3];
	};


	posix.format = function(pathObject) {
	  if (!util.isObject(pathObject)) {
	    throw new TypeError(
	        "Parameter 'pathObject' must be an object, not " + typeof pathObject
	    );
	  }

	  var root = pathObject.root || '';

	  if (!util.isString(root)) {
	    throw new TypeError(
	        "'pathObject.root' must be a string or undefined, not " +
	        typeof pathObject.root
	    );
	  }

	  var dir = pathObject.dir ? pathObject.dir + posix.sep : '';
	  var base = pathObject.base || '';
	  return dir + base;
	};


	posix.parse = function(pathString) {
	  if (!util.isString(pathString)) {
	    throw new TypeError(
	        "Parameter 'pathString' must be a string, not " + typeof pathString
	    );
	  }
	  var allParts = posixSplitPath(pathString);
	  if (!allParts || allParts.length !== 4) {
	    throw new TypeError("Invalid path '" + pathString + "'");
	  }
	  allParts[1] = allParts[1] || '';
	  allParts[2] = allParts[2] || '';
	  allParts[3] = allParts[3] || '';

	  return {
	    root: allParts[0],
	    dir: allParts[0] + allParts[1].slice(0, -1),
	    base: allParts[2],
	    ext: allParts[3],
	    name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
	  };
	};


	posix.sep = '/';
	posix.delimiter = ':';


	if (isWindows)
	  module.exports = win32;
	else /* posix */
	  module.exports = posix;

	module.exports.posix = posix;
	module.exports.win32 = win32;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(23)))

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(25);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(26);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(23)))

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 27 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function base64ArrayBuffer(arrayBuffer) {
	  var base64 = '';
	  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	  var bytes = new Uint8Array(arrayBuffer);
	  var byteLength = bytes.byteLength;
	  var byteRemainder = byteLength % 3;
	  var mainLength = byteLength - byteRemainder;

	  var a, b, c, d;
	  var chunk;

	  // Main loop deals with bytes in chunks of 3
	  for (var i = 0; i < mainLength; i = i + 3) {
	    // Combine the three bytes into a single integer
	    chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];

	    // Use bitmasks to extract 6-bit segments from the triplet
	    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
	    b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
	    c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
	    d = chunk & 63; // 63       = 2^6 - 1

	    // Convert the raw binary segments to the appropriate ASCII encoding
	    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
	  }

	  // Deal with the remaining bytes and padding
	  if (byteRemainder == 1) {
	    chunk = bytes[mainLength];

	    a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

	    // Set the 4 least significant bits to zero
	    b = (chunk & 3) << 4; // 3   = 2^2 - 1

	    base64 += encodings[a] + encodings[b] + '==';
	  } else if (byteRemainder == 2) {
	    chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];

	    a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
	    b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

	    // Set the 2 least significant bits to zero
	    c = (chunk & 15) << 2; // 15    = 2^4 - 1

	    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
	  }

	  return base64;
	}

	var FileReader = function () {
	  function FileReader() {
	    _classCallCheck(this, FileReader);
	  }

	  _createClass(FileReader, [{
	    key: 'readAsDataURL',
	    value: function readAsDataURL(blob) {
	      this.result = "," + base64ArrayBuffer(blob.buffer);
	      this.onload();
	    }
	  }]);

	  return FileReader;
	}();

	exports.default = FileReader;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ResizeObserver = function () {
	  function ResizeObserver() {
	    _classCallCheck(this, ResizeObserver);
	  }

	  _createClass(ResizeObserver, [{
	    key: "observe",
	    value: function observe() {}
	  }]);

	  return ResizeObserver;
	}();

	exports.default = ResizeObserver;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _tempFuncWrapper = __webpack_require__(10);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MutationObserver = function () {
	  function MutationObserver() {
	    _classCallCheck(this, MutationObserver);
	  }

	  _createClass(MutationObserver, [{
	    key: "observe",
	    value: function observe() {
	      (0, _tempFuncWrapper.tempFuncWrapper)("MutationObserver.observe", [].concat(Array.prototype.slice.call(arguments)));
	    }
	  }]);

	  return MutationObserver;
	}();

	exports.default = MutationObserver;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function URL() {
	    throw new Error("Not implemented");
	}

	URL.createObjectURL = function (blob) {
	    return wx.createBufferURL(blob.buffer);
	};
	URL.revokeObjectURL = function () {};
	exports.default = URL;

/***/ })
/******/ ]);