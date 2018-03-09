(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
	var scrollTo = _component2.default.init('.js-scroll-to');
	console.log(scrollTo);
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
	onDOMContentLoadedTasks.forEach(function (fn) {
		return fn();
	});
});

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) throw new Error('Scroll To cannot be initialised, no augmentable elements found');

	return Object.assign(Object.create(_componentPrototype2.default), {
		DOMElements: els,
		settings: Object.assign({}, _defaults2.default, opts)
	}).init();
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _easing = require('./easing');

var EASING = _interopRequireWildcard(_easing);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

var TRIGGER_EVENTS = [window.PointerEvent ? 'pointerdown' : 'ontouchstart' in window ? 'touchstart' : 'click', 'keydown'],
    INCREMENT_MS = 16;

exports.default = {
    init: function init() {
        this.initNavItems();
        this.initListeners();
        this.initFocusable();
        return this;
    },
    initNavItems: function initNavItems() {
        this.navItems = this.DOMElements.map(function (item) {
            if (!document.querySelector(item.getAttribute('href'))) throw new Error('Scroll To cannot be initialised, a nav item target is missing');
            return {
                node: item,
                target: document.querySelector(item.getAttribute('href'))
            };
        });
    },
    initListeners: function initListeners() {
        var _this = this;

        this.navItems.forEach(function (el) {
            TRIGGER_EVENTS.forEach(function (ev) {
                el.node.addEventListener(ev, function (e) {
                    e.preventDefault();
                    _this.scrollTo(el);
                }, false);
            });
        });
    },
    initFocusable: function initFocusable() {
        if (!this.settings.focus) return;

        var getFocusableChildren = function getFocusableChildren(node) {
            var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

            return [].slice.call(node.querySelectorAll(focusableElements.join(','))).filter(function (child) {
                return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
            });
        };

        this.navItems.forEach(function (item) {
            item.focusableChildren = getFocusableChildren(item.target);
        });
    },
    scrollTo: function scrollTo(el) {
        var _this2 = this;

        var start = window.pageYOffset,
            end = el.target.offsetTop - this.settings.offset,
            change = end - start,
            duration = this.settings.speed,
            move = function move(amount) {
            document.documentElement.scrollTop = amount;
            document.body.parentNode.scrollTop = amount;
            document.body.scrollTop = amount;
        },
            currentTime = 0,
            animate = function animate() {
            currentTime += INCREMENT_MS;
            move(EASING[_this2.settings.easing](currentTime, start, change, duration));
            if (currentTime < duration) {
                window.requestAnimationFrame(animate.bind(_this2));
            } else {
                !!_this2.settings.pushState && !!window.history.pushState && window.history.pushState({ URL: el.node.getAttribute('href') }, '', el.node.getAttribute('href'));
                !!_this2.settings.focus && !!el.focusableChildren.length && window.setTimeout(function () {
                    el.focusableChildren[0].focus();
                }, 0);
                !!_this2.settings.callback && _this2.settings.callback();
            }
        };
        animate();
    }
};

},{"./easing":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    easing: 'easeInOutCubic',
    speed: 260, //duration to scroll the entire height of the document
    offset: 0,
    pushState: true,
    focus: true,
    callback: false
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var easeInQuad = exports.easeInQuad = function easeInQuad(t, b, c, d) {
    return c * (t /= d) * t + b;
};

var easeOutQuad = exports.easeOutQuad = function easeOutQuad(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

var easeInOutQuad = exports.easeInOutQuad = function easeInOutQuad(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * (--t * (t - 2) - 1) + b;
};

var easeInCubic = exports.easeInCubic = function easeInCubic(t, b, c, d) {
    return c * (t /= d) * t * t + b;
};

var easeOutCubic = exports.easeOutCubic = function easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
};

var easeInOutCubic = exports.easeInOutCubic = function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};

var easeInQuart = exports.easeInQuart = function easeInQuart(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
};

var easeOutQuart = exports.easeOutQuart = function easeOutQuart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

var easeInOutQuart = exports.easeInOutQuart = function easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
};

var easeInQuint = exports.easeInQuint = function easeInQuint(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
};

