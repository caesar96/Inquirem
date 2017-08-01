/*
Turbolinks 5.0.3
Copyright © 2017 Basecamp, LLC
 */
(function() {
    (function() {
        (function() {
            this.Turbolinks = {
                supported: function() {
                    return null != window.history.pushState && null != window.requestAnimationFrame && null != window.addEventListener
                }(),
                visit: function(e, r) {
                    return t.controller.visit(e, r)
                },
                clearCache: function() {
                    return t.controller.clearCache()
                }
            }
        }).call(this)
    }).call(this);
    var t = this.Turbolinks;
    (function() {
        (function() {
            var e, r, n = [].slice;
            t.copyObject = function(t) {
                var e, r, n;
                r = {};
                for (e in t) n = t[e], r[e] = n;
                return r
            }, t.closest = function(t, r) {
                return e.call(t, r)
            }, e = function() {
                var t, e;
                return t = document.documentElement, null != (e = t.closest) ? e : function(t) {
                    var e;
                    for (e = this; e;) {
                        if (e.nodeType === Node.ELEMENT_NODE && r.call(e, t)) return e;
                        e = e.parentNode
                    }
                }
            }(), t.defer = function(t) {
                return setTimeout(t, 1)
            }, t.throttle = function(t) {
                var e;
                return e = null,
                    function() {
                        var r;
                        return r = 1 <= arguments.length ? n.call(arguments, 0) : [], null != e ? e : e = requestAnimationFrame(function(n) {
                            return function() {
                                return e = null, t.apply(n, r)
                            }
                        }(this))
                    }
            }, t.dispatch = function(t, e) {
                var r, n, o, i, s;
                return i = null != e ? e : {}, s = i.target, r = i.cancelable, n = i.data, o = document.createEvent("Events"), o.initEvent(t, !0, r === !0), o.data = null != n ? n : {}, (null != s ? s : document).dispatchEvent(o), o
            }, t.match = function(t, e) {
                return r.call(t, e)
            }, r = function() {
                var t, e, r, n;
                return t = document.documentElement, null != (e = null != (r = null != (n = t.matchesSelector) ? n : t.webkitMatchesSelector) ? r : t.msMatchesSelector) ? e : t.mozMatchesSelector
            }(), t.uuid = function() {
                var t, e, r;
                for (r = "", t = e = 1; 36 >= e; t = ++e) r += 9 === t || 14 === t || 19 === t || 24 === t ? "-" : 15 === t ? "4" : 20 === t ? (Math.floor(4 * Math.random()) + 8).toString(16) : Math.floor(15 * Math.random()).toString(16);
                return r
            }
        }).call(this),
            function() {
                t.Location = function() {
                    function t(t) {
                        var e, r;
                        null == t && (t = ""), r = document.createElement("a"), r.href = t.toString(), this.absoluteURL = r.href, e = r.hash.length, 2 > e ? this.requestURL = this.absoluteURL : (this.requestURL = this.absoluteURL.slice(0, -e), this.anchor = r.hash.slice(1))
                    }
                    var e, r, n, o;
                    return t.wrap = function(t) {
                        return t instanceof this ? t : new this(t)
                    }, t.prototype.getOrigin = function() {
                        return this.absoluteURL.split("/", 3).join("/")
                    }, t.prototype.getPath = function() {
                        var t, e;
                        return null != (t = null != (e = this.absoluteURL.match(/\/\/[^\/]*(\/[^?;]*)/)) ? e[1] : void 0) ? t : "/"
                    }, t.prototype.getPathComponents = function() {
                        return this.getPath().split("/").slice(1)
                    }, t.prototype.getLastPathComponent = function() {
                        return this.getPathComponents().slice(-1)[0]
                    }, t.prototype.getExtension = function() {
                        var t, e;
                        return null != (t = null != (e = this.getLastPathComponent().match(/\.[^.]*$/)) ? e[0] : void 0) ? t : ""
                    }, t.prototype.isHTML = function() {
                        return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)
                    }, t.prototype.isPrefixedBy = function(t) {
                        var e;
                        return e = r(t), this.isEqualTo(t) || o(this.absoluteURL, e)
                    }, t.prototype.isEqualTo = function(t) {
                        return this.absoluteURL === (null != t ? t.absoluteURL : void 0)
                    }, t.prototype.toCacheKey = function() {
                        return this.requestURL
                    }, t.prototype.toJSON = function() {
                        return this.absoluteURL
                    }, t.prototype.toString = function() {
                        return this.absoluteURL
                    }, t.prototype.valueOf = function() {
                        return this.absoluteURL
                    }, r = function(t) {
                        return e(t.getOrigin() + t.getPath())
                    }, e = function(t) {
                        return n(t, "/") ? t : t + "/"
                    }, o = function(t, e) {
                        return t.slice(0, e.length) === e
                    }, n = function(t, e) {
                        return t.slice(-e.length) === e
                    }, t
                }()
            }.call(this),
            function() {
                var e = function(t, e) {
                    return function() {
                        return t.apply(e, arguments)
                    }
                };
                t.HttpRequest = function() {
                    function r(r, n, o) {
                        this.delegate = r, this.requestCanceled = e(this.requestCanceled, this), this.requestTimedOut = e(this.requestTimedOut, this), this.requestFailed = e(this.requestFailed, this), this.requestLoaded = e(this.requestLoaded, this), this.requestProgressed = e(this.requestProgressed, this), this.url = t.Location.wrap(n).requestURL, this.referrer = t.Location.wrap(o).absoluteURL, this.createXHR()
                    }
                    return r.NETWORK_FAILURE = 0, r.TIMEOUT_FAILURE = -1, r.timeout = 60, r.prototype.send = function() {
                        var t;
                        return this.xhr && !this.sent ? (this.notifyApplicationBeforeRequestStart(), this.setProgress(0), this.xhr.send(), this.sent = !0, "function" == typeof(t = this.delegate).requestStarted ? t.requestStarted() : void 0) : void 0
                    }, r.prototype.cancel = function() {
                        return this.xhr && this.sent ? this.xhr.abort() : void 0
                    }, r.prototype.requestProgressed = function(t) {
                        return t.lengthComputable ? this.setProgress(t.loaded / t.total) : void 0
                    }, r.prototype.requestLoaded = function() {
                        return this.endRequest(function(t) {
                            return function() {
                                var e;
                                return 200 <= (e = t.xhr.status) && 300 > e ? t.delegate.requestCompletedWithResponse(t.xhr.responseText, t.xhr.getResponseHeader("Turbolinks-Location")) : (t.failed = !0, t.delegate.requestFailedWithStatusCode(t.xhr.status, t.xhr.responseText))
                            }
                        }(this))
                    }, r.prototype.requestFailed = function() {
                        return this.endRequest(function(t) {
                            return function() {
                                return t.failed = !0, t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)
                            }
                        }(this))
                    }, r.prototype.requestTimedOut = function() {
                        return this.endRequest(function(t) {
                            return function() {
                                return t.failed = !0, t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)
                            }
                        }(this))
                    }, r.prototype.requestCanceled = function() {
                        return this.endRequest()
                    }, r.prototype.notifyApplicationBeforeRequestStart = function() {
                        return t.dispatch("turbolinks:request-start", {
                            data: {
                                url: this.url,
                                xhr: this.xhr
                            }
                        })
                    }, r.prototype.notifyApplicationAfterRequestEnd = function() {
                        return t.dispatch("turbolinks:request-end", {
                            data: {
                                url: this.url,
                                xhr: this.xhr
                            }
                        })
                    }, r.prototype.createXHR = function() {
                        return this.xhr = new XMLHttpRequest, this.xhr.open("GET", this.url, !0), this.xhr.timeout = 1e3 * this.constructor.timeout, this.xhr.setRequestHeader("Accept", "text/html, application/xhtml+xml"), this.xhr.setRequestHeader("Turbolinks-Referrer", this.referrer), this.xhr.onprogress = this.requestProgressed, this.xhr.onload = this.requestLoaded, this.xhr.onerror = this.requestFailed, this.xhr.ontimeout = this.requestTimedOut, this.xhr.onabort = this.requestCanceled
                    }, r.prototype.endRequest = function(t) {
                        return this.xhr ? (this.notifyApplicationAfterRequestEnd(), null != t && t.call(this), this.destroy()) : void 0
                    }, r.prototype.setProgress = function(t) {
                        var e;
                        return this.progress = t, "function" == typeof(e = this.delegate).requestProgressed ? e.requestProgressed(this.progress) : void 0
                    }, r.prototype.destroy = function() {
                        var t;
                        return this.setProgress(1), "function" == typeof(t = this.delegate).requestFinished && t.requestFinished(), this.delegate = null, this.xhr = null
                    }, r
                }()
            }.call(this),
            function() {
                var e = function(t, e) {
                    return function() {
                        return t.apply(e, arguments)
                    }
                };
                t.ProgressBar = function() {
                    function t() {
                        this.trickle = e(this.trickle, this), this.stylesheetElement = this.createStylesheetElement(), this.progressElement = this.createProgressElement()
                    }
                    var r;
                    return r = 300, t.defaultCSS = ".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width " + r + "ms ease-out, opacity " + r / 2 + "ms " + r / 2 + "ms ease-in;\n  transform: translate3d(0, 0, 0);\n}", t.prototype.show = function() {
                        return this.visible ? void 0 : (this.visible = !0, this.installStylesheetElement(), this.installProgressElement(), this.startTrickling())
                    }, t.prototype.hide = function() {
                        return this.visible && !this.hiding ? (this.hiding = !0, this.fadeProgressElement(function(t) {
                            return function() {
                                return t.uninstallProgressElement(), t.stopTrickling(), t.visible = !1, t.hiding = !1
                            }
                        }(this))) : void 0
                    }, t.prototype.setValue = function(t) {
                        return this.value = t, this.refresh()
                    }, t.prototype.installStylesheetElement = function() {
                        return document.head.insertBefore(this.stylesheetElement, document.head.firstChild)
                    }, t.prototype.installProgressElement = function() {
                        return this.progressElement.style.width = 0, this.progressElement.style.opacity = 1, document.documentElement.insertBefore(this.progressElement, document.body), this.refresh()
                    }, t.prototype.fadeProgressElement = function(t) {
                        return this.progressElement.style.opacity = 0, setTimeout(t, 1.5 * r)
                    }, t.prototype.uninstallProgressElement = function() {
                        return this.progressElement.parentNode ? document.documentElement.removeChild(this.progressElement) : void 0
                    }, t.prototype.startTrickling = function() {
                        return null != this.trickleInterval ? this.trickleInterval : this.trickleInterval = setInterval(this.trickle, r)
                    }, t.prototype.stopTrickling = function() {
                        return clearInterval(this.trickleInterval), this.trickleInterval = null
                    }, t.prototype.trickle = function() {
                        return this.setValue(this.value + Math.random() / 100)
                    }, t.prototype.refresh = function() {
                        return requestAnimationFrame(function(t) {
                            return function() {
                                return t.progressElement.style.width = 10 + 90 * t.value + "%"
                            }
                        }(this))
                    }, t.prototype.createStylesheetElement = function() {
                        var t;
                        return t = document.createElement("style"), t.type = "text/css", t.textContent = this.constructor.defaultCSS, t
                    }, t.prototype.createProgressElement = function() {
                        var t;
                        return t = document.createElement("div"), t.className = "turbolinks-progress-bar", t
                    }, t
                }()
            }.call(this),
            function() {
                var e = function(t, e) {
                    return function() {
                        return t.apply(e, arguments)
                    }
                };
                t.BrowserAdapter = function() {
                    function r(r) {
                        this.controller = r, this.showProgressBar = e(this.showProgressBar, this), this.progressBar = new t.ProgressBar
                    }
                    var n, o, i, s;
                    return s = t.HttpRequest, n = s.NETWORK_FAILURE, i = s.TIMEOUT_FAILURE, o = 500, r.prototype.visitProposedToLocationWithAction = function(t, e) {
                        return this.controller.startVisitToLocationWithAction(t, e)
                    }, r.prototype.visitStarted = function(t) {
                        return t.issueRequest(), t.changeHistory(), t.loadCachedSnapshot()
                    }, r.prototype.visitRequestStarted = function(t) {
                        return this.progressBar.setValue(0), t.hasCachedSnapshot() || "restore" !== t.action ? this.showProgressBarAfterDelay() : this.showProgressBar()
                    }, r.prototype.visitRequestProgressed = function(t) {
                        return this.progressBar.setValue(t.progress)
                    }, r.prototype.visitRequestCompleted = function(t) {
                        return t.loadResponse()
                    }, r.prototype.visitRequestFailedWithStatusCode = function(t, e) {
                        switch (e) {
                            case n:
                            case i:
                                return this.reload();
                            default:
                                return t.loadResponse()
                        }
                    }, r.prototype.visitRequestFinished = function(t) {
                        return this.hideProgressBar()
                    }, r.prototype.visitCompleted = function(t) {
                        return t.followRedirect()
                    }, r.prototype.pageInvalidated = function() {
                        return this.reload()
                    }, r.prototype.showProgressBarAfterDelay = function() {
                        return this.progressBarTimeout = setTimeout(this.showProgressBar, o)
                    }, r.prototype.showProgressBar = function() {
                        return this.progressBar.show()
                    }, r.prototype.hideProgressBar = function() {
                        return this.progressBar.hide(), clearTimeout(this.progressBarTimeout)
                    }, r.prototype.reload = function() {
                        return window.location.reload()
                    }, r
                }()
            }.call(this),
            function() {
                var e = function(t, e) {
                    return function() {
                        return t.apply(e, arguments)
                    }
                };
                t.History = function() {
                    function r(t) {
                        this.delegate = t, this.onPageLoad = e(this.onPageLoad, this), this.onPopState = e(this.onPopState, this)
                    }
                    return r.prototype.start = function() {
                        return this.started ? void 0 : (addEventListener("popstate", this.onPopState, !1), addEventListener("load", this.onPageLoad, !1), this.started = !0)
                    }, r.prototype.stop = function() {
                        return this.started ? (removeEventListener("popstate", this.onPopState, !1), removeEventListener("load", this.onPageLoad, !1), this.started = !1) : void 0
                    }, r.prototype.push = function(e, r) {
                        return e = t.Location.wrap(e), this.update("push", e, r)
                    }, r.prototype.replace = function(e, r) {
                        return e = t.Location.wrap(e), this.update("replace", e, r)
                    }, r.prototype.onPopState = function(e) {
                        var r, n, o, i;
                        return this.shouldHandlePopState() && (i = null != (n = e.state) ? n.turbolinks : void 0) ? (r = t.Location.wrap(window.location), o = i.restorationIdentifier, this.delegate.historyPoppedToLocationWithRestorationIdentifier(r, o)) : void 0
                    }, r.prototype.onPageLoad = function(e) {
                        return t.defer(function(t) {
                            return function() {
                                return t.pageLoaded = !0
                            }
                        }(this))
                    }, r.prototype.shouldHandlePopState = function() {
                        return this.pageIsLoaded()
                    }, r.prototype.pageIsLoaded = function() {
                        return this.pageLoaded || "complete" === document.readyState
                    }, r.prototype.update = function(t, e, r) {
                        var n;
                        return n = {
                            turbolinks: {
                                restorationIdentifier: r
                            }
                        }, history[t + "State"](n, null, e)
                    }, r
                }()
            }.call(this),
            function() {
                t.Snapshot = function() {
                    function e(t) {
                        var e, r;
                        r = t.head, e = t.body, this.head = null != r ? r : document.createElement("head"), this.body = null != e ? e : document.createElement("body")
                    }
                    return e.wrap = function(t) {
                        return t instanceof this ? t : this.fromHTML(t)
                    }, e.fromHTML = function(t) {
                        var e;
                        return e = document.createElement("html"), e.innerHTML = t, this.fromElement(e)
                    }, e.fromElement = function(t) {
                        return new this({
                            head: t.querySelector("head"),
                            body: t.querySelector("body")
                        })
                    }, e.prototype.clone = function() {
                        return new e({
                            head: this.head.cloneNode(!0),
                            body: this.body.cloneNode(!0)
                        })
                    }, e.prototype.getRootLocation = function() {
                        var e, r;
                        return r = null != (e = this.getSetting("root")) ? e : "/", new t.Location(r)
                    }, e.prototype.getCacheControlValue = function() {
                        return this.getSetting("cache-control")
                    }, e.prototype.hasAnchor = function(t) {
                        try {
                            return null != this.body.querySelector("[id='" + t + "']")
                        } catch (e) {}
                    }, e.prototype.isPreviewable = function() {
                        return "no-preview" !== this.getCacheControlValue()
                    }, e.prototype.isCacheable = function() {
                        return "no-cache" !== this.getCacheControlValue()
                    }, e.prototype.getSetting = function(t) {
                        var e, r;
                        return r = this.head.querySelectorAll("meta[name='turbolinks-" + t + "']"), e = r[r.length - 1], null != e ? e.getAttribute("content") : void 0
                    }, e
                }()
            }.call(this),
            function() {
                var e = [].slice;
                t.Renderer = function() {
                    function t() {}
                    var r;
                    return t.render = function() {
                        var t, r, n, o;
                        return n = arguments[0], r = arguments[1], t = 3 <= arguments.length ? e.call(arguments, 2) : [], o = function(t, e, r) {
                            r.prototype = t.prototype;
                            var n = new r,
                                o = t.apply(n, e);
                            return Object(o) === o ? o : n
                        }(this, t, function() {}), o.delegate = n, o.render(r), o
                    }, t.prototype.renderView = function(t) {
                        return this.delegate.viewWillRender(this.newBody), t(), this.delegate.viewRendered(this.newBody)
                    }, t.prototype.invalidateView = function() {
                        return this.delegate.viewInvalidated()
                    }, t.prototype.createScriptElement = function(t) {
                        var e;
                        return "false" === t.getAttribute("data-turbolinks-eval") ? t : (e = document.createElement("script"), e.textContent = t.textContent, r(e, t), e)
                    }, r = function(t, e) {
                        var r, n, o, i, s, a, u;
                        for (i = e.attributes, a = [], r = 0, n = i.length; n > r; r++) s = i[r], o = s.name, u = s.value, a.push(t.setAttribute(o, u));
                        return a
                    }, t
                }()
            }.call(this),
            function() {
                t.HeadDetails = function() {
                    function t(t) {
                        var e, r, i, s, a, u, l;
                        for (this.element = t, this.elements = {}, l = this.element.childNodes, s = 0, u = l.length; u > s; s++) i = l[s], i.nodeType === Node.ELEMENT_NODE && (a = i.outerHTML, r = null != (e = this.elements)[a] ? e[a] : e[a] = {
                            type: o(i),
                            tracked: n(i),
                            elements: []
                        }, r.elements.push(i))
                    }
                    var e, r, n, o;
                    return t.prototype.hasElementWithKey = function(t) {
                        return t in this.elements
                    }, t.prototype.getTrackedElementSignature = function() {
                        var t, e;
                        return function() {
                            var r, n;
                            r = this.elements, n = [];
                            for (t in r) e = r[t].tracked, e && n.push(t);
                            return n
                        }.call(this).join("")
                    }, t.prototype.getScriptElementsNotInDetails = function(t) {
                        return this.getElementsMatchingTypeNotInDetails("script", t)
                    }, t.prototype.getStylesheetElementsNotInDetails = function(t) {
                        return this.getElementsMatchingTypeNotInDetails("stylesheet", t)
                    }, t.prototype.getElementsMatchingTypeNotInDetails = function(t, e) {
                        var r, n, o, i, s, a;
                        o = this.elements, s = [];
                        for (n in o) i = o[n], a = i.type, r = i.elements, a !== t || e.hasElementWithKey(n) || s.push(r[0]);
                        return s
                    }, t.prototype.getProvisionalElements = function() {
                        var t, e, r, n, o, i, s;
                        r = [], n = this.elements;
                        for (e in n) o = n[e], s = o.type, i = o.tracked, t = o.elements, null != s || i ? t.length > 1 && r.push.apply(r, t.slice(1)) : r.push.apply(r, t);
                        return r
                    }, o = function(t) {
                        return e(t) ? "script" : r(t) ? "stylesheet" : void 0
                    }, n = function(t) {
                        return "reload" === t.getAttribute("data-turbolinks-track")
                    }, e = function(t) {
                        var e;
                        return e = t.tagName.toLowerCase(), "script" === e
                    }, r = function(t) {
                        var e;
                        return e = t.tagName.toLowerCase(), "style" === e || "link" === e && "stylesheet" === t.getAttribute("rel")
                    }, t
                }()
            }.call(this),
            function() {
                var e = function(t, e) {
                        function n() {
                            this.constructor = t
                        }
                        for (var o in e) r.call(e, o) && (t[o] = e[o]);
                        return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
                    },
                    r = {}.hasOwnProperty;
                t.SnapshotRenderer = function(r) {
                    function n(e, r) {
                        this.currentSnapshot = e, this.newSnapshot = r, this.currentHeadDetails = new t.HeadDetails(this.currentSnapshot.head), this.newHeadDetails = new t.HeadDetails(this.newSnapshot.head), this.newBody = this.newSnapshot.body
                    }
                    return e(n, r), n.prototype.render = function(t) {
                        return this.trackedElementsAreIdentical() ? (this.mergeHead(), this.renderView(function(e) {
                            return function() {
                                return e.replaceBody(), e.focusFirstAutofocusableElement(), t()
                            }
                        }(this))) : this.invalidateView()
                    }, n.prototype.mergeHead = function() {
                        return this.copyNewHeadStylesheetElements(), this.copyNewHeadScriptElements(), this.removeCurrentHeadProvisionalElements(), this.copyNewHeadProvisionalElements()
                    }, n.prototype.replaceBody = function() {
                        return this.activateBodyScriptElements(), this.importBodyPermanentElements(), this.assignNewBody()
                    }, n.prototype.trackedElementsAreIdentical = function() {
                        return this.currentHeadDetails.getTrackedElementSignature() === this.newHeadDetails.getTrackedElementSignature()
                    }, n.prototype.copyNewHeadStylesheetElements = function() {
                        var t, e, r, n, o;
                        for (n = this.getNewHeadStylesheetElements(), o = [], e = 0, r = n.length; r > e; e++) t = n[e], o.push(document.head.appendChild(t));
                        return o
                    }, n.prototype.copyNewHeadScriptElements = function() {
                        var t, e, r, n, o;
                        for (n = this.getNewHeadScriptElements(), o = [], e = 0, r = n.length; r > e; e++) t = n[e], o.push(document.head.appendChild(this.createScriptElement(t)));
                        return o
                    }, n.prototype.removeCurrentHeadProvisionalElements = function() {
                        var t, e, r, n, o;
                        for (n = this.getCurrentHeadProvisionalElements(), o = [], e = 0, r = n.length; r > e; e++) t = n[e], o.push(document.head.removeChild(t));
                        return o
                    }, n.prototype.copyNewHeadProvisionalElements = function() {
                        var t, e, r, n, o;
                        for (n = this.getNewHeadProvisionalElements(), o = [], e = 0, r = n.length; r > e; e++) t = n[e], o.push(document.head.appendChild(t));
                        return o
                    }, n.prototype.importBodyPermanentElements = function() {
                        var t, e, r, n, o, i;
                        for (n = this.getNewBodyPermanentElements(), i = [], e = 0, r = n.length; r > e; e++) o = n[e], (t = this.findCurrentBodyPermanentElement(o)) ? i.push(o.parentNode.replaceChild(t, o)) : i.push(void 0);
                        return i
                    }, n.prototype.activateBodyScriptElements = function() {
                        var t, e, r, n, o, i;
                        for (n = this.getNewBodyScriptElements(), i = [], e = 0, r = n.length; r > e; e++) o = n[e], t = this.createScriptElement(o), i.push(o.parentNode.replaceChild(t, o));
                        return i
                    }, n.prototype.assignNewBody = function() {
                        return document.body = this.newBody
                    }, n.prototype.focusFirstAutofocusableElement = function() {
                        var t;
                        return null != (t = this.findFirstAutofocusableElement()) ? t.focus() : void 0
                    }, n.prototype.getNewHeadStylesheetElements = function() {
                        return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)
                    }, n.prototype.getNewHeadScriptElements = function() {
                        return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)
                    }, n.prototype.getCurrentHeadProvisionalElements = function() {
                        return this.currentHeadDetails.getProvisionalElements()
                    }, n.prototype.getNewHeadProvisionalElements = function() {
                        return this.newHeadDetails.getProvisionalElements()
                    }, n.prototype.getNewBodyPermanentElements = function() {
                        return this.newBody.querySelectorAll("[id][data-turbolinks-permanent]")
                    }, n.prototype.findCurrentBodyPermanentElement = function(t) {
                        return document.body.querySelector("#" + t.id + "[data-turbolinks-permanent]")
                    }, n.prototype.getNewBodyScriptElements = function() {
                        return this.newBody.querySelectorAll("script")
                    }, n.prototype.findFirstAutofocusableElement = function() {
                        return document.body.querySelector("[autofocus]")
                    }, n
                }(t.Renderer)
            }.call(this),
            function() {
                var e = function(t, e) {
                        function n() {
                            this.constructor = t
                        }
                        for (var o in e) r.call(e, o) && (t[o] = e[o]);
                        return n.prototype = e.prototype, t.prototype = new n, t.__super__ = e.prototype, t
                    },
                    r = {}.hasOwnProperty;
                t.ErrorRenderer = function(t) {
                    function r(t) {
                        this.html = t
                    }
                    return e(r, t), r.prototype.render = function(t) {
                        return this.renderView(function(e) {
                            return function() {
                                return e.replaceDocumentHTML(), e.activateBodyScriptElements(), t()
                            }
                        }(this))
                    }, r.prototype.replaceDocumentHTML = function() {
                        return document.documentElement.innerHTML = this.html
                    }, r.prototype.activateBodyScriptElements = function() {
                        var t, e, r, n, o, i;
                        for (n = this.getScriptElements(), i = [], e = 0, r = n.length; r > e; e++) o = n[e], t = this.createScriptElement(o), i.push(o.parentNode.replaceChild(t, o));
                        return i
                    }, r.prototype.getScriptElements = function() {
                        return document.documentElement.querySelectorAll("script")
                    }, r
                }(t.Renderer)
            }.call(this),
            function() {
                t.View = function() {
                    function e(t) {
                        this.delegate = t, this.element = document.documentElement
                    }
                    return e.prototype.getRootLocation = function() {
                        return this.getSnapshot().getRootLocation()
                    }, e.prototype.getSnapshot = function() {
                        return t.Snapshot.fromElement(this.element)
                    }, e.prototype.render = function(t, e) {
                        var r, n, o;
                        return o = t.snapshot, r = t.error, n = t.isPreview, this.markAsPreview(n), null != o ? this.renderSnapshot(o, e) : this.renderError(r, e)
                    }, e.prototype.markAsPreview = function(t) {
                        return t ? this.element.setAttribute("data-turbolinks-preview", "") : this.element.removeAttribute("data-turbolinks-preview")
                    }, e.prototype.renderSnapshot = function(e, r) {
                        return t.SnapshotRenderer.render(this.delegate, r, this.getSnapshot(), t.Snapshot.wrap(e))
                    }, e.prototype.renderError = function(e, r) {
                        return t.ErrorRenderer.render(this.delegate, r, e)
                    }, e
                }()
            }.call(this),
            function() {
                var e = function(t, e) {
                    return function() {
                        return t.apply(e, arguments)
                    }
                };
                t.ScrollManager = function() {
                    function r(r) {
                        this.delegate = r, this.onScroll = e(this.onScroll, this), this.onScroll = t.throttle(this.onScroll)
                    }
                    return r.prototype.start = function() {
                        return this.started ? void 0 : (addEventListener("scroll", this.onScroll, !1), this.onScroll(), this.started = !0)
                    }, r.prototype.stop = function() {
                        return this.started ? (removeEventListener("scroll", this.onScroll, !1), this.started = !1) : void 0
                    }, r.prototype.scrollToElement = function(t) {
                        return t.scrollIntoView()
                    }, r.prototype.scrollToPosition = function(t) {
                        var e, r;
                        return e = t.x, r = t.y, window.scrollTo(e, r)
                    }, r.prototype.onScroll = function(t) {
                        return this.updatePosition({
                            x: window.pageXOffset,
                            y: window.pageYOffset
                        })
                    }, r.prototype.updatePosition = function(t) {
                        var e;
                        return this.position = t, null != (e = this.delegate) ? e.scrollPositionChanged(this.position) : void 0
                    }, r
                }()
            }.call(this),
            function() {
                t.SnapshotCache = function() {
                    function e(t) {
                        this.size = t, this.keys = [], this.snapshots = {}
                    }
                    var r;
                    return e.prototype.has = function(t) {
                        var e;
                        return e = r(t), e in this.snapshots
                    }, e.prototype.get = function(t) {
                        var e;
                        if (this.has(t)) return e = this.read(t), this.touch(t), e
                    }, e.prototype.put = function(t, e) {
                        return this.write(t, e), this.touch(t), e
                    }, e.prototype.read = function(t) {
                        var e;
                        return e = r(t), this.snapshots[e]
                    }, e.prototype.write = function(t, e) {
                        var n;
                        return n = r(t), this.snapshots[n] = e
                    }, e.prototype.touch = function(t) {
                        var e, n;
                        return n = r(t), e = this.keys.indexOf(n), e > -1 && this.keys.splice(e, 1), this.keys.unshift(n), this.trim()
                    }, e.prototype.trim = function() {
                        var t, e, r, n, o;
                        for (n = this.keys.splice(this.size), o = [], t = 0, r = n.length; r > t; t++) e = n[t], o.push(delete this.snapshots[e]);
                        return o
                    }, r = function(e) {
                        return t.Location.wrap(e).toCacheKey()
                    }, e
                }()
            }.call(this),
            function() {
                var e = function(t, e) {
                    return function() {
                        return t.apply(e, arguments)
                    }
                };
                t.Visit = function() {
                    function r(r, n, o) {
                        this.controller = r, this.action = o, this.performScroll = e(this.performScroll, this), this.identifier = t.uuid(), this.location = t.Location.wrap(n), this.adapter = this.controller.adapter, this.state = "initialized", this.timingMetrics = {}
                    }
                    var n;
                    return r.prototype.start = function() {
                        return "initialized" === this.state ? (this.recordTimingMetric("visitStart"), this.state = "started", this.adapter.visitStarted(this)) : void 0
                    }, r.prototype.cancel = function() {
                        var t;
                        return "started" === this.state ? (null != (t = this.request) && t.cancel(), this.cancelRender(), this.state = "canceled") : void 0
                    }, r.prototype.complete = function() {
                        var t;
                        return "started" === this.state ? (this.recordTimingMetric("visitEnd"), this.state = "completed", "function" == typeof(t = this.adapter).visitCompleted && t.visitCompleted(this), this.controller.visitCompleted(this)) : void 0
                    }, r.prototype.fail = function() {
                        var t;
                        return "started" === this.state ? (this.state = "failed", "function" == typeof(t = this.adapter).visitFailed ? t.visitFailed(this) : void 0) : void 0
                    }, r.prototype.changeHistory = function() {
                        var t, e;
                        return this.historyChanged ? void 0 : (t = this.location.isEqualTo(this.referrer) ? "replace" : this.action, e = n(t), this.controller[e](this.location, this.restorationIdentifier), this.historyChanged = !0)
                    }, r.prototype.issueRequest = function() {
                        return this.shouldIssueRequest() && null == this.request ? (this.progress = 0, this.request = new t.HttpRequest(this, this.location, this.referrer), this.request.send()) : void 0
                    }, r.prototype.getCachedSnapshot = function() {
                        var t;
                        return !(t = this.controller.getCachedSnapshotForLocation(this.location)) || null != this.location.anchor && !t.hasAnchor(this.location.anchor) || "restore" !== this.action && !t.isPreviewable() ? void 0 : t
                    }, r.prototype.hasCachedSnapshot = function() {
                        return null != this.getCachedSnapshot()
                    }, r.prototype.loadCachedSnapshot = function() {
                        var t, e;
                        return (e = this.getCachedSnapshot()) ? (t = this.shouldIssueRequest(), this.render(function() {
                            var r;
                            return this.cacheSnapshot(), this.controller.render({
                                snapshot: e,
                                isPreview: t
                            }, this.performScroll), "function" == typeof(r = this.adapter).visitRendered && r.visitRendered(this), t ? void 0 : this.complete()
                        })) : void 0
                    }, r.prototype.loadResponse = function() {
                        return null != this.response ? this.render(function() {
                            var t, e;
                            return this.cacheSnapshot(), this.request.failed ? (this.controller.render({
                                error: this.response
                            }, this.performScroll), "function" == typeof(t = this.adapter).visitRendered && t.visitRendered(this), this.fail()) : (this.controller.render({
                                snapshot: this.response
                            }, this.performScroll), "function" == typeof(e = this.adapter).visitRendered && e.visitRendered(this), this.complete())
                        }) : void 0
                    }, r.prototype.followRedirect = function() {
                        return this.redirectedToLocation && !this.followedRedirect ? (this.location = this.redirectedToLocation, this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation, this.restorationIdentifier), this.followedRedirect = !0) : void 0
                    }, r.prototype.requestStarted = function() {
                        var t;
                        return this.recordTimingMetric("requestStart"), "function" == typeof(t = this.adapter).visitRequestStarted ? t.visitRequestStarted(this) : void 0
                    }, r.prototype.requestProgressed = function(t) {
                        var e;
                        return this.progress = t, "function" == typeof(e = this.adapter).visitRequestProgressed ? e.visitRequestProgressed(this) : void 0
                    }, r.prototype.requestCompletedWithResponse = function(e, r) {
                        return this.response = e, null != r && (this.redirectedToLocation = t.Location.wrap(r)), this.adapter.visitRequestCompleted(this)
                    }, r.prototype.requestFailedWithStatusCode = function(t, e) {
                        return this.response = e, this.adapter.visitRequestFailedWithStatusCode(this, t)
                    }, r.prototype.requestFinished = function() {
                        var t;
                        return this.recordTimingMetric("requestEnd"), "function" == typeof(t = this.adapter).visitRequestFinished ? t.visitRequestFinished(this) : void 0
                    }, r.prototype.performScroll = function() {
                        return this.scrolled ? void 0 : ("restore" === this.action ? this.scrollToRestoredPosition() || this.scrollToTop() : this.scrollToAnchor() || this.scrollToTop(), this.scrolled = !0)
                    }, r.prototype.scrollToRestoredPosition = function() {
                        var t, e;
                        return t = null != (e = this.restorationData) ? e.scrollPosition : void 0, null != t ? (this.controller.scrollToPosition(t), !0) : void 0
                    }, r.prototype.scrollToAnchor = function() {
                        return null != this.location.anchor ? (this.controller.scrollToAnchor(this.location.anchor), !0) : void 0
                    }, r.prototype.scrollToTop = function() {
                        return this.controller.scrollToPosition({
                            x: 0,
                            y: 0
                        })
                    }, r.prototype.recordTimingMetric = function(t) {
                        var e;
                        return null != (e = this.timingMetrics)[t] ? e[t] : e[t] = (new Date).getTime()
                    }, r.prototype.getTimingMetrics = function() {
                        return t.copyObject(this.timingMetrics)
                    }, n = function(t) {
                        switch (t) {
                            case "replace":
                                return "replaceHistoryWithLocationAndRestorationIdentifier";
                            case "advance":
                            case "restore":
                                return "pushHistoryWithLocationAndRestorationIdentifier"
                        }
                    }, r.prototype.shouldIssueRequest = function() {
                        return "restore" === this.action ? !this.hasCachedSnapshot() : !0
                    }, r.prototype.cacheSnapshot = function() {
                        return this.snapshotCached ? void 0 : (this.controller.cacheSnapshot(), this.snapshotCached = !0)
                    }, r.prototype.render = function(t) {
                        return this.cancelRender(), this.frame = requestAnimationFrame(function(e) {
                            return function() {
                                return e.frame = null, t.call(e)
                            }
                        }(this))
                    }, r.prototype.cancelRender = function() {
                        return this.frame ? cancelAnimationFrame(this.frame) : void 0
                    }, r
                }()
            }.call(this),
            function() {
                var e = function(t, e) {
                    return function() {
                        return t.apply(e, arguments)
                    }
                };
                t.Controller = function() {
                    function r() {
                        this.clickBubbled = e(this.clickBubbled, this), this.clickCaptured = e(this.clickCaptured, this), this.pageLoaded = e(this.pageLoaded, this), this.history = new t.History(this), this.view = new t.View(this), this.scrollManager = new t.ScrollManager(this), this.restorationData = {}, this.clearCache()
                    }
                    return r.prototype.start = function() {
                        return t.supported && !this.started ? (addEventListener("click", this.clickCaptured, !0), addEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.start(), this.startHistory(), this.started = !0, this.enabled = !0) : void 0
                    }, r.prototype.disable = function() {
                        return this.enabled = !1
                    }, r.prototype.stop = function() {
                        return this.started ? (removeEventListener("click", this.clickCaptured, !0), removeEventListener("DOMContentLoaded", this.pageLoaded, !1), this.scrollManager.stop(), this.stopHistory(), this.started = !1) : void 0
                    }, r.prototype.clearCache = function() {
                        return this.cache = new t.SnapshotCache(10)
                    }, r.prototype.visit = function(e, r) {
                        var n, o;
                        return null == r && (r = {}), e = t.Location.wrap(e), this.applicationAllowsVisitingLocation(e) ? this.locationIsVisitable(e) ? (n = null != (o = r.action) ? o : "advance", this.adapter.visitProposedToLocationWithAction(e, n)) : window.location = e : void 0
                    }, r.prototype.startVisitToLocationWithAction = function(e, r, n) {
                        var o;
                        return t.supported ? (o = this.getRestorationDataForIdentifier(n), this.startVisit(e, r, {
                            restorationData: o
                        })) : window.location = e
                    }, r.prototype.startHistory = function() {
                        return this.location = t.Location.wrap(window.location), this.restorationIdentifier = t.uuid(), this.history.start(), this.history.replace(this.location, this.restorationIdentifier)
                    }, r.prototype.stopHistory = function() {
                        return this.history.stop()
                    }, r.prototype.pushHistoryWithLocationAndRestorationIdentifier = function(e, r) {
                        return this.restorationIdentifier = r, this.location = t.Location.wrap(e), this.history.push(this.location, this.restorationIdentifier)
                    }, r.prototype.replaceHistoryWithLocationAndRestorationIdentifier = function(e, r) {
                        return this.restorationIdentifier = r, this.location = t.Location.wrap(e), this.history.replace(this.location, this.restorationIdentifier)
                    }, r.prototype.historyPoppedToLocationWithRestorationIdentifier = function(e, r) {
                        var n;
                        return this.restorationIdentifier = r, this.enabled ? (n = this.getRestorationDataForIdentifier(this.restorationIdentifier), this.startVisit(e, "restore", {
                            restorationIdentifier: this.restorationIdentifier,
                            restorationData: n,
                            historyChanged: !0
                        }), this.location = t.Location.wrap(e)) : this.adapter.pageInvalidated()
                    }, r.prototype.getCachedSnapshotForLocation = function(t) {
                        var e;
                        return e = this.cache.get(t), e ? e.clone() : void 0
                    }, r.prototype.shouldCacheSnapshot = function() {
                        return this.view.getSnapshot().isCacheable()
                    }, r.prototype.cacheSnapshot = function() {
                        var t;
                        return this.shouldCacheSnapshot() ? (this.notifyApplicationBeforeCachingSnapshot(), t = this.view.getSnapshot(), this.cache.put(this.lastRenderedLocation, t.clone())) : void 0
                    }, r.prototype.scrollToAnchor = function(t) {
                        var e;
                        return (e = document.getElementById(t)) ? this.scrollToElement(e) : this.scrollToPosition({
                            x: 0,
                            y: 0
                        })
                    }, r.prototype.scrollToElement = function(t) {
                        return this.scrollManager.scrollToElement(t)
                    }, r.prototype.scrollToPosition = function(t) {
                        return this.scrollManager.scrollToPosition(t)
                    }, r.prototype.scrollPositionChanged = function(t) {
                        var e;
                        return e = this.getCurrentRestorationData(), e.scrollPosition = t
                    }, r.prototype.render = function(t, e) {
                        return this.view.render(t, e)
                    }, r.prototype.viewInvalidated = function() {
                        return this.adapter.pageInvalidated()
                    }, r.prototype.viewWillRender = function(t) {
                        return this.notifyApplicationBeforeRender(t)
                    }, r.prototype.viewRendered = function() {
                        return this.lastRenderedLocation = this.currentVisit.location, this.notifyApplicationAfterRender()
                    }, r.prototype.pageLoaded = function() {
                        return this.lastRenderedLocation = this.location, this.notifyApplicationAfterPageLoad()
                    }, r.prototype.clickCaptured = function() {
                        return removeEventListener("click", this.clickBubbled, !1), addEventListener("click", this.clickBubbled, !1)
                    }, r.prototype.clickBubbled = function(t) {
                        var e, r, n;
                        return this.enabled && this.clickEventIsSignificant(t) && (r = this.getVisitableLinkForNode(t.target)) && (n = this.getVisitableLocationForLink(r)) && this.applicationAllowsFollowingLinkToLocation(r, n) ? (t.preventDefault(), e = this.getActionForLink(r), this.visit(n, {
                            action: e
                        })) : void 0
                    }, r.prototype.applicationAllowsFollowingLinkToLocation = function(t, e) {
                        var r;
                        return r = this.notifyApplicationAfterClickingLinkToLocation(t, e), !r.defaultPrevented
                    }, r.prototype.applicationAllowsVisitingLocation = function(t) {
                        var e;
                        return e = this.notifyApplicationBeforeVisitingLocation(t), !e.defaultPrevented
                    }, r.prototype.notifyApplicationAfterClickingLinkToLocation = function(e, r) {
                        return t.dispatch("turbolinks:click", {
                            target: e,
                            data: {
                                url: r.absoluteURL
                            },
                            cancelable: !0
                        })
                    }, r.prototype.notifyApplicationBeforeVisitingLocation = function(e) {
                        return t.dispatch("turbolinks:before-visit", {
                            data: {
                                url: e.absoluteURL
                            },
                            cancelable: !0
                        })
                    }, r.prototype.notifyApplicationAfterVisitingLocation = function(e) {
                        return t.dispatch("turbolinks:visit", {
                            data: {
                                url: e.absoluteURL
                            }
                        })
                    }, r.prototype.notifyApplicationBeforeCachingSnapshot = function() {
                        return t.dispatch("turbolinks:before-cache")
                    }, r.prototype.notifyApplicationBeforeRender = function(e) {
                        return t.dispatch("turbolinks:before-render", {
                            data: {
                                newBody: e
                            }
                        })
                    }, r.prototype.notifyApplicationAfterRender = function() {
                        return t.dispatch("turbolinks:render")
                    }, r.prototype.notifyApplicationAfterPageLoad = function(e) {
                        return null == e && (e = {}), t.dispatch("turbolinks:load", {
                            data: {
                                url: this.location.absoluteURL,
                                timing: e
                            }
                        })
                    }, r.prototype.startVisit = function(t, e, r) {
                        var n;
                        return null != (n = this.currentVisit) && n.cancel(), this.currentVisit = this.createVisit(t, e, r), this.currentVisit.start(), this.notifyApplicationAfterVisitingLocation(t)
                    }, r.prototype.createVisit = function(e, r, n) {
                        var o, i, s, a, u;
                        return i = null != n ? n : {}, a = i.restorationIdentifier, s = i.restorationData, o = i.historyChanged, u = new t.Visit(this, e, r), u.restorationIdentifier = null != a ? a : t.uuid(), u.restorationData = t.copyObject(s), u.historyChanged = o, u.referrer = this.location, u
                    }, r.prototype.visitCompleted = function(t) {
                        return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())
                    }, r.prototype.clickEventIsSignificant = function(t) {
                        return !(t.defaultPrevented || t.target.isContentEditable || t.which > 1 || t.altKey || t.ctrlKey || t.metaKey || t.shiftKey)
                    }, r.prototype.getVisitableLinkForNode = function(e) {
                        return this.nodeIsVisitable(e) ? t.closest(e, "a[href]:not([target]):not([download])") : void 0
                    }, r.prototype.getVisitableLocationForLink = function(e) {
                        var r;
                        return r = new t.Location(e.getAttribute("href")), this.locationIsVisitable(r) ? r : void 0
                    }, r.prototype.getActionForLink = function(t) {
                        var e;
                        return null != (e = t.getAttribute("data-turbolinks-action")) ? e : "advance"
                    }, r.prototype.nodeIsVisitable = function(e) {
                        var r;
                        return (r = t.closest(e, "[data-turbolinks]")) ? "false" !== r.getAttribute("data-turbolinks") : !0
                    }, r.prototype.locationIsVisitable = function(t) {
                        return t.isPrefixedBy(this.view.getRootLocation()) && t.isHTML()
                    }, r.prototype.getCurrentRestorationData = function() {
                        return this.getRestorationDataForIdentifier(this.restorationIdentifier)
                    }, r.prototype.getRestorationDataForIdentifier = function(t) {
                        var e;
                        return null != (e = this.restorationData)[t] ? e[t] : e[t] = {}
                    }, r
                }()
            }.call(this),
            function() {
                var e, r, n;
                t.start = function() {
                    return r() ? (null == t.controller && (t.controller = e()), t.controller.start()) : void 0
                }, r = function() {
                    return null == window.Turbolinks && (window.Turbolinks = t), n()
                }, e = function() {
                    var e;
                    return e = new t.Controller, e.adapter = new t.BrowserAdapter(e), e
                }, n = function() {
                    return window.Turbolinks === t
                }, n() && t.start()
            }.call(this)
    }).call(this), "object" == typeof module && module.exports ? module.exports = t : "function" == typeof define && define.amd && define(t)
}).call(this);