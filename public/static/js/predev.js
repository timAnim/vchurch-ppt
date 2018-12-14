(function(window) {
    var predev = {
        dlgFrom: {},
        ontap: function(fn, ele) {
            ele = ele || document.body;
            var hm = new Hammer.Manager(ele, {
                recognizers: [
                    [Hammer.Tap]
                ]
            });
            hm.on('tap', function(ev) {
                var target = ev.target;
                while (!target.getAttribute('evnt') && target.tagName !== 'BODY') {
                    target = target.parentNode;
                }
                var name = target.getAttribute('evnt');
                if (!name) return;
                fn.call(target, name, target);
            });
        },
        // 通知
        toast: function(str) {
            var tst = document.createElement('div');
            tst.classList.add('toast')
            tst.innerHTML = str;
            tst.id = this.randId(4);;
            document.body.appendChild(tst);
            setTimeout(function() {
                predev.log.animOut(tst, tst, 'out-opacity', 200, function() {
                    tst.parentNode.removeChild(tst);
                });
            }, 1500);
        },
        id: function(arg) {
            if (typeof(arg) === "string") {
                arg = document.getElementById(arg);
            }
            return arg;
        },
        find: function(str, ele) {
            if (typeof(ele) === "string") {
                ele = document.getElementById(ele);
            }
            var el = ele || document;
            return el.querySelector(str);
        },
        findAll: function(str, ele) {
            if (typeof(ele) === "string") {
                ele = document.getElementById(ele);
            }
            var el = ele || document;
            return el.querySelectorAll(str);
        },
        dataInit: function(input) {
            var data = document.getElementById(input);
            data = data ? JSON.parse(data.value) : {};
            this.clean(input);
            return data;
        },
        compose: function(model, viewId) {
            var view;
            if (this.id(viewId)) {
                view = this.id(viewId).innerHTML;
            } else {
                view = viewId;
            }
            var htmlStr = '';
            var isArray = function(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }
            if (isArray(model)) {
                for (var i = 0; i < model.length; i++) {
                    if (model[i]) {
                        htmlStr += view.temp(model[i]);
                    }
                }
            } else {
                htmlStr = view.temp(model);
            }
            return this.toHTML(htmlStr);
        },
        isArray: function(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        getRequest: function() {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                if (str.indexOf("&") != -1) {
                    strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                    }
                } else {
                    theRequest[str.split("=")[0]] = decodeURI(str.split("=")[1]);
                }
            }
            return theRequest;
        },
        href: function(obj) {
            // if (typeof(userInit) == 'undefined') var userInit = {};
            var href = (typeof(obj) == "string") ? obj : obj.getAttribute('href');
            // var token = (userInit && userInit.token) ? ('&token=' + userInit.token) : '';
            var link = href.indexOf("?") == -1 ? '?' : '&';
            // href += link + 'lang=' + sessionStorage.lang + token;
            // alert(predev.curview);
            if (window.pd.curview) {
                history.pushState({
                    title: '畅享宇通',
                    url: href + link + 'view=' + window.pd.curview,
                }, href + link + 'view=' + window.pd.curview);
            }
            window.location.href = href;
        },
        toHTML: function(text) {
            var i, a = document.createElement("div"),
                b = document.createDocumentFragment();
            a.innerHTML = text;
            while (i = a.firstChild) { b.appendChild(i); }
            return b;
        },
        clean: function(obj) {
            if (typeof(obj) === "string") { obj = this.id(obj); }
            if (obj && obj.parentNode) { obj.parentNode.removeChild(obj); }
        },
        chars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        randId: function(n) {
            var res = "";
            for (var i = 0; i < n; i++) {
                var id = Math.ceil(Math.random() * 35);
                res += this.chars[id];
            }
            return res;
        },
        ajax: function(opt) {
            predev.loading();
            opt = opt || {};
            opt.method = opt.method || 'POST';
            opt.url = opt.url || '';
            opt.async = opt.async || true;
            opt.data = opt.data || null;
            opt.success = opt.success || function() {};
            opt.error = opt.error || function() {
                predev.toast("亲，网络不给力啊");
            };
            var xmlHttp = null;
            if (XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }

            xmlHttp.timeout = 10000;

            var params = [];
            for (var key in opt.data) {
                if (predev.isArray(opt.data[key])) {
                    for (var i = 0; i < opt.data[key].length; i++) {
                        params.push(key + '[' + i + ']=' + opt.data[key][i]);
                    }
                } else {
                    params.push(key + '=' + opt.data[key]);
                }
            }
            var postData = params.join('&');
            if (opt.method.toUpperCase() === 'POST') {
                xmlHttp.open(opt.method, opt.url, opt.async);
                xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xmlHttp.setRequestHeader('Accept', 'application/json,*/*');
                xmlHttp.send(postData);
            } else if (opt.method.toUpperCase() === 'GET') {
                xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
                xmlHttp.send(null);
            }
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    var data = xmlHttp.responseText;
                    if (opt.method === 'POST') {
                        data = JSON.parse(data);
                        // if (data.code === '0') {
                            opt.success(data);
                        // } else {
                            // predev.toast(data.msg);
                        // }
                    } else if (opt.method === 'GET') {
                        opt.success(data);
                    }
                    predev.loaded();
                } else {
                    // predev.toast('出错了请稍后再试');
                    predev.loaded();
                }
            };

            xmlHttp.onabort = function() {
                predev.toast('请求超时');
            };
            xmlHttp.onerror = function() {
                predev.toast('远程服务未开启');
            };

        },
        refresh: function(str) {
            if (str) predev.toast(str);
            setTimeout(function() {
                history.go(0);
            }, 800);
        },
        insertAfter: function(newEl, target) {
            var parent = target.parentNode;
            if (parent.lastChild == target) {
                parent.appendChild(newEl);
            } else {
                parent.insertBefore(newEl, target.nextSibling);
            }
        },
        next: function(node) {
            var tempLast = node.parentNode.lastChild;
            if (node == tempLast) return null;
            var tempObj = node.nextSibling;
            while (tempObj.nodeType != 1 && tempObj.nextSibling != null) {
                tempObj = tempObj.nextSibling;
            }
            return (tempObj.nodeType == 1) ? tempObj : null;
        },
        previous: function(node) {
            var tempFirst = node.parentNode.firstChild;
            if (node == tempFirst) return null;
            var tempObj = node.previousSibling;
            while (tempObj.nodeType != 1 && tempObj.previousSibling != null) {
                tempObj = tempObj.previousSibling;
            }
            return (tempObj.nodeType == 1) ? tempObj : null;
        },
        loading: function() {
            if (this.id('waitBg')) return;
            var dlgtxt =
                "<mask class='waitingBg' id='waitBg'>" +
                "<div class='waiting' align='center'><p>加载中</p><i class='fa fa-spinner fa-3x fa-pulse fa-fw'></i></div>" +
                "</mask>";
            var bg = this.toHTML(dlgtxt);
            document.body.appendChild(bg);
        },
        loaded: function() {
            var bg = this.id('waitBg');
            if (!bg) return;
            this.log.animOut(bg, bg, 'out-opacity', 160, function() {
                if (!predev.id('waitBg')) return;
                bg.parentNode.removeChild(bg);
                predev.isLoading = false;
            });
        },
        log: {
            heap: [document.getElementsByTagName('main')[0]],
            in : function(ele) {
                ele = (typeof(ele) == "string") ? document.getElementById(ele) : ele;
                var heap = this.heap;
                if (ele.tagName == 'MODAL') ele.style.display = 'flex';
                else ele.style.display = 'block';
                heap.push(ele);
                var last = heap[heap.length - 2];
                last.setAttribute('pause', true);
            },
            pop: function() {
                var heap = this.heap;
                var outer = heap[heap.length - 1];
                var last = heap[heap.length - 2];
                var animObj = outer.children[0];
                if (outer.tagName == 'MODAL') animObj = outer;
                var clean = (animObj.getAttribute('clean') == 'true') ? true : false;
                var self = this;
                this.animOut(outer, animObj, animObj.getAttribute('out'), 120, function() {
                    heap.remove((heap.length - 1));
                    if (clean) outer.parentNode.removeChild(outer);
                    else outer.style.display = 'none';
                    last.setAttribute('pause', false);
                });
            },
            animOut: function(outer, animObj, anim, time, callback) {
                var clickable = true;
                if (clickable) {
                    clickable = false;
                    animObj.classList.add(anim);
                    setTimeout(function() {
                        animObj.classList.remove(anim);
                        if (callback) callback.call(outer);
                        clickable = true;
                    }, time);
                }
            },
        },
    };

    String.prototype.temp = function(obj) { //填充数据
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    Array.prototype.remove = function(dx) { //数组删除元素
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i];
            }
        }
        this.length -= 1;
    };

    HTMLElement.prototype.addEvent = function(type, fn, capture) {
        if (window.addEventListener) {
            this.addEventListener(type, fn, capture);
        } else if (window.attachEvent) {
            this.attachEvent("on" + type, function(e) {
                fn.call(this, e);
            });
        }
    };

    sessionStorage.isMobile = (function() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        var bIsWC = sUserAgent.match(/MicroMessenger/i) == "micromessenger";
        var isMobile = false;
        isMobile = (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsWC);
        return isMobile;
    })();
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    if (typeof module != 'undefined' && module.exports) {
        module.exports = predev;
    } else if (typeof define == 'function' && define.amd) {
        define('predev', [], function() {
            return predev;
        });
    } else {
        window.pd = predev;
    }
})(window);

