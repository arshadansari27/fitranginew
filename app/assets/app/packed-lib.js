!function (a, b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function (a) {
        if (!a.document)throw new Error("jQuery requires a window with a document");
        return b(a)
    } : b(a)
}("undefined" != typeof window ? window : this, function (a, b) {
    var c = [], d = c.slice, e = c.concat, f = c.push, g = c.indexOf, h = {}, i = h.toString, j = h.hasOwnProperty, k = {}, l = "1.11.2", m = function (a, b) {
        return new m.fn.init(a, b)
    }, n = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, o = /^-ms-/, p = /-([\da-z])/gi, q = function (a, b) {
        return b.toUpperCase()
    };
    m.fn = m.prototype = {jquery: l, constructor: m, selector: "", length: 0, toArray: function () {
        return d.call(this)
    }, get: function (a) {
        return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
    }, pushStack: function (a) {
        var b = m.merge(this.constructor(), a);
        return b.prevObject = this, b.context = this.context, b
    }, each: function (a, b) {
        return m.each(this, a, b)
    }, map: function (a) {
        return this.pushStack(m.map(this, function (b, c) {
            return a.call(b, c, b)
        }))
    }, slice: function () {
        return this.pushStack(d.apply(this, arguments))
    }, first: function () {
        return this.eq(0)
    }, last: function () {
        return this.eq(-1)
    }, eq: function (a) {
        var b = this.length, c = +a + (0 > a ? b : 0);
        return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
    }, end: function () {
        return this.prevObject || this.constructor(null)
    }, push: f, sort: c.sort, splice: c.splice}, m.extend = m.fn.extend = function () {
        var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
        for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || m.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)if (null != (e = arguments[h]))for (d in e)a = g[d], c = e[d], g !== c && (j && c && (m.isPlainObject(c) || (b = m.isArray(c))) ? (b ? (b = !1, f = a && m.isArray(a) ? a : []) : f = a && m.isPlainObject(a) ? a : {}, g[d] = m.extend(j, f, c)) : void 0 !== c && (g[d] = c));
        return g
    }, m.extend({expando: "jQuery" + (l + Math.random()).replace(/\D/g, ""), isReady: !0, error: function (a) {
        throw new Error(a)
    }, noop: function () {
    }, isFunction: function (a) {
        return"function" === m.type(a)
    }, isArray: Array.isArray || function (a) {
        return"array" === m.type(a)
    }, isWindow: function (a) {
        return null != a && a == a.window
    }, isNumeric: function (a) {
        return!m.isArray(a) && a - parseFloat(a) + 1 >= 0
    }, isEmptyObject: function (a) {
        var b;
        for (b in a)return!1;
        return!0
    }, isPlainObject: function (a) {
        var b;
        if (!a || "object" !== m.type(a) || a.nodeType || m.isWindow(a))return!1;
        try {
            if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf"))return!1
        } catch (c) {
            return!1
        }
        if (k.ownLast)for (b in a)return j.call(a, b);
        for (b in a);
        return void 0 === b || j.call(a, b)
    }, type: function (a) {
        return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
    }, globalEval: function (b) {
        b && m.trim(b) && (a.execScript || function (b) {
            a.eval.call(a, b)
        })(b)
    }, camelCase: function (a) {
        return a.replace(o, "ms-").replace(p, q)
    }, nodeName: function (a, b) {
        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
    }, each: function (a, b, c) {
        var d, e = 0, f = a.length, g = r(a);
        if (c) {
            if (g) {
                for (; f > e; e++)if (d = b.apply(a[e], c), d === !1)break
            } else for (e in a)if (d = b.apply(a[e], c), d === !1)break
        } else if (g) {
            for (; f > e; e++)if (d = b.call(a[e], e, a[e]), d === !1)break
        } else for (e in a)if (d = b.call(a[e], e, a[e]), d === !1)break;
        return a
    }, trim: function (a) {
        return null == a ? "" : (a + "").replace(n, "")
    }, makeArray: function (a, b) {
        var c = b || [];
        return null != a && (r(Object(a)) ? m.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c
    }, inArray: function (a, b, c) {
        var d;
        if (b) {
            if (g)return g.call(b, a, c);
            for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)if (c in b && b[c] === a)return c
        }
        return-1
    }, merge: function (a, b) {
        var c = +b.length, d = 0, e = a.length;
        while (c > d)a[e++] = b[d++];
        if (c !== c)while (void 0 !== b[d])a[e++] = b[d++];
        return a.length = e, a
    }, grep: function (a, b, c) {
        for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)d = !b(a[f], f), d !== h && e.push(a[f]);
        return e
    }, map: function (a, b, c) {
        var d, f = 0, g = a.length, h = r(a), i = [];
        if (h)for (; g > f; f++)d = b(a[f], f, c), null != d && i.push(d); else for (f in a)d = b(a[f], f, c), null != d && i.push(d);
        return e.apply([], i)
    }, guid: 1, proxy: function (a, b) {
        var c, e, f;
        return"string" == typeof b && (f = a[b], b = a, a = f), m.isFunction(a) ? (c = d.call(arguments, 2), e = function () {
            return a.apply(b || this, c.concat(d.call(arguments)))
        }, e.guid = a.guid = a.guid || m.guid++, e) : void 0
    }, now: function () {
        return+new Date
    }, support: k}), m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) {
        h["[object " + b + "]"] = b.toLowerCase()
    });
    function r(a) {
        var b = a.length, c = m.type(a);
        return"function" === c || m.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
    }

    var s = function (a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + 1 * new Date, v = a.document, w = 0, x = 0, y = hb(), z = hb(), A = hb(), B = function (a, b) {
            return a === b && (l = !0), 0
        }, C = 1 << 31, D = {}.hasOwnProperty, E = [], F = E.pop, G = E.push, H = E.push, I = E.slice, J = function (a, b) {
            for (var c = 0, d = a.length; d > c; c++)if (a[c] === b)return c;
            return-1
        }, K = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", L = "[\\x20\\t\\r\\n\\f]", M = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", N = M.replace("w", "w#"), O = "\\[" + L + "*(" + M + ")(?:" + L + "*([*^$|!~]?=)" + L + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + N + "))|)" + L + "*\\]", P = ":(" + M + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + O + ")*)|.*)\\)|)", Q = new RegExp(L + "+", "g"), R = new RegExp("^" + L + "+|((?:^|[^\\\\])(?:\\\\.)*)" + L + "+$", "g"), S = new RegExp("^" + L + "*," + L + "*"), T = new RegExp("^" + L + "*([>+~]|" + L + ")" + L + "*"), U = new RegExp("=" + L + "*([^\\]'\"]*?)" + L + "*\\]", "g"), V = new RegExp(P), W = new RegExp("^" + N + "$"), X = {ID: new RegExp("^#(" + M + ")"), CLASS: new RegExp("^\\.(" + M + ")"), TAG: new RegExp("^(" + M.replace("w", "w*") + ")"), ATTR: new RegExp("^" + O), PSEUDO: new RegExp("^" + P), CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + L + "*(even|odd|(([+-]|)(\\d*)n|)" + L + "*(?:([+-]|)" + L + "*(\\d+)|))" + L + "*\\)|)", "i"), bool: new RegExp("^(?:" + K + ")$", "i"), needsContext: new RegExp("^" + L + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + L + "*((?:-\\d)?\\d*)" + L + "*\\)|)(?=[^-]|$)", "i")}, Y = /^(?:input|select|textarea|button)$/i, Z = /^h\d$/i, $ = /^[^{]+\{\s*\[native \w/, _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ab = /[+~]/, bb = /'|\\/g, cb = new RegExp("\\\\([\\da-f]{1,6}" + L + "?|(" + L + ")|.)", "ig"), db = function (a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        }, eb = function () {
            m()
        };
        try {
            H.apply(E = I.call(v.childNodes), v.childNodes), E[v.childNodes.length].nodeType
        } catch (fb) {
            H = {apply: E.length ? function (a, b) {
                G.apply(a, I.call(b))
            } : function (a, b) {
                var c = a.length, d = 0;
                while (a[c++] = b[d++]);
                a.length = c - 1
            }}
        }
        function gb(a, b, d, e) {
            var f, h, j, k, l, o, r, s, w, x;
            if ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, d = d || [], k = b.nodeType, "string" != typeof a || !a || 1 !== k && 9 !== k && 11 !== k)return d;
            if (!e && p) {
                if (11 !== k && (f = _.exec(a)))if (j = f[1]) {
                    if (9 === k) {
                        if (h = b.getElementById(j), !h || !h.parentNode)return d;
                        if (h.id === j)return d.push(h), d
                    } else if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j)return d.push(h), d
                } else {
                    if (f[2])return H.apply(d, b.getElementsByTagName(a)), d;
                    if ((j = f[3]) && c.getElementsByClassName)return H.apply(d, b.getElementsByClassName(j)), d
                }
                if (c.qsa && (!q || !q.test(a))) {
                    if (s = r = u, w = b, x = 1 !== k && a, 1 === k && "object" !== b.nodeName.toLowerCase()) {
                        o = g(a), (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s), s = "[id='" + s + "'] ", l = o.length;
                        while (l--)o[l] = s + rb(o[l]);
                        w = ab.test(a) && pb(b.parentNode) || b, x = o.join(",")
                    }
                    if (x)try {
                        return H.apply(d, w.querySelectorAll(x)), d
                    } catch (y) {
                    } finally {
                        r || b.removeAttribute("id")
                    }
                }
            }
            return i(a.replace(R, "$1"), b, d, e)
        }

        function hb() {
            var a = [];

            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e
            }

            return b
        }

        function ib(a) {
            return a[u] = !0, a
        }

        function jb(a) {
            var b = n.createElement("div");
            try {
                return!!a(b)
            } catch (c) {
                return!1
            } finally {
                b.parentNode && b.parentNode.removeChild(b), b = null
            }
        }

        function kb(a, b) {
            var c = a.split("|"), e = a.length;
            while (e--)d.attrHandle[c[e]] = b
        }

        function lb(a, b) {
            var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || C) - (~a.sourceIndex || C);
            if (d)return d;
            if (c)while (c = c.nextSibling)if (c === b)return-1;
            return a ? 1 : -1
        }

        function mb(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return"input" === c && b.type === a
            }
        }

        function nb(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return("input" === c || "button" === c) && b.type === a
            }
        }

        function ob(a) {
            return ib(function (b) {
                return b = +b, ib(function (c, d) {
                    var e, f = a([], c.length, b), g = f.length;
                    while (g--)c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                })
            })
        }

        function pb(a) {
            return a && "undefined" != typeof a.getElementsByTagName && a
        }

        c = gb.support = {}, f = gb.isXML = function (a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? "HTML" !== b.nodeName : !1
        }, m = gb.setDocument = function (a) {
            var b, e, g = a ? a.ownerDocument || a : v;
            return g !== n && 9 === g.nodeType && g.documentElement ? (n = g, o = g.documentElement, e = g.defaultView, e && e !== e.top && (e.addEventListener ? e.addEventListener("unload", eb, !1) : e.attachEvent && e.attachEvent("onunload", eb)), p = !f(g), c.attributes = jb(function (a) {
                return a.className = "i", !a.getAttribute("className")
            }), c.getElementsByTagName = jb(function (a) {
                return a.appendChild(g.createComment("")), !a.getElementsByTagName("*").length
            }), c.getElementsByClassName = $.test(g.getElementsByClassName), c.getById = jb(function (a) {
                return o.appendChild(a).id = u, !g.getElementsByName || !g.getElementsByName(u).length
            }), c.getById ? (d.find.ID = function (a, b) {
                if ("undefined" != typeof b.getElementById && p) {
                    var c = b.getElementById(a);
                    return c && c.parentNode ? [c] : []
                }
            }, d.filter.ID = function (a) {
                var b = a.replace(cb, db);
                return function (a) {
                    return a.getAttribute("id") === b
                }
            }) : (delete d.find.ID, d.filter.ID = function (a) {
                var b = a.replace(cb, db);
                return function (a) {
                    var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
                    return c && c.value === b
                }
            }), d.find.TAG = c.getElementsByTagName ? function (a, b) {
                return"undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0
            } : function (a, b) {
                var c, d = [], e = 0, f = b.getElementsByTagName(a);
                if ("*" === a) {
                    while (c = f[e++])1 === c.nodeType && d.push(c);
                    return d
                }
                return f
            }, d.find.CLASS = c.getElementsByClassName && function (a, b) {
                return p ? b.getElementsByClassName(a) : void 0
            }, r = [], q = [], (c.qsa = $.test(g.querySelectorAll)) && (jb(function (a) {
                o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\f]' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + L + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + L + "*(?:value|" + K + ")"), a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="), a.querySelectorAll(":checked").length || q.push(":checked"), a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]")
            }), jb(function (a) {
                var b = g.createElement("input");
                b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + L + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:")
            })), (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && jb(function (a) {
                c.disconnectedMatch = s.call(a, "div"), s.call(a, "[s!='']:x"), r.push("!=", P)
            }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = $.test(o.compareDocumentPosition), t = b || $.test(o.contains) ? function (a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
            } : function (a, b) {
                if (b)while (b = b.parentNode)if (b === a)return!0;
                return!1
            }, B = b ? function (a, b) {
                if (a === b)return l = !0, 0;
                var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === g || a.ownerDocument === v && t(v, a) ? -1 : b === g || b.ownerDocument === v && t(v, b) ? 1 : k ? J(k, a) - J(k, b) : 0 : 4 & d ? -1 : 1)
            } : function (a, b) {
                if (a === b)return l = !0, 0;
                var c, d = 0, e = a.parentNode, f = b.parentNode, h = [a], i = [b];
                if (!e || !f)return a === g ? -1 : b === g ? 1 : e ? -1 : f ? 1 : k ? J(k, a) - J(k, b) : 0;
                if (e === f)return lb(a, b);
                c = a;
                while (c = c.parentNode)h.unshift(c);
                c = b;
                while (c = c.parentNode)i.unshift(c);
                while (h[d] === i[d])d++;
                return d ? lb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0
            }, g) : n
        }, gb.matches = function (a, b) {
            return gb(a, null, null, b)
        }, gb.matchesSelector = function (a, b) {
            if ((a.ownerDocument || a) !== n && m(a), b = b.replace(U, "='$1']"), !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b)))try {
                var d = s.call(a, b);
                if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType)return d
            } catch (e) {
            }
            return gb(b, n, null, [a]).length > 0
        }, gb.contains = function (a, b) {
            return(a.ownerDocument || a) !== n && m(a), t(a, b)
        }, gb.attr = function (a, b) {
            (a.ownerDocument || a) !== n && m(a);
            var e = d.attrHandle[b.toLowerCase()], f = e && D.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
            return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
        }, gb.error = function (a) {
            throw new Error("Syntax error, unrecognized expression: " + a)
        }, gb.uniqueSort = function (a) {
            var b, d = [], e = 0, f = 0;
            if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
                while (b = a[f++])b === a[f] && (e = d.push(f));
                while (e--)a.splice(d[e], 1)
            }
            return k = null, a
        }, e = gb.getText = function (a) {
            var b, c = "", d = 0, f = a.nodeType;
            if (f) {
                if (1 === f || 9 === f || 11 === f) {
                    if ("string" == typeof a.textContent)return a.textContent;
                    for (a = a.firstChild; a; a = a.nextSibling)c += e(a)
                } else if (3 === f || 4 === f)return a.nodeValue
            } else while (b = a[d++])c += e(b);
            return c
        }, d = gb.selectors = {cacheLength: 50, createPseudo: ib, match: X, attrHandle: {}, find: {}, relative: {">": {dir: "parentNode", first: !0}, " ": {dir: "parentNode"}, "+": {dir: "previousSibling", first: !0}, "~": {dir: "previousSibling"}}, preFilter: {ATTR: function (a) {
            return a[1] = a[1].replace(cb, db), a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
        }, CHILD: function (a) {
            return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || gb.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && gb.error(a[0]), a
        }, PSEUDO: function (a) {
            var b, c = !a[6] && a[2];
            return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
        }}, filter: {TAG: function (a) {
            var b = a.replace(cb, db).toLowerCase();
            return"*" === a ? function () {
                return!0
            } : function (a) {
                return a.nodeName && a.nodeName.toLowerCase() === b
            }
        }, CLASS: function (a) {
            var b = y[a + " "];
            return b || (b = new RegExp("(^|" + L + ")" + a + "(" + L + "|$)")) && y(a, function (a) {
                return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "")
            })
        }, ATTR: function (a, b, c) {
            return function (d) {
                var e = gb.attr(d, a);
                return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(Q, " ") + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
            }
        }, CHILD: function (a, b, c, d, e) {
            var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b;
            return 1 === d && 0 === e ? function (a) {
                return!!a.parentNode
            } : function (b, c, i) {
                var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h;
                if (q) {
                    if (f) {
                        while (p) {
                            l = b;
                            while (l = l[p])if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)return!1;
                            o = p = "only" === a && !o && "nextSibling"
                        }
                        return!0
                    }
                    if (o = [g ? q.firstChild : q.lastChild], g && s) {
                        k = q[u] || (q[u] = {}), j = k[a] || [], n = j[0] === w && j[1], m = j[0] === w && j[2], l = n && q.childNodes[n];
                        while (l = ++n && l && l[p] || (m = n = 0) || o.pop())if (1 === l.nodeType && ++m && l === b) {
                            k[a] = [w, n, m];
                            break
                        }
                    } else if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w)m = j[1]; else while (l = ++n && l && l[p] || (m = n = 0) || o.pop())if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b))break;
                    return m -= e, m === d || m % d === 0 && m / d >= 0
                }
            }
        }, PSEUDO: function (a, b) {
            var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || gb.error("unsupported pseudo: " + a);
            return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? ib(function (a, c) {
                var d, f = e(a, b), g = f.length;
                while (g--)d = J(a, f[g]), a[d] = !(c[d] = f[g])
            }) : function (a) {
                return e(a, 0, c)
            }) : e
        }}, pseudos: {not: ib(function (a) {
            var b = [], c = [], d = h(a.replace(R, "$1"));
            return d[u] ? ib(function (a, b, c, e) {
                var f, g = d(a, null, e, []), h = a.length;
                while (h--)(f = g[h]) && (a[h] = !(b[h] = f))
            }) : function (a, e, f) {
                return b[0] = a, d(b, null, f, c), b[0] = null, !c.pop()
            }
        }), has: ib(function (a) {
            return function (b) {
                return gb(a, b).length > 0
            }
        }), contains: ib(function (a) {
            return a = a.replace(cb, db), function (b) {
                return(b.textContent || b.innerText || e(b)).indexOf(a) > -1
            }
        }), lang: ib(function (a) {
            return W.test(a || "") || gb.error("unsupported lang: " + a), a = a.replace(cb, db).toLowerCase(), function (b) {
                var c;
                do if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                return!1
            }
        }), target: function (b) {
            var c = a.location && a.location.hash;
            return c && c.slice(1) === b.id
        }, root: function (a) {
            return a === o
        }, focus: function (a) {
            return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
        }, enabled: function (a) {
            return a.disabled === !1
        }, disabled: function (a) {
            return a.disabled === !0
        }, checked: function (a) {
            var b = a.nodeName.toLowerCase();
            return"input" === b && !!a.checked || "option" === b && !!a.selected
        }, selected: function (a) {
            return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
        }, empty: function (a) {
            for (a = a.firstChild; a; a = a.nextSibling)if (a.nodeType < 6)return!1;
            return!0
        }, parent: function (a) {
            return!d.pseudos.empty(a)
        }, header: function (a) {
            return Z.test(a.nodeName)
        }, input: function (a) {
            return Y.test(a.nodeName)
        }, button: function (a) {
            var b = a.nodeName.toLowerCase();
            return"input" === b && "button" === a.type || "button" === b
        }, text: function (a) {
            var b;
            return"input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
        }, first: ob(function () {
            return[0]
        }), last: ob(function (a, b) {
            return[b - 1]
        }), eq: ob(function (a, b, c) {
            return[0 > c ? c + b : c]
        }), even: ob(function (a, b) {
            for (var c = 0; b > c; c += 2)a.push(c);
            return a
        }), odd: ob(function (a, b) {
            for (var c = 1; b > c; c += 2)a.push(c);
            return a
        }), lt: ob(function (a, b, c) {
            for (var d = 0 > c ? c + b : c; --d >= 0;)a.push(d);
            return a
        }), gt: ob(function (a, b, c) {
            for (var d = 0 > c ? c + b : c; ++d < b;)a.push(d);
            return a
        })}}, d.pseudos.nth = d.pseudos.eq;
        for (b in{radio: !0, checkbox: !0, file: !0, password: !0, image: !0})d.pseudos[b] = mb(b);
        for (b in{submit: !0, reset: !0})d.pseudos[b] = nb(b);
        function qb() {
        }

        qb.prototype = d.filters = d.pseudos, d.setFilters = new qb, g = gb.tokenize = function (a, b) {
            var c, e, f, g, h, i, j, k = z[a + " "];
            if (k)return b ? 0 : k.slice(0);
            h = a, i = [], j = d.preFilter;
            while (h) {
                (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = T.exec(h)) && (c = e.shift(), f.push({value: c, type: e[0].replace(R, " ")}), h = h.slice(c.length));
                for (g in d.filter)!(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({value: c, type: g, matches: e}), h = h.slice(c.length));
                if (!c)break
            }
            return b ? h.length : h ? gb.error(a) : z(a, i).slice(0)
        };
        function rb(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++)d += a[b].value;
            return d
        }

        function sb(a, b, c) {
            var d = b.dir, e = c && "parentNode" === d, f = x++;
            return b.first ? function (b, c, f) {
                while (b = b[d])if (1 === b.nodeType || e)return a(b, c, f)
            } : function (b, c, g) {
                var h, i, j = [w, f];
                if (g) {
                    while (b = b[d])if ((1 === b.nodeType || e) && a(b, c, g))return!0
                } else while (b = b[d])if (1 === b.nodeType || e) {
                    if (i = b[u] || (b[u] = {}), (h = i[d]) && h[0] === w && h[1] === f)return j[2] = h[2];
                    if (i[d] = j, j[2] = a(b, c, g))return!0
                }
            }
        }

        function tb(a) {
            return a.length > 1 ? function (b, c, d) {
                var e = a.length;
                while (e--)if (!a[e](b, c, d))return!1;
                return!0
            } : a[0]
        }

        function ub(a, b, c) {
            for (var d = 0, e = b.length; e > d; d++)gb(a, b[d], c);
            return c
        }

        function vb(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
            return g
        }

        function wb(a, b, c, d, e, f) {
            return d && !d[u] && (d = wb(d)), e && !e[u] && (e = wb(e, f)), ib(function (f, g, h, i) {
                var j, k, l, m = [], n = [], o = g.length, p = f || ub(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : vb(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q;
                if (c && c(q, r, h, i), d) {
                    j = vb(r, n), d(j, [], h, i), k = j.length;
                    while (k--)(l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
                }
                if (f) {
                    if (e || a) {
                        if (e) {
                            j = [], k = r.length;
                            while (k--)(l = r[k]) && j.push(q[k] = l);
                            e(null, r = [], j, i)
                        }
                        k = r.length;
                        while (k--)(l = r[k]) && (j = e ? J(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                    }
                } else r = vb(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : H.apply(g, r)
            })
        }

        function xb(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = sb(function (a) {
                return a === b
            }, h, !0), l = sb(function (a) {
                return J(b, a) > -1
            }, h, !0), m = [function (a, c, d) {
                var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
                return b = null, e
            }]; f > i; i++)if (c = d.relative[a[i].type])m = [sb(tb(m), c)]; else {
                if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
                    for (e = ++i; f > e; e++)if (d.relative[a[e].type])break;
                    return wb(i > 1 && tb(m), i > 1 && rb(a.slice(0, i - 1).concat({value: " " === a[i - 2].type ? "*" : ""})).replace(R, "$1"), c, e > i && xb(a.slice(i, e)), f > e && xb(a = a.slice(e)), f > e && rb(a))
                }
                m.push(c)
            }
            return tb(m)
        }

        function yb(a, b) {
            var c = b.length > 0, e = a.length > 0, f = function (f, g, h, i, k) {
                var l, m, o, p = 0, q = "0", r = f && [], s = [], t = j, u = f || e && d.find.TAG("*", k), v = w += null == t ? 1 : Math.random() || .1, x = u.length;
                for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
                    if (e && l) {
                        m = 0;
                        while (o = a[m++])if (o(l, g, h)) {
                            i.push(l);
                            break
                        }
                        k && (w = v)
                    }
                    c && ((l = !o && l) && p--, f && r.push(l))
                }
                if (p += q, c && q !== p) {
                    m = 0;
                    while (o = b[m++])o(r, s, g, h);
                    if (f) {
                        if (p > 0)while (q--)r[q] || s[q] || (s[q] = F.call(i));
                        s = vb(s)
                    }
                    H.apply(i, s), k && !f && s.length > 0 && p + b.length > 1 && gb.uniqueSort(i)
                }
                return k && (w = v, j = t), r
            };
            return c ? ib(f) : f
        }

        return h = gb.compile = function (a, b) {
            var c, d = [], e = [], f = A[a + " "];
            if (!f) {
                b || (b = g(a)), c = b.length;
                while (c--)f = xb(b[c]), f[u] ? d.push(f) : e.push(f);
                f = A(a, yb(e, d)), f.selector = a
            }
            return f
        }, i = gb.select = function (a, b, e, f) {
            var i, j, k, l, m, n = "function" == typeof a && a, o = !f && g(a = n.selector || a);
            if (e = e || [], 1 === o.length) {
                if (j = o[0] = o[0].slice(0), j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
                    if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0], !b)return e;
                    n && (b = b.parentNode), a = a.slice(j.shift().value.length)
                }
                i = X.needsContext.test(a) ? 0 : j.length;
                while (i--) {
                    if (k = j[i], d.relative[l = k.type])break;
                    if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && pb(b.parentNode) || b))) {
                        if (j.splice(i, 1), a = f.length && rb(j), !a)return H.apply(e, f), e;
                        break
                    }
                }
            }
            return(n || h(a, o))(f, b, !p, e, ab.test(a) && pb(b.parentNode) || b), e
        }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = jb(function (a) {
            return 1 & a.compareDocumentPosition(n.createElement("div"))
        }), jb(function (a) {
            return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
        }) || kb("type|href|height|width", function (a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
        }), c.attributes && jb(function (a) {
            return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
        }) || kb("value", function (a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
        }), jb(function (a) {
            return null == a.getAttribute("disabled")
        }) || kb(K, function (a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
        }), gb
    }(a);
    m.find = s, m.expr = s.selectors, m.expr[":"] = m.expr.pseudos, m.unique = s.uniqueSort, m.text = s.getText, m.isXMLDoc = s.isXML, m.contains = s.contains;
    var t = m.expr.match.needsContext, u = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, v = /^.[^:#\[\.,]*$/;

    function w(a, b, c) {
        if (m.isFunction(b))return m.grep(a, function (a, d) {
            return!!b.call(a, d, a) !== c
        });
        if (b.nodeType)return m.grep(a, function (a) {
            return a === b !== c
        });
        if ("string" == typeof b) {
            if (v.test(b))return m.filter(b, a, c);
            b = m.filter(b, a)
        }
        return m.grep(a, function (a) {
            return m.inArray(a, b) >= 0 !== c
        })
    }

    m.filter = function (a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? m.find.matchesSelector(d, a) ? [d] : [] : m.find.matches(a, m.grep(b, function (a) {
            return 1 === a.nodeType
        }))
    }, m.fn.extend({find: function (a) {
        var b, c = [], d = this, e = d.length;
        if ("string" != typeof a)return this.pushStack(m(a).filter(function () {
            for (b = 0; e > b; b++)if (m.contains(d[b], this))return!0
        }));
        for (b = 0; e > b; b++)m.find(a, d[b], c);
        return c = this.pushStack(e > 1 ? m.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
    }, filter: function (a) {
        return this.pushStack(w(this, a || [], !1))
    }, not: function (a) {
        return this.pushStack(w(this, a || [], !0))
    }, is: function (a) {
        return!!w(this, "string" == typeof a && t.test(a) ? m(a) : a || [], !1).length
    }});
    var x, y = a.document, z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, A = m.fn.init = function (a, b) {
        var c, d;
        if (!a)return this;
        if ("string" == typeof a) {
            if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : z.exec(a), !c || !c[1] && b)return!b || b.jquery ? (b || x).find(a) : this.constructor(b).find(a);
            if (c[1]) {
                if (b = b instanceof m ? b[0] : b, m.merge(this, m.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : y, !0)), u.test(c[1]) && m.isPlainObject(b))for (c in b)m.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                return this
            }
            if (d = y.getElementById(c[2]), d && d.parentNode) {
                if (d.id !== c[2])return x.find(a);
                this.length = 1, this[0] = d
            }
            return this.context = y, this.selector = a, this
        }
        return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : m.isFunction(a) ? "undefined" != typeof x.ready ? x.ready(a) : a(m) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), m.makeArray(a, this))
    };
    A.prototype = m.fn, x = m(y);
    var B = /^(?:parents|prev(?:Until|All))/, C = {children: !0, contents: !0, next: !0, prev: !0};
    m.extend({dir: function (a, b, c) {
        var d = [], e = a[b];
        while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !m(e).is(c)))1 === e.nodeType && d.push(e), e = e[b];
        return d
    }, sibling: function (a, b) {
        for (var c = []; a; a = a.nextSibling)1 === a.nodeType && a !== b && c.push(a);
        return c
    }}), m.fn.extend({has: function (a) {
        var b, c = m(a, this), d = c.length;
        return this.filter(function () {
            for (b = 0; d > b; b++)if (m.contains(this, c[b]))return!0
        })
    }, closest: function (a, b) {
        for (var c, d = 0, e = this.length, f = [], g = t.test(a) || "string" != typeof a ? m(a, b || this.context) : 0; e > d; d++)for (c = this[d]; c && c !== b; c = c.parentNode)if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && m.find.matchesSelector(c, a))) {
            f.push(c);
            break
        }
        return this.pushStack(f.length > 1 ? m.unique(f) : f)
    }, index: function (a) {
        return a ? "string" == typeof a ? m.inArray(this[0], m(a)) : m.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
    }, add: function (a, b) {
        return this.pushStack(m.unique(m.merge(this.get(), m(a, b))))
    }, addBack: function (a) {
        return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
    }});
    function D(a, b) {
        do a = a[b]; while (a && 1 !== a.nodeType);
        return a
    }

    m.each({parent: function (a) {
        var b = a.parentNode;
        return b && 11 !== b.nodeType ? b : null
    }, parents: function (a) {
        return m.dir(a, "parentNode")
    }, parentsUntil: function (a, b, c) {
        return m.dir(a, "parentNode", c)
    }, next: function (a) {
        return D(a, "nextSibling")
    }, prev: function (a) {
        return D(a, "previousSibling")
    }, nextAll: function (a) {
        return m.dir(a, "nextSibling")
    }, prevAll: function (a) {
        return m.dir(a, "previousSibling")
    }, nextUntil: function (a, b, c) {
        return m.dir(a, "nextSibling", c)
    }, prevUntil: function (a, b, c) {
        return m.dir(a, "previousSibling", c)
    }, siblings: function (a) {
        return m.sibling((a.parentNode || {}).firstChild, a)
    }, children: function (a) {
        return m.sibling(a.firstChild)
    }, contents: function (a) {
        return m.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : m.merge([], a.childNodes)
    }}, function (a, b) {
        m.fn[a] = function (c, d) {
            var e = m.map(this, b, c);
            return"Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = m.filter(d, e)), this.length > 1 && (C[a] || (e = m.unique(e)), B.test(a) && (e = e.reverse())), this.pushStack(e)
        }
    });
    var E = /\S+/g, F = {};

    function G(a) {
        var b = F[a] = {};
        return m.each(a.match(E) || [], function (a, c) {
            b[c] = !0
        }), b
    }

    m.Callbacks = function (a) {
        a = "string" == typeof a ? F[a] || G(a) : m.extend({}, a);
        var b, c, d, e, f, g, h = [], i = !a.once && [], j = function (l) {
            for (c = a.memory && l, d = !0, f = g || 0, g = 0, e = h.length, b = !0; h && e > f; f++)if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                c = !1;
                break
            }
            b = !1, h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable())
        }, k = {add: function () {
            if (h) {
                var d = h.length;
                !function f(b) {
                    m.each(b, function (b, c) {
                        var d = m.type(c);
                        "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c)
                    })
                }(arguments), b ? e = h.length : c && (g = d, j(c))
            }
            return this
        }, remove: function () {
            return h && m.each(arguments, function (a, c) {
                var d;
                while ((d = m.inArray(c, h, d)) > -1)h.splice(d, 1), b && (e >= d && e--, f >= d && f--)
            }), this
        }, has: function (a) {
            return a ? m.inArray(a, h) > -1 : !(!h || !h.length)
        }, empty: function () {
            return h = [], e = 0, this
        }, disable: function () {
            return h = i = c = void 0, this
        }, disabled: function () {
            return!h
        }, lock: function () {
            return i = void 0, c || k.disable(), this
        }, locked: function () {
            return!i
        }, fireWith: function (a, c) {
            return!h || d && !i || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? i.push(c) : j(c)), this
        }, fire: function () {
            return k.fireWith(this, arguments), this
        }, fired: function () {
            return!!d
        }};
        return k
    }, m.extend({Deferred: function (a) {
        var b = [
            ["resolve", "done", m.Callbacks("once memory"), "resolved"],
            ["reject", "fail", m.Callbacks("once memory"), "rejected"],
            ["notify", "progress", m.Callbacks("memory")]
        ], c = "pending", d = {state: function () {
            return c
        }, always: function () {
            return e.done(arguments).fail(arguments), this
        }, then: function () {
            var a = arguments;
            return m.Deferred(function (c) {
                m.each(b, function (b, f) {
                    var g = m.isFunction(a[b]) && a[b];
                    e[f[1]](function () {
                        var a = g && g.apply(this, arguments);
                        a && m.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                    })
                }), a = null
            }).promise()
        }, promise: function (a) {
            return null != a ? m.extend(a, d) : d
        }}, e = {};
        return d.pipe = d.then, m.each(b, function (a, f) {
            var g = f[2], h = f[3];
            d[f[1]] = g.add, h && g.add(function () {
                c = h
            }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function () {
                return e[f[0] + "With"](this === e ? d : this, arguments), this
            }, e[f[0] + "With"] = g.fireWith
        }), d.promise(e), a && a.call(e, e), e
    }, when: function (a) {
        var b = 0, c = d.call(arguments), e = c.length, f = 1 !== e || a && m.isFunction(a.promise) ? e : 0, g = 1 === f ? a : m.Deferred(), h = function (a, b, c) {
            return function (e) {
                b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
            }
        }, i, j, k;
        if (e > 1)for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++)c[b] && m.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
        return f || g.resolveWith(k, c), g.promise()
    }});
    var H;
    m.fn.ready = function (a) {
        return m.ready.promise().done(a), this
    }, m.extend({isReady: !1, readyWait: 1, holdReady: function (a) {
        a ? m.readyWait++ : m.ready(!0)
    }, ready: function (a) {
        if (a === !0 ? !--m.readyWait : !m.isReady) {
            if (!y.body)return setTimeout(m.ready);
            m.isReady = !0, a !== !0 && --m.readyWait > 0 || (H.resolveWith(y, [m]), m.fn.triggerHandler && (m(y).triggerHandler("ready"), m(y).off("ready")))
        }
    }});
    function I() {
        y.addEventListener ? (y.removeEventListener("DOMContentLoaded", J, !1), a.removeEventListener("load", J, !1)) : (y.detachEvent("onreadystatechange", J), a.detachEvent("onload", J))
    }

    function J() {
        (y.addEventListener || "load" === event.type || "complete" === y.readyState) && (I(), m.ready())
    }

    m.ready.promise = function (b) {
        if (!H)if (H = m.Deferred(), "complete" === y.readyState)setTimeout(m.ready); else if (y.addEventListener)y.addEventListener("DOMContentLoaded", J, !1), a.addEventListener("load", J, !1); else {
            y.attachEvent("onreadystatechange", J), a.attachEvent("onload", J);
            var c = !1;
            try {
                c = null == a.frameElement && y.documentElement
            } catch (d) {
            }
            c && c.doScroll && !function e() {
                if (!m.isReady) {
                    try {
                        c.doScroll("left")
                    } catch (a) {
                        return setTimeout(e, 50)
                    }
                    I(), m.ready()
                }
            }()
        }
        return H.promise(b)
    };
    var K = "undefined", L;
    for (L in m(k))break;
    k.ownLast = "0" !== L, k.inlineBlockNeedsLayout = !1, m(function () {
        var a, b, c, d;
        c = y.getElementsByTagName("body")[0], c && c.style && (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== K && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", k.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d))
    }), function () {
        var a = y.createElement("div");
        if (null == k.deleteExpando) {
            k.deleteExpando = !0;
            try {
                delete a.test
            } catch (b) {
                k.deleteExpando = !1
            }
        }
        a = null
    }(), m.acceptData = function (a) {
        var b = m.noData[(a.nodeName + " ").toLowerCase()], c = +a.nodeType || 1;
        return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
    };
    var M = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, N = /([A-Z])/g;

    function O(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(N, "-$1").toLowerCase();
            if (c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : M.test(c) ? m.parseJSON(c) : c
                } catch (e) {
                }
                m.data(a, b, c)
            } else c = void 0
        }
        return c
    }

    function P(a) {
        var b;
        for (b in a)if (("data" !== b || !m.isEmptyObject(a[b])) && "toJSON" !== b)return!1;
        return!0
    }

    function Q(a, b, d, e) {
        if (m.acceptData(a)) {
            var f, g, h = m.expando, i = a.nodeType, j = i ? m.cache : a, k = i ? a[h] : a[h] && h;
            if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b)return k || (k = i ? a[h] = c.pop() || m.guid++ : h), j[k] || (j[k] = i ? {} : {toJSON: m.noop}), ("object" == typeof b || "function" == typeof b) && (e ? j[k] = m.extend(j[k], b) : j[k].data = m.extend(j[k].data, b)), g = j[k], e || (g.data || (g.data = {}), g = g.data), void 0 !== d && (g[m.camelCase(b)] = d), "string" == typeof b ? (f = g[b], null == f && (f = g[m.camelCase(b)])) : f = g, f
        }
    }

    function R(a, b, c) {
        if (m.acceptData(a)) {
            var d, e, f = a.nodeType, g = f ? m.cache : a, h = f ? a[m.expando] : m.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    m.isArray(b) ? b = b.concat(m.map(b, m.camelCase)) : b in d ? b = [b] : (b = m.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                    while (e--)delete d[b[e]];
                    if (c ? !P(d) : !m.isEmptyObject(d))return
                }
                (c || (delete g[h].data, P(g[h]))) && (f ? m.cleanData([a], !0) : k.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
            }
        }
    }

    m.extend({cache: {}, noData: {"applet ": !0, "embed ": !0, "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"}, hasData: function (a) {
        return a = a.nodeType ? m.cache[a[m.expando]] : a[m.expando], !!a && !P(a)
    }, data: function (a, b, c) {
        return Q(a, b, c)
    }, removeData: function (a, b) {
        return R(a, b)
    }, _data: function (a, b, c) {
        return Q(a, b, c, !0)
    }, _removeData: function (a, b) {
        return R(a, b, !0)
    }}), m.fn.extend({data: function (a, b) {
        var c, d, e, f = this[0], g = f && f.attributes;
        if (void 0 === a) {
            if (this.length && (e = m.data(f), 1 === f.nodeType && !m._data(f, "parsedAttrs"))) {
                c = g.length;
                while (c--)g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = m.camelCase(d.slice(5)), O(f, d, e[d])));
                m._data(f, "parsedAttrs", !0)
            }
            return e
        }
        return"object" == typeof a ? this.each(function () {
            m.data(this, a)
        }) : arguments.length > 1 ? this.each(function () {
            m.data(this, a, b)
        }) : f ? O(f, a, m.data(f, a)) : void 0
    }, removeData: function (a) {
        return this.each(function () {
            m.removeData(this, a)
        })
    }}), m.extend({queue: function (a, b, c) {
        var d;
        return a ? (b = (b || "fx") + "queue", d = m._data(a, b), c && (!d || m.isArray(c) ? d = m._data(a, b, m.makeArray(c)) : d.push(c)), d || []) : void 0
    }, dequeue: function (a, b) {
        b = b || "fx";
        var c = m.queue(a, b), d = c.length, e = c.shift(), f = m._queueHooks(a, b), g = function () {
            m.dequeue(a, b)
        };
        "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
    }, _queueHooks: function (a, b) {
        var c = b + "queueHooks";
        return m._data(a, c) || m._data(a, c, {empty: m.Callbacks("once memory").add(function () {
            m._removeData(a, b + "queue"), m._removeData(a, c)
        })})
    }}), m.fn.extend({queue: function (a, b) {
        var c = 2;
        return"string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? m.queue(this[0], a) : void 0 === b ? this : this.each(function () {
            var c = m.queue(this, a, b);
            m._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && m.dequeue(this, a)
        })
    }, dequeue: function (a) {
        return this.each(function () {
            m.dequeue(this, a)
        })
    }, clearQueue: function (a) {
        return this.queue(a || "fx", [])
    }, promise: function (a, b) {
        var c, d = 1, e = m.Deferred(), f = this, g = this.length, h = function () {
            --d || e.resolveWith(f, [f])
        };
        "string" != typeof a && (b = a, a = void 0), a = a || "fx";
        while (g--)c = m._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
        return h(), e.promise(b)
    }});
    var S = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, T = ["Top", "Right", "Bottom", "Left"], U = function (a, b) {
        return a = b || a, "none" === m.css(a, "display") || !m.contains(a.ownerDocument, a)
    }, V = m.access = function (a, b, c, d, e, f, g) {
        var h = 0, i = a.length, j = null == c;
        if ("object" === m.type(c)) {
            e = !0;
            for (h in c)m.access(a, b, h, c[h], !0, f, g)
        } else if (void 0 !== d && (e = !0, m.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) {
            return j.call(m(a), c)
        })), b))for (; i > h; h++)b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    }, W = /^(?:checkbox|radio)$/i;
    !function () {
        var a = y.createElement("input"), b = y.createElement("div"), c = y.createDocumentFragment();
        if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", k.leadingWhitespace = 3 === b.firstChild.nodeType, k.tbody = !b.getElementsByTagName("tbody").length, k.htmlSerialize = !!b.getElementsByTagName("link").length, k.html5Clone = "<:nav></:nav>" !== y.createElement("nav").cloneNode(!0).outerHTML, a.type = "checkbox", a.checked = !0, c.appendChild(a), k.appendChecked = a.checked, b.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, c.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, k.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function () {
            k.noCloneEvent = !1
        }), b.cloneNode(!0).click()), null == k.deleteExpando) {
            k.deleteExpando = !0;
            try {
                delete b.test
            } catch (d) {
                k.deleteExpando = !1
            }
        }
    }(), function () {
        var b, c, d = y.createElement("div");
        for (b in{submit: !0, change: !0, focusin: !0})c = "on" + b, (k[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), k[b + "Bubbles"] = d.attributes[c].expando === !1);
        d = null
    }();
    var X = /^(?:input|select|textarea)$/i, Y = /^key/, Z = /^(?:mouse|pointer|contextmenu)|click/, $ = /^(?:focusinfocus|focusoutblur)$/, _ = /^([^.]*)(?:\.(.+)|)$/;

    function ab() {
        return!0
    }

    function bb() {
        return!1
    }

    function cb() {
        try {
            return y.activeElement
        } catch (a) {
        }
    }

    m.event = {global: {}, add: function (a, b, c, d, e) {
        var f, g, h, i, j, k, l, n, o, p, q, r = m._data(a);
        if (r) {
            c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = m.guid++), (g = r.events) || (g = r.events = {}), (k = r.handle) || (k = r.handle = function (a) {
                return typeof m === K || a && m.event.triggered === a.type ? void 0 : m.event.dispatch.apply(k.elem, arguments)
            }, k.elem = a), b = (b || "").match(E) || [""], h = b.length;
            while (h--)f = _.exec(b[h]) || [], o = q = f[1], p = (f[2] || "").split(".").sort(), o && (j = m.event.special[o] || {}, o = (e ? j.delegateType : j.bindType) || o, j = m.event.special[o] || {}, l = m.extend({type: o, origType: q, data: d, handler: c, guid: c.guid, selector: e, needsContext: e && m.expr.match.needsContext.test(e), namespace: p.join(".")}, i), (n = g[o]) || (n = g[o] = [], n.delegateCount = 0, j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? n.splice(n.delegateCount++, 0, l) : n.push(l), m.event.global[o] = !0);
            a = null
        }
    }, remove: function (a, b, c, d, e) {
        var f, g, h, i, j, k, l, n, o, p, q, r = m.hasData(a) && m._data(a);
        if (r && (k = r.events)) {
            b = (b || "").match(E) || [""], j = b.length;
            while (j--)if (h = _.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
                l = m.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, n = k[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = n.length;
                while (f--)g = n[f], !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (n.splice(f, 1), g.selector && n.delegateCount--, l.remove && l.remove.call(a, g));
                i && !n.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || m.removeEvent(a, o, r.handle), delete k[o])
            } else for (o in k)m.event.remove(a, o + b[j], c, d, !0);
            m.isEmptyObject(k) && (delete r.handle, m._removeData(a, "events"))
        }
    }, trigger: function (b, c, d, e) {
        var f, g, h, i, k, l, n, o = [d || y], p = j.call(b, "type") ? b.type : b, q = j.call(b, "namespace") ? b.namespace.split(".") : [];
        if (h = l = d = d || y, 3 !== d.nodeType && 8 !== d.nodeType && !$.test(p + m.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."), p = q.shift(), q.sort()), g = p.indexOf(":") < 0 && "on" + p, b = b[m.expando] ? b : new m.Event(p, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = q.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : m.makeArray(c, [b]), k = m.event.special[p] || {}, e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
            if (!e && !k.noBubble && !m.isWindow(d)) {
                for (i = k.delegateType || p, $.test(i + p) || (h = h.parentNode); h; h = h.parentNode)o.push(h), l = h;
                l === (d.ownerDocument || y) && o.push(l.defaultView || l.parentWindow || a)
            }
            n = 0;
            while ((h = o[n++]) && !b.isPropagationStopped())b.type = n > 1 ? i : k.bindType || p, f = (m._data(h, "events") || {})[b.type] && m._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && m.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
            if (b.type = p, !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && m.acceptData(d) && g && d[p] && !m.isWindow(d)) {
                l = d[g], l && (d[g] = null), m.event.triggered = p;
                try {
                    d[p]()
                } catch (r) {
                }
                m.event.triggered = void 0, l && (d[g] = l)
            }
            return b.result
        }
    }, dispatch: function (a) {
        a = m.event.fix(a);
        var b, c, e, f, g, h = [], i = d.call(arguments), j = (m._data(this, "events") || {})[a.type] || [], k = m.event.special[a.type] || {};
        if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
            h = m.event.handlers.call(this, a, j), b = 0;
            while ((f = h[b++]) && !a.isPropagationStopped()) {
                a.currentTarget = f.elem, g = 0;
                while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped())(!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e, a.data = e.data, c = ((m.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()))
            }
            return k.postDispatch && k.postDispatch.call(this, a), a.result
        }
    }, handlers: function (a, b) {
        var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
        if (h && i.nodeType && (!a.button || "click" !== a.type))for (; i != this; i = i.parentNode || this)if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
            for (e = [], f = 0; h > f; f++)d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? m(c, this).index(i) >= 0 : m.find(c, this, null, [i]).length), e[c] && e.push(d);
            e.length && g.push({elem: i, handlers: e})
        }
        return h < b.length && g.push({elem: this, handlers: b.slice(h)}), g
    }, fix: function (a) {
        if (a[m.expando])return a;
        var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
        g || (this.fixHooks[e] = g = Z.test(e) ? this.mouseHooks : Y.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new m.Event(f), b = d.length;
        while (b--)c = d[b], a[c] = f[c];
        return a.target || (a.target = f.srcElement || y), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
    }, props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: {props: "char charCode key keyCode".split(" "), filter: function (a, b) {
        return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
    }}, mouseHooks: {props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (a, b) {
        var c, d, e, f = b.button, g = b.fromElement;
        return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || y, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
    }}, special: {load: {noBubble: !0}, focus: {trigger: function () {
        if (this !== cb() && this.focus)try {
            return this.focus(), !1
        } catch (a) {
        }
    }, delegateType: "focusin"}, blur: {trigger: function () {
        return this === cb() && this.blur ? (this.blur(), !1) : void 0
    }, delegateType: "focusout"}, click: {trigger: function () {
        return m.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
    }, _default: function (a) {
        return m.nodeName(a.target, "a")
    }}, beforeunload: {postDispatch: function (a) {
        void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
    }}}, simulate: function (a, b, c, d) {
        var e = m.extend(new m.Event, c, {type: a, isSimulated: !0, originalEvent: {}});
        d ? m.event.trigger(e, null, b) : m.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
    }}, m.removeEvent = y.removeEventListener ? function (a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function (a, b, c) {
        var d = "on" + b;
        a.detachEvent && (typeof a[d] === K && (a[d] = null), a.detachEvent(d, c))
    }, m.Event = function (a, b) {
        return this instanceof m.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? ab : bb) : this.type = a, b && m.extend(this, b), this.timeStamp = a && a.timeStamp || m.now(), void(this[m.expando] = !0)) : new m.Event(a, b)
    }, m.Event.prototype = {isDefaultPrevented: bb, isPropagationStopped: bb, isImmediatePropagationStopped: bb, preventDefault: function () {
        var a = this.originalEvent;
        this.isDefaultPrevented = ab, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
    }, stopPropagation: function () {
        var a = this.originalEvent;
        this.isPropagationStopped = ab, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
    }, stopImmediatePropagation: function () {
        var a = this.originalEvent;
        this.isImmediatePropagationStopped = ab, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
    }}, m.each({mouseenter: "mouseover", mouseleave: "mouseout", pointerenter: "pointerover", pointerleave: "pointerout"}, function (a, b) {
        m.event.special[a] = {delegateType: b, bindType: b, handle: function (a) {
            var c, d = this, e = a.relatedTarget, f = a.handleObj;
            return(!e || e !== d && !m.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
        }}
    }), k.submitBubbles || (m.event.special.submit = {setup: function () {
        return m.nodeName(this, "form") ? !1 : void m.event.add(this, "click._submit keypress._submit", function (a) {
            var b = a.target, c = m.nodeName(b, "input") || m.nodeName(b, "button") ? b.form : void 0;
            c && !m._data(c, "submitBubbles") && (m.event.add(c, "submit._submit", function (a) {
                a._submit_bubble = !0
            }), m._data(c, "submitBubbles", !0))
        })
    }, postDispatch: function (a) {
        a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && m.event.simulate("submit", this.parentNode, a, !0))
    }, teardown: function () {
        return m.nodeName(this, "form") ? !1 : void m.event.remove(this, "._submit")
    }}), k.changeBubbles || (m.event.special.change = {setup: function () {
        return X.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (m.event.add(this, "propertychange._change", function (a) {
            "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
        }), m.event.add(this, "click._change", function (a) {
            this._just_changed && !a.isTrigger && (this._just_changed = !1), m.event.simulate("change", this, a, !0)
        })), !1) : void m.event.add(this, "beforeactivate._change", function (a) {
            var b = a.target;
            X.test(b.nodeName) && !m._data(b, "changeBubbles") && (m.event.add(b, "change._change", function (a) {
                !this.parentNode || a.isSimulated || a.isTrigger || m.event.simulate("change", this.parentNode, a, !0)
            }), m._data(b, "changeBubbles", !0))
        })
    }, handle: function (a) {
        var b = a.target;
        return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
    }, teardown: function () {
        return m.event.remove(this, "._change"), !X.test(this.nodeName)
    }}), k.focusinBubbles || m.each({focus: "focusin", blur: "focusout"}, function (a, b) {
        var c = function (a) {
            m.event.simulate(b, a.target, m.event.fix(a), !0)
        };
        m.event.special[b] = {setup: function () {
            var d = this.ownerDocument || this, e = m._data(d, b);
            e || d.addEventListener(a, c, !0), m._data(d, b, (e || 0) + 1)
        }, teardown: function () {
            var d = this.ownerDocument || this, e = m._data(d, b) - 1;
            e ? m._data(d, b, e) : (d.removeEventListener(a, c, !0), m._removeData(d, b))
        }}
    }), m.fn.extend({on: function (a, b, c, d, e) {
        var f, g;
        if ("object" == typeof a) {
            "string" != typeof b && (c = c || b, b = void 0);
            for (f in a)this.on(f, b, c, a[f], e);
            return this
        }
        if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1)d = bb; else if (!d)return this;
        return 1 === e && (g = d, d = function (a) {
            return m().off(a), g.apply(this, arguments)
        }, d.guid = g.guid || (g.guid = m.guid++)), this.each(function () {
            m.event.add(this, a, d, c, b)
        })
    }, one: function (a, b, c, d) {
        return this.on(a, b, c, d, 1)
    }, off: function (a, b, c) {
        var d, e;
        if (a && a.preventDefault && a.handleObj)return d = a.handleObj, m(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
        if ("object" == typeof a) {
            for (e in a)this.off(e, b, a[e]);
            return this
        }
        return(b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = bb), this.each(function () {
            m.event.remove(this, a, c, b)
        })
    }, trigger: function (a, b) {
        return this.each(function () {
            m.event.trigger(a, b, this)
        })
    }, triggerHandler: function (a, b) {
        var c = this[0];
        return c ? m.event.trigger(a, b, c, !0) : void 0
    }});
    function db(a) {
        var b = eb.split("|"), c = a.createDocumentFragment();
        if (c.createElement)while (b.length)c.createElement(b.pop());
        return c
    }

    var eb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", fb = / jQuery\d+="(?:null|\d+)"/g, gb = new RegExp("<(?:" + eb + ")[\\s/>]", "i"), hb = /^\s+/, ib = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, jb = /<([\w:]+)/, kb = /<tbody/i, lb = /<|&#?\w+;/, mb = /<(?:script|style|link)/i, nb = /checked\s*(?:[^=]|=\s*.checked.)/i, ob = /^$|\/(?:java|ecma)script/i, pb = /^true\/(.*)/, qb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, rb = {option: [1, "<select multiple='multiple'>", "</select>"], legend: [1, "<fieldset>", "</fieldset>"], area: [1, "<map>", "</map>"], param: [1, "<object>", "</object>"], thead: [1, "<table>", "</table>"], tr: [2, "<table><tbody>", "</tbody></table>"], col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: k.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]}, sb = db(y), tb = sb.appendChild(y.createElement("div"));
    rb.optgroup = rb.option, rb.tbody = rb.tfoot = rb.colgroup = rb.caption = rb.thead, rb.th = rb.td;
    function ub(a, b) {
        var c, d, e = 0, f = typeof a.getElementsByTagName !== K ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== K ? a.querySelectorAll(b || "*") : void 0;
        if (!f)for (f = [], c = a.childNodes || a; null != (d = c[e]); e++)!b || m.nodeName(d, b) ? f.push(d) : m.merge(f, ub(d, b));
        return void 0 === b || b && m.nodeName(a, b) ? m.merge([a], f) : f
    }

    function vb(a) {
        W.test(a.type) && (a.defaultChecked = a.checked)
    }

    function wb(a, b) {
        return m.nodeName(a, "table") && m.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function xb(a) {
        return a.type = (null !== m.find.attr(a, "type")) + "/" + a.type, a
    }

    function yb(a) {
        var b = pb.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a
    }

    function zb(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++)m._data(c, "globalEval", !b || m._data(b[d], "globalEval"))
    }

    function Ab(a, b) {
        if (1 === b.nodeType && m.hasData(a)) {
            var c, d, e, f = m._data(a), g = m._data(b, f), h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h)for (d = 0, e = h[c].length; e > d; d++)m.event.add(b, c, h[c][d])
            }
            g.data && (g.data = m.extend({}, g.data))
        }
    }

    function Bb(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(), !k.noCloneEvent && b[m.expando]) {
                e = m._data(b);
                for (d in e.events)m.removeEvent(b, d, e.handle);
                b.removeAttribute(m.expando)
            }
            "script" === c && b.text !== a.text ? (xb(b).text = a.text, yb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), k.html5Clone && a.innerHTML && !m.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && W.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
        }
    }

    m.extend({clone: function (a, b, c) {
        var d, e, f, g, h, i = m.contains(a.ownerDocument, a);
        if (k.html5Clone || m.isXMLDoc(a) || !gb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (tb.innerHTML = a.outerHTML, tb.removeChild(f = tb.firstChild)), !(k.noCloneEvent && k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || m.isXMLDoc(a)))for (d = ub(f), h = ub(a), g = 0; null != (e = h[g]); ++g)d[g] && Bb(e, d[g]);
        if (b)if (c)for (h = h || ub(a), d = d || ub(f), g = 0; null != (e = h[g]); g++)Ab(e, d[g]); else Ab(a, f);
        return d = ub(f, "script"), d.length > 0 && zb(d, !i && ub(a, "script")), d = h = e = null, f
    }, buildFragment: function (a, b, c, d) {
        for (var e, f, g, h, i, j, l, n = a.length, o = db(b), p = [], q = 0; n > q; q++)if (f = a[q], f || 0 === f)if ("object" === m.type(f))m.merge(p, f.nodeType ? [f] : f); else if (lb.test(f)) {
            h = h || o.appendChild(b.createElement("div")), i = (jb.exec(f) || ["", ""])[1].toLowerCase(), l = rb[i] || rb._default, h.innerHTML = l[1] + f.replace(ib, "<$1></$2>") + l[2], e = l[0];
            while (e--)h = h.lastChild;
            if (!k.leadingWhitespace && hb.test(f) && p.push(b.createTextNode(hb.exec(f)[0])), !k.tbody) {
                f = "table" !== i || kb.test(f) ? "<table>" !== l[1] || kb.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length;
                while (e--)m.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j)
            }
            m.merge(p, h.childNodes), h.textContent = "";
            while (h.firstChild)h.removeChild(h.firstChild);
            h = o.lastChild
        } else p.push(b.createTextNode(f));
        h && o.removeChild(h), k.appendChecked || m.grep(ub(p, "input"), vb), q = 0;
        while (f = p[q++])if ((!d || -1 === m.inArray(f, d)) && (g = m.contains(f.ownerDocument, f), h = ub(o.appendChild(f), "script"), g && zb(h), c)) {
            e = 0;
            while (f = h[e++])ob.test(f.type || "") && c.push(f)
        }
        return h = null, o
    }, cleanData: function (a, b) {
        for (var d, e, f, g, h = 0, i = m.expando, j = m.cache, l = k.deleteExpando, n = m.event.special; null != (d = a[h]); h++)if ((b || m.acceptData(d)) && (f = d[i], g = f && j[f])) {
            if (g.events)for (e in g.events)n[e] ? m.event.remove(d, e) : m.removeEvent(d, e, g.handle);
            j[f] && (delete j[f], l ? delete d[i] : typeof d.removeAttribute !== K ? d.removeAttribute(i) : d[i] = null, c.push(f))
        }
    }}), m.fn.extend({text: function (a) {
        return V(this, function (a) {
            return void 0 === a ? m.text(this) : this.empty().append((this[0] && this[0].ownerDocument || y).createTextNode(a))
        }, null, a, arguments.length)
    }, append: function () {
        return this.domManip(arguments, function (a) {
            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                var b = wb(this, a);
                b.appendChild(a)
            }
        })
    }, prepend: function () {
        return this.domManip(arguments, function (a) {
            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                var b = wb(this, a);
                b.insertBefore(a, b.firstChild)
            }
        })
    }, before: function () {
        return this.domManip(arguments, function (a) {
            this.parentNode && this.parentNode.insertBefore(a, this)
        })
    }, after: function () {
        return this.domManip(arguments, function (a) {
            this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
        })
    }, remove: function (a, b) {
        for (var c, d = a ? m.filter(a, this) : this, e = 0; null != (c = d[e]); e++)b || 1 !== c.nodeType || m.cleanData(ub(c)), c.parentNode && (b && m.contains(c.ownerDocument, c) && zb(ub(c, "script")), c.parentNode.removeChild(c));
        return this
    }, empty: function () {
        for (var a, b = 0; null != (a = this[b]); b++) {
            1 === a.nodeType && m.cleanData(ub(a, !1));
            while (a.firstChild)a.removeChild(a.firstChild);
            a.options && m.nodeName(a, "select") && (a.options.length = 0)
        }
        return this
    }, clone: function (a, b) {
        return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function () {
            return m.clone(this, a, b)
        })
    }, html: function (a) {
        return V(this, function (a) {
            var b = this[0] || {}, c = 0, d = this.length;
            if (void 0 === a)return 1 === b.nodeType ? b.innerHTML.replace(fb, "") : void 0;
            if (!("string" != typeof a || mb.test(a) || !k.htmlSerialize && gb.test(a) || !k.leadingWhitespace && hb.test(a) || rb[(jb.exec(a) || ["", ""])[1].toLowerCase()])) {
                a = a.replace(ib, "<$1></$2>");
                try {
                    for (; d > c; c++)b = this[c] || {}, 1 === b.nodeType && (m.cleanData(ub(b, !1)), b.innerHTML = a);
                    b = 0
                } catch (e) {
                }
            }
            b && this.empty().append(a)
        }, null, a, arguments.length)
    }, replaceWith: function () {
        var a = arguments[0];
        return this.domManip(arguments, function (b) {
            a = this.parentNode, m.cleanData(ub(this)), a && a.replaceChild(b, this)
        }), a && (a.length || a.nodeType) ? this : this.remove()
    }, detach: function (a) {
        return this.remove(a, !0)
    }, domManip: function (a, b) {
        a = e.apply([], a);
        var c, d, f, g, h, i, j = 0, l = this.length, n = this, o = l - 1, p = a[0], q = m.isFunction(p);
        if (q || l > 1 && "string" == typeof p && !k.checkClone && nb.test(p))return this.each(function (c) {
            var d = n.eq(c);
            q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b)
        });
        if (l && (i = m.buildFragment(a, this[0].ownerDocument, !1, this), c = i.firstChild, 1 === i.childNodes.length && (i = c), c)) {
            for (g = m.map(ub(i, "script"), xb), f = g.length; l > j; j++)d = i, j !== o && (d = m.clone(d, !0, !0), f && m.merge(g, ub(d, "script"))), b.call(this[j], d, j);
            if (f)for (h = g[g.length - 1].ownerDocument, m.map(g, yb), j = 0; f > j; j++)d = g[j], ob.test(d.type || "") && !m._data(d, "globalEval") && m.contains(h, d) && (d.src ? m._evalUrl && m._evalUrl(d.src) : m.globalEval((d.text || d.textContent || d.innerHTML || "").replace(qb, "")));
            i = c = null
        }
        return this
    }}), m.each({appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith"}, function (a, b) {
        m.fn[a] = function (a) {
            for (var c, d = 0, e = [], g = m(a), h = g.length - 1; h >= d; d++)c = d === h ? this : this.clone(!0), m(g[d])[b](c), f.apply(e, c.get());
            return this.pushStack(e)
        }
    });
    var Cb, Db = {};

    function Eb(b, c) {
        var d, e = m(c.createElement(b)).appendTo(c.body), f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : m.css(e[0], "display");
        return e.detach(), f
    }

    function Fb(a) {
        var b = y, c = Db[a];
        return c || (c = Eb(a, b), "none" !== c && c || (Cb = (Cb || m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = (Cb[0].contentWindow || Cb[0].contentDocument).document, b.write(), b.close(), c = Eb(a, b), Cb.detach()), Db[a] = c), c
    }

    !function () {
        var a;
        k.shrinkWrapBlocks = function () {
            if (null != a)return a;
            a = !1;
            var b, c, d;
            return c = y.getElementsByTagName("body")[0], c && c.style ? (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== K && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", b.appendChild(y.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), c.removeChild(d), a) : void 0
        }
    }();
    var Gb = /^margin/, Hb = new RegExp("^(" + S + ")(?!px)[a-z%]+$", "i"), Ib, Jb, Kb = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (Ib = function (b) {
        return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null)
    }, Jb = function (a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ib(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || m.contains(a.ownerDocument, a) || (g = m.style(a, b)), Hb.test(g) && Gb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
    }) : y.documentElement.currentStyle && (Ib = function (a) {
        return a.currentStyle
    }, Jb = function (a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ib(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), Hb.test(g) && !Kb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
    });
    function Lb(a, b) {
        return{get: function () {
            var c = a();
            if (null != c)return c ? void delete this.get : (this.get = b).apply(this, arguments)
        }}
    }

    !function () {
        var b, c, d, e, f, g, h;
        if (b = y.createElement("div"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = d && d.style) {
            c.cssText = "float:left;opacity:.5", k.opacity = "0.5" === c.opacity, k.cssFloat = !!c.cssFloat, b.style.backgroundClip = "content-box", b.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === b.style.backgroundClip, k.boxSizing = "" === c.boxSizing || "" === c.MozBoxSizing || "" === c.WebkitBoxSizing, m.extend(k, {reliableHiddenOffsets: function () {
                return null == g && i(), g
            }, boxSizingReliable: function () {
                return null == f && i(), f
            }, pixelPosition: function () {
                return null == e && i(), e
            }, reliableMarginRight: function () {
                return null == h && i(), h
            }});
            function i() {
                var b, c, d, i;
                c = y.getElementsByTagName("body")[0], c && c.style && (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", e = f = !1, h = !0, a.getComputedStyle && (e = "1%" !== (a.getComputedStyle(b, null) || {}).top, f = "4px" === (a.getComputedStyle(b, null) || {width: "4px"}).width, i = b.appendChild(y.createElement("div")), i.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", i.style.marginRight = i.style.width = "0", b.style.width = "1px", h = !parseFloat((a.getComputedStyle(i, null) || {}).marginRight), b.removeChild(i)), b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", i = b.getElementsByTagName("td"), i[0].style.cssText = "margin:0;border:0;padding:0;display:none", g = 0 === i[0].offsetHeight, g && (i[0].style.display = "", i[1].style.display = "none", g = 0 === i[0].offsetHeight), c.removeChild(d))
            }
        }
    }(), m.swap = function (a, b, c, d) {
        var e, f, g = {};
        for (f in b)g[f] = a.style[f], a.style[f] = b[f];
        e = c.apply(a, d || []);
        for (f in b)a.style[f] = g[f];
        return e
    };
    var Mb = /alpha\([^)]*\)/i, Nb = /opacity\s*=\s*([^)]*)/, Ob = /^(none|table(?!-c[ea]).+)/, Pb = new RegExp("^(" + S + ")(.*)$", "i"), Qb = new RegExp("^([+-])=(" + S + ")", "i"), Rb = {position: "absolute", visibility: "hidden", display: "block"}, Sb = {letterSpacing: "0", fontWeight: "400"}, Tb = ["Webkit", "O", "Moz", "ms"];

    function Ub(a, b) {
        if (b in a)return b;
        var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = Tb.length;
        while (e--)if (b = Tb[e] + c, b in a)return b;
        return d
    }

    function Vb(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)d = a[g], d.style && (f[g] = m._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && U(d) && (f[g] = m._data(d, "olddisplay", Fb(d.nodeName)))) : (e = U(d), (c && "none" !== c || !e) && m._data(d, "olddisplay", e ? c : m.css(d, "display"))));
        for (g = 0; h > g; g++)d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        return a
    }

    function Wb(a, b, c) {
        var d = Pb.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
    }

    function Xb(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)"margin" === c && (g += m.css(a, c + T[f], !0, e)), d ? ("content" === c && (g -= m.css(a, "padding" + T[f], !0, e)), "margin" !== c && (g -= m.css(a, "border" + T[f] + "Width", !0, e))) : (g += m.css(a, "padding" + T[f], !0, e), "padding" !== c && (g += m.css(a, "border" + T[f] + "Width", !0, e)));
        return g
    }

    function Yb(a, b, c) {
        var d = !0, e = "width" === b ? a.offsetWidth : a.offsetHeight, f = Ib(a), g = k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = Jb(a, b, f), (0 > e || null == e) && (e = a.style[b]), Hb.test(e))return e;
            d = g && (k.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
        }
        return e + Xb(a, b, c || (g ? "border" : "content"), d, f) + "px"
    }

    m.extend({cssHooks: {opacity: {get: function (a, b) {
        if (b) {
            var c = Jb(a, "opacity");
            return"" === c ? "1" : c
        }
    }}}, cssNumber: {columnCount: !0, fillOpacity: !0, flexGrow: !0, flexShrink: !0, fontWeight: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0}, cssProps: {"float": k.cssFloat ? "cssFloat" : "styleFloat"}, style: function (a, b, c, d) {
        if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
            var e, f, g, h = m.camelCase(b), i = a.style;
            if (b = m.cssProps[h] || (m.cssProps[h] = Ub(i, h)), g = m.cssHooks[b] || m.cssHooks[h], void 0 === c)return g && "get"in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
            if (f = typeof c, "string" === f && (e = Qb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(m.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || m.cssNumber[h] || (c += "px"), k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set"in g && void 0 === (c = g.set(a, c, d)))))try {
                i[b] = c
            } catch (j) {
            }
        }
    }, css: function (a, b, c, d) {
        var e, f, g, h = m.camelCase(b);
        return b = m.cssProps[h] || (m.cssProps[h] = Ub(a.style, h)), g = m.cssHooks[b] || m.cssHooks[h], g && "get"in g && (f = g.get(a, !0, c)), void 0 === f && (f = Jb(a, b, d)), "normal" === f && b in Sb && (f = Sb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || m.isNumeric(e) ? e || 0 : f) : f
    }}), m.each(["height", "width"], function (a, b) {
        m.cssHooks[b] = {get: function (a, c, d) {
            return c ? Ob.test(m.css(a, "display")) && 0 === a.offsetWidth ? m.swap(a, Rb, function () {
                return Yb(a, b, d)
            }) : Yb(a, b, d) : void 0
        }, set: function (a, c, d) {
            var e = d && Ib(a);
            return Wb(a, c, d ? Xb(a, b, d, k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, e), e) : 0)
        }}
    }), k.opacity || (m.cssHooks.opacity = {get: function (a, b) {
        return Nb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
    }, set: function (a, b) {
        var c = a.style, d = a.currentStyle, e = m.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "", f = d && d.filter || c.filter || "";
        c.zoom = 1, (b >= 1 || "" === b) && "" === m.trim(f.replace(Mb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = Mb.test(f) ? f.replace(Mb, e) : f + " " + e)
    }}), m.cssHooks.marginRight = Lb(k.reliableMarginRight, function (a, b) {
        return b ? m.swap(a, {display: "inline-block"}, Jb, [a, "marginRight"]) : void 0
    }), m.each({margin: "", padding: "", border: "Width"}, function (a, b) {
        m.cssHooks[a + b] = {expand: function (c) {
            for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)e[a + T[d] + b] = f[d] || f[d - 2] || f[0];
            return e
        }}, Gb.test(a) || (m.cssHooks[a + b].set = Wb)
    }), m.fn.extend({css: function (a, b) {
        return V(this, function (a, b, c) {
            var d, e, f = {}, g = 0;
            if (m.isArray(b)) {
                for (d = Ib(a), e = b.length; e > g; g++)f[b[g]] = m.css(a, b[g], !1, d);
                return f
            }
            return void 0 !== c ? m.style(a, b, c) : m.css(a, b)
        }, a, b, arguments.length > 1)
    }, show: function () {
        return Vb(this, !0)
    }, hide: function () {
        return Vb(this)
    }, toggle: function (a) {
        return"boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
            U(this) ? m(this).show() : m(this).hide()
        })
    }});
    function Zb(a, b, c, d, e) {
        return new Zb.prototype.init(a, b, c, d, e)
    }

    m.Tween = Zb, Zb.prototype = {constructor: Zb, init: function (a, b, c, d, e, f) {
        this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (m.cssNumber[c] ? "" : "px")
    }, cur: function () {
        var a = Zb.propHooks[this.prop];
        return a && a.get ? a.get(this) : Zb.propHooks._default.get(this)
    }, run: function (a) {
        var b, c = Zb.propHooks[this.prop];
        return this.pos = b = this.options.duration ? m.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : Zb.propHooks._default.set(this), this
    }}, Zb.prototype.init.prototype = Zb.prototype, Zb.propHooks = {_default: {get: function (a) {
        var b;
        return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = m.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
    }, set: function (a) {
        m.fx.step[a.prop] ? m.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[m.cssProps[a.prop]] || m.cssHooks[a.prop]) ? m.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
    }}}, Zb.propHooks.scrollTop = Zb.propHooks.scrollLeft = {set: function (a) {
        a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
    }}, m.easing = {linear: function (a) {
        return a
    }, swing: function (a) {
        return.5 - Math.cos(a * Math.PI) / 2
    }}, m.fx = Zb.prototype.init, m.fx.step = {};
    var $b, _b, ac = /^(?:toggle|show|hide)$/, bc = new RegExp("^(?:([+-])=|)(" + S + ")([a-z%]*)$", "i"), cc = /queueHooks$/, dc = [ic], ec = {"*": [function (a, b) {
        var c = this.createTween(a, b), d = c.cur(), e = bc.exec(b), f = e && e[3] || (m.cssNumber[a] ? "" : "px"), g = (m.cssNumber[a] || "px" !== f && +d) && bc.exec(m.css(c.elem, a)), h = 1, i = 20;
        if (g && g[3] !== f) {
            f = f || g[3], e = e || [], g = +d || 1;
            do h = h || ".5", g /= h, m.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
        }
        return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
    }]};

    function fc() {
        return setTimeout(function () {
            $b = void 0
        }), $b = m.now()
    }

    function gc(a, b) {
        var c, d = {height: a}, e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b)c = T[e], d["margin" + c] = d["padding" + c] = a;
        return b && (d.opacity = d.width = a), d
    }

    function hc(a, b, c) {
        for (var d, e = (ec[b] || []).concat(ec["*"]), f = 0, g = e.length; g > f; f++)if (d = e[f].call(c, b, a))return d
    }

    function ic(a, b, c) {
        var d, e, f, g, h, i, j, l, n = this, o = {}, p = a.style, q = a.nodeType && U(a), r = m._data(a, "fxshow");
        c.queue || (h = m._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () {
            h.unqueued || i()
        }), h.unqueued++, n.always(function () {
            n.always(function () {
                h.unqueued--, m.queue(a, "fx").length || h.empty.fire()
            })
        })), 1 === a.nodeType && ("height"in b || "width"in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY], j = m.css(a, "display"), l = "none" === j ? m._data(a, "olddisplay") || Fb(a.nodeName) : j, "inline" === l && "none" === m.css(a, "float") && (k.inlineBlockNeedsLayout && "inline" !== Fb(a.nodeName) ? p.zoom = 1 : p.display = "inline-block")), c.overflow && (p.overflow = "hidden", k.shrinkWrapBlocks() || n.always(function () {
            p.overflow = c.overflow[0], p.overflowX = c.overflow[1], p.overflowY = c.overflow[2]
        }));
        for (d in b)if (e = b[d], ac.exec(e)) {
            if (delete b[d], f = f || "toggle" === e, e === (q ? "hide" : "show")) {
                if ("show" !== e || !r || void 0 === r[d])continue;
                q = !0
            }
            o[d] = r && r[d] || m.style(a, d)
        } else j = void 0;
        if (m.isEmptyObject(o))"inline" === ("none" === j ? Fb(a.nodeName) : j) && (p.display = j); else {
            r ? "hidden"in r && (q = r.hidden) : r = m._data(a, "fxshow", {}), f && (r.hidden = !q), q ? m(a).show() : n.done(function () {
                m(a).hide()
            }), n.done(function () {
                var b;
                m._removeData(a, "fxshow");
                for (b in o)m.style(a, b, o[b])
            });
            for (d in o)g = hc(q ? r[d] : 0, d, n), d in r || (r[d] = g.start, q && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
        }
    }

    function jc(a, b) {
        var c, d, e, f, g;
        for (c in a)if (d = m.camelCase(c), e = b[d], f = a[c], m.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = m.cssHooks[d], g && "expand"in g) {
            f = g.expand(f), delete a[d];
            for (c in f)c in a || (a[c] = f[c], b[c] = e)
        } else b[d] = e
    }

    function kc(a, b, c) {
        var d, e, f = 0, g = dc.length, h = m.Deferred().always(function () {
            delete i.elem
        }), i = function () {
            if (e)return!1;
            for (var b = $b || fc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)j.tweens[g].run(f);
            return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
        }, j = h.promise({elem: a, props: m.extend({}, b), opts: m.extend(!0, {specialEasing: {}}, c), originalProperties: b, originalOptions: c, startTime: $b || fc(), duration: c.duration, tweens: [], createTween: function (b, c) {
            var d = m.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
            return j.tweens.push(d), d
        }, stop: function (b) {
            var c = 0, d = b ? j.tweens.length : 0;
            if (e)return this;
            for (e = !0; d > c; c++)j.tweens[c].run(1);
            return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
        }}), k = j.props;
        for (jc(k, j.opts.specialEasing); g > f; f++)if (d = dc[f].call(j, a, k, j.opts))return d;
        return m.map(k, hc, j), m.isFunction(j.opts.start) && j.opts.start.call(a, j), m.fx.timer(m.extend(i, {elem: a, anim: j, queue: j.opts.queue})), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
    }

    m.Animation = m.extend(kc, {tweener: function (a, b) {
        m.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
        for (var c, d = 0, e = a.length; e > d; d++)c = a[d], ec[c] = ec[c] || [], ec[c].unshift(b)
    }, prefilter: function (a, b) {
        b ? dc.unshift(a) : dc.push(a)
    }}), m.speed = function (a, b, c) {
        var d = a && "object" == typeof a ? m.extend({}, a) : {complete: c || !c && b || m.isFunction(a) && a, duration: a, easing: c && b || b && !m.isFunction(b) && b};
        return d.duration = m.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in m.fx.speeds ? m.fx.speeds[d.duration] : m.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function () {
            m.isFunction(d.old) && d.old.call(this), d.queue && m.dequeue(this, d.queue)
        }, d
    }, m.fn.extend({fadeTo: function (a, b, c, d) {
        return this.filter(U).css("opacity", 0).show().end().animate({opacity: b}, a, c, d)
    }, animate: function (a, b, c, d) {
        var e = m.isEmptyObject(a), f = m.speed(b, c, d), g = function () {
            var b = kc(this, m.extend({}, a), f);
            (e || m._data(this, "finish")) && b.stop(!0)
        };
        return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
    }, stop: function (a, b, c) {
        var d = function (a) {
            var b = a.stop;
            delete a.stop, b(c)
        };
        return"string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () {
            var b = !0, e = null != a && a + "queueHooks", f = m.timers, g = m._data(this);
            if (e)g[e] && g[e].stop && d(g[e]); else for (e in g)g[e] && g[e].stop && cc.test(e) && d(g[e]);
            for (e = f.length; e--;)f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
            (b || !c) && m.dequeue(this, a)
        })
    }, finish: function (a) {
        return a !== !1 && (a = a || "fx"), this.each(function () {
            var b, c = m._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = m.timers, g = d ? d.length : 0;
            for (c.finish = !0, m.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;)f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
            for (b = 0; g > b; b++)d[b] && d[b].finish && d[b].finish.call(this);
            delete c.finish
        })
    }}), m.each(["toggle", "show", "hide"], function (a, b) {
        var c = m.fn[b];
        m.fn[b] = function (a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(gc(b, !0), a, d, e)
        }
    }), m.each({slideDown: gc("show"), slideUp: gc("hide"), slideToggle: gc("toggle"), fadeIn: {opacity: "show"}, fadeOut: {opacity: "hide"}, fadeToggle: {opacity: "toggle"}}, function (a, b) {
        m.fn[a] = function (a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), m.timers = [], m.fx.tick = function () {
        var a, b = m.timers, c = 0;
        for ($b = m.now(); c < b.length; c++)a = b[c], a() || b[c] !== a || b.splice(c--, 1);
        b.length || m.fx.stop(), $b = void 0
    }, m.fx.timer = function (a) {
        m.timers.push(a), a() ? m.fx.start() : m.timers.pop()
    }, m.fx.interval = 13, m.fx.start = function () {
        _b || (_b = setInterval(m.fx.tick, m.fx.interval))
    }, m.fx.stop = function () {
        clearInterval(_b), _b = null
    }, m.fx.speeds = {slow: 600, fast: 200, _default: 400}, m.fn.delay = function (a, b) {
        return a = m.fx ? m.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) {
            var d = setTimeout(b, a);
            c.stop = function () {
                clearTimeout(d)
            }
        })
    }, function () {
        var a, b, c, d, e;
        b = y.createElement("div"), b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = y.createElement("select"), e = c.appendChild(y.createElement("option")), a = b.getElementsByTagName("input")[0], d.style.cssText = "top:1px", k.getSetAttribute = "t" !== b.className, k.style = /top/.test(d.getAttribute("style")), k.hrefNormalized = "/a" === d.getAttribute("href"), k.checkOn = !!a.value, k.optSelected = e.selected, k.enctype = !!y.createElement("form").enctype, c.disabled = !0, k.optDisabled = !e.disabled, a = y.createElement("input"), a.setAttribute("value", ""), k.input = "" === a.getAttribute("value"), a.value = "t", a.setAttribute("type", "radio"), k.radioValue = "t" === a.value
    }();
    var lc = /\r/g;
    m.fn.extend({val: function (a) {
        var b, c, d, e = this[0];
        {
            if (arguments.length)return d = m.isFunction(a), this.each(function (c) {
                var e;
                1 === this.nodeType && (e = d ? a.call(this, c, m(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : m.isArray(e) && (e = m.map(e, function (a) {
                    return null == a ? "" : a + ""
                })), b = m.valHooks[this.type] || m.valHooks[this.nodeName.toLowerCase()], b && "set"in b && void 0 !== b.set(this, e, "value") || (this.value = e))
            });
            if (e)return b = m.valHooks[e.type] || m.valHooks[e.nodeName.toLowerCase()], b && "get"in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(lc, "") : null == c ? "" : c)
        }
    }}), m.extend({valHooks: {option: {get: function (a) {
        var b = m.find.attr(a, "value");
        return null != b ? b : m.trim(m.text(a))
    }}, select: {get: function (a) {
        for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)if (c = d[i], !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && m.nodeName(c.parentNode, "optgroup"))) {
            if (b = m(c).val(), f)return b;
            g.push(b)
        }
        return g
    }, set: function (a, b) {
        var c, d, e = a.options, f = m.makeArray(b), g = e.length;
        while (g--)if (d = e[g], m.inArray(m.valHooks.option.get(d), f) >= 0)try {
            d.selected = c = !0
        } catch (h) {
            d.scrollHeight
        } else d.selected = !1;
        return c || (a.selectedIndex = -1), e
    }}}}), m.each(["radio", "checkbox"], function () {
        m.valHooks[this] = {set: function (a, b) {
            return m.isArray(b) ? a.checked = m.inArray(m(a).val(), b) >= 0 : void 0
        }}, k.checkOn || (m.valHooks[this].get = function (a) {
            return null === a.getAttribute("value") ? "on" : a.value
        })
    });
    var mc, nc, oc = m.expr.attrHandle, pc = /^(?:checked|selected)$/i, qc = k.getSetAttribute, rc = k.input;
    m.fn.extend({attr: function (a, b) {
        return V(this, m.attr, a, b, arguments.length > 1)
    }, removeAttr: function (a) {
        return this.each(function () {
            m.removeAttr(this, a)
        })
    }}), m.extend({attr: function (a, b, c) {
        var d, e, f = a.nodeType;
        if (a && 3 !== f && 8 !== f && 2 !== f)return typeof a.getAttribute === K ? m.prop(a, b, c) : (1 === f && m.isXMLDoc(a) || (b = b.toLowerCase(), d = m.attrHooks[b] || (m.expr.match.bool.test(b) ? nc : mc)), void 0 === c ? d && "get"in d && null !== (e = d.get(a, b)) ? e : (e = m.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set"in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void m.removeAttr(a, b))
    }, removeAttr: function (a, b) {
        var c, d, e = 0, f = b && b.match(E);
        if (f && 1 === a.nodeType)while (c = f[e++])d = m.propFix[c] || c, m.expr.match.bool.test(c) ? rc && qc || !pc.test(c) ? a[d] = !1 : a[m.camelCase("default-" + c)] = a[d] = !1 : m.attr(a, c, ""), a.removeAttribute(qc ? c : d)
    }, attrHooks: {type: {set: function (a, b) {
        if (!k.radioValue && "radio" === b && m.nodeName(a, "input")) {
            var c = a.value;
            return a.setAttribute("type", b), c && (a.value = c), b
        }
    }}}}), nc = {set: function (a, b, c) {
        return b === !1 ? m.removeAttr(a, c) : rc && qc || !pc.test(c) ? a.setAttribute(!qc && m.propFix[c] || c, c) : a[m.camelCase("default-" + c)] = a[c] = !0, c
    }}, m.each(m.expr.match.bool.source.match(/\w+/g), function (a, b) {
        var c = oc[b] || m.find.attr;
        oc[b] = rc && qc || !pc.test(b) ? function (a, b, d) {
            var e, f;
            return d || (f = oc[b], oc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, oc[b] = f), e
        } : function (a, b, c) {
            return c ? void 0 : a[m.camelCase("default-" + b)] ? b.toLowerCase() : null
        }
    }), rc && qc || (m.attrHooks.value = {set: function (a, b, c) {
        return m.nodeName(a, "input") ? void(a.defaultValue = b) : mc && mc.set(a, b, c)
    }}), qc || (mc = {set: function (a, b, c) {
        var d = a.getAttributeNode(c);
        return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
    }}, oc.id = oc.name = oc.coords = function (a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
    }, m.valHooks.button = {get: function (a, b) {
        var c = a.getAttributeNode(b);
        return c && c.specified ? c.value : void 0
    }, set: mc.set}, m.attrHooks.contenteditable = {set: function (a, b, c) {
        mc.set(a, "" === b ? !1 : b, c)
    }}, m.each(["width", "height"], function (a, b) {
        m.attrHooks[b] = {set: function (a, c) {
            return"" === c ? (a.setAttribute(b, "auto"), c) : void 0
        }}
    })), k.style || (m.attrHooks.style = {get: function (a) {
        return a.style.cssText || void 0
    }, set: function (a, b) {
        return a.style.cssText = b + ""
    }});
    var sc = /^(?:input|select|textarea|button|object)$/i, tc = /^(?:a|area)$/i;
    m.fn.extend({prop: function (a, b) {
        return V(this, m.prop, a, b, arguments.length > 1)
    }, removeProp: function (a) {
        return a = m.propFix[a] || a, this.each(function () {
            try {
                this[a] = void 0, delete this[a]
            } catch (b) {
            }
        })
    }}), m.extend({propFix: {"for": "htmlFor", "class": "className"}, prop: function (a, b, c) {
        var d, e, f, g = a.nodeType;
        if (a && 3 !== g && 8 !== g && 2 !== g)return f = 1 !== g || !m.isXMLDoc(a), f && (b = m.propFix[b] || b, e = m.propHooks[b]), void 0 !== c ? e && "set"in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get"in e && null !== (d = e.get(a, b)) ? d : a[b]
    }, propHooks: {tabIndex: {get: function (a) {
        var b = m.find.attr(a, "tabindex");
        return b ? parseInt(b, 10) : sc.test(a.nodeName) || tc.test(a.nodeName) && a.href ? 0 : -1
    }}}}), k.hrefNormalized || m.each(["href", "src"], function (a, b) {
        m.propHooks[b] = {get: function (a) {
            return a.getAttribute(b, 4)
        }}
    }), k.optSelected || (m.propHooks.selected = {get: function (a) {
        var b = a.parentNode;
        return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
    }}), m.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        m.propFix[this.toLowerCase()] = this
    }), k.enctype || (m.propFix.enctype = "encoding");
    var uc = /[\t\r\n\f]/g;
    m.fn.extend({addClass: function (a) {
        var b, c, d, e, f, g, h = 0, i = this.length, j = "string" == typeof a && a;
        if (m.isFunction(a))return this.each(function (b) {
            m(this).addClass(a.call(this, b, this.className))
        });
        if (j)for (b = (a || "").match(E) || []; i > h; h++)if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : " ")) {
            f = 0;
            while (e = b[f++])d.indexOf(" " + e + " ") < 0 && (d += e + " ");
            g = m.trim(d), c.className !== g && (c.className = g)
        }
        return this
    }, removeClass: function (a) {
        var b, c, d, e, f, g, h = 0, i = this.length, j = 0 === arguments.length || "string" == typeof a && a;
        if (m.isFunction(a))return this.each(function (b) {
            m(this).removeClass(a.call(this, b, this.className))
        });
        if (j)for (b = (a || "").match(E) || []; i > h; h++)if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : "")) {
            f = 0;
            while (e = b[f++])while (d.indexOf(" " + e + " ") >= 0)d = d.replace(" " + e + " ", " ");
            g = a ? m.trim(d) : "", c.className !== g && (c.className = g)
        }
        return this
    }, toggleClass: function (a, b) {
        var c = typeof a;
        return"boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(m.isFunction(a) ? function (c) {
            m(this).toggleClass(a.call(this, c, this.className, b), b)
        } : function () {
            if ("string" === c) {
                var b, d = 0, e = m(this), f = a.match(E) || [];
                while (b = f[d++])e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
            } else(c === K || "boolean" === c) && (this.className && m._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : m._data(this, "__className__") || "")
        })
    }, hasClass: function (a) {
        for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(uc, " ").indexOf(b) >= 0)return!0;
        return!1
    }}), m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
        m.fn[b] = function (a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
        }
    }), m.fn.extend({hover: function (a, b) {
        return this.mouseenter(a).mouseleave(b || a)
    }, bind: function (a, b, c) {
        return this.on(a, null, b, c)
    }, unbind: function (a, b) {
        return this.off(a, null, b)
    }, delegate: function (a, b, c, d) {
        return this.on(b, a, c, d)
    }, undelegate: function (a, b, c) {
        return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
    }});
    var vc = m.now(), wc = /\?/, xc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    m.parseJSON = function (b) {
        if (a.JSON && a.JSON.parse)return a.JSON.parse(b + "");
        var c, d = null, e = m.trim(b + "");
        return e && !m.trim(e.replace(xc, function (a, b, e, f) {
            return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
        })) ? Function("return " + e)() : m.error("Invalid JSON: " + b)
    }, m.parseXML = function (b) {
        var c, d;
        if (!b || "string" != typeof b)return null;
        try {
            a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
        } catch (e) {
            c = void 0
        }
        return c && c.documentElement && !c.getElementsByTagName("parsererror").length || m.error("Invalid XML: " + b), c
    };
    var yc, zc, Ac = /#.*$/, Bc = /([?&])_=[^&]*/, Cc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Dc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Ec = /^(?:GET|HEAD)$/, Fc = /^\/\//, Gc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Hc = {}, Ic = {}, Jc = "*/".concat("*");
    try {
        zc = location.href
    } catch (Kc) {
        zc = y.createElement("a"), zc.href = "", zc = zc.href
    }
    yc = Gc.exec(zc.toLowerCase()) || [];
    function Lc(a) {
        return function (b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e = 0, f = b.toLowerCase().match(E) || [];
            if (m.isFunction(c))while (d = f[e++])"+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
        }
    }

    function Mc(a, b, c, d) {
        var e = {}, f = a === Ic;

        function g(h) {
            var i;
            return e[h] = !0, m.each(a[h] || [], function (a, h) {
                var j = h(b, c, d);
                return"string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1)
            }), i
        }

        return g(b.dataTypes[0]) || !e["*"] && g("*")
    }

    function Nc(a, b) {
        var c, d, e = m.ajaxSettings.flatOptions || {};
        for (d in b)void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        return c && m.extend(!0, a, c), a
    }

    function Oc(a, b, c) {
        var d, e, f, g, h = a.contents, i = a.dataTypes;
        while ("*" === i[0])i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        if (e)for (g in h)if (h[g] && h[g].test(e)) {
            i.unshift(g);
            break
        }
        if (i[0]in c)f = i[0]; else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break
                }
                d || (d = g)
            }
            f = f || d
        }
        return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
    }

    function Pc(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1])for (g in a.converters)j[g.toLowerCase()] = a.converters[g];
        f = k.shift();
        while (f)if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())if ("*" === f)f = i; else if ("*" !== i && i !== f) {
            if (g = j[i + " " + f] || j["* " + f], !g)for (e in j)if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                break
            }
            if (g !== !0)if (g && a["throws"])b = g(b); else try {
                b = g(b)
            } catch (l) {
                return{state: "parsererror", error: g ? l : "No conversion from " + i + " to " + f}
            }
        }
        return{state: "success", data: b}
    }

    m.extend({active: 0, lastModified: {}, etag: {}, ajaxSettings: {url: zc, type: "GET", isLocal: Dc.test(yc[1]), global: !0, processData: !0, async: !0, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: {"*": Jc, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript"}, contents: {xml: /xml/, html: /html/, json: /json/}, responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"}, converters: {"* text": String, "text html": !0, "text json": m.parseJSON, "text xml": m.parseXML}, flatOptions: {url: !0, context: !0}}, ajaxSetup: function (a, b) {
        return b ? Nc(Nc(a, m.ajaxSettings), b) : Nc(m.ajaxSettings, a)
    }, ajaxPrefilter: Lc(Hc), ajaxTransport: Lc(Ic), ajax: function (a, b) {
        "object" == typeof a && (b = a, a = void 0), b = b || {};
        var c, d, e, f, g, h, i, j, k = m.ajaxSetup({}, b), l = k.context || k, n = k.context && (l.nodeType || l.jquery) ? m(l) : m.event, o = m.Deferred(), p = m.Callbacks("once memory"), q = k.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {readyState: 0, getResponseHeader: function (a) {
            var b;
            if (2 === t) {
                if (!j) {
                    j = {};
                    while (b = Cc.exec(f))j[b[1].toLowerCase()] = b[2]
                }
                b = j[a.toLowerCase()]
            }
            return null == b ? null : b
        }, getAllResponseHeaders: function () {
            return 2 === t ? f : null
        }, setRequestHeader: function (a, b) {
            var c = a.toLowerCase();
            return t || (a = s[c] = s[c] || a, r[a] = b), this
        }, overrideMimeType: function (a) {
            return t || (k.mimeType = a), this
        }, statusCode: function (a) {
            var b;
            if (a)if (2 > t)for (b in a)q[b] = [q[b], a[b]]; else v.always(a[v.status]);
            return this
        }, abort: function (a) {
            var b = a || u;
            return i && i.abort(b), x(0, b), this
        }};
        if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || zc) + "").replace(Ac, "").replace(Fc, yc[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = m.trim(k.dataType || "*").toLowerCase().match(E) || [""], null == k.crossDomain && (c = Gc.exec(k.url.toLowerCase()), k.crossDomain = !(!c || c[1] === yc[1] && c[2] === yc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (yc[3] || ("http:" === yc[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = m.param(k.data, k.traditional)), Mc(Hc, k, b, v), 2 === t)return v;
        h = m.event && k.global, h && 0 === m.active++ && m.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !Ec.test(k.type), e = k.url, k.hasContent || (k.data && (e = k.url += (wc.test(e) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = Bc.test(e) ? e.replace(Bc, "$1_=" + vc++) : e + (wc.test(e) ? "&" : "?") + "_=" + vc++)), k.ifModified && (m.lastModified[e] && v.setRequestHeader("If-Modified-Since", m.lastModified[e]), m.etag[e] && v.setRequestHeader("If-None-Match", m.etag[e])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Jc + "; q=0.01" : "") : k.accepts["*"]);
        for (d in k.headers)v.setRequestHeader(d, k.headers[d]);
        if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t))return v.abort();
        u = "abort";
        for (d in{success: 1, error: 1, complete: 1})v[d](k[d]);
        if (i = Mc(Ic, k, b, v)) {
            v.readyState = 1, h && n.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function () {
                v.abort("timeout")
            }, k.timeout));
            try {
                t = 1, i.send(r, x)
            } catch (w) {
                if (!(2 > t))throw w;
                x(-1, w)
            }
        } else x(-1, "No Transport");
        function x(a, b, c, d) {
            var j, r, s, u, w, x = b;
            2 !== t && (t = 2, g && clearTimeout(g), i = void 0, f = d || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, c && (u = Oc(k, v, c)), u = Pc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (m.lastModified[e] = w), w = v.getResponseHeader("etag"), w && (m.etag[e] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, h && n.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), h && (n.trigger("ajaxComplete", [v, k]), --m.active || m.event.trigger("ajaxStop")))
        }

        return v
    }, getJSON: function (a, b, c) {
        return m.get(a, b, c, "json")
    }, getScript: function (a, b) {
        return m.get(a, void 0, b, "script")
    }}), m.each(["get", "post"], function (a, b) {
        m[b] = function (a, c, d, e) {
            return m.isFunction(c) && (e = e || d, d = c, c = void 0), m.ajax({url: a, type: b, dataType: e, data: c, success: d})
        }
    }), m._evalUrl = function (a) {
        return m.ajax({url: a, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0})
    }, m.fn.extend({wrapAll: function (a) {
        if (m.isFunction(a))return this.each(function (b) {
            m(this).wrapAll(a.call(this, b))
        });
        if (this[0]) {
            var b = m(a, this[0].ownerDocument).eq(0).clone(!0);
            this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
                var a = this;
                while (a.firstChild && 1 === a.firstChild.nodeType)a = a.firstChild;
                return a
            }).append(this)
        }
        return this
    }, wrapInner: function (a) {
        return this.each(m.isFunction(a) ? function (b) {
            m(this).wrapInner(a.call(this, b))
        } : function () {
            var b = m(this), c = b.contents();
            c.length ? c.wrapAll(a) : b.append(a)
        })
    }, wrap: function (a) {
        var b = m.isFunction(a);
        return this.each(function (c) {
            m(this).wrapAll(b ? a.call(this, c) : a)
        })
    }, unwrap: function () {
        return this.parent().each(function () {
            m.nodeName(this, "body") || m(this).replaceWith(this.childNodes)
        }).end()
    }}), m.expr.filters.hidden = function (a) {
        return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !k.reliableHiddenOffsets() && "none" === (a.style && a.style.display || m.css(a, "display"))
    }, m.expr.filters.visible = function (a) {
        return!m.expr.filters.hidden(a)
    };
    var Qc = /%20/g, Rc = /\[\]$/, Sc = /\r?\n/g, Tc = /^(?:submit|button|image|reset|file)$/i, Uc = /^(?:input|select|textarea|keygen)/i;

    function Vc(a, b, c, d) {
        var e;
        if (m.isArray(b))m.each(b, function (b, e) {
            c || Rc.test(a) ? d(a, e) : Vc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
        }); else if (c || "object" !== m.type(b))d(a, b); else for (e in b)Vc(a + "[" + e + "]", b[e], c, d)
    }

    m.param = function (a, b) {
        var c, d = [], e = function (a, b) {
            b = m.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
        if (void 0 === b && (b = m.ajaxSettings && m.ajaxSettings.traditional), m.isArray(a) || a.jquery && !m.isPlainObject(a))m.each(a, function () {
            e(this.name, this.value)
        }); else for (c in a)Vc(c, a[c], b, e);
        return d.join("&").replace(Qc, "+")
    }, m.fn.extend({serialize: function () {
        return m.param(this.serializeArray())
    }, serializeArray: function () {
        return this.map(function () {
            var a = m.prop(this, "elements");
            return a ? m.makeArray(a) : this
        }).filter(function () {
            var a = this.type;
            return this.name && !m(this).is(":disabled") && Uc.test(this.nodeName) && !Tc.test(a) && (this.checked || !W.test(a))
        }).map(function (a, b) {
            var c = m(this).val();
            return null == c ? null : m.isArray(c) ? m.map(c, function (a) {
                return{name: b.name, value: a.replace(Sc, "\r\n")}
            }) : {name: b.name, value: c.replace(Sc, "\r\n")}
        }).get()
    }}), m.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function () {
        return!this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && Zc() || $c()
    } : Zc;
    var Wc = 0, Xc = {}, Yc = m.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function () {
        for (var a in Xc)Xc[a](void 0, !0)
    }), k.cors = !!Yc && "withCredentials"in Yc, Yc = k.ajax = !!Yc, Yc && m.ajaxTransport(function (a) {
        if (!a.crossDomain || k.cors) {
            var b;
            return{send: function (c, d) {
                var e, f = a.xhr(), g = ++Wc;
                if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)for (e in a.xhrFields)f[e] = a.xhrFields[e];
                a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                for (e in c)void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                f.send(a.hasContent && a.data || null), b = function (c, e) {
                    var h, i, j;
                    if (b && (e || 4 === f.readyState))if (delete Xc[g], b = void 0, f.onreadystatechange = m.noop, e)4 !== f.readyState && f.abort(); else {
                        j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                        try {
                            i = f.statusText
                        } catch (k) {
                            i = ""
                        }
                        h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                    }
                    j && d(h, i, j, f.getAllResponseHeaders())
                }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Xc[g] = b : b()
            }, abort: function () {
                b && b(void 0, !0)
            }}
        }
    });
    function Zc() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {
        }
    }

    function $c() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {
        }
    }

    m.ajaxSetup({accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents: {script: /(?:java|ecma)script/}, converters: {"text script": function (a) {
        return m.globalEval(a), a
    }}}), m.ajaxPrefilter("script", function (a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), m.ajaxTransport("script", function (a) {
        if (a.crossDomain) {
            var b, c = y.head || m("head")[0] || y.documentElement;
            return{send: function (d, e) {
                b = y.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function (a, c) {
                    (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                }, c.insertBefore(b, c.firstChild)
            }, abort: function () {
                b && b.onload(void 0, !0)
            }}
        }
    });
    var _c = [], ad = /(=)\?(?=&|$)|\?\?/;
    m.ajaxSetup({jsonp: "callback", jsonpCallback: function () {
        var a = _c.pop() || m.expando + "_" + vc++;
        return this[a] = !0, a
    }}), m.ajaxPrefilter("json jsonp", function (b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (ad.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && ad.test(b.data) && "data");
        return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = m.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(ad, "$1" + e) : b.jsonp !== !1 && (b.url += (wc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
            return g || m.error(e + " was not called"), g[0]
        }, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
            g = arguments
        }, d.always(function () {
            a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, _c.push(e)), g && m.isFunction(f) && f(g[0]), g = f = void 0
        }), "script") : void 0
    }), m.parseHTML = function (a, b, c) {
        if (!a || "string" != typeof a)return null;
        "boolean" == typeof b && (c = b, b = !1), b = b || y;
        var d = u.exec(a), e = !c && [];
        return d ? [b.createElement(d[1])] : (d = m.buildFragment([a], b, e), e && e.length && m(e).remove(), m.merge([], d.childNodes))
    };
    var bd = m.fn.load;
    m.fn.load = function (a, b, c) {
        if ("string" != typeof a && bd)return bd.apply(this, arguments);
        var d, e, f, g = this, h = a.indexOf(" ");
        return h >= 0 && (d = m.trim(a.slice(h, a.length)), a = a.slice(0, h)), m.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && m.ajax({url: a, type: f, dataType: "html", data: b}).done(function (a) {
            e = arguments, g.html(d ? m("<div>").append(m.parseHTML(a)).find(d) : a)
        }).complete(c && function (a, b) {
            g.each(c, e || [a.responseText, b, a])
        }), this
    }, m.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
        m.fn[b] = function (a) {
            return this.on(b, a)
        }
    }), m.expr.filters.animated = function (a) {
        return m.grep(m.timers, function (b) {
            return a === b.elem
        }).length
    };
    var cd = a.document.documentElement;

    function dd(a) {
        return m.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
    }

    m.offset = {setOffset: function (a, b, c) {
        var d, e, f, g, h, i, j, k = m.css(a, "position"), l = m(a), n = {};
        "static" === k && (a.style.position = "relative"), h = l.offset(), f = m.css(a, "top"), i = m.css(a, "left"), j = ("absolute" === k || "fixed" === k) && m.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), m.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (n.top = b.top - h.top + g), null != b.left && (n.left = b.left - h.left + e), "using"in b ? b.using.call(a, n) : l.css(n)
    }}, m.fn.extend({offset: function (a) {
        if (arguments.length)return void 0 === a ? this : this.each(function (b) {
            m.offset.setOffset(this, a, b)
        });
        var b, c, d = {top: 0, left: 0}, e = this[0], f = e && e.ownerDocument;
        if (f)return b = f.documentElement, m.contains(b, e) ? (typeof e.getBoundingClientRect !== K && (d = e.getBoundingClientRect()), c = dd(f), {top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0), left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)}) : d
    }, position: function () {
        if (this[0]) {
            var a, b, c = {top: 0, left: 0}, d = this[0];
            return"fixed" === m.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), m.nodeName(a[0], "html") || (c = a.offset()), c.top += m.css(a[0], "borderTopWidth", !0), c.left += m.css(a[0], "borderLeftWidth", !0)), {top: b.top - c.top - m.css(d, "marginTop", !0), left: b.left - c.left - m.css(d, "marginLeft", !0)}
        }
    }, offsetParent: function () {
        return this.map(function () {
            var a = this.offsetParent || cd;
            while (a && !m.nodeName(a, "html") && "static" === m.css(a, "position"))a = a.offsetParent;
            return a || cd
        })
    }}), m.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (a, b) {
        var c = /Y/.test(b);
        m.fn[a] = function (d) {
            return V(this, function (a, d, e) {
                var f = dd(a);
                return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void(f ? f.scrollTo(c ? m(f).scrollLeft() : e, c ? e : m(f).scrollTop()) : a[d] = e)
            }, a, d, arguments.length, null)
        }
    }), m.each(["top", "left"], function (a, b) {
        m.cssHooks[b] = Lb(k.pixelPosition, function (a, c) {
            return c ? (c = Jb(a, b), Hb.test(c) ? m(a).position()[b] + "px" : c) : void 0
        })
    }), m.each({Height: "height", Width: "width"}, function (a, b) {
        m.each({padding: "inner" + a, content: b, "": "outer" + a}, function (c, d) {
            m.fn[d] = function (d, e) {
                var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border");
                return V(this, function (b, c, d) {
                    var e;
                    return m.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? m.css(b, c, g) : m.style(b, c, d, g)
                }, b, f ? d : void 0, f, null)
            }
        })
    }), m.fn.size = function () {
        return this.length
    }, m.fn.andSelf = m.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
        return m
    });
    var ed = a.jQuery, fd = a.$;
    return m.noConflict = function (b) {
        return a.$ === m && (a.$ = fd), b && a.jQuery === m && (a.jQuery = ed), m
    }, typeof b === K && (a.jQuery = a.$ = m), m
});
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (callback) {
            var t = Object(this), len = t.length >>> 0, k = 0, value;
            if (arguments.length === 2) {
                value = arguments[1];
            } else {
                while (k < len && !(k in t)) {
                    k++;
                }
                if (k >= len) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }
                value = t[k++];
            }
            for (; k < len; k++) {
                if (k in t) {
                    value = callback(value, t[k], k, t);
                }
            }
            return value;
        };
    }
    if ('function' !== typeof Array.prototype.filter) {
        Array.prototype.filter = function (func) {
            var t = Object(this), len = t.length >>> 0;
            var res = [];
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i];
                    if (func.call(thisArg, val, i, t)) {
                        res.push(val);
                    }
                }
            }
            return res;
        };
    }
    var isSupportAmd = typeof define === 'function' && define.amd;
    var isFontInstalled = function (fontName) {
        var testFontName = fontName === 'Comic Sans MS' ? 'Courier New' : 'Comic Sans MS';
        var $tester = $('<div>').css({position: 'absolute', left: '-9999px', top: '-9999px', fontSize: '200px'}).text('mmmmmmmmmwwwwwww').appendTo(document.body);
        var originalWidth = $tester.css('fontFamily', testFontName).width();
        var width = $tester.css('fontFamily', fontName + ',' + testFontName).width();
        $tester.remove();
        return originalWidth !== width;
    };
    var agent = {isMac: navigator.appVersion.indexOf('Mac') > -1, isMSIE: navigator.userAgent.indexOf('MSIE') > -1 || navigator.userAgent.indexOf('Trident') > -1, isFF: navigator.userAgent.indexOf('Firefox') > -1, jqueryVersion: parseFloat($.fn.jquery), isSupportAmd: isSupportAmd, hasCodeMirror: isSupportAmd ? require.specified('CodeMirror') : !!window.CodeMirror, isFontInstalled: isFontInstalled, isW3CRangeSupport: !!document.createRange};
    var func = (function () {
        var eq = function (itemA) {
            return function (itemB) {
                return itemA === itemB;
            };
        };
        var eq2 = function (itemA, itemB) {
            return itemA === itemB;
        };
        var peq2 = function (propName) {
            return function (itemA, itemB) {
                return itemA[propName] === itemB[propName];
            };
        };
        var ok = function () {
            return true;
        };
        var fail = function () {
            return false;
        };
        var not = function (f) {
            return function () {
                return!f.apply(f, arguments);
            };
        };
        var and = function (fA, fB) {
            return function (item) {
                return fA(item) && fB(item);
            };
        };
        var self = function (a) {
            return a;
        };
        var idCounter = 0;
        var uniqueId = function (prefix) {
            var id = ++idCounter + '';
            return prefix ? prefix + id : id;
        };
        var rect2bnd = function (rect) {
            var $document = $(document);
            return{top: rect.top + $document.scrollTop(), left: rect.left + $document.scrollLeft(), width: rect.right - rect.left, height: rect.bottom - rect.top};
        };
        var invertObject = function (obj) {
            var inverted = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    inverted[obj[key]] = key;
                }
            }
            return inverted;
        };
        return{eq: eq, eq2: eq2, peq2: peq2, ok: ok, fail: fail, self: self, not: not, and: and, uniqueId: uniqueId, rect2bnd: rect2bnd, invertObject: invertObject};
    })();
    var list = (function () {
        var head = function (array) {
            return array[0];
        };
        var last = function (array) {
            return array[array.length - 1];
        };
        var initial = function (array) {
            return array.slice(0, array.length - 1);
        };
        var tail = function (array) {
            return array.slice(1);
        };
        var find = function (array, pred) {
            for (var idx = 0, len = array.length; idx < len; idx++) {
                var item = array[idx];
                if (pred(item)) {
                    return item;
                }
            }
        };
        var all = function (array, pred) {
            for (var idx = 0, len = array.length; idx < len; idx++) {
                if (!pred(array[idx])) {
                    return false;
                }
            }
            return true;
        };
        var contains = function (array, item) {
            return $.inArray(item, array) !== -1;
        };
        var sum = function (array, fn) {
            fn = fn || func.self;
            return array.reduce(function (memo, v) {
                return memo + fn(v);
            }, 0);
        };
        var from = function (collection) {
            var result = [], idx = -1, length = collection.length;
            while (++idx < length) {
                result[idx] = collection[idx];
            }
            return result;
        };
        var clusterBy = function (array, fn) {
            if (!array.length) {
                return[];
            }
            var aTail = tail(array);
            return aTail.reduce(function (memo, v) {
                var aLast = last(memo);
                if (fn(last(aLast), v)) {
                    aLast[aLast.length] = v;
                } else {
                    memo[memo.length] = [v];
                }
                return memo;
            }, [
                [head(array)]
            ]);
        };
        var compact = function (array) {
            var aResult = [];
            for (var idx = 0, len = array.length; idx < len; idx++) {
                if (array[idx]) {
                    aResult.push(array[idx]);
                }
            }
            return aResult;
        };
        var unique = function (array) {
            var results = [];
            for (var idx = 0, len = array.length; idx < len; idx++) {
                if (!contains(results, array[idx])) {
                    results.push(array[idx]);
                }
            }
            return results;
        };
        var next = function (array, item) {
            var idx = array.indexOf(item);
            if (idx === -1) {
                return null;
            }
            return array[idx + 1];
        };
        var prev = function (array, item) {
            var idx = array.indexOf(item);
            if (idx === -1) {
                return null;
            }
            return array[idx - 1];
        };
        return{head: head, last: last, initial: initial, tail: tail, prev: prev, next: next, find: find, contains: contains, all: all, sum: sum, from: from, clusterBy: clusterBy, compact: compact, unique: unique};
    })();
    var NBSP_CHAR = String.fromCharCode(160);
    var ZERO_WIDTH_NBSP_CHAR = '\ufeff';
    var dom = (function () {
        var isEditable = function (node) {
            return node && $(node).hasClass('note-editable');
        };
        var isControlSizing = function (node) {
            return node && $(node).hasClass('note-control-sizing');
        };
        var buildLayoutInfo = function ($editor) {
            var makeFinder;
            if ($editor.hasClass('note-air-editor')) {
                var id = list.last($editor.attr('id').split('-'));
                makeFinder = function (sIdPrefix) {
                    return function () {
                        return $(sIdPrefix + id);
                    };
                };
                return{editor: function () {
                    return $editor;
                }, editable: function () {
                    return $editor;
                }, popover: makeFinder('#note-popover-'), handle: makeFinder('#note-handle-'), dialog: makeFinder('#note-dialog-')};
            } else {
                makeFinder = function (sClassName) {
                    return function () {
                        return $editor.find(sClassName);
                    };
                };
                return{editor: function () {
                    return $editor;
                }, dropzone: makeFinder('.note-dropzone'), toolbar: makeFinder('.note-toolbar'), editable: makeFinder('.note-editable'), codable: makeFinder('.note-codable'), statusbar: makeFinder('.note-statusbar'), popover: makeFinder('.note-popover'), handle: makeFinder('.note-handle'), dialog: makeFinder('.note-dialog')};
            }
        };
        var makePredByNodeName = function (nodeName) {
            nodeName = nodeName.toUpperCase();
            return function (node) {
                return node && node.nodeName.toUpperCase() === nodeName;
            };
        };
        var isText = function (node) {
            return node && node.nodeType === 3;
        };
        var isVoid = function (node) {
            return node && /^BR|^IMG|^HR/.test(node.nodeName.toUpperCase());
        };
        var isPara = function (node) {
            if (isEditable(node)) {
                return false;
            }
            return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
        };
        var isLi = makePredByNodeName('LI');
        var isPurePara = function (node) {
            return isPara(node) && !isLi(node);
        };
        var isInline = function (node) {
            return!isBodyContainer(node) && !isList(node) && !isPara(node);
        };
        var isList = function (node) {
            return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
        };
        var isCell = function (node) {
            return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
        };
        var isBlockquote = makePredByNodeName('BLOCKQUOTE');
        var isBodyContainer = function (node) {
            return isCell(node) || isBlockquote(node) || isEditable(node);
        };
        var isAnchor = makePredByNodeName('A');
        var isParaInline = function (node) {
            return isInline(node) && !!ancestor(node, isPara);
        };
        var isBodyInline = function (node) {
            return isInline(node) && !ancestor(node, isPara);
        };
        var isBody = makePredByNodeName('BODY');
        var blankHTML = agent.isMSIE ? '&nbsp;' : '<br>';
        var nodeLength = function (node) {
            if (isText(node)) {
                return node.nodeValue.length;
            }
            return node.childNodes.length;
        };
        var isEmpty = function (node) {
            var len = nodeLength(node);
            if (len === 0) {
                return true;
            } else if (!dom.isText(node) && len === 1 && node.innerHTML === blankHTML) {
                return true;
            }
            return false;
        };
        var paddingBlankHTML = function (node) {
            if (!isVoid(node) && !nodeLength(node)) {
                node.innerHTML = blankHTML;
            }
        };
        var ancestor = function (node, pred) {
            while (node) {
                if (pred(node)) {
                    return node;
                }
                if (isEditable(node)) {
                    break;
                }
                node = node.parentNode;
            }
            return null;
        };
        var listAncestor = function (node, pred) {
            pred = pred || func.fail;
            var ancestors = [];
            ancestor(node, function (el) {
                if (!isEditable(el)) {
                    ancestors.push(el);
                }
                return pred(el);
            });
            return ancestors;
        };
        var lastAncestor = function (node, pred) {
            var ancestors = listAncestor(node);
            return list.last(ancestors.filter(pred));
        };
        var commonAncestor = function (nodeA, nodeB) {
            var ancestors = listAncestor(nodeA);
            for (var n = nodeB; n; n = n.parentNode) {
                if ($.inArray(n, ancestors) > -1) {
                    return n;
                }
            }
            return null;
        };
        var listPrev = function (node, pred) {
            pred = pred || func.fail;
            var nodes = [];
            while (node) {
                if (pred(node)) {
                    break;
                }
                nodes.push(node);
                node = node.previousSibling;
            }
            return nodes;
        };
        var listNext = function (node, pred) {
            pred = pred || func.fail;
            var nodes = [];
            while (node) {
                if (pred(node)) {
                    break;
                }
                nodes.push(node);
                node = node.nextSibling;
            }
            return nodes;
        };
        var listDescendant = function (node, pred) {
            var descendents = [];
            pred = pred || func.ok;
            (function fnWalk(current) {
                if (node !== current && pred(current)) {
                    descendents.push(current);
                }
                for (var idx = 0, len = current.childNodes.length; idx < len; idx++) {
                    fnWalk(current.childNodes[idx]);
                }
            })(node);
            return descendents;
        };
        var wrap = function (node, wrapperName) {
            var parent = node.parentNode;
            var wrapper = $('<' + wrapperName + '>')[0];
            parent.insertBefore(wrapper, node);
            wrapper.appendChild(node);
            return wrapper;
        };
        var insertAfter = function (node, preceding) {
            var next = preceding.nextSibling, parent = preceding.parentNode;
            if (next) {
                parent.insertBefore(node, next);
            } else {
                parent.appendChild(node);
            }
            return node;
        };
        var appendChildNodes = function (node, aChild) {
            $.each(aChild, function (idx, child) {
                node.appendChild(child);
            });
            return node;
        };
        var isLeftEdgePoint = function (point) {
            return point.offset === 0;
        };
        var isRightEdgePoint = function (point) {
            return point.offset === nodeLength(point.node);
        };
        var isEdgePoint = function (point) {
            return isLeftEdgePoint(point) || isRightEdgePoint(point);
        };
        var isLeftEdgeOf = function (node, ancestor) {
            while (node && node !== ancestor) {
                if (position(node) !== 0) {
                    return false;
                }
                node = node.parentNode;
            }
            return true;
        };
        var isRightEdgeOf = function (node, ancestor) {
            while (node && node !== ancestor) {
                if (position(node) !== nodeLength(node.parentNode) - 1) {
                    return false;
                }
                node = node.parentNode;
            }
            return true;
        };
        var position = function (node) {
            var offset = 0;
            while ((node = node.previousSibling)) {
                offset += 1;
            }
            return offset;
        };
        var hasChildren = function (node) {
            return!!(node && node.childNodes && node.childNodes.length);
        };
        var prevPoint = function (point, isSkipInnerOffset) {
            var node, offset;
            if (point.offset === 0) {
                if (isEditable(point.node)) {
                    return null;
                }
                node = point.node.parentNode;
                offset = position(point.node);
            } else if (hasChildren(point.node)) {
                node = point.node.childNodes[point.offset - 1];
                offset = nodeLength(node);
            } else {
                node = point.node;
                offset = isSkipInnerOffset ? 0 : point.offset - 1;
            }
            return{node: node, offset: offset};
        };
        var nextPoint = function (point, isSkipInnerOffset) {
            var node, offset;
            if (nodeLength(point.node) === point.offset) {
                if (isEditable(point.node)) {
                    return null;
                }
                node = point.node.parentNode;
                offset = position(point.node) + 1;
            } else if (hasChildren(point.node)) {
                node = point.node.childNodes[point.offset];
                offset = 0;
            } else {
                node = point.node;
                offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;
            }
            return{node: node, offset: offset};
        };
        var isSamePoint = function (pointA, pointB) {
            return pointA.node === pointB.node && pointA.offset === pointB.offset;
        };
        var isVisiblePoint = function (point) {
            if (isText(point.node) || !hasChildren(point.node) || isEmpty(point.node)) {
                return true;
            }
            var leftNode = point.node.childNodes[point.offset - 1];
            var rightNode = point.node.childNodes[point.offset];
            if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode))) {
                return true;
            }
            return false;
        };
        var prevPointUntil = function (point, pred) {
            while (point) {
                if (pred(point)) {
                    return point;
                }
                point = prevPoint(point);
            }
            return null;
        };
        var nextPointUntil = function (point, pred) {
            while (point) {
                if (pred(point)) {
                    return point;
                }
                point = nextPoint(point);
            }
            return null;
        };
        var walkPoint = function (startPoint, endPoint, handler, isSkipInnerOffset) {
            var point = startPoint;
            while (point) {
                handler(point);
                if (isSamePoint(point, endPoint)) {
                    break;
                }
                var isSkipOffset = isSkipInnerOffset && startPoint.node !== point.node && endPoint.node !== point.node;
                point = nextPoint(point, isSkipOffset);
            }
        };
        var makeOffsetPath = function (ancestor, node) {
            var ancestors = listAncestor(node, func.eq(ancestor));
            return $.map(ancestors, position).reverse();
        };
        var fromOffsetPath = function (ancestor, offsets) {
            var current = ancestor;
            for (var i = 0, len = offsets.length; i < len; i++) {
                if (current.childNodes.length <= offsets[i]) {
                    current = current.childNodes[current.childNodes.length - 1];
                } else {
                    current = current.childNodes[offsets[i]];
                }
            }
            return current;
        };
        var splitNode = function (point, isSkipPaddingBlankHTML) {
            if (isText(point.node)) {
                if (isLeftEdgePoint(point)) {
                    return point.node;
                } else if (isRightEdgePoint(point)) {
                    return point.node.nextSibling;
                }
                return point.node.splitText(point.offset);
            }
            var childNode = point.node.childNodes[point.offset];
            var clone = insertAfter(point.node.cloneNode(false), point.node);
            appendChildNodes(clone, listNext(childNode));
            if (!isSkipPaddingBlankHTML) {
                paddingBlankHTML(point.node);
                paddingBlankHTML(clone);
            }
            return clone;
        };
        var splitTree = function (root, point, isSkipPaddingBlankHTML) {
            var ancestors = listAncestor(point.node, func.eq(root));
            if (!ancestors.length) {
                return null;
            } else if (ancestors.length === 1) {
                return splitNode(point, isSkipPaddingBlankHTML);
            }
            return ancestors.reduce(function (node, parent) {
                var clone = insertAfter(parent.cloneNode(false), parent);
                if (node === point.node) {
                    node = splitNode(point, isSkipPaddingBlankHTML);
                }
                appendChildNodes(clone, listNext(node));
                if (!isSkipPaddingBlankHTML) {
                    paddingBlankHTML(parent);
                    paddingBlankHTML(clone);
                }
                return clone;
            });
        };
        var create = function (nodeName) {
            return document.createElement(nodeName);
        };
        var createText = function (text) {
            return document.createTextNode(text);
        };
        var remove = function (node, isRemoveChild) {
            if (!node || !node.parentNode) {
                return;
            }
            if (node.removeNode) {
                return node.removeNode(isRemoveChild);
            }
            var parent = node.parentNode;
            if (!isRemoveChild) {
                var nodes = [];
                var i, len;
                for (i = 0, len = node.childNodes.length; i < len; i++) {
                    nodes.push(node.childNodes[i]);
                }
                for (i = 0, len = nodes.length; i < len; i++) {
                    parent.insertBefore(nodes[i], node);
                }
            }
            parent.removeChild(node);
        };
        var removeWhile = function (node, pred) {
            while (node) {
                if (isEditable(node) || !pred(node)) {
                    break;
                }
                var parent = node.parentNode;
                remove(node);
                node = parent;
            }
        };
        var replace = function (node, nodeName) {
            if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
                return node;
            }
            var newNode = create(nodeName);
            if (node.style.cssText) {
                newNode.style.cssText = node.style.cssText;
            }
            appendChildNodes(newNode, list.from(node.childNodes));
            insertAfter(newNode, node);
            remove(node);
            return newNode;
        };
        var isTextarea = makePredByNodeName('TEXTAREA');
        var html = function ($node, isNewlineOnBlock) {
            var markup = isTextarea($node[0]) ? $node.val() : $node.html();
            if (isNewlineOnBlock) {
                var regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
                markup = markup.replace(regexTag, function (match, endSlash, name) {
                    name = name.toUpperCase();
                    var isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) && !!endSlash;
                    var isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);
                    return match + ((isEndOfInlineContainer || isBlockNode) ? '\n' : '');
                });
                markup = $.trim(markup);
            }
            return markup;
        };
        var value = function ($textarea, stripLinebreaks) {
            var val = $textarea.val();
            if (stripLinebreaks) {
                return val.replace(/[\n\r]/g, '');
            }
            return val;
        };
        return{ NBSP_CHAR: NBSP_CHAR, ZERO_WIDTH_NBSP_CHAR: ZERO_WIDTH_NBSP_CHAR, blank: blankHTML, emptyPara: '<p>' + blankHTML + '</p>', isEditable: isEditable, isControlSizing: isControlSizing, buildLayoutInfo: buildLayoutInfo, isText: isText, isVoid: isVoid, isPara: isPara, isPurePara: isPurePara, isInline: isInline, isBodyInline: isBodyInline, isBody: isBody, isParaInline: isParaInline, isList: isList, isTable: makePredByNodeName('TABLE'), isCell: isCell, isBlockquote: isBlockquote, isBodyContainer: isBodyContainer, isAnchor: isAnchor, isDiv: makePredByNodeName('DIV'), isLi: isLi, isBR: makePredByNodeName('BR'), isSpan: makePredByNodeName('SPAN'), isB: makePredByNodeName('B'), isU: makePredByNodeName('U'), isS: makePredByNodeName('S'), isI: makePredByNodeName('I'), isImg: makePredByNodeName('IMG'), isTextarea: isTextarea, isEmpty: isEmpty, isEmptyAnchor: func.and(isAnchor, isEmpty), nodeLength: nodeLength, isLeftEdgePoint: isLeftEdgePoint, isRightEdgePoint: isRightEdgePoint, isEdgePoint: isEdgePoint, isLeftEdgeOf: isLeftEdgeOf, isRightEdgeOf: isRightEdgeOf, prevPoint: prevPoint, nextPoint: nextPoint, isSamePoint: isSamePoint, isVisiblePoint: isVisiblePoint, prevPointUntil: prevPointUntil, nextPointUntil: nextPointUntil, walkPoint: walkPoint, ancestor: ancestor, listAncestor: listAncestor, lastAncestor: lastAncestor, listNext: listNext, listPrev: listPrev, listDescendant: listDescendant, commonAncestor: commonAncestor, wrap: wrap, insertAfter: insertAfter, appendChildNodes: appendChildNodes, position: position, hasChildren: hasChildren, makeOffsetPath: makeOffsetPath, fromOffsetPath: fromOffsetPath, splitTree: splitTree, create: create, createText: createText, remove: remove, removeWhile: removeWhile, replace: replace, html: html, value: value};
    })();
    var range = (function () {
        var textRangeToPoint = function (textRange, isStart) {
            var container = textRange.parentElement(), offset;
            var tester = document.body.createTextRange(), prevContainer;
            var childNodes = list.from(container.childNodes);
            for (offset = 0; offset < childNodes.length; offset++) {
                if (dom.isText(childNodes[offset])) {
                    continue;
                }
                tester.moveToElementText(childNodes[offset]);
                if (tester.compareEndPoints('StartToStart', textRange) >= 0) {
                    break;
                }
                prevContainer = childNodes[offset];
            }
            if (offset !== 0 && dom.isText(childNodes[offset - 1])) {
                var textRangeStart = document.body.createTextRange(), curTextNode = null;
                textRangeStart.moveToElementText(prevContainer || container);
                textRangeStart.collapse(!prevContainer);
                curTextNode = prevContainer ? prevContainer.nextSibling : container.firstChild;
                var pointTester = textRange.duplicate();
                pointTester.setEndPoint('StartToStart', textRangeStart);
                var textCount = pointTester.text.replace(/[\r\n]/g, '').length;
                while (textCount > curTextNode.nodeValue.length && curTextNode.nextSibling) {
                    textCount -= curTextNode.nodeValue.length;
                    curTextNode = curTextNode.nextSibling;
                }
                var dummy = curTextNode.nodeValue;
                if (isStart && curTextNode.nextSibling && dom.isText(curTextNode.nextSibling) && textCount === curTextNode.nodeValue.length) {
                    textCount -= curTextNode.nodeValue.length;
                    curTextNode = curTextNode.nextSibling;
                }
                container = curTextNode;
                offset = textCount;
            }
            return{cont: container, offset: offset};
        };
        var pointToTextRange = function (point) {
            var textRangeInfo = function (container, offset) {
                var node, isCollapseToStart;
                if (dom.isText(container)) {
                    var prevTextNodes = dom.listPrev(container, func.not(dom.isText));
                    var prevContainer = list.last(prevTextNodes).previousSibling;
                    node = prevContainer || container.parentNode;
                    offset += list.sum(list.tail(prevTextNodes), dom.nodeLength);
                    isCollapseToStart = !prevContainer;
                } else {
                    node = container.childNodes[offset] || container;
                    if (dom.isText(node)) {
                        return textRangeInfo(node, 0);
                    }
                    offset = 0;
                    isCollapseToStart = false;
                }
                return{node: node, collapseToStart: isCollapseToStart, offset: offset};
            };
            var textRange = document.body.createTextRange();
            var info = textRangeInfo(point.node, point.offset);
            textRange.moveToElementText(info.node);
            textRange.collapse(info.collapseToStart);
            textRange.moveStart('character', info.offset);
            return textRange;
        };
        var WrappedRange = function (sc, so, ec, eo) {
            this.sc = sc;
            this.so = so;
            this.ec = ec;
            this.eo = eo;
            var nativeRange = function () {
                if (agent.isW3CRangeSupport) {
                    var w3cRange = document.createRange();
                    w3cRange.setStart(sc, so);
                    w3cRange.setEnd(ec, eo);
                    return w3cRange;
                } else {
                    var textRange = pointToTextRange({node: sc, offset: so});
                    textRange.setEndPoint('EndToEnd', pointToTextRange({node: ec, offset: eo}));
                    return textRange;
                }
            };
            this.getPoints = function () {
                return{sc: sc, so: so, ec: ec, eo: eo};
            };
            this.getStartPoint = function () {
                return{node: sc, offset: so};
            };
            this.getEndPoint = function () {
                return{node: ec, offset: eo};
            };
            this.select = function () {
                var nativeRng = nativeRange();
                if (agent.isW3CRangeSupport) {
                    var selection = document.getSelection();
                    if (selection.rangeCount > 0) {
                        selection.removeAllRanges();
                    }
                    selection.addRange(nativeRng);
                } else {
                    nativeRng.select();
                }
            };
            this.normalize = function () {
                var getVisiblePoint = function (point) {
                    if (!dom.isVisiblePoint(point)) {
                        if (dom.isLeftEdgePoint(point)) {
                            point = dom.nextPointUntil(point, dom.isVisiblePoint);
                        } else {
                            point = dom.prevPointUntil(point, dom.isVisiblePoint);
                        }
                    }
                    return point;
                };
                var startPoint = getVisiblePoint(this.getStartPoint());
                var endPoint = getVisiblePoint(this.getEndPoint());
                return new WrappedRange(startPoint.node, startPoint.offset, endPoint.node, endPoint.offset);
            };
            this.nodes = function (pred, options) {
                pred = pred || func.ok;
                var includeAncestor = options && options.includeAncestor;
                var fullyContains = options && options.fullyContains;
                var startPoint = this.getStartPoint();
                var endPoint = this.getEndPoint();
                var nodes = [];
                var leftEdgeNodes = [];
                dom.walkPoint(startPoint, endPoint, function (point) {
                    if (dom.isEditable(point.node)) {
                        return;
                    }
                    var node;
                    if (fullyContains) {
                        if (dom.isLeftEdgePoint(point)) {
                            leftEdgeNodes.push(point.node);
                        }
                        if (dom.isRightEdgePoint(point) && list.contains(leftEdgeNodes, point.node)) {
                            node = point.node;
                        }
                    } else if (includeAncestor) {
                        node = dom.ancestor(point.node, pred);
                    } else {
                        node = point.node;
                    }
                    if (node && pred(node)) {
                        nodes.push(node);
                    }
                }, true);
                return list.unique(nodes);
            };
            this.commonAncestor = function () {
                return dom.commonAncestor(sc, ec);
            };
            this.expand = function (pred) {
                var startAncestor = dom.ancestor(sc, pred);
                var endAncestor = dom.ancestor(ec, pred);
                if (!startAncestor && !endAncestor) {
                    return new WrappedRange(sc, so, ec, eo);
                }
                var boundaryPoints = this.getPoints();
                if (startAncestor) {
                    boundaryPoints.sc = startAncestor;
                    boundaryPoints.so = 0;
                }
                if (endAncestor) {
                    boundaryPoints.ec = endAncestor;
                    boundaryPoints.eo = dom.nodeLength(endAncestor);
                }
                return new WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
            };
            this.collapse = function (isCollapseToStart) {
                if (isCollapseToStart) {
                    return new WrappedRange(sc, so, sc, so);
                } else {
                    return new WrappedRange(ec, eo, ec, eo);
                }
            };
            this.splitText = function () {
                var isSameContainer = sc === ec;
                var boundaryPoints = this.getPoints();
                if (dom.isText(ec) && !dom.isEdgePoint(this.getEndPoint())) {
                    ec.splitText(eo);
                }
                if (dom.isText(sc) && !dom.isEdgePoint(this.getStartPoint())) {
                    boundaryPoints.sc = sc.splitText(so);
                    boundaryPoints.so = 0;
                    if (isSameContainer) {
                        boundaryPoints.ec = boundaryPoints.sc;
                        boundaryPoints.eo = eo - so;
                    }
                }
                return new WrappedRange(boundaryPoints.sc, boundaryPoints.so, boundaryPoints.ec, boundaryPoints.eo);
            };
            this.deleteContents = function () {
                if (this.isCollapsed()) {
                    return this;
                }
                var rng = this.splitText();
                var nodes = rng.nodes(null, {fullyContains: true});
                var point = dom.prevPointUntil(rng.getStartPoint(), function (point) {
                    return!list.contains(nodes, point.node);
                });
                var emptyParents = [];
                $.each(nodes, function (idx, node) {
                    var parent = node.parentNode;
                    if (point.node !== parent && dom.nodeLength(parent) === 1) {
                        emptyParents.push(parent);
                    }
                    dom.remove(node, false);
                });
                $.each(emptyParents, function (idx, node) {
                    dom.remove(node, false);
                });
                return new WrappedRange(point.node, point.offset, point.node, point.offset).normalize();
            };
            var makeIsOn = function (pred) {
                return function () {
                    var ancestor = dom.ancestor(sc, pred);
                    return!!ancestor && (ancestor === dom.ancestor(ec, pred));
                };
            };
            this.isOnEditable = makeIsOn(dom.isEditable);
            this.isOnList = makeIsOn(dom.isList);
            this.isOnAnchor = makeIsOn(dom.isAnchor);
            this.isOnCell = makeIsOn(dom.isCell);
            this.isLeftEdgeOf = function (pred) {
                if (!dom.isLeftEdgePoint(this.getStartPoint())) {
                    return false;
                }
                var node = dom.ancestor(this.sc, pred);
                return node && dom.isLeftEdgeOf(this.sc, node);
            };
            this.isCollapsed = function () {
                return sc === ec && so === eo;
            };
            this.wrapBodyInlineWithPara = function () {
                if (dom.isBodyContainer(sc) && dom.isEmpty(sc)) {
                    sc.innerHTML = dom.emptyPara;
                    return new WrappedRange(sc.firstChild, 0, sc.firstChild, 0);
                }
                if (dom.isParaInline(sc) || dom.isPara(sc)) {
                    return this.normalize();
                }
                var topAncestor;
                if (dom.isInline(sc)) {
                    var ancestors = dom.listAncestor(sc, func.not(dom.isInline));
                    topAncestor = list.last(ancestors);
                    if (!dom.isInline(topAncestor)) {
                        topAncestor = ancestors[ancestors.length - 2] || sc.childNodes[so];
                    }
                } else {
                    topAncestor = sc.childNodes[so > 0 ? so - 1 : 0];
                }
                var inlineSiblings = dom.listPrev(topAncestor, dom.isParaInline).reverse();
                inlineSiblings = inlineSiblings.concat(dom.listNext(topAncestor.nextSibling, dom.isParaInline));
                if (inlineSiblings.length) {
                    var para = dom.wrap(list.head(inlineSiblings), 'p');
                    dom.appendChildNodes(para, list.tail(inlineSiblings));
                }
                return this.normalize();
            };
            this.insertNode = function (node) {
                var rng = this.wrapBodyInlineWithPara();
                var point = rng.getStartPoint();
                var isInline = dom.isInline(node);

                var pred = isInline ? dom.isPara : dom.isBodyContainer;
                var ancestors = dom.listAncestor(point.node, pred);
                var topAncestor = list.last(ancestors) || point.node;
                var splitRoot, container;
                if (pred(topAncestor)) {
                    splitRoot = ancestors[ancestors.length - 2];
                    container = topAncestor;
                } else {
                    splitRoot = topAncestor;
                    container = splitRoot.parentNode;
                }
                var pivot = splitRoot && dom.splitTree(splitRoot, point, isInline);
                if (pivot) {
                    pivot.parentNode.insertBefore(node, pivot);
                } else {
                    container.appendChild(node);
                }
                return node;
            };
            this.toString = function () {
                var nativeRng = nativeRange();
                return agent.isW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
            };
            this.bookmark = function (editable) {
                return{s: {path: dom.makeOffsetPath(editable, sc), offset: so}, e: {path: dom.makeOffsetPath(editable, ec), offset: eo}};
            };
            this.paraBookmark = function (paras) {
                return{s: {path: list.tail(dom.makeOffsetPath(list.head(paras), sc)), offset: so}, e: {path: list.tail(dom.makeOffsetPath(list.last(paras), ec)), offset: eo}};
            };
            this.getClientRects = function () {
                var nativeRng = nativeRange();
                return nativeRng.getClientRects();
            };
        };
        return{ create: function (sc, so, ec, eo) {
            if (!arguments.length) {
                if (agent.isW3CRangeSupport) {
                    var selection = document.getSelection();
                    if (selection.rangeCount === 0) {
                        return null;
                    } else if (dom.isBody(selection.anchorNode)) {
                        return null;
                    }
                    var nativeRng = selection.getRangeAt(0);
                    sc = nativeRng.startContainer;
                    so = nativeRng.startOffset;
                    ec = nativeRng.endContainer;
                    eo = nativeRng.endOffset;
                } else {
                    var textRange = document.selection.createRange();
                    var textRangeEnd = textRange.duplicate();
                    textRangeEnd.collapse(false);
                    var textRangeStart = textRange;
                    textRangeStart.collapse(true);
                    var startPoint = textRangeToPoint(textRangeStart, true), endPoint = textRangeToPoint(textRangeEnd, false);
                    if (dom.isText(startPoint.node) && dom.isLeftEdgePoint(startPoint) && dom.isTextNode(endPoint.node) && dom.isRightEdgePoint(endPoint) && endPoint.node.nextSibling === startPoint.node) {
                        startPoint = endPoint;
                    }
                    sc = startPoint.cont;
                    so = startPoint.offset;
                    ec = endPoint.cont;
                    eo = endPoint.offset;
                }
            } else if (arguments.length === 2) {
                ec = sc;
                eo = so;
            }
            return new WrappedRange(sc, so, ec, eo);
        }, createFromNode: function (node) {
            var sc = node;
            var so = 0;
            var ec = node;
            var eo = dom.nodeLength(ec);
            if (dom.isVoid(sc)) {
                so = dom.listPrev(sc).length - 1;
                sc = sc.parentNode;
            }
            if (dom.isBR(ec)) {
                eo = dom.listPrev(ec).length - 1;
                ec = ec.parentNode;
            } else if (dom.isVoid(ec)) {
                eo = dom.listPrev(ec).length;
                ec = ec.parentNode;
            }
            return this.create(sc, so, ec, eo);
        }, createFromBookmark: function (editable, bookmark) {
            var sc = dom.fromOffsetPath(editable, bookmark.s.path);
            var so = bookmark.s.offset;
            var ec = dom.fromOffsetPath(editable, bookmark.e.path);
            var eo = bookmark.e.offset;
            return new WrappedRange(sc, so, ec, eo);
        }, createFromParaBookmark: function (bookmark, paras) {
            var so = bookmark.s.offset;
            var eo = bookmark.e.offset;
            var sc = dom.fromOffsetPath(list.head(paras), bookmark.s.path);
            var ec = dom.fromOffsetPath(list.last(paras), bookmark.e.path);
            return new WrappedRange(sc, so, ec, eo);
        }};
    })();
    var settings = {version: '0.6.1', options: {width: null, height: null, minHeight: null, maxHeight: null, focus: false, tabsize: 4, styleWithSpan: true, disableLinkTarget: false, disableDragAndDrop: false, disableResizeEditor: false, shortcuts: true, placeholder: false, prettifyHtml: true, codemirror: { mode: 'text/html', htmlMode: true, lineNumbers: true}, lang: 'en-US', direction: null, toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'hr']],
        ['view', ['fullscreen', 'codeview']],
        ['help', ['help']]
    ], airMode: false,
        airPopover: [
            ['color', ['color']],
            ['font', ['bold', 'underline', 'clear']],
            ['para', ['ul', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']]
        ], styleTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], defaultFontName: 'Helvetica Neue', fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica Neue', 'Impact', 'Lucida Grande', 'Tahoma', 'Times New Roman', 'Verdana'], fontNamesIgnoreCheck: [], colors: [
            ['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF'],
            ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'],
            ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'],
            ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'],
            ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'],
            ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'],
            ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'],
            ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']
        ], lineHeights: ['1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'], insertTableMaxSize: {col: 10, row: 10}, maximumImageFileSize: null,
        oninit: null, onfocus: null, onblur: null, onenter: null, onkeyup: null, onkeydown: null, onImageUpload: null, onImageUploadError: null, onMediaDelete: null, onToolbarClick: null, onsubmit: null, onCreateLink: function (sLinkUrl) {
            if (sLinkUrl.indexOf('@') !== -1 && sLinkUrl.indexOf(':') === -1) {
                sLinkUrl = 'mailto:' + sLinkUrl;
            } else if (sLinkUrl.indexOf('://') === -1) {
                sLinkUrl = 'http://' + sLinkUrl;
            }
            return sLinkUrl;
        }, keyMap: {pc: {'ENTER': 'insertParagraph', 'CTRL+Z': 'undo', 'CTRL+Y': 'redo', 'TAB': 'tab', 'SHIFT+TAB': 'untab', 'CTRL+B': 'bold', 'CTRL+I': 'italic', 'CTRL+U': 'underline', 'CTRL+SHIFT+S': 'strikethrough', 'CTRL+BACKSLASH': 'removeFormat', 'CTRL+SHIFT+L': 'justifyLeft', 'CTRL+SHIFT+E': 'justifyCenter', 'CTRL+SHIFT+R': 'justifyRight', 'CTRL+SHIFT+J': 'justifyFull', 'CTRL+SHIFT+NUM7': 'insertUnorderedList', 'CTRL+SHIFT+NUM8': 'insertOrderedList', 'CTRL+LEFTBRACKET': 'outdent', 'CTRL+RIGHTBRACKET': 'indent', 'CTRL+NUM0': 'formatPara', 'CTRL+NUM1': 'formatH1', 'CTRL+NUM2': 'formatH2', 'CTRL+NUM3': 'formatH3', 'CTRL+NUM4': 'formatH4', 'CTRL+NUM5': 'formatH5', 'CTRL+NUM6': 'formatH6', 'CTRL+ENTER': 'insertHorizontalRule', 'CTRL+K': 'showLinkDialog'}, mac: {'ENTER': 'insertParagraph', 'CMD+Z': 'undo', 'CMD+SHIFT+Z': 'redo', 'TAB': 'tab', 'SHIFT+TAB': 'untab', 'CMD+B': 'bold', 'CMD+I': 'italic', 'CMD+U': 'underline', 'CMD+SHIFT+S': 'strikethrough', 'CMD+BACKSLASH': 'removeFormat', 'CMD+SHIFT+L': 'justifyLeft', 'CMD+SHIFT+E': 'justifyCenter', 'CMD+SHIFT+R': 'justifyRight', 'CMD+SHIFT+J': 'justifyFull', 'CMD+SHIFT+NUM7': 'insertUnorderedList', 'CMD+SHIFT+NUM8': 'insertOrderedList', 'CMD+LEFTBRACKET': 'outdent', 'CMD+RIGHTBRACKET': 'indent', 'CMD+NUM0': 'formatPara', 'CMD+NUM1': 'formatH1', 'CMD+NUM2': 'formatH2', 'CMD+NUM3': 'formatH3', 'CMD+NUM4': 'formatH4', 'CMD+NUM5': 'formatH5', 'CMD+NUM6': 'formatH6', 'CMD+ENTER': 'insertHorizontalRule', 'CMD+K': 'showLinkDialog'}}}, lang: {'en-US': {font: {bold: 'Bold', italic: 'Italic', underline: 'Underline', clear: 'Remove Font Style', height: 'Line Height', name: 'Font Family'}, image: {image: 'Picture', insert: 'Insert Image', resizeFull: 'Resize Full', resizeHalf: 'Resize Half', resizeQuarter: 'Resize Quarter', floatLeft: 'Float Left', floatRight: 'Float Right', floatNone: 'Float None', shapeRounded: 'Shape: Rounded', shapeCircle: 'Shape: Circle', shapeThumbnail: 'Shape: Thumbnail', shapeNone: 'Shape: None', dragImageHere: 'Drag image or text here', dropImage: 'Drop image or Text', selectFromFiles: 'Select from files', maximumFileSize: 'Maximum file size', maximumFileSizeError: 'Maximum file size exceeded.', url: 'Image URL', remove: 'Remove Image'}, link: {link: 'Link', insert: 'Insert Link', unlink: 'Unlink', edit: 'Edit', textToDisplay: 'Text to display', url: 'To what URL should this link go?', openInNewWindow: 'Open in new window'}, table: {table: 'Table'}, hr: {insert: 'Insert Horizontal Rule'}, style: {style: 'Style', normal: 'Normal', blockquote: 'Quote', pre: 'Code', h1: 'Header 1', h2: 'Header 2', h3: 'Header 3', h4: 'Header 4', h5: 'Header 5', h6: 'Header 6'}, lists: {unordered: 'Unordered list', ordered: 'Ordered list'}, options: {help: 'Help', fullscreen: 'Full Screen', codeview: 'Code View'}, paragraph: {paragraph: 'Paragraph', outdent: 'Outdent', indent: 'Indent', left: 'Align left', center: 'Align center', right: 'Align right', justify: 'Justify full'}, color: {recent: 'Recent Color', more: 'More Color', background: 'Background Color', foreground: 'Foreground Color', transparent: 'Transparent', setTransparent: 'Set transparent', reset: 'Reset', resetToDefault: 'Reset to default'}, shortcut: {shortcuts: 'Keyboard shortcuts', close: 'Close', textFormatting: 'Text formatting', action: 'Action', paragraphFormatting: 'Paragraph formatting', documentStyle: 'Document Style', extraKeys: 'Extra keys'}, history: {undo: 'Undo', redo: 'Redo'}}}};
    var async = (function () {
        var readFileAsDataURL = function (file) {
            return $.Deferred(function (deferred) {
                $.extend(new FileReader(), {onload: function (e) {
                    var sDataURL = e.target.result;
                    deferred.resolve(sDataURL);
                }, onerror: function () {
                    deferred.reject(this);
                }}).readAsDataURL(file);
            }).promise();
        };
        var createImage = function (sUrl, filename) {
            return $.Deferred(function (deferred) {
                var $img = $('<img>');
                $img.one('load', function () {
                    $img.off('error abort');
                    deferred.resolve($img);
                }).one('error abort', function () {
                    $img.off('load').detach();
                    deferred.reject($img);
                }).css({display: 'none'}).appendTo(document.body).attr({'src': sUrl, 'data-filename': filename});
            }).promise();
        };
        return{readFileAsDataURL: readFileAsDataURL, createImage: createImage};
    })();
    var key = {isEdit: function (keyCode) {
        return list.contains([8, 9, 13, 32], keyCode);
    }, nameFromCode: {'8': 'BACKSPACE', '9': 'TAB', '13': 'ENTER', '32': 'SPACE', '48': 'NUM0', '49': 'NUM1', '50': 'NUM2', '51': 'NUM3', '52': 'NUM4', '53': 'NUM5', '54': 'NUM6', '55': 'NUM7', '56': 'NUM8', '66': 'B', '69': 'E', '73': 'I', '74': 'J', '75': 'K', '76': 'L', '82': 'R', '83': 'S', '85': 'U', '89': 'Y', '90': 'Z', '191': 'SLASH', '219': 'LEFTBRACKET', '220': 'BACKSLASH', '221': 'RIGHTBRACKET'}};
    var Style = function () {
        var jQueryCSS = function ($obj, propertyNames) {
            if (agent.jqueryVersion < 1.9) {
                var result = {};
                $.each(propertyNames, function (idx, propertyName) {
                    result[propertyName] = $obj.css(propertyName);
                });
                return result;
            }
            return $obj.css.call($obj, propertyNames);
        };
        this.stylePara = function (rng, styleInfo) {
            $.each(rng.nodes(dom.isPara, {includeAncestor: true}), function (idx, para) {
                $(para).css(styleInfo);
            });
        };
        this.current = function (rng, target) {
            var $cont = $(dom.isText(rng.sc) ? rng.sc.parentNode : rng.sc);
            var properties = ['font-family', 'font-size', 'text-align', 'list-style-type', 'line-height'];
            var styleInfo = jQueryCSS($cont, properties) || {};
            styleInfo['font-size'] = parseInt(styleInfo['font-size'], 10);
            styleInfo['font-bold'] = document.queryCommandState('bold') ? 'bold' : 'normal';
            styleInfo['font-italic'] = document.queryCommandState('italic') ? 'italic' : 'normal';
            styleInfo['font-underline'] = document.queryCommandState('underline') ? 'underline' : 'normal';
            styleInfo['font-strikethrough'] = document.queryCommandState('strikeThrough') ? 'strikethrough' : 'normal';
            styleInfo['font-superscript'] = document.queryCommandState('superscript') ? 'superscript' : 'normal';
            styleInfo['font-subscript'] = document.queryCommandState('subscript') ? 'subscript' : 'normal';
            if (!rng.isOnList()) {
                styleInfo['list-style'] = 'none';
            } else {
                var aOrderedType = ['circle', 'disc', 'disc-leading-zero', 'square'];
                var isUnordered = $.inArray(styleInfo['list-style-type'], aOrderedType) > -1;
                styleInfo['list-style'] = isUnordered ? 'unordered' : 'ordered';
            }
            var para = dom.ancestor(rng.sc, dom.isPara);
            if (para && para.style['line-height']) {
                styleInfo['line-height'] = para.style.lineHeight;
            } else {
                var lineHeight = parseInt(styleInfo['line-height'], 10) / parseInt(styleInfo['font-size'], 10);
                styleInfo['line-height'] = lineHeight.toFixed(1);
            }
            styleInfo.image = dom.isImg(target) && target;
            styleInfo.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
            styleInfo.ancestors = dom.listAncestor(rng.sc, dom.isEditable);
            styleInfo.range = rng;
            return styleInfo;
        };
    };
    var Typing = function () {
        this.insertTab = function ($editable, rng, tabsize) {
            var tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
            rng = rng.deleteContents();
            rng.insertNode(tab, true);
            rng = range.create(tab, tabsize);
            rng.select();
        };
        this.insertParagraph = function () {
            var rng = range.create();
            rng = rng.deleteContents();
            rng = rng.wrapBodyInlineWithPara();
            var splitRoot = dom.ancestor(rng.sc, dom.isPara);
            var nextPara;
            if (splitRoot) {
                nextPara = dom.splitTree(splitRoot, rng.getStartPoint());
                var emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
                emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));
                $.each(emptyAnchors, function (idx, anchor) {
                    dom.remove(anchor);
                });
            } else {
                var next = rng.sc.childNodes[rng.so];
                nextPara = $(dom.emptyPara)[0];
                if (next) {
                    rng.sc.insertBefore(nextPara, next);
                } else {
                    rng.sc.appendChild(nextPara);
                }
            }
            range.create(nextPara, 0).normalize().select();
        };
    };
    var Table = function () {
        this.tab = function (rng, isShift) {
            var cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
            var table = dom.ancestor(cell, dom.isTable);
            var cells = dom.listDescendant(table, dom.isCell);
            var nextCell = list[isShift ? 'prev' : 'next'](cells, cell);
            if (nextCell) {
                range.create(nextCell, 0).select();
            }
        };
        this.createTable = function (colCount, rowCount) {
            var tds = [], tdHTML;
            for (var idxCol = 0; idxCol < colCount; idxCol++) {
                tds.push('<td>' + dom.blank + '</td>');
            }
            tdHTML = tds.join('');
            var trs = [], trHTML;
            for (var idxRow = 0; idxRow < rowCount; idxRow++) {
                trs.push('<tr>' + tdHTML + '</tr>');
            }
            trHTML = trs.join('');
            return $('<table class="table table-bordered">' + trHTML + '</table>')[0];
        };
    };
    var Bullet = function () {
        this.insertOrderedList = function () {
            this.toggleList('OL');
        };
        this.insertUnorderedList = function () {
            this.toggleList('UL');
        };
        this.indent = function () {
            var self = this;
            var rng = range.create().wrapBodyInlineWithPara();
            var paras = rng.nodes(dom.isPara, {includeAncestor: true});
            var clustereds = list.clusterBy(paras, func.peq2('parentNode'));
            $.each(clustereds, function (idx, paras) {
                var head = list.head(paras);
                if (dom.isLi(head)) {
                    self.wrapList(paras, head.parentNode.nodeName);
                } else {
                    $.each(paras, function (idx, para) {
                        $(para).css('marginLeft', function (idx, val) {
                            return(parseInt(val, 10) || 0) + 25;
                        });
                    });
                }
            });
            rng.select();
        };
        this.outdent = function () {
            var self = this;
            var rng = range.create().wrapBodyInlineWithPara();
            var paras = rng.nodes(dom.isPara, {includeAncestor: true});
            var clustereds = list.clusterBy(paras, func.peq2('parentNode'));
            $.each(clustereds, function (idx, paras) {
                var head = list.head(paras);
                if (dom.isLi(head)) {
                    self.releaseList([paras]);
                } else {
                    $.each(paras, function (idx, para) {
                        $(para).css('marginLeft', function (idx, val) {
                            val = (parseInt(val, 10) || 0);
                            return val > 25 ? val - 25 : '';
                        });
                    });
                }
            });
            rng.select();
        };
        this.toggleList = function (listName) {
            var self = this;
            var rng = range.create().wrapBodyInlineWithPara();
            var paras = rng.nodes(dom.isPara, {includeAncestor: true});
            var bookmark = rng.paraBookmark(paras);
            var clustereds = list.clusterBy(paras, func.peq2('parentNode'));
            if (list.find(paras, dom.isPurePara)) {
                var wrappedParas = [];
                $.each(clustereds, function (idx, paras) {
                    wrappedParas = wrappedParas.concat(self.wrapList(paras, listName));
                });
                paras = wrappedParas;
            } else {
                var diffLists = rng.nodes(dom.isList, {includeAncestor: true}).filter(function (listNode) {
                    return!$.nodeName(listNode, listName);
                });
                if (diffLists.length) {
                    $.each(diffLists, function (idx, listNode) {
                        dom.replace(listNode, listName);
                    });
                } else {
                    paras = this.releaseList(clustereds, true);
                }
            }
            range.createFromParaBookmark(bookmark, paras).select();
        };
        this.wrapList = function (paras, listName) {
            var head = list.head(paras);
            var last = list.last(paras);
            var prevList = dom.isList(head.previousSibling) && head.previousSibling;
            var nextList = dom.isList(last.nextSibling) && last.nextSibling;
            var listNode = prevList || dom.insertAfter(dom.create(listName || 'UL'), last);
            paras = $.map(paras, function (para) {
                return dom.isPurePara(para) ? dom.replace(para, 'LI') : para;
            });
            dom.appendChildNodes(listNode, paras);
            if (nextList) {
                dom.appendChildNodes(listNode, list.from(nextList.childNodes));
                dom.remove(nextList);
            }
            return paras;
        };
        this.releaseList = function (clustereds, isEscapseToBody) {
            var releasedParas = [];
            $.each(clustereds, function (idx, paras) {
                var head = list.head(paras);
                var last = list.last(paras);
                var headList = isEscapseToBody ? dom.lastAncestor(head, dom.isList) : head.parentNode;
                var lastList = headList.childNodes.length > 1 ? dom.splitTree(headList, {node: last.parentNode, offset: dom.position(last) + 1}, true) : null;
                var middleList = dom.splitTree(headList, {node: head.parentNode, offset: dom.position(head)}, true);
                paras = isEscapseToBody ? dom.listDescendant(middleList, dom.isLi) : list.from(middleList.childNodes).filter(dom.isLi);
                if (isEscapseToBody || !dom.isList(headList.parentNode)) {
                    paras = $.map(paras, function (para) {
                        return dom.replace(para, 'P');
                    });
                }
                $.each(list.from(paras).reverse(), function (idx, para) {
                    dom.insertAfter(para, headList);
                });
                var rootLists = list.compact([headList, middleList, lastList]);
                $.each(rootLists, function (idx, rootList) {
                    var listNodes = [rootList].concat(dom.listDescendant(rootList, dom.isList));
                    $.each(listNodes.reverse(), function (idx, listNode) {
                        if (!dom.nodeLength(listNode)) {
                            dom.remove(listNode, true);
                        }
                    });
                });
                releasedParas = releasedParas.concat(paras);
            });
            return releasedParas;
        };
    };
    var Editor = function () {
        var style = new Style();
        var table = new Table();
        var typing = new Typing();
        var bullet = new Bullet();
        this.createRange = function ($editable) {
            $editable.focus();
            return range.create();
        };
        this.saveRange = function ($editable, thenCollapse) {
            $editable.focus();
            $editable.data('range', range.create());
            if (thenCollapse) {
                range.create().collapse().select();
            }
        };
        this.saveNode = function ($editable) {
            var copy = [];
            for (var key = 0, len = $editable[0].childNodes.length; key < len; key++) {
                copy.push($editable[0].childNodes[key]);
            }
            $editable.data('childNodes', copy);
        };
        this.restoreRange = function ($editable) {
            var rng = $editable.data('range');
            if (rng) {
                rng.select();
                $editable.focus();
            }
        };
        this.restoreNode = function ($editable) {
            $editable.html('');
            var child = $editable.data('childNodes');
            for (var index = 0, len = child.length; index < len; index++) {
                $editable[0].appendChild(child[index]);
            }
        };
        this.currentStyle = function (target) {
            var rng = range.create();
            return rng ? rng.isOnEditable() && style.current(rng, target) : false;
        };
        var triggerOnBeforeChange = this.triggerOnBeforeChange = function ($editable) {
            var onBeforeChange = $editable.data('callbacks').onBeforeChange;
            if (onBeforeChange) {
                onBeforeChange($editable.html(), $editable);
            }
        };
        var triggerOnChange = this.triggerOnChange = function ($editable) {
            var onChange = $editable.data('callbacks').onChange;
            if (onChange) {
                onChange($editable.html(), $editable);
            }
        };
        this.undo = function ($editable) {
            triggerOnBeforeChange($editable);
            $editable.data('NoteHistory').undo();
            triggerOnChange($editable);
        };
        this.redo = function ($editable) {
            triggerOnBeforeChange($editable);
            $editable.data('NoteHistory').redo();
            triggerOnChange($editable);
        };
        var beforeCommand = this.beforeCommand = function ($editable) {
            triggerOnBeforeChange($editable);
        };
        var afterCommand = this.afterCommand = function ($editable) {
            $editable.data('NoteHistory').recordUndo();
            triggerOnChange($editable);
        };
        var commands = ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'formatBlock', 'removeFormat', 'backColor', 'foreColor', 'insertHorizontalRule', 'fontName'];
        for (var idx = 0, len = commands.length; idx < len; idx++) {
            this[commands[idx]] = (function (sCmd) {
                return function ($editable, value) {
                    beforeCommand($editable);
                    document.execCommand(sCmd, false, value);
                    afterCommand($editable);
                };
            })(commands[idx]);
        }
        this.tab = function ($editable, options) {
            var rng = range.create();
            if (rng.isCollapsed() && rng.isOnCell()) {
                table.tab(rng);
            } else {
                beforeCommand($editable);
                typing.insertTab($editable, rng, options.tabsize);
                afterCommand($editable);
            }
        };
        this.untab = function () {
            var rng = range.create();
            if (rng.isCollapsed() && rng.isOnCell()) {
                table.tab(rng, true);
            }
        };
        this.insertParagraph = function ($editable) {
            beforeCommand($editable);
            typing.insertParagraph($editable);
            afterCommand($editable);
        };
        this.insertOrderedList = function ($editable) {
            beforeCommand($editable);
            bullet.insertOrderedList($editable);
            afterCommand($editable);
        };
        this.insertUnorderedList = function ($editable) {
            beforeCommand($editable);
            bullet.insertUnorderedList($editable);
            afterCommand($editable);
        };
        this.indent = function ($editable) {
            beforeCommand($editable);
            bullet.indent($editable);
            afterCommand($editable);
        };
        this.outdent = function ($editable) {
            beforeCommand($editable);
            bullet.outdent($editable);
            afterCommand($editable);
        };
        this.insertImage = function ($editable, sUrl, filename) {
            async.createImage(sUrl, filename).then(function ($image) {
                beforeCommand($editable);
                $image.css({display: '', width: Math.min($editable.width(), $image.width())});
                range.create().insertNode($image[0]);
                range.createFromNode($image[0]).collapse().select();
                afterCommand($editable);
            }).fail(function () {
                var callbacks = $editable.data('callbacks');
                if (callbacks.onImageUploadError) {
                    callbacks.onImageUploadError();
                }
            });
        };
        this.insertNode = function ($editable, node) {
            beforeCommand($editable);
            var rng = this.createRange($editable);
            rng.insertNode(node);
            range.createFromNode(node).collapse().select();
            afterCommand($editable);
        };
        this.insertText = function ($editable, text) {
            beforeCommand($editable);
            var rng = this.createRange($editable);
            var textNode = rng.insertNode(dom.createText(text));
            range.create(textNode, dom.nodeLength(textNode)).select();
            afterCommand($editable);
        };
        this.formatBlock = function ($editable, tagName) {
            beforeCommand($editable);
            tagName = agent.isMSIE ? '<' + tagName + '>' : tagName;
            document.execCommand('FormatBlock', false, tagName);
            afterCommand($editable);
        };
        this.formatPara = function ($editable) {
            beforeCommand($editable);
            this.formatBlock($editable, 'P');
            afterCommand($editable);
        };
        for (var idx = 1; idx <= 6; idx++) {
            this['formatH' + idx] = function (idx) {
                return function ($editable) {
                    this.formatBlock($editable, 'H' + idx);
                };
            }(idx);
        }
        ;
        this.fontSize = function ($editable, value) {
            beforeCommand($editable);
            document.execCommand('fontSize', false, 3);
            if (agent.isFF) {
                $editable.find('font[size=3]').removeAttr('size').css('font-size', value + 'px');
            } else {
                $editable.find('span').filter(function () {
                    return this.style.fontSize === 'medium';
                }).css('font-size', value + 'px');
            }
            afterCommand($editable);
        };
        this.lineHeight = function ($editable, value) {
            beforeCommand($editable);
            style.stylePara(range.create(), {lineHeight: value});
            afterCommand($editable);
        };
        this.unlink = function ($editable) {
            var rng = range.create();
            if (rng.isOnAnchor()) {
                var anchor = dom.ancestor(rng.sc, dom.isAnchor);
                rng = range.createFromNode(anchor);
                rng.select();
                beforeCommand($editable);
                document.execCommand('unlink');
                afterCommand($editable);
            }
        };
        this.createLink = function ($editable, linkInfo, options) {
            var linkUrl = linkInfo.url;
            var linkText = linkInfo.text;
            var isNewWindow = linkInfo.newWindow;
            var rng = linkInfo.range;
            if (options.onCreateLink) {
                linkUrl = options.onCreateLink(linkUrl);
            }
            rng = rng.deleteContents();
            var anchor = rng.insertNode($('<A>' + linkText + '</A>')[0]);
            $(anchor).attr({href: linkUrl, target: isNewWindow ? '_blank' : ''});
            beforeCommand($editable);
            range.createFromNode(anchor).select();
            afterCommand($editable);
        };
        this.getLinkInfo = function ($editable) {
            $editable.focus();
            var rng = range.create().expand(dom.isAnchor);
            var $anchor = $(list.head(rng.nodes(dom.isAnchor)));
            return{range: rng, text: rng.toString(), isNewWindow: $anchor.length ? $anchor.attr('target') === '_blank' : true, url: $anchor.length ? $anchor.attr('href') : ''};
        };
        this.color = function ($editable, sObjColor) {
            var oColor = JSON.parse(sObjColor);
            var foreColor = oColor.foreColor, backColor = oColor.backColor;
            beforeCommand($editable);
            if (foreColor) {
                document.execCommand('foreColor', false, foreColor);
            }
            if (backColor) {
                document.execCommand('backColor', false, backColor);
            }
            afterCommand($editable);
        };
        this.insertTable = function ($editable, sDim) {
            var dimension = sDim.split('x');
            beforeCommand($editable);
            var rng = range.create();
            rng = rng.deleteContents();
            rng.insertNode(table.createTable(dimension[0], dimension[1]));
            afterCommand($editable);
        };
        this.floatMe = function ($editable, value, $target) {
            beforeCommand($editable);
            $target.css('float', value);
            afterCommand($editable);
        };
        this.imageShape = function ($editable, value, $target) {
            beforeCommand($editable);
            $target.removeClass('img-rounded img-circle img-thumbnail');
            if (value) {
                $target.addClass(value);
            }
            afterCommand($editable);
        };
        this.resize = function ($editable, value, $target) {
            beforeCommand($editable);
            $target.css({width: value * 100 + '%', height: ''});
            afterCommand($editable);
        };
        this.resizeTo = function (pos, $target, bKeepRatio) {
            var imageSize;
            if (bKeepRatio) {
                var newRatio = pos.y / pos.x;
                var ratio = $target.data('ratio');
                imageSize = {width: ratio > newRatio ? pos.x : pos.y / ratio, height: ratio > newRatio ? pos.x * ratio : pos.y};
            } else {
                imageSize = {width: pos.x, height: pos.y};
            }
            $target.css(imageSize);
        };
        this.removeMedia = function ($editable, value, $target) {
            beforeCommand($editable);
            $target.detach();
            var callbacks = $editable.data('callbacks');
            if (callbacks && callbacks.onMediaDelete) {
                callbacks.onMediaDelete($target, this, $editable);
            }
            afterCommand($editable);
        };
    };
    var History = function ($editable) {
        var stack = [], stackOffset = -1;
        var editable = $editable[0];
        var makeSnapshot = function () {
            var rng = range.create();
            var emptyBookmark = {s: {path: [0], offset: 0}, e: {path: [0], offset: 0}};
            return{contents: $editable.html(), bookmark: (rng ? rng.bookmark(editable) : emptyBookmark)};
        };
        var applySnapshot = function (snapshot) {
            if (snapshot.contents !== null) {
                $editable.html(snapshot.contents);
            }
            if (snapshot.bookmark !== null) {
                range.createFromBookmark(editable, snapshot.bookmark).select();
            }
        };
        this.undo = function () {
            if (0 < stackOffset) {
                stackOffset--;
                applySnapshot(stack[stackOffset]);
            }
        };
        this.redo = function () {
            if (stack.length - 1 > stackOffset) {
                stackOffset++;
                applySnapshot(stack[stackOffset]);
            }
        };
        this.recordUndo = function () {
            stackOffset++;
            if (stack.length > stackOffset) {
                stack = stack.slice(0, stackOffset);
            }
            stack.push(makeSnapshot());
        };
        this.recordUndo();
    };
    var Button = function () {
        this.update = function ($container, styleInfo) {
            var checkDropdownMenu = function ($btn, value) {
                $btn.find('.dropdown-menu li a').each(function () {
                    var isChecked = ($(this).data('value') + '') === (value + '');
                    this.className = isChecked ? 'checked' : '';
                });
            };
            var btnState = function (selector, pred) {
                var $btn = $container.find(selector);
                $btn.toggleClass('active', pred());
            };
            if (styleInfo.image) {
                var $img = $(styleInfo.image);
                btnState('button[data-event="imageShape"][data-value="img-rounded"]', function () {
                    return $img.hasClass('img-rounded');
                });
                btnState('button[data-event="imageShape"][data-value="img-circle"]', function () {
                    return $img.hasClass('img-circle');
                });
                btnState('button[data-event="imageShape"][data-value="img-thumbnail"]', function () {
                    return $img.hasClass('img-thumbnail');
                });
                btnState('button[data-event="imageShape"]:not([data-value])', function () {
                    return!$img.is('.img-rounded, .img-circle, .img-thumbnail');
                });
                var imgFloat = $img.css('float');
                btnState('button[data-event="floatMe"][data-value="left"]', function () {
                    return imgFloat === 'left';
                });
                btnState('button[data-event="floatMe"][data-value="right"]', function () {
                    return imgFloat === 'right';
                });
                btnState('button[data-event="floatMe"][data-value="none"]', function () {
                    return imgFloat !== 'left' && imgFloat !== 'right';
                });
                var style = $img.attr('style');
                btnState('button[data-event="resize"][data-value="1"]', function () {
                    return!!/(^|\s)(max-)?width\s*:\s*100%/.test(style);
                });
                btnState('button[data-event="resize"][data-value="0.5"]', function () {
                    return!!/(^|\s)(max-)?width\s*:\s*50%/.test(style);
                });
                btnState('button[data-event="resize"][data-value="0.25"]', function () {
                    return!!/(^|\s)(max-)?width\s*:\s*25%/.test(style);
                });
                return;
            }
            var $fontname = $container.find('.note-fontname');
            if ($fontname.length) {
                var selectedFont = styleInfo['font-family'];
                if (!!selectedFont) {
                    selectedFont = list.head(selectedFont.split(','));
                    selectedFont = selectedFont.replace(/\'/g, '');
                    $fontname.find('.note-current-fontname').text(selectedFont);
                    checkDropdownMenu($fontname, selectedFont);
                }
            }
            var $fontsize = $container.find('.note-fontsize');
            $fontsize.find('.note-current-fontsize').text(styleInfo['font-size']);
            checkDropdownMenu($fontsize, parseFloat(styleInfo['font-size']));
            var $lineHeight = $container.find('.note-height');
            checkDropdownMenu($lineHeight, parseFloat(styleInfo['line-height']));
            btnState('button[data-event="bold"]', function () {
                return styleInfo['font-bold'] === 'bold';
            });
            btnState('button[data-event="italic"]', function () {
                return styleInfo['font-italic'] === 'italic';
            });
            btnState('button[data-event="underline"]', function () {
                return styleInfo['font-underline'] === 'underline';
            });
            btnState('button[data-event="strikethrough"]', function () {
                return styleInfo['font-strikethrough'] === 'strikethrough';
            });
            btnState('button[data-event="superscript"]', function () {
                return styleInfo['font-superscript'] === 'superscript';
            });
            btnState('button[data-event="subscript"]', function () {
                return styleInfo['font-subscript'] === 'subscript';
            });
            btnState('button[data-event="justifyLeft"]', function () {
                return styleInfo['text-align'] === 'left' || styleInfo['text-align'] === 'start';
            });
            btnState('button[data-event="justifyCenter"]', function () {
                return styleInfo['text-align'] === 'center';
            });
            btnState('button[data-event="justifyRight"]', function () {
                return styleInfo['text-align'] === 'right';
            });
            btnState('button[data-event="justifyFull"]', function () {
                return styleInfo['text-align'] === 'justify';
            });
            btnState('button[data-event="insertUnorderedList"]', function () {
                return styleInfo['list-style'] === 'unordered';
            });
            btnState('button[data-event="insertOrderedList"]', function () {
                return styleInfo['list-style'] === 'ordered';
            });
        };
        this.updateRecentColor = function (button, eventName, value) {
            var $color = $(button).closest('.note-color');
            var $recentColor = $color.find('.note-recent-color');
            var colorInfo = JSON.parse($recentColor.attr('data-value'));
            colorInfo[eventName] = value;
            $recentColor.attr('data-value', JSON.stringify(colorInfo));
            var sKey = eventName === 'backColor' ? 'background-color' : 'color';
            $recentColor.find('i').css(sKey, value);
        };
    };
    var Toolbar = function () {
        var button = new Button();
        this.update = function ($toolbar, styleInfo) {
            button.update($toolbar, styleInfo);
        };
        this.updateRecentColor = function (buttonNode, eventName, value) {
            button.updateRecentColor(buttonNode, eventName, value);
        };
        this.activate = function ($toolbar) {
            $toolbar.find('button').not('button[data-event="codeview"]').removeClass('disabled');
        };
        this.deactivate = function ($toolbar) {
            $toolbar.find('button').not('button[data-event="codeview"]').addClass('disabled');
        };
        this.updateFullscreen = function ($container, bFullscreen) {
            var $btn = $container.find('button[data-event="fullscreen"]');
            $btn.toggleClass('active', bFullscreen);
        };
        this.updateCodeview = function ($container, isCodeview) {
            var $btn = $container.find('button[data-event="codeview"]');
            $btn.toggleClass('active', isCodeview);
        };
    };
    var Popover = function () {
        var button = new Button();
        var posFromPlaceholder = function (placeholder, isAirMode) {
            var $placeholder = $(placeholder);
            var pos = isAirMode ? $placeholder.offset() : $placeholder.position();
            var height = $placeholder.outerHeight(true);
            return{left: pos.left, top: pos.top + height};
        };
        var showPopover = function ($popover, pos) {
            $popover.css({display: 'block', left: pos.left, top: pos.top});
        };
        var PX_POPOVER_ARROW_OFFSET_X = 20;
        this.update = function ($popover, styleInfo, isAirMode) {
            button.update($popover, styleInfo);
            var $linkPopover = $popover.find('.note-link-popover');
            if (styleInfo.anchor) {
                var $anchor = $linkPopover.find('a');
                var href = $(styleInfo.anchor).attr('href');
                $anchor.attr('href', href).html(href);
                showPopover($linkPopover, posFromPlaceholder(styleInfo.anchor, isAirMode));
            } else {
                $linkPopover.hide();
            }
            var $imagePopover = $popover.find('.note-image-popover');
            if (styleInfo.image) {
                showPopover($imagePopover, posFromPlaceholder(styleInfo.image, isAirMode));
            } else {
                $imagePopover.hide();
            }
            var $airPopover = $popover.find('.note-air-popover');
            if (isAirMode && !styleInfo.range.isCollapsed()) {
                var rect = list.last(styleInfo.range.getClientRects());
                if (rect) {
                    var bnd = func.rect2bnd(rect);
                    showPopover($airPopover, {left: Math.max(bnd.left + bnd.width / 2 - PX_POPOVER_ARROW_OFFSET_X, 0), top: bnd.top + bnd.height});
                }
            } else {
                $airPopover.hide();
            }
        };
        this.updateRecentColor = function (button, eventName, value) {
            button.updateRecentColor(button, eventName, value);
        };
        this.hide = function ($popover) {
            $popover.children().hide();
        };
    };
    var Handle = function () {
        this.update = function ($handle, styleInfo, isAirMode) {
            var $selection = $handle.find('.note-control-selection');
            if (styleInfo.image) {
                var $image = $(styleInfo.image);
                var pos = isAirMode ? $image.offset() : $image.position();
                var imageSize = {w: $image.outerWidth(true), h: $image.outerHeight(true)};
                $selection.css({display: 'block', left: pos.left, top: pos.top, width: imageSize.w, height: imageSize.h}).data('target', styleInfo.image);
                var sizingText = imageSize.w + 'x' + imageSize.h;
                $selection.find('.note-control-selection-info').text(sizingText);
            } else {
                $selection.hide();
            }
        };
        this.hide = function ($handle) {
            $handle.children().hide();
        };
    };
    var Dialog = function () {
        var toggleBtn = function ($btn, isEnable) {
            $btn.toggleClass('disabled', !isEnable);
            $btn.attr('disabled', !isEnable);
        };
        this.showImageDialog = function ($editable, $dialog) {
            return $.Deferred(function (deferred) {
                var $imageDialog = $dialog.find('.note-image-dialog');
                var $imageInput = $dialog.find('.note-image-input'), $imageUrl = $dialog.find('.note-image-url'), $imageBtn = $dialog.find('.note-image-btn');
                $imageDialog.one('shown.bs.modal', function () {
                    $imageInput.replaceWith($imageInput.clone().on('change', function () {
                        deferred.resolve(this.files || this.value);
                        $imageDialog.modal('hide');
                    }).val(''));
                    $imageBtn.click(function (event) {
                        event.preventDefault();
                        deferred.resolve($imageUrl.val());
                        $imageDialog.modal('hide');
                    });
                    $imageUrl.on('keyup paste', function (event) {
                        var url;
                        if (event.type === 'paste') {
                            url = event.originalEvent.clipboardData.getData('text');
                        } else {
                            url = $imageUrl.val();
                        }
                        toggleBtn($imageBtn, url);
                    }).val('').trigger('focus');
                }).one('hidden.bs.modal', function () {
                    $imageInput.off('change');
                    $imageUrl.off('keyup paste');
                    $imageBtn.off('click');
                    if (deferred.state() === 'pending') {
                        deferred.reject();
                    }
                }).modal('show');
            });
        };
        this.showLinkDialog = function ($editable, $dialog, linkInfo) {
            return $.Deferred(function (deferred) {
                var $linkDialog = $dialog.find('.note-link-dialog');
                var $linkText = $linkDialog.find('.note-link-text'), $linkUrl = $linkDialog.find('.note-link-url'), $linkBtn = $linkDialog.find('.note-link-btn'), $openInNewWindow = $linkDialog.find('input[type=checkbox]');
                $linkDialog.one('shown.bs.modal', function () {
                    $linkText.val(linkInfo.text);
                    $linkText.on('input', function () {
                        linkInfo.text = $linkText.val();
                    });
                    if (!linkInfo.url) {
                        linkInfo.url = linkInfo.text;
                        toggleBtn($linkBtn, linkInfo.text);
                    }
                    $linkUrl.on('input', function () {
                        toggleBtn($linkBtn, $linkUrl.val());
                        if (!linkInfo.text) {
                            $linkText.val($linkUrl.val());
                        }
                    }).val(linkInfo.url).trigger('focus').trigger('select');
                    $openInNewWindow.prop('checked', linkInfo.newWindow);
                    $linkBtn.one('click', function (event) {
                        event.preventDefault();
                        deferred.resolve({range: linkInfo.range, url: $linkUrl.val(), text: $linkText.val(), newWindow: $openInNewWindow.is(':checked')});
                        $linkDialog.modal('hide');
                    });
                }).one('hidden.bs.modal', function () {
                    $linkText.off('input');
                    $linkUrl.off('input');
                    $linkBtn.off('click');
                    if (deferred.state() === 'pending') {
                        deferred.reject();
                    }
                }).modal('show');
            }).promise();
        };
        this.showHelpDialog = function ($editable, $dialog) {
            return $.Deferred(function (deferred) {
                var $helpDialog = $dialog.find('.note-help-dialog');
                $helpDialog.one('hidden.bs.modal', function () {
                    deferred.resolve();
                }).modal('show');
            }).promise();
        };
    };
    var CodeMirror;
    if (agent.hasCodeMirror) {
        if (agent.isSupportAmd) {
            require(['CodeMirror'], function (cm) {
                CodeMirror = cm;
            });
        } else {
            CodeMirror = window.CodeMirror;
        }
    }
    var EventHandler = function () {
        var $window = $(window);
        var $document = $(document);
        var $scrollbar = $('html, body');
        var editor = new Editor();
        var toolbar = new Toolbar(), popover = new Popover();
        var handle = new Handle(), dialog = new Dialog();
        this.getEditor = function () {
            return editor;
        };
        var makeLayoutInfo = function (descendant) {
            var $target = $(descendant).closest('.note-editor, .note-air-editor, .note-air-layout');
            if (!$target.length) {
                return null;
            }
            var $editor;
            if ($target.is('.note-editor, .note-air-editor')) {
                $editor = $target;
            } else {
                $editor = $('#note-editor-' + list.last($target.attr('id').split('-')));
            }
            return dom.buildLayoutInfo($editor);
        };
        var insertImages = function (layoutInfo, files) {
            var $editor = layoutInfo.editor(), $editable = layoutInfo.editable();
            var callbacks = $editable.data('callbacks');
            var options = $editor.data('options');
            if (callbacks.onImageUpload) {
                callbacks.onImageUpload(files, editor, $editable);
            } else {
                $.each(files, function (idx, file) {
                    var filename = file.name;
                    if (options.maximumImageFileSize && options.maximumImageFileSize < file.size) {
                        if (callbacks.onImageUploadError) {
                            callbacks.onImageUploadError(options.langInfo.image.maximumFileSizeError);
                        } else {
                            alert(options.langInfo.image.maximumFileSizeError);
                        }
                    } else {
                        async.readFileAsDataURL(file).then(function (sDataURL) {
                            editor.insertImage($editable, sDataURL, filename);
                        }).fail(function () {
                            if (callbacks.onImageUploadError) {
                                callbacks.onImageUploadError();
                            }
                        });
                    }
                });
            }
        };
        var commands = {showLinkDialog: function (layoutInfo) {
            var $editor = layoutInfo.editor(), $dialog = layoutInfo.dialog(), $editable = layoutInfo.editable(), linkInfo = editor.getLinkInfo($editable);
            var options = $editor.data('options');
            editor.saveRange($editable);
            dialog.showLinkDialog($editable, $dialog, linkInfo).then(function (linkInfo) {
                editor.restoreRange($editable);
                editor.createLink($editable, linkInfo, options);
                popover.hide(layoutInfo.popover());
            }).fail(function () {
                editor.restoreRange($editable);
            });
        }, showImageDialog: function (layoutInfo) {
            var $dialog = layoutInfo.dialog(), $editable = layoutInfo.editable();
            editor.saveRange($editable);
            dialog.showImageDialog($editable, $dialog).then(function (data) {
                editor.restoreRange($editable);
                if (typeof data === 'string') {
                    editor.insertImage($editable, data);
                } else {
                    insertImages(layoutInfo, data);
                }
            }).fail(function () {
                editor.restoreRange($editable);
            });
        }, showHelpDialog: function (layoutInfo) {
            var $dialog = layoutInfo.dialog(), $editable = layoutInfo.editable();
            editor.saveRange($editable, true);
            dialog.showHelpDialog($editable, $dialog).then(function () {
                editor.restoreRange($editable);
            });
        }, fullscreen: function (layoutInfo) {
            var $editor = layoutInfo.editor(), $toolbar = layoutInfo.toolbar(), $editable = layoutInfo.editable(), $codable = layoutInfo.codable();
            var resize = function (size) {
                $editable.css('height', size.h);
                $codable.css('height', size.h);
                if ($codable.data('cmeditor')) {
                    $codable.data('cmeditor').setsize(null, size.h);
                }
            };
            $editor.toggleClass('fullscreen');
            var isFullscreen = $editor.hasClass('fullscreen');
            if (isFullscreen) {
                $editable.data('orgheight', $editable.css('height'));
                $window.on('resize', function () {
                    resize({h: $window.height() - $toolbar.outerHeight()});
                }).trigger('resize');
                $scrollbar.css('overflow', 'hidden');
            } else {
                $window.off('resize');
                resize({h: $editable.data('orgheight')});
                $scrollbar.css('overflow', 'visible');
            }
            toolbar.updateFullscreen($toolbar, isFullscreen);
        }, codeview: function (layoutInfo) {
            var $editor = layoutInfo.editor(), $toolbar = layoutInfo.toolbar(), $editable = layoutInfo.editable(), $codable = layoutInfo.codable(), $popover = layoutInfo.popover(), $handle = layoutInfo.handle();
            var options = $editor.data('options');
            var cmEditor, server;
            $editor.toggleClass('codeview');
            var isCodeview = $editor.hasClass('codeview');
            if (isCodeview) {
                $codable.val(dom.html($editable, options.prettifyHtml));
                $codable.height($editable.height());
                toolbar.deactivate($toolbar);
                popover.hide($popover);
                handle.hide($handle);
                $codable.focus();
                if (agent.hasCodeMirror) {
                    cmEditor = CodeMirror.fromTextArea($codable[0], options.codemirror);
                    if (options.codemirror.tern) {
                        server = new CodeMirror.TernServer(options.codemirror.tern);
                        cmEditor.ternServer = server;
                        cmEditor.on('cursorActivity', function (cm) {
                            server.updateArgHints(cm);
                        });
                    }
                    cmEditor.setSize(null, $editable.outerHeight());
                    $codable.data('cmEditor', cmEditor);
                }
            } else {
                if (agent.hasCodeMirror) {
                    cmEditor = $codable.data('cmEditor');
                    $codable.val(cmEditor.getValue());
                    cmEditor.toTextArea();
                }
                $editable.html(dom.value($codable, options.prettifyHtml) || dom.emptyPara);
                $editable.height(options.height ? $codable.height() : 'auto');
                toolbar.activate($toolbar);
                $editable.focus();
            }
            toolbar.updateCodeview(layoutInfo.toolbar(), isCodeview);
        }};
        var hMousedown = function (event) {
            if (dom.isImg(event.target)) {
                event.preventDefault();
            }
        };
        var hToolbarAndPopoverUpdate = function (event) {
            setTimeout(function () {
                var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);
                var styleInfo = editor.currentStyle(event.target);
                if (!styleInfo) {
                    return;
                }
                var isAirMode = layoutInfo.editor().data('options').airMode;
                if (!isAirMode) {
                    toolbar.update(layoutInfo.toolbar(), styleInfo);
                }
                popover.update(layoutInfo.popover(), styleInfo, isAirMode);
                handle.update(layoutInfo.handle(), styleInfo, isAirMode);
            }, 0);
        };
        var hScroll = function (event) {
            var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);
            popover.hide(layoutInfo.popover());
            handle.hide(layoutInfo.handle());
        };
        var hPasteClipboardImage = function (event) {
            var clipboardData = event.originalEvent.clipboardData;
            var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);
            var $editable = layoutInfo.editable();
            if (!clipboardData || !clipboardData.items || !clipboardData.items.length) {
                var callbacks = $editable.data('callbacks');
                if (!callbacks.onImageUpload) {
                    return;
                }
                editor.saveNode($editable);
                editor.saveRange($editable);
                $editable.html('');
                setTimeout(function () {
                    var $img = $editable.find('img');
                    var datauri = $img[0].src;
                    var data = atob(datauri.split(',')[1]);
                    var array = new Uint8Array(data.length);
                    for (var i = 0; i < data.length; i++) {
                        array[i] = data.charCodeAt(i);
                    }
                    var blob = new Blob([array], {type: 'image/png'});
                    blob.name = 'clipboard.png';
                    editor.restoreNode($editable);
                    editor.restoreRange($editable);
                    insertImages(layoutInfo, [blob]);
                    editor.afterCommand($editable);
                }, 0);
                return;
            }
            var item = list.head(clipboardData.items);
            var isClipboardImage = item.kind === 'file' && item.type.indexOf('image/') !== -1;
            if (isClipboardImage) {
                insertImages(layoutInfo, [item.getAsFile()]);
            }
            editor.afterCommand($editable);
        };
        var hHandleMousedown = function (event) {
            if (dom.isControlSizing(event.target)) {
                event.preventDefault();
                event.stopPropagation();
                var layoutInfo = makeLayoutInfo(event.target), $handle = layoutInfo.handle(), $popover = layoutInfo.popover(), $editable = layoutInfo.editable(), $editor = layoutInfo.editor();
                var target = $handle.find('.note-control-selection').data('target'), $target = $(target), posStart = $target.offset(), scrollTop = $document.scrollTop();
                var isAirMode = $editor.data('options').airMode;
                $document.on('mousemove', function (event) {
                    editor.resizeTo({x: event.clientX - posStart.left, y: event.clientY - (posStart.top - scrollTop)}, $target, !event.shiftKey);
                    handle.update($handle, {image: target}, isAirMode);
                    popover.update($popover, {image: target}, isAirMode);
                }).one('mouseup', function () {
                    $document.off('mousemove');
                    editor.afterCommand($editable);
                });
                if (!$target.data('ratio')) {
                    $target.data('ratio', $target.height() / $target.width());
                }
            }
        };
        var hToolbarAndPopoverMousedown = function (event) {
            var $btn = $(event.target).closest('[data-event]');
            if ($btn.length) {
                event.preventDefault();
            }
        };
        var hToolbarAndPopoverClick = function (event) {
            var $btn = $(event.target).closest('[data-event]');
            if ($btn.length) {
                var eventName = $btn.attr('data-event'), value = $btn.attr('data-value'), hide = $btn.attr('data-hide');
                var layoutInfo = makeLayoutInfo(event.target);
                var $target;
                if ($.inArray(eventName, ['resize', 'floatMe', 'removeMedia', 'imageShape']) !== -1) {
                    var $selection = layoutInfo.handle().find('.note-control-selection');
                    $target = $($selection.data('target'));
                }
                if (hide) {
                    $btn.parents('.popover').hide();
                }
                if ($.isFunction($.summernote.pluginEvents[eventName])) {
                    $.summernote.pluginEvents[eventName](event, editor, layoutInfo, value);
                } else if (editor[eventName]) {
                    var $editable = layoutInfo.editable();
                    $editable.trigger('focus');
                    editor[eventName]($editable, value, $target);
                    event.preventDefault();
                } else if (commands[eventName]) {
                    commands[eventName].call(this, layoutInfo);
                    event.preventDefault();
                }
                if ($.inArray(eventName, ['backColor', 'foreColor']) !== -1) {
                    var options = layoutInfo.editor().data('options', options);
                    var module = options.airMode ? popover : toolbar;
                    module.updateRecentColor(list.head($btn), eventName, value);
                }
                hToolbarAndPopoverUpdate(event);
            }
        };
        var EDITABLE_PADDING = 24;
        var hStatusbarMousedown = function (event) {
            event.preventDefault();
            event.stopPropagation();
            var $editable = makeLayoutInfo(event.target).editable();
            var nEditableTop = $editable.offset().top - $document.scrollTop();
            var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);
            var options = layoutInfo.editor().data('options');
            $document.on('mousemove', function (event) {
                var nHeight = event.clientY - (nEditableTop + EDITABLE_PADDING);
                nHeight = (options.minHeight > 0) ? Math.max(nHeight, options.minHeight) : nHeight;
                nHeight = (options.maxHeight > 0) ? Math.min(nHeight, options.maxHeight) : nHeight;
                $editable.height(nHeight);
            }).one('mouseup', function () {
                $document.off('mousemove');
            });
        };
        var PX_PER_EM = 18;
        var hDimensionPickerMove = function (event, options) {
            var $picker = $(event.target.parentNode);
            var $dimensionDisplay = $picker.next();
            var $catcher = $picker.find('.note-dimension-picker-mousecatcher');
            var $highlighted = $picker.find('.note-dimension-picker-highlighted');
            var $unhighlighted = $picker.find('.note-dimension-picker-unhighlighted');
            var posOffset;
            if (event.offsetX === undefined) {
                var posCatcher = $(event.target).offset();
                posOffset = {x: event.pageX - posCatcher.left, y: event.pageY - posCatcher.top};
            } else {
                posOffset = {x: event.offsetX, y: event.offsetY};
            }
            var dim = {c: Math.ceil(posOffset.x / PX_PER_EM) || 1, r: Math.ceil(posOffset.y / PX_PER_EM) || 1};
            $highlighted.css({width: dim.c + 'em', height: dim.r + 'em'});
            $catcher.attr('data-value', dim.c + 'x' + dim.r);
            if (3 < dim.c && dim.c < options.insertTableMaxSize.col) {
                $unhighlighted.css({width: dim.c + 1 + 'em'});
            }
            if (3 < dim.r && dim.r < options.insertTableMaxSize.row) {
                $unhighlighted.css({height: dim.r + 1 + 'em'});
            }
            $dimensionDisplay.html(dim.c + ' x ' + dim.r);
        };
        var handleDragAndDropEvent = function (layoutInfo, options) {
            if (options.disableDragAndDrop) {
                $document.on('drop', function (e) {
                    e.preventDefault();
                });
            } else {
                attachDragAndDropEvent(layoutInfo, options);
            }
        };
        var attachDragAndDropEvent = function (layoutInfo, options) {
            var collection = $(), $dropzone = layoutInfo.dropzone, $dropzoneMessage = layoutInfo.dropzone.find('.note-dropzone-message');
            $document.on('dragenter', function (e) {
                var isCodeview = layoutInfo.editor.hasClass('codeview');
                if (!isCodeview && !collection.length) {
                    layoutInfo.editor.addClass('dragover');
                    $dropzone.width(layoutInfo.editor.width());
                    $dropzone.height(layoutInfo.editor.height());
                    $dropzoneMessage.text(options.langInfo.image.dragImageHere);
                }
                collection = collection.add(e.target);
            }).on('dragleave', function (e) {
                collection = collection.not(e.target);
                if (!collection.length) {
                    layoutInfo.editor.removeClass('dragover');
                }
            }).on('drop', function () {
                collection = $();
                layoutInfo.editor.removeClass('dragover');
            }).on('mouseout', function (e) {
                collection = collection.not(e.target);
                if (!collection.length) {
                    layoutInfo.editor.removeClass('dragover');
                }
            });
            $dropzone.on('dragenter', function () {
                $dropzone.addClass('hover');
                $dropzoneMessage.text(options.langInfo.image.dropImage);
            }).on('dragleave', function () {
                $dropzone.removeClass('hover');
                $dropzoneMessage.text(options.langInfo.image.dragImageHere);
            });
            $dropzone.on('drop', function (event) {
                event.preventDefault();
                var dataTransfer = event.originalEvent.dataTransfer;
                var html = dataTransfer.getData('text/html');
                var text = dataTransfer.getData('text/plain');
                var layoutInfo = makeLayoutInfo(event.currentTarget || event.target);
                if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
                    layoutInfo.editable().focus();
                    insertImages(layoutInfo, dataTransfer.files);
                } else if (html) {
                    $(html).each(function () {
                        layoutInfo.editable().focus();
                        editor.insertNode(layoutInfo.editable(), this);
                    });
                } else if (text) {
                    layoutInfo.editable().focus();
                    editor.insertText(layoutInfo.editable(), text);
                }
            }).on('dragover', false);
        };
        this.bindKeyMap = function (layoutInfo, keyMap) {
            var $editor = layoutInfo.editor;
            var $editable = layoutInfo.editable;
            layoutInfo = makeLayoutInfo($editable);
            $editable.on('keydown', function (event) {
                var aKey = [];
                if (event.metaKey) {
                    aKey.push('CMD');
                }
                if (event.ctrlKey && !event.altKey) {
                    aKey.push('CTRL');
                }
                if (event.shiftKey) {
                    aKey.push('SHIFT');
                }
                var keyName = key.nameFromCode[event.keyCode];
                if (keyName) {
                    aKey.push(keyName);
                }
                var eventName = keyMap[aKey.join('+')];
                if (eventName) {
                    if ($.summernote.pluginEvents[eventName]) {
                        var plugin = $.summernote.pluginEvents[eventName];
                        if ($.isFunction(plugin)) {
                            plugin(event, editor, layoutInfo);
                        }
                    } else if (editor[eventName]) {
                        editor[eventName]($editable, $editor.data('options'));
                        event.preventDefault();
                    } else if (commands[eventName]) {
                        commands[eventName].call(this, layoutInfo);
                        event.preventDefault();
                    }
                } else if (key.isEdit(event.keyCode)) {
                    editor.afterCommand($editable);
                }
            });
        };
        this.attach = function (layoutInfo, options) {
            if (options.shortcuts) {
                this.bindKeyMap(layoutInfo, options.keyMap[agent.isMac ? 'mac' : 'pc']);
            }
            layoutInfo.editable.on('mousedown', hMousedown);
            layoutInfo.editable.on('keyup mouseup', hToolbarAndPopoverUpdate);
            layoutInfo.editable.on('scroll', hScroll);
            layoutInfo.editable.on('paste', hPasteClipboardImage);
            layoutInfo.handle.on('mousedown', hHandleMousedown);
            layoutInfo.popover.on('click', hToolbarAndPopoverClick);
            layoutInfo.popover.on('mousedown', hToolbarAndPopoverMousedown);
            if (!options.airMode) {
                handleDragAndDropEvent(layoutInfo, options);
                layoutInfo.toolbar.on('click', hToolbarAndPopoverClick);
                layoutInfo.toolbar.on('mousedown', hToolbarAndPopoverMousedown);
                if (!options.disableResizeEditor) {
                    layoutInfo.statusbar.on('mousedown', hStatusbarMousedown);
                }
            }
            var $catcherContainer = options.airMode ? layoutInfo.popover : layoutInfo.toolbar;
            var $catcher = $catcherContainer.find('.note-dimension-picker-mousecatcher');
            $catcher.css({width: options.insertTableMaxSize.col + 'em', height: options.insertTableMaxSize.row + 'em'}).on('mousemove', function (event) {
                hDimensionPickerMove(event, options);
            });
            layoutInfo.editor.data('options', options);
            if (!agent.isMSIE) {
                setTimeout(function () {
                    document.execCommand('styleWithCSS', 0, options.styleWithSpan);
                }, 0);
            }
            var history = new History(layoutInfo.editable);
            layoutInfo.editable.data('NoteHistory', history);
            if (options.onenter) {
                layoutInfo.editable.keypress(function (event) {
                    if (event.keyCode === key.ENTER) {
                        options.onenter(event);
                    }
                });
            }
            if (options.onfocus) {
                layoutInfo.editable.focus(options.onfocus);
            }
            if (options.onblur) {
                layoutInfo.editable.blur(options.onblur);
            }
            if (options.onkeyup) {
                layoutInfo.editable.keyup(options.onkeyup);
            }
            if (options.onkeydown) {
                layoutInfo.editable.keydown(options.onkeydown);
            }
            if (options.onpaste) {
                layoutInfo.editable.on('paste', options.onpaste);
            }
            if (options.onToolbarClick) {
                layoutInfo.toolbar.click(options.onToolbarClick);
            }
            if (options.onChange) {
                var hChange = function () {
                    editor.triggerOnChange(layoutInfo.editable);
                };
                if (agent.isMSIE) {
                    var sDomEvents = 'DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted';
                    layoutInfo.editable.on(sDomEvents, hChange);
                } else {
                    layoutInfo.editable.on('input', hChange);
                }
            }

            layoutInfo.editable.data('callbacks', {onBeforeChange: options.onBeforeChange, onChange: options.onChange, onAutoSave: options.onAutoSave, onImageUpload: options.onImageUpload, onImageUploadError: options.onImageUploadError, onFileUpload: options.onFileUpload, onFileUploadError: options.onFileUpload, onMediaDelete: options.onMediaDelete});
        };
        this.detach = function (layoutInfo, options) {
            layoutInfo.editable.off();
            layoutInfo.popover.off();
            layoutInfo.handle.off();
            layoutInfo.dialog.off();
            if (!options.airMode) {
                layoutInfo.dropzone.off();
                layoutInfo.toolbar.off();
                layoutInfo.statusbar.off();
            }
        };
    };
    var Renderer = function () {
        var tplButton = function (label, options) {
            var event = options.event;
            var value = options.value;
            var title = options.title;
            var className = options.className;
            var dropdown = options.dropdown;
            var hide = options.hide;
            return'<button type="button"' + ' class="btn btn-default btn-sm btn-small' +
                (className ? ' ' + className : '') +
                (dropdown ? ' dropdown-toggle' : '') + '"' +
                (dropdown ? ' data-toggle="dropdown"' : '') +
                (title ? ' title="' + title + '"' : '') +
                (event ? ' data-event="' + event + '"' : '') +
                (value ? ' data-value=\'' + value + '\'' : '') +
                (hide ? ' data-hide=\'' + hide + '\'' : '') + ' tabindex="-1">' +
                label +
                (dropdown ? ' <span class="caret"></span>' : '') + '</button>' +
                (dropdown || '');
        };
        var tplIconButton = function (iconClassName, options) {
            var label = '<i class="' + iconClassName + '"></i>';
            return tplButton(label, options);
        };
        var tplPopover = function (className, content) {
            return'<div class="' + className + ' popover bottom in" style="display: none;">' + '<div class="arrow"></div>' + '<div class="popover-content">' +
                content + '</div>' + '</div>';
        };
        var tplDialog = function (className, title, body, footer) {
            return'<div class="' + className + ' modal" aria-hidden="false">' + '<div class="modal-dialog">' + '<div class="modal-content">' +
                (title ? '<div class="modal-header">' + '<button type="button" class="close" aria-hidden="true" tabindex="-1">&times;</button>' + '<h4 class="modal-title">' + title + '</h4>' + '</div>' : '') + '<form class="note-modal-form">' + '<div class="modal-body">' + body + '</div>' +
                (footer ? '<div class="modal-footer">' + footer + '</div>' : '') + '</form>' + '</div>' + '</div>' + '</div>';
        };
        var tplButtonInfo = {picture: function (lang) {
            return tplIconButton('fa fa-picture-o', {event: 'showImageDialog', title: lang.image.image, hide: true});
        }, link: function (lang) {
            return tplIconButton('fa fa-link', {event: 'showLinkDialog', title: lang.link.link, hide: true});
        }, table: function (lang) {
            var dropdown = '<ul class="note-table dropdown-menu">' + '<div class="note-dimension-picker">' + '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>' + '<div class="note-dimension-picker-highlighted"></div>' + '<div class="note-dimension-picker-unhighlighted"></div>' + '</div>' + '<div class="note-dimension-display"> 1 x 1 </div>' + '</ul>';
            return tplIconButton('fa fa-table', {title: lang.table.table, dropdown: dropdown});
        }, style: function (lang, options) {
            var items = options.styleTags.reduce(function (memo, v) {
                var label = lang.style[v === 'p' ? 'normal' : v];
                return memo + '<li><a data-event="formatBlock" href="#" data-value="' + v + '">' +
                    ((v === 'p' || v === 'pre') ? label : '<' + v + '>' + label + '</' + v + '>') + '</a></li>';
            }, '');
            return tplIconButton('fa fa-magic', {title: lang.style.style, dropdown: '<ul class="dropdown-menu">' + items + '</ul>'});
        }, fontname: function (lang, options) {
            var items = options.fontNames.reduce(function (memo, v) {
                if (!agent.isFontInstalled(v) && options.fontNamesIgnoreCheck.indexOf(v) === -1) {
                    return memo;
                }
                return memo + '<li><a data-event="fontName" href="#" data-value="' + v + '" style="font-family:\'' + v + '\'">' + '<i class="fa fa-check"></i> ' + v + '</a></li>';
            }, '');
            var label = '<span class="note-current-fontname">' +
                options.defaultFontName + '</span>';
            return tplButton(label, {title: lang.font.name, dropdown: '<ul class="dropdown-menu">' + items + '</ul>'});
        }, color: function (lang) {
            var colorButtonLabel = '<i class="fa fa-font" style="color:black;background-color:yellow;"></i>';
            var colorButton = tplButton(colorButtonLabel, {className: 'note-recent-color', title: lang.color.recent, event: 'color', value: '{"backColor":"yellow"}'});
            var dropdown = '<ul class="dropdown-menu">' + '<li>' + '<div class="btn-group">' + '<div class="note-palette-title">' + lang.color.background + '</div>' + '<div class="note-color-reset" data-event="backColor"' + ' data-value="inherit" title="' + lang.color.transparent + '">' +
                lang.color.setTransparent + '</div>' + '<div class="note-color-palette" data-target-event="backColor"></div>' + '</div>' + '<div class="btn-group">' + '<div class="note-palette-title">' + lang.color.foreground + '</div>' + '<div class="note-color-reset" data-event="foreColor" data-value="inherit" title="' + lang.color.reset + '">' +
                lang.color.resetToDefault + '</div>' + '<div class="note-color-palette" data-target-event="foreColor"></div>' + '</div>' + '</li>' + '</ul>';
            var moreButton = tplButton('', {title: lang.color.more, dropdown: dropdown});
            return colorButton + moreButton;
        }, bold: function (lang) {
            return tplIconButton('fa fa-bold', {event: 'bold', title: lang.font.bold});
        }, italic: function (lang) {
            return tplIconButton('fa fa-italic', {event: 'italic', title: lang.font.italic});
        }, underline: function (lang) {
            return tplIconButton('fa fa-underline', {event: 'underline', title: lang.font.underline});
        }, clear: function (lang) {
            return tplIconButton('fa fa-eraser', {event: 'removeFormat', title: lang.font.clear});
        }, ul: function (lang) {
            return tplIconButton('fa fa-list-ul', {event: 'insertUnorderedList', title: lang.lists.unordered});
        }, ol: function (lang) {
            return tplIconButton('fa fa-list-ol', {event: 'insertOrderedList', title: lang.lists.ordered});
        }, paragraph: function (lang) {
            var leftButton = tplIconButton('fa fa-align-left', {title: lang.paragraph.left, event: 'justifyLeft'});
            var centerButton = tplIconButton('fa fa-align-center', {title: lang.paragraph.center, event: 'justifyCenter'});
            var rightButton = tplIconButton('fa fa-align-right', {title: lang.paragraph.right, event: 'justifyRight'});
            var justifyButton = tplIconButton('fa fa-align-justify', {title: lang.paragraph.justify, event: 'justifyFull'});
            var outdentButton = tplIconButton('fa fa-outdent', {title: lang.paragraph.outdent, event: 'outdent'});
            var indentButton = tplIconButton('fa fa-indent', {title: lang.paragraph.indent, event: 'indent'});
            var dropdown = '<div class="dropdown-menu">' + '<div class="note-align btn-group">' +
                leftButton + centerButton + rightButton + justifyButton + '</div>' + '<div class="note-list btn-group">' +
                indentButton + outdentButton + '</div>' + '</div>';
            return tplIconButton('fa fa-align-left', {title: lang.paragraph.paragraph, dropdown: dropdown});
        }, height: function (lang, options) {
            var items = options.lineHeights.reduce(function (memo, v) {
                return memo + '<li><a data-event="lineHeight" href="#" data-value="' + parseFloat(v) + '">' + '<i class="fa fa-check"></i> ' + v + '</a></li>';
            }, '');
            return tplIconButton('fa fa-text-height', {title: lang.font.height, dropdown: '<ul class="dropdown-menu">' + items + '</ul>'});
        }, help: function (lang) {
            return tplIconButton('fa fa-question', {event: 'showHelpDialog', title: lang.options.help, hide: true});
        }, fullscreen: function (lang) {
            return tplIconButton('fa fa-arrows-alt', {event: 'fullscreen', title: lang.options.fullscreen});
        }, codeview: function (lang) {
            return tplIconButton('fa fa-code', {event: 'codeview', title: lang.options.codeview});
        }, undo: function (lang) {
            return tplIconButton('fa fa-undo', {event: 'undo', title: lang.history.undo});
        }, redo: function (lang) {
            return tplIconButton('fa fa-repeat', {event: 'redo', title: lang.history.redo});
        }, hr: function (lang) {
            return tplIconButton('fa fa-minus', {event: 'insertHorizontalRule', title: lang.hr.insert});
        }};
        var tplPopovers = function (lang, options) {
            var tplLinkPopover = function () {
                var linkButton = tplIconButton('fa fa-edit', {title: lang.link.edit, event: 'showLinkDialog', hide: true});
                var unlinkButton = tplIconButton('fa fa-unlink', {title: lang.link.unlink, event: 'unlink'});
                var content = '<a href="http://www.google.com" target="_blank">www.google.com</a>&nbsp;&nbsp;' + '<div class="note-insert btn-group">' +
                    linkButton + unlinkButton + '</div>';
                return tplPopover('note-link-popover', content);
            };
            var tplImagePopover = function () {
                var fullButton = tplButton('<span class="note-fontsize-10">100%</span>', {title: lang.image.resizeFull, event: 'resize', value: '1'});
                var halfButton = tplButton('<span class="note-fontsize-10">50%</span>', {title: lang.image.resizeHalf, event: 'resize', value: '0.5'});
                var quarterButton = tplButton('<span class="note-fontsize-10">25%</span>', {title: lang.image.resizeQuarter, event: 'resize', value: '0.25'});
                var leftButton = tplIconButton('fa fa-align-left', {title: lang.image.floatLeft, event: 'floatMe', value: 'left'});
                var rightButton = tplIconButton('fa fa-align-right', {title: lang.image.floatRight, event: 'floatMe', value: 'right'});
                var justifyButton = tplIconButton('fa fa-align-justify', {title: lang.image.floatNone, event: 'floatMe', value: 'none'});
                var roundedButton = tplIconButton('fa fa-square', {title: lang.image.shapeRounded, event: 'imageShape', value: 'img-rounded'});
                var circleButton = tplIconButton('fa fa-circle-o', {title: lang.image.shapeCircle, event: 'imageShape', value: 'img-circle'});
                var thumbnailButton = tplIconButton('fa fa-picture-o', {title: lang.image.shapeThumbnail, event: 'imageShape', value: 'img-thumbnail'});
                var noneButton = tplIconButton('fa fa-times', {title: lang.image.shapeNone, event: 'imageShape', value: ''});
                var removeButton = tplIconButton('fa fa-trash-o', {title: lang.image.remove, event: 'removeMedia', value: 'none'});
                var content = '<div class="btn-group">' + fullButton + halfButton + quarterButton + '</div>' + '<div class="btn-group">' + leftButton + rightButton + justifyButton + '</div>' + '<div class="btn-group">' + roundedButton + circleButton + thumbnailButton + noneButton + '</div>' + '<div class="btn-group">' + removeButton + '</div>';
                return tplPopover('note-image-popover', content);
            };
            var tplAirPopover = function () {
                var content = '';
                for (var idx = 0, len = options.airPopover.length; idx < len; idx++) {
                    var group = options.airPopover[idx];
                    content += '<div class="note-' + group[0] + ' btn-group">';
                    for (var i = 0, lenGroup = group[1].length; i < lenGroup; i++) {
                        content += tplButtonInfo[group[1][i]](lang, options);
                    }
                    content += '</div>';
                }
                return tplPopover('note-air-popover', content);
            };
            return'<div class="note-popover">' +
                tplLinkPopover() +
                tplImagePopover() +
                (options.airMode ? tplAirPopover() : '') + '</div>';
        };
        var tplHandles = function () {
            return'<div class="note-handle">' + '<div class="note-control-selection">' + '<div class="note-control-selection-bg"></div>' + '<div class="note-control-holder note-control-nw"></div>' + '<div class="note-control-holder note-control-ne"></div>' + '<div class="note-control-holder note-control-sw"></div>' + '<div class="note-control-sizing note-control-se"></div>' + '<div class="note-control-selection-info"></div>' + '</div>' + '</div>';
        };
        var tplShortcut = function (title, keys) {
            var keyClass = 'note-shortcut-col col-xs-6 note-shortcut-';
            var body = [];
            for (var i in keys) {
                if (keys.hasOwnProperty(i)) {
                    body.push('<div class="' + keyClass + 'key">' + keys[i].kbd + '</div>' + '<div class="' + keyClass + 'name">' + keys[i].text + '</div>');
                }
            }
            return'<div class="note-shortcut-row row"><div class="' + keyClass + 'title col-xs-offset-6">' + title + '</div></div>' + '<div class="note-shortcut-row row">' + body.join('</div><div class="note-shortcut-row row">') + '</div>';
        };
        var tplShortcutText = function (lang) {
            var keys = [
                {kbd: '⌘ + B', text: lang.font.bold},
                {kbd: '⌘ + I', text: lang.font.italic},
                {kbd: '⌘ + U', text: lang.font.underline},
                {kbd: '⌘ + \\', text: lang.font.clear}
            ];
            return tplShortcut(lang.shortcut.textFormatting, keys);
        };
        var tplShortcutAction = function (lang) {
            var keys = [
                {kbd: '⌘ + Z', text: lang.history.undo},
                {kbd: '⌘ + ⇧ + Z', text: lang.history.redo},
                {kbd: '⌘ + ]', text: lang.paragraph.indent},
                {kbd: '⌘ + [', text: lang.paragraph.outdent},
                {kbd: '⌘ + ENTER', text: lang.hr.insert}
            ];
            return tplShortcut(lang.shortcut.action, keys);
        };
        var tplShortcutPara = function (lang) {
            var keys = [
                {kbd: '⌘ + ⇧ + L', text: lang.paragraph.left},
                {kbd: '⌘ + ⇧ + E', text: lang.paragraph.center},
                {kbd: '⌘ + ⇧ + R', text: lang.paragraph.right},
                {kbd: '⌘ + ⇧ + J', text: lang.paragraph.justify},
                {kbd: '⌘ + ⇧ + NUM7', text: lang.lists.ordered},
                {kbd: '⌘ + ⇧ + NUM8', text: lang.lists.unordered}
            ];
            return tplShortcut(lang.shortcut.paragraphFormatting, keys);
        };
        var tplShortcutStyle = function (lang) {
            var keys = [
                {kbd: '⌘ + NUM0', text: lang.style.normal},
                {kbd: '⌘ + NUM1', text: lang.style.h1},
                {kbd: '⌘ + NUM2', text: lang.style.h2},
                {kbd: '⌘ + NUM3', text: lang.style.h3},
                {kbd: '⌘ + NUM4', text: lang.style.h4},
                {kbd: '⌘ + NUM5', text: lang.style.h5},
                {kbd: '⌘ + NUM6', text: lang.style.h6}
            ];
            return tplShortcut(lang.shortcut.documentStyle, keys);
        };
        var tplExtraShortcuts = function (lang, options) {
            var extraKeys = options.extraKeys;
            var keys = [];
            for (var key in extraKeys) {
                if (extraKeys.hasOwnProperty(key)) {
                    keys.push({kbd: key, text: extraKeys[key]});
                }
            }
            return tplShortcut(lang.shortcut.extraKeys, keys);
        };
        var tplShortcutTable = function (lang, options) {
            var colClass = 'class="note-shortcut note-shortcut-col col-sm-6 col-xs-12"';
            var template = ['<div ' + colClass + '>' + tplShortcutAction(lang, options) + '</div>' + '<div ' + colClass + '>' + tplShortcutText(lang, options) + '</div>', '<div ' + colClass + '>' + tplShortcutStyle(lang, options) + '</div>' + '<div ' + colClass + '>' + tplShortcutPara(lang, options) + '</div>'];
            if (options.extraKeys) {
                template.push('<div ' + colClass + '>' + tplExtraShortcuts(lang, options) + '</div>');
            }
            return'<div class="note-shortcut-row row">' +
                template.join('</div><div class="note-shortcut-row row">') + '</div>';
        };
        var replaceMacKeys = function (sHtml) {
            return sHtml.replace(/⌘/g, 'Ctrl').replace(/⇧/g, 'Shift');
        };
        var tplDialogInfo = {image: function (lang, options) {
            var imageLimitation = '';
            if (options.maximumImageFileSize) {
                var unit = Math.floor(Math.log(options.maximumImageFileSize) / Math.log(1024));
                var readableSize = (options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 + ' ' + ' KMGTP'[unit] + 'B';
                imageLimitation = '<small>' + lang.image.maximumFileSize + ' : ' + readableSize + '</small>';
            }
            var body = '<div class="form-group row-fluid note-group-select-from-files">' + '<label>' + lang.image.selectFromFiles + '</label>' + '<input class="note-image-input" type="file" name="files" accept="image/*" multiple="multiple" />' +
                imageLimitation + '</div>' + '<div class="form-group row-fluid">' + '<label>' + lang.image.url + '</label>' + '<input class="note-image-url form-control span12" type="text" />' + '</div>';
            var footer = '<button href="#" class="btn btn-primary note-image-btn disabled" disabled>' + lang.image.insert + '</button>';
            return tplDialog('note-image-dialog', lang.image.insert, body, footer);
        }, link: function (lang, options) {
            var body = '<div class="form-group row-fluid">' + '<label>' + lang.link.textToDisplay + '</label>' + '<input class="note-link-text form-control span12" type="text" />' + '</div>' + '<div class="form-group row-fluid">' + '<label>' + lang.link.url + '</label>' + '<input class="note-link-url form-control span12" type="text" />' + '</div>' +
                (!options.disableLinkTarget ? '<div class="checkbox">' + '<label>' + '<input type="checkbox" checked> ' +
                    lang.link.openInNewWindow + '</label>' + '</div>' : '');
            var footer = '<button href="#" class="btn btn-primary note-link-btn disabled" disabled>' + lang.link.insert + '</button>';
            return tplDialog('note-link-dialog', lang.link.insert, body, footer);
        }, help: function (lang, options) {
            var body = '<a class="modal-close pull-right" aria-hidden="true" tabindex="-1">' + lang.shortcut.close + '</a>' + '<div class="title">' + lang.shortcut.shortcuts + '</div>' +
                (agent.isMac ? tplShortcutTable(lang, options) : replaceMacKeys(tplShortcutTable(lang, options))) + '<p class="text-center">' + '<a href="//summernote.org/" target="_blank">Summernote 0.6.1</a> · ' + '<a href="//github.com/summernote/summernote" target="_blank">Project</a> · ' + '<a href="//github.com/summernote/summernote/issues" target="_blank">Issues</a>' + '</p>';
            return tplDialog('note-help-dialog', '', body, '');
        }};
        var tplDialogs = function (lang, options) {
            var dialogs = '';
            $.each(tplDialogInfo, function (idx, tplDialog) {
                dialogs += tplDialog(lang, options);
            });
            return'<div class="note-dialog">' + dialogs + '</div>';
        };
        var tplStatusbar = function () {
            return'<div class="note-resizebar">' + '<div class="note-icon-bar"></div>' + '<div class="note-icon-bar"></div>' + '<div class="note-icon-bar"></div>' + '</div>';
        };
        var representShortcut = function (str) {
            if (agent.isMac) {
                str = str.replace('CMD', '⌘').replace('SHIFT', '⇧');
            }
            return str.replace('BACKSLASH', '\\').replace('SLASH', '/').replace('LEFTBRACKET', '[').replace('RIGHTBRACKET', ']');
        };
        var createTooltip = function ($container, keyMap, sPlacement) {
            var invertedKeyMap = func.invertObject(keyMap);
            var $buttons = $container.find('button');
            $buttons.each(function (i, elBtn) {
                var $btn = $(elBtn);
                var sShortcut = invertedKeyMap[$btn.data('event')];
                if (sShortcut) {
                    $btn.attr('title', function (i, v) {
                        return v + ' (' + representShortcut(sShortcut) + ')';
                    });
                }

            }).tooltip({container: 'body', trigger: 'hover', placement: sPlacement || 'top'}).on('click', function () {
                $(this).tooltip('hide');
            });
        };
        var createPalette = function ($container, options) {
            var colorInfo = options.colors;
            $container.find('.note-color-palette').each(function () {
                var $palette = $(this), eventName = $palette.attr('data-target-event');
                var paletteContents = [];
                for (var row = 0, lenRow = colorInfo.length; row < lenRow; row++) {
                    var colors = colorInfo[row];
                    var buttons = [];
                    for (var col = 0, lenCol = colors.length; col < lenCol; col++) {
                        var color = colors[col];
                        buttons.push(['<button type="button" class="note-color-btn" style="background-color:', color, ';" data-event="', eventName, '" data-value="', color, '" title="', color, '" data-toggle="button" tabindex="-1"></button>'].join(''));
                    }
                    paletteContents.push('<div class="note-color-row">' + buttons.join('') + '</div>');
                }
                $palette.html(paletteContents.join(''));
            });
        };
        this.createLayoutByAirMode = function ($holder, options) {
            var langInfo = options.langInfo;
            var keyMap = options.keyMap[agent.isMac ? 'mac' : 'pc'];
            var id = func.uniqueId();
            $holder.addClass('note-air-editor note-editable');
            $holder.attr({'id': 'note-editor-' + id, 'contentEditable': true});
            var body = document.body;
            var $popover = $(tplPopovers(langInfo, options));
            $popover.addClass('note-air-layout');
            $popover.attr('id', 'note-popover-' + id);
            $popover.appendTo(body);
            createTooltip($popover, keyMap);
            createPalette($popover, options);
            var $handle = $(tplHandles());
            $handle.addClass('note-air-layout');
            $handle.attr('id', 'note-handle-' + id);
            $handle.appendTo(body);
            var $dialog = $(tplDialogs(langInfo, options));
            $dialog.addClass('note-air-layout');
            $dialog.attr('id', 'note-dialog-' + id);
            $dialog.find('button.close, a.modal-close').click(function () {
                $(this).closest('.modal').modal('hide');
            });
            $dialog.appendTo(body);
        };
        this.createLayoutByFrame = function ($holder, options) {
            var langInfo = options.langInfo;
            var $editor = $('<div class="note-editor"></div>');
            if (options.width) {
                $editor.width(options.width);
            }
            if (options.height > 0) {
                $('<div class="note-statusbar">' + (options.disableResizeEditor ? '' : tplStatusbar()) + '</div>').prependTo($editor);
            }
            var isContentEditable = !$holder.is(':disabled');
            var $editable = $('<div class="note-editable" contentEditable="' + isContentEditable + '"></div>').prependTo($editor);
            if (options.height) {
                $editable.height(options.height);
            }
            if (options.direction) {
                $editable.attr('dir', options.direction);
            }
            var placeholder = $holder.attr('placeholder') || options.placeholder;
            if (placeholder) {
                $editable.attr('data-placeholder', placeholder);
            }
            $editable.html(dom.html($holder));
            $('<textarea class="note-codable"></textarea>').prependTo($editor);
            var toolbarHTML = '';
            for (var idx = 0, len = options.toolbar.length; idx < len; idx++) {
                var groupName = options.toolbar[idx][0];
                var groupButtons = options.toolbar[idx][1];
                toolbarHTML += '<div class="note-' + groupName + ' btn-group">';
                for (var i = 0, btnLength = groupButtons.length; i < btnLength; i++) {
                    var buttonInfo = tplButtonInfo[groupButtons[i]];
                    if (!$.isFunction(buttonInfo)) {
                        continue;
                    }
                    toolbarHTML += buttonInfo(langInfo, options);
                }
                toolbarHTML += '</div>';
            }
            toolbarHTML = '<div class="note-toolbar btn-toolbar">' + toolbarHTML + '</div>';
            var $toolbar = $(toolbarHTML).prependTo($editor);
            var keyMap = options.keyMap[agent.isMac ? 'mac' : 'pc'];
            createPalette($toolbar, options);
            createTooltip($toolbar, keyMap, 'bottom');
            var $popover = $(tplPopovers(langInfo, options)).prependTo($editor);
            createPalette($popover, options);
            createTooltip($popover, keyMap);
            $(tplHandles()).prependTo($editor);
            var $dialog = $(tplDialogs(langInfo, options)).prependTo($editor);
            $dialog.find('button.close, a.modal-close').click(function () {
                $(this).closest('.modal').modal('hide');
            });
            $('<div class="note-dropzone"><div class="note-dropzone-message"></div></div>').prependTo($editor);
            $editor.insertAfter($holder);
            $holder.hide();
        };
        this.noteEditorFromHolder = function ($holder) {
            if ($holder.hasClass('note-air-editor')) {
                return $holder;
            } else if ($holder.next().hasClass('note-editor')) {
                return $holder.next();
            } else {
                return $();
            }
        };
        this.createLayout = function ($holder, options) {
            if (this.noteEditorFromHolder($holder).length) {
                return;
            }
            if (options.airMode) {
                this.createLayoutByAirMode($holder, options);
            } else {
                this.createLayoutByFrame($holder, options);
            }
        };
        this.layoutInfoFromHolder = function ($holder) {
            var $editor = this.noteEditorFromHolder($holder);
            if (!$editor.length) {
                return;
            }
            var layoutInfo = dom.buildLayoutInfo($editor);
            for (var key in layoutInfo) {
                if (layoutInfo.hasOwnProperty(key)) {
                    layoutInfo[key] = layoutInfo[key].call();
                }
            }
            return layoutInfo;
        };
        this.removeLayout = function ($holder, layoutInfo, options) {
            if (options.airMode) {
                $holder.removeClass('note-air-editor note-editable').removeAttr('id contentEditable');
                layoutInfo.popover.remove();
                layoutInfo.handle.remove();
                layoutInfo.dialog.remove();
            } else {
                $holder.html(layoutInfo.editable.html());
                layoutInfo.editor.remove();
                $holder.show();
            }
        };
        this.getTemplate = function () {
            return{button: tplButton, iconButton: tplIconButton, dialog: tplDialog};
        };
        this.addButtonInfo = function (name, buttonInfo) {
            tplButtonInfo[name] = buttonInfo;
        };
        this.addDialogInfo = function (name, dialogInfo) {
            tplDialogInfo[name] = dialogInfo;
        };
    };
    $.summernote = $.summernote || {};
    $.extend($.summernote, settings);
    var renderer = new Renderer();
    var eventHandler = new EventHandler();
    $.extend($.summernote, {renderer: renderer, eventHandler: eventHandler, core: {agent: agent, dom: dom, range: range}, pluginEvents: {}});
    $.summernote.addPlugin = function (plugin) {
        if (plugin.buttons) {
            $.each(plugin.buttons, function (name, button) {
                renderer.addButtonInfo(name, button);
            });
        }
        if (plugin.dialogs) {
            $.each(plugin.dialogs, function (name, dialog) {
                renderer.addDialogInfo(name, dialog);
            });
        }
        if (plugin.events) {
            $.each(plugin.events, function (name, event) {
                $.summernote.pluginEvents[name] = event;
            });
        }
        if (plugin.langs) {
            $.each(plugin.langs, function (locale, lang) {
                if ($.summernote.lang[locale]) {
                    $.extend($.summernote.lang[locale], lang);
                }
            });
        }
        if (plugin.options) {
            $.extend($.summernote.options, plugin.options);
        }
    };
    $.fn.extend({summernote: function (options) {
        options = $.extend({}, $.summernote.options, options);
        options.langInfo = $.extend(true, {}, $.summernote.lang['en-US'], $.summernote.lang[options.lang]);
        this.each(function (idx, holder) {
            var $holder = $(holder);
            renderer.createLayout($holder, options);
            var info = renderer.layoutInfoFromHolder($holder);
            eventHandler.attach(info, options);
            if (dom.isTextarea($holder[0])) {
                $holder.closest('form').submit(function () {
                    var contents = $holder.code();
                    $holder.val(contents);
                    if (options.onsubmit) {
                        options.onsubmit(contents);
                    }
                });
            }
        });
        if (this.first().length && options.focus) {
            var info = renderer.layoutInfoFromHolder(this.first());
            info.editable.focus();
        }
        if (this.length && options.oninit) {
            options.oninit();
        }
        return this;
    }, code: function (sHTML) {
        if (sHTML === undefined) {
            var $holder = this.first();
            if (!$holder.length) {
                return;
            }
            var info = renderer.layoutInfoFromHolder($holder);
            if (!!(info && info.editable)) {
                var isCodeview = info.editor.hasClass('codeview');
                if (isCodeview && agent.hasCodeMirror) {
                    info.codable.data('cmEditor').save();
                }
                return isCodeview ? info.codable.val() : info.editable.html();
            }
            return dom.isTextarea($holder[0]) ? $holder.val() : $holder.html();
        }
        this.each(function (i, holder) {
            var info = renderer.layoutInfoFromHolder($(holder));
            if (info && info.editable) {
                info.editable.html(sHTML);
            }
        });
        return this;
    }, destroy: function () {
        this.each(function (idx, holder) {
            var $holder = $(holder);
            var info = renderer.layoutInfoFromHolder($holder);
            if (!info || !info.editable) {
                return;
            }
            var options = info.editor.data('options');
            eventHandler.detach(info, options);
            renderer.removeLayout($holder, info, options);
        });
        return this;
    }});
}));