var neoges;
! function(e) {
    var t = function(e) {
        function t(t) { e.call(this, t), this.rotation = 0, this.scale = 1 }
        __extends(t, e);
        var n = (__define, t);
        return p = n.prototype, t.BEGAN = "began", t.UPDATE = "update", t.ENDED = "ended", t.FAILED = "failed", t }(egret.Event);
    e.GestureEvent = t, egret.registerClass(t, "neoges.GestureEvent") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    function t(t) {
        var n = new e.TouchData(t.type);
        return n.stageX = t.stageX, n.stageY = t.stageY, n.localX = t.localX, n.localY = t.localY, n.touchPointID = t.touchPointID, n.target = t.target, n.touchDown = t.touchDown, n }

    function n(e, t) { t.type = e.type, t.stageX = e.stageX, t.stageY = e.stageY, t.localX = e.localX, t.localY = e.localY, t.touchPointID = e.touchPointID, t.target = e.target, t.touchDown = e.touchDown }
    e.cloneTouchEvent = t, e.setTouchProperties = n;
    var s = function() {
        function e(e) { this.type = e }
        var t = (__define, e);
        return p = t.prototype, e }();
    e.TouchData = s, egret.registerClass(s, "neoges.TouchData") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function(t) {
        function n(e) { void 0 === e && (e = null), t.call(this), this._useMultiPoints = !1, this._stats = -1, this._location = new egret.Point, this._target = e, null != this._target && this.addHostToManager() }
        __extends(n, t);
        var s = __define,
            r = n;
        return p = r.prototype, s(p, "target", function() {
            return this._target }, function(e) { this._target != e && (this._stats = -1, null != this._target && this.removeHostFromManager(), this._target = e, null != this._target && this.addHostToManager()) }), s(p, "location", function() {
            return this._location.clone() }), p.addHostToManager = function() { e.GestureManager.addHost(this) }, p.removeHostFromManager = function() { e.GestureManager.removeHost(this) }, p.onTouch = function() {}, p.gestureBegan = function() { this._stats = 1;
            var t = new e.GestureEvent(e.GestureEvent.BEGAN);
            t.host = this._target, this.dispatchEvent(t) }, p.gestureUpdate = function() { this._stats = 2;
            var t = new e.GestureEvent(e.GestureEvent.UPDATE);
            t.host = this._target, this.dispatchEvent(t) }, p.gestureEnded = function() { this._stats = 3;
            var t = new e.GestureEvent(e.GestureEvent.ENDED);
            t.host = this._target, this.dispatchEvent(t), this._stats = -1 }, p.gestureFailed = function() {
            var t = new e.GestureEvent(e.GestureEvent.FAILED);
            t.host = this._target, this.dispatchEvent(t), this._stats = -1 }, p.subtract = function(e, t) {
            var n = new egret.Point;
            return n.x = e.x - t.x, n.y = e.y - t.y, n }, p.getPointLength = function(e) {
            var t = 0,
                n = new egret.Point(0, 0);
            return t = egret.Point.distance(e, n) }, p.dispose = function() { this._stats = -1, e.GestureManager.removeHost(this), this._target = null }, n }(egret.EventDispatcher);
    e.AbstractGesture = t, egret.registerClass(t, "neoges.AbstractGesture", ["neoges.IGesture", "egret.IEventDispatcher"]) }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function(e) {
        function t(t) { void 0 === t && (t = null), e.call(this, t), this.touchCount = 0, this.isBegan = !1, this._useMultiPoints = !1 }
        __extends(t, e);
        var n = (__define, t);
        return p = n.prototype, p.onTouch = function(e) {
            if (!(e.length > 1)) {
                var t = e[0];
                t.type == egret.TouchEvent.TOUCH_BEGIN ? this.isBegan || (this.touchCount = 0, this.isBegan = !0, this.gestureBegan(), egret.clearTimeout(this.callID), this.callID = egret.setTimeout(this.checkDoubleTapHandler, this, 500)) : t.type == egret.TouchEvent.TOUCH_END && this.isBegan && (this.touchCount++, this.touchCount >= 2 && this.gestureEnded()) } }, p.gestureEnded = function() { egret.clearTimeout(this.callID), this.touchCount = 0, this.isBegan = !1, e.prototype.gestureEnded.call(this) }, p.checkDoubleTapHandler = function() { this.touchCount = 0, this.isBegan = !1, this.gestureFailed() }, t }(e.AbstractGesture);
    e.DoubleTapGesture = t, egret.registerClass(t, "neoges.DoubleTapGesture") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function(e) {
        function t(t) { void 0 === t && (t = null), e.call(this, t), this.isBegan = !1, this._useMultiPoints = !1 }
        __extends(t, e);
        var n = (__define, t);
        return p = n.prototype, p.onTouch = function(e) {
            if (!(e.length > 1)) {
                var t = e[0];
                t.type == egret.TouchEvent.TOUCH_BEGIN ? (this.isBegan = !0, this.gestureBegan(), egret.clearTimeout(this.callID), this.callID = egret.setTimeout(this.checkTimeHandler, this, 2e3)) : t.type == egret.TouchEvent.TOUCH_END && this.isBegan && (egret.clearTimeout(this.callID), this.isBegan = !1, this.gestureFailed()) } }, p.gestureEnded = function() { egret.clearTimeout(this.callID), this.isBegan = !1, e.prototype.gestureEnded.call(this) }, p.checkTimeHandler = function() { this.gestureEnded() }, t }(e.AbstractGesture);
    e.LongPressGesture = t, egret.registerClass(t, "neoges.LongPressGesture") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function(t) {
        function n(e) { void 0 === e && (e = null), t.call(this, e), this._useMultiPoints = !1 }
        __extends(n, t);
        var s = (__define, n);
        return p = s.prototype, p.onTouch = function(t) {
            if (!(t.length > 1 || e.GestureManager.simulateMultitouch)) {
                var n = t[0];
                n.type == egret.TouchEvent.TOUCH_BEGIN ? (this.gestureBegan(), this._startPoint = new egret.Point(n.stageX, n.stageY)) : n.type == egret.TouchEvent.TOUCH_MOVE ? (this._endPoint = new egret.Point(n.stageX, n.stageY), this.gestureUpdate()) : n.type == egret.TouchEvent.TOUCH_END && this.gestureEnded() } }, p.gestureUpdate = function() { this._stats = 2;
            var t = new e.GestureEvent(e.GestureEvent.UPDATE);
            t.host = this.target, t.offsetX = this._endPoint.x - this._startPoint.x, t.offsetY = this._endPoint.y - this._startPoint.y, this.dispatchEvent(t) }, n }(e.AbstractGesture);
    e.PanGesture = t, egret.registerClass(t, "neoges.PanGesture") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function(t) {
        function n(e) { void 0 === e && (e = null), t.call(this, e), this.startLen = 0, this.currentLen = 0, this._useMultiPoints = !0 }
        __extends(n, t);
        var s = (__define, n);
        return p = s.prototype, p.onTouch = function(t) {
            var n, s, r = t;
            e.GestureManager.simulateMultitouch && (n = t[0], s = this.reverseEvent(n), e.GestureManager.simulatePoints = [s], r = [n, s]), r.length < 2 || (n = r[0], s = r[1], s.type == egret.TouchEvent.TOUCH_BEGIN ? (this.gestureBegan(), this.startLen = egret.Point.distance(new egret.Point(n.stageX, n.stageY), new egret.Point(s.stageX, s.stageY))) : n.type == egret.TouchEvent.TOUCH_END || s.type == egret.TouchEvent.TOUCH_END ? this.gestureEnded() : (n.type == egret.TouchEvent.TOUCH_MOVE || s.type == egret.TouchEvent.TOUCH_MOVE) && (this.currentLen = egret.Point.distance(new egret.Point(n.stageX, n.stageY), new egret.Point(s.stageX, s.stageY)), this.gestureUpdate())) }, p.gestureEnded = function() { e.GestureManager.simulatePoints = [], t.prototype.gestureEnded.call(this) }, p.gestureUpdate = function() { this._stats = 2;
            var t = new e.GestureEvent(e.GestureEvent.UPDATE);
            t.value = this.currentLen / this.startLen, t.host = this.target, this.dispatchEvent(t) }, p.reverseEvent = function(t) {
            var n = t.stageX,
                s = t.stageY,
                r = this.target,
                a = r.localToGlobal(r.anchorOffsetX, r.anchorOffsetY),
                i = n - a.x,
                o = s - a.y,
                u = new egret.Point(a.x - i, a.y - o),
                h = new e.TouchData(t.type);
            return h.stageX = u.x, h.stageY = u.y, h }, n }(e.AbstractGesture);
    e.PinchGesture = t, egret.registerClass(t, "neoges.PinchGesture") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function(t) {
        function n(e) { void 0 === e && (e = null), t.call(this, e), this._rotationStart = 0, this._rotation = 0, this._useMultiPoints = !0 }
        __extends(n, t);
        var s = (__define, n);
        return p = s.prototype, p.onTouch = function(t) {
            var n, s, r = t;
            if (e.GestureManager.simulateMultitouch && (n = t[0], s = this.reverseEvent(n), e.GestureManager.simulatePoints = [s], r = [n, s]), !(r.length < 2)) { n = r[0], s = r[1];
                var a, i, o = new egret.Point(n.stageX, n.stageY),
                    u = new egret.Point(s.stageX, s.stageY);
                s.type == egret.TouchEvent.TOUCH_BEGIN ? (this.gestureBegan(), this._transformVector = this.getCenterPoint(o, u), a = u.x - this._transformVector.x, i = u.y - this._transformVector.y, this._rotationStart = 180 * Math.atan2(a, i) / Math.PI) : n.type == egret.TouchEvent.TOUCH_MOVE || s.type == egret.TouchEvent.TOUCH_MOVE ? -1 != this._stats && (a = u.x - this._transformVector.x, i = u.y - this._transformVector.y, this._rotation = this._rotationStart - 180 * Math.atan2(a, i) / Math.PI, this.gestureUpdate()) : (n.type == egret.TouchEvent.TOUCH_END || s.type == egret.TouchEvent.TOUCH_END) && (e.GestureManager.simulatePoints = [], this.gestureEnded()) } }, p.gestureUpdate = function() { this._stats = 2;
            var t = new e.GestureEvent(e.GestureEvent.UPDATE);
            t.value = this._rotation, t.host = this.target, this.dispatchEvent(t) }, p.getCenterPoint = function(e, t) {
            var n = new egret.Point;
            return n.x = e.x + (t.x - e.x) / 2, n.y = e.y + (t.y - e.y) / 2, n }, p.reverseEvent = function(t) {
            var n = t.stageX,
                s = t.stageY,
                r = this.target,
                a = r.localToGlobal(r.anchorOffsetX, r.anchorOffsetY),
                i = n - a.x,
                o = s - a.y,
                u = new egret.Point(a.x - i, a.y - o),
                h = new e.TouchData(t.type);
            return h.stageX = u.x, h.stageY = u.y, h }, n }(e.AbstractGesture);
    e.RotationGesture = t, egret.registerClass(t, "neoges.RotationGesture") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function(t) {
        function n(e) { void 0 === e && (e = null), t.call(this, e), this.isBegan = !1, this._useMultiPoints = !1 }
        __extends(n, t);
        var s = (__define, n);
        return p = s.prototype, p.onTouch = function(t) {
            if (!(t.length > 1)) {
                var n = t[0];
                n.type == egret.TouchEvent.TOUCH_BEGIN ? (this.isBegan = !0, this.gestureBegan(), this._startPoint = new egret.Point(n.stageX, n.stageY), egret.clearTimeout(this.callID), this.callID = egret.setTimeout(this.checkSwipeHandler, this, 500)) : n.type == egret.TouchEvent.TOUCH_END && this.isBegan && (this._endPoint = new egret.Point(n.stageX, n.stageY), this.disX = Math.abs(this._endPoint.x - this._startPoint.x), this.disY = Math.abs(this._endPoint.y - this._startPoint.y), (this.disX > e.SwipeGesture.SWIPE_DISTANCE || this.disY > e.SwipeGesture.SWIPE_DISTANCE) && 1 == this._stats ? this.gestureEnded() : this.gestureFailed()) } }, p.gestureEnded = function() { this._stats = 3;
            var t = new e.GestureEvent(e.GestureEvent.ENDED),
                n = 0,
                s = 0;
            this.disX > e.SwipeGesture.SWIPE_DISTANCE && (n = this._endPoint.x > this._startPoint.x ? 1 : -1), this.disY > e.SwipeGesture.SWIPE_DISTANCE && (s = this._endPoint.y > this._startPoint.y ? 1 : -1), t.offsetX = n, t.offsetY = s, t.host = this.target, this.dispatchEvent(t), this._stats = -1 }, p.checkSwipeHandler = function() { this.isBegan = !1, this.gestureFailed() }, n.SWIPE_DISTANCE = 200, n }(e.AbstractGesture);
    e.SwipeGesture = t, egret.registerClass(t, "neoges.SwipeGesture") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function(t) {
        function n(e) { void 0 === e && (e = null), t.call(this, e), this.isBegan = !1, this._useMultiPoints = !1 }
        __extends(n, t);
        var s = (__define, n);
        return p = s.prototype, p.onTouch = function(t) {
            if (!(t.length > 1)) {
                var n = t[0];
                if (n.type == egret.TouchEvent.TOUCH_BEGIN) this.gestureBegan(), this.isBegan = !0, this._startPoint = new egret.Point(n.stageX, n.stageY), egret.clearTimeout(this.callID), this.callID = egret.setTimeout(this.checkTimeHandler, this, 500);
                else if (n.type == egret.TouchEvent.TOUCH_END && this.isBegan) { egret.clearTimeout(this.callID), this._endPoint = new egret.Point(n.stageX, n.stageY);
                    var s = egret.Point.distance(this._startPoint, this._endPoint);
                    s < e.TapGesture.TAP_DISTANCE && 1 == this._stats ? this.gestureEnded() : this.gestureFailed() } } }, p.checkTimeHandler = function() { this.isBegan = !1, this.gestureFailed() }, n.TAP_DISTANCE = 20, n }(e.AbstractGesture);
    e.TapGesture = t, egret.registerClass(t, "neoges.TapGesture") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function(t) {
        function n(e) { void 0 === e && (e = null), t.call(this, e), this.slop = Math.round(20 / 252 * 240), this._offsetX = 0, this._offsetY = 0, this._rotation = 0, this._scale = 1, this.distance = 0, this.startScale = 1, this._useMultiPoints = !0 }
        __extends(n, t);
        var s = (__define, n);
        return p = s.prototype, p.onTouch = function(t) {
            var n, s, r = t;
            if (e.GestureManager.simulateMultitouch && (n = t[0], s = this.reverseEvent(n), e.GestureManager.simulatePoints = [s], r = [n, s]), !(r.length < 2)) { n = r[0], s = r[1];
                var a = new egret.Point(n.stageX, n.stageY),
                    i = new egret.Point(s.stageX, s.stageY);
                if (s.type == egret.TouchEvent.TOUCH_BEGIN) this.gestureBegan(), this._transformVector = this.subtract(i, a), this.updateLocation(a, i), this.distance = egret.Point.distance(i, a), this.startScale = this.target.scaleX;
                else if (n.type == egret.TouchEvent.TOUCH_MOVE || s.type == egret.TouchEvent.TOUCH_MOVE) {
                    var o = this._location.clone();
                    this.updateLocation(a, i);
                    var u;
                    u = this.subtract(i, a), this._offsetX = this._location.x - o.x, this._offsetY = this._location.y - o.y, this._rotation = Math.atan2(u.y, u.x) - Math.atan2(this._transformVector.y, this._transformVector.x);
                    var h = egret.Point.distance(i, a);
                    this._scale = this.startScale * (h / this.distance), this._transformVector = this.subtract(i, a), this.gestureUpdate() } else(n.type == egret.TouchEvent.TOUCH_END || s.type == egret.TouchEvent.TOUCH_END) && (e.GestureManager.simulatePoints = [], this.gestureEnded()) } }, p.gestureUpdate = function() { this._stats = 2;
            var t = new e.GestureEvent(e.GestureEvent.UPDATE);
            t.rotation = this._rotation, t.scale = this._scale, t.offsetX = this._offsetX, t.offsetY = this._offsetY, t.host = this.target, this.dispatchEvent(t) }, p.updateLocation = function(e, t) {
            var n = new egret.Point;
            n.x = (e.x + t.x) / 2, n.y = (e.y + t.y) / 2, this._location = n }, p.reverseEvent = function(t) {
            var n = t.stageX,
                s = t.stageY,
                r = this.target,
                a = r.localToGlobal(.5 * r.width, .5 * r.height),
                i = n - a.x,
                o = s - a.y,
                u = new egret.Point(a.x - i, a.y - o),
                h = new e.TouchData(t.type);
            return h.stageX = u.x, h.stageY = u.y, h }, n }(e.AbstractGesture);
    e.TransformGesture = t, egret.registerClass(t, "neoges.TransformGesture") }(neoges || (neoges = {}));