/*! iScroll v5.2.0-snapshot ~ (c) 2008-2017 Matteo Spinelli ~ http://cubiq.org/license */
(function(window, document, Math) {
    var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) { window.setTimeout(callback, 1000 / 60); };

    var utils = (function() {
        var me = {};

        var _elementStyle = document.createElement('div').style;
        var _vendor = (function() {
            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                transform,
                i = 0,
                l = vendors.length;

            for (; i < l; i++) {
                transform = vendors[i] + 'ransform';
                if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
            }

            return false;
        })();

        function _prefixStyle(style) {
            if (_vendor === false) return false;
            if (_vendor === '') return style;
            return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
        }

        me.getTime = Date.now || function getTime() {
            return new Date().getTime();
        };

        me.extend = function(target, obj) {
            for (var i in obj) {
                target[i] = obj[i];
            }
        };

        me.addEvent = function(el, type, fn, capture) {
            el.addEventListener(type, fn, !!capture);
        };

        me.removeEvent = function(el, type, fn, capture) {
            el.removeEventListener(type, fn, !!capture);
        };

        me.prefixPointerEvent = function(pointerEvent) {
            return window.MSPointerEvent ?
                'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8) :
                pointerEvent;
        };

        me.momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration) {
            var distance = current - start,
                speed = Math.abs(distance) / time,
                destination,
                duration;

            deceleration = deceleration === undefined ? 0.0006 : deceleration;

            destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;

            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }

            return {
                destination: Math.round(destination),
                duration: duration
            };
        };

        var _transform = _prefixStyle('transform');

        me.extend(me, {
            hasTransform: _transform !== false,
            hasPerspective: _prefixStyle('perspective') in _elementStyle,
            hasTouch: 'ontouchstart' in window,
            hasPointer: !!(window.PointerEvent || window.MSPointerEvent), // IE10 is prefixed
            hasTransition: _prefixStyle('transition') in _elementStyle
        });

        /*
    This should find all Android browsers lower than build 535.19 (both stock browser and webview)
    - galaxy S2 is ok
    - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
    - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S3 is badAndroid (stock brower, webview)
     `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S4 is badAndroid (stock brower, webview)
     `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
   - galaxy S5 is OK
     `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
   - galaxy S6 is OK
     `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
  */
        me.isBadAndroid = (function() {
            var appVersion = window.navigator.appVersion;
            // Android browser is not a chrome browser.
            if (/Android/.test(appVersion) && !(/Chrome\/\d/.test(appVersion))) {
                var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
                if (safariVersion && typeof safariVersion === "object" && safariVersion.length >= 2) {
                    return parseFloat(safariVersion[1]) < 535.19;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        })();

        me.extend(me.style = {}, {
            transform: _transform,
            transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
            transitionDuration: _prefixStyle('transitionDuration'),
            transitionDelay: _prefixStyle('transitionDelay'),
            transformOrigin: _prefixStyle('transformOrigin'),
            touchAction: _prefixStyle('touchAction')
        });

        me.hasClass = function(e, c) {
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
            return re.test(e.className);
        };

        me.addClass = function(e, c) {
            if (me.hasClass(e, c)) {
                return;
            }

            var newclass = e.className.split(' ');
            newclass.push(c);
            e.className = newclass.join(' ');
        };

        me.removeClass = function(e, c) {
            if (!me.hasClass(e, c)) {
                return;
            }

            var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
            e.className = e.className.replace(re, ' ');
        };

        me.offset = function(el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            // jshint -W084
            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }
            // jshint +W084

            return {
                left: left,
                top: top
            };
        };

        me.preventDefaultException = function(el, exceptions) {
            for (var i in exceptions) {
                if (exceptions[i].test(el[i])) {
                    return true;
                }
            }

            return false;
        };

        me.extend(me.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,

            mousedown: 2,
            mousemove: 2,
            mouseup: 2,

            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,

            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        });

        me.extend(me.ease = {}, {
            quadratic: {
                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fn: function(k) {
                    return k * (2 - k);
                }
            },
            circular: {
                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                fn: function(k) {
                    return Math.sqrt(1 - (--k * k));
                }
            },
            back: {
                style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fn: function(k) {
                    var b = 4;
                    return (k = k - 1) * k * ((b + 1) * k + b) + 1;
                }
            },
            bounce: {
                style: '',
                fn: function(k) {
                    if ((k /= 1) < (1 / 2.75)) {
                        return 7.5625 * k * k;
                    } else if (k < (2 / 2.75)) {
                        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                    } else if (k < (2.5 / 2.75)) {
                        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                    } else {
                        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                    }
                }
            },
            elastic: {
                style: '',
                fn: function(k) {
                    var f = 0.22,
                        e = 0.4;

                    if (k === 0) {
                        return 0;
                    }
                    if (k == 1) {
                        return 1;
                    }

                    return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
                }
            }
        });

        me.tap = function(e, eventName) {
            var ev = document.createEvent('Event');
            ev.initEvent(eventName, true, true);
            ev.pageX = e.pageX;
            ev.pageY = e.pageY;
            e.target.dispatchEvent(ev);
        };

        me.click = function(e) {
            var target = e.target,
                ev;

            if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/initMouseEvent
                // initMouseEvent is deprecated.
                ev = document.createEvent(window.MouseEvent ? 'MouseEvents' : 'Event');
                ev.initEvent('click', true, true);
                ev.view = e.view || window;
                ev.detail = 1;
                ev.screenX = target.screenX || 0;
                ev.screenY = target.screenY || 0;
                ev.clientX = target.clientX || 0;
                ev.clientY = target.clientY || 0;
                ev.ctrlKey = !!e.ctrlKey;
                ev.altKey = !!e.altKey;
                ev.shiftKey = !!e.shiftKey;
                ev.metaKey = !!e.metaKey;
                ev.button = 0;
                ev.relatedTarget = null;
                ev._constructed = true;
                target.dispatchEvent(ev);
            }
        };

        me.getTouchAction = function(eventPassthrough, addPinch) {
            var touchAction = 'none';
            if (eventPassthrough === 'vertical') {
                touchAction = 'pan-y';
            } else if (eventPassthrough === 'horizontal') {
                touchAction = 'pan-x';
            }
            if (addPinch && touchAction != 'none') {
                // add pinch-zoom support if the browser supports it, but if not (eg. Chrome <55) do nothing
                touchAction += ' pinch-zoom';
            }
            return touchAction;
        };

        me.getRect = function(el) {
            if (el instanceof SVGElement) {
                var rect = el.getBoundingClientRect();
                return {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                };
            } else {
                return {
                    top: el.offsetTop,
                    left: el.offsetLeft,
                    width: el.offsetWidth,
                    height: el.offsetHeight
                };
            }
        };

        return me;
    })();

    function IScroll(el, options) {
        this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
        this.scroller = this.wrapper.children[0];
        this.scrollerStyle = this.scroller.style; // cache style for better performance

        this.options = {

            resizeScrollbars: true,

            mouseWheelSpeed: 20,

            snapThreshold: 0.334,
            scrollbars: true,
            mouseWheel: true,
            probeType: 3,
            speedRatioY: 0.3,
            fadeScrollbars: true,
            // INSERT POINT: OPTIONS
            disablePointer: !utils.hasPointer,
            disableTouch: utils.hasPointer || !utils.hasTouch,
            disableMouse: utils.hasPointer || utils.hasTouch,
            startX: 0,
            startY: 0,
            scrollY: true,
            directionLockThreshold: 5,
            momentum: true,

            bounce: true,
            bounceTime: 600,
            bounceEasing: '',

            preventDefault: true,
            preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

            HWCompositing: true,
            useTransition: true,
            useTransform: true,
            bindToWrapper: typeof window.onmousedown === "undefined"
        };

        for (var i in options) {
            this.options[i] = options[i];
        }

        // Normalize options
        this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

        this.options.useTransition = utils.hasTransition && this.options.useTransition;
        this.options.useTransform = utils.hasTransform && this.options.useTransform;

        this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

        // If you want eventPassthrough I have to lock one of the axes
        this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
        this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

        // With eventPassthrough we also need lockDirection mechanism
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

        this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

        this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

        if (this.options.tap === true) {
            this.options.tap = 'tap';
        }

        // https://github.com/cubiq/iscroll/issues/1029
        if (!this.options.useTransition && !this.options.useTransform) {
            if (!(/relative|absolute/i).test(this.scrollerStyle.position)) {
                this.scrollerStyle.position = "relative";
            }
        }

        if (this.options.shrinkScrollbars == 'scale') {
            this.options.useTransition = false;
        }

        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

        if (this.options.probeType == 3) {
            this.options.useTransition = false;
        }

        // INSERT POINT: NORMALIZATION

        // Some defaults
        this.x = 0;
        this.y = 0;
        this.directionX = 0;
        this.directionY = 0;
        this._events = {};

        // INSERT POINT: DEFAULTS

        this._init();
        this.refresh();

        this.scrollTo(this.options.startX, this.options.startY);
        this.enable();
    }

    IScroll.prototype = {
        version: '5.2.0-snapshot',

        _init: function() {
            this._initEvents();

            if (this.options.scrollbars || this.options.indicators) {
                this._initIndicators();
            }

            if (this.options.mouseWheel) {
                this._initWheel();
            }

            if (this.options.snap) {
                this._initSnap();
            }

            if (this.options.keyBindings) {
                this._initKeys();
            }

            // INSERT POINT: _init

        },

        destroy: function() {
            this._initEvents(true);
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
            this._execEvent('destroy');
        },

        _transitionEnd: function(e) {
            if (e.target != this.scroller || !this.isInTransition) {
                return;
            }

            this._transitionTime();
            if (!this.resetPosition(this.options.bounceTime)) {
                this.isInTransition = false;
                this._execEvent('scrollEnd');
            }
        },

        _start: function(e) {
            // React to left mouse button only
            if (utils.eventType[e.type] != 1) {
                // for button property
                // http://unixpapa.com/js/mouse.html
                var button;
                if (!e.which) {
                    /* IE case */
                    button = (e.button < 2) ? 0 :
                        ((e.button == 4) ? 1 : 2);
                } else {
                    /* All others */
                    button = e.button;
                }
                if (button !== 0) {
                    return;
                }
            }

            if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
                return;
            }

            if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault();
            }

            var point = e.touches ? e.touches[0] : e,
                pos;

            this.initiated = utils.eventType[e.type];
            this.moved = false;
            this.distX = 0;
            this.distY = 0;
            this.directionX = 0;
            this.directionY = 0;
            this.directionLocked = 0;

            this.startTime = utils.getTime();

            if (this.options.useTransition && this.isInTransition) {
                this._transitionTime();
                this.isInTransition = false;
                pos = this.getComputedPosition();
                this._translate(Math.round(pos.x), Math.round(pos.y));
                this._execEvent('scrollEnd');
            } else if (!this.options.useTransition && this.isAnimating) {
                this.isAnimating = false;
                this._execEvent('scrollEnd');
            }

            this.startX = this.x;
            this.startY = this.y;
            this.absStartX = this.x;
            this.absStartY = this.y;
            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this._execEvent('beforeScrollStart');
        },

        _move: function(e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            if (this.options.preventDefault) { // increases performance on Android? TODO: check!
                e.preventDefault();
            }

            var point = e.touches ? e.touches[0] : e,
                deltaX = point.pageX - this.pointX,
                deltaY = point.pageY - this.pointY,
                timestamp = utils.getTime(),
                newX, newY,
                absDistX, absDistY;

            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this.distX += deltaX;
            this.distY += deltaY;
            absDistX = Math.abs(this.distX);
            absDistY = Math.abs(this.distY);

            // We need to move at least 10 pixels for the scrolling to initiate
            if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                return;
            }

            // If you are scrolling in one direction lock the other
            if (!this.directionLocked && !this.options.freeScroll) {
                if (absDistX > absDistY + this.options.directionLockThreshold) {
                    this.directionLocked = 'h'; // lock horizontally
                } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                    this.directionLocked = 'v'; // lock vertically
                } else {
                    this.directionLocked = 'n'; // no lock
                }
            }

            if (this.directionLocked == 'h') {
                if (this.options.eventPassthrough == 'vertical') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough == 'horizontal') {
                    this.initiated = false;
                    return;
                }

                deltaY = 0;
            } else if (this.directionLocked == 'v') {
                if (this.options.eventPassthrough == 'horizontal') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough == 'vertical') {
                    this.initiated = false;
                    return;
                }

                deltaX = 0;
            }

            deltaX = this.hasHorizontalScroll ? deltaX : 0;
            deltaY = this.hasVerticalScroll ? deltaY : 0;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < this.maxScrollX) {
                newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
            }
            if (newY > 0 || newY < this.maxScrollY) {
                newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
            }

            this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (!this.moved) {
                this._execEvent('scrollStart');
            }

            this.moved = true;

            this._translate(newX, newY);

            /* REPLACE START: _move */
            if (timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.startX = this.x;
                this.startY = this.y;

                if (this.options.probeType == 1) {
                    this._execEvent('scroll');
                }
            }

            if (this.options.probeType > 1) {
                this._execEvent('scroll');
            }
            /* REPLACE END: _move */

        },

        _end: function(e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault();
            }

            var point = e.changedTouches ? e.changedTouches[0] : e,
                momentumX,
                momentumY,
                duration = utils.getTime() - this.startTime,
                newX = Math.round(this.x),
                newY = Math.round(this.y),
                distanceX = Math.abs(newX - this.startX),
                distanceY = Math.abs(newY - this.startY),
                time = 0,
                easing = '';

            this.isInTransition = 0;
            this.initiated = 0;
            this.endTime = utils.getTime();

            // reset if we are outside of the boundaries
            if (this.resetPosition(this.options.bounceTime)) {
                return;
            }

            this.scrollTo(newX, newY); // ensures that the last position is rounded

            // we scrolled less than 10 pixels
            if (!this.moved) {
                if (this.options.tap) {
                    utils.tap(e, this.options.tap);
                }

                if (this.options.click) {
                    utils.click(e);
                }

                this._execEvent('scrollCancel');
                return;
            }

            if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                this._execEvent('flick');
                return;
            }

            // start momentum animation if needed
            if (this.options.momentum && duration < 300) {
                momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
                momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
                newX = momentumX.destination;
                newY = momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                this.isInTransition = 1;
            }


            if (this.options.snap) {
                var snap = this._nearestSnap(newX, newY);
                this.currentPage = snap;
                time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(newX - snap.x), 1000),
                        Math.min(Math.abs(newY - snap.y), 1000)
                    ), 300);
                newX = snap.x;
                newY = snap.y;

                this.directionX = 0;
                this.directionY = 0;
                easing = this.options.bounceEasing;
            }

            // INSERT POINT: _end

            if (newX != this.x || newY != this.y) {
                // change easing function when scroller goes out of the boundaries
                if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                    easing = utils.ease.quadratic;
                }

                this.scrollTo(newX, newY, time, easing);
                return;
            }

            this._execEvent('scrollEnd');
        },

        _resize: function() {
            var that = this;

            clearTimeout(this.resizeTimeout);

            this.resizeTimeout = setTimeout(function() {
                that.refresh();
            }, this.options.resizePolling);
        },

        resetPosition: function(time) {
            var x = this.x,
                y = this.y;

            time = time || 0;

            if (!this.hasHorizontalScroll || this.x > 0) {
                x = 0;
            } else if (this.x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (!this.hasVerticalScroll || this.y > 0) {
                y = 0;
            } else if (this.y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            if (x == this.x && y == this.y) {
                return false;
            }

            this.scrollTo(x, y, time, this.options.bounceEasing);

            return true;
        },

        disable: function() {
            this.enabled = false;
        },

        enable: function() {
            this.enabled = true;
        },

        refresh: function() {
            utils.getRect(this.wrapper); // Force reflow

            this.wrapperWidth = this.wrapper.clientWidth;
            this.wrapperHeight = this.wrapper.clientHeight;

            var rect = utils.getRect(this.scroller);
            /* REPLACE START: refresh */

            this.scrollerWidth = rect.width;
            this.scrollerHeight = rect.height;

            this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

            /* REPLACE END: refresh */

            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

            if (!this.hasHorizontalScroll) {
                this.maxScrollX = 0;
                this.scrollerWidth = this.wrapperWidth;
            }

            if (!this.hasVerticalScroll) {
                this.maxScrollY = 0;
                this.scrollerHeight = this.wrapperHeight;
            }

            this.endTime = 0;
            this.directionX = 0;
            this.directionY = 0;

            if (utils.hasPointer && !this.options.disablePointer) {
                // The wrapper should have `touchAction` property for using pointerEvent.
                this.wrapper.style[utils.style.touchAction] = utils.getTouchAction(this.options.eventPassthrough, true);

                // case. not support 'pinch-zoom'
                // https://github.com/cubiq/iscroll/issues/1118#issuecomment-270057583
                if (!this.wrapper.style[utils.style.touchAction]) {
                    this.wrapper.style[utils.style.touchAction] = utils.getTouchAction(this.options.eventPassthrough, false);
                }
            }
            this.wrapperOffset = utils.offset(this.wrapper);

            this._execEvent('refresh');

            this.resetPosition();

            // INSERT POINT: _refresh

        },

        on: function(type, fn) {
            if (!this._events[type]) {
                this._events[type] = [];
            }

            this._events[type].push(fn);
        },

        off: function(type, fn) {
            if (!this._events[type]) {
                return;
            }

            var index = this._events[type].indexOf(fn);

            if (index > -1) {
                this._events[type].splice(index, 1);
            }
        },

        _execEvent: function(type) {
            if (!this._events[type]) {
                return;
            }

            var i = 0,
                l = this._events[type].length;

            if (!l) {
                return;
            }

            for (; i < l; i++) {
                this._events[type][i].apply(this, [].slice.call(arguments, 1));
            }
        },

        scrollBy: function(x, y, time, easing) {
            x = this.x + x;
            y = this.y + y;
            time = time || 0;

            this.scrollTo(x, y, time, easing);
        },

        scrollTo: function(x, y, time, easing) {
            easing = easing || utils.ease.circular;

            this.isInTransition = this.options.useTransition && time > 0;
            var transitionType = this.options.useTransition && easing.style;
            if (!time || transitionType) {
                if (transitionType) {
                    this._transitionTimingFunction(easing.style);
                    this._transitionTime(time);
                }
                this._translate(x, y);
            } else {
                this._animate(x, y, time, easing.fn);
            }
        },

        scrollToElement: function(el, time, offsetX, offsetY, easing) {
            el = el.nodeType ? el : this.scroller.querySelector(el);

            if (!el) {
                return;
            }

            var pos = utils.offset(el);

            pos.left -= this.wrapperOffset.left;
            pos.top -= this.wrapperOffset.top;

            // if offsetX/Y are true we center the element to the screen
            var elRect = utils.getRect(el);
            var wrapperRect = utils.getRect(this.wrapper);
            if (offsetX === true) {
                offsetX = Math.round(elRect.width / 2 - wrapperRect.width / 2);
            }
            if (offsetY === true) {
                offsetY = Math.round(elRect.height / 2 - wrapperRect.height / 2);
            }

            pos.left -= offsetX || 0;
            pos.top -= offsetY || 0;

            pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
            pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

            time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

            this.scrollTo(pos.left, pos.top, time, easing);
        },

        _transitionTime: function(time) {
            if (!this.options.useTransition) {
                return;
            }
            time = time || 0;
            var durationProp = utils.style.transitionDuration;
            if (!durationProp) {
                return;
            }

            this.scrollerStyle[durationProp] = time + 'ms';

            if (!time && utils.isBadAndroid) {
                this.scrollerStyle[durationProp] = '0.0001ms';
                // remove 0.0001ms
                var self = this;
                rAF(function() {
                    if (self.scrollerStyle[durationProp] === '0.0001ms') {
                        self.scrollerStyle[durationProp] = '0s';
                    }
                });
            }


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTime(time);
                }
            }


            // INSERT POINT: _transitionTime

        },

        _transitionTimingFunction: function(easing) {
            this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTimingFunction(easing);
                }
            }


            // INSERT POINT: _transitionTimingFunction

        },

        _translate: function(x, y) {
            if (this.options.useTransform) {

                /* REPLACE START: _translate */

                this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

                /* REPLACE END: _translate */

            } else {
                x = Math.round(x);
                y = Math.round(y);
                this.scrollerStyle.left = x + 'px';
                this.scrollerStyle.top = y + 'px';
            }

            this.x = x;
            this.y = y;


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].updatePosition();
                }
            }


            // INSERT POINT: _translate

        },

        _initEvents: function(remove) {
            var eventType = remove ? utils.removeEvent : utils.addEvent,
                target = this.options.bindToWrapper ? this.wrapper : window;

            eventType(window, 'orientationchange', this);
            eventType(window, 'resize', this);

            if (this.options.click) {
                eventType(this.wrapper, 'click', this, true);
            }

            if (!this.options.disableMouse) {
                eventType(this.wrapper, 'mousedown', this);
                eventType(target, 'mousemove', this);
                eventType(target, 'mousecancel', this);
                eventType(target, 'mouseup', this);
            }

            if (utils.hasPointer && !this.options.disablePointer) {
                eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                eventType(target, utils.prefixPointerEvent('pointermove'), this);
                eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                eventType(target, utils.prefixPointerEvent('pointerup'), this);
            }

            if (utils.hasTouch && !this.options.disableTouch) {
                eventType(this.wrapper, 'touchstart', this);
                eventType(target, 'touchmove', this);
                eventType(target, 'touchcancel', this);
                eventType(target, 'touchend', this);
            }

            eventType(this.scroller, 'transitionend', this);
            eventType(this.scroller, 'webkitTransitionEnd', this);
            eventType(this.scroller, 'oTransitionEnd', this);
            eventType(this.scroller, 'MSTransitionEnd', this);
        },

        getComputedPosition: function() {
            var matrix = window.getComputedStyle(this.scroller, null),
                x, y;

            if (this.options.useTransform) {
                matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            } else {
                x = +matrix.left.replace(/[^-\d.]/g, '');
                y = +matrix.top.replace(/[^-\d.]/g, '');
            }

            return { x: x, y: y };
        },
        _initIndicators: function() {
            var interactive = this.options.interactiveScrollbars,
                customStyle = typeof this.options.scrollbars != 'string',
                indicators = [],
                indicator;

            var that = this;

            this.indicators = [];

            if (this.options.scrollbars) {
                // Vertical scrollbar
                if (this.options.scrollY) {
                    indicator = {
                        el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenX: false
                    };

                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator);
                }

                // Horizontal scrollbar
                if (this.options.scrollX) {
                    indicator = {
                        el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenY: false
                    };

                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator);
                }
            }

            if (this.options.indicators) {
                // TODO: check concat compatibility
                indicators = indicators.concat(this.options.indicators);
            }

            for (var i = indicators.length; i--;) {
                this.indicators.push(new Indicator(this, indicators[i]));
            }

            // TODO: check if we can use array.map (wide compatibility and performance issues)
            function _indicatorsMap(fn) {
                if (that.indicators) {
                    for (var i = that.indicators.length; i--;) {
                        fn.call(that.indicators[i]);
                    }
                }
            }

            if (this.options.fadeScrollbars) {
                this.on('scrollEnd', function() {
                    _indicatorsMap(function() {
                        this.fade();
                    });
                });

                this.on('scrollCancel', function() {
                    _indicatorsMap(function() {
                        this.fade();
                    });
                });

                this.on('scrollStart', function() {
                    _indicatorsMap(function() {
                        this.fade(1);
                    });
                });

                this.on('beforeScrollStart', function() {
                    _indicatorsMap(function() {
                        this.fade(1, true);
                    });
                });
            }


            this.on('refresh', function() {
                _indicatorsMap(function() {
                    this.refresh();
                });
            });

            this.on('destroy', function() {
                _indicatorsMap(function() {
                    this.destroy();
                });

                delete this.indicators;
            });
        },

        _initWheel: function() {
            utils.addEvent(this.wrapper, 'wheel', this);
            utils.addEvent(this.wrapper, 'mousewheel', this);
            utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

            this.on('destroy', function() {
                clearTimeout(this.wheelTimeout);
                this.wheelTimeout = null;
                utils.removeEvent(this.wrapper, 'wheel', this);
                utils.removeEvent(this.wrapper, 'mousewheel', this);
                utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
            });
        },

        _wheel: function(e) {
            if (!this.enabled) {
                return;
            }

            e.preventDefault();

            var wheelDeltaX, wheelDeltaY,
                newX, newY,
                that = this;

            if (this.wheelTimeout === undefined) {
                that._execEvent('scrollStart');
            }

            // Execute the scrollEnd event after 400ms the wheel stopped scrolling
            clearTimeout(this.wheelTimeout);
            this.wheelTimeout = setTimeout(function() {
                if (!that.options.snap) {
                    that._execEvent('scrollEnd');
                }
                that.wheelTimeout = undefined;
            }, 400);

            if ('deltaX' in e) {
                if (e.deltaMode === 1) {
                    wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                    wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
                } else {
                    wheelDeltaX = -e.deltaX;
                    wheelDeltaY = -e.deltaY;
                }
            } else if ('wheelDeltaX' in e) {
                wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
                wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
            } else if ('wheelDelta' in e) {
                wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
            } else if ('detail' in e) {
                wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
            } else {
                return;
            }

            wheelDeltaX *= this.options.invertWheelDirection;
            wheelDeltaY *= this.options.invertWheelDirection;

            if (!this.hasVerticalScroll) {
                wheelDeltaX = wheelDeltaY;
                wheelDeltaY = 0;
            }

            if (this.options.snap) {
                newX = this.currentPage.pageX;
                newY = this.currentPage.pageY;

                if (wheelDeltaX > 0) {
                    newX--;
                } else if (wheelDeltaX < 0) {
                    newX++;
                }

                if (wheelDeltaY > 0) {
                    newY--;
                } else if (wheelDeltaY < 0) {
                    newY++;
                }

                this.goToPage(newX, newY);

                return;
            }

            newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
            newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

            this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0;
            this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0;

            if (newX > 0) {
                newX = 0;
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX;
            }

            if (newY > 0) {
                newY = 0;
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY;
            }

            this.scrollTo(newX, newY, 0);

            if (this.options.probeType > 1) {
                this._execEvent('scroll');
            }

            // INSERT POINT: _wheel
        },

        _initSnap: function() {
            this.currentPage = {};

            if (typeof this.options.snap == 'string') {
                this.options.snap = this.scroller.querySelectorAll(this.options.snap);
            }

            this.on('refresh', function() {
                var i = 0,
                    l,
                    m = 0,
                    n,
                    cx, cy,
                    x = 0,
                    y,
                    stepX = this.options.snapStepX || this.wrapperWidth,
                    stepY = this.options.snapStepY || this.wrapperHeight,
                    el,
                    rect;

                this.pages = [];

                if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                    return;
                }

                if (this.options.snap === true) {
                    cx = Math.round(stepX / 2);
                    cy = Math.round(stepY / 2);

                    while (x > -this.scrollerWidth) {
                        this.pages[i] = [];
                        l = 0;
                        y = 0;

                        while (y > -this.scrollerHeight) {
                            this.pages[i][l] = {
                                x: Math.max(x, this.maxScrollX),
                                y: Math.max(y, this.maxScrollY),
                                width: stepX,
                                height: stepY,
                                cx: x - cx,
                                cy: y - cy
                            };

                            y -= stepY;
                            l++;
                        }

                        x -= stepX;
                        i++;
                    }
                } else {
                    el = this.options.snap;
                    l = el.length;
                    n = -1;

                    for (; i < l; i++) {
                        rect = utils.getRect(el[i]);
                        if (i === 0 || rect.left <= utils.getRect(el[i - 1]).left) {
                            m = 0;
                            n++;
                        }

                        if (!this.pages[m]) {
                            this.pages[m] = [];
                        }

                        x = Math.max(-rect.left, this.maxScrollX);
                        y = Math.max(-rect.top, this.maxScrollY);
                        cx = x - Math.round(rect.width / 2);
                        cy = y - Math.round(rect.height / 2);

                        this.pages[m][n] = {
                            x: x,
                            y: y,
                            width: rect.width,
                            height: rect.height,
                            cx: cx,
                            cy: cy
                        };

                        if (x > this.maxScrollX) {
                            m++;
                        }
                    }
                }

                this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

                // Update snap threshold if needed
                if (this.options.snapThreshold % 1 === 0) {
                    this.snapThresholdX = this.options.snapThreshold;
                    this.snapThresholdY = this.options.snapThreshold;
                } else {
                    this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                    this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
                }
            });

            this.on('flick', function() {
                var time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(this.x - this.startX), 1000),
                        Math.min(Math.abs(this.y - this.startY), 1000)
                    ), 300);

                this.goToPage(
                    this.currentPage.pageX + this.directionX,
                    this.currentPage.pageY + this.directionY,
                    time
                );
            });
        },

        _nearestSnap: function(x, y) {
            if (!this.pages.length) {
                return { x: 0, y: 0, pageX: 0, pageY: 0 };
            }

            var i = 0,
                l = this.pages.length,
                m = 0;

            // Check if we exceeded the snap threshold
            if (Math.abs(x - this.absStartX) < this.snapThresholdX &&
                Math.abs(y - this.absStartY) < this.snapThresholdY) {
                return this.currentPage;
            }

            if (x > 0) {
                x = 0;
            } else if (x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (y > 0) {
                y = 0;
            } else if (y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            for (; i < l; i++) {
                if (x >= this.pages[i][0].cx) {
                    x = this.pages[i][0].x;
                    break;
                }
            }

            l = this.pages[i].length;

            for (; m < l; m++) {
                if (y >= this.pages[0][m].cy) {
                    y = this.pages[0][m].y;
                    break;
                }
            }

            if (i == this.currentPage.pageX) {
                i += this.directionX;

                if (i < 0) {
                    i = 0;
                } else if (i >= this.pages.length) {
                    i = this.pages.length - 1;
                }

                x = this.pages[i][0].x;
            }

            if (m == this.currentPage.pageY) {
                m += this.directionY;

                if (m < 0) {
                    m = 0;
                } else if (m >= this.pages[0].length) {
                    m = this.pages[0].length - 1;
                }

                y = this.pages[0][m].y;
            }

            return {
                x: x,
                y: y,
                pageX: i,
                pageY: m
            };
        },

        goToPage: function(x, y, time, easing) {
            easing = easing || this.options.bounceEasing;

            if (x >= this.pages.length) {
                x = this.pages.length - 1;
            } else if (x < 0) {
                x = 0;
            }

            if (y >= this.pages[x].length) {
                y = this.pages[x].length - 1;
            } else if (y < 0) {
                y = 0;
            }

            var posX = this.pages[x][y].x,
                posY = this.pages[x][y].y;

            time = time === undefined ? this.options.snapSpeed || Math.max(
                Math.max(
                    Math.min(Math.abs(posX - this.x), 1000),
                    Math.min(Math.abs(posY - this.y), 1000)
                ), 300) : time;

            this.currentPage = {
                x: posX,
                y: posY,
                pageX: x,
                pageY: y
            };

            this.scrollTo(posX, posY, time, easing);
        },

        next: function(time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;

            x++;

            if (x >= this.pages.length && this.hasVerticalScroll) {
                x = 0;
                y++;
            }

            this.goToPage(x, y, time, easing);
        },

        prev: function(time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;

            x--;

            if (x < 0 && this.hasVerticalScroll) {
                x = 0;
                y--;
            }

            this.goToPage(x, y, time, easing);
        },

        _initKeys: function(e) {
            // default key bindings
            var keys = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            var i;

            // if you give me characters I give you keycode
            if (typeof this.options.keyBindings == 'object') {
                for (i in this.options.keyBindings) {
                    if (typeof this.options.keyBindings[i] == 'string') {
                        this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
                    }
                }
            } else {
                this.options.keyBindings = {};
            }

            for (i in keys) {
                this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
            }

            utils.addEvent(window, 'keydown', this);

            this.on('destroy', function() {
                utils.removeEvent(window, 'keydown', this);
            });
        },

        _key: function(e) {
            if (!this.enabled) {
                return;
            }

            var snap = this.options.snap, // we are using this alot, better to cache it
                newX = snap ? this.currentPage.pageX : this.x,
                newY = snap ? this.currentPage.pageY : this.y,
                now = utils.getTime(),
                prevTime = this.keyTime || 0,
                acceleration = 0.250,
                pos;

            if (this.options.useTransition && this.isInTransition) {
                pos = this.getComputedPosition();

                this._translate(Math.round(pos.x), Math.round(pos.y));
                this.isInTransition = false;
            }

            this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

            switch (e.keyCode) {
                case this.options.keyBindings.pageUp:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX += snap ? 1 : this.wrapperWidth;
                    } else {
                        newY += snap ? 1 : this.wrapperHeight;
                    }
                    break;
                case this.options.keyBindings.pageDown:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX -= snap ? 1 : this.wrapperWidth;
                    } else {
                        newY -= snap ? 1 : this.wrapperHeight;
                    }
                    break;
                case this.options.keyBindings.end:
                    newX = snap ? this.pages.length - 1 : this.maxScrollX;
                    newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                    break;
                case this.options.keyBindings.home:
                    newX = 0;
                    newY = 0;
                    break;
                case this.options.keyBindings.left:
                    newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.up:
                    newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.right:
                    newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.down:
                    newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                default:
                    return;
            }

            if (snap) {
                this.goToPage(newX, newY);
                return;
            }

            if (newX > 0) {
                newX = 0;
                this.keyAcceleration = 0;
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX;
                this.keyAcceleration = 0;
            }

            if (newY > 0) {
                newY = 0;
                this.keyAcceleration = 0;
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY;
                this.keyAcceleration = 0;
            }

            this.scrollTo(newX, newY, 0);

            this.keyTime = now;
        },

        _animate: function(destX, destY, duration, easingFn) {
            var that = this,
                startX = this.x,
                startY = this.y,
                startTime = utils.getTime(),
                destTime = startTime + duration;

            function step() {
                var now = utils.getTime(),
                    newX, newY,
                    easing;

                if (now >= destTime) {
                    that.isAnimating = false;
                    that._translate(destX, destY);

                    if (!that.resetPosition(that.options.bounceTime)) {
                        that._execEvent('scrollEnd');
                    }

                    return;
                }

                now = (now - startTime) / duration;
                easing = easingFn(now);
                newX = (destX - startX) * easing + startX;
                newY = (destY - startY) * easing + startY;
                that._translate(newX, newY);

                if (that.isAnimating) {
                    rAF(step);
                }

                if (that.options.probeType == 3) {
                    that._execEvent('scroll');
                }
            }

            this.isAnimating = true;
            step();
        },

        handleEvent: function(e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
                case 'orientationchange':
                case 'resize':
                    this._resize();
                    break;
                case 'transitionend':
                case 'webkitTransitionEnd':
                case 'oTransitionEnd':
                case 'MSTransitionEnd':
                    this._transitionEnd(e);
                    break;
                case 'wheel':
                case 'DOMMouseScroll':
                case 'mousewheel':
                    this._wheel(e);
                    break;
                case 'keydown':
                    this._key(e);
                    break;
                case 'click':
                    if (this.enabled && !e._constructed) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;
            }
        }
    };

    function createDefaultScrollbar(direction, interactive, type) {
        var scrollbar = document.createElement('div'),
            indicator = document.createElement('div');

        if (type === true) {
            scrollbar.style.cssText = 'position:absolute;z-index:9999';
            indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:#9cca48;border:1px solid rgba(255,255,255,0.9);border-radius:3px';
        }

        indicator.className = 'iScrollIndicator';

        if (direction == 'h') {
            if (type === true) {
                scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
                indicator.style.height = '100%';
            }
            scrollbar.className = 'iScrollHorizontalScrollbar';
        } else {
            if (type === true) {
                scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
                indicator.style.width = '100%';
            }
            scrollbar.className = 'iScrollVerticalScrollbar';
        }

        scrollbar.style.cssText += ';overflow:hidden';

        if (!interactive) {
            scrollbar.style.pointerEvents = 'none';
        }

        scrollbar.appendChild(indicator);

        return scrollbar;
    }

    function Indicator(scroller, options) {
        this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
        this.wrapperStyle = this.wrapper.style;
        this.indicator = this.wrapper.children[0];
        this.indicatorStyle = this.indicator.style;
        this.scroller = scroller;

        this.options = {
            listenX: true,
            listenY: true,
            interactive: false,
            resize: true,
            defaultScrollbars: false,
            shrink: false,
            fade: false,
            speedRatioX: 0,
            speedRatioY: 0
        };

        for (var i in options) {
            this.options[i] = options[i];
        }

        this.sizeRatioX = 1;
        this.sizeRatioY = 1;
        this.maxPosX = 0;
        this.maxPosY = 0;

        if (this.options.interactive) {
            if (!this.options.disableTouch) {
                utils.addEvent(this.indicator, 'touchstart', this);
                utils.addEvent(window, 'touchend', this);
            }
            if (!this.options.disablePointer) {
                utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
            }
            if (!this.options.disableMouse) {
                utils.addEvent(this.indicator, 'mousedown', this);
                utils.addEvent(window, 'mouseup', this);
            }
        }

        if (this.options.fade) {
            this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
            var durationProp = utils.style.transitionDuration;
            if (!durationProp) {
                return;
            }
            this.wrapperStyle[durationProp] = utils.isBadAndroid ? '0.0001ms' : '0ms';
            // remove 0.0001ms
            var self = this;
            if (utils.isBadAndroid) {
                rAF(function() {
                    if (self.wrapperStyle[durationProp] === '0.0001ms') {
                        self.wrapperStyle[durationProp] = '0s';
                    }
                });
            }
            this.wrapperStyle.opacity = '0';
        }
    }

    Indicator.prototype = {
        handleEvent: function(e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
            }
        },

        destroy: function() {
            if (this.options.fadeScrollbars) {
                clearTimeout(this.fadeTimeout);
                this.fadeTimeout = null;
            }
            if (this.options.interactive) {
                utils.removeEvent(this.indicator, 'touchstart', this);
                utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.removeEvent(this.indicator, 'mousedown', this);

                utils.removeEvent(window, 'touchmove', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                utils.removeEvent(window, 'mousemove', this);

                utils.removeEvent(window, 'touchend', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
                utils.removeEvent(window, 'mouseup', this);
            }

            if (this.options.defaultScrollbars && this.wrapper.parentNode) {
                this.wrapper.parentNode.removeChild(this.wrapper);
            }
        },

        _start: function(e) {
            var point = e.touches ? e.touches[0] : e;

            e.preventDefault();
            e.stopPropagation();

            this.transitionTime();

            this.initiated = true;
            this.moved = false;
            this.lastPointX = point.pageX;
            this.lastPointY = point.pageY;

            this.startTime = utils.getTime();

            if (!this.options.disableTouch) {
                utils.addEvent(window, 'touchmove', this);
            }
            if (!this.options.disablePointer) {
                utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
            }
            if (!this.options.disableMouse) {
                utils.addEvent(window, 'mousemove', this);
            }

            this.scroller._execEvent('beforeScrollStart');
        },

        _move: function(e) {
            var point = e.touches ? e.touches[0] : e,
                deltaX, deltaY,
                newX, newY,
                timestamp = utils.getTime();

            if (!this.moved) {
                this.scroller._execEvent('scrollStart');
            }

            this.moved = true;

            deltaX = point.pageX - this.lastPointX;
            this.lastPointX = point.pageX;

            deltaY = point.pageY - this.lastPointY;
            this.lastPointY = point.pageY;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            this._pos(newX, newY);


            if (this.scroller.options.probeType == 1 && timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.scroller._execEvent('scroll');
            } else if (this.scroller.options.probeType > 1) {
                this.scroller._execEvent('scroll');
            }


            // INSERT POINT: indicator._move

            e.preventDefault();
            e.stopPropagation();
        },

        _end: function(e) {
            if (!this.initiated) {
                return;
            }

            this.initiated = false;

            e.preventDefault();
            e.stopPropagation();

            utils.removeEvent(window, 'touchmove', this);
            utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
            utils.removeEvent(window, 'mousemove', this);

            if (this.scroller.options.snap) {
                var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

                var time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(this.scroller.x - snap.x), 1000),
                        Math.min(Math.abs(this.scroller.y - snap.y), 1000)
                    ), 300);

                if (this.scroller.x != snap.x || this.scroller.y != snap.y) {
                    this.scroller.directionX = 0;
                    this.scroller.directionY = 0;
                    this.scroller.currentPage = snap;
                    this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
                }
            }

            if (this.moved) {
                this.scroller._execEvent('scrollEnd');
            }
        },

        transitionTime: function(time) {
            time = time || 0;
            var durationProp = utils.style.transitionDuration;
            if (!durationProp) {
                return;
            }

            this.indicatorStyle[durationProp] = time + 'ms';

            if (!time && utils.isBadAndroid) {
                this.indicatorStyle[durationProp] = '0.0001ms';
                // remove 0.0001ms
                var self = this;
                rAF(function() {
                    if (self.indicatorStyle[durationProp] === '0.0001ms') {
                        self.indicatorStyle[durationProp] = '0s';
                    }
                });
            }
        },

        transitionTimingFunction: function(easing) {
            this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
        },

        refresh: function() {
            this.transitionTime();

            if (this.options.listenX && !this.options.listenY) {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
            } else if (this.options.listenY && !this.options.listenX) {
                this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
            } else {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
            }

            if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
                utils.addClass(this.wrapper, 'iScrollBothScrollbars');
                utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '8px';
                    } else {
                        this.wrapper.style.bottom = '8px';
                    }
                }
            } else {
                utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
                utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '2px';
                    } else {
                        this.wrapper.style.bottom = '2px';
                    }
                }
            }

            utils.getRect(this.wrapper); // force refresh

            if (this.options.listenX) {
                this.wrapperWidth = this.wrapper.clientWidth;
                if (this.options.resize) {
                    this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                    this.indicatorStyle.width = this.indicatorWidth + 'px';
                } else {
                    this.indicatorWidth = this.indicator.clientWidth;
                }

                this.maxPosX = this.wrapperWidth - this.indicatorWidth;

                if (this.options.shrink == 'clip') {
                    this.minBoundaryX = -this.indicatorWidth + 8;
                    this.maxBoundaryX = this.wrapperWidth - 8;
                } else {
                    this.minBoundaryX = 0;
                    this.maxBoundaryX = this.maxPosX;
                }

                this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
            }

            if (this.options.listenY) {
                this.wrapperHeight = this.wrapper.clientHeight;
                if (this.options.resize) {
                    this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                    this.indicatorStyle.height = this.indicatorHeight + 'px';
                } else {
                    this.indicatorHeight = this.indicator.clientHeight;
                }

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;

                if (this.options.shrink == 'clip') {
                    this.minBoundaryY = -this.indicatorHeight + 8;
                    this.maxBoundaryY = this.wrapperHeight - 8;
                } else {
                    this.minBoundaryY = 0;
                    this.maxBoundaryY = this.maxPosY;
                }

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
            }

            this.updatePosition();
        },

        updatePosition: function() {
            var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

            if (!this.options.ignoreBoundaries) {
                if (x < this.minBoundaryX) {
                    if (this.options.shrink == 'scale') {
                        this.width = Math.max(this.indicatorWidth + x, 8);
                        this.indicatorStyle.width = this.width + 'px';
                    }
                    x = this.minBoundaryX;
                } else if (x > this.maxBoundaryX) {
                    if (this.options.shrink == 'scale') {
                        this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                        this.indicatorStyle.width = this.width + 'px';
                        x = this.maxPosX + this.indicatorWidth - this.width;
                    } else {
                        x = this.maxBoundaryX;
                    }
                } else if (this.options.shrink == 'scale' && this.width != this.indicatorWidth) {
                    this.width = this.indicatorWidth;
                    this.indicatorStyle.width = this.width + 'px';
                }

                if (y < this.minBoundaryY) {
                    if (this.options.shrink == 'scale') {
                        this.height = Math.max(this.indicatorHeight + y * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                    }
                    y = this.minBoundaryY;
                } else if (y > this.maxBoundaryY) {
                    if (this.options.shrink == 'scale') {
                        this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                        y = this.maxPosY + this.indicatorHeight - this.height;
                    } else {
                        y = this.maxBoundaryY;
                    }
                } else if (this.options.shrink == 'scale' && this.height != this.indicatorHeight) {
                    this.height = this.indicatorHeight;
                    this.indicatorStyle.height = this.height + 'px';
                }
            }

            this.x = x;
            this.y = y;

            if (this.scroller.options.useTransform) {
                this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
            } else {
                this.indicatorStyle.left = x + 'px';
                this.indicatorStyle.top = y + 'px';
            }
        },

        _pos: function(x, y) {
            if (x < 0) {
                x = 0;
            } else if (x > this.maxPosX) {
                x = this.maxPosX;
            }

            if (y < 0) {
                y = 0;
            } else if (y > this.maxPosY) {
                y = this.maxPosY;
            }

            x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
            y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

            this.scroller.scrollTo(x, y);
        },

        fade: function(val, hold) {
            if (hold && !this.visible) {
                return;
            }

            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;

            var time = val ? 250 : 500,
                delay = val ? 0 : 300;

            val = val ? '1' : '0';

            this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

            this.fadeTimeout = setTimeout((function(val) {
                this.wrapperStyle.opacity = val;
                this.visible = +val;
            }).bind(this, val), delay);
        }
    };

    IScroll.utils = utils;

    if (typeof module != 'undefined' && module.exports) {
        module.exports = IScroll;
    } else if (typeof define == 'function' && define.amd) {
        define('Scroller', [], function() {
            return IScroll;
        });
    } else {
        window.Scroller = IScroll;
    }

})(window, document, Math);

