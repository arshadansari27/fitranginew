!function (la) {
    if ("object" == typeof exports)module.exports = la(); else if ("function" == typeof define && define.amd)define(la); else {
        var h;
        "undefined" != typeof window ? h = window : "undefined" != typeof global ? h = global : "undefined" != typeof self && (h = self);
        h.autobahn = la()
    }
}(function () {
    return function h(p, k, b) {
        function a(d, e) {
            if (!k[d]) {
                if (!p[d]) {
                    var q = "function" == typeof require && require;
                    if (!e && q)return q(d, !0);
                    if (c)return c(d, !0);
                    throw Error("Cannot find module '" + d + "'");
                }
                q = k[d] = {exports: {}};
                p[d][0].call(q.exports, function (c) {
                    var n = p[d][1][c];
                    return a(n ? n : c)
                }, q, q.exports, h, p, k, b)
            }
            return k[d].exports
        }

        for (var c = "function" == typeof require && require, e = 0; e < b.length; e++)a(b[e]);
        return a
    }({1: [function (h, p, k) {
        function b() {
        }

        h = p.exports = {};
        h.nextTick = function () {
            if ("undefined" !== typeof window && window.setImmediate)return function (a) {
                return window.setImmediate(a)
            };
            if ("undefined" !== typeof window && window.postMessage && window.addEventListener) {
                var a = [];
                window.addEventListener("message", function (c) {
                    var b = c.source;
                    b !== window && null !== b || "process-tick" !== c.data || (c.stopPropagation(), 0 < a.length && a.shift()())
                }, !0);
                return function (c) {
                    a.push(c);
                    window.postMessage("process-tick", "*")
                }
            }
            return function (a) {
                setTimeout(a, 0)
            }
        }();
        h.title = "browser";
        h.browser = !0;
        h.env = {};
        h.argv = [];
        h.on = b;
        h.once = b;
        h.off = b;
        h.emit = b;
        h.binding = function (a) {
            throw Error("process.binding is not supported");
        };
        h.cwd = function () {
            return"/"
        };
        h.chdir = function (a) {
            throw Error("process.chdir is not supported");
        }
    }, {}], 2: [function (h, p, k) {
        var b = h("crypto-js");
        k.sign = function (a, c) {
            return b.HmacSHA256(c, a).toString(b.enc.Base64)
        };
        k.derive_key = function (a, c, e, d) {
            return b.PBKDF2(a, c, {keySize: (d || 32) / 4, iterations: e || 1E3, hasher: b.algo.SHA256}).toString(b.enc.Base64)
        }
    }, {"crypto-js": 28}], 3: [function (h, p, k) {
        h("when");
        h("when/function");
        k.auth = function (b, a, c) {
            var e = b.defer();
            navigator.id.watch({loggedInUser: a, onlogin: function (a) {
                e.resolve(a)
            }, onlogout: function () {
                b.leave("wamp.close.logout")
            }});
            return e.promise.then ? e.promise : e
        }
    }, {when: 77, "when/function": 54}], 4: [function (h, p, k) {
        var b = "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {};
        h("./polyfill.js");
        p = h("../package.json");
        var a = h("when");
        "AUTOBAHN_DEBUG"in b && AUTOBAHN_DEBUG && (h("when/monitor/console"), "console"in b && console.log("AutobahnJS debug enabled"));
        var b = h("./util.js"), c = h("./log.js"), e = h("./session.js"), d = h("./connection.js"), m = h("./configure.js"), q = h("./auth/persona.js");
        h = h("./auth/cra.js");
        k.version = p.version;
        k.transports = m.transports;
        k.Connection = d.Connection;
        k.Session = e.Session;
        k.Invocation = e.Invocation;
        k.Event = e.Event;
        k.Result = e.Result;
        k.Error = e.Error;
        k.Subscription = e.Subscription;
        k.Registration = e.Registration;
        k.Publication = e.Publication;
        k.auth_persona = q.auth;
        k.auth_cra = h;
        k.when = a;
        k.util = b;
        k.log = c
    }, {"../package.json": 79, "./auth/cra.js": 2, "./auth/persona.js": 3, "./configure.js": 5, "./connection.js": 6, "./log.js": 7, "./polyfill.js": 8, "./session.js": 16, "./util.js": 19, when: 77, "when/monitor/console": 75}], 5: [function (h, p, k) {
        function b() {
            this._repository = {}
        }

        b.prototype.register = function (a, b) {
            this._repository[a] = b
        };
        b.prototype.isRegistered = function (a) {
            return this._repository[a] ? !0 : !1
        };
        b.prototype.get = function (a) {
            if (void 0 !== this._repository[a])return this._repository[a];
            throw"no such transport: " + a;
        };
        b.prototype.list = function () {
            var a = [], b;
            for (b in this._repository)a.push(b);
            return a
        };
        p = new b;
        var a = h("./transport/websocket.js");
        p.register("websocket", a.Factory);
        h = h("./transport/longpoll.js");
        p.register("longpoll", h.Factory);
        k.transports = p
    }, {"./transport/longpoll.js": 17, "./transport/websocket.js": 18}], 6: [function (h, p, k) {
        (function (b) {
            var a = h("when"), c = h("./session.js"), e = h("./util.js"), d = h("./log.js"), m = h("./autobahn.js"), q = function (c) {
                (this._options = c) && c.use_es6_promises ? "Promise"in b ? this._defer = function () {
                    var a = {};
                    a.promise = new Promise(function (c, g) {
                        a.resolve = c;
                        a.reject = g
                    });
                    return a
                } : (d.debug("Warning: ES6 promises requested, but not found! Falling back to whenjs."), this._defer = a.defer) : this._defer = c && c.use_deferred ? c.use_deferred : a.defer;
                this._options.transports || (this._options.transports = [
                    {type: "websocket", url: this._options.url}
                ]);
                this._transport_factories = [];
                this._init_transport_factories();
                this._session_close_message = this._session_close_reason = this._session = null;
                this._retry_if_unreachable = void 0 !== this._options.retry_if_unreachable ? this._options.retry_if_unreachable : !0;
                this._max_retries = this._options.max_retries || 15;
                this._initial_retry_delay = this._options.initial_retry_delay || 1.5;
                this._max_retry_delay = this._options.max_retry_delay || 300;
                this._retry_delay_growth = this._options.retry_delay_growth || 1.5;
                this._retry_delay_jitter = this._options.retry_delay_jitter || 0.1;
                this._connect_successes = 0;
                this._retry = !1;
                this._retry_count = 0;
                this._retry_delay = this._initial_retry_delay;
                this._is_retrying = !1;
                this._retry_timer = null
            };
            q.prototype._create_transport = function () {
                for (var a = 0; a < this._transport_factories.length; ++a) {
                    var c = this._transport_factories[a];
                    d.debug("trying to create WAMP transport of type: " + c.type);
                    try {
                        var l = c.create();
                        if (l)return d.debug("using WAMP transport type: " + c.type), l
                    } catch (b) {
                        d.debug("could not create WAMP transport '" +
                            c.type + "': " + b)
                    }
                }
                return null
            };
            q.prototype._init_transport_factories = function () {
                var a, c, l;
                e.assert(this._options.transports, "No transport.factory specified");
                for (var b = 0; b < this._options.transports.length; ++b) {
                    a = this._options.transports[b];
                    a.url || (a.url = this._options.url);
                    a.protocols || (a.protocols = this._options.protocols);
                    e.assert(a.type, "No transport.type specified");
                    e.assert("string" === typeof a.type, "transport.type must be a string");
                    try {
                        if (l = m.transports.get(a.type))c = new l(a), this._transport_factories.push(c)
                    } catch (d) {
                        console.error(d)
                    }
                }
            };
            q.prototype._autoreconnect_reset_timer = function () {
                this._retry_timer && clearTimeout(this._retry_timer);
                this._retry_timer = null
            };
            q.prototype._autoreconnect_reset = function () {
                this._autoreconnect_reset_timer();
                this._retry_count = 0;
                this._retry_delay = this._initial_retry_delay;
                this._is_retrying = !1
            };
            q.prototype._autoreconnect_advance = function () {
                this._retry_delay_jitter && (this._retry_delay = e.rand_normal(this._retry_delay, this._retry_delay * this._retry_delay_jitter));
                this._retry_delay > this._max_retry_delay && (this._retry_delay = this._max_retry_delay);
                this._retry_count += 1;
                var a;
                a = this._retry && this._retry_count <= this._max_retries ? {count: this._retry_count, delay: this._retry_delay, will_retry: !0} : {count: null, delay: null, will_retry: !1};
                this._retry_delay_growth && (this._retry_delay *= this._retry_delay_growth);
                return a
            };
            q.prototype.open = function () {
                function a() {
                    b._transport = b._create_transport();
                    if (b._transport)b._session = new c.Session(b._transport, b._defer, b._options.onchallenge), b._session_close_reason = null, b._session_close_message = null, b._transport.onopen = function () {
                        b._autoreconnect_reset();
                        b._connect_successes += 1;
                        b._session.join(b._options.realm, b._options.authmethods, b._options.authid)
                    }, b._session.onjoin = function (a) {
                        if (b.onopen)try {
                            b.onopen(b._session, a)
                        } catch (c) {
                            d.debug("Exception raised from app code while firing Connection.onopen()", c)
                        }
                    }, b._session.onleave = function (a, c) {
                        b._session_close_reason = a;
                        b._session_close_message = c.message || "";
                        b._retry = !1;
                        b._transport.close(1E3)
                    }, b._transport.onclose = function (c) {
                        b._autoreconnect_reset_timer();
                        var e = b._transport = null;
                        0 === b._connect_successes ? (e = "unreachable", b._retry_if_unreachable || (b._retry = !1)) : e = c.wasClean ? "closed" : "lost";
                        c = b._autoreconnect_advance();
                        if (b.onclose) {
                            var m = {reason: b._session_close_reason, message: b._session_close_message, retry_delay: c.delay, retry_count: c.count, will_retry: c.will_retry};
                            try {
                                var q = b.onclose(e, m)
                            } catch (v) {
                                d.debug("Exception raised from app code while firing Connection.onclose()", v)
                            }
                        }
                        b._session && (b._session._id = null, b._session = null, b._session_close_reason = null, b._session_close_message = null);
                        b._retry && !q && (c.will_retry ? (b._is_retrying = !0, d.debug("retrying in " + c.delay + " s"), b._retry_timer = setTimeout(a, 1E3 * c.delay)) : d.debug("giving up trying to reconnect"))
                    }; else if (b._retry = !1, b.onclose)b.onclose("unsupported", {reason: null, message: null, retry_delay: null, retry_count: null, will_retry: !1})
                }

                var b = this;
                if (b._transport)throw"connection already open (or opening)";
                b._autoreconnect_reset();
                b._retry = !0;
                a()
            };
            q.prototype.close = function (a, c) {
                if (!this._transport && !this._is_retrying)throw"connection already closed";
                this._retry = !1;
                this._session && this._session.isOpen ? this._session.leave(a, c) : this._transport && this._transport.close(1E3)
            };
            Object.defineProperty(q.prototype, "defer", {get: function () {
                return this._defer
            }});
            Object.defineProperty(q.prototype, "session", {get: function () {
                return this._session
            }});
            Object.defineProperty(q.prototype, "isOpen", {get: function () {
                return this._session && this._session.isOpen ? !0 : !1
            }});
            Object.defineProperty(q.prototype, "isConnected", {get: function () {
                return this._transport ? !0 : !1
            }});
            Object.defineProperty(q.prototype, "transport", {get: function () {
                return this._transport ? this._transport : {info: {type: "none", url: null, protocol: null}}
            }});
            Object.defineProperty(q.prototype, "isRetrying", {get: function () {
                return this._is_retrying
            }});
            k.Connection = q
        }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
    }, {"./autobahn.js": 4, "./log.js": 7, "./session.js": 16, "./util.js": 19, when: 77}], 7: [function (h, p, k) {
        (function (b) {
            var a = function () {
            };
            "AUTOBAHN_DEBUG"in b && AUTOBAHN_DEBUG && "console"in b && (a = function () {
                console.log.apply(console, arguments)
            });
            k.debug = a
        }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
    }, {}], 8: [function (h, p, k) {
        h("./polyfill/object");
        h("./polyfill/array");
        h("./polyfill/string");
        h("./polyfill/function");
        h("./polyfill/console");
        h("./polyfill/typedarray");
        h("./polyfill/json")
    }, {"./polyfill/array": 9, "./polyfill/console": 10, "./polyfill/function": 11, "./polyfill/json": 12, "./polyfill/object": 13, "./polyfill/string": 14, "./polyfill/typedarray": 15}], 9: [function (h, p, k) {
        "function" !== typeof Array.prototype.reduce && (Array.prototype.reduce = function (b) {
            var a, c, e, d;
            if (null === this || "undefined" === typeof this)throw new TypeError("Array.prototype.reduce called on null or undefined");
            if ("function" !== typeof b)throw new TypeError(b + " is not a function");
            c = Object(this);
            a = c.length >>> 0;
            d = 0;
            if (2 <= arguments.length)e = arguments[1]; else {
                for (; d < a && !d in c;)d++;
                if (d >= a)throw new TypeError("Reduce of empty array with no initial value");
                e = c[d++]
            }
            for (; d < a; d++)d in c && (e = b(e, c[d], d, c));
            return e
        });
        "indexOf"in Array.prototype || (Array.prototype.indexOf = function (b, a) {
            void 0 === a && (a = 0);
            0 > a && (a += this.length);
            0 > a && (a = 0);
            for (var c = this.length; a < c; a++)if (a in this && this[a] === b)return a;
            return-1
        });
        "lastIndexOf"in Array.prototype || (Array.prototype.lastIndexOf = function (b, a) {
            void 0 === a && (a = this.length - 1);
            0 > a && (a += this.length);
            a > this.length - 1 && (a = this.length - 1);
            for (a++; 0 < a--;)if (a in this && this[a] === b)return a;
            return-1
        });
        "forEach"in Array.prototype || (Array.prototype.forEach = function (b, a) {
            for (var c = 0, e = this.length; c < e; c++)c in this && b.call(a, this[c], c, this)
        });
        "map"in Array.prototype || (Array.prototype.map = function (b, a) {
            for (var c = Array(this.length), e = 0, d = this.length; e < d; e++)e in this && (c[e] = b.call(a, this[e], e, this));
            return c
        });
        "filter"in Array.prototype || (Array.prototype.filter = function (b, a) {
            for (var c = [], e, d = 0, m = this.length; d < m; d++)d in this && b.call(a, e = this[d], d, this) && c.push(e);
            return c
        });
        "every"in Array.prototype || (Array.prototype.every = function (b, a) {
            for (var c = 0, e = this.length; c < e; c++)if (c in this && !b.call(a, this[c], c, this))return!1;
            return!0
        });
        "some"in
        Array.prototype || (Array.prototype.some = function (b, a) {
            for (var c = 0, e = this.length; c < e; c++)if (c in this && b.call(a, this[c], c, this))return!0;
            return!1
        });
        "function" !== typeof Array.prototype.reduceRight && (Array.prototype.reduceRight = function (b) {
            if (null === this || "undefined" === typeof this)throw new TypeError("Array.prototype.reduce called on null or undefined");
            if ("function" !== typeof b)throw new TypeError(b + " is not a function");
            var a = Object(this), c = (a.length >>> 0) - 1, e;
            if (2 <= arguments.length)e = arguments[1]; else {
                for (; 0 <= c && !c in a;)c--;
                if (0 > c)throw new TypeError("Reduce of empty array with no initial value");
                e = a[c--]
            }
            for (; 0 <= c; c--)c in a && (e = b(e, a[c], c, a));
            return e
        })
    }, {}], 10: [function (h, p, k) {
        (function (b) {
            (function (a) {
                a || (a = window.console = {log: function (a, b, d, m, q) {
                }, info: function (a, b, d, m, q) {
                }, warn: function (a, b, d, m, q) {
                }, error: function (a, b, d, m, q) {
                }, assert: function (a, b) {
                }});
                "object" === typeof a.log && (a.log = Function.prototype.call.bind(a.log, a), a.info = Function.prototype.call.bind(a.info, a), a.warn = Function.prototype.call.bind(a.warn, a), a.error = Function.prototype.call.bind(a.error, a), a.debug = Function.prototype.call.bind(a.info, a));
                "group"in a || (a.group = function (b) {
                    a.info("\n--- " + b + " ---\n")
                });
                "groupEnd"in a || (a.groupEnd = function () {
                    a.log("\n")
                });
                "assert"in a || (a.assert = function (a, b) {
                    if (!a)try {
                        throw Error("assertion failed: " + b);
                    } catch (d) {
                        setTimeout(function () {
                            throw d;
                        }, 0)
                    }
                });
                "time"in a || function () {
                    var b = {};
                    a.time = function (a) {
                        b[a] = (new Date).getTime()
                    };
                    a.timeEnd = function (e) {
                        var d = (new Date).getTime();
                        a.info(e + ": " + (e in b ? d - b[e] : 0) + "ms")
                    }
                }()
            })(b.console)
        }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
    }, {}], 11: [function (h, p, k) {
        Function.prototype.bind || (Function.prototype.bind = function (b) {
            var a = this, c = Array.prototype.slice.call(arguments, 1);
            return function () {
                return a.apply(b, Array.prototype.concat.apply(c, arguments))
            }
        })
    }, {}], 12: [function (h, p, k) {
        "object" !== typeof JSON && (JSON = {});
        (function () {
            function b(a) {
                return 10 > a ? "0" + a : a
            }

            function a(a) {
                d.lastIndex = 0;
                return d.test(a) ? '"' + a.replace(d, function (a) {
                    var b = g[a];
                    return"string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + a + '"'
            }

            function c(b, g) {
                var d, e, v, y, H = m, f, x = g[b];
                x && "object" === typeof x && "function" === typeof x.toJSON && (x = x.toJSON(b));
                "function" === typeof n && (x = n.call(g, b, x));
                switch (typeof x) {
                    case"string":
                        return a(x);
                    case"number":
                        return isFinite(x) ? String(x) : "null";
                    case"boolean":
                    case"null":
                        return String(x);
                    case"object":
                        if (!x)return"null";
                        m += q;
                        f = [];
                        if ("[object Array]" === Object.prototype.toString.apply(x)) {
                            y = x.length;
                            for (d = 0; d < y; d += 1)f[d] = c(d, x) || "null";
                            v = 0 === f.length ? "[]" : m ? "[\n" + m + f.join(",\n" + m) + "\n" + H + "]" : "[" + f.join(",") + "]";
                            m = H;
                            return v
                        }
                        if (n && "object" === typeof n)for (y = n.length, d = 0; d < y; d += 1)"string" === typeof n[d] && (e = n[d], (v = c(e, x)) && f.push(a(e) + (m ? ": " : ":") + v)); else for (e in x)Object.prototype.hasOwnProperty.call(x, e) && (v = c(e, x)) && f.push(a(e) + (m ? ": " : ":") + v);
                        v = 0 === f.length ? "{}" : m ? "{\n" + m + f.join(",\n" + m) + "\n" + H + "}" : "{" + f.join(",") + "}";
                        m = H;
                        return v
                }
            }

            "function" !== typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + b(this.getUTCMonth() + 1) + "-" + b(this.getUTCDate()) + "T" + b(this.getUTCHours()) + ":" + b(this.getUTCMinutes()) + ":" + b(this.getUTCSeconds()) + "Z" : null
            }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                return this.valueOf()
            });
            var e, d, m, q, g, n;
            "function" !== typeof JSON.stringify && (d = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, g = {"\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, JSON.stringify = function (a, b, g) {
                var d;
                q = m = "";
                if ("number" === typeof g)for (d = 0; d < g; d += 1)q += " "; else"string" === typeof g && (q = g);
                if ((n = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length))throw Error("JSON.stringify");
                return c("", {"": a})
            });
            "function" !== typeof JSON.parse && (e = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, JSON.parse = function (a, b) {
                function c(a, g) {
                    var d, f, l = a[g];
                    if (l && "object" === typeof l)for (d in l)Object.prototype.hasOwnProperty.call(l, d) && (f = c(l, d), void 0 !== f ? l[d] = f : delete l[d]);
                    return b.call(a, g, l)
                }

                var g;
                a = String(a);
                e.lastIndex = 0;
                e.test(a) && (a = a.replace(e, function (a) {
                    return"\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }));
                if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))return g = eval("(" +
                    a + ")"), "function" === typeof b ? c({"": g}, "") : g;
                throw new SyntaxError("JSON.parse");
            })
        })();
        k.JSON = JSON
    }, {}], 13: [function (h, p, k) {
        Object.create || (Object.create = function () {
            function b() {
            }

            return function (a) {
                if (1 != arguments.length)throw Error("Object.create implementation only accepts one parameter.");
                b.prototype = a;
                return new b
            }
        }());
        Object.keys || (Object.keys = function () {
            var b = Object.prototype.hasOwnProperty, a = !{toString: null}.propertyIsEnumerable("toString"), c = "toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor".split(" "), e = c.length;
            return function (d) {
                if ("object" !== typeof d && ("function" !== typeof d || null === d))throw new TypeError("Object.keys called on non-object");
                var m = [], q;
                for (q in d)b.call(d, q) && m.push(q);
                if (a)for (q = 0; q < e; q++)b.call(d, c[q]) && m.push(c[q]);
                return m
            }
        }())
    }, {}], 14: [function (h, p, k) {
        "trim"in String.prototype || (String.prototype.trim = function () {
            return this.replace(/^\s+/, "").replace(/\s+$/, "")
        })
    }, {}], 15: [function (h, p, k) {
        (function (b) {
            "undefined" === typeof b.Uint8Array && function (a, b) {
                function e(a) {
                    switch (typeof a) {
                        case"undefined":
                            return"undefined";
                        case"boolean":
                            return"boolean";
                        case"number":
                            return"number";
                        case"string":
                            return"string";
                        default:
                            return null === a ? "null" : "object"
                    }
                }

                function d(a) {
                    return Object.prototype.toString.call(a).replace(/^\[object *|\]$/g, "")
                }

                function m(a) {
                    return"function" === typeof a
                }

                function q(a) {
                    if (null === a || a === s)throw TypeError();
                    return Object(a)
                }

                function g(a) {
                    function b(f) {
                        Object.defineProperty(a, f, {get: function () {
                            return a._getter(f)
                        }, set: function (b) {
                            a._setter(f, b)
                        }, enumerable: !0, configurable: !1})
                    }

                    if (a.length > t)throw RangeError("Array too large for polyfill");
                    var f;
                    for (f = 0; f < a.length; f += 1)b(f)
                }

                function n(a, b) {
                    var f = 32 - b;
                    return a << f >> f
                }

                function l(a, b) {
                    var f = 32 - b;
                    return a << f >>> f
                }

                function z(a) {
                    return[a & 255]
                }

                function h(a) {
                    return n(a[0], 8)
                }

                function w(a) {
                    return[a & 255]
                }

                function v(a) {
                    return l(a[0], 8)
                }

                function y(a) {
                    a = aa(Number(a));
                    return[0 > a ? 0 : 255 < a ? 255 : a & 255]
                }

                function H(a) {
                    return[a >> 8 & 255, a & 255]
                }

                function f(a) {
                    return n(a[0] << 8 | a[1], 16)
                }

                function x(a) {
                    return[a >> 8 & 255, a & 255]
                }

                function J(a) {
                    return l(a[0] << 8 | a[1], 16)
                }

                function A(a) {
                    return[a >> 24 & 255, a >> 16 & 255, a >> 8 & 255, a & 255]
                }

                function k(a) {
                    return n(a[0] << 24 | a[1] << 16 | a[2] << 8 | a[3], 32)
                }

                function p(a) {
                    return[a >> 24 & 255, a >> 16 & 255, a >> 8 & 255, a & 255]
                }

                function B(a) {
                    return l(a[0] << 24 | a[1] << 16 | a[2] << 8 | a[3], 32)
                }

                function E(a, b, f) {
                    function c(a) {
                        var b = V(a);
                        a -= b;
                        return 0.5 > a ? b : 0.5 < a ? b + 1 : b % 2 ? b + 1 : b
                    }

                    var g = (1 << b - 1) - 1, d, l, e;
                    a !== a ? (l = (1 << b) - 1, e = O(2, f - 1), d = 0) : Infinity === a || -Infinity === a ? (l = (1 << b) - 1, e = 0, d = 0 > a ? 1 : 0) : 0 === a ? (e = l = 0, d = -Infinity === 1 / a ? 1 : 0) : (d = 0 > a, a = u(a), a >= O(2, 1 - g) ? (l = R(V(S(a) / r), 1023), e = c(a / O(2, l) * O(2, f)), 2 <= e / O(2, f) && (l += 1, e = 1), l > g ? (l = (1 << b) - 1, e = 0) : (l += g, e -= O(2, f))) : (l = 0, e = c(a / O(2, 1 - g - f))));
                    for (a = []; f; f -= 1)a.push(e % 2 ? 1 : 0), e = V(e / 2);
                    for (f = b; f; f -= 1)a.push(l % 2 ? 1 : 0), l = V(l / 2);
                    a.push(d ? 1 : 0);
                    a.reverse();
                    b = a.join("");
                    for (d = []; b.length;)d.push(parseInt(b.substring(0, 8), 2)), b = b.substring(8);
                    return d
                }

                function I(a, b, f) {
                    var c = [], g, d, l;
                    for (g = a.length; g; g -= 1)for (l = a[g - 1], d = 8; d; d -= 1)c.push(l % 2 ? 1 : 0), l >>= 1;
                    c.reverse();
                    d = c.join("");
                    a = (1 << b - 1) - 1;
                    c = parseInt(d.substring(0, 1), 2) ? -1 : 1;
                    g = parseInt(d.substring(1, 1 + b), 2);
                    d = parseInt(d.substring(1 + b), 2);
                    return g === (1 << b) - 1 ? 0 !== d ? NaN : Infinity * c : 0 < g ? c * O(2, g - a) * (1 + d / O(2, f)) : 0 !== d ? c * O(2, -(a - 1)) * (d / O(2, f)) : 0 > c ? -0 : 0
                }

                function Q(a) {
                    return I(a, 11, 52)
                }

                function N(a) {
                    return E(a, 11, 52)
                }

                function F(a) {
                    return I(a, 8, 23)
                }

                function G(a) {
                    return E(a, 8, 23)
                }

                var s = void 0, t = 1E5, r = Math.LN2, u = Math.abs, V = Math.floor, S = Math.log, M = Math.max, R = Math.min, O = Math.pow, aa = Math.round;
                (function () {
                    var a = Object.defineProperty, b;
                    try {
                        b = Object.defineProperty({}, "x", {})
                    } catch (f) {
                        b = !1
                    }
                    a && b || (Object.defineProperty = function (b, f, c) {
                        if (a)try {
                            return a(b, f, c)
                        } catch (g) {
                        }
                        if (b !== Object(b))throw TypeError("Object.defineProperty called on non-object");
                        Object.prototype.__defineGetter__ && "get"in c && Object.prototype.__defineGetter__.call(b, f, c.get);
                        Object.prototype.__defineSetter__ && "set"in c && Object.prototype.__defineSetter__.call(b, f, c.set);
                        "value"in c && (b[f] = c.value);
                        return b
                    })
                })();
                (function () {
                    function l(a) {
                        a >>= 0;
                        if (0 > a)throw RangeError("ArrayBuffer size is not a small enough positive integer.");
                        Object.defineProperty(this, "byteLength", {value: a});
                        Object.defineProperty(this, "_bytes", {value: Array(a)});
                        for (var b = 0; b < a; b += 1)this._bytes[b] = 0
                    }

                    function n() {
                        if (!arguments.length || "object" !== typeof arguments[0])return function (a) {
                            a >>= 0;
                            if (0 > a)throw RangeError("length is not a small enough positive integer.");
                            Object.defineProperty(this, "length", {value: a});
                            Object.defineProperty(this, "byteLength", {value: a * this.BYTES_PER_ELEMENT});
                            Object.defineProperty(this, "buffer", {value: new l(this.byteLength)});
                            Object.defineProperty(this, "byteOffset", {value: 0})
                        }.apply(this, arguments);
                        if (1 <= arguments.length && "object" === e(arguments[0]) && arguments[0]instanceof n)return function (a) {
                            if (this.constructor !== a.constructor)throw TypeError();
                            var b = a.length * this.BYTES_PER_ELEMENT;
                            Object.defineProperty(this, "buffer", {value: new l(b)});
                            Object.defineProperty(this, "byteLength", {value: b});
                            Object.defineProperty(this, "byteOffset", {value: 0});
                            Object.defineProperty(this, "length", {value: a.length});
                            for (b = 0; b < this.length; b += 1)this._setter(b, a._getter(b))
                        }.apply(this, arguments);
                        if (1 <= arguments.length && "object" === e(arguments[0]) && !(arguments[0]instanceof n || arguments[0]instanceof l || "ArrayBuffer" === d(arguments[0])))return function (a) {
                            var b = a.length * this.BYTES_PER_ELEMENT;
                            Object.defineProperty(this, "buffer", {value: new l(b)});
                            Object.defineProperty(this, "byteLength", {value: b});
                            Object.defineProperty(this, "byteOffset", {value: 0});
                            Object.defineProperty(this, "length", {value: a.length});
                            for (b = 0; b < this.length; b += 1)this._setter(b, Number(a[b]))
                        }.apply(this, arguments);
                        if (1 <= arguments.length && "object" === e(arguments[0]) && (arguments[0]instanceof
                            l || "ArrayBuffer" === d(arguments[0])))return function (a, b, f) {
                            b >>>= 0;
                            if (b > a.byteLength)throw RangeError("byteOffset out of range");
                            if (b % this.BYTES_PER_ELEMENT)throw RangeError("buffer length minus the byteOffset is not a multiple of the element size.");
                            if (f === s) {
                                var c = a.byteLength - b;
                                if (c % this.BYTES_PER_ELEMENT)throw RangeError("length of buffer minus byteOffset not a multiple of the element size");
                                f = c / this.BYTES_PER_ELEMENT
                            } else f >>>= 0, c = f * this.BYTES_PER_ELEMENT;
                            if (b + c > a.byteLength)throw RangeError("byteOffset and length reference an area beyond the end of the buffer");
                            Object.defineProperty(this, "buffer", {value: a});
                            Object.defineProperty(this, "byteLength", {value: c});
                            Object.defineProperty(this, "byteOffset", {value: b});
                            Object.defineProperty(this, "length", {value: f})
                        }.apply(this, arguments);
                        throw TypeError();
                    }

                    function r(a, b, f) {
                        var c = function () {
                            Object.defineProperty(this, "constructor", {value: c});
                            n.apply(this, arguments);
                            g(this)
                        };
                        "__proto__"in c ? c.__proto__ = n : (c.from = n.from, c.of = n.of);
                        c.BYTES_PER_ELEMENT = a;
                        var d = function () {
                        };
                        d.prototype = t;
                        c.prototype = new d;
                        Object.defineProperty(c.prototype, "BYTES_PER_ELEMENT", {value: a});
                        Object.defineProperty(c.prototype, "_pack", {value: b});
                        Object.defineProperty(c.prototype, "_unpack", {value: f});
                        return c
                    }

                    a.ArrayBuffer = a.ArrayBuffer || l;
                    Object.defineProperty(n, "from", {value: function (a) {
                        return new this(a)
                    }});
                    Object.defineProperty(n, "of", {value: function () {
                        return new this(arguments)
                    }});
                    var t = {};
                    n.prototype = t;
                    Object.defineProperty(n.prototype, "_getter", {value: function (a) {
                        if (1 > arguments.length)throw SyntaxError("Not enough arguments");
                        a >>>= 0;
                        if (a >= this.length)return s;
                        var b = [], f, c;
                        f = 0;
                        for (c = this.byteOffset + a * this.BYTES_PER_ELEMENT; f < this.BYTES_PER_ELEMENT; f += 1, c += 1)b.push(this.buffer._bytes[c]);
                        return this._unpack(b)
                    }});
                    Object.defineProperty(n.prototype, "get", {value: n.prototype._getter});
                    Object.defineProperty(n.prototype, "_setter", {value: function (a, b) {
                        if (2 > arguments.length)throw SyntaxError("Not enough arguments");
                        a >>>= 0;
                        if (!(a >= this.length)) {
                            var f = this._pack(b), c, d;
                            c = 0;
                            for (d = this.byteOffset + a * this.BYTES_PER_ELEMENT; c < this.BYTES_PER_ELEMENT; c += 1, d += 1)this.buffer._bytes[d] = f[c]
                        }
                    }});
                    Object.defineProperty(n.prototype, "constructor", {value: n});
                    Object.defineProperty(n.prototype, "copyWithin", {value: function (a, b, f) {
                        var c = q(this), d = c.length >>> 0, d = M(d, 0);
                        a >>= 0;
                        a = 0 > a ? M(d + a, 0) : R(a, d);
                        b >>= 0;
                        b = 0 > b ? M(d + b, 0) : R(b, d);
                        f = f === s ? d : f >> 0;
                        f = 0 > f ? M(d + f, 0) : R(f, d);
                        d = R(f - b, d - a);
                        from < a && a < b + d ? (f = -1, b = b + d - 1, a = a + d - 1) : f = 1;
                        for (; 0 < count;)c._setter(a, c._getter(b)), b += f, a += f, d -= 1;
                        return c
                    }});
                    Object.defineProperty(n.prototype, "every", {value: function (a, b) {
                        if (this === s || null === this)throw TypeError();
                        var f = Object(this), c = f.length >>> 0;
                        if (!m(a))throw TypeError();
                        for (var d = 0; d < c; d++)if (!a.call(b, f._getter(d), d, f))return!1;
                        return!0
                    }});
                    Object.defineProperty(n.prototype, "fill", {value: function (a, b, f) {
                        var c = q(this), d = c.length >>> 0, d = M(d, 0);
                        b >>= 0;
                        b = 0 > b ? M(d + b, 0) : R(b, d);
                        f = f === s ? d : f >> 0;
                        for (d = 0 > f ? M(d + f, 0) : R(f, d); b < d;)c._setter(b, a), b += 1;
                        return c
                    }});
                    Object.defineProperty(n.prototype, "filter", {value: function (a, b) {
                        if (this === s || null === this)throw TypeError();
                        var f = Object(this), c = f.length >>> 0;
                        if (!m(a))throw TypeError();
                        for (var d = [], g = 0; g < c; g++) {
                            var l = f._getter(g);
                            a.call(b, l, g, f) && d.push(l)
                        }
                        return new this.constructor(d)
                    }});
                    Object.defineProperty(n.prototype, "find", {value: function (a) {
                        var b = q(this), f = b.length >>> 0;
                        if (!m(a))throw TypeError();
                        for (var c = 1 < arguments.length ? arguments[1] : s, d = 0; d < f;) {
                            var g = b._getter(d), l = a.call(c, g, d, b);
                            if (Boolean(l))return g;
                            ++d
                        }
                        return s
                    }});
                    Object.defineProperty(n.prototype, "findIndex", {value: function (a) {
                        var b = q(this), f = b.length >>> 0;
                        if (!m(a))throw TypeError();
                        for (var c = 1 < arguments.length ? arguments[1] : s, d = 0; d < f;) {
                            var g = b._getter(d), g = a.call(c, g, d, b);
                            if (Boolean(g))return d;
                            ++d
                        }
                        return-1
                    }});
                    Object.defineProperty(n.prototype, "forEach", {value: function (a, b) {
                        if (this === s || null === this)throw TypeError();
                        var f = Object(this), c = f.length >>> 0;
                        if (!m(a))throw TypeError();
                        for (var d = 0; d < c; d++)a.call(b, f._getter(d), d, f)
                    }});
                    Object.defineProperty(n.prototype, "indexOf", {value: function (a) {
                        if (this === s || null === this)throw TypeError();
                        var b = Object(this), f = b.length >>> 0;
                        if (0 === f)return-1;
                        var c = 0, d;
                        0 < arguments.length && (d = Number(arguments[1]), d !== c ? c = 0 : 0 !== d && d !== 1 / 0 && d !== -(1 / 0) && (c = (0 < d || -1) * V(u(d))));
                        if (c >= f)return-1;
                        for (c = 0 <= c ? c : M(f - u(c), 0); c < f; c++)if (b._getter(c) === a)return c;
                        return-1
                    }});
                    Object.defineProperty(n.prototype, "join", {value: function (a) {
                        if (this === s || null === this)throw TypeError();
                        for (var b = Object(this), f = b.length >>> 0, c = Array(f), d = 0; d < f; ++d)c[d] = b._getter(d);
                        return c.join(a === s ? "," : a)
                    }});
                    Object.defineProperty(n.prototype, "lastIndexOf", {value: function (a) {
                        if (this === s || null === this)throw TypeError();
                        var b = Object(this), f = b.length >>> 0;
                        if (0 === f)return-1;
                        var c = f;
                        1 < arguments.length && (c = Number(arguments[1]), c !== c ? c = 0 : 0 !== c && c !== 1 / 0 && c !== -(1 / 0) && (c = (0 < c || -1) * V(u(c))));
                        for (f = 0 <= c ? R(c, f - 1) : f - u(c); 0 <= f; f--)if (b._getter(f) === a)return f;
                        return-1
                    }});
                    Object.defineProperty(n.prototype, "map", {value: function (a, b) {
                        if (this === s || null === this)throw TypeError();
                        var f = Object(this), c = f.length >>> 0;
                        if (!m(a))throw TypeError();
                        var d = [];
                        d.length = c;
                        for (var g = 0; g < c; g++)d[g] = a.call(b, f._getter(g), g, f);
                        return new this.constructor(d)
                    }});
                    Object.defineProperty(n.prototype, "reduce", {value: function (a) {
                        if (this === s || null === this)throw TypeError();
                        var b = Object(this), f = b.length >>> 0;
                        if (!m(a))throw TypeError();
                        if (0 === f && 1 === arguments.length)throw TypeError();
                        var c = 0, d;
                        for (d = 2 <= arguments.length ? arguments[1] : b._getter(c++); c < f;)d = a.call(s, d, b._getter(c), c, b), c++;
                        return d
                    }});
                    Object.defineProperty(n.prototype, "reduceRight", {value: function (a) {
                        if (this === s || null === this)throw TypeError();
                        var b = Object(this), f = b.length >>> 0;
                        if (!m(a))throw TypeError();
                        if (0 === f && 1 === arguments.length)throw TypeError();
                        var f = f - 1, c;
                        for (c = 2 <= arguments.length ? arguments[1] : b._getter(f--); 0 <= f;)c = a.call(s, c, b._getter(f), f, b), f--;
                        return c
                    }});
                    Object.defineProperty(n.prototype, "reverse", {value: function () {
                        if (this === s || null === this)throw TypeError();
                        for (var a = Object(this), b = a.length >>> 0, f = V(b / 2), c = 0, b = b - 1; c < f; ++c, --b) {
                            var d = a._getter(c);
                            a._setter(c, a._getter(b));
                            a._setter(b, d)
                        }
                        return a
                    }});
                    Object.defineProperty(n.prototype, "set", {value: function (a, b) {
                        if (1 > arguments.length)throw SyntaxError("Not enough arguments");
                        var f, c, d, g, l, n;
                        if ("object" === typeof arguments[0] && arguments[0].constructor === this.constructor) {
                            f = arguments[0];
                            c = arguments[1] >>> 0;
                            if (c + f.length > this.length)throw RangeError("Offset plus length of array is out of range");
                            n = this.byteOffset + c * this.BYTES_PER_ELEMENT;
                            c = f.length * this.BYTES_PER_ELEMENT;
                            if (f.buffer === this.buffer) {
                                d = [];
                                g = 0;
                                for (l = f.byteOffset; g < c; g += 1, l += 1)d[g] = f.buffer._bytes[l];
                                for (g = 0; g < c; g += 1, n += 1)this.buffer._bytes[n] = d[g]
                            } else for (g = 0, l = f.byteOffset; g < c; g += 1, l += 1, n += 1)this.buffer._bytes[n] = f.buffer._bytes[l]
                        } else if ("object" === typeof arguments[0] && "undefined" !== typeof arguments[0].length) {
                            f = arguments[0];
                            d = f.length >>> 0;
                            c = arguments[1] >>> 0;
                            if (c + d > this.length)throw RangeError("Offset plus length of array is out of range");
                            for (g = 0; g < d; g += 1)l = f[g], this._setter(c + g, Number(l))
                        } else throw TypeError("Unexpected argument type(s)");
                    }});
                    Object.defineProperty(n.prototype, "slice", {value: function (a, b) {
                        for (var f = q(this), c = f.length >>> 0, d = a >> 0, d = 0 > d ? M(c + d, 0) : R(d, c), g = b === s ? c : b >> 0, c = 0 > g ? M(c + g, 0) : R(g, c), g = new f.constructor(c - d), l = 0; d < c;) {
                            var n = f._getter(d);
                            g._setter(l, n);
                            ++d;
                            ++l
                        }
                        return g
                    }});
                    Object.defineProperty(n.prototype, "some", {value: function (a, b) {
                        if (this === s || null === this)throw TypeError();
                        var f = Object(this), c = f.length >>> 0;
                        if (!m(a))throw TypeError();
                        for (var d = 0; d < c; d++)if (a.call(b, f._getter(d), d, f))return!0;
                        return!1
                    }});
                    Object.defineProperty(n.prototype, "sort", {value: function (a) {
                        if (this === s || null === this)throw TypeError();
                        for (var b = Object(this), f = b.length >>> 0, c = Array(f), d = 0; d < f; ++d)c[d] = b._getter(d);
                        a ? c.sort(a) : c.sort();
                        for (d = 0; d < f; ++d)b._setter(d, c[d]);
                        return b
                    }});
                    Object.defineProperty(n.prototype, "subarray", {value: function (a, b) {
                        a >>= 0;
                        b >>= 0;
                        1 > arguments.length && (a = 0);
                        2 > arguments.length && (b = this.length);
                        0 > a && (a = this.length + a);
                        0 > b && (b = this.length + b);
                        var f = this.length;
                        a = 0 > a ? 0 : a > f ? f : a;
                        f = this.length;
                        f = (0 > b ? 0 : b > f ? f : b) - a;
                        0 > f && (f = 0);
                        return new this.constructor(this.buffer, this.byteOffset + a * this.BYTES_PER_ELEMENT, f)
                    }});
                    var E = r(1, z, h), S = r(1, w, v), I = r(1, y, v), O = r(2, H, f), aa = r(2, x, J), ha = r(4, A, k), da = r(4, p, B), U = r(4, G, F), $ = r(8, N, Q);
                    a.Int8Array = b.Int8Array = a.Int8Array || E;
                    a.Uint8Array = b.Uint8Array = a.Uint8Array || S;
                    a.Uint8ClampedArray = b.Uint8ClampedArray = a.Uint8ClampedArray || I;
                    a.Int16Array = b.Int16Array = a.Int16Array || O;
                    a.Uint16Array = b.Uint16Array = a.Uint16Array || aa;
                    a.Int32Array = b.Int32Array = a.Int32Array || ha;
                    a.Uint32Array = b.Uint32Array = a.Uint32Array || da;
                    a.Float32Array = b.Float32Array = a.Float32Array || U;
                    a.Float64Array = b.Float64Array = a.Float64Array || $
                })();
                (function () {
                    function b(a, f) {
                        return m(a.get) ? a.get(f) : a[f]
                    }

                    function f(a, b, c) {
                        if (!(a instanceof ArrayBuffer || "ArrayBuffer" === d(a)))throw TypeError();
                        b >>>= 0;
                        if (b > a.byteLength)throw RangeError("byteOffset out of range");
                        c = c === s ? a.byteLength - b : c >>> 0;
                        if (b + c > a.byteLength)throw RangeError("byteOffset and length reference an area beyond the end of the buffer");
                        Object.defineProperty(this, "buffer", {value: a});
                        Object.defineProperty(this, "byteLength", {value: c});
                        Object.defineProperty(this, "byteOffset", {value: b})
                    }

                    function c(f) {
                        return function (c, d) {
                            c >>>= 0;
                            if (c + f.BYTES_PER_ELEMENT > this.byteLength)throw RangeError("Array index out of range");
                            c += this.byteOffset;
                            for (var g = new a.Uint8Array(this.buffer, c, f.BYTES_PER_ELEMENT), n = [], e = 0; e < f.BYTES_PER_ELEMENT; e += 1)n.push(b(g, e));
                            Boolean(d) === Boolean(l) && n.reverse();
                            return b(new f((new a.Uint8Array(n)).buffer), 0)
                        }
                    }

                    function g(f) {
                        return function (c, d, g) {
                            c >>>= 0;
                            if (c + f.BYTES_PER_ELEMENT > this.byteLength)throw RangeError("Array index out of range");
                            d = new f([d]);
                            d = new a.Uint8Array(d.buffer);
                            var n = [], e;
                            for (e = 0; e < f.BYTES_PER_ELEMENT; e += 1)n.push(b(d, e));
                            Boolean(g) === Boolean(l) && n.reverse();
                            (new Uint8Array(this.buffer, c, f.BYTES_PER_ELEMENT)).set(n)
                        }
                    }

                    var l = function () {
                        var f = new a.Uint16Array([4660]), f = new a.Uint8Array(f.buffer);
                        return 18 === b(f, 0)
                    }();
                    Object.defineProperty(f.prototype, "getUint8", {value: c(a.Uint8Array)});
                    Object.defineProperty(f.prototype, "getInt8", {value: c(a.Int8Array)});
                    Object.defineProperty(f.prototype, "getUint16", {value: c(a.Uint16Array)});
                    Object.defineProperty(f.prototype, "getInt16", {value: c(a.Int16Array)});
                    Object.defineProperty(f.prototype, "getUint32", {value: c(a.Uint32Array)});
                    Object.defineProperty(f.prototype, "getInt32", {value: c(a.Int32Array)});
                    Object.defineProperty(f.prototype, "getFloat32", {value: c(a.Float32Array)});
                    Object.defineProperty(f.prototype, "getFloat64", {value: c(a.Float64Array)});
                    Object.defineProperty(f.prototype, "setUint8", {value: g(a.Uint8Array)});
                    Object.defineProperty(f.prototype, "setInt8", {value: g(a.Int8Array)});
                    Object.defineProperty(f.prototype, "setUint16", {value: g(a.Uint16Array)});
                    Object.defineProperty(f.prototype, "setInt16", {value: g(a.Int16Array)});
                    Object.defineProperty(f.prototype, "setUint32", {value: g(a.Uint32Array)});
                    Object.defineProperty(f.prototype, "setInt32", {value: g(a.Int32Array)});
                    Object.defineProperty(f.prototype, "setFloat32", {value: g(a.Float32Array)});
                    Object.defineProperty(f.prototype, "setFloat64", {value: g(a.Float64Array)});
                    a.DataView = a.DataView || f
                })()
            }(k, window);
            "window"in b && !("Uint8ClampedArray"in window) && (window.Uint8ClampedArray = b.Uint8Array)
        }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
    }, {}], 16: [function (h, p, k) {
        (function (b) {
            function a() {
                return Math.floor(9007199254740992 * Math.random())
            }

            h("when");
            var c = h("when/function"), e = h("./log.js"), d = h("./util.js");
            Date.now = Date.now || function () {
                return+new Date
            };
            WAMP_FEATURES = {caller: {features: {caller_identification: !0, progressive_call_results: !0}}, callee: {features: {progressive_call_results: !0}}, publisher: {features: {subscriber_blackwhite_listing: !0, publisher_exclusion: !0, publisher_identification: !0}}, subscriber: {features: {publisher_identification: !0}}};
            var m = function (a, b, c) {
                this.caller = a;
                this.progress = b;
                this.procedure = c
            }, q = function (a, b, c) {
                this.publication = a;
                this.publisher = b;
                this.topic = c
            }, g = function (a, b) {
                this.args = a || [];
                this.kwargs = b || {}
            }, n = function (a, b, c) {
                this.error = a;
                this.args = b || [];
                this.kwargs = c || {}
            }, l = function (a, b, c, f, d) {
                this.topic = a;
                this.handler = b;
                this.options = c || {};
                this.session = f;
                this.id = d;
                this.active = !0
            };
            l.prototype.unsubscribe = function () {
                return this.session.unsubscribe(this)
            };
            var z = function (a, b, c, f, d) {
                this.procedure = a;
                this.endpoint = b;
                this.options = c || {};
                this.session = f;
                this.id = d;
                this.active = !0
            };
            z.prototype.unregister = function () {
                return this.session.unregister(this)
            };
            var P = function (a) {
                this.id = a
            }, w = function (a, d, H) {
                var f = this;
                f._socket = a;
                f._defer = d;
                f._onchallenge = H;
                f._id = null;
                f._realm = null;
                f._features = null;
                f._goodbye_sent = !1;
                f._transport_is_closing = !1;
                f._publish_reqs = {};
                f._subscribe_reqs = {};
                f._unsubscribe_reqs = {};
                f._call_reqs = {};
                f._register_reqs = {};
                f._unregister_reqs = {};
                f._subscriptions = {};
                f._registrations = {};
                f._invocations = {};
                f._prefixes = {};
                f._send_wamp = function (a) {
                    f._socket.send(a)
                };
                f._protocol_violation = function (a) {
                    e.debug("failing transport due to protocol violation: " + a);
                    f._socket.close(1002, "protocol violation: " + a)
                };
                f._MESSAGE_MAP = {};
                f._MESSAGE_MAP[8] = {};
                f._process_SUBSCRIBED = function (a) {
                    var b = a[1];
                    a = a[2];
                    if (b in f._subscribe_reqs) {
                        var c = f._subscribe_reqs[b], d = c[0], g = c[1], n = c[2], c = c[3];
                        a in f._subscriptions || (f._subscriptions[a] = []);
                        g = new l(g, n, c, f, a);
                        f._subscriptions[a].push(g);
                        d.resolve(g);
                        delete f._subscribe_reqs[b]
                    } else f._protocol_violation("SUBSCRIBED received for non-pending request ID " +
                        b)
                };
                f._MESSAGE_MAP[33] = f._process_SUBSCRIBED;
                f._process_SUBSCRIBE_ERROR = function (a) {
                    var b = a[2];
                    b in f._subscribe_reqs ? (a = new n(a[4], a[5], a[6]), f._subscribe_reqs[b][0].reject(a), delete f._subscribe_reqs[b]) : f._protocol_violation("SUBSCRIBE-ERROR received for non-pending request ID " + b)
                };
                f._MESSAGE_MAP[8][32] = f._process_SUBSCRIBE_ERROR;
                f._process_UNSUBSCRIBED = function (a) {
                    a = a[1];
                    if (a in f._unsubscribe_reqs) {
                        var b = f._unsubscribe_reqs[a], c = b[0], b = b[1];
                        if (b in f._subscriptions) {
                            for (var d = f._subscriptions[b], g = 0; g < d.length; ++g)d[g].active = !1;
                            delete f._subscriptions[b]
                        }
                        c.resolve(!0);
                        delete f._unsubscribe_reqs[a]
                    } else f._protocol_violation("UNSUBSCRIBED received for non-pending request ID " + a)
                };
                f._MESSAGE_MAP[35] = f._process_UNSUBSCRIBED;
                f._process_UNSUBSCRIBE_ERROR = function (a) {
                    var b = a[2];
                    b in f._unsubscribe_reqs ? (a = new n(a[4], a[5], a[6]), f._unsubscribe_reqs[b][0].reject(a), delete f._unsubscribe_reqs[b]) : f._protocol_violation("UNSUBSCRIBE-ERROR received for non-pending request ID " + b)
                };
                f._MESSAGE_MAP[8][34] = f._process_UNSUBSCRIBE_ERROR;
                f._process_PUBLISHED = function (a) {
                    var b = a[1], c = a[2];
                    b in f._publish_reqs ? (a = f._publish_reqs[b][0], c = new P(c), a.resolve(c), delete f._publish_reqs[b]) : f._protocol_violation("PUBLISHED received for non-pending request ID " + b)
                };
                f._MESSAGE_MAP[17] = f._process_PUBLISHED;
                f._process_PUBLISH_ERROR = function (a) {
                    var b = a[2];
                    b in f._publish_reqs ? (a = new n(a[4], a[5], a[6]), f._publish_reqs[b][0].reject(a), delete f._publish_reqs[b]) : f._protocol_violation("PUBLISH-ERROR received for non-pending request ID " +
                        b)
                };
                f._MESSAGE_MAP[8][16] = f._process_PUBLISH_ERROR;
                f._process_EVENT = function (a) {
                    var b = a[1];
                    if (b in f._subscriptions) {
                        var c = a[3], d = a[4] || [], g = a[5] || {};
                        a = new q(a[2], c.publisher, c.topic);
                        b = f._subscriptions[b];
                        for (c = 0; c < b.length; ++c)try {
                            b[c].handler(d, g, a)
                        } catch (l) {
                            e.debug("Exception raised in event handler", l)
                        }
                    } else f._protocol_violation("EVENT received for non-subscribed subscription ID " + b)
                };
                f._MESSAGE_MAP[36] = f._process_EVENT;
                f._process_REGISTERED = function (a) {
                    var b = a[1];
                    a = a[2];
                    if (b in f._register_reqs) {
                        var c = f._register_reqs[b], d = c[0], c = new z(c[1], c[2], c[3], f, a);
                        f._registrations[a] = c;
                        d.resolve(c);
                        delete f._register_reqs[b]
                    } else f._protocol_violation("REGISTERED received for non-pending request ID " + b)
                };
                f._MESSAGE_MAP[65] = f._process_REGISTERED;
                f._process_REGISTER_ERROR = function (a) {
                    var b = a[2];
                    b in f._register_reqs ? (a = new n(a[4], a[5], a[6]), f._register_reqs[b][0].reject(a), delete f._register_reqs[b]) : f._protocol_violation("REGISTER-ERROR received for non-pending request ID " + b)
                };
                f._MESSAGE_MAP[8][64] = f._process_REGISTER_ERROR;
                f._process_UNREGISTERED = function (a) {
                    a = a[1];
                    if (a in f._unregister_reqs) {
                        var b = f._unregister_reqs[a], c = b[0], b = b[1];
                        b.id in f._registrations && delete f._registrations[b.id];
                        b.active = !1;
                        c.resolve();
                        delete f._unregister_reqs[a]
                    } else f._protocol_violation("UNREGISTERED received for non-pending request ID " + a)
                };
                f._MESSAGE_MAP[67] = f._process_UNREGISTERED;
                f._process_UNREGISTER_ERROR = function (a) {
                    var b = a[2];
                    b in f._unregister_reqs ? (a = new n(a[4], a[5], a[6]), f._unregister_reqs[b][0].reject(a), delete f._unregister_reqs[b]) : f._protocol_violation("UNREGISTER-ERROR received for non-pending request ID " + b)
                };
                f._MESSAGE_MAP[8][66] = f._process_UNREGISTER_ERROR;
                f._process_RESULT = function (a) {
                    var b = a[1];
                    if (b in f._call_reqs) {
                        var c = a[2], d = a[3] || [], l = a[4] || {};
                        a = null;
                        1 < d.length || 0 < Object.keys(l).length ? a = new g(d, l) : 0 < d.length && (a = d[0]);
                        l = f._call_reqs[b];
                        d = l[0];
                        l = l[1];
                        c.progress ? l && l.receive_progress && d.notify(a) : (d.resolve(a), delete f._call_reqs[b])
                    } else f._protocol_violation("CALL-RESULT received for non-pending request ID " + b)
                };
                f._MESSAGE_MAP[50] = f._process_RESULT;
                f._process_CALL_ERROR = function (a) {
                    var b = a[2];
                    b in f._call_reqs ? (a = new n(a[4], a[5], a[6]), f._call_reqs[b][0].reject(a), delete f._call_reqs[b]) : f._protocol_violation("CALL-ERROR received for non-pending request ID " + b)
                };
                f._MESSAGE_MAP[8][48] = f._process_CALL_ERROR;
                f._process_INVOCATION = function (a) {
                    var b = a[1], d = a[2], l = a[3];
                    if (d in f._registrations) {
                        var d = f._registrations[d].endpoint, e = a[4] || [];
                        a = a[5] || {};
                        var v = null;
                        l.receive_progress && (v = function (a, c) {
                            var d = [70, b, {progress: !0}];
                            a = a || [];
                            c = c || {};
                            var g = Object.keys(c).length;
                            if (a.length || g)d.push(a), g && d.push(c);
                            f._send_wamp(d)
                        });
                        l = new m(l.caller, v, l.procedure);
                        c.call(d, e, a, l).then(function (a) {
                            var c = [70, b, {}];
                            if (a instanceof g) {
                                var d = Object.keys(a.kwargs).length;
                                if (a.args.length || d)c.push(a.args), d && c.push(a.kwargs)
                            } else c.push([a]);
                            f._send_wamp(c)
                        }, function (a) {
                            var c = [8, 68, b, {}];
                            if (a instanceof n) {
                                c.push(a.error);
                                var d = Object.keys(a.kwargs).length;
                                if (a.args.length || d)c.push(a.args), d && c.push(a.kwargs)
                            } else c.push("wamp.error.runtime_error"), c.push([a]);
                            f._send_wamp(c)
                        })
                    } else f._protocol_violation("INVOCATION received for non-registered registration ID " + b)
                };
                f._MESSAGE_MAP[68] = f._process_INVOCATION;
                f._socket.onmessage = function (a) {
                    var b = a[0];
                    if (f._id)if (6 === b) {
                        if (f._goodbye_sent || f._send_wamp([6, {}, "wamp.error.goodbye_and_out"]), f._id = null, f._realm = null, f._features = null, b = a[1], a = a[2], f.onleave)f.onleave(a, b)
                    } else if (8 === b) {
                        var d = a[1];
                        if (d in f._MESSAGE_MAP[8])f._MESSAGE_MAP[b][d](a); else f._protocol_violation("unexpected ERROR message with request_type " +
                            d)
                    } else if (b in f._MESSAGE_MAP)f._MESSAGE_MAP[b](a); else f._protocol_violation("unexpected message type " + b); else if (2 === b) {
                        f._id = a[1];
                        b = a[2];
                        f._features = {};
                        if (b.roles.broker && (f._features.subscriber = {}, f._features.publisher = {}, b.roles.broker.features)) {
                            for (d in WAMP_FEATURES.publisher.features)f._features.publisher[d] = WAMP_FEATURES.publisher.features[d] && b.roles.broker.features[d];
                            for (d in WAMP_FEATURES.subscriber.features)f._features.subscriber[d] = WAMP_FEATURES.subscriber.features[d] && b.roles.broker.features[d]
                        }
                        if (b.roles.dealer && (f._features.caller = {}, f._features.callee = {}, b.roles.dealer.features)) {
                            for (d in WAMP_FEATURES.caller.features)f._features.caller[d] = WAMP_FEATURES.caller.features[d] && b.roles.dealer.features[d];
                            for (d in WAMP_FEATURES.callee.features)f._features.callee[d] = WAMP_FEATURES.callee.features[d] && b.roles.dealer.features[d]
                        }
                        if (f.onjoin)f.onjoin(a[2])
                    } else if (3 === b) {
                        if (b = a[1], a = a[2], f.onleave)f.onleave(a, b)
                    } else 4 === b ? f._onchallenge ? c.call(f._onchallenge, f, a[1], a[2]).then(function (a) {
                        f._send_wamp([5, a, {}])
                    }, function (a) {
                        e.debug("onchallenge() raised:", a);
                        f._send_wamp([3, {message: "sorry, I cannot authenticate (onchallenge handler raised an exception)"}, "wamp.error.cannot_authenticate"]);
                        f._socket.close(1E3)
                    }) : (e.debug("received WAMP challenge, but no onchallenge() handler set"), a = [3, {message: "sorry, I cannot authenticate (no onchallenge handler set)"}, "wamp.error.cannot_authenticate"], f._send_wamp(a), f._socket.close(1E3)) : f._protocol_violation("unexpected message type " + b)
                };
                f._created = "performance"in b && "now"in performance ? performance.now() : Date.now()
            };
            Object.defineProperty(w.prototype, "defer", {get: function () {
                return this._defer
            }});
            Object.defineProperty(w.prototype, "id", {get: function () {
                return this._id
            }});
            Object.defineProperty(w.prototype, "realm", {get: function () {
                return this._realm
            }});
            Object.defineProperty(w.prototype, "isOpen", {get: function () {
                return null !== this.id
            }});
            Object.defineProperty(w.prototype, "features", {get: function () {
                return this._features
            }});
            Object.defineProperty(w.prototype, "subscriptions", {get: function () {
                for (var a = Object.keys(this._subscriptions), b = [], c = 0; c < a.length; ++c)b.push(this._subscriptions[a[c]]);
                return b
            }});
            Object.defineProperty(w.prototype, "registrations", {get: function () {
                for (var a = Object.keys(this._registrations), b = [], c = 0; c < a.length; ++c)b.push(this._registrations[a[c]]);
                return b
            }});
            w.prototype.log = function () {
                if ("console"in b) {
                    var a = null;
                    this._id && this._created ? (a = null, a = "performance"in b && "now"in performance ? performance.now() - this._created : Date.now() - this._created, a = "WAMP session " +
                        this._id + " on '" + this._realm + "' at " + Math.round(1E3 * a) / 1E3 + " ms") : a = "WAMP session";
                    if ("group"in console) {
                        console.group(a);
                        for (a = 0; a < arguments.length; a += 1)console.log(arguments[a]);
                        console.groupEnd()
                    } else {
                        for (var c = [a + ": "], a = 0; a < arguments.length; a += 1)c.push(arguments[a]);
                        console.log.apply(console, c)
                    }
                }
            };
            w.prototype.join = function (a, b, c) {
                d.assert("string" === typeof a, "Session.join: <realm> must be a string");
                d.assert(!b || Array.isArray(b), "Session.join: <authmethods> must be an array []");
                d.assert(!c || "string" === typeof c, "Session.join: <authid> must be a string");
                if (this.isOpen)throw"session already open";
                this._goodbye_sent = !1;
                this._realm = a;
                var f = {};
                f.roles = WAMP_FEATURES;
                b && (f.authmethods = b);
                c && (f.authid = c);
                this._send_wamp([1, a, f])
            };
            w.prototype.leave = function (a, b) {
                d.assert(!a || "string" === typeof a, "Session.leave: <reason> must be a string");
                d.assert(!b || "string" === typeof b, "Session.leave: <message> must be a string");
                if (!this.isOpen)throw"session not open";
                a || (a = "wamp.close.normal");
                var c = {};
                b && (c.message = b);
                this._send_wamp([6, c, a]);
                this._goodbye_sent = !0
            };
            w.prototype.call = function (b, c, g, f) {
                d.assert("string" === typeof b, "Session.call: <procedure> must be a string");
                d.assert(!c || Array.isArray(c), "Session.call: <args> must be an array []");
                d.assert(!g || g instanceof Object, "Session.call: <kwargs> must be an object {}");
                d.assert(!f || f instanceof Object, "Session.call: <options> must be an object {}");
                if (!this.isOpen)throw"session not open";
                var l = a(), n = this._defer();
                this._call_reqs[l] = [n, f];
                b = [48, l, f || {}, this.resolve(b)];
                c && (b.push(c), g && b.push(g));
                this._send_wamp(b);
                return n.promise.then ? n.promise : n
            };
            w.prototype.publish = function (b, c, g, f) {
                d.assert("string" === typeof b, "Session.publish: <topic> must be a string");
                d.assert(!c || Array.isArray(c), "Session.publish: <args> must be an array []");
                d.assert(!g || g instanceof Object, "Session.publish: <kwargs> must be an object {}");
                d.assert(!f || f instanceof Object, "Session.publish: <options> must be an object {}");
                if (!this.isOpen)throw"session not open";
                var l = f && f.acknowledge, n = null, e = a();
                l && (n = this._defer(), this._publish_reqs[e] = [n, f]);
                b = [16, e, f || {}, this.resolve(b)];
                c && (b.push(c), g && b.push(g));
                this._send_wamp(b);
                if (n)return n.promise.then ? n.promise : n
            };
            w.prototype.subscribe = function (b, c, g) {
                d.assert("string" === typeof b, "Session.subscribe: <topic> must be a string");
                d.assert("function" === typeof c, "Session.subscribe: <handler> must be a function");
                d.assert(!g || g instanceof Object, "Session.subscribe: <options> must be an object {}");
                if (!this.isOpen)throw"session not open";
                var f = a(), l = this._defer();
                this._subscribe_reqs[f] = [l, b, c, g];
                c = [32, f];
                g ? c.push(g) : c.push({});
                c.push(this.resolve(b));
                this._send_wamp(c);
                return l.promise.then ? l.promise : l
            };
            w.prototype.register = function (b, c, g) {
                d.assert("string" === typeof b, "Session.register: <procedure> must be a string");
                d.assert("function" === typeof c, "Session.register: <endpoint> must be a function");
                d.assert(!g || g instanceof Object, "Session.register: <options> must be an object {}");
                if (!this.isOpen)throw"session not open";
                var f = a(), l = this._defer();
                this._register_reqs[f] = [l, b, c, g];
                c = [64, f];
                g ? c.push(g) : c.push({});
                c.push(this.resolve(b));
                this._send_wamp(c);
                return l.promise.then ? l.promise : l
            };
            w.prototype.unsubscribe = function (b) {
                d.assert(b instanceof l, "Session.unsubscribe: <subscription> must be an instance of class autobahn.Subscription");
                if (!this.isOpen)throw"session not open";
                if (!(b.active && b.id in this._subscriptions))throw"subscription not active";
                var c = this._subscriptions[b.id], g = c.indexOf(b);
                if (-1 === g)throw"subscription not active";
                c.splice(g, 1);
                b.active = !1;
                g = this._defer();
                c.length ? g.resolve(!1) : (c = a(), this._unsubscribe_reqs[c] = [g, b.id], this._send_wamp([34, c, b.id]));
                return g.promise.then ? g.promise : g
            };
            w.prototype.unregister = function (b) {
                d.assert(b instanceof z, "Session.unregister: <registration> must be an instance of class autobahn.Registration");
                if (!this.isOpen)throw"session not open";
                if (!(b.active && b.id in this._registrations))throw"registration not active";
                var c = a(), g = this._defer();
                this._unregister_reqs[c] = [g, b];
                this._send_wamp([66, c, b.id]);
                return g.promise.then ? g.promise : g
            };
            w.prototype.prefix = function (a, b) {
                d.assert("string" === typeof a, "Session.prefix: <prefix> must be a string");
                d.assert(!b || "string" === typeof b, "Session.prefix: <uri> must be a string or falsy");
                b ? this._prefixes[a] = b : a in this._prefixes && delete this._prefixes[a]
            };
            w.prototype.resolve = function (a) {
                d.assert("string" === typeof a, "Session.resolve: <curie> must be a string");
                var b = a.indexOf(":");
                if (0 <= b) {
                    var c = a.substring(0, b);
                    if (c in this._prefixes)return this._prefixes[c] + "." + a.substring(b + 1);
                    throw"cannot resolve CURIE prefix '" + c + "'";
                }
                return a
            };
            k.Session = w;
            k.Invocation = m;
            k.Event = q;
            k.Result = g;
            k.Error = n;
            k.Subscription = l;
            k.Registration = z;
            k.Publication = P
        }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
    }, {"./log.js": 7, "./util.js": 19, when: 77, "when/function": 54}], 17: [function (h, p, k) {
        function b(b) {
            a.assert(void 0 !== b.url, "options.url missing");
            a.assert("string" === typeof b.url, "options.url must be a string");
            this._options = b
        }

        var a = h("../util.js"), c = h("../log.js");
        h("when");
        b.prototype.type = "longpoll";
        b.prototype.create = function () {
            var b = this;
            c.debug("longpoll.Factory.create");
            var d = {protocol: void 0, send: void 0, close: void 0, onmessage: function () {
            }, onopen: function () {
            }, onclose: function () {
            }, info: {type: "longpoll", url: null, protocol: "wamp.2.json"}, _run: function () {
                var m = null, q = !1, g = b._options.request_timeout || 2E3;
                a.http_post(b._options.url + "/open", JSON.stringify({protocols: ["wamp.2.json"]}), g).then(function (n) {
                    function l() {
                        c.debug("longpoll.Transport: polling for message ...");
                        a.http_post(z + "/receive", null, g).then(function (a) {
                            a && (a = JSON.parse(a), c.debug("longpoll.Transport: message received", a), d.onmessage(a));
                            q || l()
                        }, function (a) {
                            c.debug("longpoll.Transport: could not receive message", a.code, a.text);
                            q = !0;
                            d.onclose({code: 1001, reason: "transport receive failure (HTTP/POST status " + a.code + " - '" + a.text + "')", wasClean: !1})
                        })
                    }

                    m = JSON.parse(n);
                    var z = b._options.url + "/" + m.transport;
                    d.info.url = z;
                    c.debug("longpoll.Transport: open", m);
                    d.close = function (b, l) {
                        if (q)throw"transport is already closing";
                        q = !0;
                        a.http_post(z + "/close", null, g).then(function () {
                            c.debug("longpoll.Transport: transport closed");
                            d.onclose({code: 1E3, reason: "transport closed", wasClean: !0})
                        }, function (a) {
                            c.debug("longpoll.Transport: could not close transport", a.code, a.text)
                        })
                    };
                    d.send = function (b) {
                        if (q)throw"transport is closing or closed already";
                        c.debug("longpoll.Transport: sending message ...", b);
                        b = JSON.stringify(b);
                        a.http_post(z + "/send", b, g).then(function () {
                            c.debug("longpoll.Transport: message sent")
                        }, function (a) {
                            c.debug("longpoll.Transport: could not send message", a.code, a.text);
                            q = !0;
                            d.onclose({code: 1001, reason: "transport send failure (HTTP/POST status " + a.code + " - '" + a.text + "')", wasClean: !1})
                        })
                    };
                    l();
                    d.onopen()
                }, function (a) {
                    c.debug("longpoll.Transport: could not open transport", a.code, a.text);
                    q = !0;
                    d.onclose({code: 1001, reason: "transport open failure (HTTP/POST status " + a.code + " - '" + a.text + "')", wasClean: !1})
                })
            }};
            d._run();
            return d
        };
        k.Factory = b
    }, {"../log.js": 7, "../util.js": 19, when: 77}], 18: [function (h, p, k) {
        (function (b) {
            function a(a) {
                c.assert(void 0 !== a.url, "options.url missing");
                c.assert("string" === typeof a.url, "options.url must be a string");
                a.protocols ? c.assert(Array.isArray(a.protocols), "options.protocols must be an array") : a.protocols = ["wamp.2.json"];
                this._options = a
            }

            var c = h("../util.js"), e = h("../log.js");
            a.prototype.type = "websocket";
            a.prototype.create = function () {
                var a = this, c = {protocol: void 0, send: void 0, close: void 0, onmessage: function () {
                }, onopen: function () {
                }, onclose: function () {
                }, info: {type: "websocket", url: null, protocol: "wamp.2.json"}};
                "window"in b ? function () {
                    var b;
                    if ("WebSocket"in
                        window)b = a._options.protocols ? new window.WebSocket(a._options.url, a._options.protocols) : new window.WebSocket(a._options.url); else if ("MozWebSocket"in window)b = a._options.protocols ? new window.MozWebSocket(a._options.url, a._options.protocols) : new window.MozWebSocket(a._options.url); else throw"browser does not support WebSocket";
                    b.onmessage = function (a) {
                        e.debug("WebSocket transport receive", a.data);
                        a = JSON.parse(a.data);
                        c.onmessage(a)
                    };
                    b.onopen = function () {
                        c.info.url = a._options.url;
                        c.onopen()
                    };
                    b.onclose = function (a) {
                        c.onclose({code: a.code, reason: a.message, wasClean: a.wasClean})
                    };
                    c.send = function (a) {
                        a = JSON.stringify(a);
                        e.debug("WebSocket transport send", a);
                        b.send(a)
                    };
                    c.close = function (a, c) {
                        b.close(a, c)
                    }
                }() : function () {
                    var b = h("ws"), g, n;
                    a._options.protocols ? (n = a._options.protocols, Array.isArray(n) && (n = n.join(",")), g = new b(a._options.url, {protocol: n})) : g = new b(a._options.url);
                    c.send = function (a) {
                        a = JSON.stringify(a);
                        g.send(a, {binary: !1})
                    };
                    c.close = function (a, b) {
                        g.close()
                    };
                    g.on("open", function () {
                        c.onopen()
                    });
                    g.on("message", function (a, b) {
                        if (!b.binary) {
                            var d = JSON.parse(a);
                            c.onmessage(d)
                        }
                    });
                    g.on("close", function (a, b) {
                        c.onclose({code: a, reason: b, wasClean: 1E3 === a})
                    });
                    g.on("error", function (a) {
                        c.onclose({code: 1006, reason: "", wasClean: !1})
                    })
                }();
                return c
            };
            k.Factory = a
        }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
    }, {"../log.js": 7, "../util.js": 19, ws: 78}], 19: [function (h, p, k) {
        (function (b) {
            var a = h("./log.js"), c = h("when"), e = function (a, c) {
                if (!a) {
                    if (e.useDebugger || "AUTOBAHN_DEBUG"in b && AUTOBAHN_DEBUG)debugger;
                    throw Error(c || "Assertion failed!");
                }
            };
            k.rand_normal = function (a, b) {
                var c, g;
                do c = 2 * Math.random() - 1, g = 2 * Math.random() - 1, g = c * c + g * g; while (1 <= g || 0 == g);
                g = Math.sqrt(-2 * Math.log(g) / g);
                return(a || 0) + c * g * (b || 1)
            };
            k.assert = e;
            k.http_post = function (b, e, q) {
                a.debug("new http_post request", b, e, q);
                var g = c.defer(), n = new XMLHttpRequest;
                n.onreadystatechange = function () {
                    if (4 === n.readyState) {
                        var a = 1223 === n.status ? 204 : n.status;
                        200 === a && g.resolve(n.responseText);
                        if (204 === a)g.resolve(); else {
                            var b = null;
                            try {
                                b = n.statusText
                            } catch (c) {
                            }
                            g.reject({code: a, text: b})
                        }
                    }
                };
                n.open("POST", b, !0);
                n.setRequestHeader("Content-type", "application/json; charset=utf-8");
                0 < q && (n.timeout = q, n.ontimeout = function () {
                    g.reject({code: 501, text: "request timeout"})
                });
                e ? n.send(e) : n.send();
                return g.promise.then ? g.promise : g
            }
        }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {})
    }, {"./log.js": 7, when: 77}], 20: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./enc-base64"), h("./md5"), h("./evpkdf"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                var a = b.lib.BlockCipher, c = b.algo, e = [], d = [], m = [], q = [], g = [], n = [], l = [], z = [], h = [], w = [];
                (function () {
                    for (var a = [], b = 0; 256 > b; b++)a[b] = 128 > b ? b << 1 : b << 1 ^ 283;
                    for (var c = 0, v = 0, b = 0; 256 > b; b++) {
                        var k = v ^ v << 1 ^ v << 2 ^ v << 3 ^ v << 4, k = k >>> 8 ^ k & 255 ^ 99;
                        e[c] = k;
                        d[k] = c;
                        var A = a[c], p = a[A], C = a[p], B = 257 * a[k] ^ 16843008 * k;
                        m[c] = B << 24 | B >>> 8;
                        q[c] = B << 16 | B >>> 16;
                        g[c] = B << 8 | B >>> 24;
                        n[c] = B;
                        B = 16843009 * C ^ 65537 * p ^ 257 * A ^ 16843008 * c;
                        l[k] = B << 24 | B >>> 8;
                        z[k] = B << 16 | B >>> 16;
                        h[k] = B << 8 | B >>> 24;
                        w[k] = B;
                        c ? (c = A ^ a[a[a[C ^ A]]], v ^= a[a[v]]) : c = v = 1
                    }
                })();
                var v = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], c = c.AES = a.extend({_doReset: function () {
                    for (var a = this._key, b = a.words, c = a.sigBytes / 4, a = 4 * ((this._nRounds = c + 6) + 1), d = this._keySchedule = [], g = 0; g < a; g++)if (g < c)d[g] = b[g]; else {
                        var n = d[g - 1];
                        g % c ? 6 < c && 4 == g % c && (n = e[n >>> 24] << 24 | e[n >>> 16 & 255] << 16 | e[n >>> 8 & 255] << 8 | e[n & 255]) : (n = n << 8 | n >>> 24, n = e[n >>> 24] << 24 | e[n >>> 16 & 255] << 16 | e[n >>> 8 & 255] << 8 | e[n & 255], n ^= v[g / c | 0] << 24);
                        d[g] = d[g - c] ^ n
                    }
                    b = this._invKeySchedule = [];
                    for (c = 0; c < a; c++)g = a - c, n = c % 4 ? d[g] : d[g - 4], b[c] = 4 > c || 4 >= g ? n : l[e[n >>> 24]] ^ z[e[n >>> 16 & 255]] ^ h[e[n >>> 8 & 255]] ^ w[e[n & 255]]
                }, encryptBlock: function (a, b) {
                    this._doCryptBlock(a, b, this._keySchedule, m, q, g, n, e)
                }, decryptBlock: function (a, b) {
                    var c = a[b + 1];
                    a[b + 1] = a[b + 3];
                    a[b + 3] = c;
                    this._doCryptBlock(a, b, this._invKeySchedule, l, z, h, w, d);
                    c = a[b + 1];
                    a[b + 1] = a[b + 3];
                    a[b + 3] = c
                }, _doCryptBlock: function (a, b, c, d, g, l, n, e) {
                    for (var m = this._nRounds, z = a[b] ^ c[0], q = a[b + 1] ^ c[1], v = a[b + 2] ^ c[2], h = a[b + 3] ^ c[3], w = 4, P = 1; P < m; P++)var k = d[z >>> 24] ^ g[q >>> 16 & 255] ^ l[v >>> 8 & 255] ^ n[h & 255] ^ c[w++], p = d[q >>> 24] ^ g[v >>> 16 & 255] ^ l[h >>> 8 & 255] ^ n[z & 255] ^ c[w++], r = d[v >>> 24] ^ g[h >>> 16 & 255] ^ l[z >>> 8 & 255] ^ n[q & 255] ^ c[w++], h = d[h >>> 24] ^ g[z >>> 16 & 255] ^ l[q >>> 8 & 255] ^ n[v & 255] ^ c[w++], z = k, q = p, v = r;
                    k = (e[z >>> 24] << 24 | e[q >>> 16 & 255] << 16 | e[v >>> 8 & 255] << 8 | e[h & 255]) ^ c[w++];
                    p = (e[q >>> 24] << 24 | e[v >>> 16 & 255] << 16 | e[h >>> 8 & 255] << 8 | e[z & 255]) ^ c[w++];
                    r = (e[v >>> 24] << 24 | e[h >>> 16 & 255] << 16 | e[z >>> 8 & 255] << 8 | e[q & 255]) ^ c[w++];
                    h = (e[h >>> 24] << 24 | e[z >>> 16 & 255] << 16 | e[q >>> 8 & 255] << 8 | e[v & 255]) ^ c[w++];
                    a[b] = k;
                    a[b + 1] = p;
                    a[b + 2] = r;
                    a[b + 3] = h
                }, keySize: 8});
                b.AES = a._createHelper(c)
            })();
            return b.AES
        })
    }, {"./cipher-core": 21, "./core": 22, "./enc-base64": 23, "./evpkdf": 25, "./md5": 30}], 21: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.lib.Cipher || function (a) {
                var c = b.lib, e = c.Base, d = c.WordArray, m = c.BufferedBlockAlgorithm, q = b.enc.Base64, g = b.algo.EvpKDF, n = c.Cipher = m.extend({cfg: e.extend(), createEncryptor: function (a, b) {
                    return this.create(this._ENC_XFORM_MODE, a, b)
                }, createDecryptor: function (a, b) {
                    return this.create(this._DEC_XFORM_MODE, a, b)
                }, init: function (a, b, c) {
                    this.cfg = this.cfg.extend(c);
                    this._xformMode = a;
                    this._key = b;
                    this.reset()
                }, reset: function () {
                    m.reset.call(this);
                    this._doReset()
                }, process: function (a) {
                    this._append(a);
                    return this._process()
                }, finalize: function (a) {
                    a && this._append(a);
                    return this._doFinalize()
                }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function () {
                    return function (a) {
                        return{encrypt: function (b, c, d) {
                            return("string" == typeof c ? y : v).encrypt(a, b, c, d)
                        }, decrypt: function (b, c, d) {
                            return("string" == typeof c ? y : v).decrypt(a, b, c, d)
                        }}
                    }
                }()});
                c.StreamCipher = n.extend({_doFinalize: function () {
                    return this._process(!0)
                }, blockSize: 1});
                var l = b.mode = {}, z = c.BlockCipherMode = e.extend({createEncryptor: function (a, b) {
                    return this.Encryptor.create(a, b)
                }, createDecryptor: function (a, b) {
                    return this.Decryptor.create(a, b)
                }, init: function (a, b) {
                    this._cipher = a;
                    this._iv = b
                }}), l = l.CBC = function () {
                    function b(c, d, f) {
                        var g = this._iv;
                        g ? this._iv = a : g = this._prevBlock;
                        for (var l = 0; l < f; l++)c[d + l] ^= g[l]
                    }

                    var c = z.extend();
                    c.Encryptor = c.extend({processBlock: function (a, c) {
                        var d = this._cipher, f = d.blockSize;
                        b.call(this, a, c, f);
                        d.encryptBlock(a, c);
                        this._prevBlock = a.slice(c, c + f)
                    }});
                    c.Decryptor = c.extend({processBlock: function (a, c) {
                        var d = this._cipher, f = d.blockSize, g = a.slice(c, c + f);
                        d.decryptBlock(a, c);
                        b.call(this, a, c, f);
                        this._prevBlock = g
                    }});
                    return c
                }(), h = (b.pad = {}).Pkcs7 = {pad: function (a, b) {
                    for (var c = 4 * b, c = c - a.sigBytes % c, g = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4)l.push(g);
                    c = d.create(l, c);
                    a.concat(c)
                }, unpad: function (a) {
                    a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
                }};
                c.BlockCipher = n.extend({cfg: n.cfg.extend({mode: l, padding: h}), reset: function () {
                    n.reset.call(this);
                    var a = this.cfg, b = a.iv, a = a.mode;
                    if (this._xformMode == this._ENC_XFORM_MODE)var c = a.createEncryptor; else c = a.createDecryptor, this._minBufferSize = 1;
                    this._mode = c.call(a, this, b && b.words)
                }, _doProcessBlock: function (a, b) {
                    this._mode.processBlock(a, b)
                }, _doFinalize: function () {
                    var a = this.cfg.padding;
                    if (this._xformMode == this._ENC_XFORM_MODE) {
                        a.pad(this._data, this.blockSize);
                        var b = this._process(!0)
                    } else b = this._process(!0), a.unpad(b);
                    return b
                }, blockSize: 4});
                var w = c.CipherParams = e.extend({init: function (a) {
                    this.mixIn(a)
                }, toString: function (a) {
                    return(a || this.formatter).stringify(this)
                }}), l = (b.format = {}).OpenSSL = {stringify: function (a) {
                    var b = a.ciphertext;
                    a = a.salt;
                    return(a ? d.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(q)
                }, parse: function (a) {
                    a = q.parse(a);
                    var b = a.words;
                    if (1398893684 == b[0] && 1701076831 == b[1]) {
                        var c = d.create(b.slice(2, 4));
                        b.splice(0, 4);
                        a.sigBytes -= 16
                    }
                    return w.create({ciphertext: a, salt: c})
                }}, v = c.SerializableCipher = e.extend({cfg: e.extend({format: l}), encrypt: function (a, b, c, d) {
                    d = this.cfg.extend(d);
                    var g = a.createEncryptor(c, d);
                    b = g.finalize(b);
                    g = g.cfg;
                    return w.create({ciphertext: b, key: c, iv: g.iv, algorithm: a, mode: g.mode, padding: g.padding, blockSize: a.blockSize, formatter: d.format})
                }, decrypt: function (a, b, c, d) {
                    d = this.cfg.extend(d);
                    b = this._parse(b, d.format);
                    return a.createDecryptor(c, d).finalize(b.ciphertext)
                }, _parse: function (a, b) {
                    return"string" == typeof a ? b.parse(a, this) : a
                }}), e = (b.kdf = {}).OpenSSL = {execute: function (a, b, c, l) {
                    l || (l = d.random(8));
                    a = g.create({keySize: b + c}).compute(a, l);
                    c = d.create(a.words.slice(b), 4 * c);
                    a.sigBytes = 4 * b;
                    return w.create({key: a, iv: c, salt: l})
                }}, y = c.PasswordBasedCipher = v.extend({cfg: v.cfg.extend({kdf: e}), encrypt: function (a, b, c, d) {
                    d = this.cfg.extend(d);
                    c = d.kdf.execute(c, a.keySize, a.ivSize);
                    d.iv = c.iv;
                    a = v.encrypt.call(this, a, b, c.key, d);
                    a.mixIn(c);
                    return a
                }, decrypt: function (a, b, c, d) {
                    d = this.cfg.extend(d);
                    b = this._parse(b, d.format);
                    c = d.kdf.execute(c, a.keySize, a.ivSize, b.salt);
                    d.iv = c.iv;
                    return v.decrypt.call(this, a, b, c.key, d)
                }})
            }()
        })
    }, {"./core": 22}], 22: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a() : b.CryptoJS = a()
        })(this, function () {
            var b = b || function (a, b) {
                var e = {}, d = e.lib = {}, m = d.Base = function () {
                    function a() {
                    }

                    return{extend: function (b) {
                        a.prototype = this;
                        var c = new a;
                        b && c.mixIn(b);
                        c.hasOwnProperty("init") || (c.init = function () {
                            c.$super.init.apply(this, arguments)
                        });
                        c.init.prototype = c;
                        c.$super = this;
                        return c
                    }, create: function () {
                        var a = this.extend();
                        a.init.apply(a, arguments);
                        return a
                    }, init: function () {
                    }, mixIn: function (a) {
                        for (var b in a)a.hasOwnProperty(b) && (this[b] = a[b]);
                        a.hasOwnProperty("toString") && (this.toString = a.toString)
                    }, clone: function () {
                        return this.init.prototype.extend(this)
                    }}
                }(), q = d.WordArray = m.extend({init: function (a, d) {
                    a = this.words = a || [];
                    this.sigBytes = d != b ? d : 4 * a.length
                }, toString: function (a) {
                    return(a || n).stringify(this)
                }, concat: function (a) {
                    var b = this.words, c = a.words, d = this.sigBytes;
                    a = a.sigBytes;
                    this.clamp();
                    if (d % 4)for (var g = 0; g < a; g++)b[d + g >>> 2] |= (c[g >>> 2] >>> 24 - g % 4 * 8 & 255) << 24 - (d + g) % 4 * 8; else if (65535 < c.length)for (g = 0; g < a; g += 4)b[d + g >>> 2] = c[g >>> 2]; else b.push.apply(b, c);
                    this.sigBytes += a;
                    return this
                }, clamp: function () {
                    var b = this.words, c = this.sigBytes;
                    b[c >>> 2] &= 4294967295 << 32 - c % 4 * 8;
                    b.length = a.ceil(c / 4)
                }, clone: function () {
                    var a = m.clone.call(this);
                    a.words = this.words.slice(0);
                    return a
                }, random: function (b) {
                    for (var c = [], d = 0; d < b; d += 4)c.push(4294967296 * a.random() | 0);
                    return new q.init(c, b)
                }}), g = e.enc = {}, n = g.Hex = {stringify: function (a) {
                    var b = a.words;
                    a = a.sigBytes;
                    for (var c = [], d = 0; d < a; d++) {
                        var g = b[d >>> 2] >>> 24 - d % 4 * 8 & 255;
                        c.push((g >>> 4).toString(16));
                        c.push((g & 15).toString(16))
                    }
                    return c.join("")
                }, parse: function (a) {
                    for (var b = a.length, c = [], d = 0; d < b; d += 2)c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - d % 8 * 4;
                    return new q.init(c, b / 2)
                }}, l = g.Latin1 = {stringify: function (a) {
                    var b = a.words;
                    a = a.sigBytes;
                    for (var c = [], d = 0; d < a; d++)c.push(String.fromCharCode(b[d >>> 2] >>> 24 - d % 4 * 8 & 255));
                    return c.join("")
                }, parse: function (a) {
                    for (var b = a.length, c = [], d = 0; d < b; d++)c[d >>> 2] |= (a.charCodeAt(d) & 255) << 24 - d % 4 * 8;
                    return new q.init(c, b)
                }}, z = g.Utf8 = {stringify: function (a) {
                    try {
                        return decodeURIComponent(escape(l.stringify(a)))
                    } catch (b) {
                        throw Error("Malformed UTF-8 data");
                    }
                }, parse: function (a) {
                    return l.parse(unescape(encodeURIComponent(a)))
                }}, h = d.BufferedBlockAlgorithm = m.extend({reset: function () {
                    this._data = new q.init;
                    this._nDataBytes = 0
                }, _append: function (a) {
                    "string" == typeof a && (a = z.parse(a));
                    this._data.concat(a);
                    this._nDataBytes += a.sigBytes
                }, _process: function (b) {
                    var c = this._data, d = c.words, g = c.sigBytes, l = this.blockSize, n = g / (4 * l), n = b ? a.ceil(n) : a.max((n | 0) - this._minBufferSize, 0);
                    b = n * l;
                    g = a.min(4 * b, g);
                    if (b) {
                        for (var e = 0; e < b; e += l)this._doProcessBlock(d, e);
                        e = d.splice(0, b);
                        c.sigBytes -= g
                    }
                    return new q.init(e, g)
                }, clone: function () {
                    var a = m.clone.call(this);
                    a._data = this._data.clone();
                    return a
                }, _minBufferSize: 0});
                d.Hasher = h.extend({cfg: m.extend(), init: function (a) {
                    this.cfg = this.cfg.extend(a);
                    this.reset()
                }, reset: function () {
                    h.reset.call(this);
                    this._doReset()
                }, update: function (a) {
                    this._append(a);
                    this._process();
                    return this
                }, finalize: function (a) {
                    a && this._append(a);
                    return this._doFinalize()
                }, blockSize: 16, _createHelper: function (a) {
                    return function (b, c) {
                        return(new a.init(c)).finalize(b)
                    }
                }, _createHmacHelper: function (a) {
                    return function (b, c) {
                        return(new w.HMAC.init(a, c)).finalize(b)
                    }
                }});
                var w = e.algo = {};
                return e
            }(Math);
            return b
        })
    }, {}], 23: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                var a = b.lib.WordArray;
                b.enc.Base64 = {stringify: function (a) {
                    var b = a.words, d = a.sigBytes, m = this._map;
                    a.clamp();
                    a = [];
                    for (var q = 0; q < d; q += 3)for (var g = (b[q >>> 2] >>> 24 - q % 4 * 8 & 255) << 16 | (b[q + 1 >>> 2] >>> 24 - (q + 1) % 4 * 8 & 255) << 8 | b[q + 2 >>> 2] >>> 24 - (q + 2) % 4 * 8 & 255, n = 0; 4 > n && q + 0.75 * n < d; n++)a.push(m.charAt(g >>> 6 * (3 - n) & 63));
                    if (b = m.charAt(64))for (; a.length % 4;)a.push(b);
                    return a.join("")
                }, parse: function (b) {
                    var e = b.length, d = this._map, m = d.charAt(64);
                    m && (m = b.indexOf(m), -1 != m && (e = m));
                    for (var m = [], q = 0, g = 0; g < e; g++)if (g % 4) {
                        var n = d.indexOf(b.charAt(g - 1)) << g % 4 * 2, l = d.indexOf(b.charAt(g)) >>> 6 - g % 4 * 2;
                        m[q >>> 2] |= (n | l) << 24 - q % 4 * 8;
                        q++
                    }
                    return a.create(m, q)
                }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}
            })();
            return b.enc.Base64
        })
    }, {"./core": 22}], 24: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                function a(a) {
                    return a << 8 & 4278255360 | a >>> 8 & 16711935
                }

                var c = b.lib.WordArray, e = b.enc;
                e.Utf16 = e.Utf16BE = {stringify: function (a) {
                    var b = a.words;
                    a = a.sigBytes;
                    for (var c = [], g = 0; g < a; g += 2)c.push(String.fromCharCode(b[g >>> 2] >>> 16 - g % 4 * 8 & 65535));
                    return c.join("")
                }, parse: function (a) {
                    for (var b = a.length, e = [], g = 0; g < b; g++)e[g >>> 1] |= a.charCodeAt(g) << 16 - g % 2 * 16;
                    return c.create(e, 2 * b)
                }};
                e.Utf16LE = {stringify: function (b) {
                    var c = b.words;
                    b = b.sigBytes;
                    for (var e = [], g = 0; g < b; g += 2) {
                        var n = a(c[g >>> 2] >>> 16 - g % 4 * 8 & 65535);
                        e.push(String.fromCharCode(n))
                    }
                    return e.join("")
                }, parse: function (b) {
                    for (var e = b.length, q = [], g = 0; g < e; g++)q[g >>> 1] |= a(b.charCodeAt(g) << 16 - g % 2 * 16);
                    return c.create(q, 2 * e)
                }}
            })();
            return b.enc.Utf16
        })
    }, {"./core": 22}], 25: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./sha1"), h("./hmac")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                var a = b.lib, c = a.Base, e = a.WordArray, a = b.algo, d = a.EvpKDF = c.extend({cfg: c.extend({keySize: 4, hasher: a.MD5, iterations: 1}), init: function (a) {
                    this.cfg = this.cfg.extend(a)
                }, compute: function (a, b) {
                    for (var c = this.cfg, d = c.hasher.create(), l = e.create(), z = l.words, h = c.keySize, c = c.iterations; z.length < h;) {
                        w && d.update(w);
                        var w = d.update(a).finalize(b);
                        d.reset();
                        for (var v = 1; v < c; v++)w = d.finalize(w), d.reset();
                        l.concat(w)
                    }
                    l.sigBytes = 4 * h;
                    return l
                }});
                b.EvpKDF = function (a, b, c) {
                    return d.create(c).compute(a, b)
                }
            })();
            return b.EvpKDF
        })
    }, {"./core": 22, "./hmac": 27, "./sha1": 46}], 26: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function (a) {
                var c = b.lib.CipherParams, e = b.enc.Hex;
                b.format.Hex = {stringify: function (a) {
                    return a.ciphertext.toString(e)
                }, parse: function (a) {
                    a = e.parse(a);
                    return c.create({ciphertext: a})
                }}
            })();
            return b.format.Hex
        })
    }, {"./cipher-core": 21, "./core": 22}], 27: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                var a = b.enc.Utf8;
                b.algo.HMAC = b.lib.Base.extend({init: function (b, e) {
                    b = this._hasher = new b.init;
                    "string" == typeof e && (e = a.parse(e));
                    var d = b.blockSize, m = 4 * d;
                    e.sigBytes > m && (e = b.finalize(e));
                    e.clamp();
                    for (var q = this._oKey = e.clone(), g = this._iKey = e.clone(), n = q.words, l = g.words, z = 0; z < d; z++)n[z] ^= 1549556828, l[z] ^= 909522486;
                    q.sigBytes = g.sigBytes = m;
                    this.reset()
                }, reset: function () {
                    var a = this._hasher;
                    a.reset();
                    a.update(this._iKey)
                }, update: function (a) {
                    this._hasher.update(a);
                    return this
                }, finalize: function (a) {
                    var b = this._hasher;
                    a = b.finalize(a);
                    b.reset();
                    return b.finalize(this._oKey.clone().concat(a))
                }})
            })()
        })
    }, {"./core": 22}], 28: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./x64-core"), h("./lib-typedarrays"), h("./enc-utf16"), h("./enc-base64"), h("./md5"), h("./sha1"), h("./sha256"), h("./sha224"), h("./sha512"), h("./sha384"), h("./sha3"), h("./ripemd160"), h("./hmac"), h("./pbkdf2"), h("./evpkdf"), h("./cipher-core"), h("./mode-cfb"), h("./mode-ctr"), h("./mode-ctr-gladman"), h("./mode-ofb"), h("./mode-ecb"), h("./pad-ansix923"), h("./pad-iso10126"), h("./pad-iso97971"), h("./pad-zeropadding"), h("./pad-nopadding"), h("./format-hex"), h("./aes"), h("./tripledes"), h("./rc4"), h("./rabbit"), h("./rabbit-legacy")) : a(b.CryptoJS)
        })(this, function (b) {
            return b
        })
    }, {"./aes": 20, "./cipher-core": 21, "./core": 22, "./enc-base64": 23, "./enc-utf16": 24, "./evpkdf": 25, "./format-hex": 26, "./hmac": 27, "./lib-typedarrays": 29, "./md5": 30, "./mode-cfb": 31, "./mode-ctr": 33, "./mode-ctr-gladman": 32, "./mode-ecb": 34, "./mode-ofb": 35, "./pad-ansix923": 36, "./pad-iso10126": 37, "./pad-iso97971": 38, "./pad-nopadding": 39, "./pad-zeropadding": 40, "./pbkdf2": 41, "./rabbit": 43, "./rabbit-legacy": 42, "./rc4": 44, "./ripemd160": 45, "./sha1": 46, "./sha224": 47, "./sha256": 48, "./sha3": 49, "./sha384": 50, "./sha512": 51, "./tripledes": 52, "./x64-core": 53}], 29: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                if ("function" == typeof ArrayBuffer) {
                    var a = b.lib.WordArray, c = a.init;
                    (a.init = function (a) {
                        a instanceof ArrayBuffer && (a = new Uint8Array(a));
                        if (a instanceof Int8Array || a instanceof Uint8ClampedArray || a instanceof Int16Array || a instanceof Uint16Array || a instanceof Int32Array || a instanceof Uint32Array || a instanceof Float32Array || a instanceof Float64Array)a = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
                        if (a instanceof Uint8Array) {
                            for (var b = a.byteLength, m = [], q = 0; q < b; q++)m[q >>> 2] |= a[q] << 24 - q % 4 * 8;
                            c.call(this, m, b)
                        } else c.apply(this, arguments)
                    }).prototype = a
                }
            })();
            return b.lib.WordArray
        })
    }, {"./core": 22}], 30: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function (a) {
                function c(a, b, c, d, g, l, f) {
                    a = a + (b & c | ~b & d) + g + f;
                    return(a << l | a >>> 32 - l) + b
                }

                function e(a, b, c, d, g, l, f) {
                    a = a + (b & d | c & ~d) + g + f;
                    return(a << l | a >>> 32 - l) + b
                }

                function d(a, b, c, d, g, l, f) {
                    a = a + (b ^ c ^ d) + g + f;
                    return(a << l | a >>> 32 - l) + b
                }

                function m(a, b, c, d, g, l, f) {
                    a = a + (c ^ (b | ~d)) + g + f;
                    return(a << l | a >>> 32 - l) + b
                }

                var q = b.lib, g = q.WordArray, n = q.Hasher, q = b.algo, l = [];
                (function () {
                    for (var b = 0; 64 > b; b++)l[b] = 4294967296 * a.abs(a.sin(b + 1)) | 0
                })();
                q = q.MD5 = n.extend({_doReset: function () {
                    this._hash = new g.init([1732584193, 4023233417, 2562383102, 271733878])
                }, _doProcessBlock: function (a, b) {
                    for (var g = 0; 16 > g; g++) {
                        var n = b + g, q = a[n];
                        a[n] = (q << 8 | q >>> 24) & 16711935 | (q << 24 | q >>> 8) & 4278255360
                    }
                    var g = this._hash.words, n = a[b + 0], q = a[b + 1], h = a[b + 2], f = a[b + 3], k = a[b + 4], p = a[b + 5], A = a[b + 6], L = a[b + 7], C = a[b + 8], B = a[b +
                        9], E = a[b + 10], I = a[b + 11], Q = a[b + 12], N = a[b + 13], F = a[b + 14], G = a[b + 15], s = g[0], t = g[1], r = g[2], u = g[3], s = c(s, t, r, u, n, 7, l[0]), u = c(u, s, t, r, q, 12, l[1]), r = c(r, u, s, t, h, 17, l[2]), t = c(t, r, u, s, f, 22, l[3]), s = c(s, t, r, u, k, 7, l[4]), u = c(u, s, t, r, p, 12, l[5]), r = c(r, u, s, t, A, 17, l[6]), t = c(t, r, u, s, L, 22, l[7]), s = c(s, t, r, u, C, 7, l[8]), u = c(u, s, t, r, B, 12, l[9]), r = c(r, u, s, t, E, 17, l[10]), t = c(t, r, u, s, I, 22, l[11]), s = c(s, t, r, u, Q, 7, l[12]), u = c(u, s, t, r, N, 12, l[13]), r = c(r, u, s, t, F, 17, l[14]), t = c(t, r, u, s, G, 22, l[15]), s = e(s, t, r, u, q, 5, l[16]), u = e(u, s, t, r, A, 9, l[17]), r = e(r, u, s, t, I, 14, l[18]), t = e(t, r, u, s, n, 20, l[19]), s = e(s, t, r, u, p, 5, l[20]), u = e(u, s, t, r, E, 9, l[21]), r = e(r, u, s, t, G, 14, l[22]), t = e(t, r, u, s, k, 20, l[23]), s = e(s, t, r, u, B, 5, l[24]), u = e(u, s, t, r, F, 9, l[25]), r = e(r, u, s, t, f, 14, l[26]), t = e(t, r, u, s, C, 20, l[27]), s = e(s, t, r, u, N, 5, l[28]), u = e(u, s, t, r, h, 9, l[29]), r = e(r, u, s, t, L, 14, l[30]), t = e(t, r, u, s, Q, 20, l[31]), s = d(s, t, r, u, p, 4, l[32]), u = d(u, s, t, r, C, 11, l[33]), r = d(r, u, s, t, I, 16, l[34]), t = d(t, r, u, s, F, 23, l[35]), s = d(s, t, r, u, q, 4, l[36]), u = d(u, s, t, r, k, 11, l[37]), r = d(r, u, s, t, L, 16, l[38]), t = d(t, r, u, s, E, 23, l[39]), s = d(s, t, r, u, N, 4, l[40]), u = d(u, s, t, r, n, 11, l[41]), r = d(r, u, s, t, f, 16, l[42]), t = d(t, r, u, s, A, 23, l[43]), s = d(s, t, r, u, B, 4, l[44]), u = d(u, s, t, r, Q, 11, l[45]), r = d(r, u, s, t, G, 16, l[46]), t = d(t, r, u, s, h, 23, l[47]), s = m(s, t, r, u, n, 6, l[48]), u = m(u, s, t, r, L, 10, l[49]), r = m(r, u, s, t, F, 15, l[50]), t = m(t, r, u, s, p, 21, l[51]), s = m(s, t, r, u, Q, 6, l[52]), u = m(u, s, t, r, f, 10, l[53]), r = m(r, u, s, t, E, 15, l[54]), t = m(t, r, u, s, q, 21, l[55]), s = m(s, t, r, u, C, 6, l[56]), u = m(u, s, t, r, G, 10, l[57]), r = m(r, u, s, t, A, 15, l[58]), t = m(t, r, u, s, N, 21, l[59]), s = m(s, t, r, u, k, 6, l[60]), u = m(u, s, t, r, I, 10, l[61]), r = m(r, u, s, t, h, 15, l[62]), t = m(t, r, u, s, B, 21, l[63]);
                    g[0] = g[0] + s | 0;
                    g[1] = g[1] + t | 0;
                    g[2] = g[2] + r | 0;
                    g[3] = g[3] + u | 0
                }, _doFinalize: function () {
                    var b = this._data, c = b.words, d = 8 * this._nDataBytes, g = 8 * b.sigBytes;
                    c[g >>> 5] |= 128 << 24 - g % 32;
                    var l = a.floor(d / 4294967296);
                    c[(g + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360;
                    c[(g + 64 >>> 9 << 4) + 14] = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360;
                    b.sigBytes = 4 * (c.length + 1);
                    this._process();
                    b = this._hash;
                    c = b.words;
                    for (d = 0; 4 > d; d++)g = c[d], c[d] = (g << 8 | g >>> 24) & 16711935 | (g << 24 | g >>> 8) & 4278255360;
                    return b
                }, clone: function () {
                    var a = n.clone.call(this);
                    a._hash = this._hash.clone();
                    return a
                }});
                b.MD5 = n._createHelper(q);
                b.HmacMD5 = n._createHmacHelper(q)
            })(Math);
            return b.MD5
        })
    }, {"./core": 22}], 31: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.mode.CFB = function () {
                function a(a, b, c, q) {
                    var g = this._iv;
                    g ? (g = g.slice(0), this._iv = void 0) : g = this._prevBlock;
                    q.encryptBlock(g, 0);
                    for (q = 0; q < c; q++)a[b + q] ^= g[q]
                }

                var c = b.lib.BlockCipherMode.extend();
                c.Encryptor = c.extend({processBlock: function (b, c) {
                    var m = this._cipher, q = m.blockSize;
                    a.call(this, b, c, q, m);
                    this._prevBlock = b.slice(c, c + q)
                }});
                c.Decryptor = c.extend({processBlock: function (b, c) {
                    var m = this._cipher, q = m.blockSize, g = b.slice(c, c + q);
                    a.call(this, b, c, q, m);
                    this._prevBlock = g
                }});
                return c
            }();
            return b.mode.CFB
        })
    }, {"./cipher-core": 21, "./core": 22}], 32: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.mode.CTRGladman = function () {
                function a(a) {
                    if (255 === (a >> 24 & 255)) {
                        var b = a >> 16 & 255, c = a >> 8 & 255, g = a & 255;
                        255 === b ? (b = 0, 255 === c ? (c = 0, 255 === g ? g = 0 : ++g) : ++c) : ++b;
                        a = 0 + (b << 16) + (c << 8);
                        a += g
                    } else a += 16777216;
                    return a
                }

                var c = b.lib.BlockCipherMode.extend(), e = c.Encryptor = c.extend({processBlock: function (b, c) {
                    var e = this._cipher, g = e.blockSize, n = this._iv, l = this._counter;
                    n && (l = this._counter = n.slice(0), this._iv = void 0);
                    n = l;
                    0 === (n[0] = a(n[0])) && (n[1] = a(n[1]));
                    l = l.slice(0);
                    e.encryptBlock(l, 0);
                    for (e = 0; e < g; e++)b[c + e] ^= l[e]
                }});
                c.Decryptor = e;
                return c
            }();
            return b.mode.CTRGladman
        })
    }, {"./cipher-core": 21, "./core": 22}], 33: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.mode.CTR = function () {
                var a = b.lib.BlockCipherMode.extend(), c = a.Encryptor = a.extend({processBlock: function (a, b) {
                    var c = this._cipher, h = c.blockSize, g = this._iv, n = this._counter;
                    g && (n = this._counter = g.slice(0), this._iv = void 0);
                    g = n.slice(0);
                    c.encryptBlock(g, 0);
                    n[h - 1] = n[h - 1] + 1 | 0;
                    for (c = 0; c < h; c++)a[b + c] ^= g[c]
                }});
                a.Decryptor = c;
                return a
            }();
            return b.mode.CTR
        })
    }, {"./cipher-core": 21, "./core": 22}], 34: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.mode.ECB = function () {
                var a = b.lib.BlockCipherMode.extend();
                a.Encryptor = a.extend({processBlock: function (a, b) {
                    this._cipher.encryptBlock(a, b)
                }});
                a.Decryptor = a.extend({processBlock: function (a, b) {
                    this._cipher.decryptBlock(a, b)
                }});
                return a
            }();
            return b.mode.ECB
        })
    }, {"./cipher-core": 21, "./core": 22}], 35: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.mode.OFB = function () {
                var a = b.lib.BlockCipherMode.extend(), c = a.Encryptor = a.extend({processBlock: function (a, b) {
                    var c = this._cipher, h = c.blockSize, g = this._iv, n = this._keystream;
                    g && (n = this._keystream = g.slice(0), this._iv = void 0);
                    c.encryptBlock(n, 0);
                    for (c = 0; c < h; c++)a[b + c] ^= n[c]
                }});
                a.Decryptor = c;
                return a
            }();
            return b.mode.OFB
        })
    }, {"./cipher-core": 21, "./core": 22}], 36: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.pad.AnsiX923 = {pad: function (a, b) {
                var e = a.sigBytes, d = 4 * b, d = d - e % d, e = e + d - 1;
                a.clamp();
                a.words[e >>> 2] |= d << 24 - e % 4 * 8;
                a.sigBytes += d
            }, unpad: function (a) {
                a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
            }};
            return b.pad.Ansix923
        })
    }, {"./cipher-core": 21, "./core": 22}], 37: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.pad.Iso10126 = {pad: function (a, c) {
                var e = 4 * c, e = e - a.sigBytes % e;
                a.concat(b.lib.WordArray.random(e - 1)).concat(b.lib.WordArray.create([e << 24], 1))
            }, unpad: function (a) {
                a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255
            }};
            return b.pad.Iso10126
        })
    }, {"./cipher-core": 21, "./core": 22}], 38: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.pad.Iso97971 = {pad: function (a, c) {
                a.concat(b.lib.WordArray.create([2147483648], 1));
                b.pad.ZeroPadding.pad(a, c)
            }, unpad: function (a) {
                b.pad.ZeroPadding.unpad(a);
                a.sigBytes--
            }};
            return b.pad.Iso97971
        })
    }, {"./cipher-core": 21, "./core": 22}], 39: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.pad.NoPadding = {pad: function () {
            }, unpad: function () {
            }};
            return b.pad.NoPadding
        })
    }, {"./cipher-core": 21, "./core": 22}], 40: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            b.pad.ZeroPadding = {pad: function (a, b) {
                var e = 4 * b;
                a.clamp();
                a.sigBytes += e - (a.sigBytes % e || e)
            }, unpad: function (a) {
                for (var b = a.words, e = a.sigBytes - 1; !(b[e >>> 2] >>> 24 - e % 4 * 8 & 255);)e--;
                a.sigBytes = e + 1
            }};
            return b.pad.ZeroPadding
        })
    }, {"./cipher-core": 21, "./core": 22}], 41: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./sha1"), h("./hmac")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                var a = b.lib, c = a.Base, e = a.WordArray, a = b.algo, d = a.HMAC, m = a.PBKDF2 = c.extend({cfg: c.extend({keySize: 4, hasher: a.SHA1, iterations: 1}), init: function (a) {
                    this.cfg = this.cfg.extend(a)
                }, compute: function (a, b) {
                    for (var c = this.cfg, l = d.create(c.hasher, a), m = e.create(), h = e.create([1]), w = m.words, k = h.words, y = c.keySize, c = c.iterations; w.length < y;) {
                        var p = l.update(b).finalize(h);
                        l.reset();
                        for (var f = p.words, x = f.length, J = p, A = 1; A < c; A++) {
                            J = l.finalize(J);
                            l.reset();
                            for (var L = J.words, C = 0; C < x; C++)f[C] ^= L[C]
                        }
                        m.concat(p);
                        k[0]++
                    }
                    m.sigBytes = 4 * y;
                    return m
                }});
                b.PBKDF2 = function (a, b, c) {
                    return m.create(c).compute(a, b)
                }
            })();
            return b.PBKDF2
        })
    }, {"./core": 22, "./hmac": 27, "./sha1": 46}], 42: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./enc-base64"), h("./md5"), h("./evpkdf"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                function a() {
                    for (var a = this._X, b = this._C, c = 0; 8 > c; c++)d[c] = b[c];
                    b[0] = b[0] + 1295307597 + this._b | 0;
                    b[1] = b[1] + 3545052371 + (b[0] >>> 0 < d[0] >>> 0 ? 1 : 0) | 0;
                    b[2] = b[2] + 886263092 + (b[1] >>> 0 < d[1] >>> 0 ? 1 : 0) | 0;
                    b[3] = b[3] + 1295307597 + (b[2] >>> 0 < d[2] >>> 0 ? 1 : 0) | 0;
                    b[4] = b[4] +
                        3545052371 + (b[3] >>> 0 < d[3] >>> 0 ? 1 : 0) | 0;
                    b[5] = b[5] + 886263092 + (b[4] >>> 0 < d[4] >>> 0 ? 1 : 0) | 0;
                    b[6] = b[6] + 1295307597 + (b[5] >>> 0 < d[5] >>> 0 ? 1 : 0) | 0;
                    b[7] = b[7] + 3545052371 + (b[6] >>> 0 < d[6] >>> 0 ? 1 : 0) | 0;
                    this._b = b[7] >>> 0 < d[7] >>> 0 ? 1 : 0;
                    for (c = 0; 8 > c; c++) {
                        var e = a[c] + b[c], h = e & 65535, q = e >>> 16;
                        m[c] = ((h * h >>> 17) + h * q >>> 15) + q * q ^ ((e & 4294901760) * e | 0) + ((e & 65535) * e | 0)
                    }
                    a[0] = m[0] + (m[7] << 16 | m[7] >>> 16) + (m[6] << 16 | m[6] >>> 16) | 0;
                    a[1] = m[1] + (m[0] << 8 | m[0] >>> 24) + m[7] | 0;
                    a[2] = m[2] + (m[1] << 16 | m[1] >>> 16) + (m[0] << 16 | m[0] >>> 16) | 0;
                    a[3] = m[3] + (m[2] << 8 | m[2] >>> 24) +
                        m[1] | 0;
                    a[4] = m[4] + (m[3] << 16 | m[3] >>> 16) + (m[2] << 16 | m[2] >>> 16) | 0;
                    a[5] = m[5] + (m[4] << 8 | m[4] >>> 24) + m[3] | 0;
                    a[6] = m[6] + (m[5] << 16 | m[5] >>> 16) + (m[4] << 16 | m[4] >>> 16) | 0;
                    a[7] = m[7] + (m[6] << 8 | m[6] >>> 24) + m[5] | 0
                }

                var c = b.lib.StreamCipher, e = [], d = [], m = [], h = b.algo.RabbitLegacy = c.extend({_doReset: function () {
                    for (var b = this._key.words, c = this.cfg.iv, d = this._X = [b[0], b[3] << 16 | b[2] >>> 16, b[1], b[0] << 16 | b[3] >>> 16, b[2], b[1] << 16 | b[0] >>> 16, b[3], b[2] << 16 | b[1] >>> 16], b = this._C = [b[2] << 16 | b[2] >>> 16, b[0] & 4294901760 | b[1] & 65535, b[3] << 16 | b[3] >>> 16, b[1] & 4294901760 | b[2] & 65535, b[0] << 16 | b[0] >>> 16, b[2] & 4294901760 | b[3] & 65535, b[1] << 16 | b[1] >>> 16, b[3] & 4294901760 | b[0] & 65535], e = this._b = 0; 4 > e; e++)a.call(this);
                    for (e = 0; 8 > e; e++)b[e] ^= d[e + 4 & 7];
                    if (c) {
                        var d = c.words, c = d[0], d = d[1], c = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360, d = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, e = c >>> 16 | d & 4294901760, m = d << 16 | c & 65535;
                        b[0] ^= c;
                        b[1] ^= e;
                        b[2] ^= d;
                        b[3] ^= m;
                        b[4] ^= c;
                        b[5] ^= e;
                        b[6] ^= d;
                        b[7] ^= m;
                        for (e = 0; 4 > e; e++)a.call(this)
                    }
                }, _doProcessBlock: function (b, c) {
                    var d = this._X;
                    a.call(this);
                    e[0] = d[0] ^ d[5] >>> 16 ^ d[3] << 16;
                    e[1] = d[2] ^ d[7] >>> 16 ^ d[5] << 16;
                    e[2] = d[4] ^ d[1] >>> 16 ^ d[7] << 16;
                    e[3] = d[6] ^ d[3] >>> 16 ^ d[1] << 16;
                    for (d = 0; 4 > d; d++)e[d] = (e[d] << 8 | e[d] >>> 24) & 16711935 | (e[d] << 24 | e[d] >>> 8) & 4278255360, b[c + d] ^= e[d]
                }, blockSize: 4, ivSize: 2});
                b.RabbitLegacy = c._createHelper(h)
            })();
            return b.RabbitLegacy
        })
    }, {"./cipher-core": 21, "./core": 22, "./enc-base64": 23, "./evpkdf": 25, "./md5": 30}], 43: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./enc-base64"), h("./md5"), h("./evpkdf"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                function a() {
                    for (var a = this._X, b = this._C, c = 0; 8 > c; c++)d[c] = b[c];
                    b[0] = b[0] + 1295307597 + this._b | 0;
                    b[1] = b[1] + 3545052371 + (b[0] >>> 0 < d[0] >>> 0 ? 1 : 0) | 0;
                    b[2] = b[2] + 886263092 + (b[1] >>> 0 < d[1] >>> 0 ? 1 : 0) | 0;
                    b[3] = b[3] + 1295307597 + (b[2] >>> 0 < d[2] >>> 0 ? 1 : 0) | 0;
                    b[4] = b[4] + 3545052371 + (b[3] >>> 0 < d[3] >>> 0 ? 1 : 0) | 0;
                    b[5] = b[5] + 886263092 + (b[4] >>> 0 < d[4] >>> 0 ? 1 : 0) | 0;
                    b[6] = b[6] + 1295307597 + (b[5] >>> 0 < d[5] >>> 0 ? 1 : 0) | 0;
                    b[7] = b[7] + 3545052371 + (b[6] >>> 0 < d[6] >>> 0 ? 1 : 0) | 0;
                    this._b = b[7] >>> 0 < d[7] >>> 0 ? 1 : 0;
                    for (c = 0; 8 > c; c++) {
                        var e = a[c] + b[c], h = e & 65535, q = e >>> 16;
                        m[c] = ((h * h >>> 17) + h * q >>> 15) + q * q ^ ((e & 4294901760) * e | 0) + ((e & 65535) * e | 0)
                    }
                    a[0] = m[0] + (m[7] << 16 | m[7] >>> 16) + (m[6] << 16 | m[6] >>> 16) | 0;
                    a[1] = m[1] + (m[0] << 8 | m[0] >>> 24) + m[7] | 0;
                    a[2] = m[2] + (m[1] << 16 | m[1] >>> 16) + (m[0] << 16 | m[0] >>> 16) | 0;
                    a[3] = m[3] + (m[2] << 8 | m[2] >>> 24) + m[1] | 0;
                    a[4] = m[4] + (m[3] << 16 | m[3] >>> 16) + (m[2] << 16 | m[2] >>> 16) | 0;
                    a[5] = m[5] + (m[4] << 8 | m[4] >>> 24) + m[3] | 0;
                    a[6] = m[6] + (m[5] << 16 | m[5] >>> 16) + (m[4] << 16 | m[4] >>> 16) | 0;
                    a[7] = m[7] + (m[6] << 8 | m[6] >>> 24) + m[5] | 0
                }

                var c = b.lib.StreamCipher, e = [], d = [], m = [], h = b.algo.Rabbit = c.extend({_doReset: function () {
                    for (var b = this._key.words, c = this.cfg.iv, d = 0; 4 > d; d++)b[d] = (b[d] << 8 | b[d] >>> 24) & 16711935 | (b[d] << 24 | b[d] >>> 8) & 4278255360;
                    for (var e = this._X = [b[0], b[3] << 16 | b[2] >>> 16, b[1], b[0] << 16 | b[3] >>> 16, b[2], b[1] << 16 | b[0] >>> 16, b[3], b[2] << 16 | b[1] >>> 16], b = this._C = [b[2] << 16 | b[2] >>> 16, b[0] & 4294901760 | b[1] & 65535, b[3] << 16 | b[3] >>> 16, b[1] & 4294901760 | b[2] & 65535, b[0] << 16 | b[0] >>> 16, b[2] & 4294901760 | b[3] & 65535, b[1] << 16 | b[1] >>> 16, b[3] & 4294901760 | b[0] & 65535], d = this._b = 0; 4 > d; d++)a.call(this);
                    for (d = 0; 8 > d; d++)b[d] ^= e[d + 4 & 7];
                    if (c) {
                        var d = c.words, c = d[0], d = d[1], c = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360, d = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360, e = c >>> 16 | d & 4294901760, m = d << 16 | c & 65535;
                        b[0] ^= c;
                        b[1] ^= e;
                        b[2] ^= d;
                        b[3] ^= m;
                        b[4] ^= c;
                        b[5] ^= e;
                        b[6] ^= d;
                        b[7] ^= m;
                        for (d = 0; 4 > d; d++)a.call(this)
                    }
                }, _doProcessBlock: function (b, c) {
                    var d = this._X;
                    a.call(this);
                    e[0] = d[0] ^ d[5] >>> 16 ^ d[3] << 16;
                    e[1] = d[2] ^ d[7] >>> 16 ^ d[5] << 16;
                    e[2] = d[4] ^ d[1] >>> 16 ^ d[7] << 16;
                    e[3] = d[6] ^ d[3] >>> 16 ^ d[1] << 16;
                    for (d = 0; 4 > d; d++)e[d] = (e[d] << 8 | e[d] >>> 24) & 16711935 | (e[d] << 24 | e[d] >>> 8) & 4278255360, b[c + d] ^= e[d]
                }, blockSize: 4, ivSize: 2});
                b.Rabbit = c._createHelper(h)
            })();
            return b.Rabbit
        })
    }, {"./cipher-core": 21, "./core": 22, "./enc-base64": 23, "./evpkdf": 25, "./md5": 30}], 44: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./enc-base64"), h("./md5"), h("./evpkdf"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                function a() {
                    for (var a = this._S, b = this._i, c = this._j, d = 0, e = 0; 4 > e; e++) {
                        var b = (b + 1) % 256, c = (c + a[b]) % 256, h = a[b];
                        a[b] = a[c];
                        a[c] = h;
                        d |= a[(a[b] + a[c]) % 256] << 24 - 8 * e
                    }
                    this._i = b;
                    this._j = c;
                    return d
                }

                var c = b.lib.StreamCipher, e = b.algo, d = e.RC4 = c.extend({_doReset: function () {
                    for (var a = this._key, b = a.words, a = a.sigBytes, c = this._S = [], d = 0; 256 > d; d++)c[d] = d;
                    for (var e = d = 0; 256 > d; d++) {
                        var h = d % a, e = (e + c[d] + (b[h >>> 2] >>> 24 - h % 4 * 8 & 255)) % 256, h = c[d];
                        c[d] = c[e];
                        c[e] = h
                    }
                    this._i = this._j = 0
                }, _doProcessBlock: function (b, c) {
                    b[c] ^= a.call(this)
                }, keySize: 8, ivSize: 0});
                b.RC4 = c._createHelper(d);
                e = e.RC4Drop = d.extend({cfg: d.cfg.extend({drop: 192}), _doReset: function () {
                    d._doReset.call(this);
                    for (var b = this.cfg.drop; 0 < b; b--)a.call(this)
                }});
                b.RC4Drop = c._createHelper(e)
            })();
            return b.RC4
        })
    }, {"./cipher-core": 21, "./core": 22, "./enc-base64": 23, "./evpkdf": 25, "./md5": 30}], 45: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function (a) {
                function c(a, b) {
                    return a << b | a >>> 32 - b
                }

                a = b.lib;
                var e = a.WordArray, d = a.Hasher;
                a = b.algo;
                var h = e.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]), q = e.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]), g = e.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]), n = e.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]), l = e.create([0, 1518500249, 1859775393, 2400959708, 2840853838]), z = e.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
                a = a.RIPEMD160 = d.extend({_doReset: function () {
                    this._hash = e.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                }, _doProcessBlock: function (a, b) {
                    for (var d = 0; 16 > d; d++) {
                        var e = b + d, k = a[e];
                        a[e] = (k << 8 | k >>> 24) & 16711935 | (k << 24 | k >>> 8) & 4278255360
                    }
                    var e = this._hash.words, k = l.words, f = z.words, p = h.words, J = q.words, A = g.words, L = n.words, C, B, E, I, Q, N, F, G, s, t;
                    N = C = e[0];
                    F = B = e[1];
                    G = E = e[2];
                    s = I = e[3];
                    t = Q = e[4];
                    for (var r, d = 0; 80 > d; d += 1)r = C + a[b + p[d]] | 0, r = 16 > d ? r + ((B ^ E ^ I) + k[0]) : 32 > d ? r + ((B & E | ~B & I) + k[1]) : 48 > d ? r + (((B | ~E) ^ I) + k[2]) : 64 > d ? r + ((B & I | E & ~I) + k[3]) : r + ((B ^ (E | ~I)) + k[4]), r |= 0, r = c(r, A[d]), r = r + Q | 0, C = Q, Q = I, I = c(E, 10), E = B, B = r, r = N + a[b + J[d]] | 0, r = 16 > d ? r + ((F ^ (G | ~s)) + f[0]) : 32 > d ? r + ((F & s | G & ~s) + f[1]) : 48 > d ? r + (((F | ~G) ^ s) + f[2]) : 64 > d ? r + ((F & G | ~F & s) + f[3]) : r + ((F ^ G ^ s) + f[4]), r |= 0, r = c(r, L[d]), r = r + t | 0, N = t, t = s, s = c(G, 10), G = F, F = r;
                    r = e[1] + E + s | 0;
                    e[1] = e[2] + I + t | 0;
                    e[2] = e[3] + Q + N | 0;
                    e[3] = e[4] + C + F | 0;
                    e[4] = e[0] + B + G | 0;
                    e[0] = r
                }, _doFinalize: function () {
                    var a = this._data, b = a.words, c = 8 * this._nDataBytes, d = 8 * a.sigBytes;
                    b[d >>> 5] |= 128 << 24 - d % 32;
                    b[(d + 64 >>> 9 << 4) + 14] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360;
                    a.sigBytes = 4 * (b.length + 1);
                    this._process();
                    a = this._hash;
                    b = a.words;
                    for (c = 0; 5 > c; c++)d = b[c], b[c] = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360;
                    return a
                }, clone: function () {
                    var a = d.clone.call(this);
                    a._hash = this._hash.clone();
                    return a
                }});
                b.RIPEMD160 = d._createHelper(a);
                b.HmacRIPEMD160 = d._createHmacHelper(a)
            })(Math);
            return b.RIPEMD160
        })
    }, {"./core": 22}], 46: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                var a = b.lib, c = a.WordArray, e = a.Hasher, d = [], a = b.algo.SHA1 = e.extend({_doReset: function () {
                    this._hash = new c.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
                }, _doProcessBlock: function (a, b) {
                    for (var c = this._hash.words, e = c[0], l = c[1], h = c[2], k = c[3], w = c[4], p = 0; 80 > p; p++) {
                        if (16 > p)d[p] = a[b + p] | 0; else {
                            var y = d[p - 3] ^ d[p - 8] ^ d[p - 14] ^ d[p - 16];
                            d[p] = y << 1 | y >>> 31
                        }
                        y = (e << 5 | e >>> 27) + w + d[p];
                        y = 20 > p ? y + ((l & h | ~l & k) + 1518500249) : 40 > p ? y + ((l ^ h ^ k) + 1859775393) : 60 > p ? y + ((l & h | l & k | h & k) - 1894007588) : y + ((l ^ h ^ k) - 899497514);
                        w = k;
                        k = h;
                        h = l << 30 | l >>> 2;
                        l = e;
                        e = y
                    }
                    c[0] = c[0] + e | 0;
                    c[1] = c[1] + l | 0;
                    c[2] = c[2] + h | 0;
                    c[3] = c[3] + k | 0;
                    c[4] = c[4] + w | 0
                }, _doFinalize: function () {
                    var a = this._data, b = a.words, c = 8 * this._nDataBytes, d = 8 * a.sigBytes;
                    b[d >>> 5] |= 128 << 24 - d % 32;
                    b[(d + 64 >>> 9 << 4) + 14] = Math.floor(c / 4294967296);
                    b[(d + 64 >>> 9 << 4) + 15] = c;
                    a.sigBytes = 4 * b.length;
                    this._process();
                    return this._hash
                }, clone: function () {
                    var a = e.clone.call(this);
                    a._hash = this._hash.clone();
                    return a
                }});
                b.SHA1 = e._createHelper(a);
                b.HmacSHA1 = e._createHmacHelper(a)
            })();
            return b.SHA1
        })
    }, {"./core": 22}], 47: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./sha256")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                var a = b.lib.WordArray, c = b.algo, e = c.SHA256, c = c.SHA224 = e.extend({_doReset: function () {
                    this._hash = new a.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
                }, _doFinalize: function () {
                    var a = e._doFinalize.call(this);
                    a.sigBytes -= 4;
                    return a
                }});
                b.SHA224 = e._createHelper(c);
                b.HmacSHA224 = e._createHmacHelper(c)
            })();
            return b.SHA224
        })
    }, {"./core": 22, "./sha256": 48}], 48: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function (a) {
                var c = b.lib, e = c.WordArray, d = c.Hasher, c = b.algo, h = [], q = [];
                (function () {
                    function b(c) {
                        for (var d = a.sqrt(c), g = 2; g <= d; g++)if (!(c % g))return!1;
                        return!0
                    }

                    function c(a) {
                        return 4294967296 * (a - (a | 0)) | 0
                    }

                    for (var d = 2, g = 0; 64 > g;)b(d) && (8 > g && (h[g] = c(a.pow(d, 0.5))), q[g] = c(a.pow(d, 1 / 3)), g++), d++
                })();
                var g = [], c = c.SHA256 = d.extend({_doReset: function () {
                    this._hash = new e.init(h.slice(0))
                }, _doProcessBlock: function (a, b) {
                    for (var c = this._hash.words, d = c[0], e = c[1], h = c[2], m = c[3], k = c[4], f = c[5], p = c[6], J = c[7], A = 0; 64 > A; A++) {
                        if (16 > A)g[A] = a[b +
                            A] | 0; else {
                            var L = g[A - 15], C = g[A - 2];
                            g[A] = ((L << 25 | L >>> 7) ^ (L << 14 | L >>> 18) ^ L >>> 3) + g[A - 7] + ((C << 15 | C >>> 17) ^ (C << 13 | C >>> 19) ^ C >>> 10) + g[A - 16]
                        }
                        L = J + ((k << 26 | k >>> 6) ^ (k << 21 | k >>> 11) ^ (k << 7 | k >>> 25)) + (k & f ^ ~k & p) + q[A] + g[A];
                        C = ((d << 30 | d >>> 2) ^ (d << 19 | d >>> 13) ^ (d << 10 | d >>> 22)) + (d & e ^ d & h ^ e & h);
                        J = p;
                        p = f;
                        f = k;
                        k = m + L | 0;
                        m = h;
                        h = e;
                        e = d;
                        d = L + C | 0
                    }
                    c[0] = c[0] + d | 0;
                    c[1] = c[1] + e | 0;
                    c[2] = c[2] + h | 0;
                    c[3] = c[3] + m | 0;
                    c[4] = c[4] + k | 0;
                    c[5] = c[5] + f | 0;
                    c[6] = c[6] + p | 0;
                    c[7] = c[7] + J | 0
                }, _doFinalize: function () {
                    var b = this._data, c = b.words, d = 8 * this._nDataBytes, g = 8 * b.sigBytes;
                    c[g >>> 5] |= 128 << 24 - g % 32;
                    c[(g + 64 >>> 9 << 4) + 14] = a.floor(d / 4294967296);
                    c[(g + 64 >>> 9 << 4) + 15] = d;
                    b.sigBytes = 4 * c.length;
                    this._process();
                    return this._hash
                }, clone: function () {
                    var a = d.clone.call(this);
                    a._hash = this._hash.clone();
                    return a
                }});
                b.SHA256 = d._createHelper(c);
                b.HmacSHA256 = d._createHmacHelper(c)
            })(Math);
            return b.SHA256
        })
    }, {"./core": 22}], 49: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./x64-core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function (a) {
                var c = b.lib, e = c.WordArray, d = c.Hasher, h = b.x64.Word, c = b.algo, q = [], g = [], n = [];
                (function () {
                    for (var a = 1, b = 0, c = 0; 24 > c; c++) {
                        q[a + 5 * b] = (c + 1) * (c + 2) / 2 % 64;
                        var d = (2 * a + 3 * b) % 5, a = b % 5, b = d
                    }
                    for (a = 0; 5 > a; a++)for (b = 0; 5 > b; b++)g[a + 5 * b] = b + (2 * a + 3 * b) % 5 * 5;
                    a = 1;
                    for (b = 0; 24 > b; b++) {
                        for (var e = d = c = 0; 7 > e; e++) {
                            if (a & 1) {
                                var l = (1 << e) - 1;
                                32 > l ? d ^= 1 << l : c ^= 1 << l - 32
                            }
                            a = a & 128 ? a << 1 ^ 113 : a << 1
                        }
                        n[b] = h.create(c, d)
                    }
                })();
                var l = [];
                (function () {
                    for (var a = 0; 25 > a; a++)l[a] = h.create()
                })();
                c = c.SHA3 = d.extend({cfg: d.cfg.extend({outputLength: 512}), _doReset: function () {
                    for (var a = this._state = [], b = 0; 25 > b; b++)a[b] = new h.init;
                    this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
                }, _doProcessBlock: function (a, b) {
                    for (var c = this._state, d = this.blockSize / 2, e = 0; e < d; e++) {
                        var h = a[b + 2 * e], f = a[b + 2 * e + 1], h = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360, f = (f << 8 | f >>> 24) & 16711935 | (f << 24 | f >>> 8) & 4278255360, m = c[e];
                        m.high ^= f;
                        m.low ^= h
                    }
                    for (d = 0; 24 > d; d++) {
                        for (e = 0; 5 > e; e++) {
                            for (var k = h = 0, p = 0; 5 > p; p++)m = c[e + 5 * p], h ^= m.high, k ^= m.low;
                            m = l[e];
                            m.high = h;
                            m.low = k
                        }
                        for (e = 0; 5 > e; e++)for (m = l[(e + 4) % 5], h = l[(e + 1) % 5], f = h.high, p = h.low, h = m.high ^ (f << 1 | p >>> 31), k = m.low ^ (p << 1 | f >>> 31), p = 0; 5 > p; p++)m = c[e + 5 * p], m.high ^= h, m.low ^= k;
                        for (f = 1; 25 > f; f++)m = c[f], e = m.high, m = m.low, p = q[f], 32 > p ? (h = e << p | m >>> 32 - p, k = m << p | e >>> 32 - p) : (h = m << p - 32 | e >>> 64 - p, k = e << p - 32 | m >>> 64 - p), m = l[g[f]], m.high = h, m.low = k;
                        m = l[0];
                        e = c[0];
                        m.high = e.high;
                        m.low = e.low;
                        for (e = 0; 5 > e; e++)for (p = 0; 5 > p; p++)f = e + 5 * p, m = c[f], h = l[f], f = l[(e + 1) % 5 + 5 * p], k = l[(e + 2) % 5 + 5 * p], m.high = h.high ^ ~f.high & k.high, m.low = h.low ^ ~f.low & k.low;
                        m = c[0];
                        e = n[d];
                        m.high ^= e.high;
                        m.low ^= e.low
                    }
                }, _doFinalize: function () {
                    var b = this._data, c = b.words, d = 8 * b.sigBytes, g = 32 * this.blockSize;
                    c[d >>> 5] |= 1 << 24 - d % 32;
                    c[(a.ceil((d + 1) / g) * g >>> 5) - 1] |= 128;
                    b.sigBytes = 4 * c.length;
                    this._process();
                    for (var b = this._state, c = this.cfg.outputLength / 8, d = c / 8, g = [], l = 0; l < d; l++) {
                        var h = b[l], f = h.high, h = h.low, f = (f << 8 | f >>> 24) & 16711935 | (f << 24 | f >>> 8) & 4278255360, h = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360;
                        g.push(h);
                        g.push(f)
                    }
                    return new e.init(g, c)
                }, clone: function () {
                    for (var a = d.clone.call(this), b = a._state = this._state.slice(0), c = 0; 25 > c; c++)b[c] = b[c].clone();
                    return a
                }});
                b.SHA3 = d._createHelper(c);
                b.HmacSHA3 = d._createHmacHelper(c)
            })(Math);
            return b.SHA3
        })
    }, {"./core": 22, "./x64-core": 53}], 50: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./x64-core"), h("./sha512")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                var a = b.x64, c = a.Word, e = a.WordArray, a = b.algo, d = a.SHA512, a = a.SHA384 = d.extend({_doReset: function () {
                    this._hash = new e.init([new c.init(3418070365, 3238371032), new c.init(1654270250, 914150663), new c.init(2438529370, 812702999), new c.init(355462360, 4144912697), new c.init(1731405415, 4290775857), new c.init(2394180231, 1750603025), new c.init(3675008525, 1694076839), new c.init(1203062813, 3204075428)])
                }, _doFinalize: function () {
                    var a = d._doFinalize.call(this);
                    a.sigBytes -= 16;
                    return a
                }});
                b.SHA384 = d._createHelper(a);
                b.HmacSHA384 = d._createHmacHelper(a)
            })();
            return b.SHA384
        })
    }, {"./core": 22, "./sha512": 51, "./x64-core": 53}], 51: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./x64-core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                function a() {
                    return d.create.apply(d, arguments)
                }

                var c = b.lib.Hasher, e = b.x64, d = e.Word, h = e.WordArray, e = b.algo, q = [a(1116352408, 3609767458), a(1899447441, 602891725), a(3049323471, 3964484399), a(3921009573, 2173295548), a(961987163, 4081628472), a(1508970993, 3053834265), a(2453635748, 2937671579), a(2870763221, 3664609560), a(3624381080, 2734883394), a(310598401, 1164996542), a(607225278, 1323610764), a(1426881987, 3590304994), a(1925078388, 4068182383), a(2162078206, 991336113), a(2614888103, 633803317), a(3248222580, 3479774868), a(3835390401, 2666613458), a(4022224774, 944711139), a(264347078, 2341262773), a(604807628, 2007800933), a(770255983, 1495990901), a(1249150122, 1856431235), a(1555081692, 3175218132), a(1996064986, 2198950837), a(2554220882, 3999719339), a(2821834349, 766784016), a(2952996808, 2566594879), a(3210313671, 3203337956), a(3336571891, 1034457026), a(3584528711, 2466948901), a(113926993, 3758326383), a(338241895, 168717936), a(666307205, 1188179964), a(773529912, 1546045734), a(1294757372, 1522805485), a(1396182291, 2643833823), a(1695183700, 2343527390), a(1986661051, 1014477480), a(2177026350, 1206759142), a(2456956037, 344077627), a(2730485921, 1290863460), a(2820302411, 3158454273), a(3259730800, 3505952657), a(3345764771, 106217008), a(3516065817, 3606008344), a(3600352804, 1432725776), a(4094571909, 1467031594), a(275423344, 851169720), a(430227734, 3100823752), a(506948616, 1363258195), a(659060556, 3750685593), a(883997877, 3785050280), a(958139571, 3318307427), a(1322822218, 3812723403), a(1537002063, 2003034995), a(1747873779, 3602036899), a(1955562222, 1575990012), a(2024104815, 1125592928), a(2227730452, 2716904306), a(2361852424, 442776044), a(2428436474, 593698344), a(2756734187, 3733110249), a(3204031479, 2999351573), a(3329325298, 3815920427), a(3391569614, 3928383900), a(3515267271, 566280711), a(3940187606, 3454069534), a(4118630271, 4000239992), a(116418474, 1914138554), a(174292421, 2731055270), a(289380356, 3203993006), a(460393269, 320620315), a(685471733, 587496836), a(852142971, 1086792851), a(1017036298, 365543100), a(1126000580, 2618297676), a(1288033470, 3409855158), a(1501505948, 4234509866), a(1607167915, 987167468), a(1816402316, 1246189591)], g = [];
                (function () {
                    for (var b = 0; 80 > b; b++)g[b] = a()
                })();
                e = e.SHA512 = c.extend({_doReset: function () {
                    this._hash = new h.init([new d.init(1779033703, 4089235720), new d.init(3144134277, 2227873595), new d.init(1013904242, 4271175723), new d.init(2773480762, 1595750129), new d.init(1359893119, 2917565137), new d.init(2600822924, 725511199), new d.init(528734635, 4215389547), new d.init(1541459225, 327033209)])
                }, _doProcessBlock: function (a, b) {
                    for (var c = this._hash.words, d = c[0], e = c[1], h = c[2], m = c[3], k = c[4], f = c[5], p = c[6], c = c[7], J = d.high, A = d.low, L = e.high, C = e.low, B = h.high, E = h.low, I = m.high, Q = m.low, N = k.high, F = k.low, G = f.high, s = f.low, t = p.high, r = p.low, u = c.high, V = c.low, S = J, M = A, R = L, O = C, aa = B, ea = E, ma = I, fa = Q, X = N, T = F, ja = G, ia = s, ka = t, ga = r, ha = u, da = V, U = 0; 80 > U; U++) {
                        var $ = g[U];
                        if (16 > U)var W = $.high = a[b + 2 * U] | 0, D = $.low = a[b + 2 * U + 1] | 0; else {
                            var W = g[U - 15], D = W.high, Y = W.low, W = (D >>> 1 | Y << 31) ^ (D >>> 8 | Y << 24) ^ D >>> 7, Y = (Y >>> 1 | D << 31) ^ (Y >>> 8 | D << 24) ^ (Y >>> 7 | D << 25), ca = g[U - 2], D = ca.high, K = ca.low, ca = (D >>> 19 | K << 13) ^ (D << 3 | K >>> 29) ^ D >>> 6, K = (K >>> 19 | D << 13) ^ (K << 3 | D >>> 29) ^ (K >>> 6 | D << 26), D = g[U - 7], na = D.high, ba = g[U - 16], Z = ba.high, ba = ba.low, D = Y + D.low, W = W + na + (D >>> 0 < Y >>> 0 ? 1 : 0), D = D + K, W = W + ca + (D >>> 0 < K >>> 0 ? 1 : 0), D = D + ba, W = W + Z + (D >>> 0 < ba >>> 0 ? 1 : 0);
                            $.high = W;
                            $.low = D
                        }
                        var na = X & ja ^ ~X & ka, ba = T & ia ^ ~T & ga, $ = S & R ^ S & aa ^ R & aa, pa = M & O ^ M & ea ^ O & ea, Y = (S >>> 28 | M << 4) ^ (S << 30 | M >>> 2) ^ (S << 25 | M >>> 7), ca = (M >>> 28 | S << 4) ^ (M << 30 | S >>> 2) ^ (M << 25 | S >>> 7), K = q[U], qa = K.high, oa = K.low, K = da + ((T >>> 14 | X << 18) ^ (T >>> 18 | X << 14) ^ (T << 23 | X >>> 9)), Z = ha + ((X >>> 14 | T << 18) ^ (X >>> 18 | T << 14) ^ (X << 23 | T >>> 9)) + (K >>> 0 < da >>> 0 ? 1 : 0), K = K + ba, Z = Z +
                            na + (K >>> 0 < ba >>> 0 ? 1 : 0), K = K + oa, Z = Z + qa + (K >>> 0 < oa >>> 0 ? 1 : 0), K = K + D, Z = Z + W + (K >>> 0 < D >>> 0 ? 1 : 0), D = ca + pa, $ = Y + $ + (D >>> 0 < ca >>> 0 ? 1 : 0), ha = ka, da = ga, ka = ja, ga = ia, ja = X, ia = T, T = fa + K | 0, X = ma + Z + (T >>> 0 < fa >>> 0 ? 1 : 0) | 0, ma = aa, fa = ea, aa = R, ea = O, R = S, O = M, M = K + D | 0, S = Z + $ + (M >>> 0 < K >>> 0 ? 1 : 0) | 0
                    }
                    A = d.low = A + M;
                    d.high = J + S + (A >>> 0 < M >>> 0 ? 1 : 0);
                    C = e.low = C + O;
                    e.high = L + R + (C >>> 0 < O >>> 0 ? 1 : 0);
                    E = h.low = E + ea;
                    h.high = B + aa + (E >>> 0 < ea >>> 0 ? 1 : 0);
                    Q = m.low = Q + fa;
                    m.high = I + ma + (Q >>> 0 < fa >>> 0 ? 1 : 0);
                    F = k.low = F + T;
                    k.high = N + X + (F >>> 0 < T >>> 0 ? 1 : 0);
                    s = f.low = s + ia;
                    f.high = G + ja + (s >>> 0 < ia >>> 0 ? 1 : 0);
                    r = p.low = r + ga;
                    p.high = t + ka + (r >>> 0 < ga >>> 0 ? 1 : 0);
                    V = c.low = V + da;
                    c.high = u + ha + (V >>> 0 < da >>> 0 ? 1 : 0)
                }, _doFinalize: function () {
                    var a = this._data, b = a.words, c = 8 * this._nDataBytes, d = 8 * a.sigBytes;
                    b[d >>> 5] |= 128 << 24 - d % 32;
                    b[(d + 128 >>> 10 << 5) + 30] = Math.floor(c / 4294967296);
                    b[(d + 128 >>> 10 << 5) + 31] = c;
                    a.sigBytes = 4 * b.length;
                    this._process();
                    return this._hash.toX32()
                }, clone: function () {
                    var a = c.clone.call(this);
                    a._hash = this._hash.clone();
                    return a
                }, blockSize: 32});
                b.SHA512 = c._createHelper(e);
                b.HmacSHA512 = c._createHmacHelper(e)
            })();
            return b.SHA512
        })
    }, {"./core": 22, "./x64-core": 53}], 52: [function (h, p, k) {
        (function (b, a, c) {
            "object" === typeof k ? p.exports = k = a(h("./core"), h("./enc-base64"), h("./md5"), h("./evpkdf"), h("./cipher-core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function () {
                function a(a, b) {
                    var c = (this._lBlock >>> a ^ this._rBlock) & b;
                    this._rBlock ^= c;
                    this._lBlock ^= c << a
                }

                function c(a, b) {
                    var c = (this._rBlock >>> a ^ this._lBlock) & b;
                    this._lBlock ^= c;
                    this._rBlock ^= c << a
                }

                var e = b.lib, d = e.WordArray, e = e.BlockCipher, h = b.algo, k = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4], g = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32], n = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28], l = [
                    {0: 8421888, 268435456: 32768, 536870912: 8421378, 805306368: 2, 1073741824: 512, 1342177280: 8421890, 1610612736: 8389122, 1879048192: 8388608, 2147483648: 514, 2415919104: 8389120, 2684354560: 33280, 2952790016: 8421376, 3221225472: 32770, 3489660928: 8388610, 3758096384: 0, 4026531840: 33282, 134217728: 0, 402653184: 8421890, 671088640: 33282, 939524096: 32768, 1207959552: 8421888, 1476395008: 512, 1744830464: 8421378, 2013265920: 2, 2281701376: 8389120, 2550136832: 33280, 2818572288: 8421376, 3087007744: 8389122, 3355443200: 8388610, 3623878656: 32770, 3892314112: 514, 4160749568: 8388608, 1: 32768, 268435457: 2, 536870913: 8421888, 805306369: 8388608, 1073741825: 8421378, 1342177281: 33280, 1610612737: 512, 1879048193: 8389122, 2147483649: 8421890, 2415919105: 8421376, 2684354561: 8388610, 2952790017: 33282, 3221225473: 514, 3489660929: 8389120, 3758096385: 32770, 4026531841: 0, 134217729: 8421890, 402653185: 8421376, 671088641: 8388608, 939524097: 512, 1207959553: 32768, 1476395009: 8388610, 1744830465: 2, 2013265921: 33282, 2281701377: 32770, 2550136833: 8389122, 2818572289: 514, 3087007745: 8421888, 3355443201: 8389120, 3623878657: 0, 3892314113: 33280, 4160749569: 8421378},
                    {0: 1074282512, 16777216: 16384, 33554432: 524288, 50331648: 1074266128, 67108864: 1073741840, 83886080: 1074282496, 100663296: 1073758208, 117440512: 16, 134217728: 540672, 150994944: 1073758224, 167772160: 1073741824, 184549376: 540688, 201326592: 524304, 218103808: 0, 234881024: 16400, 251658240: 1074266112, 8388608: 1073758208, 25165824: 540688, 41943040: 16, 58720256: 1073758224, 75497472: 1074282512, 92274688: 1073741824, 109051904: 524288, 125829120: 1074266128, 142606336: 524304, 159383552: 0, 176160768: 16384, 192937984: 1074266112, 209715200: 1073741840, 226492416: 540672, 243269632: 1074282496, 260046848: 16400, 268435456: 0, 285212672: 1074266128, 301989888: 1073758224, 318767104: 1074282496, 335544320: 1074266112, 352321536: 16, 369098752: 540688, 385875968: 16384, 402653184: 16400, 419430400: 524288, 436207616: 524304, 452984832: 1073741840, 469762048: 540672, 486539264: 1073758208, 503316480: 1073741824, 520093696: 1074282512, 276824064: 540688, 293601280: 524288, 310378496: 1074266112, 327155712: 16384, 343932928: 1073758208, 360710144: 1074282512, 377487360: 16, 394264576: 1073741824, 411041792: 1074282496, 427819008: 1073741840, 444596224: 1073758224, 461373440: 524304, 478150656: 0, 494927872: 16400, 511705088: 1074266128, 528482304: 540672},
                    {0: 260, 1048576: 0, 2097152: 67109120, 3145728: 65796, 4194304: 65540, 5242880: 67108868, 6291456: 67174660, 7340032: 67174400, 8388608: 67108864, 9437184: 67174656, 10485760: 65792, 11534336: 67174404, 12582912: 67109124, 13631488: 65536, 14680064: 4, 15728640: 256, 524288: 67174656, 1572864: 67174404, 2621440: 0, 3670016: 67109120, 4718592: 67108868, 5767168: 65536, 6815744: 65540, 7864320: 260, 8912896: 4, 9961472: 256, 11010048: 67174400, 12058624: 65796, 13107200: 65792, 14155776: 67109124, 15204352: 67174660, 16252928: 67108864, 16777216: 67174656, 17825792: 65540, 18874368: 65536, 19922944: 67109120, 20971520: 256, 22020096: 67174660, 23068672: 67108868, 24117248: 0, 25165824: 67109124, 26214400: 67108864, 27262976: 4, 28311552: 65792, 29360128: 67174400, 30408704: 260, 31457280: 65796, 32505856: 67174404, 17301504: 67108864, 18350080: 260, 19398656: 67174656, 20447232: 0, 21495808: 65540, 22544384: 67109120, 23592960: 256, 24641536: 67174404, 25690112: 65536, 26738688: 67174660, 27787264: 65796, 28835840: 67108868, 29884416: 67109124, 30932992: 67174400, 31981568: 4, 33030144: 65792},
                    {0: 2151682048, 65536: 2147487808, 131072: 4198464, 196608: 2151677952, 262144: 0, 327680: 4198400, 393216: 2147483712, 458752: 4194368, 524288: 2147483648, 589824: 4194304, 655360: 64, 720896: 2147487744, 786432: 2151678016, 851968: 4160, 917504: 4096, 983040: 2151682112, 32768: 2147487808, 98304: 64, 163840: 2151678016, 229376: 2147487744, 294912: 4198400, 360448: 2151682112, 425984: 0, 491520: 2151677952, 557056: 4096, 622592: 2151682048, 688128: 4194304, 753664: 4160, 819200: 2147483648, 884736: 4194368, 950272: 4198464, 1015808: 2147483712, 1048576: 4194368, 1114112: 4198400, 1179648: 2147483712, 1245184: 0, 1310720: 4160, 1376256: 2151678016, 1441792: 2151682048, 1507328: 2147487808, 1572864: 2151682112, 1638400: 2147483648, 1703936: 2151677952, 1769472: 4198464, 1835008: 2147487744, 1900544: 4194304, 1966080: 64, 2031616: 4096, 1081344: 2151677952, 1146880: 2151682112, 1212416: 0, 1277952: 4198400, 1343488: 4194368, 1409024: 2147483648, 1474560: 2147487808, 1540096: 64, 1605632: 2147483712, 1671168: 4096, 1736704: 2147487744, 1802240: 2151678016, 1867776: 4160, 1933312: 2151682048, 1998848: 4194304, 2064384: 4198464},
                    {0: 128, 4096: 17039360, 8192: 262144, 12288: 536870912, 16384: 537133184, 20480: 16777344, 24576: 553648256, 28672: 262272, 32768: 16777216, 36864: 537133056, 40960: 536871040, 45056: 553910400, 49152: 553910272, 53248: 0, 57344: 17039488, 61440: 553648128, 2048: 17039488, 6144: 553648256, 10240: 128, 14336: 17039360, 18432: 262144, 22528: 537133184, 26624: 553910272, 30720: 536870912, 34816: 537133056, 38912: 0, 43008: 553910400, 47104: 16777344, 51200: 536871040, 55296: 553648128, 59392: 16777216, 63488: 262272, 65536: 262144, 69632: 128, 73728: 536870912, 77824: 553648256, 81920: 16777344, 86016: 553910272, 90112: 537133184, 94208: 16777216, 98304: 553910400, 102400: 553648128, 106496: 17039360, 110592: 537133056, 114688: 262272, 118784: 536871040, 122880: 0, 126976: 17039488, 67584: 553648256, 71680: 16777216, 75776: 17039360, 79872: 537133184, 83968: 536870912, 88064: 17039488, 92160: 128, 96256: 553910272, 100352: 262272, 104448: 553910400, 108544: 0, 112640: 553648128, 116736: 16777344, 120832: 262144, 124928: 537133056, 129024: 536871040},
                    {0: 268435464, 256: 8192, 512: 270532608, 768: 270540808, 1024: 268443648, 1280: 2097152, 1536: 2097160, 1792: 268435456, 2048: 0, 2304: 268443656, 2560: 2105344, 2816: 8, 3072: 270532616, 3328: 2105352, 3584: 8200, 3840: 270540800, 128: 270532608, 384: 270540808, 640: 8, 896: 2097152, 1152: 2105352, 1408: 268435464, 1664: 268443648, 1920: 8200, 2176: 2097160, 2432: 8192, 2688: 268443656, 2944: 270532616, 3200: 0, 3456: 270540800, 3712: 2105344, 3968: 268435456, 4096: 268443648, 4352: 270532616, 4608: 270540808, 4864: 8200, 5120: 2097152, 5376: 268435456, 5632: 268435464, 5888: 2105344, 6144: 2105352, 6400: 0, 6656: 8, 6912: 270532608, 7168: 8192, 7424: 268443656, 7680: 270540800, 7936: 2097160, 4224: 8, 4480: 2105344, 4736: 2097152, 4992: 268435464, 5248: 268443648, 5504: 8200, 5760: 270540808, 6016: 270532608, 6272: 270540800, 6528: 270532616, 6784: 8192, 7040: 2105352, 7296: 2097160, 7552: 0, 7808: 268435456, 8064: 268443656},
                    {0: 1048576, 16: 33555457, 32: 1024, 48: 1049601, 64: 34604033, 80: 0, 96: 1, 112: 34603009, 128: 33555456, 144: 1048577, 160: 33554433, 176: 34604032, 192: 34603008, 208: 1025, 224: 1049600, 240: 33554432, 8: 34603009, 24: 0, 40: 33555457, 56: 34604032, 72: 1048576, 88: 33554433, 104: 33554432, 120: 1025, 136: 1049601, 152: 33555456, 168: 34603008, 184: 1048577, 200: 1024, 216: 34604033, 232: 1, 248: 1049600, 256: 33554432, 272: 1048576, 288: 33555457, 304: 34603009, 320: 1048577, 336: 33555456, 352: 34604032, 368: 1049601, 384: 1025, 400: 34604033, 416: 1049600, 432: 1, 448: 0, 464: 34603008, 480: 33554433, 496: 1024, 264: 1049600, 280: 33555457, 296: 34603009, 312: 1, 328: 33554432, 344: 1048576, 360: 1025, 376: 34604032, 392: 33554433, 408: 34603008, 424: 0, 440: 34604033, 456: 1049601, 472: 1024, 488: 33555456, 504: 1048577},
                    {0: 134219808, 1: 131072, 2: 134217728, 3: 32, 4: 131104, 5: 134350880, 6: 134350848, 7: 2048, 8: 134348800, 9: 134219776, 10: 133120, 11: 134348832, 12: 2080, 13: 0, 14: 134217760, 15: 133152, 2147483648: 2048, 2147483649: 134350880, 2147483650: 134219808, 2147483651: 134217728, 2147483652: 134348800, 2147483653: 133120, 2147483654: 133152, 2147483655: 32, 2147483656: 134217760, 2147483657: 2080, 2147483658: 131104, 2147483659: 134350848, 2147483660: 0, 2147483661: 134348832, 2147483662: 134219776, 2147483663: 131072, 16: 133152, 17: 134350848, 18: 32, 19: 2048, 20: 134219776, 21: 134217760, 22: 134348832, 23: 131072, 24: 0, 25: 131104, 26: 134348800, 27: 134219808, 28: 134350880, 29: 133120, 30: 2080, 31: 134217728, 2147483664: 131072, 2147483665: 2048, 2147483666: 134348832, 2147483667: 133152, 2147483668: 32, 2147483669: 134348800, 2147483670: 134217728, 2147483671: 134219808, 2147483672: 134350880, 2147483673: 134217760, 2147483674: 134219776, 2147483675: 0, 2147483676: 133120, 2147483677: 2080, 2147483678: 131104, 2147483679: 134350848}
                ], p = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679], P = h.DES = e.extend({_doReset: function () {
                    for (var a = this._key.words, b = [], c = 0; 56 > c; c++) {
                        var d = k[c] - 1;
                        b[c] = a[d >>> 5] >>> 31 - d % 32 & 1
                    }
                    a = this._subKeys = [];
                    for (d = 0; 16 > d; d++) {
                        for (var f = a[d] = [], e = n[d], c = 0; 24 > c; c++)f[c / 6 | 0] |= b[(g[c] - 1 + e) % 28] << 31 - c % 6, f[4 + (c / 6 | 0)] |= b[28 + (g[c + 24] - 1 + e) % 28] << 31 - c % 6;
                        f[0] = f[0] << 1 | f[0] >>> 31;
                        for (c = 1; 7 > c; c++)f[c] >>>= 4 * (c - 1) + 3;
                        f[7] = f[7] << 5 | f[7] >>> 27
                    }
                    b = this._invSubKeys = [];
                    for (c = 0; 16 > c; c++)b[c] = a[15 - c]
                }, encryptBlock: function (a, b) {
                    this._doCryptBlock(a, b, this._subKeys)
                }, decryptBlock: function (a, b) {
                    this._doCryptBlock(a, b, this._invSubKeys)
                }, _doCryptBlock: function (b, d, e) {
                    this._lBlock = b[d];
                    this._rBlock = b[d + 1];
                    a.call(this, 4, 252645135);
                    a.call(this, 16, 65535);
                    c.call(this, 2, 858993459);
                    c.call(this, 8, 16711935);
                    a.call(this, 1, 1431655765);
                    for (var g = 0; 16 > g; g++) {
                        for (var f = e[g], h = this._lBlock, m = this._rBlock, n = 0, k = 0; 8 > k; k++)n |= l[k][((m ^ f[k]) & p[k]) >>> 0];
                        this._lBlock = m;
                        this._rBlock = h ^ n
                    }
                    e = this._lBlock;
                    this._lBlock = this._rBlock;
                    this._rBlock = e;
                    a.call(this, 1, 1431655765);
                    c.call(this, 8, 16711935);
                    c.call(this, 2, 858993459);
                    a.call(this, 16, 65535);
                    a.call(this, 4, 252645135);
                    b[d] = this._lBlock;
                    b[d + 1] = this._rBlock
                }, keySize: 2, ivSize: 2, blockSize: 2});
                b.DES = e._createHelper(P);
                h = h.TripleDES = e.extend({_doReset: function () {
                    var a = this._key.words;
                    this._des1 = P.createEncryptor(d.create(a.slice(0, 2)));
                    this._des2 = P.createEncryptor(d.create(a.slice(2, 4)));
                    this._des3 = P.createEncryptor(d.create(a.slice(4, 6)))
                }, encryptBlock: function (a, b) {
                    this._des1.encryptBlock(a, b);
                    this._des2.decryptBlock(a, b);
                    this._des3.encryptBlock(a, b)
                }, decryptBlock: function (a, b) {
                    this._des3.decryptBlock(a, b);
                    this._des2.encryptBlock(a, b);
                    this._des1.decryptBlock(a, b)
                }, keySize: 6, ivSize: 2, blockSize: 2});
                b.TripleDES = e._createHelper(h)
            })();
            return b.TripleDES
        })
    }, {"./cipher-core": 21, "./core": 22, "./enc-base64": 23, "./evpkdf": 25, "./md5": 30}], 53: [function (h, p, k) {
        (function (b, a) {
            "object" === typeof k ? p.exports = k = a(h("./core")) : a(b.CryptoJS)
        })(this, function (b) {
            (function (a) {
                var c = b.lib, e = c.Base, d = c.WordArray, c = b.x64 = {};
                c.Word = e.extend({init: function (a, b) {
                    this.high = a;
                    this.low = b
                }});
                c.WordArray = e.extend({init: function (b, c) {
                    b = this.words = b || [];
                    this.sigBytes = c != a ? c : 8 * b.length
                }, toX32: function () {
                    for (var a = this.words, b = a.length, c = [], e = 0; e < b; e++) {
                        var h = a[e];
                        c.push(h.high);
                        c.push(h.low)
                    }
                    return d.create(c, this.sigBytes)
                }, clone: function () {
                    for (var a = e.clone.call(this), b = a.words = this.words.slice(0), c = b.length, d = 0; d < c; d++)b[d] = b[d].clone();
                    return a
                }})
            })();
            return b
        })
    }, {"./core": 22}], 54: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                function b(a) {
                    var c = 1 < arguments.length ? g.call(arguments, 1) : [];
                    return function () {
                        return e(a, this, c.concat(g.call(arguments)))
                    }
                }

                function e(a, b, c) {
                    return 0 === c.length ? h.call(b, a) : h.apply(b, [a].concat(c))
                }

                var d = a("./when"), h = d["try"], k = a("./lib/liftAll"), g = Array.prototype.slice;
                return{lift: b, liftAll: function (a, d, e) {
                    return k(b, d, e, a)
                }, call: h, apply: function (a, b) {
                    return e(a, this, b || [])
                }, compose: function (a) {
                    var b = g.call(arguments, 1);
                    return function () {
                        var c = this, e = g.call(arguments), e = h.apply(c, [a].concat(e));
                        return d.reduce(b, function (a, b) {
                            return b.call(c, a)
                        }, e)
                    }
                }}
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"./lib/liftAll": 68, "./when": 77}], 55: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                var b = a("./makePromise"), e = a("./scheduler");
                a = a("./async");
                return b({scheduler: new e(a)})
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"./async": 58, "./makePromise": 69, "./scheduler": 70}], 56: [function (h, p, k) {
        (function (b) {
            b(function () {
                function a(a) {
                    this.head = this.tail = this.length = 0;
                    this.buffer = Array(1 << a)
                }

                a.prototype.push = function (a) {
                    this.length === this.buffer.length && this._ensureCapacity(2 * this.length);
                    this.buffer[this.tail] = a;
                    this.tail = this.tail + 1 & this.buffer.length - 1;
                    ++this.length;
                    return this.length
                };
                a.prototype.shift = function () {
                    var a = this.buffer[this.head];
                    this.buffer[this.head] = void 0;
                    this.head = this.head + 1 & this.buffer.length - 1;
                    --this.length;
                    return a
                };
                a.prototype._ensureCapacity = function (a) {
                    var b = this.head, d = this.buffer, h = Array(a), k = 0, g;
                    if (0 === b)for (g = this.length; k < g; ++k)h[k] = d[k]; else {
                        a = d.length;
                        for (g = this.tail; b < a; ++k, ++b)h[k] = d[b];
                        for (b = 0; b < g; ++k, ++b)h[k] = d[b]
                    }
                    this.buffer = h;
                    this.head = 0;
                    this.tail = this.length
                };
                return a
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 57: [function (h, p, k) {
        (function (b) {
            b(function () {
                function a(b) {
                    Error.call(this);
                    this.message = b;
                    this.name = a.name;
                    "function" === typeof Error.captureStackTrace && Error.captureStackTrace(this, a)
                }

                a.prototype = Object.create(Error.prototype);
                return a.prototype.constructor = a
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 58: [function (h, p, k) {
        (function (b) {
            (function (a) {
                a(function (a) {
                    var e;
                    return"undefined" !== typeof b && null !== b && "function" === typeof b.nextTick ? function (a) {
                        b.nextTick(a)
                    } : (e = "function" === typeof MutationObserver && MutationObserver || "function" === typeof WebKitMutationObserver && WebKitMutationObserver) ? function (a, b) {
                        var c, e = a.createElement("div");
                        (new b(function () {
                            var a = c;
                            c = void 0;
                            a()
                        })).observe(e, {attributes: !0});
                        return function (a) {
                            c = a;
                            e.setAttribute("class", "x")
                        }
                    }(document, e) : function (a) {
                        try {
                            return a("vertx").runOnLoop || a("vertx").runOnContext
                        } catch (b) {
                        }
                        var c = setTimeout;
                        return function (a) {
                            c(a, 0)
                        }
                    }(a)
                })
            })(function (a) {
                p.exports = a(h)
            })
        }).call(this, h("c:\\Users\\oberstet\\AppData\\Roaming\\npm\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js"))
    }, {"c:\\Users\\oberstet\\AppData\\Roaming\\npm\\node_modules\\browserify\\node_modules\\insert-module-globals\\node_modules\\process\\browser.js": 1}], 59: [function (h, p, k) {
        (function (b) {
            b(function () {
                return function (a) {
                    var b = Array.prototype.map, e = Array.prototype.reduce, d = Array.prototype.reduceRight, h = Array.prototype.forEach, k = a.resolve, g = a.all;
                    a.any = function (b) {
                        return new a(function (a, c) {
                            function d(a) {
                                g.push(a);
                                0 === --e && c(g)
                            }

                            var e = 0, g = [];
                            h.call(b, function (b) {
                                ++e;
                                k(b).then(a, d)
                            });
                            0 === e && a()
                        })
                    };
                    a.some = function (b, c) {
                        return new a(function (a, d, e) {
                            function g(b) {
                                0 < H && (--H, x.push(b), 0 === H && a(x))
                            }

                            function p(a) {
                                0 < f && (--f, J.push(a), 0 === f && d(J))
                            }

                            var H = 0, f, x = [], J = [];
                            h.call(b, function (a) {
                                ++H;
                                k(a).then(g, p, e)
                            });
                            c = Math.max(c, 0);
                            f = H - c + 1;
                            H = Math.min(c, H);
                            0 === H && a(x)
                        })
                    };
                    a.settle = function (a) {
                        return g(b.call(a, function (a) {
                            function b() {
                                return a.inspect()
                            }

                            a = k(a);
                            return a.then(b, b)
                        }))
                    };
                    a.map = function (a, d, e) {
                        return g(b.call(a, function (a) {
                            return k(a).then(d, e)
                        }))
                    };
                    a.reduce = function (a, b) {
                        function c(a, d, e) {
                            return k(a).then(function (a) {
                                return k(d).then(function (c) {
                                    return b(a, c, e)
                                })
                            })
                        }

                        return 2 < arguments.length ? e.call(a, c, arguments[2]) : e.call(a, c)
                    };
                    a.reduceRight = function (a, b) {
                        function c(a, d, e) {
                            return k(a).then(function (a) {
                                return k(d).then(function (c) {
                                    return b(a, c, e)
                                })
                            })
                        }

                        return 2 < arguments.length ? d.call(a, c, arguments[2]) : d.call(a, c)
                    };
                    a.prototype.spread = function (a) {
                        return this.then(g).then(function (b) {
                            return a.apply(void 0, b)
                        })
                    };
                    return a
                }
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 60: [function (h, p, k) {
        (function (b) {
            b(function () {
                function a() {
                    throw new TypeError("catch predicate must be a function");
                }

                function b(a, c) {
                    return function () {
                        a.call(this);
                        return c
                    }
                }

                function e() {
                }

                return function (d) {
                    function h(a, b) {
                        return function (c) {
                            return(b === Error || null != b && b.prototype instanceof Error ? c instanceof b : b(c)) ? a.call(this, c) : k(c)
                        }
                    }

                    var k = d.reject, g = d.prototype["catch"];
                    d.prototype.done = function (a, b) {
                        var c = this._handler;
                        c.when({resolve: this._maybeFatal, notify: e, context: this, receiver: c.receiver, fulfilled: a, rejected: b, progress: void 0})
                    };
                    d.prototype["catch"] = d.prototype.otherwise = function (b) {
                        return 1 === arguments.length ? g.call(this, b) : "function" !== typeof b ? this.ensure(a) : g.call(this, h(arguments[1], b))
                    };
                    d.prototype["finally"] = d.prototype.ensure = function (a) {
                        if ("function" !== typeof a)return this;
                        a = b(a, this);
                        return this.then(a, a)
                    };
                    d.prototype["else"] = d.prototype.orElse = function (a) {
                        return this.then(void 0, function () {
                            return a
                        })
                    };
                    d.prototype.yield = function (a) {
                        return this.then(function () {
                            return a
                        })
                    };
                    d.prototype.tap = function (a) {
                        return this.then(a).yield(this)
                    };
                    return d
                }
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 61: [function (h, p, k) {
        (function (b) {
            b(function () {
                return function (a) {
                    a.prototype.fold = function (a, b) {
                        var d = this._beget();
                        this._handler.fold(d._handler, a, b);
                        return d
                    };
                    return a
                }
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 62: [function (h, p, k) {
        (function (b) {
            b(function () {
                return function (a) {
                    a.prototype.inspect = function () {
                        return this._handler.inspect()
                    };
                    return a
                }
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 63: [function (h, p, k) {
        (function (b) {
            b(function () {
                return function (a) {
                    function b(a, h, k, g) {
                        function n(g, n) {
                            return e(k(g)).then(function () {
                                return b(a, h, k, n)
                            })
                        }

                        return e(g).then(function (b) {
                            return e(h(b)).then(function (c) {
                                return c ? b : e(a(b)).spread(n)
                            })
                        })
                    }

                    var e = a.resolve;
                    a.iterate = function (a, e, h, g) {
                        return b(function (b) {
                            return[b, a(b)]
                        }, e, h, g)
                    };
                    a.unfold = b;
                    return a
                }
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 64: [function (h, p, k) {
        (function (b) {
            b(function () {
                return function (a) {
                    a.prototype.progress = function (a) {
                        return this.then(void 0, void 0, a)
                    };
                    return a
                }
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 65: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                var b = a("../timer"), e = a("../TimeoutError");
                return function (a) {
                    a.prototype.delay = function (a) {
                        var d = this._beget(), e = d._handler;
                        this._handler.map(function (d) {
                            b.set(function () {
                                e.resolve(d)
                            }, a)
                        }, e);
                        return d
                    };
                    a.prototype.timeout = function (a, d) {
                        var g = 1 < arguments.length, h = this._beget(), l = h._handler, k = b.set(function () {
                            l.reject(g ? d : new e("timed out after " + a + "ms"))
                        }, a);
                        this._handler.chain(l, function (a) {
                            b.clear(k);
                            this.resolve(a)
                        }, function (a) {
                            b.clear(k);
                            this.reject(a)
                        }, l.notify);
                        return h
                    };
                    return a
                }
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"../TimeoutError": 57, "../timer": 71}], 66: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                function b(a) {
                    var c = String(a);
                    if ("[object Object]" === c && "undefined" !== typeof JSON) {
                        var d = c;
                        try {
                            c = JSON.stringify(a)
                        } catch (e) {
                            c = d
                        }
                    }
                    return c
                }

                function e(a) {
                    throw a;
                }

                function d() {
                }

                var h = a("../timer");
                return function (a) {
                    function g(a) {
                        if (!a.handled) {
                            y.push(a);
                            var d = P, e = "Potentially unhandled rejection [" + a.id + "] ";
                            a = a.value;
                            var g = "object" === typeof a && a.stack ? a.stack : b(a);
                            d(e + (a instanceof Error ? g : g + " (WARNING: non-Error used)"))
                        }
                    }

                    function k(a) {
                        var d = y.indexOf(a);
                        0 <= d && (y.splice(d, 1), w("Handled previous rejection [" + a.id + "] " + b(a.value)))
                    }

                    function l(a, b) {
                        v.push(a, b);
                        H || (H = !0, H = h.set(p, 0))
                    }

                    function p() {
                        for (H = !1; 0 < v.length;)v.shift()(v.shift())
                    }

                    var P = d, w = d;
                    "undefined" !== typeof console && (P = "undefined" !== typeof console.error ? function (a) {
                        console.error(a)
                    } : function (a) {
                        console.log(a)
                    }, w = "undefined" !== typeof console.info ? function (a) {
                        console.info(a)
                    } : function (a) {
                        console.log(a)
                    });
                    a.onPotentiallyUnhandledRejection = function (a) {
                        l(g, a)
                    };
                    a.onPotentiallyUnhandledRejectionHandled = function (a) {
                        l(k, a)
                    };
                    a.onFatalRejection = function (a) {
                        l(e, a.value)
                    };
                    var v = [], y = [], H = !1;
                    return a
                }
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"../timer": 71}], 67: [function (h, p, k) {
        (function (b) {
            b(function () {
                return function (a) {
                    a.prototype["with"] = a.prototype.withThis = a.prototype._bindContext;
                    return a
                }
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 68: [function (h, p, k) {
        (function (b) {
            b(function () {
                function a(a, b, c) {
                    a[c] = b;
                    return a
                }

                function b(a) {
                    return"function" === typeof a ? a.bind() : Object.create(a)
                }

                return function (e, d, h, k) {
                    "undefined" === typeof d && (d = a);
                    return Object.keys(k).reduce(function (a, b) {
                        var c = k[b];
                        return"function" === typeof c ? d(a, e(c), b) : a
                    }, "undefined" === typeof h ? b(k) : h)
                }
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 69: [function (h, p, k) {
        (function (b) {
            b(function () {
                return function (a) {
                    function b(a, c) {
                        this._handler = a === g ? c : e(a)
                    }

                    function e(a) {
                        function b(a) {
                            e.resolve(a)
                        }

                        function c(a) {
                            e.reject(a)
                        }

                        function d(a) {
                            e.notify(a)
                        }

                        var e = new n;
                        try {
                            a(b, c, d)
                        } catch (f) {
                            c(f)
                        }
                        return e
                    }

                    function d(a) {
                        return new b(g, new p(new y(a)))
                    }

                    function h(a) {
                        return a instanceof b ? a._handler.join() : E(a) ? k(a) : new v(a)
                    }

                    function k(a) {
                        try {
                            var b = a.then;
                            return"function" === typeof b ? new w(b, a) : new v(a)
                        } catch (c) {
                            return new y(c)
                        }
                    }

                    function g() {
                    }

                    function n(a, d) {
                        b.createContext(this, d);
                        this.consumers = void 0;
                        this.receiver = a;
                        this.handler = void 0;
                        this.resolved = !1
                    }

                    function l(a) {
                        this.handler = a
                    }

                    function p(a) {
                        this.handler = a
                    }

                    function P(a, b) {
                        this.handler = a;
                        this.receiver = b
                    }

                    function w(a, b) {
                        n.call(this);
                        G.enqueue(new C(a, b, this))
                    }

                    function v(a) {
                        b.createContext(this);
                        this.value = a
                    }

                    function y(a) {
                        b.createContext(this);
                        this.id = ++t;
                        this.value = a;
                        this.reported = this.handled = !1;
                        this._report()
                    }

                    function H(a, d) {
                        a.handled || (a.reported = !0, b.onPotentiallyUnhandledRejection(a, d))
                    }

                    function f(a) {
                        if (a.reported)b.onPotentiallyUnhandledRejectionHandled(a)
                    }

                    function x() {
                        y.call(this, new TypeError("Promise cycle"))
                    }

                    function J() {
                        return{state: "pending"}
                    }

                    function A(a, b) {
                        this.continuation = a;
                        this.handler = b
                    }

                    function L(a, b) {
                        this.handler = a;
                        this.value = b
                    }

                    function C(a, b, c) {
                        this._then = a;
                        this.thenable = b;
                        this.resolver = c
                    }

                    function B(a, b, c, d, e) {
                        try {
                            a.call(b, c, d, e)
                        } catch (f) {
                            d(f)
                        }
                    }

                    function E(a) {
                        return("object" === typeof a || "function" === typeof a) && null !== a
                    }

                    function I(a, b, c) {
                        try {
                            return a.call(c, b)
                        } catch (e) {
                            return d(e)
                        }
                    }

                    function Q(a, b, c, e) {
                        try {
                            return a.call(e, b, c)
                        } catch (f) {
                            return d(f)
                        }
                    }

                    function N(a, b) {
                        b.prototype = s(a.prototype);
                        b.prototype.constructor = b
                    }

                    function F() {
                    }

                    var G = a.scheduler, s = Object.create || function (a) {
                        function b() {
                        }

                        b.prototype = a;
                        return new b
                    };
                    b.resolve = function (a) {
                        return a instanceof b ? a : new b(g, new p(h(a)))
                    };
                    b.reject = d;
                    b.never = function () {
                        return r
                    };
                    b._defer = function () {
                        return new b(g, new n)
                    };
                    b.prototype.then = function (a, d) {
                        var e = this._handler;
                        if ("function" !== typeof a && 0 < e.join().state())return new b(g, e);
                        var f = this._beget(), h = f._handler;
                        e.when({resolve: h.resolve, notify: h.notify, context: h, receiver: e.receiver, fulfilled: a, rejected: d, progress: 2 < arguments.length ? arguments[2] : void 0});
                        return f
                    };
                    b.prototype["catch"] = function (a) {
                        return this.then(void 0, a)
                    };
                    b.prototype._bindContext = function (a) {
                        return new b(g, new P(this._handler, a))
                    };
                    b.prototype._beget = function () {
                        var a = this._handler, a = new n(a.receiver, a.join().context);
                        return new this.constructor(g, a)
                    };
                    b.prototype._maybeFatal = function (a) {
                        if (E(a)) {
                            a = h(a);
                            var b = this._handler.context;
                            a.catchError(function () {
                                this._fatal(b)
                            }, a)
                        }
                    };
                    b.all = function (a) {
                        function d(a, b, c, e) {
                            c.map(function (a) {
                                b[e] = a;
                                0 === --f && this.become(new v(b))
                            }, a)
                        }

                        var e = new n, f = a.length >>> 0, h = Array(f), l, m, p;
                        for (l = 0; l < a.length; ++l)if (m = a[l], void 0 !== m || l in a)if (E(m))if (m = m instanceof b ? m._handler.join() : k(m), p = m.state(), 0 === p)d(e, h, m, l); else if (0 < p)h[l] = m.value, --f; else {
                            e.become(m);
                            break
                        } else h[l] = m, --f; else--f;
                        0 === f && e.become(new v(h));
                        return new b(g, e)
                    };
                    b.race = function (a) {
                        if (Object(a) === a && 0 === a.length)return r;
                        var d = new n, e, f;
                        for (e = 0; e < a.length; ++e)f = a[e], void 0 !== f && e in a && h(f).chain(d, d.resolve, d.reject);
                        return new b(g, d)
                    };
                    g.prototype.when = g.prototype.resolve = g.prototype.reject = g.prototype.notify = g.prototype._fatal = g.prototype._unreport = g.prototype._report = F;
                    g.prototype.inspect = J;
                    g.prototype._state = 0;
                    g.prototype.state = function () {
                        return this._state
                    };
                    g.prototype.join = function () {
                        for (var a = this; void 0 !== a.handler;)a = a.handler;
                        return a
                    };
                    g.prototype.chain = function (a, b, c, d) {
                        this.when({resolve: F, notify: F, context: void 0, receiver: a, fulfilled: b, rejected: c, progress: d})
                    };
                    g.prototype.map = function (a, b) {
                        this.chain(b, a, b.reject, b.notify)
                    };
                    g.prototype.catchError = function (a, b) {
                        this.chain(b, b.resolve, a, b.notify)
                    };
                    g.prototype.fold = function (a, b, c) {
                        this.join().map(function (a) {
                            h(c).map(function (c) {
                                this.resolve(Q(b, c, a, this.receiver))
                            }, this)
                        }, a)
                    };
                    N(g, n);
                    n.prototype._state = 0;
                    n.prototype.inspect = function () {
                        return this.resolved ? this.join().inspect() : J()
                    };
                    n.prototype.resolve = function (a) {
                        this.resolved || this.become(h(a))
                    };
                    n.prototype.reject = function (a) {
                        this.resolved || this.become(new y(a))
                    };
                    n.prototype.join = function () {
                        if (this.resolved) {
                            for (var a = this; void 0 !== a.handler;)if (a = a.handler, a === this)return this.handler = new x;
                            return a
                        }
                        return this
                    };
                    n.prototype.run = function () {
                        var a = this.consumers, b = this.join();
                        this.consumers = void 0;
                        for (var c = 0; c < a.length; ++c)b.when(a[c])
                    };
                    n.prototype.become = function (a) {
                        this.resolved = !0;
                        this.handler = a;
                        void 0 !== this.consumers && G.enqueue(this);
                        void 0 !== this.context && a._report(this.context)
                    };
                    n.prototype.when = function (a) {
                        this.resolved ? G.enqueue(new A(a, this.handler)) : void 0 === this.consumers ? this.consumers = [a] : this.consumers.push(a)
                    };
                    n.prototype.notify = function (a) {
                        this.resolved || G.enqueue(new L(this, a))
                    };
                    n.prototype._report = function (a) {
                        this.resolved && this.handler.join()._report(a)
                    };
                    n.prototype._unreport = function () {
                        this.resolved && this.handler.join()._unreport()
                    };
                    n.prototype._fatal = function (a) {
                        a = "undefined" === typeof a ? this.context : a;
                        this.resolved && this.handler.join()._fatal(a)
                    };
                    N(g, l);
                    l.prototype.inspect = function () {
                        return this.join().inspect()
                    };
                    l.prototype._report = function (a) {
                        this.join()._report(a)
                    };
                    l.prototype._unreport = function () {
                        this.join()._unreport()
                    };
                    N(l, p);
                    p.prototype.when = function (a) {
                        G.enqueue(new A(a, this.join()))
                    };
                    N(l, P);
                    P.prototype.when = function (a) {
                        void 0 !== this.receiver && (a.receiver = this.receiver);
                        this.join().when(a)
                    };
                    N(n, w);
                    N(g, v);
                    v.prototype._state = 1;
                    v.prototype.inspect = function () {
                        return{state: "fulfilled", value: this.value}
                    };
                    v.prototype.when = function (a) {
                        var d;
                        "function" === typeof a.fulfilled ? (b.enterContext(this), d = I(a.fulfilled, this.value, a.receiver), b.exitContext()) : d = this.value;
                        a.resolve.call(a.context, d)
                    };
                    var t = 0;
                    N(g, y);
                    y.prototype._state = -1;
                    y.prototype.inspect = function () {
                        return{state: "rejected", reason: this.value}
                    };
                    y.prototype.when = function (a) {
                        var d;
                        "function" === typeof a.rejected ? (this._unreport(), b.enterContext(this), d = I(a.rejected, this.value, a.receiver), b.exitContext()) : d = new b(g, this);
                        a.resolve.call(a.context, d)
                    };
                    y.prototype._report = function (a) {
                        G.afterQueue(H, this, a)
                    };
                    y.prototype._unreport = function () {
                        this.handled = !0;
                        G.afterQueue(f, this)
                    };
                    y.prototype._fatal = function (a) {
                        b.onFatalRejection(this, a)
                    };
                    b.createContext = b.enterContext = b.exitContext = b.onPotentiallyUnhandledRejection = b.onPotentiallyUnhandledRejectionHandled = b.onFatalRejection = F;
                    a = new g;
                    var r = new b(g, a);
                    N(y, x);
                    A.prototype.run = function () {
                        this.handler.join().when(this.continuation)
                    };
                    L.prototype.run = function () {
                        var a = this.handler.consumers;
                        if (void 0 !== a)for (var b = 0; b < a.length; ++b)this._notify(a[b])
                    };
                    L.prototype._notify = function (a) {
                        var b;
                        if ("function" === typeof a.progress)try {
                            b = a.progress.call(a.receiver, this.value)
                        } catch (c) {
                            b = c
                        } else b = this.value;
                        a.notify.call(a.context, b)
                    };
                    C.prototype.run = function () {
                        var a = this.resolver;
                        B(this._then, this.thenable, function (b) {
                            a.resolve(b)
                        }, function (b) {
                            a.reject(b)
                        }, function (b) {
                            a.notify(b)
                        })
                    };
                    return b
                }
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 70: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                function b(a) {
                    this._enqueue = a;
                    this._handlerQueue = new e(15);
                    this._afterQueue = new e(5);
                    this._running = !1;
                    var c = this;
                    this.drain = function () {
                        c._drain()
                    }
                }

                var e = a("./Queue");
                b.prototype.enqueue = function (a) {
                    this._handlerQueue.push(a);
                    this._running || (this._running = !0, this._enqueue(this.drain))
                };
                b.prototype.afterQueue = function (a, b, c) {
                    this._afterQueue.push(a);
                    this._afterQueue.push(b);
                    this._afterQueue.push(c);
                    this._running || (this._running = !0, this._enqueue(this.drain))
                };
                b.prototype._drain = function () {
                    for (var a = this._handlerQueue; 0 < a.length;)a.shift().run();
                    this._running = !1;
                    for (a = this._afterQueue; 0 < a.length;)a.shift()(a.shift(), a.shift())
                };
                return b
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"./Queue": 56}], 71: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                var b, e, d;
                try {
                    b = a("vertx"), e = function (a, d) {
                        return b.setTimer(d, a)
                    }, d = b.cancelTimer
                } catch (h) {
                    e = function (a, b) {
                        return setTimeout(a, b)
                    }, d = function (a) {
                        return clearTimeout(a)
                    }
                }
                return{set: e, clear: d}
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {}], 72: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                var b = a("./monitor/PromiseMonitor");
                a = a("./monitor/ConsoleReporter");
                var e = new b(new a);
                return function (a) {
                    return e.monitor(a)
                }
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"./monitor/ConsoleReporter": 73, "./monitor/PromiseMonitor": 74}], 73: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                function b() {
                    this._previouslyReported = !1
                }

                function e() {
                }

                var d = a("./error");
                b.prototype = function () {
                    var a, b, c, d;
                    "undefined" === typeof console ? a = b = e : "function" === typeof console.error && "function" === typeof console.dir ? (b = function (a) {
                        console.error(a)
                    }, a = function (a) {
                        console.log(a)
                    }, "function" === typeof console.groupCollapsed && (c = function (a) {
                        console.groupCollapsed(a)
                    }, d = function () {
                        console.groupEnd()
                    })) : "function" === typeof console.log && "undefined" !== typeof JSON && (a = b = function (a) {
                        if ("string" !== typeof a)try {
                            a = JSON.stringify(a)
                        } catch (b) {
                        }
                        console.log(a)
                    });
                    return{msg: a, warn: b, groupStart: c || b, groupEnd: d || e}
                }();
                b.prototype.log = function (a) {
                    if (0 === a.length)this._previouslyReported && (this._previouslyReported = !1, this.msg("[promises] All previously unhandled rejections have now been handled")); else {
                        this._previouslyReported = !0;
                        this.groupStart("[promises] Unhandled rejections: " + a.length);
                        try {
                            this._log(a)
                        } finally {
                            this.groupEnd()
                        }
                    }
                };
                b.prototype._log = function (a) {
                    for (var b = 0; b < a.length; ++b)this.warn(d.format(a[b]))
                };
                return b
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"./error": 76}], 74: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                function b(a) {
                    this.logDelay = 0;
                    this.stackFilter = k;
                    this.stackJumpSeparator = h;
                    this.filterDuplicateFrames = !0;
                    this._reporter = a;
                    "function" === typeof a.configurePromiseMonitor && a.configurePromiseMonitor(this);
                    this._traces = [];
                    this._traceTask = 0;
                    var c = this;
                    this._doLogTraces = function () {
                        c._logTraces()
                    }
                }

                function e(a, b) {
                    return b.filter(function (b) {
                        return!a.test(b)
                    })
                }

                function d(a) {
                    return!a.handler.handled
                }

                var h = "from execution context:", k = /[\s\(\/\\](node|module|timers)\.js:|when([\/\\]{1,2}(lib|monitor|es6-shim)[\/\\]{1,2}|\.js)|(new\sPromise)\b|(\b(PromiseMonitor|ConsoleReporter|Scheduler|RunHandlerTask|ProgressTask|Promise|.*Handler)\.[\w_]\w\w+\b)|\b(tryCatch\w+|getHandler\w*)\b/i, g = a("../lib/timer").set, n = a("./error"), l = [];
                b.prototype.monitor = function (a) {
                    var b = this;
                    a.createContext = function (a, c) {
                        a.context = b.createContext(a, c)
                    };
                    a.enterContext = function (a) {
                        l.push(a.context)
                    };
                    a.exitContext = function () {
                        l.pop()
                    };
                    a.onPotentiallyUnhandledRejection = function (a, c) {
                        return b.addTrace(a, c)
                    };
                    a.onPotentiallyUnhandledRejectionHandled = function (a) {
                        return b.removeTrace(a)
                    };
                    a.onFatalRejection = function (a, c) {
                        return b.fatal(a, c)
                    };
                    return this
                };
                b.prototype.createContext = function (a, b) {
                    var c = {parent: b || l[l.length - 1], stack: void 0};
                    n.captureStack(c, a.constructor);
                    return c
                };
                b.prototype.addTrace = function (a, b) {
                    var c, d;
                    for (d = this._traces.length - 1; 0 <= d && (c = this._traces[d], c.handler !== a); --d);
                    0 <= d ? c.extraContext = b : this._traces.push({handler: a, extraContext: b});
                    this.logTraces()
                };
                b.prototype.removeTrace = function () {
                    this.logTraces()
                };
                b.prototype.fatal = function (a, b) {
                    var c = Error();
                    c.stack = this._createLongTrace(a.value, a.context, b).join("\n");
                    g(function () {
                        throw c;
                    }, 0)
                };
                b.prototype.logTraces = function () {
                    this._traceTask || (this._traceTask = g(this._doLogTraces, this.logDelay))
                };
                b.prototype._logTraces = function () {
                    this._traceTask = void 0;
                    this._traces = this._traces.filter(d);
                    this._reporter.log(this.formatTraces(this._traces))
                };
                b.prototype.formatTraces = function (a) {
                    return a.map(function (a) {
                        return this._createLongTrace(a.handler.value, a.handler.context, a.extraContext)
                    }, this)
                };
                b.prototype._createLongTrace = function (a, b, c) {
                    a = n.parse(a) || [String(a) + " (WARNING: non-Error used)"];
                    a = e(this.stackFilter, a, 0);
                    this._appendContext(a, b);
                    this._appendContext(a, c);
                    return this.filterDuplicateFrames ? this._removeDuplicates(a) : a
                };
                b.prototype._removeDuplicates = function (a) {
                    var b = {}, c = this.stackJumpSeparator, d = 0;
                    return a.reduceRight(function (a, e, f) {
                        0 === f ? a.unshift(e) : e === c ? 0 < d && (a.unshift(e), d = 0) : b[e] || (b[e] = !0, a.unshift(e), ++d);
                        return a
                    }, [])
                };
                b.prototype._appendContext = function (a, b) {
                    a.push.apply(a, this._createTrace(b))
                };
                b.prototype._createTrace = function (a) {
                    for (var b = [], c; a;) {
                        if (c = n.parse(a)) {
                            c = e(this.stackFilter, c);
                            var d = b;
                            1 < c.length && (c[0] = this.stackJumpSeparator, d.push.apply(d, c))
                        }
                        a = a.parent
                    }
                    return b
                };
                return b
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"../lib/timer": 71, "./error": 76}], 75: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                var b = a("../monitor");
                a = a("../when").Promise;
                return b(a)
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"../monitor": 72, "../when": 77}], 76: [function (h, p, k) {
        (function (b) {
            b(function () {
                function a(a) {
                    try {
                        throw Error();
                    } catch (b) {
                        a.stack = b.stack
                    }
                }

                function b(a) {
                    a.stack = Error().stack
                }

                function e(a) {
                    return h(a)
                }

                function d(a) {
                    var b = Error();
                    b.stack = h(a);
                    return b
                }

                function h(a) {
                    for (var b = !1, c = "", d = 0; d < a.length; ++d)b ? c += "\n" + a[d] : (c += a[d], b = !0);
                    return c
                }

                var k, g, n;
                Error.captureStackTrace ? (k = function (a) {
                    return a && a.stack && a.stack.split("\n")
                }, n = e, g = Error.captureStackTrace) : (k = function (a) {
                    var b = a && a.stack && a.stack.split("\n");
                    b && a.message && b.unshift(a.message);
                    return b
                }, "string" !== typeof Error().stack ? (n = e, g = a) : (n = d, g = b));
                return{parse: k, format: n, captureStack: g}
            })
        })(function (b) {
            p.exports = b()
        })
    }, {}], 77: [function (h, p, k) {
        (function (b) {
            b(function (a) {
                function b(a, c, d) {
                    var e = x.resolve(a);
                    return 2 > arguments.length ? e : 3 < arguments.length ? e.then(c, d, arguments[3]) : e.then(c, d)
                }

                function e(a) {
                    return function () {
                        return h(a, this, J.call(arguments))
                    }
                }

                function d(a) {
                    return h(a, this, J.call(arguments, 1))
                }

                function h(a, b, c) {
                    return x.all(c).then(function (c) {
                        return a.apply(b, c)
                    })
                }

                function k() {
                    function a(b) {
                        d._handler.resolve(b)
                    }

                    function b(a) {
                        d._handler.reject(a)
                    }

                    function c(a) {
                        d._handler.notify(a)
                    }

                    var d = x._defer();
                    this.promise = d;
                    this.resolve = a;
                    this.reject = b;
                    this.notify = c;
                    this.resolver = {resolve: a, reject: b, notify: c}
                }

                var g = a("./lib/decorators/timed"), n = a("./lib/decorators/array"), l = a("./lib/decorators/flow"), p = a("./lib/decorators/fold"), P = a("./lib/decorators/inspect"), w = a("./lib/decorators/iterate"), v = a("./lib/decorators/progress"), y = a("./lib/decorators/with"), H = a("./lib/decorators/unhandledRejection"), f = a("./lib/TimeoutError"), x = [n, l, p, w, v, P, y, g, H].reduce(function (a, b) {
                    return b(a)
                }, a("./lib/Promise")), J = Array.prototype.slice;
                b.promise = function (a) {
                    return new x(a)
                };
                b.resolve = x.resolve;
                b.reject = x.reject;
                b.lift = e;
                b["try"] = d;
                b.attempt = d;
                b.iterate = x.iterate;
                b.unfold = x.unfold;
                b.join = function () {
                    return x.all(arguments)
                };
                b.all = function (a) {
                    return b(a, x.all)
                };
                b.settle = function (a) {
                    return b(a, x.settle)
                };
                b.any = e(x.any);
                b.some = e(x.some);
                b.map = function (a, d) {
                    return b(a, function (a) {
                        return x.map(a, d)
                    })
                };
                b.reduce = function (a, d) {
                    var e = J.call(arguments, 1);
                    return b(a, function (a) {
                        e.unshift(a);
                        return x.reduce.apply(x, e)
                    })
                };
                b.reduceRight = function (a, d) {
                    var e = J.call(arguments, 1);
                    return b(a, function (a) {
                        e.unshift(a);
                        return x.reduceRight.apply(x, e)
                    })
                };
                b.isPromiseLike = function (a) {
                    return a && "function" === typeof a.then
                };
                b.Promise = x;
                b.defer = function () {
                    return new k
                };
                b.TimeoutError = f;
                return b
            })
        })(function (b) {
            p.exports = b(h)
        })
    }, {"./lib/Promise": 55, "./lib/TimeoutError": 57, "./lib/decorators/array": 59, "./lib/decorators/flow": 60, "./lib/decorators/fold": 61, "./lib/decorators/inspect": 62, "./lib/decorators/iterate": 63, "./lib/decorators/progress": 64, "./lib/decorators/timed": 65, "./lib/decorators/unhandledRejection": 66, "./lib/decorators/with": 67}], 78: [function (h, p, k) {
        function b(b, e, d) {
            return e ? new a(b, e) : new a(b)
        }

        h = function () {
            return this
        }();
        var a = h.WebSocket || h.MozWebSocket;
        p.exports = a ? b : null;
        a && (b.prototype = a.prototype)
    }, {}], 79: [function (h, p, k) {
        p.exports = {name: "autobahn", version: "0.9.6", description: "An implementation of The Web Application Messaging Protocol (WAMP).", main: "index.js", scripts: {test: "nodeunit test/test.js"}, dependencies: {when: ">= 2.8.0", ws: ">= 0.4.31", "crypto-js": ">= 3.1.2-2"}, devDependencies: {browserify: ">= 3.28.1", nodeunit: ">= 0.8.6"}, repository: {type: "git", url: "git://github.com/tavendo/AutobahnJS.git"}, keywords: ["WAMP", "WebSocket", "RPC", "PubSub"], author: "Tavendo GmbH", license: "MIT"}
    }, {}]}, {}, [4])(4)
});
window.google = window.google || {};
google.maps = google.maps || {};
(function () {
    function getScript(src) {
        document.write('<' + 'script src="' + src + '"><' + '/script>');
    }

    var modules = google.maps.modules = {};
    google.maps.__gjsload__ = function (name, text) {
        modules[name] = text;
    };
    google.maps.Load = function (apiLoad) {
        delete google.maps.Load;
        apiLoad([0.009999999776482582, [
            [
                ["http://mt0.googleapis.com/vt?lyrs=m@299000000\u0026src=api\u0026hl=en-US\u0026", "http://mt1.googleapis.com/vt?lyrs=m@299000000\u0026src=api\u0026hl=en-US\u0026"],
                null,
                null,
                null,
                null,
                "m@299000000",
                ["https://mts0.google.com/vt?lyrs=m@299000000\u0026src=api\u0026hl=en-US\u0026", "https://mts1.google.com/vt?lyrs=m@299000000\u0026src=api\u0026hl=en-US\u0026"]
            ],
            [
                ["http://khm0.googleapis.com/kh?v=170\u0026hl=en-US\u0026", "http://khm1.googleapis.com/kh?v=170\u0026hl=en-US\u0026"],
                null,
                null,
                null,
                1,
                "170",
                ["https://khms0.google.com/kh?v=170\u0026hl=en-US\u0026", "https://khms1.google.com/kh?v=170\u0026hl=en-US\u0026"]
            ],
            [
                ["http://mt0.googleapis.com/vt?lyrs=h@299000000\u0026src=api\u0026hl=en-US\u0026", "http://mt1.googleapis.com/vt?lyrs=h@299000000\u0026src=api\u0026hl=en-US\u0026"],
                null,
                null,
                null,
                null,
                "h@299000000",
                ["https://mts0.google.com/vt?lyrs=h@299000000\u0026src=api\u0026hl=en-US\u0026", "https://mts1.google.com/vt?lyrs=h@299000000\u0026src=api\u0026hl=en-US\u0026"]
            ],
            [
                ["http://mt0.googleapis.com/vt?lyrs=t@132,r@299000000\u0026src=api\u0026hl=en-US\u0026", "http://mt1.googleapis.com/vt?lyrs=t@132,r@299000000\u0026src=api\u0026hl=en-US\u0026"],
                null,
                null,
                null,
                null,
                "t@132,r@299000000",
                ["https://mts0.google.com/vt?lyrs=t@132,r@299000000\u0026src=api\u0026hl=en-US\u0026", "https://mts1.google.com/vt?lyrs=t@132,r@299000000\u0026src=api\u0026hl=en-US\u0026"]
            ],
            null,
            null,
            [
                ["http://cbk0.googleapis.com/cbk?", "http://cbk1.googleapis.com/cbk?"]
            ],
            [
                ["http://khm0.googleapis.com/kh?v=85\u0026hl=en-US\u0026", "http://khm1.googleapis.com/kh?v=85\u0026hl=en-US\u0026"],
                null,
                null,
                null,
                null,
                "85",
                ["https://khms0.google.com/kh?v=85\u0026hl=en-US\u0026", "https://khms1.google.com/kh?v=85\u0026hl=en-US\u0026"]
            ],
            [
                ["http://mt0.googleapis.com/mapslt?hl=en-US\u0026", "http://mt1.googleapis.com/mapslt?hl=en-US\u0026"]
            ],
            [
                ["http://mt0.googleapis.com/mapslt/ft?hl=en-US\u0026", "http://mt1.googleapis.com/mapslt/ft?hl=en-US\u0026"]
            ],
            [
                ["http://mt0.googleapis.com/vt?hl=en-US\u0026", "http://mt1.googleapis.com/vt?hl=en-US\u0026"]
            ],
            [
                ["http://mt0.googleapis.com/mapslt/loom?hl=en-US\u0026", "http://mt1.googleapis.com/mapslt/loom?hl=en-US\u0026"]
            ],
            [
                ["https://mts0.googleapis.com/mapslt?hl=en-US\u0026", "https://mts1.googleapis.com/mapslt?hl=en-US\u0026"]
            ],
            [
                ["https://mts0.googleapis.com/mapslt/ft?hl=en-US\u0026", "https://mts1.googleapis.com/mapslt/ft?hl=en-US\u0026"]
            ],
            [
                ["https://mts0.googleapis.com/mapslt/loom?hl=en-US\u0026", "https://mts1.googleapis.com/mapslt/loom?hl=en-US\u0026"]
            ]
        ], ["en-US", "US", null, 0, null, null, "http://maps.gstatic.com/mapfiles/", "http://csi.gstatic.com", "https://maps.googleapis.com", "http://maps.googleapis.com", null, "https://maps.google.com", "https://gg.google.com", "http://maps.gstatic.com/maps-api-v3/api/images/", "https://www.google.com/maps", 0], ["http://maps.gstatic.com/maps-api-v3/api/js/20/10", "3.20.10"], [376753270], 1, null, null, null, null, null, "", null, null, 0, "http://khm.googleapis.com/mz?v=170\u0026", null, "https://earthbuilder.googleapis.com", "https://earthbuilder.googleapis.com", null, "http://mt.googleapis.com/vt/icon", [
            ["http://mt0.googleapis.com/vt", "http://mt1.googleapis.com/vt"],
            ["https://mts0.googleapis.com/vt", "https://mts1.googleapis.com/vt"],
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            ["https://mts0.google.com/vt", "https://mts1.google.com/vt"],
            "/maps/vt",
            299000000,
            132
        ], 2, 500, [null, "http://g0.gstatic.com/landmark/tour", "http://g0.gstatic.com/landmark/config", null, "http://www.google.com/maps/preview/log204", "", "http://static.panoramio.com.storage.googleapis.com/photos/", ["http://geo0.ggpht.com/cbk", "http://geo1.ggpht.com/cbk", "http://geo2.ggpht.com/cbk", "http://geo3.ggpht.com/cbk"]], ["https://www.google.com/maps/api/js/master?pb=!1m2!1u20!2s10!2sen-US!3sUS!4s20/10", "https://www.google.com/maps/api/js/widget?pb=!1m2!1u20!2s10!2sen-US"], null, 0, 0, "/maps/api/js/ApplicationService.GetEntityDetails", 0], loadScriptTime);
    };
    var loadScriptTime = (new Date).getTime();
    getScript("http://maps.gstatic.com/maps-api-v3/api/js/20/10/main.js");
})();
fotoramaVersion = '4.6.3';
(function (window, document, location, $, undefined) {
    "use strict";
    var _fotoramaClass = 'fotorama', _fullscreenClass = 'fullscreen', wrapClass = _fotoramaClass + '__wrap', wrapCss2Class = wrapClass + '--css2', wrapCss3Class = wrapClass + '--css3', wrapVideoClass = wrapClass + '--video', wrapFadeClass = wrapClass + '--fade', wrapSlideClass = wrapClass + '--slide', wrapNoControlsClass = wrapClass + '--no-controls', wrapNoShadowsClass = wrapClass + '--no-shadows', wrapPanYClass = wrapClass + '--pan-y', wrapRtlClass = wrapClass + '--rtl', wrapOnlyActiveClass = wrapClass + '--only-active', wrapNoCaptionsClass = wrapClass + '--no-captions', wrapToggleArrowsClass = wrapClass + '--toggle-arrows', stageClass = _fotoramaClass + '__stage', stageFrameClass = stageClass + '__frame', stageFrameVideoClass = stageFrameClass + '--video', stageShaftClass = stageClass + '__shaft', grabClass = _fotoramaClass + '__grab', pointerClass = _fotoramaClass + '__pointer', arrClass = _fotoramaClass + '__arr', arrDisabledClass = arrClass + '--disabled', arrPrevClass = arrClass + '--prev', arrNextClass = arrClass + '--next', arrArrClass = arrClass + '__arr', navClass = _fotoramaClass + '__nav', navWrapClass = navClass + '-wrap', navShaftClass = navClass + '__shaft', navDotsClass = navClass + '--dots', navThumbsClass = navClass + '--thumbs', navFrameClass = navClass + '__frame', navFrameDotClass = navFrameClass + '--dot', navFrameThumbClass = navFrameClass + '--thumb', fadeClass = _fotoramaClass + '__fade', fadeFrontClass = fadeClass + '-front', fadeRearClass = fadeClass + '-rear', shadowClass = _fotoramaClass + '__shadow', shadowsClass = shadowClass + 's', shadowsLeftClass = shadowsClass + '--left', shadowsRightClass = shadowsClass + '--right', activeClass = _fotoramaClass + '__active', selectClass = _fotoramaClass + '__select', hiddenClass = _fotoramaClass + '--hidden', fullscreenClass = _fotoramaClass + '--fullscreen', fullscreenIconClass = _fotoramaClass + '__fullscreen-icon', errorClass = _fotoramaClass + '__error', loadingClass = _fotoramaClass + '__loading', loadedClass = _fotoramaClass + '__loaded', loadedFullClass = loadedClass + '--full', loadedImgClass = loadedClass + '--img', grabbingClass = _fotoramaClass + '__grabbing', imgClass = _fotoramaClass + '__img', imgFullClass = imgClass + '--full', dotClass = _fotoramaClass + '__dot', thumbClass = _fotoramaClass + '__thumb', thumbBorderClass = thumbClass + '-border', htmlClass = _fotoramaClass + '__html', videoClass = _fotoramaClass + '__video', videoPlayClass = videoClass + '-play', videoCloseClass = videoClass + '-close', captionClass = _fotoramaClass + '__caption', captionWrapClass = _fotoramaClass + '__caption__wrap', spinnerClass = _fotoramaClass + '__spinner', buttonAttributes = '" tabindex="0" role="button';
    var JQUERY_VERSION = $ && $.fn.jquery.split('.');
    if (!JQUERY_VERSION || JQUERY_VERSION[0] < 1 || (JQUERY_VERSION[0] == 1 && JQUERY_VERSION[1] < 8)) {
        throw'Fotorama requires jQuery 1.8 or later and will not run without it.';
    }
    var _ = {};
    var Modernizr = (function (window, document, undefined) {
        var version = '2.6.2', Modernizr = {}, docElement = document.documentElement, mod = 'modernizr', modElem = document.createElement(mod), mStyle = modElem.style, inputElem, toString = {}.toString, prefixes = ' -webkit- -moz- -o- -ms- '.split(' '), omPrefixes = 'Webkit Moz O ms', cssomPrefixes = omPrefixes.split(' '), domPrefixes = omPrefixes.toLowerCase().split(' '), tests = {}, inputs = {}, attrs = {}, classes = [], slice = classes.slice, featureName, injectElementWithStyles = function (rule, callback, nodes, testnames) {
            var style, ret, node, docOverflow, div = document.createElement('div'), body = document.body, fakeBody = body || document.createElement('body');
            if (parseInt(nodes, 10)) {
                while (nodes--) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }
            style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if (!body) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }
            ret = callback(div, rule);
            if (!body) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }
            return!!ret;
        }, _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;
        if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
            hasOwnProp = function (object, property) {
                return _hasOwnProperty.call(object, property);
            };
        }
        else {
            hasOwnProp = function (object, property) {
                return((property in object) && is(object.constructor.prototype[property], 'undefined'));
            };
        }
        if (!Function.prototype.bind) {
            Function.prototype.bind = function bind(that) {
                var target = this;
                if (typeof target != "function") {
                    throw new TypeError();
                }
                var args = slice.call(arguments, 1), bound = function () {
                    if (this instanceof bound) {
                        var F = function () {
                        };
                        F.prototype = target.prototype;
                        var self = new F();
                        var result = target.apply(self, args.concat(slice.call(arguments)));
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;
                    } else {
                        return target.apply(that, args.concat(slice.call(arguments)));
                    }
                };
                return bound;
            };
        }
        function setCss(str) {
            mStyle.cssText = str;
        }

        function setCssAll(str1, str2) {
            return setCss(prefixes.join(str1 + ';') + (str2 || ''));
        }

        function is(obj, type) {
            return typeof obj === type;
        }

        function contains(str, substr) {
            return!!~('' + str).indexOf(substr);
        }

        function testProps(props, prefixed) {
            for (var i in props) {
                var prop = props[i];
                if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                    return prefixed == 'pfx' ? prop : true;
                }
            }
            return false;
        }

        function testDOMProps(props, obj, elem) {
            for (var i in props) {
                var item = obj[props[i]];
                if (item !== undefined) {
                    if (elem === false)return props[i];
                    if (is(item, 'function')) {
                        return item.bind(elem || obj);
                    }
                    return item;
                }
            }
            return false;
        }

        function testPropsAll(prop, prefixed, elem) {
            var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
            if (is(prefixed, "string") || is(prefixed, "undefined")) {
                return testProps(props, prefixed);
            } else {
                props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
                return testDOMProps(props, prefixed, elem);
            }
        }

        tests['csstransforms3d'] = function () {
            var ret = !!testPropsAll('perspective');
            return ret;
        };
        for (var feature in tests) {
            if (hasOwnProp(tests, feature)) {
                featureName = feature.toLowerCase();
                Modernizr[featureName] = tests[feature]();
                classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
            }
        }
        Modernizr.addTest = function (feature, test) {
            if (typeof feature == 'object') {
                for (var key in feature) {
                    if (hasOwnProp(feature, key)) {
                        Modernizr.addTest(key, feature[key]);
                    }
                }
            } else {
                feature = feature.toLowerCase();
                if (Modernizr[feature] !== undefined) {
                    return Modernizr;
                }
                test = typeof test == 'function' ? test() : test;
                if (typeof enableClasses !== "undefined" && enableClasses) {
                    docElement.className += ' ' + (test ? '' : 'no-') + feature;
                }
                Modernizr[feature] = test;
            }
            return Modernizr;
        };
        setCss('');
        modElem = inputElem = null;
        Modernizr._version = version;
        Modernizr._prefixes = prefixes;
        Modernizr._domPrefixes = domPrefixes;
        Modernizr._cssomPrefixes = cssomPrefixes;
        Modernizr.testProp = function (prop) {
            return testProps([prop]);
        };
        Modernizr.testAllProps = testPropsAll;
        Modernizr.testStyles = injectElementWithStyles;
        Modernizr.prefixed = function (prop, obj, elem) {
            if (!obj) {
                return testPropsAll(prop, 'pfx');
            } else {
                return testPropsAll(prop, obj, elem);
            }
        };
        return Modernizr;
    })(window, document);
    var fullScreenApi = {ok: false, is: function () {
        return false;
    }, request: function () {
    }, cancel: function () {
    }, event: '', prefix: ''}, browserPrefixes = 'webkit moz o ms khtml'.split(' ');
    if (typeof document.cancelFullScreen != 'undefined') {
        fullScreenApi.ok = true;
    } else {
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + 'CancelFullScreen'] != 'undefined') {
                fullScreenApi.ok = true;
                break;
            }
        }
    }
    if (fullScreenApi.ok) {
        fullScreenApi.event = fullScreenApi.prefix + 'fullscreenchange';
        fullScreenApi.is = function () {
            switch (this.prefix) {
                case'':
                    return document.fullScreen;
                case'webkit':
                    return document.webkitIsFullScreen;
                default:
                    return document[this.prefix + 'FullScreen'];
            }
        };
        fullScreenApi.request = function (el) {
            return(this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
        };
        fullScreenApi.cancel = function (el) {
            return(this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
        };
    }
    var Spinner, spinnerDefaults = {lines: 12, length: 5, width: 2, radius: 7, corners: 1, rotate: 15, color: 'rgba(128, 128, 128, .75)', hwaccel: true}, spinnerOverride = {top: 'auto', left: 'auto', className: ''};
    (function (root, factory) {
        Spinner = factory();
    }
    (this, function () {
        "use strict";
        var prefixes = ['webkit', 'Moz', 'ms', 'O'], animations = {}, useCssAnimations

        function createEl(tag, prop) {
            var el = document.createElement(tag || 'div'), n
            for (n in prop)el[n] = prop[n]
            return el
        }

        function ins(parent) {
            for (var i = 1, n = arguments.length; i < n; i++)
                parent.appendChild(arguments[i])
            return parent
        }

        var sheet = (function () {
            var el = createEl('style', {type: 'text/css'})
            ins(document.getElementsByTagName('head')[0], el)
            return el.sheet || el.styleSheet
        }())

        function addAnimation(alpha, trail, i, lines) {
            var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-'), start = 0.01 + i / lines * 100, z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha), prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase(), pre = prefix && '-' + prefix + '-' || ''
            if (!animations[name]) {
                sheet.insertRule('@' + pre + 'keyframes ' + name + '{' + '0%{opacity:' + z + '}' +
                    start + '%{opacity:' + alpha + '}' +
                    (start + 0.01) + '%{opacity:1}' +
                    (start + trail) % 100 + '%{opacity:' + alpha + '}' + '100%{opacity:' + z + '}' + '}', sheet.cssRules.length)
                animations[name] = 1
            }
            return name
        }

        function vendor(el, prop) {
            var s = el.style, pp, i
            prop = prop.charAt(0).toUpperCase() + prop.slice(1)
            for (i = 0; i < prefixes.length; i++) {
                pp = prefixes[i] + prop
                if (s[pp] !== undefined)return pp
            }
            if (s[prop] !== undefined)return prop
        }

        function css(el, prop) {
            for (var n in prop)
                el.style[vendor(el, n) || n] = prop[n]
            return el
        }

        function merge(obj) {
            for (var i = 1; i < arguments.length; i++) {
                var def = arguments[i]
                for (var n in def)
                    if (obj[n] === undefined)obj[n] = def[n]
            }
            return obj
        }

        function pos(el) {
            var o = {x: el.offsetLeft, y: el.offsetTop}
            while ((el = el.offsetParent))
                o.x += el.offsetLeft, o.y += el.offsetTop
            return o
        }

        function getColor(color, idx) {
            return typeof color == 'string' ? color : color[idx % color.length]
        }

        var defaults = {lines: 12, length: 7, width: 5, radius: 10, rotate: 0, corners: 1, color: '#000', direction: 1, speed: 1, trail: 100, opacity: 1 / 4, fps: 20, zIndex: 2e9, className: 'spinner', top: 'auto', left: 'auto', position: 'relative'}

        function Spinner(o) {
            if (typeof this == 'undefined')return new Spinner(o)
            this.opts = merge(o || {}, Spinner.defaults, defaults)
        }

        Spinner.defaults = {}
        merge(Spinner.prototype, {spin: function (target) {
            this.stop()
            var self = this, o = self.opts, el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex}), mid = o.radius + o.length + o.width, ep
                , tp
            if (target) {
                target.insertBefore(el, target.firstChild || null)
                tp = pos(target)
                ep = pos(el)
                css(el, {left: (o.left == 'auto' ? tp.x - ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + 'px', top: (o.top == 'auto' ? tp.y - ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid) + 'px'})
            }
            el.setAttribute('role', 'progressbar')
            self.lines(el, self.opts)
            if (!useCssAnimations) {
                var i = 0, start = (o.lines - 1) * (1 - o.direction) / 2, alpha, fps = o.fps, f = fps / o.speed, ostep = (1 - o.opacity) / (f * o.trail / 100), astep = f / o.lines;
                (function anim() {
                    i++;
                    for (var j = 0; j < o.lines; j++) {
                        alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)
                        self.opacity(el, j * o.direction + start, alpha, o)
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
                })()
            }
            return self
        }, stop: function () {
            var el = this.el
            if (el) {
                clearTimeout(this.timeout)
                if (el.parentNode)el.parentNode.removeChild(el)
                this.el = undefined
            }
            return this
        }, lines: function (el, o) {
            var i = 0, start = (o.lines - 1) * (1 - o.direction) / 2, seg

            function fill(color, shadow) {
                return css(createEl(), {position: 'absolute', width: (o.length + o.width) + 'px', height: o.width + 'px', background: color, boxShadow: shadow, transformOrigin: 'left', transform: 'rotate(' + ~~(360 / o.lines * i + o.rotate) + 'deg) translate(' + o.radius + 'px' + ',0)', borderRadius: (o.corners * o.width >> 1) + 'px'})
            }

            for (; i < o.lines; i++) {
                seg = css(createEl(), {position: 'absolute', top: 1 + ~(o.width / 2) + 'px', transform: o.hwaccel ? 'translate3d(0,0,0)' : '', opacity: o.opacity, animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'})
                if (o.shadow)ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2 + 'px'}))
                ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
            }
            return el
        }, opacity: function (el, i, val) {
            if (i < el.childNodes.length)el.childNodes[i].style.opacity = val
        }})
        function initVML() {
            function vml(tag, attr) {
                return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
            }

            sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')
            Spinner.prototype.lines = function (el, o) {
                var r = o.length + o.width, s = 2 * r

                function grp() {
                    return css(vml('group', {coordsize: s + ' ' + s, coordorigin: -r + ' ' + -r}), {width: s, height: s})
                }

                var margin = -(o.width + o.length) * 2 + 'px', g = css(grp(), {position: 'absolute', top: margin, left: margin}), i

                function seg(i, dx, filter) {
                    ins(g, ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}), ins(css(vml('roundrect', {arcsize: o.corners}), {width: r, height: o.width, left: o.radius, top: -o.width >> 1, filter: filter}), vml('fill', {color: getColor(o.color, i), opacity: o.opacity}), vml('stroke', {opacity: 0})
                    )))
                }

                if (o.shadow)
                    for (i = 1; i <= o.lines; i++)
                        seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')
                for (i = 1; i <= o.lines; i++)seg(i)
                return ins(el, g)
            }
            Spinner.prototype.opacity = function (el, i, val, o) {
                var c = el.firstChild
                o = o.shadow && o.lines || 0
                if (c && i + o < c.childNodes.length) {
                    c = c.childNodes[i + o];
                    c = c && c.firstChild;
                    c = c && c.firstChild
                    if (c)c.opacity = val
                }
            }
        }

        var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})
        if (!vendor(probe, 'transform') && probe.adj)initVML()
        else useCssAnimations = vendor(probe, 'animation')
        return Spinner
    }));
    function bez(coOrdArray) {
        var encodedFuncName = "bez_" + $.makeArray(arguments).join("_").replace(".", "p");
        if (typeof $['easing'][encodedFuncName] !== "function") {
            var polyBez = function (p1, p2) {
                var A = [null, null], B = [null, null], C = [null, null], bezCoOrd = function (t, ax) {
                    C[ax] = 3 * p1[ax];
                    B[ax] = 3 * (p2[ax] - p1[ax]) - C[ax];
                    A[ax] = 1 - C[ax] - B[ax];
                    return t * (C[ax] + t * (B[ax] + t * A[ax]));
                }, xDeriv = function (t) {
                    return C[0] + t * (2 * B[0] + 3 * A[0] * t);
                }, xForT = function (t) {
                    var x = t, i = 0, z;
                    while (++i < 14) {
                        z = bezCoOrd(x, 0) - t;
                        if (Math.abs(z) < 1e-3)break;
                        x -= z / xDeriv(x);
                    }
                    return x;
                };
                return function (t) {
                    return bezCoOrd(xForT(t), 1);
                }
            };
            $['easing'][encodedFuncName] = function (x, t, b, c, d) {
                return c * polyBez([coOrdArray[0], coOrdArray[1]], [coOrdArray[2], coOrdArray[3]])(t / d) + b;
            }
        }
        return encodedFuncName;
    }

    var $WINDOW = $(window), $DOCUMENT = $(document), $HTML, $BODY, QUIRKS_FORCE = location.hash.replace('#', '') === 'quirks', TRANSFORMS3D = Modernizr.csstransforms3d, CSS3 = TRANSFORMS3D && !QUIRKS_FORCE, COMPAT = TRANSFORMS3D || document.compatMode === 'CSS1Compat', FULLSCREEN = fullScreenApi.ok, MOBILE = navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i), SLOW = !CSS3 || MOBILE, MS_POINTER = navigator.msPointerEnabled, WHEEL = "onwheel"in document.createElement("div") ? "wheel" : document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll", TOUCH_TIMEOUT = 250, TRANSITION_DURATION = 300, SCROLL_LOCK_TIMEOUT = 1400, AUTOPLAY_INTERVAL = 5000, MARGIN = 2, THUMB_SIZE = 64, WIDTH = 500, HEIGHT = 333, STAGE_FRAME_KEY = '$stageFrame', NAV_DOT_FRAME_KEY = '$navDotFrame', NAV_THUMB_FRAME_KEY = '$navThumbFrame', AUTO = 'auto', BEZIER = bez([.1, 0, .25, 1]), MAX_WIDTH = 99999, FIFTYFIFTY = '50%', OPTIONS = { width: null, minwidth: null, maxwidth: '100%', height: null, minheight: null, maxheight: null, ratio: null, margin: MARGIN, glimpse: 0, fit: 'contain', position: FIFTYFIFTY, thumbposition: FIFTYFIFTY, nav: 'dots', navposition: 'bottom', navwidth: null, thumbwidth: THUMB_SIZE, thumbheight: THUMB_SIZE, thumbmargin: MARGIN, thumbborderwidth: MARGIN, thumbfit: 'cover', allowfullscreen: false, transition: 'slide', clicktransition: null, transitionduration: TRANSITION_DURATION, captions: true, hash: false, startindex: 0, loop: false, autoplay: false, stopautoplayontouch: true, keyboard: false, arrows: true, click: true, swipe: true, trackpad: false, enableifsingleframe: false, controlsonstart: true, shuffle: false, direction: 'ltr', shadows: true, spinner: null}, KEYBOARD_OPTIONS = {left: true, right: true, down: false, up: false, space: false, home: false, end: false};

    function noop() {
    }

    function minMaxLimit(value, min, max) {
        return Math.max(isNaN(min) ? -Infinity : min, Math.min(isNaN(max) ? Infinity : max, value));
    }

    function readTransform(css) {
        return css.match(/ma/) && css.match(/-?\d+(?!d)/g)[css.match(/3d/) ? 12 : 4];
    }

    function readPosition($el) {
        if (CSS3) {
            return+readTransform($el.css('transform'));
        } else {
            return+$el.css('left').replace('px', '');
        }
    }

    function getTranslate(pos) {
        var obj = {};
        if (CSS3) {
            obj.transform = 'translate3d(' + (pos ) + 'px,0,0)';
        } else {
            obj.left = pos;
        }
        return obj;
    }

    function getDuration(time) {
        return{'transition-duration': time + 'ms'};
    }

    function unlessNaN(value, alternative) {
        return isNaN(value) ? alternative : value;
    }

    function numberFromMeasure(value, measure) {
        return unlessNaN(+String(value).replace(measure || 'px', ''));
    }

    function numberFromPercent(value) {
        return /%$/.test(value) ? numberFromMeasure(value, '%') : undefined;
    }

    function numberFromWhatever(value, whole) {
        return unlessNaN(numberFromPercent(value) / 100 * whole, numberFromMeasure(value));
    }

    function measureIsValid(value) {
        return(!isNaN(numberFromMeasure(value)) || !isNaN(numberFromMeasure(value, '%'))) && value;
    }

    function getPosByIndex(index, side, margin, baseIndex) {
        return(index - (baseIndex || 0)) * (side + (margin || 0));
    }

    function getIndexByPos(pos, side, margin, baseIndex) {
        return-Math.round(pos / (side + (margin || 0)) - (baseIndex || 0));
    }

    function bindTransitionEnd($el) {
        var elData = $el.data();
        if (elData.tEnd)return;
        var el = $el[0], transitionEndEvent = {WebkitTransition: 'webkitTransitionEnd', MozTransition: 'transitionend', OTransition: 'oTransitionEnd otransitionend', msTransition: 'MSTransitionEnd', transition: 'transitionend'};
        addEvent(el, transitionEndEvent[Modernizr.prefixed('transition')], function (e) {
            elData.tProp && e.propertyName.match(elData.tProp) && elData.onEndFn();
        });
        elData.tEnd = true;
    }

    function afterTransition($el, property, fn, time) {
        var ok, elData = $el.data();
        if (elData) {
            elData.onEndFn = function () {
                if (ok)return;
                ok = true;
                clearTimeout(elData.tT);
                fn();
            };
            elData.tProp = property;
            clearTimeout(elData.tT);
            elData.tT = setTimeout(function () {
                elData.onEndFn();
            }, time * 1.5);
            bindTransitionEnd($el);
        }
    }

    function stop($el, left) {
        if ($el.length) {
            var elData = $el.data();
            if (CSS3) {
                $el.css(getDuration(0));
                elData.onEndFn = noop;
                clearTimeout(elData.tT);
            } else {
                $el.stop();
            }
            var lockedLeft = getNumber(left, function () {
                return readPosition($el);
            });
            $el.css(getTranslate(lockedLeft));
            return lockedLeft;
        }
    }

    function getNumber() {
        var number;
        for (var _i = 0, _l = arguments.length; _i < _l; _i++) {
            number = _i ? arguments[_i]() : arguments[_i];
            if (typeof number === 'number') {
                break;
            }
        }
        return number;
    }

    function edgeResistance(pos, edge) {
        return Math.round(pos + ((edge - pos) / 1.5));
    }

    function getProtocol() {
        getProtocol.p = getProtocol.p || (location.protocol === 'https:' ? 'https://' : 'http://');
        return getProtocol.p;
    }

    function parseHref(href) {
        var a = document.createElement('a');
        a.href = href;
        return a;
    }

    function findVideoId(href, forceVideo) {
        if (typeof href !== 'string')return href;
        href = parseHref(href);
        var id, type;
        if (href.host.match(/youtube\.com/) && href.search) {
            id = href.search.split('v=')[1];
            if (id) {
                var ampersandPosition = id.indexOf('&');
                if (ampersandPosition !== -1) {
                    id = id.substring(0, ampersandPosition);
                }
                type = 'youtube';
            }
        } else if (href.host.match(/youtube\.com|youtu\.be/)) {
            id = href.pathname.replace(/^\/(embed\/|v\/)?/, '').replace(/\/.*/, '');
            type = 'youtube';
        } else if (href.host.match(/vimeo\.com/)) {
            type = 'vimeo';
            id = href.pathname.replace(/^\/(video\/)?/, '').replace(/\/.*/, '');
        }
        if ((!id || !type) && forceVideo) {
            id = href.href;
            type = 'custom';
        }
        return id ? {id: id, type: type, s: href.search.replace(/^\?/, ''), p: getProtocol()} : false;
    }

    function getVideoThumbs(dataFrame, data, fotorama) {
        var img, thumb, video = dataFrame.video;
        if (video.type === 'youtube') {
            thumb = getProtocol() + 'img.youtube.com/vi/' + video.id + '/default.jpg';
            img = thumb.replace(/\/default.jpg$/, '/hqdefault.jpg');
            dataFrame.thumbsReady = true;
        } else if (video.type === 'vimeo') {
            $.ajax({url: getProtocol() + 'vimeo.com/api/v2/video/' + video.id + '.json', dataType: 'jsonp', success: function (json) {
                dataFrame.thumbsReady = true;
                updateData(data, {img: json[0].thumbnail_large, thumb: json[0].thumbnail_small}, dataFrame.i, fotorama);
            }});
        } else {
            dataFrame.thumbsReady = true;
        }
        return{img: img, thumb: thumb}
    }

    function updateData(data, _dataFrame, i, fotorama) {
        for (var _i = 0, _l = data.length; _i < _l; _i++) {
            var dataFrame = data[_i];
            if (dataFrame.i === i && dataFrame.thumbsReady) {
                var clear = {videoReady: true};
                clear[STAGE_FRAME_KEY] = clear[NAV_THUMB_FRAME_KEY] = clear[NAV_DOT_FRAME_KEY] = false;
                fotorama.splice(_i, 1, $.extend({}, dataFrame, clear, _dataFrame));
                break;
            }
        }
    }

    function getDataFromHtml($el) {
        var data = [];

        function getDataFromImg($img, imgData, checkVideo) {
            var $child = $img.children('img').eq(0), _imgHref = $img.attr('href'), _imgSrc = $img.attr('src'), _thumbSrc = $child.attr('src'), _video = imgData.video, video = checkVideo ? findVideoId(_imgHref, _video === true) : false;
            if (video) {
                _imgHref = false;
            } else {
                video = _video;
            }
            getDimensions($img, $child, $.extend(imgData, {video: video, img: imgData.img || _imgHref || _imgSrc || _thumbSrc, thumb: imgData.thumb || _thumbSrc || _imgSrc || _imgHref}));
        }

        function getDimensions($img, $child, imgData) {
            var separateThumbFLAG = imgData.thumb && imgData.img !== imgData.thumb, width = numberFromMeasure(imgData.width || $img.attr('width')), height = numberFromMeasure(imgData.height || $img.attr('height'));
            $.extend(imgData, {width: width, height: height, thumbratio: getRatio(imgData.thumbratio || (numberFromMeasure(imgData.thumbwidth || ($child && $child.attr('width')) || separateThumbFLAG || width) / numberFromMeasure(imgData.thumbheight || ($child && $child.attr('height')) || separateThumbFLAG || height)))});
        }

        $el.children().each(function () {
            var $this = $(this), dataFrame = optionsToLowerCase($.extend($this.data(), {id: $this.attr('id')}));
            if ($this.is('a, img')) {
                getDataFromImg($this, dataFrame, true);
            } else if (!$this.is(':empty')) {
                getDimensions($this, null, $.extend(dataFrame, {html: this, _html: $this.html()
                }));
            } else return;
            data.push(dataFrame);
        });
        return data;
    }

    function isHidden(el) {
        return el.offsetWidth === 0 && el.offsetHeight === 0;
    }

    function isDetached(el) {
        return!$.contains(document.documentElement, el);
    }

    function waitFor(test, fn, timeout, i) {
        if (!waitFor.i) {
            waitFor.i = 1;
            waitFor.ii = [true];
        }
        i = i || waitFor.i;
        if (typeof waitFor.ii[i] === 'undefined') {
            waitFor.ii[i] = true;
        }
        if (test()) {
            fn();
        } else {
            waitFor.ii[i] && setTimeout(function () {
                waitFor.ii[i] && waitFor(test, fn, timeout, i);
            }, timeout || 100);
        }
        return waitFor.i++;
    }

    waitFor.stop = function (i) {
        waitFor.ii[i] = false;
    };
    function setHash(hash) {
        location.replace(location.protocol
            + '//'
            + location.host
            + location.pathname.replace(/^\/?/, '/')
            + location.search
            + '#' + hash);
    }

    function fit($el, measuresToFit, method, position) {
        var elData = $el.data(), measures = elData.measures;
        if (measures && (!elData.l || elData.l.W !== measures.width || elData.l.H !== measures.height || elData.l.r !== measures.ratio || elData.l.w !== measuresToFit.w || elData.l.h !== measuresToFit.h || elData.l.m !== method || elData.l.p !== position)) {
            console.log('fit');
            var width = measures.width, height = measures.height, ratio = measuresToFit.w / measuresToFit.h, biggerRatioFLAG = measures.ratio >= ratio, fitFLAG = method === 'scaledown', containFLAG = method === 'contain', coverFLAG = method === 'cover', pos = parsePosition(position);
            if (biggerRatioFLAG && (fitFLAG || containFLAG) || !biggerRatioFLAG && coverFLAG) {
                width = minMaxLimit(measuresToFit.w, 0, fitFLAG ? width : Infinity);
                height = width / measures.ratio;
            } else if (biggerRatioFLAG && coverFLAG || !biggerRatioFLAG && (fitFLAG || containFLAG)) {
                height = minMaxLimit(measuresToFit.h, 0, fitFLAG ? height : Infinity);
                width = height * measures.ratio;
            }
            $el.css({width: width, height: height, left: numberFromWhatever(pos.x, measuresToFit.w - width), top: numberFromWhatever(pos.y, measuresToFit.h - height)});
            elData.l = {W: measures.width, H: measures.height, r: measures.ratio, w: measuresToFit.w, h: measuresToFit.h, m: method, p: position};
        }
        return true;
    }

    function setStyle($el, style) {
        var el = $el[0];
        if (el.styleSheet) {
            el.styleSheet.cssText = style;
        } else {
            $el.html(style);
        }
    }

    function findShadowEdge(pos, min, max) {
        return min === max ? false : pos <= min ? 'left' : pos >= max ? 'right' : 'left right';
    }

    function getIndexFromHash(hash, data, ok, startindex) {
        if (!ok)return false;
        if (!isNaN(hash))return hash - (startindex ? 0 : 1);
        var index;
        for (var _i = 0, _l = data.length; _i < _l; _i++) {
            var dataFrame = data[_i];
            if (dataFrame.id === hash) {
                index = _i;
                break;
            }
        }
        return index;
    }

    function smartClick($el, fn, _options) {
        _options = _options || {};
        $el.each(function () {
            var $this = $(this), thisData = $this.data(), startEvent;
            if (thisData.clickOn)return;
            thisData.clickOn = true;
            $.extend(touch($this, {onStart: function (e) {
                startEvent = e;
                (_options.onStart || noop).call(this, e);
            }, onMove: _options.onMove || noop, onTouchEnd: _options.onTouchEnd || noop, onEnd: function (result) {
                if (result.moved)return;
                fn.call(this, startEvent);
            }}), {noMove: true});
        });
    }

    function div(classes, child) {
        return'<div class="' + classes + '">' + (child || '') + '</div>';
    }

    function shuffle(array) {
        var l = array.length;
        while (l) {
            var i = Math.floor(Math.random() * l--);
            var t = array[l];
            array[l] = array[i];
            array[i] = t;
        }
        return array;
    }

    function clone(array) {
        return Object.prototype.toString.call(array) == '[object Array]' && $.map(array, function (frame) {
            return $.extend({}, frame);
        });
    }

    function lockScroll($el, left, top) {
        $el.scrollLeft(left || 0).scrollTop(top || 0);
    }

    function optionsToLowerCase(options) {
        if (options) {
            var opts = {};
            $.each(options, function (key, value) {
                opts[key.toLowerCase()] = value;
            });
            return opts;
        }
    }

    function getRatio(_ratio) {
        if (!_ratio)return;
        var ratio = +_ratio;
        if (!isNaN(ratio)) {
            return ratio;
        } else {
            ratio = _ratio.split('/');
            return+ratio[0] / +ratio[1] || undefined;
        }
    }

    function addEvent(el, e, fn, bool) {
        if (!e)return;
        el.addEventListener ? el.addEventListener(e, fn, !!bool) : el.attachEvent('on' + e, fn);
    }

    function elIsDisabled(el) {
        return!!el.getAttribute('disabled');
    }

    function disableAttr(FLAG) {
        return{tabindex: FLAG * -1 + '', disabled: FLAG};
    }

    function addEnterUp(el, fn) {
        addEvent(el, 'keyup', function (e) {
            elIsDisabled(el) || e.keyCode == 13 && fn.call(el, e);
        });
    }

    function addFocus(el, fn) {
        addEvent(el, 'focus', el.onfocusin = function (e) {
            fn.call(el, e);
        }, true);
    }

    function stopEvent(e, stopPropagation) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        stopPropagation && e.stopPropagation && e.stopPropagation();
    }

    function getDirectionSign(forward) {
        return forward ? '>' : '<';
    }

    function parsePosition(rule) {
        rule = (rule + '').split(/\s+/);
        return{x: measureIsValid(rule[0]) || FIFTYFIFTY, y: measureIsValid(rule[1]) || FIFTYFIFTY}
    }

    function slide($el, options) {
        var elData = $el.data(), elPos = Math.round(options.pos), onEndFn = function () {
            elData.sliding = false;
            (options.onEnd || noop)();
        };
        if (typeof options.overPos !== 'undefined' && options.overPos !== options.pos) {
            elPos = options.overPos;
            onEndFn = function () {
                slide($el, $.extend({}, options, {overPos: options.pos, time: Math.max(TRANSITION_DURATION, options.time / 2)}))
            };
        }
        var translate = $.extend(getTranslate(elPos), options.width && {width: options.width});
        elData.sliding = true;
        if (CSS3) {
            $el.css($.extend(getDuration(options.time), translate));
            if (options.time > 10) {
                afterTransition($el, 'transform', onEndFn, options.time);
            } else {
                onEndFn();
            }
        } else {
            $el.stop().animate(translate, options.time, BEZIER, onEndFn);
        }
    }

    function fade($el1, $el2, $frames, options, fadeStack, chain) {
        var chainedFLAG = typeof chain !== 'undefined';
        if (!chainedFLAG) {
            fadeStack.push(arguments);
            Array.prototype.push.call(arguments, fadeStack.length);
            if (fadeStack.length > 1)return;
        }
        $el1 = $el1 || $($el1);
        $el2 = $el2 || $($el2);
        var _$el1 = $el1[0], _$el2 = $el2[0], crossfadeFLAG = options.method === 'crossfade', onEndFn = function () {
            if (!onEndFn.done) {
                onEndFn.done = true;
                var args = (chainedFLAG || fadeStack.shift()) && fadeStack.shift();
                args && fade.apply(this, args);
                (options.onEnd || noop)(!!args);
            }
        }, time = options.time / (chain || 1);
        $frames.removeClass(fadeRearClass + ' ' + fadeFrontClass);
        $el1.stop().addClass(fadeRearClass);
        $el2.stop().addClass(fadeFrontClass);
        crossfadeFLAG && _$el2 && $el1.fadeTo(0, 0);
        $el1.fadeTo(crossfadeFLAG ? time : 0, 1, crossfadeFLAG && onEndFn);
        $el2.fadeTo(time, 0, onEndFn);
        (_$el1 && crossfadeFLAG) || _$el2 || onEndFn();
    }

    var lastEvent, moveEventType, preventEvent, preventEventTimeout;

    function extendEvent(e) {
        var touch = (e.touches || [])[0] || e;
        e._x = touch.pageX;
        e._y = touch.clientY;
        e._now = $.now();
    }

    function touch($el, options) {
        var el = $el[0], tail = {}, touchEnabledFLAG, startEvent, $target, controlTouch, touchFLAG, targetIsSelectFLAG, targetIsLinkFlag, tolerance, moved;

        function onStart(e) {
            $target = $(e.target);
            tail.checked = targetIsSelectFLAG = targetIsLinkFlag = moved = false;
            if (touchEnabledFLAG || tail.flow || (e.touches && e.touches.length > 1) || e.which > 1 || (lastEvent && lastEvent.type !== e.type && preventEvent) || (targetIsSelectFLAG = options.select && $target.is(options.select, el)))return targetIsSelectFLAG;
            touchFLAG = e.type === 'touchstart';
            targetIsLinkFlag = $target.is('a, a *', el);
            controlTouch = tail.control;
            tolerance = (tail.noMove || tail.noSwipe || controlTouch) ? 16 : !tail.snap ? 4 : 0;
            extendEvent(e);
            startEvent = lastEvent = e;
            moveEventType = e.type.replace(/down|start/, 'move').replace(/Down/, 'Move');
            (options.onStart || noop).call(el, e, {control: controlTouch, $target: $target});
            touchEnabledFLAG = tail.flow = true;
            if (!touchFLAG || tail.go)stopEvent(e);
        }

        function onMove(e) {
            if ((e.touches && e.touches.length > 1) || (MS_POINTER && !e.isPrimary) || moveEventType !== e.type || !touchEnabledFLAG) {
                touchEnabledFLAG && onEnd();
                (options.onTouchEnd || noop)();
                return;
            }
            extendEvent(e);
            var xDiff = Math.abs(e._x - startEvent._x), yDiff = Math.abs(e._y - startEvent._y), xyDiff = xDiff - yDiff, xWin = (tail.go || tail.x || xyDiff >= 0) && !tail.noSwipe, yWin = xyDiff < 0;
            if (touchFLAG && !tail.checked) {
                if (touchEnabledFLAG = xWin) {
                    stopEvent(e);
                }
            } else {
                stopEvent(e);
                (options.onMove || noop).call(el, e, {touch: touchFLAG});
            }
            if (!moved && Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)) > tolerance) {
                moved = true;
            }
            tail.checked = tail.checked || xWin || yWin;
        }

        function onEnd(e) {
            (options.onTouchEnd || noop)();
            var _touchEnabledFLAG = touchEnabledFLAG;
            tail.control = touchEnabledFLAG = false;
            if (_touchEnabledFLAG) {
                tail.flow = false;
            }
            if (!_touchEnabledFLAG || (targetIsLinkFlag && !tail.checked))return;
            e && stopEvent(e);
            preventEvent = true;
            clearTimeout(preventEventTimeout);
            preventEventTimeout = setTimeout(function () {
                preventEvent = false;
            }, 1000);
            (options.onEnd || noop).call(el, {moved: moved, $target: $target, control: controlTouch, touch: touchFLAG, startEvent: startEvent, aborted: !e || e.type === 'MSPointerCancel'});
        }

        function onOtherStart() {
            if (tail.flow)return;
            setTimeout(function () {
                tail.flow = true;
            }, 10);
        }

        function onOtherEnd() {
            if (!tail.flow)return;
            setTimeout(function () {
                tail.flow = false;
            }, TOUCH_TIMEOUT);
        }

        if (MS_POINTER) {
            addEvent(el, 'MSPointerDown', onStart);
            addEvent(document, 'MSPointerMove', onMove);
            addEvent(document, 'MSPointerCancel', onEnd);
            addEvent(document, 'MSPointerUp', onEnd);
        } else {
            addEvent(el, 'touchstart', onStart);
            addEvent(el, 'touchmove', onMove);
            addEvent(el, 'touchend', onEnd);
            addEvent(document, 'touchstart', onOtherStart);
            addEvent(document, 'touchend', onOtherEnd);
            addEvent(document, 'touchcancel', onOtherEnd);
            $WINDOW.on('scroll', onOtherEnd);
            $el.on('mousedown', onStart);
            $DOCUMENT.on('mousemove', onMove).on('mouseup', onEnd);
        }
        $el.on('click', 'a', function (e) {
            tail.checked && stopEvent(e);
        });
        return tail;
    }

    function moveOnTouch($el, options) {
        var el = $el[0], elData = $el.data(), tail = {}, startCoo, coo, startElPos, moveElPos, edge, moveTrack, startTime, endTime, min, max, snap, slowFLAG, controlFLAG, moved, tracked;

        function startTracking(e, noStop) {
            tracked = true;
            startCoo = coo = e._x;
            startTime = e._now;
            moveTrack = [
                [startTime, startCoo]
            ];
            startElPos = moveElPos = tail.noMove || noStop ? 0 : stop($el, (options.getPos || noop)());
            (options.onStart || noop).call(el, e);
        }

        function onStart(e, result) {
            min = tail.min;
            max = tail.max;
            snap = tail.snap;
            slowFLAG = e.altKey;
            tracked = moved = false;
            controlFLAG = result.control;
            if (!controlFLAG && !elData.sliding) {
                startTracking(e);
            }
        }

        function onMove(e, result) {
            if (!tail.noSwipe) {
                if (!tracked) {
                    startTracking(e);
                }
                coo = e._x;
                moveTrack.push([e._now, coo]);
                moveElPos = startElPos - (startCoo - coo);
                edge = findShadowEdge(moveElPos, min, max);
                if (moveElPos <= min) {
                    moveElPos = edgeResistance(moveElPos, min);
                } else if (moveElPos >= max) {
                    moveElPos = edgeResistance(moveElPos, max);
                }
                if (!tail.noMove) {
                    $el.css(getTranslate(moveElPos));
                    if (!moved) {
                        moved = true;
                        result.touch || MS_POINTER || $el.addClass(grabbingClass);
                    }
                    (options.onMove || noop).call(el, e, {pos: moveElPos, edge: edge});
                }
            }
        }

        function onEnd(result) {
            if (tail.noSwipe && result.moved)return;
            if (!tracked) {
                startTracking(result.startEvent, true);
            }
            result.touch || MS_POINTER || $el.removeClass(grabbingClass);
            endTime = $.now();
            var _backTimeIdeal = endTime - TOUCH_TIMEOUT, _backTime, _timeDiff, _timeDiffLast, backTime = null, backCoo, virtualPos, limitPos, newPos, overPos, time = TRANSITION_DURATION, speed, friction = options.friction;
            for (var _i = moveTrack.length - 1; _i >= 0; _i--) {
                _backTime = moveTrack[_i][0];
                _timeDiff = Math.abs(_backTime - _backTimeIdeal);
                if (backTime === null || _timeDiff < _timeDiffLast) {
                    backTime = _backTime;
                    backCoo = moveTrack[_i][1];
                } else if (backTime === _backTimeIdeal || _timeDiff > _timeDiffLast) {
                    break;
                }
                _timeDiffLast = _timeDiff;
            }
            newPos = minMaxLimit(moveElPos, min, max);
            var cooDiff = backCoo - coo, forwardFLAG = cooDiff >= 0, timeDiff = endTime - backTime, longTouchFLAG = timeDiff > TOUCH_TIMEOUT, swipeFLAG = !longTouchFLAG && moveElPos !== startElPos && newPos === moveElPos;
            if (snap) {
                newPos = minMaxLimit(Math[swipeFLAG ? (forwardFLAG ? 'floor' : 'ceil') : 'round'](moveElPos / snap) * snap, min, max);
                min = max = newPos;
            }
            if (swipeFLAG && (snap || newPos === moveElPos)) {
                speed = -(cooDiff / timeDiff);
                time *= minMaxLimit(Math.abs(speed), options.timeLow, options.timeHigh);
                virtualPos = Math.round(moveElPos + speed * time / friction);
                if (!snap) {
                    newPos = virtualPos;
                }
                if (!forwardFLAG && virtualPos > max || forwardFLAG && virtualPos < min) {
                    limitPos = forwardFLAG ? min : max;
                    overPos = virtualPos - limitPos;
                    if (!snap) {
                        newPos = limitPos;
                    }
                    overPos = minMaxLimit(newPos + overPos * .03, limitPos - 50, limitPos + 50);
                    time = Math.abs((moveElPos - overPos) / (speed / friction));
                }
            }
            time *= slowFLAG ? 10 : 1;
            (options.onEnd || noop).call(el, $.extend(result, {moved: result.moved || longTouchFLAG && snap, pos: moveElPos, newPos: newPos, overPos: overPos, time: time}));
        }

        tail = $.extend(touch(options.$wrap, $.extend({}, options, {onStart: onStart, onMove: onMove, onEnd: onEnd})), tail);
        return tail;
    }

    function wheel($el, options) {
        var el = $el[0], lockFLAG, lastDirection, lastNow, tail = {prevent: {}};
        addEvent(el, WHEEL, function (e) {
            var yDelta = e.wheelDeltaY || -1 * e.deltaY || 0, xDelta = e.wheelDeltaX || -1 * e.deltaX || 0, xWin = Math.abs(xDelta) && !Math.abs(yDelta), direction = getDirectionSign(xDelta < 0), sameDirection = lastDirection === direction, now = $.now(), tooFast = now - lastNow < TOUCH_TIMEOUT;
            lastDirection = direction;
            lastNow = now;
            if (!xWin || !tail.ok || tail.prevent[direction] && !lockFLAG) {
                return;
            } else {
                stopEvent(e, true);
                if (lockFLAG && sameDirection && tooFast) {
                    return;
                }
            }
            if (options.shift) {
                lockFLAG = true;
                clearTimeout(tail.t);
                tail.t = setTimeout(function () {
                    lockFLAG = false;
                }, SCROLL_LOCK_TIMEOUT);
            }
            (options.onEnd || noop)(e, options.shift ? direction : xDelta);
        });
        return tail;
    }

    jQuery.Fotorama = function ($fotorama, opts) {
        $HTML = $('html');
        $BODY = $('body');
        var that = this, stamp = $.now(), stampClass = _fotoramaClass + stamp, fotorama = $fotorama[0], data, dataFrameCount = 1, fotoramaData = $fotorama.data(), size, $style = $('<style></style>'), $anchor = $(div(hiddenClass)), $wrap = $(div(wrapClass)), $stage = $(div(stageClass)).appendTo($wrap), stage = $stage[0], $stageShaft = $(div(stageShaftClass)).appendTo($stage), $stageFrame = $(), $arrPrev = $(div(arrClass + ' ' + arrPrevClass + buttonAttributes)), $arrNext = $(div(arrClass + ' ' + arrNextClass + buttonAttributes)), $arrs = $arrPrev.add($arrNext).appendTo($stage), $navWrap = $(div(navWrapClass)), $nav = $(div(navClass)).appendTo($navWrap), $navShaft = $(div(navShaftClass)).appendTo($nav), $navFrame, $navDotFrame = $(), $navThumbFrame = $(), stageShaftData = $stageShaft.data(), navShaftData = $navShaft.data(), $thumbBorder = $(div(thumbBorderClass)).appendTo($navShaft), $fullscreenIcon = $(div(fullscreenIconClass + buttonAttributes)), fullscreenIcon = $fullscreenIcon[0], $videoPlay = $(div(videoPlayClass)), $videoClose = $(div(videoCloseClass)).appendTo($stage), videoClose = $videoClose[0], spinner, $spinner = $(div(spinnerClass)), $videoPlaying, activeIndex = false, activeFrame, activeIndexes, repositionIndex, dirtyIndex, lastActiveIndex, prevIndex, nextIndex, nextAutoplayIndex, startIndex, o_loop, o_nav, o_navThumbs, o_navTop, o_allowFullScreen, o_nativeFullScreen, o_fade, o_thumbSide, o_thumbSide2, o_transitionDuration, o_transition, o_shadows, o_rtl, o_keyboard, lastOptions = {}, measures = {}, measuresSetFLAG, stageShaftTouchTail = {}, stageWheelTail = {}, navShaftTouchTail = {}, navWheelTail = {}, scrollTop, scrollLeft, showedFLAG, pausedAutoplayFLAG, stoppedAutoplayFLAG, toDeactivate = {}, toDetach = {}, measuresStash, touchedFLAG, hoverFLAG, navFrameKey, stageLeft = 0, fadeStack = [];
        $wrap[STAGE_FRAME_KEY] = $(div(stageFrameClass));
        $wrap[NAV_THUMB_FRAME_KEY] = $(div(navFrameClass + ' ' + navFrameThumbClass + buttonAttributes, div(thumbClass)));
        $wrap[NAV_DOT_FRAME_KEY] = $(div(navFrameClass + ' ' + navFrameDotClass + buttonAttributes, div(dotClass)));
        toDeactivate[STAGE_FRAME_KEY] = [];
        toDeactivate[NAV_THUMB_FRAME_KEY] = [];
        toDeactivate[NAV_DOT_FRAME_KEY] = [];
        toDetach[STAGE_FRAME_KEY] = {};
        $wrap.addClass(CSS3 ? wrapCss3Class : wrapCss2Class).toggleClass(wrapNoControlsClass, !opts.controlsonstart);
        fotoramaData.fotorama = this;
        function checkForVideo() {
            $.each(data, function (i, dataFrame) {
                if (!dataFrame.i) {
                    dataFrame.i = dataFrameCount++;
                    var video = findVideoId(dataFrame.video, true);
                    if (video) {
                        var thumbs = {};
                        dataFrame.video = video;
                        if (!dataFrame.img && !dataFrame.thumb) {
                            thumbs = getVideoThumbs(dataFrame, data, that);
                        } else {
                            dataFrame.thumbsReady = true;
                        }
                        updateData(data, {img: thumbs.img, thumb: thumbs.thumb}, dataFrame.i, that);
                    }
                }
            });
        }

        function allowKey(key) {
            return o_keyboard[key] || that.fullScreen;
        }

        function bindGlobalEvents(FLAG) {
            var keydownCommon = 'keydown.' + _fotoramaClass, localStamp = _fotoramaClass + stamp, keydownLocal = 'keydown.' + localStamp, resizeLocal = 'resize.' + localStamp + ' ' + 'orientationchange.' + localStamp;
            if (FLAG) {
                $DOCUMENT.on(keydownLocal, function (e) {
                    var catched, index;
                    if ($videoPlaying && e.keyCode === 27) {
                        catched = true;
                        unloadVideo($videoPlaying, true, true);
                    } else if (that.fullScreen || (opts.keyboard && !that.index)) {
                        if (e.keyCode === 27) {
                            catched = true;
                            that.cancelFullScreen();
                        } else if ((e.shiftKey && e.keyCode === 32 && allowKey('space')) || (e.keyCode === 37 && allowKey('left')) || (e.keyCode === 38 && allowKey('up'))) {
                            index = '<';
                        } else if ((e.keyCode === 32 && allowKey('space')) || (e.keyCode === 39 && allowKey('right')) || (e.keyCode === 40 && allowKey('down'))) {
                            index = '>';
                        } else if (e.keyCode === 36 && allowKey('home')) {
                            index = '<<';
                        } else if (e.keyCode === 35 && allowKey('end')) {
                            index = '>>';
                        }
                    }
                    (catched || index) && stopEvent(e);
                    index && that.show({index: index, slow: e.altKey, user: true});
                });
                if (!that.index) {
                    $DOCUMENT.off(keydownCommon).on(keydownCommon, 'textarea, input, select', function (e) {
                        !$BODY.hasClass(_fullscreenClass) && e.stopPropagation();
                    });
                }
                $WINDOW.on(resizeLocal, that.resize);
            } else {
                $DOCUMENT.off(keydownLocal);
                $WINDOW.off(resizeLocal);
            }
        }

        function appendElements(FLAG) {
            if (FLAG === appendElements.f)return;
            if (FLAG) {
                $fotorama.html('').addClass(_fotoramaClass + ' ' + stampClass).append($wrap).before($style).before($anchor);
                addInstance(that);
            } else {
                $wrap.detach();
                $style.detach();
                $anchor.detach();
                $fotorama.html(fotoramaData.urtext).removeClass(stampClass);
                hideInstance(that);
            }
            bindGlobalEvents(FLAG);
            appendElements.f = FLAG;
        }

        function setData() {
            data = that.data = data || clone(opts.data) || getDataFromHtml($fotorama);
            size = that.size = data.length;
            !ready.ok && opts.shuffle && shuffle(data);
            checkForVideo();
            activeIndex = limitIndex(activeIndex);
            size && appendElements(true);
        }

        function stageNoMove() {
            var _noMove = (size < 2 && !opts.enableifsingleframe) || $videoPlaying;
            stageShaftTouchTail.noMove = _noMove || o_fade;
            stageShaftTouchTail.noSwipe = _noMove || !opts.swipe;
            !o_transition && $stageShaft.toggleClass(grabClass, !opts.click && !stageShaftTouchTail.noMove && !stageShaftTouchTail.noSwipe);
            MS_POINTER && $wrap.toggleClass(wrapPanYClass, !stageShaftTouchTail.noSwipe);
        }

        function setAutoplayInterval(interval) {
            if (interval === true)interval = '';
            opts.autoplay = Math.max(+interval || AUTOPLAY_INTERVAL, o_transitionDuration * 1.5);
        }

        function setOptions() {
            that.options = opts = optionsToLowerCase(opts);
            o_fade = (opts.transition === 'crossfade' || opts.transition === 'dissolve');
            o_loop = opts.loop && (size > 2 || (o_fade && (!o_transition || o_transition !== 'slide')));
            o_transitionDuration = +opts.transitionduration || TRANSITION_DURATION;
            o_rtl = opts.direction === 'rtl';
            o_keyboard = $.extend({}, opts.keyboard && KEYBOARD_OPTIONS, opts.keyboard);
            var classes = {add: [], remove: []};

            function addOrRemoveClass(FLAG, value) {
                classes[FLAG ? 'add' : 'remove'].push(value);
            }

            if (size > 1 || opts.enableifsingleframe) {
                o_nav = opts.nav;
                o_navTop = opts.navposition === 'top';
                classes.remove.push(selectClass);
                $arrs.toggle(!!opts.arrows);
            } else {
                o_nav = false;
                $arrs.hide();
            }
            spinnerStop();
            spinner = new Spinner($.extend(spinnerDefaults, opts.spinner, spinnerOverride, {direction: o_rtl ? -1 : 1}));
            arrsUpdate();
            stageWheelUpdate();
            if (opts.autoplay)setAutoplayInterval(opts.autoplay);
            o_thumbSide = numberFromMeasure(opts.thumbwidth) || THUMB_SIZE;
            o_thumbSide2 = numberFromMeasure(opts.thumbheight) || THUMB_SIZE;
            stageWheelTail.ok = navWheelTail.ok = opts.trackpad && !SLOW;
            stageNoMove();
            extendMeasures(opts, [measures]);
            o_navThumbs = o_nav === 'thumbs';
            if (o_navThumbs) {
                frameDraw(size, 'navThumb');
                $navFrame = $navThumbFrame;
                navFrameKey = NAV_THUMB_FRAME_KEY;
                setStyle($style, $.Fotorama.jst.style({w: o_thumbSide, h: o_thumbSide2, b: opts.thumbborderwidth, m: opts.thumbmargin, s: stamp, q: !COMPAT}));
                $nav.addClass(navThumbsClass).removeClass(navDotsClass);
            } else if (o_nav === 'dots') {
                frameDraw(size, 'navDot');
                $navFrame = $navDotFrame;
                navFrameKey = NAV_DOT_FRAME_KEY;
                $nav.addClass(navDotsClass).removeClass(navThumbsClass);
            } else {
                o_nav = false;
                $nav.removeClass(navThumbsClass + ' ' + navDotsClass);
            }
            if (o_nav) {
                if (o_navTop) {
                    $navWrap.insertBefore($stage);
                } else {
                    $navWrap.insertAfter($stage);
                }
                frameAppend.nav = false;
                frameAppend($navFrame, $navShaft, 'nav');
            }
            o_allowFullScreen = opts.allowfullscreen;
            if (o_allowFullScreen) {
                $fullscreenIcon.prependTo($stage);
                o_nativeFullScreen = FULLSCREEN && o_allowFullScreen === 'native';
            } else {
                $fullscreenIcon.detach();
                o_nativeFullScreen = false;
            }
            addOrRemoveClass(o_fade, wrapFadeClass);
            addOrRemoveClass(!o_fade, wrapSlideClass);
            addOrRemoveClass(!opts.captions, wrapNoCaptionsClass);
            addOrRemoveClass(o_rtl, wrapRtlClass);
            addOrRemoveClass(opts.arrows !== 'always', wrapToggleArrowsClass);
            o_shadows = opts.shadows && !SLOW;
            addOrRemoveClass(!o_shadows, wrapNoShadowsClass);
            $wrap.addClass(classes.add.join(' ')).removeClass(classes.remove.join(' '));
            lastOptions = $.extend({}, opts);
        }

        function normalizeIndex(index) {
            return index < 0 ? (size + (index % size)) % size : index >= size ? index % size : index;
        }

        function limitIndex(index) {
            return minMaxLimit(index, 0, size - 1);
        }

        function edgeIndex(index) {
            return o_loop ? normalizeIndex(index) : limitIndex(index);
        }

        function getPrevIndex(index) {
            return index > 0 || o_loop ? index - 1 : false;
        }

        function getNextIndex(index) {
            return index < size - 1 || o_loop ? index + 1 : false;
        }

        function setStageShaftMinmaxAndSnap() {
            stageShaftTouchTail.min = o_loop ? -Infinity : -getPosByIndex(size - 1, measures.w, opts.margin, repositionIndex);
            stageShaftTouchTail.max = o_loop ? Infinity : -getPosByIndex(0, measures.w, opts.margin, repositionIndex);
            stageShaftTouchTail.snap = measures.w + opts.margin;
        }

        function setNavShaftMinMax() {
            navShaftTouchTail.min = Math.min(0, measures.nw - $navShaft.width());
            navShaftTouchTail.max = 0;
            $navShaft.toggleClass(grabClass, !(navShaftTouchTail.noMove = navShaftTouchTail.min === navShaftTouchTail.max));
        }

        function eachIndex(indexes, type, fn) {
            if (typeof indexes === 'number') {
                indexes = new Array(indexes);
                var rangeFLAG = true;
            }
            return $.each(indexes, function (i, index) {
                if (rangeFLAG)index = i;
                if (typeof index === 'number') {
                    var dataFrame = data[normalizeIndex(index)];
                    if (dataFrame) {
                        var key = '$' + type + 'Frame', $frame = dataFrame[key];
                        fn.call(this, i, index, dataFrame, $frame, key, $frame && $frame.data());
                    }
                }
            });
        }

        function setMeasures(width, height, ratio, index) {
            if (!measuresSetFLAG || (measuresSetFLAG === '*' && index === startIndex)) {
                width = measureIsValid(opts.width) || measureIsValid(width) || WIDTH;
                height = measureIsValid(opts.height) || measureIsValid(height) || HEIGHT;
                that.resize({width: width, ratio: opts.ratio || ratio || width / height}, 0, index !== startIndex && '*');
            }
        }

        function loadImg(indexes, type, specialMeasures, method, position, again) {
            eachIndex(indexes, type, function (i, index, dataFrame, $frame, key, frameData) {
                if (!$frame)return;
                var fullFLAG = that.fullScreen && dataFrame.full && dataFrame.full !== dataFrame.img && !frameData.$full && type === 'stage';
                if (frameData.$img && !again && !fullFLAG)return;
                var img = new Image(), $img = $(img), imgData = $img.data();
                frameData[fullFLAG ? '$full' : '$img'] = $img;
                var srcKey = type === 'stage' ? (fullFLAG ? 'full' : 'img') : 'thumb', src = dataFrame[srcKey], dummy = fullFLAG ? null : dataFrame[type === 'stage' ? 'thumb' : 'img'];
                if (type === 'navThumb')$frame = frameData.$wrap;
                function triggerTriggerEvent(event) {
                    var _index = normalizeIndex(index);
                    triggerEvent(event, {index: _index, src: src, frame: data[_index]});
                }

                function error() {
                    $img.remove();
                    $.Fotorama.cache[src] = 'error';
                    if ((!dataFrame.html || type !== 'stage') && dummy && dummy !== src) {
                        dataFrame[srcKey] = src = dummy;
                        loadImg([index], type, specialMeasures, method, position, true);
                    } else {
                        if (src && !dataFrame.html && !fullFLAG) {
                            $frame.trigger('f:error').removeClass(loadingClass).addClass(errorClass);
                            triggerTriggerEvent('error');
                        } else if (type === 'stage') {
                            $frame.trigger('f:load').removeClass(loadingClass + ' ' + errorClass).addClass(loadedClass);
                            triggerTriggerEvent('load');
                            setMeasures();
                        }
                        frameData.state = 'error';
                        if (size > 1 && data[index] === dataFrame && !dataFrame.html && !dataFrame.deleted && !dataFrame.video && !fullFLAG) {
                            dataFrame.deleted = true;
                            that.splice(index, 1);
                        }
                    }
                }

                function loaded() {
                    $.Fotorama.measures[src] = imgData.measures = $.Fotorama.measures[src] || {width: img.width, height: img.height, ratio: img.width / img.height};
                    setMeasures(imgData.measures.width, imgData.measures.height, imgData.measures.ratio, index);
                    $img.off('load error').addClass(imgClass + (fullFLAG ? ' ' + imgFullClass : '')).prependTo($frame);
                    fit($img, ($.isFunction(specialMeasures) ? specialMeasures() : specialMeasures) || measures, method || dataFrame.fit || opts.fit, position || dataFrame.position || opts.position);
                    $.Fotorama.cache[src] = frameData.state = 'loaded';
                    setTimeout(function () {
                        $frame.trigger('f:load').removeClass(loadingClass + ' ' + errorClass).addClass(loadedClass + ' ' + (fullFLAG ? loadedFullClass : loadedImgClass));
                        if (type === 'stage') {
                            triggerTriggerEvent('load');
                        } else if (dataFrame.thumbratio === AUTO || !dataFrame.thumbratio && opts.thumbratio === AUTO) {
                            dataFrame.thumbratio = imgData.measures.ratio;
                            reset();
                        }
                    }, 0);
                }

                if (!src) {
                    error();
                    return;
                }
                function waitAndLoad() {
                    var _i = 10;
                    waitFor(function () {
                        return!touchedFLAG || !_i-- && !SLOW;
                    }, function () {
                        loaded();
                    });
                }

                if (!$.Fotorama.cache[src]) {
                    $.Fotorama.cache[src] = '*';
                    $img.on('load', waitAndLoad).on('error', error);
                } else {
                    (function justWait() {
                        if ($.Fotorama.cache[src] === 'error') {
                            error();
                        } else if ($.Fotorama.cache[src] === 'loaded') {
                            setTimeout(waitAndLoad, 0);
                        } else {
                            setTimeout(justWait, 100);
                        }
                    })();
                }
                frameData.state = '';
                img.src = src;
            });
        }

        function spinnerSpin($el) {
            $spinner.append(spinner.spin().el).appendTo($el);
        }

        function spinnerStop() {
            $spinner.detach();
            spinner && spinner.stop();
        }

        function updateFotoramaState() {
            var $frame = activeFrame[STAGE_FRAME_KEY];
            if ($frame && !$frame.data().state) {
                spinnerSpin($frame);
                $frame.on('f:load f:error', function () {
                    $frame.off('f:load f:error');
                    spinnerStop();
                });
            }
        }

        function addNavFrameEvents(frame) {
            addEnterUp(frame, onNavFrameClick);
            addFocus(frame, function () {
                setTimeout(function () {
                    lockScroll($nav);
                }, 0);
                slideNavShaft({time: o_transitionDuration, guessIndex: $(this).data().eq, minMax: navShaftTouchTail});
            });
        }

        function frameDraw(indexes, type) {
            eachIndex(indexes, type, function (i, index, dataFrame, $frame, key, frameData) {
                if ($frame)return;
                $frame = dataFrame[key] = $wrap[key].clone();
                frameData = $frame.data();
                frameData.data = dataFrame;
                var frame = $frame[0];
                if (type === 'stage') {
                    if (dataFrame.html) {
                        $('<div class="' + htmlClass + '"></div>').append(dataFrame._html ? $(dataFrame.html).removeAttr('id').html(dataFrame._html)
                            : dataFrame.html).appendTo($frame);
                    }
                    dataFrame.caption && $(div(captionClass, div(captionWrapClass, dataFrame.caption))).appendTo($frame);
                    dataFrame.video && $frame.addClass(stageFrameVideoClass).append($videoPlay.clone());
                    addFocus(frame, function () {
                        setTimeout(function () {
                            lockScroll($stage);
                        }, 0);
                        clickToShow({index: frameData.eq, user: true});
                    });
                    $stageFrame = $stageFrame.add($frame);
                } else if (type === 'navDot') {
                    addNavFrameEvents(frame);
                    $navDotFrame = $navDotFrame.add($frame);
                } else if (type === 'navThumb') {
                    addNavFrameEvents(frame);
                    frameData.$wrap = $frame.children(':first');
                    $navThumbFrame = $navThumbFrame.add($frame);
                    if (dataFrame.video) {
                        frameData.$wrap.append($videoPlay.clone());
                    }
                }
            });
        }

        function callFit($img, measuresToFit, method, position) {
            return $img && $img.length && fit($img, measuresToFit, method, position);
        }

        function stageFramePosition(indexes) {
            eachIndex(indexes, 'stage', function (i, index, dataFrame, $frame, key, frameData) {
                if (!$frame)return;
                var normalizedIndex = normalizeIndex(index), method = dataFrame.fit || opts.fit, position = dataFrame.position || opts.position;
                frameData.eq = normalizedIndex;
                toDetach[STAGE_FRAME_KEY][normalizedIndex] = $frame.css($.extend({left: o_fade ? 0 : getPosByIndex(index, measures.w, opts.margin, repositionIndex)}, o_fade && getDuration(0)));
                if (isDetached($frame[0])) {
                    $frame.appendTo($stageShaft);
                    unloadVideo(dataFrame.$video);
                }
                callFit(frameData.$img, measures, method, position);
                callFit(frameData.$full, measures, method, position);
            });
        }

        function thumbsDraw(pos, loadFLAG) {
            if (o_nav !== 'thumbs' || isNaN(pos))return;
            var leftLimit = -pos, rightLimit = -pos + measures.nw;
            $navThumbFrame.each(function () {
                var $this = $(this), thisData = $this.data(), eq = thisData.eq, getSpecialMeasures = function () {
                    return{h: o_thumbSide2, w: thisData.w}
                }, specialMeasures = getSpecialMeasures(), dataFrame = data[eq] || {}, method = dataFrame.thumbfit || opts.thumbfit, position = dataFrame.thumbposition || opts.thumbposition;
                specialMeasures.w = thisData.w;
                if (thisData.l + thisData.w < leftLimit || thisData.l > rightLimit || callFit(thisData.$img, specialMeasures, method, position))return;
                loadFLAG && loadImg([eq], 'navThumb', getSpecialMeasures, method, position);
            });
        }

        function frameAppend($frames, $shaft, type) {
            if (!frameAppend[type]) {
                var thumbsFLAG = type === 'nav' && o_navThumbs, left = 0;
                $shaft.append($frames.filter(function () {
                    var actual, $this = $(this), frameData = $this.data();
                    for (var _i = 0, _l = data.length; _i < _l; _i++) {
                        if (frameData.data === data[_i]) {
                            actual = true;
                            frameData.eq = _i;
                            break;
                        }
                    }
                    return actual || $this.remove() && false;
                }).sort(function (a, b) {
                    return $(a).data().eq - $(b).data().eq;
                }).each(function () {
                    if (!thumbsFLAG)return;
                    var $this = $(this), frameData = $this.data(), thumbwidth = Math.round(o_thumbSide2 * frameData.data.thumbratio) || o_thumbSide;
                    frameData.l = left;
                    frameData.w = thumbwidth;
                    $this.css({width: thumbwidth});
                    left += thumbwidth + opts.thumbmargin;
                }));
                frameAppend[type] = true;
            }
        }

        function getDirection(x) {
            return x - stageLeft > measures.w / 3;
        }

        function disableDirrection(i) {
            return!o_loop && (!(activeIndex + i) || !(activeIndex - size + i)) && !$videoPlaying;
        }

        function arrsUpdate() {
            var disablePrev = disableDirrection(0), disableNext = disableDirrection(1);
            $arrPrev.toggleClass(arrDisabledClass, disablePrev).attr(disableAttr(disablePrev));
            $arrNext.toggleClass(arrDisabledClass, disableNext).attr(disableAttr(disableNext));
        }

        function stageWheelUpdate() {
            if (stageWheelTail.ok) {
                stageWheelTail.prevent = {'<': disableDirrection(0), '>': disableDirrection(1)};
            }
        }

        function getNavFrameBounds($navFrame) {
            var navFrameData = $navFrame.data(), left, width;
            if (o_navThumbs) {
                left = navFrameData.l;
                width = navFrameData.w;
            } else {
                left = $navFrame.position().left;
                width = $navFrame.width();
            }
            return{c: left + width / 2, min: -left + opts.thumbmargin * 10, max: -left + measures.w - width - opts.thumbmargin * 10};
        }

        function slideThumbBorder(time) {
            var navFrameData = activeFrame[navFrameKey].data();
            slide($thumbBorder, {time: time * 1.2, pos: navFrameData.l, width: navFrameData.w - opts.thumbborderwidth * 2});
        }

        function slideNavShaft(options) {
            var $guessNavFrame = data[options.guessIndex][navFrameKey];
            if ($guessNavFrame) {
                var overflowFLAG = navShaftTouchTail.min !== navShaftTouchTail.max, minMax = options.minMax || overflowFLAG && getNavFrameBounds(activeFrame[navFrameKey]), l = overflowFLAG && (options.keep && slideNavShaft.l ? slideNavShaft.l : minMaxLimit((options.coo || measures.nw / 2) - getNavFrameBounds($guessNavFrame).c, minMax.min, minMax.max)), pos = overflowFLAG && minMaxLimit(l, navShaftTouchTail.min, navShaftTouchTail.max), time = options.time * 1.1;
                slide($navShaft, {time: time, pos: pos || 0, onEnd: function () {
                    thumbsDraw(pos, true);
                }});
                setShadow($nav, findShadowEdge(pos, navShaftTouchTail.min, navShaftTouchTail.max));
                slideNavShaft.l = l;
            }
        }

        function navUpdate() {
            deactivateFrames(navFrameKey);
            toDeactivate[navFrameKey].push(activeFrame[navFrameKey].addClass(activeClass));
        }

        function deactivateFrames(key) {
            var _toDeactivate = toDeactivate[key];
            while (_toDeactivate.length) {
                _toDeactivate.shift().removeClass(activeClass);
            }
        }

        function detachFrames(key) {
            var _toDetach = toDetach[key];
            $.each(activeIndexes, function (i, index) {
                delete _toDetach[normalizeIndex(index)];
            });
            $.each(_toDetach, function (index, $frame) {
                delete _toDetach[index];
                $frame.detach();
            });
        }

        function stageShaftReposition(skipOnEnd) {
            repositionIndex = dirtyIndex = activeIndex;
            var $frame = activeFrame[STAGE_FRAME_KEY];
            if ($frame) {
                deactivateFrames(STAGE_FRAME_KEY);
                toDeactivate[STAGE_FRAME_KEY].push($frame.addClass(activeClass));
                skipOnEnd || that.show.onEnd(true);
                stop($stageShaft, 0, true);
                detachFrames(STAGE_FRAME_KEY);
                stageFramePosition(activeIndexes);
                setStageShaftMinmaxAndSnap();
                setNavShaftMinMax();
            }
        }

        function extendMeasures(options, measuresArray) {
            if (!options)return;
            $.each(measuresArray, function (i, measures) {
                if (!measures)return;
                $.extend(measures, {width: options.width || measures.width, height: options.height, minwidth: options.minwidth, maxwidth: options.maxwidth, minheight: options.minheight, maxheight: options.maxheight, ratio: getRatio(options.ratio)})
            });
        }

        function triggerEvent(event, extra) {
            $fotorama.trigger(_fotoramaClass + ':' + event, [that, extra]);
        }

        function onTouchStart() {
            clearTimeout(onTouchEnd.t);
            touchedFLAG = 1;
            if (opts.stopautoplayontouch) {
                that.stopAutoplay();
            } else {
                pausedAutoplayFLAG = true;
            }
        }

        function onTouchEnd() {
            if (!touchedFLAG)return;
            if (!opts.stopautoplayontouch) {
                releaseAutoplay();
                changeAutoplay();
            }
            onTouchEnd.t = setTimeout(function () {
                touchedFLAG = 0;
            }, TRANSITION_DURATION + TOUCH_TIMEOUT);
        }

        function releaseAutoplay() {
            pausedAutoplayFLAG = !!($videoPlaying || stoppedAutoplayFLAG);
        }

        function changeAutoplay() {
            clearTimeout(changeAutoplay.t);
            waitFor.stop(changeAutoplay.w);
            if (!opts.autoplay || pausedAutoplayFLAG) {
                if (that.autoplay) {
                    that.autoplay = false;
                    triggerEvent('stopautoplay');
                }
                return;
            }
            if (!that.autoplay) {
                that.autoplay = true;
                triggerEvent('startautoplay');
            }
            var _activeIndex = activeIndex;
            var frameData = activeFrame[STAGE_FRAME_KEY].data();
            changeAutoplay.w = waitFor(function () {
                return frameData.state || _activeIndex !== activeIndex;
            }, function () {
                changeAutoplay.t = setTimeout(function () {
                    if (pausedAutoplayFLAG || _activeIndex !== activeIndex)return;
                    var _nextAutoplayIndex = nextAutoplayIndex, nextFrameData = data[_nextAutoplayIndex][STAGE_FRAME_KEY].data();
                    changeAutoplay.w = waitFor(function () {
                        return nextFrameData.state || _nextAutoplayIndex !== nextAutoplayIndex;
                    }, function () {
                        if (pausedAutoplayFLAG || _nextAutoplayIndex !== nextAutoplayIndex)return;
                        that.show(o_loop ? getDirectionSign(!o_rtl) : nextAutoplayIndex);
                    });
                }, opts.autoplay);
            });
        }

        that.startAutoplay = function (interval) {
            if (that.autoplay)return this;
            pausedAutoplayFLAG = stoppedAutoplayFLAG = false;
            setAutoplayInterval(interval || opts.autoplay);
            changeAutoplay();
            return this;
        };
        that.stopAutoplay = function () {
            if (that.autoplay) {
                pausedAutoplayFLAG = stoppedAutoplayFLAG = true;
                changeAutoplay();
            }
            return this;
        };
        that.show = function (options) {
            var index;
            if (typeof options !== 'object') {
                index = options;
                options = {};
            } else {
                index = options.index;
            }
            index = index === '>' ? dirtyIndex + 1 : index === '<' ? dirtyIndex - 1 : index === '<<' ? 0 : index === '>>' ? size - 1 : index;
            index = isNaN(index) ? getIndexFromHash(index, data, true) : index;
            index = typeof index === 'undefined' ? activeIndex || 0 : index;
            that.activeIndex = activeIndex = edgeIndex(index);
            prevIndex = getPrevIndex(activeIndex);
            nextIndex = getNextIndex(activeIndex);
            nextAutoplayIndex = normalizeIndex(activeIndex + (o_rtl ? -1 : 1));
            activeIndexes = [activeIndex, prevIndex, nextIndex];
            dirtyIndex = o_loop ? index : activeIndex;
            var diffIndex = Math.abs(lastActiveIndex - dirtyIndex), time = getNumber(options.time, function () {
                return Math.min(o_transitionDuration * (1 + (diffIndex - 1) / 12), o_transitionDuration * 2);
            }), overPos = options.overPos;
            if (options.slow)time *= 10;
            var _activeFrame = activeFrame;
            that.activeFrame = activeFrame = data[activeIndex];
            var silent = _activeFrame === activeFrame && !options.user;
            unloadVideo($videoPlaying, activeFrame.i !== data[normalizeIndex(repositionIndex)].i);
            frameDraw(activeIndexes, 'stage');
            stageFramePosition(SLOW ? [dirtyIndex] : [dirtyIndex, getPrevIndex(dirtyIndex), getNextIndex(dirtyIndex)]);
            updateTouchTails('go', true);
            silent || triggerEvent('show', {user: options.user, time: time});
            pausedAutoplayFLAG = true;
            var onEnd = that.show.onEnd = function (skipReposition) {
                if (onEnd.ok)return;
                onEnd.ok = true;
                skipReposition || stageShaftReposition(true);
                if (!silent) {
                    triggerEvent('showend', {user: options.user});
                }
                if (!skipReposition && o_transition && o_transition !== opts.transition) {
                    that.setOptions({transition: o_transition});
                    o_transition = false;
                    return;
                }
                updateFotoramaState();
                loadImg(activeIndexes, 'stage');
                updateTouchTails('go', false);
                stageWheelUpdate();
                stageCursor();
                releaseAutoplay();
                changeAutoplay();
            };
            if (!o_fade) {
                slide($stageShaft, {pos: -getPosByIndex(dirtyIndex, measures.w, opts.margin, repositionIndex), overPos: overPos, time: time, onEnd: onEnd });
            } else {
                var $activeFrame = activeFrame[STAGE_FRAME_KEY], $prevActiveFrame = activeIndex !== lastActiveIndex ? data[lastActiveIndex][STAGE_FRAME_KEY] : null;
                fade($activeFrame, $prevActiveFrame, $stageFrame, {time: time, method: opts.transition, onEnd: onEnd}, fadeStack);
            }
            arrsUpdate();
            if (o_nav) {
                navUpdate();
                var guessIndex = limitIndex(activeIndex + minMaxLimit(dirtyIndex - lastActiveIndex, -1, 1));
                slideNavShaft({time: time, coo: guessIndex !== activeIndex && options.coo, guessIndex: typeof options.coo !== 'undefined' ? guessIndex : activeIndex, keep: silent});
                if (o_navThumbs)slideThumbBorder(time);
            }
            showedFLAG = typeof lastActiveIndex !== 'undefined' && lastActiveIndex !== activeIndex;
            lastActiveIndex = activeIndex;
            opts.hash && showedFLAG && !that.eq && setHash(activeFrame.id || activeIndex + 1);
            return this;
        };
        that.requestFullScreen = function () {
            if (o_allowFullScreen && !that.fullScreen) {
                scrollTop = $WINDOW.scrollTop();
                scrollLeft = $WINDOW.scrollLeft();
                lockScroll($WINDOW);
                updateTouchTails('x', true);
                measuresStash = $.extend({}, measures);
                $fotorama.addClass(fullscreenClass).appendTo($BODY.addClass(_fullscreenClass));
                $HTML.addClass(_fullscreenClass);
                unloadVideo($videoPlaying, true, true);
                that.fullScreen = true;
                if (o_nativeFullScreen) {
                    fullScreenApi.request(fotorama);
                }
                that.resize();
                loadImg(activeIndexes, 'stage');
                updateFotoramaState();
                triggerEvent('fullscreenenter');
            }
            return this;
        };
        function cancelFullScreen() {
            if (that.fullScreen) {
                that.fullScreen = false;
                if (FULLSCREEN) {
                    fullScreenApi.cancel(fotorama);
                }
                $BODY.removeClass(_fullscreenClass);
                $HTML.removeClass(_fullscreenClass);
                $fotorama.removeClass(fullscreenClass).insertAfter($anchor);
                measures = $.extend({}, measuresStash);
                unloadVideo($videoPlaying, true, true);
                updateTouchTails('x', false);
                that.resize();
                loadImg(activeIndexes, 'stage');
                lockScroll($WINDOW, scrollLeft, scrollTop);
                triggerEvent('fullscreenexit');
            }
        }

        that.cancelFullScreen = function () {
            if (o_nativeFullScreen && fullScreenApi.is()) {
                fullScreenApi.cancel(document);
            } else {
                cancelFullScreen();
            }
            return this;
        };
        that.toggleFullScreen = function () {
            return that[(that.fullScreen ? 'cancel' : 'request') + 'FullScreen']();
        };
        addEvent(document, fullScreenApi.event, function () {
            if (data && !fullScreenApi.is() && !$videoPlaying) {
                cancelFullScreen();
            }
        });
        that.resize = function (options) {
            if (!data)return this;
            var time = arguments[1] || 0, setFLAG = arguments[2];
            extendMeasures(!that.fullScreen ? optionsToLowerCase(options) : {width: '100%', maxwidth: null, minwidth: null, height: '100%', maxheight: null, minheight: null}, [measures, setFLAG || that.fullScreen || opts]);
            var width = measures.width, height = measures.height, ratio = measures.ratio, windowHeight = $WINDOW.height() - (o_nav ? $nav.height() : 0);
            if (measureIsValid(width)) {
                $wrap.addClass(wrapOnlyActiveClass).css({width: width, minWidth: measures.minwidth || 0, maxWidth: measures.maxwidth || MAX_WIDTH});
                width = measures.W = measures.w = $wrap.width();
                measures.nw = o_nav && numberFromWhatever(opts.navwidth, width) || width;
                if (opts.glimpse) {
                    measures.w -= Math.round((numberFromWhatever(opts.glimpse, width) || 0) * 2);
                }
                $stageShaft.css({width: measures.w, marginLeft: (measures.W - measures.w) / 2});
                height = numberFromWhatever(height, windowHeight);
                height = height || (ratio && width / ratio);
                if (height) {
                    width = Math.round(width);
                    height = measures.h = Math.round(minMaxLimit(height, numberFromWhatever(measures.minheight, windowHeight), numberFromWhatever(measures.maxheight, windowHeight)));
                    $stage.stop().animate({width: width, height: height}, time, function () {
                        $wrap.removeClass(wrapOnlyActiveClass);
                    });
                    stageShaftReposition();
                    if (o_nav) {
                        $nav.stop().animate({width: measures.nw}, time);
                        slideNavShaft({guessIndex: activeIndex, time: time, keep: true});
                        if (o_navThumbs && frameAppend.nav)slideThumbBorder(time);
                    }
                    measuresSetFLAG = setFLAG || true;
                    ready();
                }
            }
            stageLeft = $stage.offset().left;
            return this;
        };
        that.setOptions = function (options) {
            $.extend(opts, options);
            reset();
            return this;
        };
        that.shuffle = function () {
            data && shuffle(data) && reset();
            return this;
        };
        function setShadow($el, edge) {
            if (o_shadows) {
                $el.removeClass(shadowsLeftClass + ' ' + shadowsRightClass);
                edge && !$videoPlaying && $el.addClass(edge.replace(/^|\s/g, ' ' + shadowsClass + '--'));
            }
        }

        that.destroy = function () {
            that.cancelFullScreen();
            that.stopAutoplay();
            data = that.data = null;
            appendElements();
            activeIndexes = [];
            detachFrames(STAGE_FRAME_KEY);
            reset.ok = false;
            return this;
        };
        that.playVideo = function () {
            var dataFrame = activeFrame, video = dataFrame.video, _activeIndex = activeIndex;
            if (typeof video === 'object' && dataFrame.videoReady) {
                o_nativeFullScreen && that.fullScreen && that.cancelFullScreen();
                waitFor(function () {
                    return!fullScreenApi.is() || _activeIndex !== activeIndex;
                }, function () {
                    if (_activeIndex === activeIndex) {
                        dataFrame.$video = dataFrame.$video || $($.Fotorama.jst.video(video));
                        dataFrame.$video.appendTo(dataFrame[STAGE_FRAME_KEY]);
                        $wrap.addClass(wrapVideoClass);
                        $videoPlaying = dataFrame.$video;
                        stageNoMove();
                        $arrs.blur();
                        $fullscreenIcon.blur();
                        triggerEvent('loadvideo');
                    }
                });
            }
            return this;
        };
        that.stopVideo = function () {
            unloadVideo($videoPlaying, true, true);
            return this;
        };
        function unloadVideo($video, unloadActiveFLAG, releaseAutoplayFLAG) {
            if (unloadActiveFLAG) {
                $wrap.removeClass(wrapVideoClass);
                $videoPlaying = false;
                stageNoMove();
            }
            if ($video && $video !== $videoPlaying) {
                $video.remove();
                triggerEvent('unloadvideo');
            }
            if (releaseAutoplayFLAG) {
                releaseAutoplay();
                changeAutoplay();
            }
        }

        function toggleControlsClass(FLAG) {
            $wrap.toggleClass(wrapNoControlsClass, FLAG);
        }

        function stageCursor(e) {
            if (stageShaftTouchTail.flow)return;
            var x = e ? e.pageX : stageCursor.x, pointerFLAG = x && !disableDirrection(getDirection(x)) && opts.click;
            if (stageCursor.p !== pointerFLAG && $stage.toggleClass(pointerClass, pointerFLAG)) {
                stageCursor.p = pointerFLAG;
                stageCursor.x = x;
            }
        }

        $stage.on('mousemove', stageCursor);
        function clickToShow(showOptions) {
            clearTimeout(clickToShow.t);
            if (opts.clicktransition && opts.clicktransition !== opts.transition) {
                setTimeout(function () {
                    var _o_transition = opts.transition;
                    that.setOptions({transition: opts.clicktransition});
                    o_transition = _o_transition;
                    clickToShow.t = setTimeout(function () {
                        that.show(showOptions);
                    }, 10);
                }, 0);
            } else {
                that.show(showOptions);
            }
        }

        function onStageTap(e, toggleControlsFLAG) {
            var target = e.target, $target = $(target);
            if ($target.hasClass(videoPlayClass)) {
                that.playVideo();
            } else if (target === fullscreenIcon) {
                that.toggleFullScreen();
            } else if ($videoPlaying) {
                target === videoClose && unloadVideo($videoPlaying, true, true);
            } else {
                if (toggleControlsFLAG) {
                    toggleControlsClass();
                } else if (opts.click) {
                    clickToShow({index: e.shiftKey || getDirectionSign(getDirection(e._x)), slow: e.altKey, user: true});
                }
            }
        }

        function updateTouchTails(key, value) {
            stageShaftTouchTail[key] = navShaftTouchTail[key] = value;
        }

        stageShaftTouchTail = moveOnTouch($stageShaft, {onStart: onTouchStart, onMove: function (e, result) {
            setShadow($stage, result.edge);
        }, onTouchEnd: onTouchEnd, onEnd: function (result) {
            setShadow($stage);
            var toggleControlsFLAG = (MS_POINTER && !hoverFLAG || result.touch) && opts.arrows && opts.arrows !== 'always';
            if (result.moved || (toggleControlsFLAG && result.pos !== result.newPos && !result.control)) {
                var index = getIndexByPos(result.newPos, measures.w, opts.margin, repositionIndex);
                that.show({index: index, time: o_fade ? o_transitionDuration : result.time, overPos: result.overPos, user: true});
            } else if (!result.aborted && !result.control) {
                onStageTap(result.startEvent, toggleControlsFLAG);
            }
        }, timeLow: 1, timeHigh: 1, friction: 2, select: '.' + selectClass + ', .' + selectClass + ' *', $wrap: $stage});
        navShaftTouchTail = moveOnTouch($navShaft, {onStart: onTouchStart, onMove: function (e, result) {
            setShadow($nav, result.edge);
        }, onTouchEnd: onTouchEnd, onEnd: function (result) {
            function onEnd() {
                slideNavShaft.l = result.newPos;
                releaseAutoplay();
                changeAutoplay();
                thumbsDraw(result.newPos, true);
            }

            if (!result.moved) {
                var target = result.$target.closest('.' + navFrameClass, $navShaft)[0];
                target && onNavFrameClick.call(target, result.startEvent);
            } else if (result.pos !== result.newPos) {
                pausedAutoplayFLAG = true;
                slide($navShaft, {time: result.time, pos: result.newPos, overPos: result.overPos, onEnd: onEnd});
                thumbsDraw(result.newPos);
                o_shadows && setShadow($nav, findShadowEdge(result.newPos, navShaftTouchTail.min, navShaftTouchTail.max));
            } else {
                onEnd();
            }
        }, timeLow: .5, timeHigh: 2, friction: 5, $wrap: $nav});
        stageWheelTail = wheel($stage, {shift: true, onEnd: function (e, direction) {
            onTouchStart();
            onTouchEnd();
            that.show({index: direction, slow: e.altKey})
        }});
        navWheelTail = wheel($nav, {onEnd: function (e, direction) {
            onTouchStart();
            onTouchEnd();
            var newPos = stop($navShaft) + direction * .25;
            $navShaft.css(getTranslate(minMaxLimit(newPos, navShaftTouchTail.min, navShaftTouchTail.max)));
            o_shadows && setShadow($nav, findShadowEdge(newPos, navShaftTouchTail.min, navShaftTouchTail.max));
            navWheelTail.prevent = {'<': newPos >= navShaftTouchTail.max, '>': newPos <= navShaftTouchTail.min};
            clearTimeout(navWheelTail.t);
            navWheelTail.t = setTimeout(function () {
                slideNavShaft.l = newPos;
                thumbsDraw(newPos, true)
            }, TOUCH_TIMEOUT);
            thumbsDraw(newPos);
        }});
        $wrap.hover(function () {
            setTimeout(function () {
                if (touchedFLAG)return;
                toggleControlsClass(!(hoverFLAG = true));
            }, 0);
        }, function () {
            if (!hoverFLAG)return;
            toggleControlsClass(!(hoverFLAG = false));
        });
        function onNavFrameClick(e) {
            var index = $(this).data().eq;
            clickToShow({index: index, slow: e.altKey, user: true, coo: e._x - $nav.offset().left});
        }

        function onArrClick(e) {
            clickToShow({index: $arrs.index(this) ? '>' : '<', slow: e.altKey, user: true});
        }

        smartClick($arrs, function (e) {
            stopEvent(e);
            onArrClick.call(this, e);
        }, {onStart: function () {
            onTouchStart();
            stageShaftTouchTail.control = true;
        }, onTouchEnd: onTouchEnd});
        function addFocusOnControls(el) {
            addFocus(el, function () {
                setTimeout(function () {
                    lockScroll($stage);
                }, 0);
                toggleControlsClass(false);
            });
        }

        $arrs.each(function () {
            addEnterUp(this, function (e) {
                onArrClick.call(this, e);
            });
            addFocusOnControls(this);
        });
        addEnterUp(fullscreenIcon, that.toggleFullScreen);
        addFocusOnControls(fullscreenIcon);
        function reset() {
            setData();
            setOptions();
            if (!reset.i) {
                reset.i = true;
                var _startindex = opts.startindex;
                if (_startindex || opts.hash && location.hash) {
                    startIndex = getIndexFromHash(_startindex || location.hash.replace(/^#/, ''), data, that.index === 0 || _startindex, _startindex);
                }
                activeIndex = repositionIndex = dirtyIndex = lastActiveIndex = startIndex = edgeIndex(startIndex) || 0;
            }
            if (size) {
                if (changeToRtl())return;
                if ($videoPlaying) {
                    unloadVideo($videoPlaying, true);
                }
                activeIndexes = [];
                detachFrames(STAGE_FRAME_KEY);
                reset.ok = true;
                that.show({index: activeIndex, time: 0});
                that.resize();
            } else {
                that.destroy();
            }
        }

        function changeToRtl() {
            if (!changeToRtl.f === o_rtl) {
                changeToRtl.f = o_rtl;
                activeIndex = size - 1 - activeIndex;
                that.reverse();
                return true;
            }
        }

        $.each('load push pop shift unshift reverse sort splice'.split(' '), function (i, method) {
            that[method] = function () {
                data = data || [];
                if (method !== 'load') {
                    Array.prototype[method].apply(data, arguments);
                } else if (arguments[0] && typeof arguments[0] === 'object' && arguments[0].length) {
                    data = clone(arguments[0]);
                }
                reset();
                return that;
            }
        });
        function ready() {
            if (!ready.ok) {
                ready.ok = true;
                triggerEvent('ready');
            }
        }

        reset();
    };
    $.fn.fotorama = function (opts) {
        return this.each(function () {
            var that = this, $fotorama = $(this), fotoramaData = $fotorama.data(), fotorama = fotoramaData.fotorama;
            if (!fotorama) {
                waitFor(function () {
                    return!isHidden(that);
                }, function () {
                    fotoramaData.urtext = $fotorama.html();
                    new $.Fotorama($fotorama, $.extend({}, OPTIONS, window.fotoramaDefaults, opts, fotoramaData));
                });
            } else {
                fotorama.setOptions(opts, true);
            }
        });
    };
    $.Fotorama.instances = [];
    function calculateIndexes() {
        $.each($.Fotorama.instances, function (index, instance) {
            instance.index = index;
        });
    }

    function addInstance(instance) {
        $.Fotorama.instances.push(instance);
        calculateIndexes();
    }

    function hideInstance(instance) {
        $.Fotorama.instances.splice(instance.index, 1);
        calculateIndexes();
    }

    $.Fotorama.cache = {};
    $.Fotorama.measures = {};
    $ = $ || {};
    $.Fotorama = $.Fotorama || {};
    $.Fotorama.jst = $.Fotorama.jst || {};
    $.Fotorama.jst.style = function (v) {
        var __t, __p = '', __e = _.escape;
        __p += '.fotorama' +
            ((__t = (v.s)) == null ? '' : __t) + ' .fotorama__nav--thumbs .fotorama__nav__frame{\npadding:' +
            ((__t = (v.m)) == null ? '' : __t) + 'px;\nheight:' +
            ((__t = (v.h)) == null ? '' : __t) + 'px}\n.fotorama' +
            ((__t = (v.s)) == null ? '' : __t) + ' .fotorama__thumb-border{\nheight:' +
            ((__t = (v.h - v.b * (v.q ? 0 : 2))) == null ? '' : __t) + 'px;\nborder-width:' +
            ((__t = (v.b)) == null ? '' : __t) + 'px;\nmargin-top:' +
            ((__t = (v.m)) == null ? '' : __t) + 'px}';
        return __p
    };
    $.Fotorama.jst.video = function (v) {
        var __t, __p = '', __e = _.escape, __j = Array.prototype.join;

        function print() {
            __p += __j.call(arguments, '')
        }

        __p += '<div class="fotorama__video"><iframe src="';
        print((v.type == 'youtube' ? v.p + 'youtube.com/embed/' + v.id + '?autoplay=1' : v.type == 'vimeo' ? v.p + 'player.vimeo.com/video/' + v.id + '?autoplay=1&badge=0' : v.id) + (v.s && v.type != 'custom' ? '&' + v.s : ''));
        __p += '" frameborder="0" allowfullscreen></iframe></div>\n';
        return __p
    };
    $(function () {
        $('.' + _fotoramaClass + ':not([data-auto="false"])').fotorama();
    });
})(window, document, location, typeof jQuery !== 'undefined' && jQuery);
if ("undefined" == typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");
+function (a) {
    "use strict";
    var b = a.fn.jquery.split(" ")[0].split(".");
    if (b[0] < 2 && b[1] < 9 || 1 == b[0] && 9 == b[1] && b[2] < 1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")
}(jQuery), +function (a) {
    "use strict";
    function b() {
        var a = document.createElement("bootstrap"), b = {WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend"};
        for (var c in b)if (void 0 !== a.style[c])return{end: b[c]};
        return!1
    }

    a.fn.emulateTransitionEnd = function (b) {
        var c = !1, d = this;
        a(this).one("bsTransitionEnd", function () {
            c = !0
        });
        var e = function () {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b), this
    }, a(function () {
        a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {bindType: a.support.transition.end, delegateType: a.support.transition.end, handle: function (b) {
            return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0
        }})
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var c = a(this), e = c.data("bs.alert");
            e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c)
        })
    }

    var c = '[data-dismiss="alert"]', d = function (b) {
        a(b).on("click", c, this.close)
    };
    d.VERSION = "3.3.2", d.TRANSITION_DURATION = 150, d.prototype.close = function (b) {
        function c() {
            g.detach().trigger("closed.bs.alert").remove()
        }

        var e = a(this), f = e.attr("data-target");
        f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
        var g = a(f);
        b && b.preventDefault(), g.length || (g = e.closest(".alert")), g.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (g.removeClass("in"), a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c())
    };
    var e = a.fn.alert;
    a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function () {
        return a.fn.alert = e, this
    }, a(document).on("click.bs.alert.data-api", c, d.prototype.close)
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.button"), f = "object" == typeof b && b;
            e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b)
        })
    }

    var c = function (b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1
    };
    c.VERSION = "3.3.2", c.DEFAULTS = {loadingText: "loading..."}, c.prototype.setState = function (b) {
        var c = "disabled", d = this.$element, e = d.is("input") ? "val" : "html", f = d.data();
        b += "Text", null == f.resetText && d.data("resetText", d[e]()), setTimeout(a.proxy(function () {
            d[e](null == f[b] ? this.options[b] : f[b]), "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
        }, this), 0)
    }, c.prototype.toggle = function () {
        var a = !0, b = this.$element.closest('[data-toggle="buttons"]');
        if (b.length) {
            var c = this.$element.find("input");
            "radio" == c.prop("type") && (c.prop("checked") && this.$element.hasClass("active") ? a = !1 : b.find(".active").removeClass("active")), a && c.prop("checked", !this.$element.hasClass("active")).trigger("change")
        } else this.$element.attr("aria-pressed", !this.$element.hasClass("active"));
        a && this.$element.toggleClass("active")
    };
    var d = a.fn.button;
    a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function () {
        return a.fn.button = d, this
    }, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function (c) {
        var d = a(c.target);
        d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), c.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (b) {
        a(b.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(b.type))
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.carousel"), f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b), g = "string" == typeof b ? b : f.slide;
            e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
        })
    }

    var c = function (b, c) {
        this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = this.sliding = this.interval = this.$active = this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart"in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
    };
    c.VERSION = "3.3.2", c.TRANSITION_DURATION = 600, c.DEFAULTS = {interval: 5e3, pause: "hover", wrap: !0, keyboard: !0}, c.prototype.keydown = function (a) {
        if (!/input|textarea/i.test(a.target.tagName)) {
            switch (a.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
            }
            a.preventDefault()
        }
    }, c.prototype.cycle = function (b) {
        return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
    }, c.prototype.getItemIndex = function (a) {
        return this.$items = a.parent().children(".item"), this.$items.index(a || this.$active)
    }, c.prototype.getItemForDirection = function (a, b) {
        var c = this.getItemIndex(b), d = "prev" == a && 0 === c || "next" == a && c == this.$items.length - 1;
        if (d && !this.options.wrap)return b;
        var e = "prev" == a ? -1 : 1, f = (c + e) % this.$items.length;
        return this.$items.eq(f)
    }, c.prototype.to = function (a) {
        var b = this, c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        return a > this.$items.length - 1 || 0 > a ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function () {
            b.to(a)
        }) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a))
    }, c.prototype.pause = function (b) {
        return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, c.prototype.next = function () {
        return this.sliding ? void 0 : this.slide("next")
    }, c.prototype.prev = function () {
        return this.sliding ? void 0 : this.slide("prev")
    }, c.prototype.slide = function (b, d) {
        var e = this.$element.find(".item.active"), f = d || this.getItemForDirection(b, e), g = this.interval, h = "next" == b ? "left" : "right", i = this;
        if (f.hasClass("active"))return this.sliding = !1;
        var j = f[0], k = a.Event("slide.bs.carousel", {relatedTarget: j, direction: h});
        if (this.$element.trigger(k), !k.isDefaultPrevented()) {
            if (this.sliding = !0, g && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var l = a(this.$indicators.children()[this.getItemIndex(f)]);
                l && l.addClass("active")
            }
            var m = a.Event("slid.bs.carousel", {relatedTarget: j, direction: h});
            return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b), f[0].offsetWidth, e.addClass(h), f.addClass(h), e.one("bsTransitionEnd", function () {
                f.removeClass([b, h].join(" ")).addClass("active"), e.removeClass(["active", h].join(" ")), i.sliding = !1, setTimeout(function () {
                    i.$element.trigger(m)
                }, 0)
            }).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"), f.addClass("active"), this.sliding = !1, this.$element.trigger(m)), g && this.cycle(), this
        }
    };
    var d = a.fn.carousel;
    a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function () {
        return a.fn.carousel = d, this
    };
    var e = function (c) {
        var d, e = a(this), f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
        if (f.hasClass("carousel")) {
            var g = a.extend({}, f.data(), e.data()), h = e.attr("data-slide-to");
            h && (g.interval = !1), b.call(f, g), h && f.data("bs.carousel").to(h), c.preventDefault()
        }
    };
    a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e), a(window).on("load", function () {
        a('[data-ride="carousel"]').each(function () {
            var c = a(this);
            b.call(c, c.data())
        })
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        var c, d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
        return a(d)
    }

    function c(b) {
        return this.each(function () {
            var c = a(this), e = c.data("bs.collapse"), f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
            !e && f.toggle && "show" == b && (f.toggle = !1), e || c.data("bs.collapse", e = new d(this, f)), "string" == typeof b && e[b]()
        })
    }

    var d = function (b, c) {
        this.$element = a(b), this.options = a.extend({}, d.DEFAULTS, c), this.$trigger = a(this.options.trigger).filter('[href="#' + b.id + '"], [data-target="#' + b.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    d.VERSION = "3.3.2", d.TRANSITION_DURATION = 350, d.DEFAULTS = {toggle: !0, trigger: '[data-toggle="collapse"]'}, d.prototype.dimension = function () {
        var a = this.$element.hasClass("width");
        return a ? "width" : "height"
    }, d.prototype.show = function () {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var b, e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
            if (!(e && e.length && (b = e.data("bs.collapse"), b && b.transitioning))) {
                var f = a.Event("show.bs.collapse");
                if (this.$element.trigger(f), !f.isDefaultPrevented()) {
                    e && e.length && (c.call(e, "hide"), b || e.data("bs.collapse", null));
                    var g = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                    var h = function () {
                        this.$element.removeClass("collapsing").addClass("collapse in")[g](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                    };
                    if (!a.support.transition)return h.call(this);
                    var i = a.camelCase(["scroll", g].join("-"));
                    this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])
                }
            }
        }
    }, d.prototype.hide = function () {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var b = a.Event("hide.bs.collapse");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                var c = this.dimension();
                this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                var e = function () {
                    this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this)
            }
        }
    }, d.prototype.toggle = function () {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, d.prototype.getParent = function () {
        return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function (c, d) {
            var e = a(d);
            this.addAriaAndCollapsedClass(b(e), e)
        }, this)).end()
    }, d.prototype.addAriaAndCollapsedClass = function (a, b) {
        var c = a.hasClass("in");
        a.attr("aria-expanded", c), b.toggleClass("collapsed", !c).attr("aria-expanded", c)
    };
    var e = a.fn.collapse;
    a.fn.collapse = c, a.fn.collapse.Constructor = d, a.fn.collapse.noConflict = function () {
        return a.fn.collapse = e, this
    }, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (d) {
        var e = a(this);
        e.attr("data-target") || d.preventDefault();
        var f = b(e), g = f.data("bs.collapse"), h = g ? "toggle" : a.extend({}, e.data(), {trigger: this});
        c.call(f, h)
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        b && 3 === b.which || (a(e).remove(), a(f).each(function () {
            var d = a(this), e = c(d), f = {relatedTarget: this};
            e.hasClass("open") && (e.trigger(b = a.Event("hide.bs.dropdown", f)), b.isDefaultPrevented() || (d.attr("aria-expanded", "false"), e.removeClass("open").trigger("hidden.bs.dropdown", f)))
        }))
    }

    function c(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d : b.parent()
    }

    function d(b) {
        return this.each(function () {
            var c = a(this), d = c.data("bs.dropdown");
            d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c)
        })
    }

    var e = ".dropdown-backdrop", f = '[data-toggle="dropdown"]', g = function (b) {
        a(b).on("click.bs.dropdown", this.toggle)
    };
    g.VERSION = "3.3.2", g.prototype.toggle = function (d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
            var f = c(e), g = f.hasClass("open");
            if (b(), !g) {
                "ontouchstart"in document.documentElement && !f.closest(".navbar-nav").length && a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click", b);
                var h = {relatedTarget: this};
                if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented())return;
                e.trigger("focus").attr("aria-expanded", "true"), f.toggleClass("open").trigger("shown.bs.dropdown", h)
            }
            return!1
        }
    }, g.prototype.keydown = function (b) {
        if (/(38|40|27|32)/.test(b.which) && !/input|textarea/i.test(b.target.tagName)) {
            var d = a(this);
            if (b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled")) {
                var e = c(d), g = e.hasClass("open");
                if (!g && 27 != b.which || g && 27 == b.which)return 27 == b.which && e.find(f).trigger("focus"), d.trigger("click");
                var h = " li:not(.divider):visible a", i = e.find('[role="menu"]' + h + ', [role="listbox"]' + h);
                if (i.length) {
                    var j = i.index(b.target);
                    38 == b.which && j > 0 && j--, 40 == b.which && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus")
                }
            }
        }
    };
    var h = a.fn.dropdown;
    a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function () {
        return a.fn.dropdown = h, this
    }, a(document).on("click.bs.dropdown.data-api", b).on("click.bs.dropdown.data-api", ".dropdown form", function (a) {
        a.stopPropagation()
    }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="menu"]', g.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="listbox"]', g.prototype.keydown)
}(jQuery), +function (a) {
    "use strict";
    function b(b, d) {
        return this.each(function () {
            var e = a(this), f = e.data("bs.modal"), g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
            f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
        })
    }

    var c = function (b, c) {
        this.options = c, this.$body = a(document.body), this.$element = a(b), this.$backdrop = this.isShown = null, this.scrollbarWidth = 0, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function () {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    c.VERSION = "3.3.2", c.TRANSITION_DURATION = 300, c.BACKDROP_TRANSITION_DURATION = 150, c.DEFAULTS = {backdrop: !0, keyboard: !0, show: !0}, c.prototype.toggle = function (a) {
        return this.isShown ? this.hide() : this.show(a)
    }, c.prototype.show = function (b) {
        var d = this, e = a.Event("show.bs.modal", {relatedTarget: b});
        this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.backdrop(function () {
            var e = a.support.transition && d.$element.hasClass("fade");
            d.$element.parent().length || d.$element.appendTo(d.$body), d.$element.show().scrollTop(0), d.options.backdrop && d.adjustBackdrop(), d.adjustDialog(), e && d.$element[0].offsetWidth, d.$element.addClass("in").attr("aria-hidden", !1), d.enforceFocus();
            var f = a.Event("shown.bs.modal", {relatedTarget: b});
            e ? d.$element.find(".modal-dialog").one("bsTransitionEnd", function () {
                d.$element.trigger("focus").trigger(f)
            }).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f)
        }))
    }, c.prototype.hide = function (b) {
        b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal())
    }, c.prototype.enforceFocus = function () {
        a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function (a) {
            this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
        }, this))
    }, c.prototype.escape = function () {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function (a) {
            27 == a.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, c.prototype.resize = function () {
        this.isShown ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this)) : a(window).off("resize.bs.modal")
    }, c.prototype.hideModal = function () {
        var a = this;
        this.$element.hide(), this.backdrop(function () {
            a.$body.removeClass("modal-open"), a.resetAdjustments(), a.resetScrollbar(), a.$element.trigger("hidden.bs.modal")
        })
    }, c.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, c.prototype.backdrop = function (b) {
        var d = this, e = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var f = a.support.transition && e;
            if (this.$backdrop = a('<div class="modal-backdrop ' + e + '" />').prependTo(this.$element).on("click.dismiss.bs.modal", a.proxy(function (a) {
                a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
            }, this)), f && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b)return;
            f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var g = function () {
                d.removeBackdrop(), b && b()
            };
            a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g()
        } else b && b()
    }, c.prototype.handleUpdate = function () {
        this.options.backdrop && this.adjustBackdrop(), this.adjustDialog()
    }, c.prototype.adjustBackdrop = function () {
        this.$backdrop.css("height", 0).css("height", this.$element[0].scrollHeight)
    }, c.prototype.adjustDialog = function () {
        var a = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "", paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""})
    }, c.prototype.resetAdjustments = function () {
        this.$element.css({paddingLeft: "", paddingRight: ""})
    }, c.prototype.checkScrollbar = function () {
        this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight, this.scrollbarWidth = this.measureScrollbar()
    }, c.prototype.setScrollbar = function () {
        var a = parseInt(this.$body.css("padding-right") || 0, 10);
        this.bodyIsOverflowing && this.$body.css("padding-right", a + this.scrollbarWidth)
    }, c.prototype.resetScrollbar = function () {
        this.$body.css("padding-right", "")
    }, c.prototype.measureScrollbar = function () {
        var a = document.createElement("div");
        a.className = "modal-scrollbar-measure", this.$body.append(a);
        var b = a.offsetWidth - a.clientWidth;
        return this.$body[0].removeChild(a), b
    };
    var d = a.fn.modal;
    a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function () {
        return a.fn.modal = d, this
    }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (c) {
        var d = a(this), e = d.attr("href"), f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")), g = f.data("bs.modal") ? "toggle" : a.extend({remote: !/#/.test(e) && e}, f.data(), d.data());
        d.is("a") && c.preventDefault(), f.one("show.bs.modal", function (a) {
            a.isDefaultPrevented() || f.one("hidden.bs.modal", function () {
                d.is(":visible") && d.trigger("focus")
            })
        }), b.call(f, g, this)
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.tooltip"), f = "object" == typeof b && b;
            (e || "destroy" != b) && (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }

    var c = function (a, b) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", a, b)
    };
    c.VERSION = "3.3.2", c.TRANSITION_DURATION = 150, c.DEFAULTS = {animation: !0, placement: "top", selector: !1, template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: !1, container: !1, viewport: {selector: "body", padding: 0}}, c.prototype.init = function (b, c, d) {
        this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(this.options.viewport.selector || this.options.viewport);
        for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
            var g = e[f];
            if ("click" == g)this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this)); else if ("manual" != g) {
                var h = "hover" == g ? "mouseenter" : "focusin", i = "hover" == g ? "mouseleave" : "focusout";
                this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = a.extend({}, this.options, {trigger: "manual", selector: ""}) : this.fixTitle()
    }, c.prototype.getDefaults = function () {
        return c.DEFAULTS
    }, c.prototype.getOptions = function (b) {
        return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {show: b.delay, hide: b.delay}), b
    }, c.prototype.getDelegateOptions = function () {
        var b = {}, c = this.getDefaults();
        return this._options && a.each(this._options, function (a, d) {
            c[a] != d && (b[a] = d)
        }), b
    }, c.prototype.enter = function (b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c && c.$tip && c.$tip.is(":visible") ? void(c.hoverState = "in") : (c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function () {
            "in" == c.hoverState && c.show()
        }, c.options.delay.show)) : c.show())
    }, c.prototype.leave = function (b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function () {
            "out" == c.hoverState && c.hide()
        }, c.options.delay.hide)) : c.hide()
    }, c.prototype.show = function () {
        var b = a.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(b);
            var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (b.isDefaultPrevented() || !d)return;
            var e = this, f = this.tip(), g = this.getUID(this.type);
            this.setContent(), f.attr("id", g), this.$element.attr("aria-describedby", g), this.options.animation && f.addClass("fade");
            var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement, i = /\s?auto?\s?/i, j = i.test(h);
            j && (h = h.replace(i, "") || "top"), f.detach().css({top: 0, left: 0, display: "block"}).addClass(h).data("bs." + this.type, this), this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element);
            var k = this.getPosition(), l = f[0].offsetWidth, m = f[0].offsetHeight;
            if (j) {
                var n = h, o = this.options.container ? a(this.options.container) : this.$element.parent(), p = this.getPosition(o);
                h = "bottom" == h && k.bottom + m > p.bottom ? "top" : "top" == h && k.top - m < p.top ? "bottom" : "right" == h && k.right + l > p.width ? "left" : "left" == h && k.left - l < p.left ? "right" : h, f.removeClass(n).addClass(h)
            }
            var q = this.getCalculatedOffset(h, k, l, m);
            this.applyPlacement(q, h);
            var r = function () {
                var a = e.hoverState;
                e.$element.trigger("shown.bs." + e.type), e.hoverState = null, "out" == a && e.leave(e)
            };
            a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", r).emulateTransitionEnd(c.TRANSITION_DURATION) : r()
        }
    }, c.prototype.applyPlacement = function (b, c) {
        var d = this.tip(), e = d[0].offsetWidth, f = d[0].offsetHeight, g = parseInt(d.css("margin-top"), 10), h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top = b.top + g, b.left = b.left + h, a.offset.setOffset(d[0], a.extend({using: function (a) {
            d.css({top: Math.round(a.top), left: Math.round(a.left)})
        }}, b), 0), d.addClass("in");
        var i = d[0].offsetWidth, j = d[0].offsetHeight;
        "top" == c && j != f && (b.top = b.top + f - j);
        var k = this.getViewportAdjustedDelta(c, b, i, j);
        k.left ? b.left += k.left : b.top += k.top;
        var l = /top|bottom/.test(c), m = l ? 2 * k.left - e + i : 2 * k.top - f + j, n = l ? "offsetWidth" : "offsetHeight";
        d.offset(b), this.replaceArrow(m, d[0][n], l)
    }, c.prototype.replaceArrow = function (a, b, c) {
        this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "")
    }, c.prototype.setContent = function () {
        var a = this.tip(), b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
    }, c.prototype.hide = function (b) {
        function d() {
            "in" != e.hoverState && f.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), b && b()
        }

        var e = this, f = this.tip(), g = a.Event("hide.bs." + this.type);
        return this.$element.trigger(g), g.isDefaultPrevented() ? void 0 : (f.removeClass("in"), a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(), this.hoverState = null, this)
    }, c.prototype.fixTitle = function () {
        var a = this.$element;
        (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
    }, c.prototype.hasContent = function () {
        return this.getTitle()
    }, c.prototype.getPosition = function (b) {
        b = b || this.$element;
        var c = b[0], d = "BODY" == c.tagName, e = c.getBoundingClientRect();
        null == e.width && (e = a.extend({}, e, {width: e.right - e.left, height: e.bottom - e.top}));
        var f = d ? {top: 0, left: 0} : b.offset(), g = {scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()}, h = d ? {width: a(window).width(), height: a(window).height()} : null;
        return a.extend({}, e, g, h, f)
    }, c.prototype.getCalculatedOffset = function (a, b, c, d) {
        return"bottom" == a ? {top: b.top + b.height, left: b.left + b.width / 2 - c / 2} : "top" == a ? {top: b.top - d, left: b.left + b.width / 2 - c / 2} : "left" == a ? {top: b.top + b.height / 2 - d / 2, left: b.left - c} : {top: b.top + b.height / 2 - d / 2, left: b.left + b.width}
    }, c.prototype.getViewportAdjustedDelta = function (a, b, c, d) {
        var e = {top: 0, left: 0};
        if (!this.$viewport)return e;
        var f = this.options.viewport && this.options.viewport.padding || 0, g = this.getPosition(this.$viewport);
        if (/right|left/.test(a)) {
            var h = b.top - f - g.scroll, i = b.top + f - g.scroll + d;
            h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
        } else {
            var j = b.left - f, k = b.left + f + c;
            j < g.left ? e.left = g.left - j : k > g.width && (e.left = g.left + g.width - k)
        }
        return e
    }, c.prototype.getTitle = function () {
        var a, b = this.$element, c = this.options;
        return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
    }, c.prototype.getUID = function (a) {
        do a += ~~(1e6 * Math.random()); while (document.getElementById(a));
        return a
    }, c.prototype.tip = function () {
        return this.$tip = this.$tip || a(this.options.template)
    }, c.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, c.prototype.enable = function () {
        this.enabled = !0
    }, c.prototype.disable = function () {
        this.enabled = !1
    }, c.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }, c.prototype.toggle = function (b) {
        var c = this;
        b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
    }, c.prototype.destroy = function () {
        var a = this;
        clearTimeout(this.timeout), this.hide(function () {
            a.$element.off("." + a.type).removeData("bs." + a.type)
        })
    };
    var d = a.fn.tooltip;
    a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function () {
        return a.fn.tooltip = d, this
    }
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.popover"), f = "object" == typeof b && b;
            (e || "destroy" != b) && (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }

    var c = function (a, b) {
        this.init("popover", a, b)
    };
    if (!a.fn.tooltip)throw new Error("Popover requires tooltip.js");
    c.VERSION = "3.3.2", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {placement: "right", trigger: "click", content: "", template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function () {
        return c.DEFAULTS
    }, c.prototype.setContent = function () {
        var a = this.tip(), b = this.getTitle(), c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide()
    }, c.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }, c.prototype.getContent = function () {
        var a = this.$element, b = this.options;
        return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
    }, c.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }, c.prototype.tip = function () {
        return this.$tip || (this.$tip = a(this.options.template)), this.$tip
    };
    var d = a.fn.popover;
    a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function () {
        return a.fn.popover = d, this
    }
}(jQuery), +function (a) {
    "use strict";
    function b(c, d) {
        var e = a.proxy(this.process, this);
        this.$body = a("body"), this.$scrollElement = a(a(c).is("body") ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", e), this.refresh(), this.process()
    }

    function c(c) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.scrollspy"), f = "object" == typeof c && c;
            e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]()
        })
    }

    b.VERSION = "3.3.2", b.DEFAULTS = {offset: 10}, b.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }, b.prototype.refresh = function () {
        var b = "offset", c = 0;
        a.isWindow(this.$scrollElement[0]) || (b = "position", c = this.$scrollElement.scrollTop()), this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight();
        var d = this;
        this.$body.find(this.selector).map(function () {
            var d = a(this), e = d.data("target") || d.attr("href"), f = /^#./.test(e) && a(e);
            return f && f.length && f.is(":visible") && [
                [f[b]().top + c, e]
            ] || null
        }).sort(function (a, b) {
            return a[0] - b[0]
        }).each(function () {
            d.offsets.push(this[0]), d.targets.push(this[1])
        })
    }, b.prototype.process = function () {
        var a, b = this.$scrollElement.scrollTop() + this.options.offset, c = this.getScrollHeight(), d = this.options.offset + c - this.$scrollElement.height(), e = this.offsets, f = this.targets, g = this.activeTarget;
        if (this.scrollHeight != c && this.refresh(), b >= d)return g != (a = f[f.length - 1]) && this.activate(a);
        if (g && b < e[0])return this.activeTarget = null, this.clear();
        for (a = e.length; a--;)g != f[a] && b >= e[a] && (!e[a + 1] || b <= e[a + 1]) && this.activate(f[a])
    }, b.prototype.activate = function (b) {
        this.activeTarget = b, this.clear();
        var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]', d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy")
    }, b.prototype.clear = function () {
        a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var d = a.fn.scrollspy;
    a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function () {
        return a.fn.scrollspy = d, this
    }, a(window).on("load.bs.scrollspy.data-api", function () {
        a('[data-spy="scroll"]').each(function () {
            var b = a(this);
            c.call(b, b.data())
        })
    })
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.tab");
            e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]()
        })
    }

    var c = function (b) {
        this.element = a(b)
    };
    c.VERSION = "3.3.2", c.TRANSITION_DURATION = 150, c.prototype.show = function () {
        var b = this.element, c = b.closest("ul:not(.dropdown-menu)"), d = b.data("target");
        if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
            var e = c.find(".active:last a"), f = a.Event("hide.bs.tab", {relatedTarget: b[0]}), g = a.Event("show.bs.tab", {relatedTarget: e[0]});
            if (e.trigger(f), b.trigger(g), !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
                var h = a(d);
                this.activate(b.closest("li"), c), this.activate(h, h.parent(), function () {
                    e.trigger({type: "hidden.bs.tab", relatedTarget: b[0]}), b.trigger({type: "shown.bs.tab", relatedTarget: e[0]})
                })
            }
        }
    }, c.prototype.activate = function (b, d, e) {
        function f() {
            g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu") && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), e && e()
        }

        var g = d.find("> .active"), h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
        g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(), g.removeClass("in")
    };
    var d = a.fn.tab;
    a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function () {
        return a.fn.tab = d, this
    };
    var e = function (c) {
        c.preventDefault(), b.call(a(this), "show")
    };
    a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e)
}(jQuery), +function (a) {
    "use strict";
    function b(b) {
        return this.each(function () {
            var d = a(this), e = d.data("bs.affix"), f = "object" == typeof b && b;
            e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]()
        })
    }

    var c = function (b, d) {
        this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = this.unpin = this.pinnedOffset = null, this.checkPosition()
    };
    c.VERSION = "3.3.2", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {offset: 0, target: window}, c.prototype.getState = function (a, b, c, d) {
        var e = this.$target.scrollTop(), f = this.$element.offset(), g = this.$target.height();
        if (null != c && "top" == this.affixed)return c > e ? "top" : !1;
        if ("bottom" == this.affixed)return null != c ? e + this.unpin <= f.top ? !1 : "bottom" : a - d >= e + g ? !1 : "bottom";
        var h = null == this.affixed, i = h ? e : f.top, j = h ? g : b;
        return null != c && c >= e ? "top" : null != d && i + j >= a - d ? "bottom" : !1
    }, c.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset)return this.pinnedOffset;
        this.$element.removeClass(c.RESET).addClass("affix");
        var a = this.$target.scrollTop(), b = this.$element.offset();
        return this.pinnedOffset = b.top - a
    }, c.prototype.checkPositionWithEventLoop = function () {
        setTimeout(a.proxy(this.checkPosition, this), 1)
    }, c.prototype.checkPosition = function () {
        if (this.$element.is(":visible")) {
            var b = this.$element.height(), d = this.options.offset, e = d.top, f = d.bottom, g = a("body").height();
            "object" != typeof d && (f = e = d), "function" == typeof e && (e = d.top(this.$element)), "function" == typeof f && (f = d.bottom(this.$element));
            var h = this.getState(g, b, e, f);
            if (this.affixed != h) {
                null != this.unpin && this.$element.css("top", "");
                var i = "affix" + (h ? "-" + h : ""), j = a.Event(i + ".bs.affix");
                if (this.$element.trigger(j), j.isDefaultPrevented())return;
                this.affixed = h, this.unpin = "bottom" == h ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == h && this.$element.offset({top: g - b - f})
        }
    };
    var d = a.fn.affix;
    a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function () {
        return a.fn.affix = d, this
    }, a(window).on("load", function () {
        a('[data-spy="affix"]').each(function () {
            var c = a(this), d = c.data();
            d.offset = d.offset || {}, null != d.offsetBottom && (d.offset.bottom = d.offsetBottom), null != d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d)
        })
    })
}(jQuery);
(function (root, factory) {
    "use strict";
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery')(root));
    }
    else if (typeof define === "function" && define.amd) {
        define("bootstrap-dialog", ["jquery"], function ($) {
            return factory($);
        });
    } else {
        root.BootstrapDialog = factory(root.jQuery);
    }
}(this, function ($) {
    "use strict";
    var Modal = $.fn.modal.Constructor;
    var BootstrapDialogModal = function (element, options) {
        Modal.call(this, element, options);
    };
    BootstrapDialogModal.getModalVersion = function () {
        var version = null;
        if (typeof $.fn.modal.Constructor.VERSION === 'undefined') {
            version = 'v3.1';
        } else if (/3\.2\.\d+/.test($.fn.modal.Constructor.VERSION)) {
            version = 'v3.2';
        } else {
            version = 'v3.3';
        }
        return version;
    };
    BootstrapDialogModal.ORIGINAL_BODY_PADDING = $('body').css('padding-right') || 0;
    BootstrapDialogModal.METHODS_TO_OVERRIDE = {};
    BootstrapDialogModal.METHODS_TO_OVERRIDE['v3.1'] = {};
    BootstrapDialogModal.METHODS_TO_OVERRIDE['v3.2'] = {hide: function (e) {
        if (e) {
            e.preventDefault();
        }
        e = $.Event('hide.bs.modal');
        this.$element.trigger(e);
        if (!this.isShown || e.isDefaultPrevented()) {
            return;
        }
        this.isShown = false;
        var openedDialogs = this.getGlobalOpenedDialogs();
        if (openedDialogs.length === 0) {
            this.$body.removeClass('modal-open');
        }
        this.resetScrollbar();
        this.escape();
        $(document).off('focusin.bs.modal');
        this.$element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.bs.modal');
        $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal();
    }};
    BootstrapDialogModal.METHODS_TO_OVERRIDE['v3.3'] = {setScrollbar: function () {
        var bodyPad = BootstrapDialogModal.ORIGINAL_BODY_PADDING;
        if (this.bodyIsOverflowing) {
            this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
        }
    }, resetScrollbar: function () {
        var openedDialogs = this.getGlobalOpenedDialogs();
        if (openedDialogs.length === 0) {
            this.$body.css('padding-right', BootstrapDialogModal.ORIGINAL_BODY_PADDING);
        }
    }, hideModal: function () {
        this.$element.hide();
        this.backdrop($.proxy(function () {
            var openedDialogs = this.getGlobalOpenedDialogs();
            if (openedDialogs.length === 0) {
                this.$body.removeClass('modal-open');
            }
            this.resetAdjustments();
            this.resetScrollbar();
            this.$element.trigger('hidden.bs.modal');
        }, this));
    }};
    BootstrapDialogModal.prototype = {constructor: BootstrapDialogModal, getGlobalOpenedDialogs: function () {
        var openedDialogs = [];
        $.each(BootstrapDialog.dialogs, function (id, dialogInstance) {
            if (dialogInstance.isRealized() && dialogInstance.isOpened()) {
                openedDialogs.push(dialogInstance);
            }
        });
        return openedDialogs;
    }};
    BootstrapDialogModal.prototype = $.extend(BootstrapDialogModal.prototype, Modal.prototype, BootstrapDialogModal.METHODS_TO_OVERRIDE[BootstrapDialogModal.getModalVersion()]);
    var BootstrapDialog = function (options) {
        this.defaultOptions = $.extend(true, {id: BootstrapDialog.newGuid(), buttons: [], data: {}, onshow: null, onshown: null, onhide: null, onhidden: null}, BootstrapDialog.defaultOptions);
        this.indexedButtons = {};
        this.registeredButtonHotkeys = {};
        this.draggableData = {isMouseDown: false, mouseOffset: {}};
        this.realized = false;
        this.opened = false;
        this.initOptions(options);
        this.holdThisInstance();
    };
    BootstrapDialog.NAMESPACE = 'bootstrap-dialog';
    BootstrapDialog.TYPE_DEFAULT = 'type-default';
    BootstrapDialog.TYPE_INFO = 'type-info';
    BootstrapDialog.TYPE_PRIMARY = 'type-primary';
    BootstrapDialog.TYPE_SUCCESS = 'type-success';
    BootstrapDialog.TYPE_WARNING = 'type-warning';
    BootstrapDialog.TYPE_DANGER = 'type-danger';
    BootstrapDialog.DEFAULT_TEXTS = {};
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_DEFAULT] = 'Information';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_INFO] = 'Information';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_PRIMARY] = 'Information';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_SUCCESS] = 'Success';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_WARNING] = 'Warning';
    BootstrapDialog.DEFAULT_TEXTS[BootstrapDialog.TYPE_DANGER] = 'Danger';
    BootstrapDialog.DEFAULT_TEXTS['OK'] = 'OK';
    BootstrapDialog.DEFAULT_TEXTS['CANCEL'] = 'Cancel';
    BootstrapDialog.SIZE_NORMAL = 'size-normal';
    BootstrapDialog.SIZE_SMALL = 'size-small';
    BootstrapDialog.SIZE_WIDE = 'size-wide';
    BootstrapDialog.SIZE_LARGE = 'size-large';
    BootstrapDialog.BUTTON_SIZES = {};
    BootstrapDialog.BUTTON_SIZES[BootstrapDialog.SIZE_NORMAL] = '';
    BootstrapDialog.BUTTON_SIZES[BootstrapDialog.SIZE_SMALL] = '';
    BootstrapDialog.BUTTON_SIZES[BootstrapDialog.SIZE_WIDE] = '';
    BootstrapDialog.BUTTON_SIZES[BootstrapDialog.SIZE_LARGE] = 'btn-lg';
    BootstrapDialog.ICON_SPINNER = 'glyphicon glyphicon-asterisk';
    BootstrapDialog.defaultOptions = {type: BootstrapDialog.TYPE_PRIMARY, size: BootstrapDialog.SIZE_NORMAL, cssClass: '', title: null, message: null, nl2br: true, closable: true, closeByBackdrop: true, closeByKeyboard: true, spinicon: BootstrapDialog.ICON_SPINNER, autodestroy: true, draggable: false, animate: true, description: ''};
    BootstrapDialog.configDefaultOptions = function (options) {
        BootstrapDialog.defaultOptions = $.extend(true, BootstrapDialog.defaultOptions, options);
    };
    BootstrapDialog.dialogs = {};
    BootstrapDialog.openAll = function () {
        $.each(BootstrapDialog.dialogs, function (id, dialogInstance) {
            dialogInstance.open();
        });
    };
    BootstrapDialog.closeAll = function () {
        $.each(BootstrapDialog.dialogs, function (id, dialogInstance) {
            dialogInstance.close();
        });
    };
    BootstrapDialog.moveFocus = function () {
        var lastDialogInstance = null;
        $.each(BootstrapDialog.dialogs, function (id, dialogInstance) {
            lastDialogInstance = dialogInstance;
        });
        if (lastDialogInstance !== null && lastDialogInstance.isRealized()) {
            lastDialogInstance.getModal().focus();
        }
    };
    BootstrapDialog.METHODS_TO_OVERRIDE = {};
    BootstrapDialog.METHODS_TO_OVERRIDE['v3.1'] = {handleModalBackdropEvent: function () {
        this.getModal().on('click', {dialog: this}, function (event) {
            event.target === this && event.data.dialog.isClosable() && event.data.dialog.canCloseByBackdrop() && event.data.dialog.close();
        });
        return this;
    }, updateZIndex: function () {
        var zIndexBackdrop = 1040;
        var zIndexModal = 1050;
        var dialogCount = 0;
        $.each(BootstrapDialog.dialogs, function (dialogId, dialogInstance) {
            dialogCount++;
        });
        var $modal = this.getModal();
        var $backdrop = $modal.data('bs.modal').$backdrop;
        $modal.css('z-index', zIndexModal + (dialogCount - 1) * 20);
        $backdrop.css('z-index', zIndexBackdrop + (dialogCount - 1) * 20);
        return this;
    }, open: function () {
        !this.isRealized() && this.realize();
        this.getModal().modal('show');
        this.updateZIndex();
        this.setOpened(true);
        return this;
    }};
    BootstrapDialog.METHODS_TO_OVERRIDE['v3.2'] = {handleModalBackdropEvent: BootstrapDialog.METHODS_TO_OVERRIDE['v3.1']['handleModalBackdropEvent'], updateZIndex: BootstrapDialog.METHODS_TO_OVERRIDE['v3.1']['updateZIndex'], open: BootstrapDialog.METHODS_TO_OVERRIDE['v3.1']['open']};
    BootstrapDialog.METHODS_TO_OVERRIDE['v3.3'] = {};
    BootstrapDialog.prototype = {constructor: BootstrapDialog, initOptions: function (options) {
        this.options = $.extend(true, this.defaultOptions, options);
        return this;
    }, holdThisInstance: function () {
        BootstrapDialog.dialogs[this.getId()] = this;
        return this;
    }, initModalStuff: function () {
        this.setModal(this.createModal()).setModalDialog(this.createModalDialog()).setModalContent(this.createModalContent()).setModalHeader(this.createModalHeader()).setModalBody(this.createModalBody()).setModalFooter(this.createModalFooter());
        this.getModal().append(this.getModalDialog());
        this.getModalDialog().append(this.getModalContent());
        this.getModalContent().append(this.getModalHeader()).append(this.getModalBody()).append(this.getModalFooter());
        return this;
    }, createModal: function () {
        var $modal = $('<div class="modal" tabindex="-1" role="dialog" aria-hidden="true"></div>');
        $modal.prop('id', this.getId()).attr('aria-labelledby', this.getId() + '_title');
        return $modal;
    }, getModal: function () {
        return this.$modal;
    }, setModal: function ($modal) {
        this.$modal = $modal;
        return this;
    }, createModalDialog: function () {
        return $('<div class="modal-dialog"></div>');
    }, getModalDialog: function () {
        return this.$modalDialog;
    }, setModalDialog: function ($modalDialog) {
        this.$modalDialog = $modalDialog;
        return this;
    }, createModalContent: function () {
        return $('<div class="modal-content"></div>');
    }, getModalContent: function () {
        return this.$modalContent;
    }, setModalContent: function ($modalContent) {
        this.$modalContent = $modalContent;
        return this;
    }, createModalHeader: function () {
        return $('<div class="modal-header"></div>');
    }, getModalHeader: function () {
        return this.$modalHeader;
    }, setModalHeader: function ($modalHeader) {
        this.$modalHeader = $modalHeader;
        return this;
    }, createModalBody: function () {
        return $('<div class="modal-body"></div>');
    }, getModalBody: function () {
        return this.$modalBody;
    }, setModalBody: function ($modalBody) {
        this.$modalBody = $modalBody;
        return this;
    }, createModalFooter: function () {
        return $('<div class="modal-footer"></div>');
    }, getModalFooter: function () {
        return this.$modalFooter;
    }, setModalFooter: function ($modalFooter) {
        this.$modalFooter = $modalFooter;
        return this;
    }, createDynamicContent: function (rawContent) {
        var content = null;
        if (typeof rawContent === 'function') {
            content = rawContent.call(rawContent, this);
        } else {
            content = rawContent;
        }
        if (typeof content === 'string') {
            content = this.formatStringContent(content);
        }
        return content;
    }, formatStringContent: function (content) {
        if (this.options.nl2br) {
            return content.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
        }
        return content;
    }, setData: function (key, value) {
        this.options.data[key] = value;
        return this;
    }, getData: function (key) {
        return this.options.data[key];
    }, setId: function (id) {
        this.options.id = id;
        return this;
    }, getId: function () {
        return this.options.id;
    }, getType: function () {
        return this.options.type;
    }, setType: function (type) {
        this.options.type = type;
        this.updateType();
        return this;
    }, updateType: function () {
        if (this.isRealized()) {
            var types = [BootstrapDialog.TYPE_DEFAULT, BootstrapDialog.TYPE_INFO, BootstrapDialog.TYPE_PRIMARY, BootstrapDialog.TYPE_SUCCESS, BootstrapDialog.TYPE_WARNING, BootstrapDialog.TYPE_DANGER];
            this.getModal().removeClass(types.join(' ')).addClass(this.getType());
        }
        return this;
    }, getSize: function () {
        return this.options.size;
    }, setSize: function (size) {
        this.options.size = size;
        this.updateSize();
        return this;
    }, updateSize: function () {
        if (this.isRealized()) {
            var dialog = this;
            this.getModal().removeClass(BootstrapDialog.SIZE_NORMAL).removeClass(BootstrapDialog.SIZE_SMALL).removeClass(BootstrapDialog.SIZE_WIDE).removeClass(BootstrapDialog.SIZE_LARGE);
            this.getModal().addClass(this.getSize());
            this.getModalDialog().removeClass('modal-sm');
            if (this.getSize() === BootstrapDialog.SIZE_SMALL) {
                this.getModalDialog().addClass('modal-sm');
            }
            this.getModalDialog().removeClass('modal-lg');
            if (this.getSize() === BootstrapDialog.SIZE_WIDE) {
                this.getModalDialog().addClass('modal-lg');
            }
            $.each(this.options.buttons, function (index, button) {
                var $button = dialog.getButton(button.id);
                var buttonSizes = ['btn-lg', 'btn-sm', 'btn-xs'];
                var sizeClassSpecified = false;
                if (typeof button['cssClass'] === 'string') {
                    var btnClasses = button['cssClass'].split(' ');
                    $.each(btnClasses, function (index, btnClass) {
                        if ($.inArray(btnClass, buttonSizes) !== -1) {
                            sizeClassSpecified = true;
                        }
                    });
                }
                if (!sizeClassSpecified) {
                    $button.removeClass(buttonSizes.join(' '));
                    $button.addClass(dialog.getButtonSize());
                }
            });
        }
        return this;
    }, getCssClass: function () {
        return this.options.cssClass;
    }, setCssClass: function (cssClass) {
        this.options.cssClass = cssClass;
        return this;
    }, getTitle: function () {
        return this.options.title;
    }, setTitle: function (title) {
        this.options.title = title;
        this.updateTitle();
        return this;
    }, updateTitle: function () {
        if (this.isRealized()) {
            var title = this.getTitle() !== null ? this.createDynamicContent(this.getTitle()) : this.getDefaultText();
            this.getModalHeader().find('.' + this.getNamespace('title')).html('').append(title).prop('id', this.getId() + '_title');
        }
        return this;
    }, getMessage: function () {
        return this.options.message;
    }, setMessage: function (message) {
        this.options.message = message;
        this.updateMessage();
        return this;
    }, updateMessage: function () {
        if (this.isRealized()) {
            var message = this.createDynamicContent(this.getMessage());
            this.getModalBody().find('.' + this.getNamespace('message')).html('').append(message);
        }
        return this;
    }, isClosable: function () {
        return this.options.closable;
    }, setClosable: function (closable) {
        this.options.closable = closable;
        this.updateClosable();
        return this;
    }, setCloseByBackdrop: function (closeByBackdrop) {
        this.options.closeByBackdrop = closeByBackdrop;
        return this;
    }, canCloseByBackdrop: function () {
        return this.options.closeByBackdrop;
    }, setCloseByKeyboard: function (closeByKeyboard) {
        this.options.closeByKeyboard = closeByKeyboard;
        return this;
    }, canCloseByKeyboard: function () {
        return this.options.closeByKeyboard;
    }, isAnimate: function () {
        return this.options.animate;
    }, setAnimate: function (animate) {
        this.options.animate = animate;
        return this;
    }, updateAnimate: function () {
        if (this.isRealized()) {
            this.getModal().toggleClass('fade', this.isAnimate());
        }
        return this;
    }, getSpinicon: function () {
        return this.options.spinicon;
    }, setSpinicon: function (spinicon) {
        this.options.spinicon = spinicon;
        return this;
    }, addButton: function (button) {
        this.options.buttons.push(button);
        return this;
    }, addButtons: function (buttons) {
        var that = this;
        $.each(buttons, function (index, button) {
            that.addButton(button);
        });
        return this;
    }, getButtons: function () {
        return this.options.buttons;
    }, setButtons: function (buttons) {
        this.options.buttons = buttons;
        this.updateButtons();
        return this;
    }, getButton: function (id) {
        if (typeof this.indexedButtons[id] !== 'undefined') {
            return this.indexedButtons[id];
        }
        return null;
    }, getButtonSize: function () {
        if (typeof BootstrapDialog.BUTTON_SIZES[this.getSize()] !== 'undefined') {
            return BootstrapDialog.BUTTON_SIZES[this.getSize()];
        }
        return'';
    }, updateButtons: function () {
        if (this.isRealized()) {
            if (this.getButtons().length === 0) {
                this.getModalFooter().hide();
            } else {
                this.getModalFooter().find('.' + this.getNamespace('footer')).html('').append(this.createFooterButtons());
            }
        }
        return this;
    }, isAutodestroy: function () {
        return this.options.autodestroy;
    }, setAutodestroy: function (autodestroy) {
        this.options.autodestroy = autodestroy;
    }, getDescription: function () {
        return this.options.description;
    }, setDescription: function (description) {
        this.options.description = description;
        return this;
    }, getDefaultText: function () {
        return BootstrapDialog.DEFAULT_TEXTS[this.getType()];
    }, getNamespace: function (name) {
        return BootstrapDialog.NAMESPACE + '-' + name;
    }, createHeaderContent: function () {
        var $container = $('<div></div>');
        $container.addClass(this.getNamespace('header'));
        $container.append(this.createTitleContent());
        $container.prepend(this.createCloseButton());
        return $container;
    }, createTitleContent: function () {
        var $title = $('<div></div>');
        $title.addClass(this.getNamespace('title'));
        return $title;
    }, createCloseButton: function () {
        var $container = $('<div></div>');
        $container.addClass(this.getNamespace('close-button'));
        var $icon = $('<button class="close">&times;</button>');
        $container.append($icon);
        $container.on('click', {dialog: this}, function (event) {
            event.data.dialog.close();
        });
        return $container;
    }, createBodyContent: function () {
        var $container = $('<div></div>');
        $container.addClass(this.getNamespace('body'));
        $container.append(this.createMessageContent());
        return $container;
    }, createMessageContent: function () {
        var $message = $('<div></div>');
        $message.addClass(this.getNamespace('message'));
        return $message;
    }, createFooterContent: function () {
        var $container = $('<div></div>');
        $container.addClass(this.getNamespace('footer'));
        return $container;
    }, createFooterButtons: function () {
        var that = this;
        var $container = $('<div></div>');
        $container.addClass(this.getNamespace('footer-buttons'));
        this.indexedButtons = {};
        $.each(this.options.buttons, function (index, button) {
            if (!button.id) {
                button.id = BootstrapDialog.newGuid();
            }
            var $button = that.createButton(button);
            that.indexedButtons[button.id] = $button;
            $container.append($button);
        });
        return $container;
    }, createButton: function (button) {
        var $button = $('<button class="btn"></button>');
        $button.prop('id', button.id);
        if (typeof button.icon !== 'undefined' && $.trim(button.icon) !== '') {
            $button.append(this.createButtonIcon(button.icon));
        }
        if (typeof button.label !== 'undefined') {
            $button.append(button.label);
        }
        if (typeof button.cssClass !== 'undefined' && $.trim(button.cssClass) !== '') {
            $button.addClass(button.cssClass);
        } else {
            $button.addClass('btn-default');
        }
        if (typeof button.hotkey !== 'undefined') {
            this.registeredButtonHotkeys[button.hotkey] = $button;
        }
        $button.on('click', {dialog: this, $button: $button, button: button}, function (event) {
            var dialog = event.data.dialog;
            var $button = event.data.$button;
            var button = event.data.button;
            if (typeof button.action === 'function') {
                button.action.call($button, dialog);
            }
            if (button.autospin) {
                $button.toggleSpin(true);
            }
        });
        this.enhanceButton($button);
        return $button;
    }, enhanceButton: function ($button) {
        $button.dialog = this;
        $button.toggleEnable = function (enable) {
            var $this = this;
            if (typeof enable !== 'undefined') {
                $this.prop("disabled", !enable).toggleClass('disabled', !enable);
            } else {
                $this.prop("disabled", !$this.prop("disabled"));
            }
            return $this;
        };
        $button.enable = function () {
            var $this = this;
            $this.toggleEnable(true);
            return $this;
        };
        $button.disable = function () {
            var $this = this;
            $this.toggleEnable(false);
            return $this;
        };
        $button.toggleSpin = function (spin) {
            var $this = this;
            var dialog = $this.dialog;
            var $icon = $this.find('.' + dialog.getNamespace('button-icon'));
            if (typeof spin === 'undefined') {
                spin = !($button.find('.icon-spin').length > 0);
            }
            if (spin) {
                $icon.hide();
                $button.prepend(dialog.createButtonIcon(dialog.getSpinicon()).addClass('icon-spin'));
            } else {
                $icon.show();
                $button.find('.icon-spin').remove();
            }
            return $this;
        };
        $button.spin = function () {
            var $this = this;
            $this.toggleSpin(true);
            return $this;
        };
        $button.stopSpin = function () {
            var $this = this;
            $this.toggleSpin(false);
            return $this;
        };
        return this;
    }, createButtonIcon: function (icon) {
        var $icon = $('<span></span>');
        $icon.addClass(this.getNamespace('button-icon')).addClass(icon);
        return $icon;
    }, enableButtons: function (enable) {
        $.each(this.indexedButtons, function (id, $button) {
            $button.toggleEnable(enable);
        });
        return this;
    }, updateClosable: function () {
        if (this.isRealized()) {
            this.getModalHeader().find('.' + this.getNamespace('close-button')).toggle(this.isClosable());
        }
        return this;
    }, onShow: function (onshow) {
        this.options.onshow = onshow;
        return this;
    }, onShown: function (onshown) {
        this.options.onshown = onshown;
        return this;
    }, onHide: function (onhide) {
        this.options.onhide = onhide;
        return this;
    }, onHidden: function (onhidden) {
        this.options.onhidden = onhidden;
        return this;
    }, isRealized: function () {
        return this.realized;
    }, setRealized: function (realized) {
        this.realized = realized;
        return this;
    }, isOpened: function () {
        return this.opened;
    }, setOpened: function (opened) {
        this.opened = opened;
        return this;
    }, handleModalEvents: function () {
        this.getModal().on('show.bs.modal', {dialog: this}, function (event) {
            var dialog = event.data.dialog;
            if (dialog.isModalEvent(event) && typeof dialog.options.onshow === 'function') {
                return dialog.options.onshow(dialog);
            }
        });
        this.getModal().on('shown.bs.modal', {dialog: this}, function (event) {
            var dialog = event.data.dialog;
            dialog.isModalEvent(event) && typeof dialog.options.onshown === 'function' && dialog.options.onshown(dialog);
        });
        this.getModal().on('hide.bs.modal', {dialog: this}, function (event) {
            var dialog = event.data.dialog;
            if (dialog.isModalEvent(event) && typeof dialog.options.onhide === 'function') {
                return dialog.options.onhide(dialog);
            }
        });
        this.getModal().on('hidden.bs.modal', {dialog: this}, function (event) {
            var dialog = event.data.dialog;
            dialog.isModalEvent(event) && typeof dialog.options.onhidden === 'function' && dialog.options.onhidden(dialog);
            dialog.isAutodestroy() && $(this).remove();
            BootstrapDialog.moveFocus();
        });
        this.handleModalBackdropEvent();
        this.getModal().on('keyup', {dialog: this}, function (event) {
            event.which === 27 && event.data.dialog.isClosable() && event.data.dialog.canCloseByKeyboard() && event.data.dialog.close();
        });
        this.getModal().on('keyup', {dialog: this}, function (event) {
            var dialog = event.data.dialog;
            if (typeof dialog.registeredButtonHotkeys[event.which] !== 'undefined') {
                var $button = $(dialog.registeredButtonHotkeys[event.which]);
                !$button.prop('disabled') && $button.focus().trigger('click');
            }
        });
        return this;
    }, handleModalBackdropEvent: function () {
        this.getModal().on('click', {dialog: this}, function (event) {
            $(event.target).hasClass('modal-backdrop') && event.data.dialog.isClosable() && event.data.dialog.canCloseByBackdrop() && event.data.dialog.close();
        });
        return this;
    }, isModalEvent: function (event) {
        return typeof event.namespace !== 'undefined' && event.namespace === 'bs.modal';
    }, makeModalDraggable: function () {
        if (this.options.draggable) {
            this.getModalHeader().addClass(this.getNamespace('draggable')).on('mousedown', {dialog: this}, function (event) {
                var dialog = event.data.dialog;
                dialog.draggableData.isMouseDown = true;
                var dialogOffset = dialog.getModalDialog().offset();
                dialog.draggableData.mouseOffset = {top: event.clientY - dialogOffset.top, left: event.clientX - dialogOffset.left};
            });
            this.getModal().on('mouseup mouseleave', {dialog: this}, function (event) {
                event.data.dialog.draggableData.isMouseDown = false;
            });
            $('body').on('mousemove', {dialog: this}, function (event) {
                var dialog = event.data.dialog;
                if (!dialog.draggableData.isMouseDown) {
                    return;
                }
                dialog.getModalDialog().offset({top: event.clientY - dialog.draggableData.mouseOffset.top, left: event.clientX - dialog.draggableData.mouseOffset.left});
            });
        }
        return this;
    }, realize: function () {
        this.initModalStuff();
        this.getModal().addClass(BootstrapDialog.NAMESPACE).addClass(this.getCssClass());
        this.updateSize();
        if (this.getDescription()) {
            this.getModal().attr('aria-describedby', this.getDescription());
        }
        this.getModalFooter().append(this.createFooterContent());
        this.getModalHeader().append(this.createHeaderContent());
        this.getModalBody().append(this.createBodyContent());
        this.getModal().data('bs.modal', new BootstrapDialogModal(this.getModal(), {backdrop: 'static', keyboard: false, show: false}));
        this.makeModalDraggable();
        this.handleModalEvents();
        this.setRealized(true);
        this.updateButtons();
        this.updateType();
        this.updateTitle();
        this.updateMessage();
        this.updateClosable();
        this.updateAnimate();
        this.updateSize();
        return this;
    }, open: function () {
        !this.isRealized() && this.realize();
        this.getModal().modal('show');
        this.setOpened(true);
        return this;
    }, close: function () {
        if (this.isAutodestroy()) {
            delete BootstrapDialog.dialogs[this.getId()];
        }
        this.getModal().modal('hide');
        this.setOpened(false);
        return this;
    }};
    BootstrapDialog.prototype = $.extend(BootstrapDialog.prototype, BootstrapDialog.METHODS_TO_OVERRIDE[BootstrapDialogModal.getModalVersion()]);
    BootstrapDialog.newGuid = function () {
        return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    BootstrapDialog.show = function (options) {
        return new BootstrapDialog(options).open();
    };
    BootstrapDialog.alert = function () {
        var options = {};
        var defaultOptions = {type: BootstrapDialog.TYPE_PRIMARY, title: null, message: null, closable: true, buttonLabel: BootstrapDialog.DEFAULT_TEXTS.OK, callback: null};
        if (typeof arguments[0] === 'object' && arguments[0].constructor === {}.constructor) {
            options = $.extend(true, defaultOptions, arguments[0]);
        } else {
            options = $.extend(true, defaultOptions, {message: arguments[0], closable: false, buttonLabel: BootstrapDialog.DEFAULT_TEXTS.OK, callback: typeof arguments[1] !== 'undefined' ? arguments[1] : null});
        }
        return new BootstrapDialog({type: options.type, title: options.title, message: options.message, closable: options.closable, data: {callback: options.callback}, onhide: function (dialog) {
            !dialog.getData('btnClicked') && dialog.isClosable() && typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
        }, buttons: [
            {label: options.buttonLabel, action: function (dialog) {
                dialog.setData('btnClicked', true);
                typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
                dialog.close();
            }}
        ]}).open();
    };
    BootstrapDialog.confirm = function (message, callback) {
        return new BootstrapDialog({title: 'Confirmation', message: message, closable: false, data: {'callback': callback}, buttons: [
            {label: BootstrapDialog.DEFAULT_TEXTS.CANCEL, action: function (dialog) {
                typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
                dialog.close();
            }},
            {label: BootstrapDialog.DEFAULT_TEXTS.OK, cssClass: 'btn-primary', action: function (dialog) {
                typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
                dialog.close();
            }}
        ]}).open();
    };
    BootstrapDialog.warning = function (message, callback) {
        return new BootstrapDialog({type: BootstrapDialog.TYPE_WARNING, message: message}).open();
    };
    BootstrapDialog.danger = function (message, callback) {
        return new BootstrapDialog({type: BootstrapDialog.TYPE_DANGER, message: message}).open();
    };
    BootstrapDialog.success = function (message, callback) {
        return new BootstrapDialog({type: BootstrapDialog.TYPE_SUCCESS, message: message}).open();
    };
    return BootstrapDialog;
}));
!function (a) {
    "use strict";
    a.matchMedia = a.matchMedia || function (a) {
        var b, c = a.documentElement, d = c.firstElementChild || c.firstChild, e = a.createElement("body"), f = a.createElement("div");
        return f.id = "mq-test-1", f.style.cssText = "position:absolute;top:-100em", e.style.background = "none", e.appendChild(f), function (a) {
            return f.innerHTML = '&shy;<style media="' + a + '"> #mq-test-1 { width: 42px; }</style>', c.insertBefore(e, d), b = 42 === f.offsetWidth, c.removeChild(e), {matches: b, media: a}
        }
    }(a.document)
}(this), function (a) {
    "use strict";
    function b() {
        u(!0)
    }

    var c = {};
    a.respond = c, c.update = function () {
    };
    var d = [], e = function () {
        var b = !1;
        try {
            b = new a.XMLHttpRequest
        } catch (c) {
            b = new a.ActiveXObject("Microsoft.XMLHTTP")
        }
        return function () {
            return b
        }
    }(), f = function (a, b) {
        var c = e();
        c && (c.open("GET", a, !0), c.onreadystatechange = function () {
            4 !== c.readyState || 200 !== c.status && 304 !== c.status || b(c.responseText)
        }, 4 !== c.readyState && c.send(null))
    };
    if (c.ajax = f, c.queue = d, c.regex = {media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi, keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi, urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g, findStyles: /@media *([^\{]+)\{([\S\s]+?)$/, only: /(only\s+)?([a-zA-Z]+)\s?/, minw: /\([\s]*min\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/, maxw: /\([\s]*max\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/}, c.mediaQueriesSupported = a.matchMedia && null !== a.matchMedia("only all") && a.matchMedia("only all").matches, !c.mediaQueriesSupported) {
        var g, h, i, j = a.document, k = j.documentElement, l = [], m = [], n = [], o = {}, p = 30, q = j.getElementsByTagName("head")[0] || k, r = j.getElementsByTagName("base")[0], s = q.getElementsByTagName("link"), t = function () {
            var a, b = j.createElement("div"), c = j.body, d = k.style.fontSize, e = c && c.style.fontSize, f = !1;
            return b.style.cssText = "position:absolute;font-size:1em;width:1em", c || (c = f = j.createElement("body"), c.style.background = "none"), k.style.fontSize = "100%", c.style.fontSize = "100%", c.appendChild(b), f && k.insertBefore(c, k.firstChild), a = b.offsetWidth, f ? k.removeChild(c) : c.removeChild(b), k.style.fontSize = d, e && (c.style.fontSize = e), a = i = parseFloat(a)
        }, u = function (b) {
            var c = "clientWidth", d = k[c], e = "CSS1Compat" === j.compatMode && d || j.body[c] || d, f = {}, o = s[s.length - 1], r = (new Date).getTime();
            if (b && g && p > r - g)return a.clearTimeout(h), h = a.setTimeout(u, p), void 0;
            g = r;
            for (var v in l)if (l.hasOwnProperty(v)) {
                var w = l[v], x = w.minw, y = w.maxw, z = null === x, A = null === y, B = "em";
                x && (x = parseFloat(x) * (x.indexOf(B) > -1 ? i || t() : 1)), y && (y = parseFloat(y) * (y.indexOf(B) > -1 ? i || t() : 1)), w.hasquery && (z && A || !(z || e >= x) || !(A || y >= e)) || (f[w.media] || (f[w.media] = []), f[w.media].push(m[w.rules]))
            }
            for (var C in n)n.hasOwnProperty(C) && n[C] && n[C].parentNode === q && q.removeChild(n[C]);
            n.length = 0;
            for (var D in f)if (f.hasOwnProperty(D)) {
                var E = j.createElement("style"), F = f[D].join("\n");
                E.type = "text/css", E.media = D, q.insertBefore(E, o.nextSibling), E.styleSheet ? E.styleSheet.cssText = F : E.appendChild(j.createTextNode(F)), n.push(E)
            }
        }, v = function (a, b, d) {
            var e = a.replace(c.regex.keyframes, "").match(c.regex.media), f = e && e.length || 0;
            b = b.substring(0, b.lastIndexOf("/"));
            var g = function (a) {
                return a.replace(c.regex.urls, "$1" + b + "$2$3")
            }, h = !f && d;
            b.length && (b += "/"), h && (f = 1);
            for (var i = 0; f > i; i++) {
                var j, k, n, o;
                h ? (j = d, m.push(g(a))) : (j = e[i].match(c.regex.findStyles) && RegExp.$1, m.push(RegExp.$2 && g(RegExp.$2))), n = j.split(","), o = n.length;
                for (var p = 0; o > p; p++)k = n[p], l.push({media: k.split("(")[0].match(c.regex.only) && RegExp.$2 || "all", rules: m.length - 1, hasquery: k.indexOf("(") > -1, minw: k.match(c.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""), maxw: k.match(c.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")})
            }
            u()
        }, w = function () {
            if (d.length) {
                var b = d.shift();
                f(b.href, function (c) {
                    v(c, b.href, b.media), o[b.href] = !0, a.setTimeout(function () {
                        w()
                    }, 0)
                })
            }
        }, x = function () {
            for (var b = 0; b < s.length; b++) {
                var c = s[b], e = c.href, f = c.media, g = c.rel && "stylesheet" === c.rel.toLowerCase();
                e && g && !o[e] && (c.styleSheet && c.styleSheet.rawCssText ? (v(c.styleSheet.rawCssText, e, f), o[e] = !0) : (!/^([a-zA-Z:]*\/\/)/.test(e) && !r || e.replace(RegExp.$1, "").split("/")[0] === a.location.host) && ("//" === e.substring(0, 2) && (e = a.location.protocol + e), d.push({href: e, media: f})))
            }
            w()
        };
        x(), c.update = x, c.getEmValue = t, a.addEventListener ? a.addEventListener("resize", b, !1) : a.attachEvent && a.attachEvent("onresize", b)
    }
}(this);
;
(function (window, document) {
    var version = '3.7.2';
    var options = window.html5 || {};
    var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
    var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
    var supportsHtml5Styles;
    var expando = '_html5shiv';
    var expanID = 0;
    var expandoData = {};
    var supportsUnknownElements;
    (function () {
        try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            supportsHtml5Styles = ('hidden'in a);
            supportsUnknownElements = a.childNodes.length == 1 || (function () {
                (document.createElement)('a');
                var frag = document.createDocumentFragment();
                return(typeof frag.cloneNode == 'undefined' || typeof frag.createDocumentFragment == 'undefined' || typeof frag.createElement == 'undefined');
            }());
        } catch (e) {
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
        }
    }());
    function addStyleSheet(ownerDocument, cssText) {
        var p = ownerDocument.createElement('p'), parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;
        p.innerHTML = 'x<style>' + cssText + '</style>';
        return parent.insertBefore(p.lastChild, parent.firstChild);
    }

    function getElements() {
        var elements = html5.elements;
        return typeof elements == 'string' ? elements.split(' ') : elements;
    }

    function addElements(newElements, ownerDocument) {
        var elements = html5.elements;
        if (typeof elements != 'string') {
            elements = elements.join(' ');
        }
        if (typeof newElements != 'string') {
            newElements = newElements.join(' ');
        }
        html5.elements = elements + ' ' + newElements;
        shivDocument(ownerDocument);
    }

    function getExpandoData(ownerDocument) {
        var data = expandoData[ownerDocument[expando]];
        if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
        }
        return data;
    }

    function createElement(nodeName, ownerDocument, data) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if (supportsUnknownElements) {
            return ownerDocument.createElement(nodeName);
        }
        if (!data) {
            data = getExpandoData(ownerDocument);
        }
        var node;
        if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
        } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
        } else {
            node = data.createElem(nodeName);
        }


        return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
    }

    function createDocumentFragment(ownerDocument, data) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        if (supportsUnknownElements) {
            return ownerDocument.createDocumentFragment();
        }
        data = data || getExpandoData(ownerDocument);
        var clone = data.frag.cloneNode(), i = 0, elems = getElements(), l = elems.length;
        for (; i < l; i++) {
            clone.createElement(elems[i]);
        }
        return clone;
    }

    function shivMethods(ownerDocument, data) {
        if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
        }
        ownerDocument.createElement = function (nodeName) {
            if (!html5.shivMethods) {
                return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
        };
        ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' + 'var n=f.cloneNode(),c=n.createElement;' + 'h.shivMethods&&(' +
            getElements().join().replace(/[\w\-:]+/g, function (nodeName) {
                data.createElem(nodeName);
                data.frag.createElement(nodeName);
                return'c("' + nodeName + '")';
            }) + ');return n}')(html5, data.frag);
    }

    function shivDocument(ownerDocument) {
        if (!ownerDocument) {
            ownerDocument = document;
        }
        var data = getExpandoData(ownerDocument);
        if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument, 'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                'mark{background:#FF0;color:#000}' +
                'template{display:none}');
        }
        if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
        }
        return ownerDocument;
    }

    var html5 = {'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video', 'version': version, 'shivCSS': (options.shivCSS !== false), 'supportsUnknownElements': supportsUnknownElements, 'shivMethods': (options.shivMethods !== false), 'type': 'default', 'shivDocument': shivDocument, createElement: createElement, createDocumentFragment: createDocumentFragment, addElements: addElements};
    window.html5 = html5;
    shivDocument(document);
}(this, document));
;
window.Modernizr = function (a, b, c) {
    function D(a) {
        j.cssText = a
    }

    function E(a, b) {
        return D(n.join(a + ";") + (b || ""))
    }

    function F(a, b) {
        return typeof a === b
    }

    function G(a, b) {
        return!!~("" + a).indexOf(b)
    }

    function H(a, b) {
        for (var d in a) {
            var e = a[d];
            if (!G(e, "-") && j[e] !== c)return b == "pfx" ? e : !0
        }
        return!1
    }

    function I(a, b, d) {
        for (var e in a) {
            var f = b[a[e]];
            if (f !== c)return d === !1 ? a[e] : F(f, "function") ? f.bind(d || b) : f
        }
        return!1
    }

    function J(a, b, c) {
        var d = a.charAt(0).toUpperCase() + a.slice(1), e = (a + " " + p.join(d + " ") + d).split(" ");
        return F(b, "string") || F(b, "undefined") ? H(e, b) : (e = (a + " " + q.join(d + " ") + d).split(" "), I(e, b, c))
    }

    function K() {
        e.input = function (c) {
            for (var d = 0, e = c.length; d < e; d++)u[c[d]] = c[d]in k;
            return u.list && (u.list = !!b.createElement("datalist") && !!a.HTMLDataListElement), u
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), e.inputtypes = function (a) {
            for (var d = 0, e, f, h, i = a.length; d < i; d++)k.setAttribute("type", f = a[d]), e = k.type !== "text", e && (k.value = l, k.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(f) && k.style.WebkitAppearance !== c ? (g.appendChild(k), h = b.defaultView, e = h.getComputedStyle && h.getComputedStyle(k, null).WebkitAppearance !== "textfield" && k.offsetHeight !== 0, g.removeChild(k)) : /^(search|tel)$/.test(f) || (/^(url|email)$/.test(f) ? e = k.checkValidity && k.checkValidity() === !1 : e = k.value != l)), t[a[d]] = !!e;
            return t
        }("search tel url email datetime date month week time datetime-local number range color".split(" "))
    }

    var d = "2.8.3", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k = b.createElement("input"), l = ":)", m = {}.toString, n = " -webkit- -moz- -o- -ms- ".split(" "), o = "Webkit Moz O ms", p = o.split(" "), q = o.toLowerCase().split(" "), r = {svg: "http://www.w3.org/2000/svg"}, s = {}, t = {}, u = {}, v = [], w = v.slice, x, y = function (a, c, d, e) {
        var f, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body");
        if (parseInt(d, 10))while (d--)j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j);
        return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i
    }, z = function (b) {
        var c = a.matchMedia || a.msMatchMedia;
        if (c)return c(b) && c(b).matches || !1;
        var d;
        return y("@media " + b + " { #" + h + " { position: absolute; } }", function (b) {
            d = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle)["position"] == "absolute"
        }), d
    }, A = function () {
        function d(d, e) {
            e = e || b.createElement(a[d] || "div"), d = "on" + d;
            var f = d in e;
            return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = F(e[d], "function"), F(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))), e = null, f
        }

        var a = {select: "input", change: "input", submit: "form", reset: "form", error: "img", load: "img", abort: "img"};
        return d
    }(), B = {}.hasOwnProperty, C;
    !F(B, "undefined") && !F(B.call, "undefined") ? C = function (a, b) {
        return B.call(a, b)
    } : C = function (a, b) {
        return b in a && F(a.constructor.prototype[b], "undefined")
    }, Function.prototype.bind || (Function.prototype.bind = function (b) {
        var c = this;
        if (typeof c != "function")throw new TypeError;
        var d = w.call(arguments, 1), e = function () {
            if (this instanceof e) {
                var a = function () {
                };
                a.prototype = c.prototype;
                var f = new a, g = c.apply(f, d.concat(w.call(arguments)));
                return Object(g) === g ? g : f
            }
            return c.apply(b, d.concat(w.call(arguments)))
        };
        return e
    }), s.flexbox = function () {
        return J("flexWrap")
    }, s.flexboxlegacy = function () {
        return J("boxDirection")
    }, s.canvas = function () {
        var a = b.createElement("canvas");
        return!!a.getContext && !!a.getContext("2d")
    }, s.canvastext = function () {
        return!!e.canvas && !!F(b.createElement("canvas").getContext("2d").fillText, "function")
    }, s.webgl = function () {
        return!!a.WebGLRenderingContext
    }, s.touch = function () {
        var c;
        return"ontouchstart"in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : y(["@media (", n.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function (a) {
            c = a.offsetTop === 9
        }), c
    }, s.geolocation = function () {
        return"geolocation"in navigator
    }, s.postmessage = function () {
        return!!a.postMessage
    }, s.websqldatabase = function () {
        return!!a.openDatabase
    }, s.indexedDB = function () {
        return!!J("indexedDB", a)
    }, s.hashchange = function () {
        return A("hashchange", a) && (b.documentMode === c || b.documentMode > 7)
    }, s.history = function () {
        return!!a.history && !!history.pushState
    }, s.draganddrop = function () {
        var a = b.createElement("div");
        return"draggable"in a || "ondragstart"in a && "ondrop"in a
    }, s.websockets = function () {
        return"WebSocket"in a || "MozWebSocket"in a
    }, s.rgba = function () {
        return D("background-color:rgba(150,255,150,.5)"), G(j.backgroundColor, "rgba")
    }, s.hsla = function () {
        return D("background-color:hsla(120,40%,100%,.5)"), G(j.backgroundColor, "rgba") || G(j.backgroundColor, "hsla")
    }, s.multiplebgs = function () {
        return D("background:url(https://),url(https://),red url(https://)"), /(url\s*\(.*?){3}/.test(j.background)
    }, s.backgroundsize = function () {
        return J("backgroundSize")
    }, s.borderimage = function () {
        return J("borderImage")
    }, s.borderradius = function () {
        return J("borderRadius")
    }, s.boxshadow = function () {
        return J("boxShadow")
    }, s.textshadow = function () {
        return b.createElement("div").style.textShadow === ""
    }, s.opacity = function () {
        return E("opacity:.55"), /^0.55$/.test(j.opacity)
    }, s.cssanimations = function () {
        return J("animationName")
    }, s.csscolumns = function () {
        return J("columnCount")
    }, s.cssgradients = function () {
        var a = "background-image:", b = "gradient(linear,left top,right bottom,from(#9f9),to(white));", c = "linear-gradient(left top,#9f9, white);";
        return D((a + "-webkit- ".split(" ").join(b + a) + n.join(c + a)).slice(0, -a.length)), G(j.backgroundImage, "gradient")
    }, s.cssreflections = function () {
        return J("boxReflect")
    }, s.csstransforms = function () {
        return!!J("transform")
    }, s.csstransforms3d = function () {
        var a = !!J("perspective");
        return a && "webkitPerspective"in g.style && y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function (b, c) {
            a = b.offsetLeft === 9 && b.offsetHeight === 3
        }), a
    }, s.csstransitions = function () {
        return J("transition")
    }, s.fontface = function () {
        var a;
        return y('@font-face {font-family:"font";src:url("https://")}', function (c, d) {
            var e = b.getElementById("smodernizr"), f = e.sheet || e.styleSheet, g = f ? f.cssRules && f.cssRules[0] ? f.cssRules[0].cssText : f.cssText || "" : "";
            a = /src/i.test(g) && g.indexOf(d.split(" ")[0]) === 0
        }), a
    }, s.generatedcontent = function () {
        var a;
        return y(["#", h, "{font:0/0 a}#", h, ':after{content:"', l, '";visibility:hidden;font:3px/1 a}'].join(""), function (b) {
            a = b.offsetHeight >= 3
        }), a
    }, s.video = function () {
        var a = b.createElement("video"), c = !1;
        try {
            if (c = !!a.canPlayType)c = new Boolean(c), c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")
        } catch (d) {
        }
        return c
    }, s.audio = function () {
        var a = b.createElement("audio"), c = !1;
        try {
            if (c = !!a.canPlayType)c = new Boolean(c), c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), c.mp3 = a.canPlayType("audio/mpeg;").replace(/^no$/, ""), c.wav = a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), c.m4a = (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(/^no$/, "")
        } catch (d) {
        }
        return c
    }, s.localstorage = function () {
        try {
            return localStorage.setItem(h, h), localStorage.removeItem(h), !0
        } catch (a) {
            return!1
        }
    }, s.sessionstorage = function () {
        try {
            return sessionStorage.setItem(h, h), sessionStorage.removeItem(h), !0
        } catch (a) {
            return!1
        }
    }, s.webworkers = function () {
        return!!a.Worker
    }, s.applicationcache = function () {
        return!!a.applicationCache
    }, s.svg = function () {
        return!!b.createElementNS && !!b.createElementNS(r.svg, "svg").createSVGRect
    }, s.inlinesvg = function () {
        var a = b.createElement("div");
        return a.innerHTML = "<svg/>", (a.firstChild && a.firstChild.namespaceURI) == r.svg
    }, s.smil = function () {
        return!!b.createElementNS && /SVGAnimate/.test(m.call(b.createElementNS(r.svg, "animate")))
    }, s.svgclippaths = function () {
        return!!b.createElementNS && /SVGClipPath/.test(m.call(b.createElementNS(r.svg, "clipPath")))
    };
    for (var L in s)C(s, L) && (x = L.toLowerCase(), e[x] = s[L](), v.push((e[x] ? "" : "no-") + x));
    return e.input || K(), e.addTest = function (a, b) {
        if (typeof a == "object")for (var d in a)C(a, d) && e.addTest(d, a[d]); else {
            a = a.toLowerCase();
            if (e[a] !== c)return e;
            b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b
        }
        return e
    }, D(""), i = k = null, e._version = d, e._prefixes = n, e._domPrefixes = q, e._cssomPrefixes = p, e.mq = z, e.hasEvent = A, e.testProp = function (a) {
        return H([a])
    }, e.testAllProps = J, e.testStyles = y, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + v.join(" ") : ""), e
}(this, this.document), function (a, b) {
    function l(a, b) {
        var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement;
        return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
    }

    function m() {
        var a = s.elements;
        return typeof a == "string" ? a.split(" ") : a
    }

    function n(a) {
        var b = j[a[h]];
        return b || (b = {}, i++, a[h] = i, j[i] = b), b
    }

    function o(a, c, d) {
        c || (c = b);
        if (k)return c.createElement(a);
        d || (d = n(c));
        var g;
        return d.cache[a] ? g = d.cache[a].cloneNode() : f.test(a) ? g = (d.cache[a] = d.createElem(a)).cloneNode() : g = d.createElem(a), g.canHaveChildren && !e.test(a) && !g.tagUrn ? d.frag.appendChild(g) : g
    }

    function p(a, c) {
        a || (a = b);
        if (k)return a.createDocumentFragment();
        c = c || n(a);
        var d = c.frag.cloneNode(), e = 0, f = m(), g = f.length;
        for (; e < g; e++)d.createElement(f[e]);
        return d
    }

    function q(a, b) {
        b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function (c) {
            return s.shivMethods ? o(c, a, b) : b.createElem(c)
        }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/\w+/g, function (a) {
            return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
        }) + ");return n}")(s, b.frag)
    }

    function r(a) {
        a || (a = b);
        var c = n(a);
        return s.shivCSS && !g && !c.hasCSS && (c.hasCSS = !!l(a, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), k || q(a, c), a
    }

    function w(a) {
        var b, c = a.getElementsByTagName("*"), d = c.length, e = RegExp("^(?:" + m().join("|") + ")$", "i"), f = [];
        while (d--)b = c[d], e.test(b.nodeName) && f.push(b.applyElement(x(b)));
        return f
    }

    function x(a) {
        var b, c = a.attributes, d = c.length, e = a.ownerDocument.createElement(u + ":" + a.nodeName);
        while (d--)b = c[d], b.specified && e.setAttribute(b.nodeName, b.nodeValue);
        return e.style.cssText = a.style.cssText, e
    }

    function y(a) {
        var b, c = a.split("{"), d = c.length, e = RegExp("(^|[\\s,>+~])(" + m().join("|") + ")(?=[[\\s,>+~#.:]|$)", "gi"), f = "$1" + u + "\\:$2";
        while (d--)b = c[d] = c[d].split("}"), b[b.length - 1] = b[b.length - 1].replace(e, f), c[d] = b.join("}");
        return c.join("{")
    }

    function z(a) {
        var b = a.length;
        while (b--)a[b].removeNode()
    }

    function A(a) {
        function g() {
            clearTimeout(d._removeSheetTimer), b && b.removeNode(!0), b = null
        }

        var b, c, d = n(a), e = a.namespaces, f = a.parentWindow;
        return!v || a.printShived ? a : (typeof e[u] == "undefined" && e.add(u), f.attachEvent("onbeforeprint", function () {
            g();
            var d, e, f, h = a.styleSheets, i = [], j = h.length, k = Array(j);
            while (j--)k[j] = h[j];
            while (f = k.pop())if (!f.disabled && t.test(f.media)) {
                try {
                    d = f.imports, e = d.length
                } catch (m) {
                    e = 0
                }
                for (j = 0; j < e; j++)k.push(d[j]);
                try {
                    i.push(f.cssText)
                } catch (m) {
                }
            }
            i = y(i.reverse().join("")), c = w(a), b = l(a, i)
        }), f.attachEvent("onafterprint", function () {
            z(c), clearTimeout(d._removeSheetTimer), d._removeSheetTimer = setTimeout(g, 500)
        }), a.printShived = !0, a)
    }

    var c = "3.7.0", d = a.html5 || {}, e = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, f = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, g, h = "_html5shiv", i = 0, j = {}, k;
    (function () {
        try {
            var a = b.createElement("a");
            a.innerHTML = "<xyz></xyz>", g = "hidden"in a, k = a.childNodes.length == 1 || function () {
                b.createElement("a");
                var a = b.createDocumentFragment();
                return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
            }()
        } catch (c) {
            g = !0, k = !0
        }
    })();
    var s = {elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video", version: c, shivCSS: d.shivCSS !== !1, supportsUnknownElements: k, shivMethods: d.shivMethods !== !1, type: "default", shivDocument: r, createElement: o, createDocumentFragment: p};
    a.html5 = s, r(b);
    var t = /^$|\b(?:all|print)\b/, u = "html5shiv", v = !k && function () {
        var c = b.documentElement;
        return typeof b.namespaces != "undefined" && typeof b.parentWindow != "undefined" && typeof c.applyElement != "undefined" && typeof c.removeNode != "undefined" && typeof a.attachEvent != "undefined"
    }();
    s.type += " print", s.shivPrint = A, A(b)
}(this, document), function (a, b, c) {
    function d(a) {
        return"[object Function]" == o.call(a)
    }

    function e(a) {
        return"string" == typeof a
    }

    function f() {
    }

    function g(a) {
        return!a || "loaded" == a || "complete" == a || "uninitialized" == a
    }

    function h() {
        var a = p.shift();
        q = 1, a ? a.t ? m(function () {
            ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
        }, 0) : (a(), h()) : q = 0
    }

    function i(a, c, d, e, f, i, j) {
        function k(b) {
            if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
                "img" != a && m(function () {
                    t.removeChild(l)
                }, 50);
                for (var d in y[c])y[c].hasOwnProperty(d) && y[c][d].onload()
            }
        }

        var j = j || B.errorTimeout, l = b.createElement(a), o = 0, r = 0, u = {t: d, s: c, e: f, a: i, x: j};
        1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function () {
            k.call(this, r)
        }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
    }

    function j(a, b, c, d, f) {
        return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
    }

    function k() {
        var a = B;
        return a.loader = {load: j, i: 0}, a
    }

    var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance"in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l = a.opera && "[object Opera]" == o.call(a.opera), l = !!b.attachEvent && !l, u = r ? "object" : l ? "script" : "img", v = l ? "script" : u, w = Array.isArray || function (a) {
        return"[object Array]" == o.call(a)
    }, x = [], y = {}, z = {timeout: function (a, b) {
        return b.length && (a.timeout = b[0]), a
    }}, A, B;
    B = function (a) {
        function b(a) {
            var a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = {url: c, origUrl: c, prefixes: a}, e, f, g;
            for (f = 0; f < d; f++)g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
            for (f = 0; f < b; f++)c = x[f](c);
            return c
        }

        function g(a, e, f, g, h) {
            var i = b(a), j = i.autoCallback;
            i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function () {
                k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
            })))
        }

        function h(a, b) {
            function c(a, c) {
                if (a) {
                    if (e(a))c || (j = function () {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l()
                    }), g(a, j, b, 0, h); else if (Object(a) === a)for (n in m = function () {
                        var b = 0, c;
                        for (c in a)a.hasOwnProperty(c) && b++;
                        return b
                    }(), a)a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function () {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l()
                    } : j[n] = function (a) {
                        return function () {
                            var b = [].slice.call(arguments);
                            a && a.apply(this, b), l()
                        }
                    }(k[n])), g(a[n], j, b, n, h))
                } else!c && l()
            }

            var h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f, m, n;
            c(h ? a.yep : a.nope, !!i), i && c(i)
        }

        var i, j, l = this.yepnope.loader;
        if (e(a))g(a, 0, l, 0); else if (w(a))for (i = 0; i < a.length; i++)j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l); else Object(a) === a && h(a, l)
    }, B.addPrefix = function (a, b) {
        z[a] = b
    }, B.addFilter = function (a) {
        x.push(a)
    }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function () {
        b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
    }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function (a, c, d, e, i, j) {
        var k = b.createElement("script"), l, o, e = e || B.errorTimeout;
        k.src = a;
        for (o in d)k.setAttribute(o, d[o]);
        c = j ? h : c || f, k.onreadystatechange = k.onload = function () {
            !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
        }, m(function () {
            l || (l = 1, c(1))
        }, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
    }, a.yepnope.injectCss = function (a, c, d, e, g, i) {
        var e = b.createElement("link"), j, c = i ? h : c || f;
        e.href = a, e.rel = "stylesheet", e.type = "text/css";
        for (j in d)e.setAttribute(j, d[j]);
        g || (n.parentNode.insertBefore(e, n), m(c, 0))
    }
}(this, document), Modernizr.load = function () {
    yepnope.apply(window, [].slice.call(arguments, 0))
};
if (typeof Object.create !== "function") {
    Object.create = function (e) {
        function t() {
        }

        t.prototype = e;
        return new t
    }
}
var ua = {toString: function () {
    return navigator.userAgent
}, test: function (e) {
    return this.toString().toLowerCase().indexOf(e.toLowerCase()) > -1
}};
ua.version = (ua.toString().toLowerCase().match(/[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
ua.webkit = ua.test("webkit");
ua.gecko = ua.test("gecko") && !ua.webkit;
ua.opera = ua.test("opera");
ua.ie = ua.test("msie") && !ua.opera;
ua.ie6 = ua.ie && document.compatMode && typeof document.documentElement.style.maxHeight === "undefined";
ua.ie7 = ua.ie && document.documentElement && typeof document.documentElement.style.maxHeight !== "undefined" && typeof XDomainRequest === "undefined";
ua.ie8 = ua.ie && typeof XDomainRequest !== "undefined";
var domReady = function () {
    var e = [];
    var t = function () {
        if (!arguments.callee.done) {
            arguments.callee.done = true;
            for (var t = 0; t < e.length; t++) {
                e[t]()
            }
        }
    };
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", t, false)
    }
    if (ua.ie) {
        (function () {
            try {
                document.documentElement.doScroll("left")
            } catch (e) {
                setTimeout(arguments.callee, 50);
                return
            }
            t()
        })();
        document.onreadystatechange = function () {
            if (document.readyState === "complete") {
                document.onreadystatechange = null;
                t()
            }
        }
    }
    if (ua.webkit && document.readyState) {
        (function () {
            if (document.readyState !== "loading") {
                t()
            } else {
                setTimeout(arguments.callee, 10)
            }
        })()
    }
    window.onload = t;
    return function (t) {
        if (typeof t === "function") {
            e[e.length] = t
        }
        return t
    }
}();
var cssHelper = function () {
    var e = {BLOCKS: /[^\s{;][^{;]*\{(?:[^{}]*\{[^{}]*\}[^{}]*|[^{}]*)*\}/g, BLOCKS_INSIDE: /[^\s{][^{]*\{[^{}]*\}/g, DECLARATIONS: /[a-zA-Z\-]+[^;]*:[^;]+;/g, RELATIVE_URLS: /url\(['"]?([^\/\)'"][^:\)'"]+)['"]?\)/g, REDUNDANT_COMPONENTS: /(?:\/\*([^*\\\\]|\*(?!\/))+\*\/|@import[^;]+;)/g, REDUNDANT_WHITESPACE: /\s*(,|:|;|\{|\})\s*/g, WHITESPACE_IN_PARENTHESES: /\(\s*(\S*)\s*\)/g, MORE_WHITESPACE: /\s{2,}/g, FINAL_SEMICOLONS: /;\}/g, NOT_WHITESPACE: /\S+/g};
    var t, n = false;
    var r = [];
    var s = function (e) {
        if (typeof e === "function") {
            r[r.length] = e
        }
    };
    var o = function () {
        for (var e = 0; e < r.length; e++) {
            r[e](t)
        }
    };
    var u = {};
    var a = function (e, t) {
        if (u[e]) {
            var n = u[e].listeners;
            if (n) {
                for (var r = 0; r < n.length; r++) {
                    n[r](t)
                }
            }
        }
    };
    var f = function (e, t, n) {
        if (ua.ie && !window.XMLHttpRequest) {
            window.XMLHttpRequest = function () {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
        if (!XMLHttpRequest) {
            return""
        }
        var r = new XMLHttpRequest;
        try {
            r.open("get", e, true);
            r.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest")
        } catch (i) {
            n();
            return
        }
        var s = false;
        setTimeout(function () {
            s = true
        }, 5e3);
        document.documentElement.style.cursor = "progress";
        r.onreadystatechange = function () {
            if (r.readyState === 4 && !s) {
                if (!r.status && location.protocol === "file:" || r.status >= 200 && r.status < 300 || r.status === 304 || navigator.userAgent.indexOf("Safari") > -1 && typeof r.status === "undefined") {
                    t(r.responseText)
                } else {
                    n()
                }
                document.documentElement.style.cursor = "";
                r = null
            }
        };
        r.send("")
    };
    var l = function (t) {
        t = t.replace(e.REDUNDANT_COMPONENTS, "");
        t = t.replace(e.REDUNDANT_WHITESPACE, "$1");
        t = t.replace(e.WHITESPACE_IN_PARENTHESES, "($1)");
        t = t.replace(e.MORE_WHITESPACE, " ");
        t = t.replace(e.FINAL_SEMICOLONS, "}");
        return t
    };
    var c = {stylesheet: function (t) {
        var n = {};
        var r = [], i = [], s = [], o = [];
        var u = t.cssHelperText;
        var a = t.getAttribute("media");
        if (a) {
            var f = a.toLowerCase().split(",")
        } else {
            var f = ["all"]
        }
        for (var l = 0; l < f.length; l++) {
            r[r.length] = c.mediaQuery(f[l], n)
        }
        var h = u.match(e.BLOCKS);
        if (h !== null) {
            for (var l = 0; l < h.length; l++) {
                if (h[l].substring(0, 7) === "@media ") {
                    var p = c.mediaQueryList(h[l], n);
                    s = s.concat(p.getRules());
                    i[i.length] = p
                } else {
                    s[s.length] = o[o.length] = c.rule(h[l], n, null)
                }
            }
        }
        n.element = t;
        n.getCssText = function () {
            return u
        };
        n.getAttrMediaQueries = function () {
            return r
        };
        n.getMediaQueryLists = function () {
            return i
        };
        n.getRules = function () {
            return s
        };
        n.getRulesWithoutMQ = function () {
            return o
        };
        return n
    }, mediaQueryList: function (t, n) {
        var r = {};
        var i = t.indexOf("{");
        var s = t.substring(0, i);
        t = t.substring(i + 1, t.length - 1);
        var o = [], u = [];
        var a = s.toLowerCase().substring(7).split(",");
        for (var f = 0; f < a.length; f++) {
            o[o.length] = c.mediaQuery(a[f], r)
        }
        var l = t.match(e.BLOCKS_INSIDE);
        if (l !== null) {
            for (f = 0; f < l.length; f++) {
                u[u.length] = c.rule(l[f], n, r)
            }
        }
        r.type = "mediaQueryList";
        r.getMediaQueries = function () {
            return o
        };
        r.getRules = function () {
            return u
        };
        r.getListText = function () {
            return s
        };
        r.getCssText = function () {
            return t
        };
        return r
    }, mediaQuery: function (t, n) {
        t = t || "";
        var r, i;
        if (n.type === "mediaQueryList") {
            r = n
        } else {
            i = n
        }
        var s = false, o;
        var u = [];
        var a = true;
        var f = t.match(e.NOT_WHITESPACE);
        for (var l = 0; l < f.length; l++) {
            var c = f[l];
            if (!o && (c === "not" || c === "only")) {
                if (c === "not") {
                    s = true
                }
            } else if (!o) {
                o = c
            } else if (c.charAt(0) === "(") {
                var h = c.substring(1, c.length - 1).split(":");
                u[u.length] = {mediaFeature: h[0], value: h[1] || null}
            }
        }
        return{getQueryText: function () {
            return t
        }, getAttrStyleSheet: function () {
            return i || null
        }, getList: function () {
            return r || null
        }, getValid: function () {
            return a
        }, getNot: function () {
            return s
        }, getMediaType: function () {
            return o
        }, getExpressions: function () {
            return u
        }}
    }, rule: function (e, t, n) {
        var r = {};
        var i = e.indexOf("{");
        var s = e.substring(0, i);
        var o = s.split(",");
        var u = [];
        var a = e.substring(i + 1, e.length - 1).split(";");
        for (var f = 0; f < a.length; f++) {
            u[u.length] = c.declaration(a[f], r)
        }
        r.getStylesheet = function () {
            return t || null
        };
        r.getMediaQueryList = function () {
            return n || null
        };
        r.getSelectors = function () {
            return o
        };
        r.getSelectorText = function () {
            return s
        };
        r.getDeclarations = function () {
            return u
        };
        r.getPropertyValue = function (e) {
            for (var t = 0; t < u.length; t++) {
                if (u[t].getProperty() === e) {
                    return u[t].getValue()
                }
            }
            return null
        };
        return r
    }, declaration: function (e, t) {
        var n = e.indexOf(":");
        var r = e.substring(0, n);
        var i = e.substring(n + 1);
        return{getRule: function () {
            return t || null
        }, getProperty: function () {
            return r
        }, getValue: function () {
            return i
        }}
    }};
    var h = function (e) {
        if (typeof e.cssHelperText !== "string") {
            return
        }
        var n = {stylesheet: null, mediaQueryLists: [], rules: [], selectors: {}, declarations: [], properties: {}};
        var r = n.stylesheet = c.stylesheet(e);
        var s = n.mediaQueryLists = r.getMediaQueryLists();
        var o = n.rules = r.getRules();
        var u = n.selectors;
        var a = function (e) {
            var t = e.getSelectors();
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                if (!u[r]) {
                    u[r] = []
                }
                u[r][u[r].length] = e
            }
        };
        for (i = 0; i < o.length; i++) {
            a(o[i])
        }
        var f = n.declarations;
        for (i = 0; i < o.length; i++) {
            f = n.declarations = f.concat(o[i].getDeclarations())
        }
        var l = n.properties;
        for (i = 0; i < f.length; i++) {
            var h = f[i].getProperty();
            if (!l[h]) {
                l[h] = []
            }
            l[h][l[h].length] = f[i]
        }
        e.cssHelperParsed = n;
        t[t.length] = e;
        return n
    };
    var p = function (e, t) {
        return;
        e.cssHelperText = l(t || e.innerHTML);
        return h(e)
    };
    var d = function () {
        n = true;
        t = [];
        var r = [];
        var i = function () {
            for (var e = 0; e < r.length; e++) {
                h(r[e])
            }
            var t = document.getElementsByTagName("style");
            for (e = 0; e < t.length; e++) {
                p(t[e])
            }
            n = false;
            o()
        };
        var s = document.getElementsByTagName("link");
        for (var u = 0; u < s.length; u++) {
            var a = s[u];
            if (a.getAttribute("rel").indexOf("style") > -1 && a.href && a.href.length !== 0 && !a.disabled) {
                r[r.length] = a
            }
        }
        if (r.length > 0) {
            var c = 0;
            var d = function () {
                c++;
                if (c === r.length) {
                    i()
                }
            };
            var v = function (t) {
                var n = t.href;
                f(n, function (r) {
                    r = l(r).replace(e.RELATIVE_URLS, "url(" + n.substring(0, n.lastIndexOf("/")) + "/$1)");
                    t.cssHelperText = r;
                    d()
                }, d)
            };
            for (u = 0; u < r.length; u++) {
                v(r[u])
            }
        } else {
            i()
        }
    };
    var v = {stylesheets: "array", mediaQueryLists: "array", rules: "array", selectors: "object", declarations: "array", properties: "object"};
    var m = {stylesheets: null, mediaQueryLists: null, rules: null, selectors: null, declarations: null, properties: null};
    var g = function (e, t) {
        if (m[e] !== null) {
            if (v[e] === "array") {
                return m[e] = m[e].concat(t)
            } else {
                var n = m[e];
                for (var r in t) {
                    if (t.hasOwnProperty(r)) {
                        if (!n[r]) {
                            n[r] = t[r]
                        } else {
                            n[r] = n[r].concat(t[r])
                        }
                    }
                }
                return n
            }
        }
    };
    var y = function (e) {
        m[e] = v[e] === "array" ? [] : {};
        for (var n = 0; n < t.length; n++) {
            var r = e === "stylesheets" ? "stylesheet" : e;
            g(e, t[n].cssHelperParsed[r])
        }
        return m[e]
    };
    var b = function (e) {
        if (typeof window.innerWidth != "undefined") {
            return window["inner" + e]
        } else if (typeof document.documentElement !== "undefined" && typeof document.documentElement.clientWidth !== "undefined" && document.documentElement.clientWidth != 0) {
            return document.documentElement["client" + e]
        }
    };
    return{addStyle: function (e, t, n) {
        var r = document.createElement("style");
        r.setAttribute("type", "text/css");
        if (t && t.length > 0) {
            r.setAttribute("media", t.join(","))
        }
        document.getElementsByTagName("head")[0].appendChild(r);
        if (r.styleSheet) {
            r.styleSheet.cssText = e
        } else {
            r.appendChild(document.createTextNode(e))
        }
        r.addedWithCssHelper = true;
        if (typeof n === "undefined" || n === true) {
            cssHelper.parsed(function (t) {
                var n = p(r, e);
                for (var i in n) {
                    if (n.hasOwnProperty(i)) {
                        g(i, n[i])
                    }
                }
                a("newStyleParsed", r)
            })
        } else {
            r.parsingDisallowed = true
        }
        return r
    }, removeStyle: function (e) {
        return e.parentNode.removeChild(e)
    }, parsed: function (e) {
        if (n) {
            s(e)
        } else {
            if (typeof t !== "undefined") {
                if (typeof e === "function") {
                    e(t)
                }
            } else {
                s(e);
                d()
            }
        }
    }, stylesheets: function (e) {
        cssHelper.parsed(function (t) {
            e(m.stylesheets || y("stylesheets"))
        })
    }, mediaQueryLists: function (e) {
        cssHelper.parsed(function (t) {
            e(m.mediaQueryLists || y("mediaQueryLists"))
        })
    }, rules: function (e) {
        cssHelper.parsed(function (t) {
            e(m.rules || y("rules"))
        })
    }, selectors: function (e) {
        cssHelper.parsed(function (t) {
            e(m.selectors || y("selectors"))
        })
    }, declarations: function (e) {
        cssHelper.parsed(function (t) {
            e(m.declarations || y("declarations"))
        })
    }, properties: function (e) {
        cssHelper.parsed(function (t) {
            e(m.properties || y("properties"))
        })
    }, broadcast: a, addListener: function (e, t) {
        if (typeof t === "function") {
            if (!u[e]) {
                u[e] = {listeners: []}
            }
            u[e].listeners[u[e].listeners.length] = t
        }
    }, removeListener: function (e, t) {
        if (typeof t === "function" && u[e]) {
            var n = u[e].listeners;
            for (var r = 0; r < n.length; r++) {
                if (n[r] === t) {
                    n.splice(r, 1);
                    r -= 1
                }
            }
        }
    }, getViewportWidth: function () {
        return b("Width")
    }, getViewportHeight: function () {
        return b("Height")
    }}
}();
domReady(function () {
    var t;
    var n = {LENGTH_UNIT: /[0-9]+(em|ex|px|in|cm|mm|pt|pc)$/, RESOLUTION_UNIT: /[0-9]+(dpi|dpcm)$/, ASPECT_RATIO: /^[0-9]+\/[0-9]+$/, ABSOLUTE_VALUE: /^[0-9]*(\.[0-9]+)*$/};
    var r = [];
    var i = function () {
        var e = "css3-mediaqueries-test";
        var t = document.createElement("div");
        t.id = e;
        var n = cssHelper.addStyle("@media all and (width) { #" + e + " { width: 1px !important; } }", [], false);
        document.body.appendChild(t);
        var r = t.offsetWidth === 1;
        n.parentNode.removeChild(n);
        t.parentNode.removeChild(t);
        i = function () {
            return r
        };
        return r
    };
    var s = function () {
        t = document.createElement("div");
        t.style.cssText = "position:absolute;top:-9999em;left:-9999em;" + "margin:0;border:none;padding:0;width:1em;font-size:1em;";
        document.body.appendChild(t);
        if (t.offsetWidth !== 16) {
            t.style.fontSize = 16 / t.offsetWidth + "em"
        }
        t.style.width = ""
    };
    var o = function (e) {
        t.style.width = e;
        var n = t.offsetWidth;
        t.style.width = "";
        return n
    };
    var u = function (e, t) {
        var r = e.length;
        var i = e.substring(0, 4) === "min-";
        var s = !i && e.substring(0, 4) === "max-";
        if (t !== null) {
            var u;
            var a;
            if (n.LENGTH_UNIT.exec(t)) {
                u = "length";
                a = o(t)
            } else if (n.RESOLUTION_UNIT.exec(t)) {
                u = "resolution";
                a = parseInt(t, 10);
                var f = t.substring((a + "").length)
            } else if (n.ASPECT_RATIO.exec(t)) {
                u = "aspect-ratio";
                a = t.split("/")
            } else if (n.ABSOLUTE_VALUE) {
                u = "absolute";
                a = t
            } else {
                u = "unknown"
            }
        }
        var l, c;
        if ("device-width" === e.substring(r - 12, r)) {
            l = screen.width;
            if (t !== null) {
                if (u === "length") {
                    return i && l >= a || s && l < a || !i && !s && l === a
                } else {
                    return false
                }
            } else {
                return l > 0
            }
        } else if ("device-height" === e.substring(r - 13, r)) {
            c = screen.height;
            if (t !== null) {
                if (u === "length") {
                    return i && c >= a || s && c < a || !i && !s && c === a
                } else {
                    return false
                }
            } else {
                return c > 0
            }
        } else if ("width" === e.substring(r - 5, r)) {
            l = document.documentElement.clientWidth || document.body.clientWidth;
            if (t !== null) {
                if (u === "length") {
                    return i && l >= a || s && l < a || !i && !s && l === a
                } else {
                    return false
                }
            } else {
                return l > 0
            }
        } else if ("height" === e.substring(r - 6, r)) {
            c = document.documentElement.clientHeight || document.body.clientHeight;
            if (t !== null) {
                if (u === "length") {
                    return i && c >= a || s && c < a || !i && !s && c === a
                } else {
                    return false
                }
            } else {
                return c > 0
            }
        } else if ("device-aspect-ratio" === e.substring(r - 19, r)) {
            return u === "aspect-ratio" && screen.width * a[1] === screen.height * a[0]
        } else if ("color-index" === e.substring(r - 11, r)) {
            var h = Math.pow(2, screen.colorDepth);
            if (t !== null) {
                if (u === "absolute") {
                    return i && h >= a || s && h < a || !i && !s && h === a
                } else {
                    return false
                }
            } else {
                return h > 0
            }
        } else if ("color" === e.substring(r - 5, r)) {
            var p = screen.colorDepth;
            if (t !== null) {
                if (u === "absolute") {
                    return i && p >= a || s && p < a || !i && !s && p === a
                } else {
                    return false
                }
            } else {
                return p > 0
            }
        } else if ("resolution" === e.substring(r - 10, r)) {
            var d;
            if (f === "dpcm") {
                d = o("1cm")
            } else {
                d = o("1in")
            }
            if (t !== null) {
                if (u === "resolution") {
                    return i && d >= a || s && d < a || !i && !s && d === a
                } else {
                    return false
                }
            } else {
                return d > 0
            }
        } else {
            return false
        }
    };
    var a = function (e) {
        var t = e.getValid();
        var n = e.getExpressions();
        var r = n.length;
        if (r > 0) {
            for (var i = 0; i < r && t; i++) {
                t = u(n[i].mediaFeature, n[i].value)
            }
            var s = e.getNot();
            return t && !s || s && !t
        }
        return t
    };
    var f = function (e, t) {
        var n = e.getMediaQueries();
        var i = {};
        for (var s = 0; s < n.length; s++) {
            var o = n[s].getMediaType();
            if (n[s].getExpressions().length === 0) {
                continue
            }
            var u = true;
            if (o !== "all" && t && t.length > 0) {
                u = false;
                for (var f = 0; f < t.length; f++) {
                    if (t[f] === o) {
                        u = true
                    }
                }
            }
            if (u && a(n[s])) {
                i[o] = true
            }
        }
        var l = [], c = 0;
        for (var h in i) {
            if (i.hasOwnProperty(h)) {
                if (c > 0) {
                    l[c++] = ","
                }
                l[c++] = h
            }
        }
        if (l.length > 0) {
            r[r.length] = cssHelper.addStyle("@media " + l.join("") + "{" + e.getCssText() + "}", t, false)
        }
    };
    var l = function (e, t) {
        for (var n = 0; n < e.length; n++) {
            f(e[n], t)
        }
    };
    var c = function (e) {
        var t = e.getAttrMediaQueries();
        var n = false;
        var i = {};
        for (var s = 0; s < t.length; s++) {
            if (a(t[s])) {
                i[t[s].getMediaType()] = t[s].getExpressions().length > 0
            }
        }
        var o = [], u = [];
        for (var f in i) {
            if (i.hasOwnProperty(f)) {
                o[o.length] = f;
                if (i[f]) {
                    u[u.length] = f
                }
                if (f === "all") {
                    n = true
                }
            }
        }
        if (u.length > 0) {
            r[r.length] = cssHelper.addStyle(e.getCssText(), u, false)
        }
        var c = e.getMediaQueryLists();
        if (n) {
            l(c)
        } else {
            l(c, o)
        }
    };
    var h = function (e) {
        for (var t = 0; t < e.length; t++) {
            c(e[t])
        }
        if (ua.ie) {
            document.documentElement.style.display = "block";
            setTimeout(function () {
                document.documentElement.style.display = ""
            }, 0);
            setTimeout(function () {
                cssHelper.broadcast("cssMediaQueriesTested")
            }, 100)
        } else {
            cssHelper.broadcast("cssMediaQueriesTested")
        }
    };
    var p = function () {
        for (var e = 0; e < r.length; e++) {
            cssHelper.removeStyle(r[e])
        }
        r = [];
        cssHelper.stylesheets(h)
    };
    var d = 0;
    var v = function () {
        var e = cssHelper.getViewportWidth();
        var t = cssHelper.getViewportHeight();
        if (ua.ie) {
            var n = document.createElement("div");
            n.style.position = "absolute";
            n.style.top = "-9999em";
            n.style.overflow = "scroll";
            document.body.appendChild(n);
            d = n.offsetWidth - n.clientWidth;
            document.body.removeChild(n)
        }
        var r;
        var s = function () {
            var n = cssHelper.getViewportWidth();
            var s = cssHelper.getViewportHeight();
            if (Math.abs(n - e) > d || Math.abs(s - t) > d) {
                e = n;
                t = s;
                clearTimeout(r);
                r = setTimeout(function () {
                    if (!i()) {
                        p()
                    } else {
                        cssHelper.broadcast("cssMediaQueriesTested")
                    }
                }, 500)
            }
        };
        window.onresize = function () {
            var e = window.onresize || function () {
            };
            return function () {
                e();
                s()
            }
        }()
    };
    var m = document.documentElement;
    m.style.marginLeft = "-32767px";
    setTimeout(function () {
        m.style.marginLeft = ""
    }, 5e3);
    return function () {
        if (!i()) {
            cssHelper.addListener("newStyleParsed", function (e) {
                c(e.cssHelperParsed.stylesheet)
            });
            cssHelper.addListener("cssMediaQueriesTested", function () {
                if (ua.ie) {
                    m.style.width = "1px"
                }
                setTimeout(function () {
                    m.style.width = "";
                    m.style.marginLeft = ""
                }, 0);
                cssHelper.removeListener("cssMediaQueriesTested", arguments.callee)
            });
            s();
            p()
        } else {
            m.style.marginLeft = ""
        }
        v()
    }
}());
try {
    document.execCommand("BackgroundImageCache", false, true)
} catch (e) {
}
(function ($) {
    "use strict";
    var defaultOptions = {tagClass: function (item) {
        return'label label-info';
    }, itemValue: function (item) {
        return item ? item.toString() : item;
    }, itemText: function (item) {
        return this.itemValue(item);
    }, freeInput: true, addOnBlur: true, maxTags: undefined, maxChars: undefined, confirmKeys: [13, 44], onTagExists: function (item, $tag) {
        $tag.hide().fadeIn();
    }, trimValue: false, allowDuplicates: false};

    function TagsInput(element, options) {
        this.itemsArray = [];
        this.$element = $(element);
        this.$element.hide();
        this.isSelect = (element.tagName === 'SELECT');
        this.multiple = (this.isSelect && element.hasAttribute('multiple'));
        this.objectItems = options && options.itemValue;
        this.placeholderText = element.hasAttribute('placeholder') ? this.$element.attr('placeholder') : '';
        this.inputSize = Math.max(1, this.placeholderText.length);
        this.$container = $('<div class="bootstrap-tagsinput"></div>');
        this.$input = $('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);
        this.$element.after(this.$container);
        var inputWidth = (this.inputSize < 3 ? 3 : this.inputSize) + "em";
        this.$input.get(0).style.cssText = "width: " + inputWidth + " !important;";
        this.build(options);
    }

    TagsInput.prototype = {constructor: TagsInput, add: function (item, dontPushVal) {
        var self = this;
        if (self.options.maxTags && self.itemsArray.length >= self.options.maxTags)
            return;
        if (item !== false && !item)
            return;
        if (typeof item === "string" && self.options.trimValue) {
            item = $.trim(item);
        }
        if (typeof item === "object" && !self.objectItems)
            throw("Can't add objects when itemValue option is not set");
        if (item.toString().match(/^\s*$/))
            return;
        if (self.isSelect && !self.multiple && self.itemsArray.length > 0)
            self.remove(self.itemsArray[0]);
        if (typeof item === "string" && this.$element[0].tagName === 'INPUT') {
            var items = item.split(',');
            if (items.length > 1) {
                for (var i = 0; i < items.length; i++) {
                    this.add(items[i], true);
                }
                if (!dontPushVal)
                    self.pushVal();
                return;
            }
        }
        var itemValue = self.options.itemValue(item), itemText = self.options.itemText(item), tagClass = self.options.tagClass(item);
        var existing = $.grep(self.itemsArray, function (item) {
            return self.options.itemValue(item) === itemValue;
        })[0];
        if (existing && !self.options.allowDuplicates) {
            if (self.options.onTagExists) {
                var $existingTag = $(".tag", self.$container).filter(function () {
                    return $(this).data("item") === existing;
                });
                self.options.onTagExists(item, $existingTag);
            }
            return;
        }
        if (self.items().toString().length + item.length + 1 > self.options.maxInputLength)
            return;
        var beforeItemAddEvent = $.Event('beforeItemAdd', {item: item, cancel: false});
        self.$element.trigger(beforeItemAddEvent);
        if (beforeItemAddEvent.cancel)
            return;
        self.itemsArray.push(item);
        var $tag = $('<span class="tag ' + htmlEncode(tagClass) + '">' + htmlEncode(itemText) + '<span data-role="remove"></span></span>');
        $tag.data('item', item);
        self.findInputWrapper().before($tag);
        $tag.after(' ');
        if (self.isSelect && !$('option[value="' + encodeURIComponent(itemValue) + '"]', self.$element)[0]) {
            var $option = $('<option selected>' + htmlEncode(itemText) + '</option>');
            $option.data('item', item);
            $option.attr('value', itemValue);
            self.$element.append($option);
        }
        if (!dontPushVal)
            self.pushVal();
        if (self.options.maxTags === self.itemsArray.length || self.items().toString().length === self.options.maxInputLength)
            self.$container.addClass('bootstrap-tagsinput-max');
        self.$element.trigger($.Event('itemAdded', {item: item}));
    }, remove: function (item, dontPushVal) {
        var self = this;
        if (self.objectItems) {
            if (typeof item === "object")
                item = $.grep(self.itemsArray, function (other) {
                    return self.options.itemValue(other) == self.options.itemValue(item);
                }); else
                item = $.grep(self.itemsArray, function (other) {
                    return self.options.itemValue(other) == item;
                });
            item = item[item.length - 1];
        }
        if (item) {
            var beforeItemRemoveEvent = $.Event('beforeItemRemove', {item: item, cancel: false});
            self.$element.trigger(beforeItemRemoveEvent);
            if (beforeItemRemoveEvent.cancel)
                return;
            $('.tag', self.$container).filter(function () {
                return $(this).data('item') === item;
            }).remove();
            $('option', self.$element).filter(function () {
                return $(this).data('item') === item;
            }).remove();
            if ($.inArray(item, self.itemsArray) !== -1)
                self.itemsArray.splice($.inArray(item, self.itemsArray), 1);
        }
        if (!dontPushVal)
            self.pushVal();
        if (self.options.maxTags > self.itemsArray.length)
            self.$container.removeClass('bootstrap-tagsinput-max');
        self.$element.trigger($.Event('itemRemoved', {item: item}));
    }, removeAll: function () {
        var self = this;
        $('.tag', self.$container).remove();
        $('option', self.$element).remove();
        while (self.itemsArray.length > 0)
            self.itemsArray.pop();
        self.pushVal();
    }, refresh: function () {
        var self = this;
        $('.tag', self.$container).each(function () {
            var $tag = $(this), item = $tag.data('item'), itemValue = self.options.itemValue(item), itemText = self.options.itemText(item), tagClass = self.options.tagClass(item);
            $tag.attr('class', null);
            $tag.addClass('tag ' + htmlEncode(tagClass));
            $tag.contents().filter(function () {
                return this.nodeType == 3;
            })[0].nodeValue = htmlEncode(itemText);
            if (self.isSelect) {
                var option = $('option', self.$element).filter(function () {
                    return $(this).data('item') === item;
                });
                option.attr('value', itemValue);
            }
        });
    }, items: function () {
        return this.itemsArray;
    }, pushVal: function () {
        var self = this, val = $.map(self.items(), function (item) {
            return self.options.itemValue(item).toString();
        });
        self.$element.val(val, true).trigger('change');
    }, build: function (options) {
        var self = this;
        self.options = $.extend({}, defaultOptions, options);
        if (self.objectItems)
            self.options.freeInput = false;
        makeOptionItemFunction(self.options, 'itemValue');
        makeOptionItemFunction(self.options, 'itemText');
        makeOptionFunction(self.options, 'tagClass');
        if (self.options.typeahead) {
            var typeahead = self.options.typeahead || {};
            makeOptionFunction(typeahead, 'source');
            self.$input.typeahead($.extend({}, typeahead, {source: function (query, process) {
                function processItems(items) {
                    var texts = [];
                    for (var i = 0; i < items.length; i++) {
                        var text = self.options.itemText(items[i]);
                        map[text] = items[i];
                        texts.push(text);
                    }
                    process(texts);
                }

                this.map = {};
                var map = this.map, data = typeahead.source(query);
                if ($.isFunction(data.success)) {
                    data.success(processItems);
                } else if ($.isFunction(data.then)) {
                    data.then(processItems);
                } else {
                    $.when(data).then(processItems);
                }
            }, updater: function (text) {
                self.add(this.map[text]);
            }, matcher: function (text) {
                return(text.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1);
            }, sorter: function (texts) {
                return texts.sort();
            }, highlighter: function (text) {
                var regex = new RegExp('(' + this.query + ')', 'gi');
                return text.replace(regex, "<strong>$1</strong>");
            }}));
        }
        if (self.options.typeaheadjs) {
            var typeaheadjs = self.options.typeaheadjs || {};
            self.$input.typeahead(null, typeaheadjs).on('typeahead:selected', $.proxy(function (obj, datum) {
                if (typeaheadjs.valueKey)
                    self.add(datum[typeaheadjs.valueKey]); else
                    self.add(datum);
                self.$input.typeahead('val', '');
            }, self));
        }
        self.$container.on('click', $.proxy(function (event) {
            if (!self.$element.attr('disabled')) {
                self.$input.removeAttr('disabled');
            }
            self.$input.focus();
        }, self));
        if (self.options.addOnBlur && self.options.freeInput) {
            self.$input.on('focusout', $.proxy(function (event) {
                if ($('.typeahead, .twitter-typeahead', self.$container).length === 0) {
                    self.add(self.$input.val());
                    self.$input.val('');
                }
            }, self));
        }
        self.$container.on('keydown', 'input', $.proxy(function (event) {
            var $input = $(event.target), $inputWrapper = self.findInputWrapper();
            if (self.$element.attr('disabled')) {
                self.$input.attr('disabled', 'disabled');
                return;
            }
            switch (event.which) {
                case 8:
                    if (doGetCaretPosition($input[0]) === 0) {
                        var prev = $inputWrapper.prev();
                        if (prev) {
                            self.remove(prev.data('item'));
                        }
                    }
                    break;
                case 46:
                    if (doGetCaretPosition($input[0]) === 0) {
                        var next = $inputWrapper.next();
                        if (next) {
                            self.remove(next.data('item'));
                        }
                    }
                    break;
                case 37:
                    var $prevTag = $inputWrapper.prev();
                    if ($input.val().length === 0 && $prevTag[0]) {
                        $prevTag.before($inputWrapper);
                        $input.focus();
                    }
                    break;
                case 39:
                    var $nextTag = $inputWrapper.next();
                    if ($input.val().length === 0 && $nextTag[0]) {
                        $nextTag.after($inputWrapper);
                        $input.focus();
                    }
                    break;
                default:
            }
            var textLength = $input.val().length, wordSpace = Math.ceil(textLength / 5), size = textLength + wordSpace + 1;
            $input.attr('size', Math.max(this.inputSize, $input.val().length));
        }, self));
        self.$container.on('keypress', 'input', $.proxy(function (event) {
            var $input = $(event.target);
            if (self.$element.attr('disabled')) {
                self.$input.attr('disabled', 'disabled');
                return;
            }
            var text = $input.val(), maxLengthReached = self.options.maxChars && text.length >= self.options.maxChars;
            if (self.options.freeInput && (keyCombinationInList(event, self.options.confirmKeys) || maxLengthReached)) {
                self.add(maxLengthReached ? text.substr(0, self.options.maxChars) : text);
                $input.val('');
                event.preventDefault();
            }
            var textLength = $input.val().length, wordSpace = Math.ceil(textLength / 5), size = textLength + wordSpace + 1;
            $input.attr('size', Math.max(this.inputSize, $input.val().length));
        }, self));
        self.$container.on('click', '[data-role=remove]', $.proxy(function (event) {
            if (self.$element.attr('disabled')) {
                return;
            }
            self.remove($(event.target).closest('.tag').data('item'));
        }, self));
        if (self.options.itemValue === defaultOptions.itemValue) {
            if (self.$element[0].tagName === 'INPUT') {
                self.add(self.$element.val());
            } else {
                $('option', self.$element).each(function () {
                    self.add($(this).attr('value'), true);
                });
            }
        }
    }, destroy: function () {
        var self = this;
        self.$container.off('keypress', 'input');
        self.$container.off('click', '[role=remove]');
        self.$container.remove();
        self.$element.removeData('tagsinput');
        self.$element.show();
    }, focus: function () {
        this.$input.focus();
    }, input: function () {
        return this.$input;
    }, findInputWrapper: function () {
        var elt = this.$input[0], container = this.$container[0];
        while (elt && elt.parentNode !== container)
            elt = elt.parentNode;
        return $(elt);
    }};
    $.fn.tagsinput = function (arg1, arg2) {
        var results = [];
        this.each(function () {
            var tagsinput = $(this).data('tagsinput');
            if (!tagsinput) {
                tagsinput = new TagsInput(this, arg1);
                $(this).data('tagsinput', tagsinput);
                results.push(tagsinput);
                if (this.tagName === 'SELECT') {
                    $('option', $(this)).attr('selected', 'selected');
                }
                $(this).val($(this).val());
            } else if (!arg1 && !arg2) {
                results.push(tagsinput);
            } else if (tagsinput[arg1] !== undefined) {
                var retVal = tagsinput[arg1](arg2);
                if (retVal !== undefined)
                    results.push(retVal);
            }
        });
        if (typeof arg1 == 'string') {
            return results.length > 1 ? results : results[0];
        } else {
            return results;
        }
    };
    $.fn.tagsinput.Constructor = TagsInput;
    function makeOptionItemFunction(options, key) {
        if (typeof options[key] !== 'function') {
            var propertyName = options[key];
            options[key] = function (item) {
                return item[propertyName];
            };
        }
    }

    function makeOptionFunction(options, key) {
        if (typeof options[key] !== 'function') {
            var value = options[key];
            options[key] = function () {
                return value;
            };
        }
    }

    var htmlEncodeContainer = $('<div />');

    function htmlEncode(value) {
        if (value) {
            return htmlEncodeContainer.text(value).html();
        } else {
            return'';
        }
    }

    function doGetCaretPosition(oField) {
        var iCaretPos = 0;
        if (document.selection) {
            oField.focus();
            var oSel = document.selection.createRange();
            oSel.moveStart('character', -oField.value.length);
            iCaretPos = oSel.text.length;
        } else if (oField.selectionStart || oField.selectionStart == '0') {
            iCaretPos = oField.selectionStart;
        }
        return(iCaretPos);
    }

    function keyCombinationInList(keyPressEvent, lookupList) {
        var found = false;
        $.each(lookupList, function (index, keyCombination) {
            if (typeof(keyCombination) === 'number' && keyPressEvent.which === keyCombination) {
                found = true;
                return false;
            }
            if (keyPressEvent.which === keyCombination.which) {
                var alt = !keyCombination.hasOwnProperty('altKey') || keyPressEvent.altKey === keyCombination.altKey, shift = !keyCombination.hasOwnProperty('shiftKey') || keyPressEvent.shiftKey === keyCombination.shiftKey, ctrl = !keyCombination.hasOwnProperty('ctrlKey') || keyPressEvent.ctrlKey === keyCombination.ctrlKey;
                if (alt && shift && ctrl) {
                    found = true;
                    return false;
                }
            }
        });
        return found;
    }

    $(function () {
        $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
    });
})(window.jQuery);
(function ($, window, document, undefined) {
    var defaults = {bounds: true, country: null, map: false, details: false, detailsAttribute: "name", autoselect: true, location: false, mapOptions: {zoom: 14, scrollwheel: false, mapTypeId: "roadmap"}, markerOptions: {draggable: false}, maxZoom: 16, types: ["geocode"], blur: false, geocodeAfterResult: false, restoreValueAfterBlur: false};
    var componentTypes = ("street_address route intersection political " + "country administrative_area_level_1 administrative_area_level_2 " + "administrative_area_level_3 colloquial_area locality sublocality " + "neighborhood premise subpremise postal_code natural_feature airport " + "park point_of_interest post_box street_number floor room " + "lat lng viewport location " + "formatted_address location_type bounds").split(" ");
    var placesDetails = ("id place_id url website vicinity reference name rating " + "international_phone_number icon formatted_phone_number").split(" ");

    function GeoComplete(input, options) {
        this.options = $.extend(true, {}, defaults, options);
        this.input = input;
        this.$input = $(input);
        this._defaults = defaults;
        this._name = "geocomplete";
        this.init()
    }

    $.extend(GeoComplete.prototype, {init: function () {
        this.initMap();
        this.initMarker();
        this.initGeocoder();
        this.initDetails();
        this.initLocation()
    }, initMap: function () {
        if (!this.options.map) {
            return
        }
        if (typeof this.options.map.setCenter == "function") {
            this.map = this.options.map;
            return
        }
        this.map = new google.maps.Map($(this.options.map)[0], this.options.mapOptions);
        google.maps.event.addListener(this.map, "click", $.proxy(this.mapClicked, this));
        google.maps.event.addListener(this.map, "zoom_changed", $.proxy(this.mapZoomed, this))
    }, initMarker: function () {
        if (!this.map) {
            return
        }
        var options = $.extend(this.options.markerOptions, {map: this.map});
        if (options.disabled) {
            return
        }
        this.marker = new google.maps.Marker(options);
        google.maps.event.addListener(this.marker, "dragend", $.proxy(this.markerDragged, this))
    }, initGeocoder: function () {
        var selected = false;
        var options = {types: this.options.types, bounds: this.options.bounds === true ? null : this.options.bounds, componentRestrictions: this.options.componentRestrictions};
        if (this.options.country) {
            options.componentRestrictions = {country: this.options.country}
        }
        this.autocomplete = new google.maps.places.Autocomplete(this.input, options);
        this.geocoder = new google.maps.Geocoder;
        if (this.map && this.options.bounds === true) {
            this.autocomplete.bindTo("bounds", this.map)
        }
        google.maps.event.addListener(this.autocomplete, "place_changed", $.proxy(this.placeChanged, this));
        this.$input.on("keypress." + this._name, function (event) {
            if (event.keyCode === 13) {
                return false
            }
        });
        if (this.options.geocodeAfterResult === true) {
            this.$input.bind("keypress." + this._name, $.proxy(function () {
                if (event.keyCode != 9 && this.selected === true) {
                    this.selected = false
                }
            }, this))
        }
        this.$input.bind("geocode." + this._name, $.proxy(function () {
            this.find()
        }, this));
        this.$input.bind("geocode:result." + this._name, $.proxy(function () {
            this.lastInputVal = this.$input.val()
        }, this));
        if (this.options.blur === true) {
            this.$input.on("blur." + this._name, $.proxy(function () {
                if (this.options.geocodeAfterResult === true && this.selected === true) {
                    return
                }
                if (this.options.restoreValueAfterBlur === true && this.selected === true) {
                    setTimeout($.proxy(this.restoreLastValue, this), 0)
                } else {
                    this.find()
                }
            }, this))
        }
    }, initDetails: function () {
        if (!this.options.details) {
            return
        }
        var $details = $(this.options.details), attribute = this.options.detailsAttribute, details = {};

        function setDetail(value) {
            details[value] = $details.find("[" + attribute + "=" + value + "]")
        }

        $.each(componentTypes, function (index, key) {
            setDetail(key);
            setDetail(key + "_short")
        });
        $.each(placesDetails, function (index, key) {
            setDetail(key)
        });
        this.$details = $details;
        this.details = details
    }, initLocation: function () {
        var location = this.options.location, latLng;
        if (!location) {
            return
        }
        if (typeof location == "string") {
            this.find(location);
            return
        }
        if (location instanceof Array) {
            latLng = new google.maps.LatLng(location[0], location[1])
        }
        if (location instanceof google.maps.LatLng) {
            latLng = location
        }
        if (latLng) {
            if (this.map) {
                this.map.setCenter(latLng)
            }
            if (this.marker) {
                this.marker.setPosition(latLng)
            }
        }
    }, destroy: function () {
        if (this.map) {
            google.maps.event.clearInstanceListeners(this.map);
            google.maps.event.clearInstanceListeners(this.marker)
        }
        this.autocomplete.unbindAll();
        google.maps.event.clearInstanceListeners(this.autocomplete);
        google.maps.event.clearInstanceListeners(this.input);
        this.$input.removeData();
        this.$input.off(this._name);
        this.$input.unbind("." + this._name)
    }, find: function (address) {
        this.geocode({address: address || this.$input.val()})
    }, geocode: function (request) {
        if (this.options.bounds && !request.bounds) {
            if (this.options.bounds === true) {
                request.bounds = this.map && this.map.getBounds()
            } else {
                request.bounds = this.options.bounds
            }
        }
        if (this.options.country) {
            request.region = this.options.country
        }
        this.geocoder.geocode(request, $.proxy(this.handleGeocode, this))
    }, selectFirstResult: function () {
        var selected = "";
        if ($(".pac-item-selected")[0]) {
            selected = "-selected"
        }
        var $span1 = $(".pac-container:last .pac-item" + selected + ":first span:nth-child(2)").text();
        var $span2 = $(".pac-container:last .pac-item" + selected + ":first span:nth-child(3)").text();
        var firstResult = $span1;
        if ($span2) {
            firstResult += " - " + $span2
        }
        this.$input.val(firstResult);
        return firstResult
    }, restoreLastValue: function () {
        if (this.lastInputVal) {
            this.$input.val(this.lastInputVal)
        }
    }, handleGeocode: function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var result = results[0];
            this.$input.val(result.formatted_address);
            this.update(result);
            if (results.length > 1) {
                this.trigger("geocode:multiple", results)
            }
        } else {
            this.trigger("geocode:error", status)
        }
    }, trigger: function (event, argument) {
        this.$input.trigger(event, [argument])
    }, center: function (geometry) {
        if (geometry.viewport) {
            this.map.fitBounds(geometry.viewport);
            if (this.map.getZoom() > this.options.maxZoom) {
                this.map.setZoom(this.options.maxZoom)
            }
        } else {
            this.map.setZoom(this.options.maxZoom);
            this.map.setCenter(geometry.location)
        }
        if (this.marker) {
            this.marker.setPosition(geometry.location);
            this.marker.setAnimation(this.options.markerOptions.animation)
        }
    }, update: function (result) {
        if (this.map) {
            this.center(result.geometry)
        }
        if (this.$details) {
            this.fillDetails(result)
        }
        this.trigger("geocode:result", result)
    }, fillDetails: function (result) {
        var data = {}, geometry = result.geometry, viewport = geometry.viewport, bounds = geometry.bounds;
        $.each(result.address_components, function (index, object) {
            var name = object.types[0];
            $.each(object.types, function (index, name) {
                data[name] = object.long_name;
                data[name + "_short"] = object.short_name
            })
        });
        $.each(placesDetails, function (index, key) {
            data[key] = result[key]
        });
        $.extend(data, {formatted_address: result.formatted_address, location_type: geometry.location_type || "PLACES", viewport: viewport, bounds: bounds, location: geometry.location, lat: geometry.location.lat(), lng: geometry.location.lng()});
        $.each(this.details, $.proxy(function (key, $detail) {
            var value = data[key];
            this.setDetail($detail, value)
        }, this));
        this.data = data
    }, setDetail: function ($element, value) {
        if (value === undefined) {
            value = ""
        } else if (typeof value.toUrlValue == "function") {
            value = value.toUrlValue()
        }
        if ($element.is(":input")) {
            $element.val(value)
        } else {
            $element.text(value)
        }
    }, markerDragged: function (event) {
        this.trigger("geocode:dragged", event.latLng)
    }, mapClicked: function (event) {
        this.trigger("geocode:click", event.latLng)
    }, mapZoomed: function (event) {
        this.trigger("geocode:zoom", this.map.getZoom())
    }, resetMarker: function () {
        this.marker.setPosition(this.data.location);
        this.setDetail(this.details.lat, this.data.location.lat());
        this.setDetail(this.details.lng, this.data.location.lng())
    }, placeChanged: function () {
        var place = this.autocomplete.getPlace();
        this.selected = true;
        if (!place.geometry) {
            if (this.options.autoselect) {
                var autoSelection = this.selectFirstResult();
                this.find(autoSelection)
            }
        } else {
            this.update(place)
        }
    }});
    $.fn.geocomplete = function (options) {
        var attribute = "plugin_geocomplete";
        if (typeof options == "string") {
            var instance = $(this).data(attribute) || $(this).geocomplete().data(attribute), prop = instance[options];
            if (typeof prop == "function") {
                prop.apply(instance, Array.prototype.slice.call(arguments, 1));
                return $(this)
            } else {
                if (arguments.length == 2) {
                    prop = arguments[1]
                }
                return prop
            }
        } else {
            return this.each(function () {
                var instance = $.data(this, attribute);
                if (!instance) {
                    instance = new GeoComplete(this, options);
                    $.data(this, attribute, instance)
                }
            })
        }
    }
})(jQuery, window, document);