var neoges;
! function(e) {
    var t = function() {
        function t() {}
        var n = (__define, t);
        return p = n.prototype, t.addHost = function(t) {
            var n = e.GestureManager.hostCollection;
            return -1 != n.indexOf(t) ? void console.warn("不要重复添加手势实例") : (e.GestureManager.registerEvent(t.target), n.push(t), void(e.GestureManager.eventDict[t.target.hashCode] = [])) }, t.removeHost = function(t) {
            var n = e.GestureManager.hostCollection,
                s = n.indexOf(t);
            return -1 == s ? void console.warn("不存在这个实例") : (n.slice(s, 1), e.GestureManager.removeEvent(t.target), void(e.GestureManager.eventDict[t.target.hashCode] = null)) }, t.registerEvent = function(t) { e.GestureManager.hostCollection;
            t.addEventListener(egret.TouchEvent.TOUCH_BEGIN, e.GestureManager.touchedHandler, t) }, t.removeEvent = function(t) { e.GestureManager.hostCollection;
            t.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, e.GestureManager.touchedHandler, t) }, t.touchedHandler = function(t) {
            var n, s = egret.MainContext.instance.stage;
            t.type == egret.TouchEvent.TOUCH_BEGIN ? (n = t.currentTarget, e.GestureManager.currentTouchObject = n, s.removeEventListener(egret.TouchEvent.TOUCH_MOVE, e.GestureManager.touchedHandler, s), s.addEventListener(egret.TouchEvent.TOUCH_MOVE, e.GestureManager.touchedHandler, s), s.removeEventListener(egret.TouchEvent.TOUCH_END, e.GestureManager.touchedHandler, s), s.addEventListener(egret.TouchEvent.TOUCH_END, e.GestureManager.touchedHandler, s), s.removeEventListener(egret.Event.LEAVE_STAGE, e.GestureManager.leaveStageHandler, s), s.addEventListener(egret.Event.LEAVE_STAGE, e.GestureManager.leaveStageHandler, s)) : n = e.GestureManager.currentTouchObject, null == e.GestureManager.eventDict[n.hashCode] && (e.GestureManager.eventDict[n.hashCode] = []);
            var r, a = e.GestureManager.eventDict[n.hashCode];
            e.GestureManager.hasTouchEvent(t) ? (r = e.GestureManager.getTouchEventByID(t.touchPointID, n), e.setTouchProperties(t, r)) : (r = e.cloneTouchEvent(t), a.push(r));
            for (var i, o = e.GestureManager.hostCollection, u = 0; u < o.length; u++) i = o[u], i.target == n && i.onTouch(a);
            r.type == egret.TouchEvent.TOUCH_END && e.GestureManager.removeAllEvent(), e.GestureManager.showTouchPoint && e.GestureManager.drawTouchPoint() }, t.hasTouchEvent = function(t) {
            for (var n = e.GestureManager.currentTouchObject, s = e.GestureManager.eventDict[n.hashCode], r = 0; r < s.length; r++)
                if (s[r].touchPointID == t.touchPointID) return !0;
            return !1 }, t.getTouchEventByID = function(t, n) {
            for (var s = e.GestureManager.eventDict[n.hashCode], r = 0; r < s.length; r++)
                if (s[r].touchPointID == t) return s[r];
            return null }, t.leaveStageHandler = function() { e.GestureManager.removeAllEvent() }, t.removeAllEvent = function() {
            var t = egret.MainContext.instance.stage;
            for (var n in e.GestureManager.eventDict) {
                var s = e.GestureManager.eventDict[n];
                s.length = 0 }
            t.removeEventListener(egret.TouchEvent.TOUCH_MOVE, e.GestureManager.touchedHandler, t), t.removeEventListener(egret.TouchEvent.TOUCH_END, e.GestureManager.touchedHandler, t), t.removeEventListener(egret.Event.LEAVE_STAGE, e.GestureManager.leaveStageHandler, t), e.GestureManager.drawTouchPoint() }, t.drawTouchPoint = function() {
            if (null != e.GestureManager.currentTouchObject) {
                var t = e.GestureManager.drawLayer,
                    n = egret.MainContext.instance.stage;
                null == t.stage && n.addChild(t);
                var s = t.graphics;
                s.clear(), s.beginFill(0, .4);
                var r;
                for (var a in e.GestureManager.eventDict)
                    if (e.GestureManager.currentTouchObject.hashCode == a) {
                        var i = e.GestureManager.eventDict[a];
                        if (null != i && i.length > 0)
                            for (var o = 0; o < i.length; o++) r = i[o], s.drawCircle(r.stageX, r.stageY, 10) }
                i = e.GestureManager.simulatePoints;
                for (var o = 0; o < i.length; o++) r = i[o], s.drawCircle(r.stageX, r.stageY, 10);
                s.endFill() } }, t.showTouchPoint = !1, t.simulateMultitouch = !1, t.simulatePoints = [], t.hostCollection = [], t.eventDict = {}, t.drawLayer = new egret.Sprite, t }();
    e.GestureManager = t, egret.registerClass(t, "neoges.GestureManager") }(neoges || (neoges = {}));