! function(a, b, c, d) {
    "use strict";

    function e(a, b, c) {
        return setTimeout(j(a, c), b)
    }

    function f(a, b, c) {
        return Array.isArray(a) ? (g(a, c[b], c), !0) : !1
    }

    function g(a, b, c) {
        var e;
        if (a)
            if (a.forEach) a.forEach(b, c);
            else if (a.length !== d)
            for (e = 0; e < a.length;) b.call(c, a[e], e, a), e++;
        else
            for (e in a) a.hasOwnProperty(e) && b.call(c, a[e], e, a)
    }

    function h(b, c, d) {
        var e = "DEPRECATED METHOD: " + c + "\n" + d + " AT \n";
        return function() {
            var c = new Error("get-stack-trace"),
                d = c && c.stack ? c.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
                f = a.console && (a.console.warn || a.console.log);
            return f && f.call(a.console, e, d), b.apply(this, arguments)
        }
    }

    function i(a, b, c) {
        var d, e = b.prototype;
        d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && la(d, c)
    }

    function j(a, b) {
        return function() {
            return a.apply(b, arguments)
        }
    }

    function k(a, b) {
        return typeof a == oa ? a.apply(b ? b[0] || d : d, b) : a
    }

    function l(a, b) {
        return a === d ? b : a
    }

    function m(a, b, c) { g(q(b), function(b) { a.addEventListener(b, c, !1) }) }

    function n(a, b, c) { g(q(b), function(b) { a.removeEventListener(b, c, !1) }) }

    function o(a, b) {
        for (; a;) {
            if (a == b) return !0;
            a = a.parentNode
        }
        return !1
    }

    function p(a, b) {
        return a.indexOf(b) > -1
    }

    function q(a) {
        return a.trim().split(/\s+/g)
    }

    function r(a, b, c) {
        if (a.indexOf && !c) return a.indexOf(b);
        for (var d = 0; d < a.length;) {
            if (c && a[d][c] == b || !c && a[d] === b) return d;
            d++
        }
        return -1
    }

    function s(a) {
        return Array.prototype.slice.call(a, 0)
    }

    function t(a, b, c) {
        for (var d = [], e = [], f = 0; f < a.length;) {
            var g = b ? a[f][b] : a[f];
            r(e, g) < 0 && d.push(a[f]), e[f] = g, f++
        }
        return c && (d = b ? d.sort(function(a, c) {
            return a[b] > c[b]
        }) : d.sort()), d
    }

    function u(a, b) {
        for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ma.length;) {
            if (c = ma[g], e = c ? c + f : b, e in a) return e;
            g++
        }
        return d
    }

    function v() {
        return ua++
    }

    function w(b) {
        var c = b.ownerDocument || b;
        return c.defaultView || c.parentWindow || a
    }

    function x(a, b) {
        var c = this;
        this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function(b) { k(a.options.enable, [a]) && c.handler(b) }, this.init()
    }

    function y(a) {
        var b, c = a.options.inputClass;
        return new(b = c ? c : xa ? M : ya ? P : wa ? R : L)(a, z)
    }

    function z(a, b, c) {
        var d = c.pointers.length,
            e = c.changedPointers.length,
            f = b & Ea && d - e === 0,
            g = b & (Ga | Ha) && d - e === 0;
        c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, A(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c
    }

    function A(a, b) {
        var c = a.session,
            d = b.pointers,
            e = d.length;
        c.firstInput || (c.firstInput = D(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = D(b) : 1 === e && (c.firstMultiple = !1);
        var f = c.firstInput,
            g = c.firstMultiple,
            h = g ? g.center : f.center,
            i = b.center = E(d);
        b.timeStamp = ra(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = I(h, i), b.distance = H(h, i), B(c, b), b.offsetDirection = G(b.deltaX, b.deltaY);
        var j = F(b.deltaTime, b.deltaX, b.deltaY);
        b.overallVelocityX = j.x, b.overallVelocityY = j.y, b.overallVelocity = qa(j.x) > qa(j.y) ? j.x : j.y, b.scale = g ? K(g.pointers, d) : 1, b.rotation = g ? J(g.pointers, d) : 0, b.maxPointers = c.prevInput ? b.pointers.length > c.prevInput.maxPointers ? b.pointers.length : c.prevInput.maxPointers : b.pointers.length, C(c, b);
        var k = a.element;
        o(b.srcEvent.target, k) && (k = b.srcEvent.target), b.target = k
    }

    function B(a, b) {
        var c = b.center,
            d = a.offsetDelta || {},
            e = a.prevDelta || {},
            f = a.prevInput || {};
        b.eventType !== Ea && f.eventType !== Ga || (e = a.prevDelta = { x: f.deltaX || 0, y: f.deltaY || 0 }, d = a.offsetDelta = { x: c.x, y: c.y }), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y)
    }

    function C(a, b) {
        var c, e, f, g, h = a.lastInterval || b,
            i = b.timeStamp - h.timeStamp;
        if (b.eventType != Ha && (i > Da || h.velocity === d)) {
            var j = b.deltaX - h.deltaX,
                k = b.deltaY - h.deltaY,
                l = F(i, j, k);
            e = l.x, f = l.y, c = qa(l.x) > qa(l.y) ? l.x : l.y, g = G(j, k), a.lastInterval = b
        } else c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction;
        b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g
    }

    function D(a) {
        for (var b = [], c = 0; c < a.pointers.length;) b[c] = { clientX: pa(a.pointers[c].clientX), clientY: pa(a.pointers[c].clientY) }, c++;
        return { timeStamp: ra(), pointers: b, center: E(b), deltaX: a.deltaX, deltaY: a.deltaY }
    }

    function E(a) {
        var b = a.length;
        if (1 === b) return { x: pa(a[0].clientX), y: pa(a[0].clientY) };
        for (var c = 0, d = 0, e = 0; b > e;) c += a[e].clientX, d += a[e].clientY, e++;
        return { x: pa(c / b), y: pa(d / b) }
    }

    function F(a, b, c) {
        return { x: b / a || 0, y: c / a || 0 }
    }

    function G(a, b) {
        return a === b ? Ia : qa(a) >= qa(b) ? 0 > a ? Ja : Ka : 0 > b ? La : Ma
    }

    function H(a, b, c) {
        c || (c = Qa);
        var d = b[c[0]] - a[c[0]],
            e = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + e * e)
    }

    function I(a, b, c) {
        c || (c = Qa);
        var d = b[c[0]] - a[c[0]],
            e = b[c[1]] - a[c[1]];
        return 180 * Math.atan2(e, d) / Math.PI
    }

    function J(a, b) {
        return I(b[1], b[0], Ra) + I(a[1], a[0], Ra)
    }

    function K(a, b) {
        return H(b[0], b[1], Ra) / H(a[0], a[1], Ra)
    }

    function L() { this.evEl = Ta, this.evWin = Ua, this.pressed = !1, x.apply(this, arguments) }

    function M() { this.evEl = Xa, this.evWin = Ya, x.apply(this, arguments), this.store = this.manager.session.pointerEvents = [] }

    function N() { this.evTarget = $a, this.evWin = _a, this.started = !1, x.apply(this, arguments) }

    function O(a, b) {
        var c = s(a.touches),
            d = s(a.changedTouches);
        return b & (Ga | Ha) && (c = t(c.concat(d), "identifier", !0)), [c, d]
    }

    function P() { this.evTarget = bb, this.targetIds = {}, x.apply(this, arguments) }

    function Q(a, b) {
        var c = s(a.touches),
            d = this.targetIds;
        if (b & (Ea | Fa) && 1 === c.length) return d[c[0].identifier] = !0, [c, c];
        var e, f, g = s(a.changedTouches),
            h = [],
            i = this.target;
        if (f = c.filter(function(a) {
                return o(a.target, i)
            }), b === Ea)
            for (e = 0; e < f.length;) d[f[e].identifier] = !0, e++;
        for (e = 0; e < g.length;) d[g[e].identifier] && h.push(g[e]), b & (Ga | Ha) && delete d[g[e].identifier], e++;
        return h.length ? [t(f.concat(h), "identifier", !0), h] : void 0
    }

    function R() {
        x.apply(this, arguments);
        var a = j(this.handler, this);
        this.touch = new P(this.manager, a), this.mouse = new L(this.manager, a), this.primaryTouch = null, this.lastTouches = []
    }

    function S(a, b) { a & Ea ? (this.primaryTouch = b.changedPointers[0].identifier, T.call(this, b)) : a & (Ga | Ha) && T.call(this, b) }

    function T(a) {
        var b = a.changedPointers[0];
        if (b.identifier === this.primaryTouch) {
            var c = { x: b.clientX, y: b.clientY };
            this.lastTouches.push(c);
            var d = this.lastTouches,
                e = function() {
                    var a = d.indexOf(c);
                    a > -1 && d.splice(a, 1)
                };
            setTimeout(e, cb)
        }
    }

    function U(a) {
        for (var b = a.srcEvent.clientX, c = a.srcEvent.clientY, d = 0; d < this.lastTouches.length; d++) {
            var e = this.lastTouches[d],
                f = Math.abs(b - e.x),
                g = Math.abs(c - e.y);
            if (db >= f && db >= g) return !0
        }
        return !1
    }

    function V(a, b) { this.manager = a, this.set(b) }

    function W(a) {
        if (p(a, jb)) return jb;
        var b = p(a, kb),
            c = p(a, lb);
        return b && c ? jb : b || c ? b ? kb : lb : p(a, ib) ? ib : hb
    }

    function X() {
        if (!fb) return !1;
        var b = {},
            c = a.CSS && a.CSS.supports;
        return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(d) { b[d] = c ? a.CSS.supports("touch-action", d) : !0 }), b
    }

    function Y(a) { this.options = la({}, this.defaults, a || {}), this.id = v(), this.manager = null, this.options.enable = l(this.options.enable, !0), this.state = nb, this.simultaneous = {}, this.requireFail = [] }

    function Z(a) {
        return a & sb ? "cancel" : a & qb ? "end" : a & pb ? "move" : a & ob ? "start" : ""
    }

    function $(a) {
        return a == Ma ? "down" : a == La ? "up" : a == Ja ? "left" : a == Ka ? "right" : ""
    }

    function _(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a
    }

    function aa() { Y.apply(this, arguments) }

    function ba() { aa.apply(this, arguments), this.pX = null, this.pY = null }

    function ca() { aa.apply(this, arguments) }

    function da() { Y.apply(this, arguments), this._timer = null, this._input = null }

    function ea() { aa.apply(this, arguments) }

    function fa() { aa.apply(this, arguments) }

    function ga() { Y.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0 }

    function ha(a, b) {
        return b = b || {}, b.recognizers = l(b.recognizers, ha.defaults.preset), new ia(a, b)
    }

    function ia(a, b) {
        this.options = la({}, ha.defaults, b || {}), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = a, this.input = y(this), this.touchAction = new V(this, this.options.touchAction), ja(this, !0), g(this.options.recognizers, function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3])
        }, this)
    }

    function ja(a, b) {
        var c = a.element;
        if (c.style) {
            var d;
            g(a.options.cssProps, function(e, f) { d = u(c.style, f), b ? (a.oldCssProps[d] = c.style[d], c.style[d] = e) : c.style[d] = a.oldCssProps[d] || "" }), b || (a.oldCssProps = {})
        }
    }

    function ka(a, c) {
        var d = b.createEvent("Event");
        d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d)
    }
    var la, ma = ["", "webkit", "Moz", "MS", "ms", "o"],
        na = b.createElement("div"),
        oa = "function",
        pa = Math.round,
        qa = Math.abs,
        ra = Date.now;
    la = "function" != typeof Object.assign ? function(a) {
        if (a === d || null === a) throw new TypeError("Cannot convert undefined or null to object");
        for (var b = Object(a), c = 1; c < arguments.length; c++) {
            var e = arguments[c];
            if (e !== d && null !== e)
                for (var f in e) e.hasOwnProperty(f) && (b[f] = e[f])
        }
        return b
    } : Object.assign;
    var sa = h(function(a, b, c) {
            for (var e = Object.keys(b), f = 0; f < e.length;)(!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++;
            return a
        }, "extend", "Use `assign`."),
        ta = h(function(a, b) {
            return sa(a, b, !0)
        }, "merge", "Use `assign`."),
        ua = 1,
        va = /mobile|tablet|ip(ad|hone|od)|android/i,
        wa = "ontouchstart" in a,
        xa = u(a, "PointerEvent") !== d,
        ya = wa && va.test(navigator.userAgent),
        za = "touch",
        Aa = "pen",
        Ba = "mouse",
        Ca = "kinect",
        Da = 25,
        Ea = 1,
        Fa = 2,
        Ga = 4,
        Ha = 8,
        Ia = 1,
        Ja = 2,
        Ka = 4,
        La = 8,
        Ma = 16,
        Na = Ja | Ka,
        Oa = La | Ma,
        Pa = Na | Oa,
        Qa = ["x", "y"],
        Ra = ["clientX", "clientY"];
    x.prototype = { handler: function() {}, init: function() { this.evEl && m(this.element, this.evEl, this.domHandler), this.evTarget && m(this.target, this.evTarget, this.domHandler), this.evWin && m(w(this.element), this.evWin, this.domHandler) }, destroy: function() { this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(w(this.element), this.evWin, this.domHandler) } };
    var Sa = { mousedown: Ea, mousemove: Fa, mouseup: Ga },
        Ta = "mousedown",
        Ua = "mousemove mouseup";
    i(L, x, {
        handler: function(a) {
            var b = Sa[a.type];
            b & Ea && 0 === a.button && (this.pressed = !0), b & Fa && 1 !== a.which && (b = Ga), this.pressed && (b & Ga && (this.pressed = !1), this.callback(this.manager, b, { pointers: [a], changedPointers: [a], pointerType: Ba, srcEvent: a }))
        }
    });
    var Va = { pointerdown: Ea, pointermove: Fa, pointerup: Ga, pointercancel: Ha, pointerout: Ha },
        Wa = { 2: za, 3: Aa, 4: Ba, 5: Ca },
        Xa = "pointerdown",
        Ya = "pointermove pointerup pointercancel";
    a.MSPointerEvent && !a.PointerEvent && (Xa = "MSPointerDown", Ya = "MSPointerMove MSPointerUp MSPointerCancel"), i(M, x, {
        handler: function(a) {
            var b = this.store,
                c = !1,
                d = a.type.toLowerCase().replace("ms", ""),
                e = Va[d],
                f = Wa[a.pointerType] || a.pointerType,
                g = f == za,
                h = r(b, a.pointerId, "pointerId");
            e & Ea && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Ga | Ha) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, { pointers: b, changedPointers: [a], pointerType: f, srcEvent: a }), c && b.splice(h, 1))
        }
    });
    var Za = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha },
        $a = "touchstart",
        _a = "touchstart touchmove touchend touchcancel";
    i(N, x, {
        handler: function(a) {
            var b = Za[a.type];
            if (b === Ea && (this.started = !0), this.started) {
                var c = O.call(this, a, b);
                b & (Ga | Ha) && c[0].length - c[1].length === 0 && (this.started = !1), this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: za, srcEvent: a })
            }
        }
    });
    var ab = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha },
        bb = "touchstart touchmove touchend touchcancel";
    i(P, x, {
        handler: function(a) {
            var b = ab[a.type],
                c = Q.call(this, a, b);
            c && this.callback(this.manager, b, { pointers: c[0], changedPointers: c[1], pointerType: za, srcEvent: a })
        }
    });
    var cb = 2500,
        db = 25;
    i(R, x, {
        handler: function(a, b, c) {
            var d = c.pointerType == za,
                e = c.pointerType == Ba;
            if (!(e && c.sourceCapabilities && c.sourceCapabilities.firesTouchEvents)) {
                if (d) S.call(this, b, c);
                else if (e && U.call(this, c)) return;
                this.callback(a, b, c)
            }
        },
        destroy: function() { this.touch.destroy(), this.mouse.destroy() }
    });
    var eb = u(na.style, "touchAction"),
        fb = eb !== d,
        gb = "compute",
        hb = "auto",
        ib = "manipulation",
        jb = "none",
        kb = "pan-x",
        lb = "pan-y",
        mb = X();
    V.prototype = {
        set: function(a) { a == gb && (a = this.compute()), fb && this.manager.element.style && mb[a] && (this.manager.element.style[eb] = a), this.actions = a.toLowerCase().trim() },
        update: function() { this.set(this.manager.options.touchAction) },
        compute: function() {
            var a = [];
            return g(this.manager.recognizers, function(b) { k(b.options.enable, [b]) && (a = a.concat(b.getTouchAction())) }), W(a.join(" "))
        },
        preventDefaults: function(a) {
            var b = a.srcEvent,
                c = a.offsetDirection;
            if (this.manager.session.prevented) return void b.preventDefault();
            var d = this.actions,
                e = p(d, jb) && !mb[jb],
                f = p(d, lb) && !mb[lb],
                g = p(d, kb) && !mb[kb];
            if (e) {
                var h = 1 === a.pointers.length,
                    i = a.distance < 2,
                    j = a.deltaTime < 250;
                if (h && i && j) return
            }
            return g && f ? void 0 : e || f && c & Na || g && c & Oa ? this.preventSrc(b) : void 0
        },
        preventSrc: function(a) { this.manager.session.prevented = !0, a.preventDefault() }
    };
    var nb = 1,
        ob = 2,
        pb = 4,
        qb = 8,
        rb = qb,
        sb = 16,
        tb = 32;
    Y.prototype = {
        defaults: {},
        set: function(a) {
            return la(this.options, a), this.manager && this.manager.touchAction.update(), this
        },
        recognizeWith: function(a) {
            if (f(a, "recognizeWith", this)) return this;
            var b = this.simultaneous;
            return a = _(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this
        },
        dropRecognizeWith: function(a) {
            return f(a, "dropRecognizeWith", this) ? this : (a = _(a, this), delete this.simultaneous[a.id], this)
        },
        requireFailure: function(a) {
            if (f(a, "requireFailure", this)) return this;
            var b = this.requireFail;
            return a = _(a, this), -1 === r(b, a) && (b.push(a), a.requireFailure(this)), this
        },
        dropRequireFailure: function(a) {
            if (f(a, "dropRequireFailure", this)) return this;
            a = _(a, this);
            var b = r(this.requireFail, a);
            return b > -1 && this.requireFail.splice(b, 1), this
        },
        hasRequireFailures: function() {
            return this.requireFail.length > 0
        },
        canRecognizeWith: function(a) {
            return !!this.simultaneous[a.id]
        },
        emit: function(a) {
            function b(b) { c.manager.emit(b, a) }
            var c = this,
                d = this.state;
            qb > d && b(c.options.event + Z(d)), b(c.options.event), a.additionalEvent && b(a.additionalEvent), d >= qb && b(c.options.event + Z(d))
        },
        tryEmit: function(a) {
            return this.canEmit() ? this.emit(a) : void(this.state = tb)
        },
        canEmit: function() {
            for (var a = 0; a < this.requireFail.length;) {
                if (!(this.requireFail[a].state & (tb | nb))) return !1;
                a++
            }
            return !0
        },
        recognize: function(a) {
            var b = la({}, a);
            return k(this.options.enable, [this, b]) ? (this.state & (rb | sb | tb) && (this.state = nb), this.state = this.process(b), void(this.state & (ob | pb | qb | sb) && this.tryEmit(b))) : (this.reset(), void(this.state = tb))
        },
        process: function(a) {},
        getTouchAction: function() {},
        reset: function() {}
    }, i(aa, Y, {
        defaults: { pointers: 1 },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b
        },
        process: function(a) {
            var b = this.state,
                c = a.eventType,
                d = b & (ob | pb),
                e = this.attrTest(a);
            return d && (c & Ha || !e) ? b | sb : d || e ? c & Ga ? b | qb : b & ob ? b | pb : ob : tb
        }
    }), i(ba, aa, {
        defaults: { event: "pan", threshold: 10, pointers: 1, direction: Pa },
        getTouchAction: function() {
            var a = this.options.direction,
                b = [];
            return a & Na && b.push(lb), a & Oa && b.push(kb), b
        },
        directionTest: function(a) {
            var b = this.options,
                c = !0,
                d = a.distance,
                e = a.direction,
                f = a.deltaX,
                g = a.deltaY;
            return e & b.direction || (b.direction & Na ? (e = 0 === f ? Ia : 0 > f ? Ja : Ka, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Ia : 0 > g ? La : Ma, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction
        },
        attrTest: function(a) {
            return aa.prototype.attrTest.call(this, a) && (this.state & ob || !(this.state & ob) && this.directionTest(a))
        },
        emit: function(a) {
            this.pX = a.deltaX, this.pY = a.deltaY;
            var b = $(a.direction);
            b && (a.additionalEvent = this.options.event + b), this._super.emit.call(this, a)
        }
    }), i(ca, aa, {
        defaults: { event: "pinch", threshold: 0, pointers: 2 },
        getTouchAction: function() {
            return [jb]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & ob)
        },
        emit: function(a) {
            if (1 !== a.scale) {
                var b = a.scale < 1 ? "in" : "out";
                a.additionalEvent = this.options.event + b
            }
            this._super.emit.call(this, a)
        }
    }), i(da, Y, {
        defaults: { event: "press", pointers: 1, time: 251, threshold: 9 },
        getTouchAction: function() {
            return [hb]
        },
        process: function(a) {
            var b = this.options,
                c = a.pointers.length === b.pointers,
                d = a.distance < b.threshold,
                f = a.deltaTime > b.time;
            if (this._input = a, !d || !c || a.eventType & (Ga | Ha) && !f) this.reset();
            else if (a.eventType & Ea) this.reset(), this._timer = e(function() { this.state = rb, this.tryEmit() }, b.time, this);
            else if (a.eventType & Ga) return rb;
            return tb
        },
        reset: function() { clearTimeout(this._timer) },
        emit: function(a) { this.state === rb && (a && a.eventType & Ga ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = ra(), this.manager.emit(this.options.event, this._input))) }
    }), i(ea, aa, {
        defaults: { event: "rotate", threshold: 0, pointers: 2 },
        getTouchAction: function() {
            return [jb]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & ob)
        }
    }), i(fa, aa, {
        defaults: { event: "swipe", threshold: 10, velocity: .3, direction: Na | Oa, pointers: 1 },
        getTouchAction: function() {
            return ba.prototype.getTouchAction.call(this)
        },
        attrTest: function(a) {
            var b, c = this.options.direction;
            return c & (Na | Oa) ? b = a.overallVelocity : c & Na ? b = a.overallVelocityX : c & Oa && (b = a.overallVelocityY), this._super.attrTest.call(this, a) && c & a.offsetDirection && a.distance > this.options.threshold && a.maxPointers == this.options.pointers && qa(b) > this.options.velocity && a.eventType & Ga
        },
        emit: function(a) {
            var b = $(a.offsetDirection);
            b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a)
        }
    }), i(ga, Y, {
        defaults: { event: "tap", pointers: 1, taps: 1, interval: 300, time: 250, threshold: 9, posThreshold: 10 },
        getTouchAction: function() {
            return [ib]
        },
        process: function(a) {
            var b = this.options,
                c = a.pointers.length === b.pointers,
                d = a.distance < b.threshold,
                f = a.deltaTime < b.time;
            if (this.reset(), a.eventType & Ea && 0 === this.count) return this.failTimeout();
            if (d && f && c) {
                if (a.eventType != Ga) return this.failTimeout();
                var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0,
                    h = !this.pCenter || H(this.pCenter, a.center) < b.posThreshold;
                this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, this._input = a;
                var i = this.count % b.taps;
                if (0 === i) return this.hasRequireFailures() ? (this._timer = e(function() { this.state = rb, this.tryEmit() }, b.interval, this), ob) : rb
            }
            return tb
        },
        failTimeout: function() {
            return this._timer = e(function() { this.state = tb }, this.options.interval, this), tb
        },
        reset: function() { clearTimeout(this._timer) },
        emit: function() { this.state == rb && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input)) }
    }), ha.VERSION = "2.0.8", ha.defaults = {
        domEvents: !1,
        touchAction: gb,
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [
            [ea, { enable: !1 }],
            [ca, { enable: !1 },
                ["rotate"]
            ],
            [fa, { direction: Na }],
            [ba, { direction: Na },
                ["swipe"]
            ],
            [ga],
            [ga, { event: "doubletap", taps: 2 },
                ["tap"]
            ],
            [da]
        ],
        cssProps: { userSelect: "none", touchSelect: "none", touchCallout: "none", contentZooming: "none", userDrag: "none", tapHighlightColor: "rgba(0,0,0,0)" }
    };
    var ub = 1,
        vb = 2;
    ia.prototype = {
        set: function(a) {
            return la(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this
        },
        stop: function(a) { this.session.stopped = a ? vb : ub },
        recognize: function(a) {
            var b = this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var c, d = this.recognizers,
                    e = b.curRecognizer;
                (!e || e && e.state & rb) && (e = b.curRecognizer = null);
                for (var f = 0; f < d.length;) c = d[f], b.stopped === vb || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (ob | pb | qb) && (e = b.curRecognizer = c), f++
            }
        },
        get: function(a) {
            if (a instanceof Y) return a;
            for (var b = this.recognizers, c = 0; c < b.length; c++)
                if (b[c].options.event == a) return b[c];
            return null
        },
        add: function(a) {
            if (f(a, "add", this)) return this;
            var b = this.get(a.options.event);
            return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a
        },
        remove: function(a) {
            if (f(a, "remove", this)) return this;
            if (a = this.get(a)) {
                var b = this.recognizers,
                    c = r(b, a); - 1 !== c && (b.splice(c, 1), this.touchAction.update())
            }
            return this
        },
        on: function(a, b) {
            if (a !== d && b !== d) {
                var c = this.handlers;
                return g(q(a), function(a) { c[a] = c[a] || [], c[a].push(b) }), this
            }
        },
        off: function(a, b) {
            if (a !== d) {
                var c = this.handlers;
                return g(q(a), function(a) { b ? c[a] && c[a].splice(r(c[a], b), 1) : delete c[a] }), this
            }
        },
        emit: function(a, b) {
            this.options.domEvents && ka(a, b);
            var c = this.handlers[a] && this.handlers[a].slice();
            if (c && c.length) {
                b.type = a, b.preventDefault = function() { b.srcEvent.preventDefault() };
                for (var d = 0; d < c.length;) c[d](b), d++
            }
        },
        destroy: function() { this.element && ja(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null }
    }, la(ha, { INPUT_START: Ea, INPUT_MOVE: Fa, INPUT_END: Ga, INPUT_CANCEL: Ha, STATE_POSSIBLE: nb, STATE_BEGAN: ob, STATE_CHANGED: pb, STATE_ENDED: qb, STATE_RECOGNIZED: rb, STATE_CANCELLED: sb, STATE_FAILED: tb, DIRECTION_NONE: Ia, DIRECTION_LEFT: Ja, DIRECTION_RIGHT: Ka, DIRECTION_UP: La, DIRECTION_DOWN: Ma, DIRECTION_HORIZONTAL: Na, DIRECTION_VERTICAL: Oa, DIRECTION_ALL: Pa, Manager: ia, Input: x, TouchAction: V, TouchInput: P, MouseInput: L, PointerEventInput: M, TouchMouseInput: R, SingleTouchInput: N, Recognizer: Y, AttrRecognizer: aa, Tap: ga, Pan: ba, Swipe: fa, Pinch: ca, Rotate: ea, Press: da, on: m, off: n, each: g, merge: ta, extend: sa, assign: la, inherit: i, bindFn: j, prefixed: u });
    var wb = "undefined" != typeof a ? a : "undefined" != typeof self ? self : {};
    wb.Hammer = ha, "function" == typeof define && define.amd ? define('Hammer', [], function() {
        return ha
    }) : "undefined" != typeof module && module.exports ? module.exports = ha : a[c] = ha
}(window, document, "Hammer");