var easeOutQuint = exports.easeOutQuint = function easeOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};

var easeInOutQuint = exports.easeInOutQuint = function easeInOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2Vhc2luZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUN0QztLQUFJLFdBQVcsb0JBQUEsQUFBUyxLQUF4QixBQUFlLEFBQWMsQUFDN0I7U0FBQSxBQUFRLElBQVIsQUFBWSxBQUNaO0FBSEQsQUFBZ0MsQ0FBQTs7QUFLaEMsSUFBRyxzQkFBSCxBQUF5QixlQUFRLEFBQU8saUJBQVAsQUFBd0Isb0JBQW9CLFlBQU0sQUFBRTt5QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO1NBQUEsQUFBUTtBQUF4QyxBQUFnRDtBQUFwRyxDQUFBOzs7Ozs7Ozs7QUNQakM7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxBQUFPLEtBQUEsQUFBQyxLQUFELEFBQU0sTUFBUyxBQUMzQjtLQUFJLE1BQU0sR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyxpQkFBakMsQUFBVSxBQUFjLEFBQTBCLEFBRWxEOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsTUFBTSxJQUFBLEFBQUksTUFBVixBQUFNLEFBQVUsQUFFaEM7O2VBQU8sQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7ZUFBaUQsQUFDMUMsQUFDYjtZQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsd0JBRmxCLEFBQWlELEFBRTdDLEFBQTRCO0FBRmlCLEFBQ3ZELEVBRE0sRUFBUCxBQUFPLEFB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SSxHQUFKLEFBQU8sR0FBUCxBQUFVLEdBQU0sQUFDeEM7UUFBSSxDQUFDLEtBQUcsSUFBSixBQUFNLEtBQVYsQUFBZSxHQUFHLE9BQU8sSUFBQSxBQUFFLElBQUYsQUFBSSxJQUFKLEFBQU0sSUFBTixBQUFRLElBQVIsQUFBVSxJQUFWLEFBQVksSUFBbkIsQUFBdUIsQUFDekM7V0FBTyxJQUFBLEFBQUUsS0FBRyxDQUFDLEtBQUQsQUFBSSxLQUFKLEFBQU8sSUFBUCxBQUFTLElBQVQsQUFBVyxJQUFYLEFBQWEsSUFBbEIsQUFBc0IsS0FBN0IsQUFBa0MsQUFDckM7QUFITTs7QUFLQSxJQUFNLDBDQUFpQixTQUFqQixBQUFpQixlQUFBLEFBQUMsR0FBRCxBQUFJLEdBQUosQUFBTyxHQUFQLEFBQVUsR0FBTSxBQUMxQztRQUFJLENBQUMsS0FBRyxJQUFKLEFBQU0sS0FBVixBQUFlLEdBQUcsT0FBTyxJQUFBLEFBQUUsSUFBRixBQUFJLElBQUosQUFBTSxJQUFOLEFBQVEsSUFBUixBQUFVLElBQVYsQUFBWSxJQUFuQixBQUF1QixBQUN6QztXQUFPLElBQUEsQUFBRSxLQUFHLENBQUMsS0FBRCxBQUFJLEtBQUosQUFBTyxJQUFQLEFBQVMsSUFBVCxBQUFXLElBQVgsQUFBYSxJQUFsQixBQUFzQixLQUE3QixBQUFrQyxBQUNyQztBQUhNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc31yZXR1cm4gZX0pKCkiLCJpbXBvcnQgU2Nyb2xsVG8gZnJvbSAnLi9saWJzL2NvbXBvbmVudCc7XG5cbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcblx0bGV0IHNjcm9sbFRvID0gU2Nyb2xsVG8uaW5pdCgnLmpzLXNjcm9sbC10bycpO1xuXHRjb25zb2xlLmxvZyhzY3JvbGxUbyk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xuXHRcblx0aWYoIWVscy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignU2Nyb2xsIFRvIGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgbm8gYXVnbWVudGFibGUgZWxlbWVudHMgZm91bmQnKTtcblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRET01FbGVtZW50czogZWxzLFxuXHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcblx0fSkuaW5pdCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeyBpbml0IH07IiwiaW1wb3J0ICogYXMgRUFTSU5HIGZyb20gJy4vZWFzaW5nJztcblxuY29uc3QgVFJJR0dFUl9FVkVOVFMgPSBbd2luZG93LlBvaW50ZXJFdmVudCA/ICdwb2ludGVyZG93bicgOiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snLCAna2V5ZG93bicgXSxcbiAgICAgICAgSU5DUkVNRU5UX01TID0gMTY7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmluaXROYXZJdGVtcygpO1xuICAgICAgICB0aGlzLmluaXRMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5pbml0Rm9jdXNhYmxlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaW5pdE5hdkl0ZW1zKCl7XG4gICAgICAgIHRoaXMubmF2SXRlbXMgPSB0aGlzLkRPTUVsZW1lbnRzLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgIGlmKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGl0ZW0uZ2V0QXR0cmlidXRlKCdocmVmJykpKSB0aHJvdyBuZXcgRXJyb3IoJ1Njcm9sbCBUbyBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIGEgbmF2IGl0ZW0gdGFyZ2V0IGlzIG1pc3NpbmcnKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbm9kZTogaXRlbSxcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaXRlbS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgaW5pdExpc3RlbmVycygpe1xuICAgICAgICB0aGlzLm5hdkl0ZW1zLmZvckVhY2goZWwgPT4ge1xuICAgICAgICAgICAgVFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG4gICAgICAgICAgICAgICAgZWwubm9kZS5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvKGVsKTtcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBpbml0Rm9jdXNhYmxlKCl7XG4gICAgICAgIGlmKCF0aGlzLnNldHRpbmdzLmZvY3VzKSByZXR1cm47IFxuICAgICAgICBcbiAgICAgICAgbGV0IGdldEZvY3VzYWJsZUNoaWxkcmVuID0gbm9kZSA9PiB7XG4gICAgICAgICAgICBsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKSddO1xuXG4gICAgICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbChub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoZm9jdXNhYmxlRWxlbWVudHMuam9pbignLCcpKSkuZmlsdGVyKGNoaWxkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISEoY2hpbGQub2Zmc2V0V2lkdGggfHwgY2hpbGQub2Zmc2V0SGVpZ2h0IHx8IGNoaWxkLmdldENsaWVudFJlY3RzKCkubGVuZ3RoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubmF2SXRlbXMuZm9yRWFjaChpdGVtID0+IHsgaXRlbS5mb2N1c2FibGVDaGlsZHJlbiA9IGdldEZvY3VzYWJsZUNoaWxkcmVuKGl0ZW0udGFyZ2V0KTsgfSk7XG4gICAgfSxcbiAgICBzY3JvbGxUbyhlbCl7XG4gICAgICAgIGxldCBzdGFydCA9IHdpbmRvdy5wYWdlWU9mZnNldCxcbiAgICAgICAgICAgIGVuZCA9IGVsLnRhcmdldC5vZmZzZXRUb3AgLSB0aGlzLnNldHRpbmdzLm9mZnNldCxcbiAgICAgICAgICAgIGNoYW5nZSA9IGVuZCAtIHN0YXJ0LFxuICAgICAgICAgICAgZHVyYXRpb24gPSB0aGlzLnNldHRpbmdzLnNwZWVkLFxuICAgICAgICAgICAgbW92ZSA9IGFtb3VudCA9PiB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IGFtb3VudDtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuc2Nyb2xsVG9wID0gYW1vdW50O1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gYW1vdW50O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGN1cnJlbnRUaW1lID0gMCxcbiAgICAgICAgICAgIGFuaW1hdGUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWUgKz0gSU5DUkVNRU5UX01TO1xuICAgICAgICAgICAgICAgIG1vdmUoRUFTSU5HW3RoaXMuc2V0dGluZ3MuZWFzaW5nXShjdXJyZW50VGltZSwgc3RhcnQsIGNoYW5nZSwgZHVyYXRpb24pKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRpbWUgPCBkdXJhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgKCEhdGhpcy5zZXR0aW5ncy5wdXNoU3RhdGUgJiYgISF3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogZWwubm9kZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKX0sICcnLCBlbC5ub2RlLmdldEF0dHJpYnV0ZSgnaHJlZicpKTtcbiAgICAgICAgICAgICAgICAgICAgKCEhdGhpcy5zZXR0aW5ncy5mb2N1cyAmJiAhIWVsLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCkgJiYgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge2VsLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7fSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICEhdGhpcy5zZXR0aW5ncy5jYWxsYmFjayAmJiB0aGlzLnNldHRpbmdzLmNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgYW5pbWF0ZSgpO1xuICAgIH1cbn07XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgZWFzaW5nOiAnZWFzZUluT3V0Q3ViaWMnLFxuICAgIHNwZWVkOiAyNjAsLy9kdXJhdGlvbiB0byBzY3JvbGwgdGhlIGVudGlyZSBoZWlnaHQgb2YgdGhlIGRvY3VtZW50XG4gICAgb2Zmc2V0OiAwLFxuICAgIHB1c2hTdGF0ZTogdHJ1ZSxcbiAgICBmb2N1czogdHJ1ZSxcbiAgICBjYWxsYmFjazogZmFsc2Vcbn07IiwiZXhwb3J0IGNvbnN0IGVhc2VJblF1YWQgPSAodCwgYiwgYywgZCkgPT4gYyoodC89ZCkqdCArIGI7XG5cbmV4cG9ydCBjb25zdCBlYXNlT3V0UXVhZCA9ICh0LCBiLCBjLCBkKSA9PiAtYyAqKHQvPWQpKih0LTIpICsgYjtcblxuZXhwb3J0IGNvbnN0IGVhc2VJbk91dFF1YWQgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0ICsgYjtcbiAgICByZXR1cm4gLWMvMiAqICgoLS10KSoodC0yKSAtIDEpICsgYjtcbn07XG5cbmV4cG9ydCBjb25zdCBlYXNlSW5DdWJpYyA9ICh0LCBiLCBjLCBkKSA9PiBjKih0Lz1kKSp0KnQgKyBiO1xuXG5leHBvcnQgY29uc3QgZWFzZU91dEN1YmljID0gKHQsIGIsIGMsIGQpID0+ICBjKigodD10L2QtMSkqdCp0ICsgMSkgKyBiO1xuXG5leHBvcnQgY29uc3QgZWFzZUluT3V0Q3ViaWMgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQgKyBiO1xuICAgIHJldHVybiBjLzIqKCh0LT0yKSp0KnQgKyAyKSArIGI7XG59O1xuXG5leHBvcnQgY29uc3QgZWFzZUluUXVhcnQgPSAodCwgYiwgYywgZCkgPT4gYyoodC89ZCkqdCp0KnQgKyBiO1xuXG5leHBvcnQgY29uc3QgZWFzZU91dFF1YXJ0ID0gKHQsIGIsIGMsIGQpID0+IC1jICogKCh0PXQvZC0xKSp0KnQqdCAtIDEpICsgYjtcblxuZXhwb3J0IGNvbnN0IGVhc2VJbk91dFF1YXJ0ID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICBpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yKnQqdCp0KnQgKyBiO1xuICAgIHJldHVybiAtYy8yICogKCh0LT0yKSp0KnQqdCAtIDIpICsgYjtcbn07XG5cbmV4cG9ydCBjb25zdCBlYXNlSW5RdWludCA9ICh0LCBiLCBjLCBkKSA9PiBjKigodD10L2QtMSkqdCp0KnQqdCArIDEpICsgYjtcblxuZXhwb3J0IGNvbnN0IGVhc2VPdXRRdWludCA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgaWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCp0KnQgKyBiO1xuICAgIHJldHVybiBjLzIqKCh0LT0yKSp0KnQqdCp0ICsgMikgKyBiO1xufTtcblxuZXhwb3J0IGNvbnN0IGVhc2VJbk91dFF1aW50ID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICBpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yKnQqdCp0KnQqdCArIGI7XG4gICAgcmV0dXJuIGMvMiooKHQtPTIpKnQqdCp0KnQgKyAyKSArIGI7XG59OyJdfQ==