(function(window) {
    document.body.addEvent('keydown', function backKey(e) {
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code === 27 && pd.log.heap.length > 0) pd.log.pop();
        return false;
    });
    var templates = {
        dialog: "<article id='$id$' out='out-top' clean='$clean$'>" +
            "<header><li><label><i class='$label$'></i></label>" +
            "<h1>$title$</h1></li></header>" +
            "<content></content>" +
            "<footer>" +
            "<button type='pos' evnt='submit'>OK</button>" +
            "</footer>" +
            "</article>",
        checkItem: "<li class='blink-theme' evnt='check' id='$id$'>" +
            "<em>$value$</em>" +
            "<pre>$secondary$</pre>" +
            "<label type='switch' checked='$checked$'>" +
            "<i class='fa fa-square-o'></i>" +
            "<i class='fa fa-check-square'></i>" +
            "</label>" +
            "</li>",
        radioItem: "<li class='blink-theme' evnt='radio' id='$id$'>" +
            "<em>$value$</em>" +
            "<pre>$secondary$</pre>" +
            "<label type='switch' checked='$checked$'>" +
            "<i class='fa fa-circle-o'></i>" +
            "<i class='fa fa-dot-circle-o'></i>" +
            "</label>" +
            "</li>",
        inputItem: "<li evnt='none'>" +
            "<input autocomplete='off' value='$value$' type='$type$' placeholder='$placeholder$'>" +
            "<button evnt='clear'><i class='fa fa-times-circle'></i></button>" +
            "</li>",
        menu: "<article id='$id$' out='out-top' clean='$clean$'>" +
            "<header><li>" +
            "<label><i class='fa fa-user'></i></label>" +
            "<h1>$title$</h1></li>" +
            "</header>" +
            "<content></content>" +
            "</article>",
        aside: "<aside id='$id$' out='out-left' clean='$clean$'>" +
            "<div>" +
            "<clip><img src='$img$'></clip>" +
            "</div>" +
            "<content></content>" +
            "</aside>",
        asideNoImg: "<aside id='$id$' out='out-left' clean='$clean$'>" +
            "<content></content>" +
            "</aside>",
        hrefItem: "<li id='$id$' evnt='href' class='blink-wave'>" +
            // "<label><i class='$label$'></i></label>" +
            "<em>$value$</em><pre>$secondary$</pre>" +
            "<label><i class='fa fa-angle-right'></i></label>" +
            "</li>",
        login: "<dialog id='$id$' out='out-top'  clean='$clean$'>" +
            "<ul>" +
            "<header><label><i class='fa fa-user'></i></label><h1>$title$</h1></header>" +
            "<li>" +
            "<input id='username' placeholder='邮箱'/>" +
            "<button evnt='clear'><i class='fa fa-times-circle'></i></button>" +
            "</li>" +
            "<li>" +
            "<input id='password' placeholder='密码' type='password'/>" +
            "<button id='forgetPwd'>忘记密码</button>" +
            "</li>" +
            "</ul>" +
            "<ul><button type='pos' id='loginBtn'>登录</button></ul>" +
            "<ul><button type='pos' id='signupBtn'>注册</button></ul>" +
            "</dialog>",
        confirm: "<dl class='confirm' id='$id$' out='out-top' clean='$clean$'>" +
            "<dt>" +
            "<h1>$title$</h1>" +
            "</dt>" +
            "<dd>" +
            "<button res='false' type='neg' evnt='confirm'>取消</button>" +
            "</dd>" +
            "<dd>" +
            "<button res='true' type='pos' evnt='confirm'>确认</button>" +
            "</dd>" +
            "</dl>",
        modal: "<modal></modal>",
        date: "<mask id='$id$' evnt='mask'>" +
            "<dialog id='_dtPicker' out='out-top' clean='$clean$'>" +
            "<div class='_dtIndicator'>" +
            "<div class='_indiYear'>2015</div>" +
            "<div>" +
            "<span class='_indiMonth'>06</span><span>月</span>" +
            "</div>" +
            "<div class='_indiCtrl'>" +
            "<a class='_addYear' evnt='addYear'>&gt;</a>" +
            "<a class='_minYear' evnt='minYear'>&lt;</a>" +
            "<a class='_addMonth'evnt='addMonth'>&gt;</a>" +
            "<a class='_minMonth' evnt='minMonth'>&lt;</a>" +
            "</div>" +
            "</div>" +
            "<ol class='_dtTitle'>" +
            "<pre>日</pre>" +
            "<pre>一</pre>" +
            "<pre>二</pre>" +
            "<pre>三</pre>" +
            "<pre>四</pre>" +
            "<pre>五</pre>" +
            "<pre>六</pre>" +
            "</ol>" +
            "<div class='_dtPlate'></div>" +
            "<li>" +
            "<button type='neg' evnt='neg'>取消</button>" +
            "<button type='pos' evnt='pos'>确认</button>" +
            "</li>" +
            "</dialog>" +
            "</mask>",
        dateSlct: "<section id='$id$' class='_dtPicker' out='out-top' clean='$clean$'>" +
            "<div class='_dtIndicator'>" +
            "<div class='_indiYear'>2015</div>" +
            "<div>" +
            "<span class='_indiMonth'>06</span><span>月</span>" +
            "</div>" +
            "<div class='_indiCtrl'>" +
            "<a class='_addYear' evnt='addYear'>&gt;</a>" +
            "<a class='_minYear' evnt='minYear'>&lt;</a>" +
            "<a class='_addMonth'evnt='addMonth'>&gt;</a>" +
            "<a class='_minMonth' evnt='minMonth'>&lt;</a>" +
            "</div>" +
            "</div>" +
            "<ol class='_dtTitle'>" +
            "<pre>日</pre>" +
            "<pre>一</pre>" +
            "<pre>二</pre>" +
            "<pre>三</pre>" +
            "<pre>四</pre>" +
            "<pre>五</pre>" +
            "<pre>六</pre>" +
            "</ol>" +
            "<div class='_dtPlate'></div>" +
            "</section>",
        dateFull: "<section id='$id$' class='_dtPicker' out='out-top' clean='$clean$'>" +
            "<div class='_dtIndicator'>" +
            "<div class='_indiYear'>2015</div>" +
            "<div>" +
            "<span class='_indiMonth'>06</span><span>月</span>" +
            "</div>" +
            "<div class='_indiCtrl'>" +
            "<a class='_addYear' evnt='addYear'>&gt;</a>" +
            "<a class='_minYear' evnt='minYear'>&lt;</a>" +
            "<a class='_addMonth'evnt='addMonth'>&gt;</a>" +
            "<a class='_minMonth' evnt='minMonth'>&lt;</a>" +
            "</div>" +
            "</div>" +
            "<ol class='_dtTitle'>" +
            "<pre>日</pre>" +
            "<pre>一</pre>" +
            "<pre>二</pre>" +
            "<pre>三</pre>" +
            "<pre>四</pre>" +
            "<pre>五</pre>" +
            "<pre>六</pre>" +
            "</ol>" +
            "<div class='_dtPlate'></div>" +
            "</section>",
    };

    var getTemplates = function(type) {
        var dialog = '',
            item = '';
        switch (type) {
            case 'radio':
                dialog = templates.dialog;
                item = templates.radioItem;
                break;
            case 'check':
                dialog = templates.dialog;
                item = templates.checkItem;
                break;
            case 'input':
                dialog = templates.dialog;
                item = templates.inputItem;
                break;
            case 'menu':
                dialog = templates.menu;
                item = templates.hrefItem;
                break;
            case 'aside':
                dialog = templates.aside;
                item = templates.hrefItem;
                break;
            case 'asideNoImg':
                dialog = templates.asideNoImg;
                item = templates.hrefItem;
                break;
            case 'login':
                dialog = templates.login;
                break;
            case 'confirm':
                dialog = templates.confirm;
                break;
            case 'date':
                dialog = templates.date;
                break;
            case 'dateSlct':
                dialog = templates.dateSlct;
                break;
            case 'dateFull':
                dialog = templates.dateSlct;
                break;
        }
        return { dialog: dialog, item: item };
    };
    var Presenter = function(init) {
        this.id = pd.randId(4);
        this.title = init.title;
        this.type = init.type;
        this.checked = init.checked || '';
        this.data = init.data || [];
        this.onOut = init.onOut || function() {};
        var dlg = pd.compose(init, getTemplates(this.type).dialog);
        var mask = document.createElement('mask');
        mask.id = this.id;
        mask.className = "mask"
        mask.setAttribute('evnt', 'mask');
        mask.appendChild(dlg);
        document.body.appendChild(mask);
        mask.style.display = 'none';
        if (init.data) this.setData(init.data);
        if (this.checked && pd.id(this.checked)) pd.id(this.checked).setAttribute('checked', true);
        var self = this;
        pd.ontap(function(name, target) {
            submit.call(self, name, target);
        }, mask);
    };
    Presenter.prototype.setData = function(data) {
        this.data = data;
        var con = pd.find('content', this.id);
        var list = pd.compose(data, getTemplates(this.type).item);
        con.appendChild(list);
    };
    Presenter.prototype.show = function() {
        pd.log.in(this.id);
    };
    var submit = function(name, target) {
        var res = null;
        switch (name) {
            case 'check':
                var toggle = pd.find('label', target);
                var flag = (toggle.getAttribute('checked') == 'true') ? false : true;
                toggle.setAttribute('checked', flag);
                break;
            case 'radio':
                var list = target.parentNode;
                list = pd.findAll('label', list);
                for (var i = list.length - 1; i >= 0; i--) {
                    list[i].setAttribute('checked', false);
                }
                var toggle = pd.find('label', target);
                var flag = (toggle.getAttribute('checked') == 'true') ? false : true;
                toggle.setAttribute('checked', flag);
                break;
            case 'clear':
                var input = pd.find('input', target.parentNode);
                input.value = '';
                break;
            case 'submit':
                if (this.type == 'radio' || this.type == 'check') {
                    var list = pd.findAll('label', this.id);
                    var txtArr = [],
                        idArr = [],
                        id, em;
                    for (var i = list.length - 1; i >= 0; i--) {
                        if (list[i].getAttribute('checked') == 'true') {
                            id = list[i].parentNode.id;
                            em = pd.find('em', list[i].parentNode).innerHTML;
                            idArr.push(id);
                            txtArr.push(em);
                        };
                    }
                    res = { idArr: idArr, txtArr: txtArr };
                } else if (this.type == 'input') {
                    var res = pd.find('input', this.id).value;
                }
                this.onOut(res);
                pd.log.pop();
                break;
            case 'confirm':
                res = (target.getAttribute('res') == 'true') ? true : false;
                this.onOut(res);
                pd.log.pop();
                break;
            case 'href':
                console.log(target);
                res = target.id;
                this.onOut(res);
                pd.log.pop();
                break;
            case 'mask':
                pd.log.pop();
                break;
            default:
                return;
        }
    };
    /*
        name： 模态Modal
        style：全屏的覆盖
        template： 用户自定义
        value： 用户自定义
    */
    var Modal = function(init) {
        this.id = pd.randId(4);
        this.data = init.data;
        this.template = init.template;
        this.tapHandler = init.tapHandler;
        var dom = pd.compose(this.data, this.template);
        var mdl = document.createElement('modal');
        mdl.setAttribute('out', 'out-bottom');
        mdl.setAttribute('clean', init.clean);
        mdl.id = this.id;
        mdl.style.display = 'none';
        mdl.appendChild(dom);
        document.body.appendChild(mdl);
        var article = pd.find('content', this.id);
        this.scrollHandler = new Scroller(article);
        pd.ontap(this.tapHandler, mdl);
    };
    Modal.prototype.show = function() {
        pd.id(this.id).style.display = 'block';
        pd.log.in(this.id);
        this.scrollHandler.refresh();
    };
    Modal.prototype.out = function() {
        pd.log.pop();
    };

    var Aside = function(init) {
        this.tapHandler = init.tapHandler;
        this.dom = init;
        this.clean = true;
        this.checked = init.checked;
    }
    Aside.prototype.show = function() {
        this.id = pd.randId(4);
        var mask = document.createElement('mask');
        mask.id = this.id;
        mask.setAttribute('evnt', 'mask');
        mask.style.display = 'none';
        mask.appendChild(this.dom);
        document.body.appendChild(mask);
        var self = this;
        pd.ontap(function(name) {
            submit.call(self, name);
        }, mask);
        pd.id(this.id).style.display = 'block';
        pd.log.in(this.id);
    };
    Aside.prototype.out = function() {
        document.body.appendChild(this.dom);
        pd.log.pop();
    };

    /*
        日期选择器
    */

    var DatePicker = function(init) {
        this.id = pd.randId(4);
        Hammer.assign(this, init);

        if (this.maxDate) { this.maxDate = new Date(init.maxDate); }
        if (this.minDate) { this.minDate = new Date(init.minDate); }
        var tmp = getTemplates(this.type).dialog;
        document.body.appendChild(pd.compose(this, tmp));

        this.dlg = pd.id(this.id);
        this.dlg.style.display = 'none';
        this.nowArr = dateToArr(new Date());
        this.slctArr = (this.ele.value) ? dateToArr(new Date(this.ele.value)) : this.nowArr;
        var self = this;
        pd.ontap(function(name) {
            self.evHandler.call(self, name);
        }, self.dlg);
        this.layDate(this.slctArr);
    };
    DatePicker.prototype.show = function(ele) {
        this.dlg.style.display = 'block';
        ele.insertBefore(this.dlg, ele.children[0]);
    }
    DatePicker.prototype.out = function(res) {
        this.dlg.style.display = 'none';
        if (this.onOut) this.onOut(res);
    };
    DatePicker.prototype.evHandler = function(name) {
        var ctrlDr, slctArr = this.slctArr;
        switch (name) {
            case 'pos':
                var res = slctArr[0] + '-' + (slctArr[1] + 1) + '-' + slctArr[2];
                this.out(res);
                break;
            case 'neg':
            case 'mask':
                this.out(null);
                break;
            case 'addYear':
                slctArr[0]++;
                ctrlDr = "isAdd";
                this.layDate(slctArr);
                break;
            case 'minYear':
                slctArr[0]--;
                ctrlDr = "isMin";
                this.layDate(slctArr);
            case 'addMonth':
                this.addMonth();
                break;
            case 'minMonth':
                this.minMonth();
                break;
            case 'day':
                if (target.getAttribute('disabled') == 'disabled') return;
                slctArr[2] = parseInt(target.innerHTML, 10);
                var dateArr = this.dlg.getElementsByTagName('a');
                for (var i = dateArr.length - 1; i >= 0; i--) {
                    dateArr[i].removeAttribute('select');
                }
                target.setAttribute('select', 'select');
                var res = [slctArr[0], (slctArr[1] + 1), slctArr[2]];
                if (this.onOut) this.onOut(res);
                break;
        }
    };
    DatePicker.prototype.addMonth = function() {
        var slctArr = this.slctArr;
        slctArr[1]++;
        if (slctArr[1] > 11) {
            slctArr[1] = 0;
            slctArr[0]++;
        }
        if (this.onChange) this.onChange(slctArr);
        this.layDate(slctArr);
    };
    DatePicker.prototype.minMonth = function() {
        var slctArr = this.slctArr;
        slctArr[1]--;
        if (slctArr[1] < 0) {
            slctArr[1] = 11;
            slctArr[0]--;
        }
        if (this.onChange) this.onChange(slctArr);
        this.layDate(slctArr);
    };
    DatePicker.prototype.layDate = function(date) {
        var min = this.minDate,
            max = this.maxDate,
            now = this.nowArr,
            slct = this.slctArr,
            plate = pd.find('._dtPlate', this.id);
        plate.innerHTML = '';
        this.checkDate(date);
        //加日期
        var str,
            i = 1,
            a1,
            a2 = (date[1] + 1 < 10) ? ('0' + (date[1] + 1)) : (date[1] + 1),
            a3,
            isToday = (date[0] == now[0] && date[1] == now[1]),
            isSlct = (date[0] == slct[0] && date[1] == slct[1]);
        for (; i < 32; i++) {
            // 设置范围
            a3 = (i < 10) ? ('0' + i) : i;
            str = parseISO8601(date[0] + '-' + a2 + '-' + a3);
            if (str.getDate() != i) break; // 判断有效

            var tag = document.createElement('a');
            tag.innerHTML = i;
            tag.setAttribute('evnt', 'day');
            tag.setAttribute('alt', i);
            if ((min && str < min) || (max && str > max)) tag.setAttribute('disabled', 'disabled');
            if (isToday && now[2] == i) tag.setAttribute('today', 'today');
            if (isSlct && i == slct[2]) tag.setAttribute('select', 'select');
            if (i == 1) tag.style.marginLeft = str.getDay() * 14.28 + '%';
            plate.appendChild(tag);
        }
        pd.find('._indiYear').innerHTML = slct[0];
        pd.find('._indiMonth').innerHTML = slct[1] + 1;
    }
    DatePicker.prototype.checkDate = function(date) {
        var min = this.minDate,
            max = this.maxDate,
            dlg = pd.find('._dtPicker'),
            ctrlDr = 'static';

        var layDt = new Date(date[0] + '-' + (date[1] + 1) + '-' + date[2]);
        // 最小天数
        if (!min) {
            dlg.setAttribute('ctrl', 'y_on_m_on');
        } else if (layDt < min) {
            date = dateToArr(min);
            dlg.setAttribute('ctrl', 'y_off_m_off');
            if (ctrlDr == 'isMin') dtPicker.animEle(dlg, '_denyAnim', 200);
        } else if (date[0] == min.getFullYear() && date[1] >= (min.getMonth() - 1)) {
            dlg.setAttribute('ctrl', 'y_off_m_on');
        }

        // 最大日期判断
        if (!max) {
            dlg.setAttribute('ctrl', 'y_yes_m_yes');
        } else if (layDt > max) {
            date = dateToArr(max);
            dlg.setAttribute('ctrl', 'y_no_m_no');
            if (ctrlDr == 'isAdd') dtPicker.animEle(dlg, '_denyAnim', 200);
        } else if (date[0] == max.getFullYear() && date[1] <= max.getMonth()) {
            dlg.setAttribute('ctrl', 'y_no_m_yes');
        }
    }

    function dateToArr(day) {
        return [day.getFullYear(), day.getMonth(), day.getDate()];
    }

    function parseISO8601(dateStringInRange) {
        var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
            date = new Date(NaN),
            month, parts = isoExp.exec(dateStringInRange);
        if (parts) {
            month = +parts[2];
            date.setFullYear(parts[1], month - 1, parts[3]);
            if (month != date.getMonth() + 1) {
                date.setTime(NaN);
            }
        }
        return date;
    }

    Presenter.DatePicker = DatePicker;
    Presenter.Modal = Modal;
    Presenter.Aside = Aside;

    if (typeof module != 'undefined' && module.exports) {
        module.exports = Presenter;
    } else if (typeof define == 'function' && define.amd) {
        define('Presenter', [], function() {
            return Presenter;
        });
    } else {
        window.Presenter = Presenter;
    }
})(window);
