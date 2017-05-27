var Main = function(t) {
    function e() { t.call(this), this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this) }
    __extends(e, t);
    var i = (__define, e),
        n = i.prototype;
    return n.onAddToStage = function(t) { egret.MainContext.deviceType == egret.MainContext.DEVICE_PC && (this.stage.scaleMode = "showAll"), wy.init(), RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this), RES.loadConfig("resource/default.res.json", "resource/") }, n.onConfigComplete = function(t) { RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this), RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this), RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this), RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this), RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this), RES.loadGroup("loading") }, n.onResourceLoadComplete = function(t) {
        switch (t.groupName) {
            case "loading":
                wy.BaseViewManager.changeScene(LoadingUI), this.loadingView = wy.BaseViewManager.nowScene, RES.loadGroup("preload");
                break;
            case "preload":
                RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this), RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this), RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this), RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this), this.createGameScene() } }, n.onItemLoadError = function(t) { console.warn("Url:" + t.resItem.url + " has failed to load") }, n.onResourceLoadError = function(t) { console.warn("Group:" + t.groupName + " has failed to load"), this.onResourceLoadComplete(t) }, n.onResourceProgress = function(t) { "preload" == t.groupName && this.loadingView.setProgress(t.itemsLoaded, t.itemsTotal) }, n.createGameScene = function() { wy.BaseViewManager.getViewMustNew = !0, wy.BaseViewManager.changeScene(GameMain) }, e }(egret.DisplayObjectContainer);
egret.registerClass(Main, "Main");
var wy;
! function(t) {
    var e = function(t) {
        function e() { t.call(this), this._isHide = !0 }
        __extends(e, t);
        var i = (__define, e),
            n = i.prototype;
        return n.show = function(t) { this._isHide && (this._isHide = !1) }, n.hide = function() { this._isHide || (this._isHide = !0) }, e }(egret.DisplayObjectContainer);
    t.BaseSprite = e, egret.registerClass(e, "wy.BaseSprite") }(wy || (wy = {}));
var GameMainUI = function(t) {
    function e() { t.call(this), this.width = 640, this.height = 1036, this.createChildren() }
    __extends(e, t);
    var i = (__define, e),
        n = i.prototype;
    return n.createChildren = function() { this.bg = new egret.Bitmap(RES.getRes("bg_jpg")), this.bg.x = 0, this.bg.y = 0, this.addChild(this.bg), this.yaoyiyao = new egret.Bitmap(RES.getRes("yaoyiyao_png")), this.yaoyiyao.x = 309, this.yaoyiyao.y = 501, this.yaoyiyao.anchorOffsetX = 320, this.yaoyiyao.anchorOffsetY = 548, this.addChild(this.yaoyiyao), this.biaoyu = new egret.Bitmap(RES.getRes("biaoyu_png")), this.biaoyu.x = 0, this.biaoyu.y = 0, this.addChild(this.biaoyu) }, e }(wy.BaseSprite);
egret.registerClass(GameMainUI, "GameMainUI");
var GameMain = function(t) {
    function e() { t.call(this), this.last_update = 0, this.motion = null, this.SHAKE_THRESHOLD = 2e3 }
    __extends(e, t);
    var i = (__define, e),
        n = i.prototype;
    return n.createChildren = function() { t.prototype.createChildren.call(this) }, n.show = function(e) { t.prototype.show.call(this, e), egret.Tween.get(this.yaoyiyao, { loop: !0 }).to({ rotation: 10 }, 300).to({ rotation: 0 }, 300).to({ rotation: -10 }, 300).to({ rotation: 0 }, 300), this.biaoyu.alpha = 0, this.biaoyu.y = this.biaoyu.y + 50, egret.Tween.get(this.biaoyu).to({ alpha: 1, y: this.biaoyu.y - 50 }, 1e3), this.bg.touchEnabled = !0, this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this), this.yaoyiyao.touchEnabled = !0, this.yaoyiyao.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this), this.biaoyu.touchEnabled = !0, this.biaoyu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this), this.xule_num = 0, this.last_x = 0, this.last_y = 0, this.last_z = 0, this.motion = new egret.Motion, this.motion.addEventListener(egret.Event.CHANGE, this.deviceMotionHandler, this), this.motion.start() }, n.deviceMotionHandler = function(t) {
        var e = t.accelerationIncludingGravity,
            i = (new Date).getTime();
        if (i - this.last_update > 100) {
            var n = i - this.last_update;
            this.last_update = i;
            var s = e.x,
                a = e.y,
                o = e.z,
                r = Math.abs(s + a + o - this.last_x - this.last_y - this.last_z) / n * 1e4;
            egret.log("摇一摇" + r), r > this.SHAKE_THRESHOLD && (t.currentTarget.stop(), t.currentTarget.removeEventListener(egret.Event.CHANGE, this.deviceMotionHandler, this), this.last_x = s, this.last_y = a, this.last_z = o, this.bofang(), this.yincang()) } }, n.yincang = function() { this.yaoyiyao.visible = !1, this.biaoyu.visible = !1 }, n.bofang = function() { this.bg.texture = RES.getRes("Frame" + this.xule_num + "_jpg"), this.xule_num++, this.xule_num >= 223 || (this.qiehuan = egret.setTimeout(this.bofang, this, 30)) }, n.hide = function() { t.prototype.hide.call(this), this.bg.touchEnabled = !1, this.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this), this.yaoyiyao.touchEnabled = !1, this.yaoyiyao.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this), this.biaoyu.touchEnabled = !1, this.biaoyu.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this) }, n.onTouchTap = function(t) {
        switch (t.currentTarget) {
            case this.bg:
                break;
            case this.yaoyiyao:
                break;
            case this.biaoyu:
        } }, e }(GameMainUI);
egret.registerClass(GameMain, "GameMain");
var LoadingUIUI = function(t) {
    function e() { t.call(this), this.width = 640, this.height = 1036, this.createChildren() }
    __extends(e, t);
    var i = (__define, e),
        n = i.prototype;
    return n.createChildren = function() { this.textField = new egret.TextField, this.textField.text = "100%", this.textField.x = 245, this.textField.y = 498, this.textField.width = 150, this.textField.height = 40, this.textField.textAlign = "center", this.textField.textColor = 16711680, this.textField.size = 20, this.textField.fontFamily = "微软雅黑", this.addChild(this.textField) }, e }(wy.BaseSprite);
egret.registerClass(LoadingUIUI, "LoadingUIUI");
var LoadingUI = function(t) {
    function e() { t.call(this) }
    __extends(e, t);
    var i = (__define, e),
        n = i.prototype;
    return n.createChildren = function() { t.prototype.createChildren.call(this), this.shape = wy.Tools.createMovieClip("loading"), this.addChild(this.shape), this.shape.play(-1), this.shape.scaleX = this.shape.scaleY = .5, this.shape.x = 249, this.shape.y = 350, this.lineDown = new egret.Shape, this.lineDown.graphics.lineStyle(.5, 0, .5), this.lineDown.graphics.moveTo(0, 0), this.lineDown.graphics.lineTo(120, 0), this.lineDown.graphics.endFill(), this.addChild(this.lineDown), this.lineUp = new egret.Shape, this.addChild(this.lineUp), this.lineDown.x = this.width / 2 - this.lineDown.width / 2, this.lineDown.y = this.textField.y - 20, this.lineUp.x = this.lineDown.x, this.lineUp.y = this.lineDown.y, this.textField.text = "" }, n.setProgress = function(t, e) {
        var i = Math.round(100 * t / e);
        this.lineUp.graphics.clear(), this.lineUp.graphics.lineStyle(2, 16777215, 1), this.lineUp.graphics.moveTo(0, 0), this.lineUp.graphics.lineTo(this.lineDown.width * i / 100, 0) }, e }(LoadingUIUI);
egret.registerClass(LoadingUI, "LoadingUI");
var wy;
! function(t) {
    var e = function(t) {
        function e() { t.call(this) }
        __extends(e, t);
        var i = __define,
            n = e,
            s = n.prototype;
        return i(s, "data", function() {
            return this._data }, function(t) { this._data = t, this.dataChanged() }), s.dataChanged = function() {}, s.clear = function() {}, e }(t.BaseSprite);
    t.ItemRenderer = e, egret.registerClass(e, "wy.ItemRenderer", ["wy.IItemRenderer"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function(t) {
        function e() { t.call(this), this.top = 0, this.bottom = 0, this.left = 0, this.right = 0, this.cols = 1, this.rows = 1, this._layout = "vertical" }
        __extends(e, t);
        var i = __define,
            n = e,
            s = n.prototype;
        return i(s, "dataProvider", function() {
            return this._dataProvider }, function(t) {
            if (this._itemRenderer)
                for (var e, i = 0; i < this._itemRenderer.length; ++i) e = this._itemRenderer[i], e.hide(), e.parent && e.parent.removeChild(e);
            this._itemRenderer = [], this._dataProvider = t;
            var n, s;
            if (!this.itemRenderer) throw Error("没有设置渲染器");
            for (var i = 0; i < this._dataProvider.length; ++i) n = this._dataProvider[i], s = new this.itemRenderer, s.show(), s.itemIndex = i, s.data = n, s.selected = !1, this.addChild(s), this._itemRenderer.push(s);
            this.updateDisplayList() }), i(s, "layout", void 0, function(t) { this._layout != t && (this._layout = t, this.updateDisplayList()) }), s.updateDisplayList = function() {
            if (this._itemRenderer && !(this._itemRenderer.length <= 0)) {
                var t = 0;
                if (this._layout == e.VERTICAL)
                    for (var i = this._itemRenderer[0].width, n = this._itemRenderer[0].height; t < this._itemRenderer.length;)
                        for (var s = 0; s < this.cols && t < this._itemRenderer.length; ++s) this._itemRenderer[t].x = s * (i + this.left + this.right) + this.left + this._itemRenderer[t].anchorOffsetX, this._itemRenderer[t].y = Math.floor(t / this.cols) * (n + this.top + this.bottom) + this.top + this._itemRenderer[t].anchorOffsetY, ++t;
                else if (this._layout == e.HORIZENTOL)
                    for (var i = this._itemRenderer[0].width, n = this._itemRenderer[0].height; t < this._itemRenderer.length;)
                        for (var s = 0; s < this.rows && t < this._itemRenderer.length; ++s) this._itemRenderer[t].x = Math.floor(t / this.rows) * (i + this.left + this.right) + this.left + this._itemRenderer[t].anchorOffsetX, this._itemRenderer[t].y = s * (n + this.top + this.bottom) + this.top + this._itemRenderer[t].anchorOffsetY, ++t;
                this.bgShape || (this.bgShape = new egret.Shape, this.addChildAt(this.bgShape, 0)), this.bgShape.graphics.clear(), this.bgShape.graphics.beginFill(0, .01), this.bgShape.graphics.drawRect(0, 0, this.width, this.height), this.bgShape.graphics.endFill() } }, s.updateItem = function(t, e) { 0 > t || !e || !this._itemRenderer || this._itemRenderer.length <= 0 || this._itemRenderer.length <= t || (this._itemRenderer[t].data = e, this.updateDisplayList()) }, s.addItem = function(t) {
            if (t && this._itemRenderer && !(this._itemRenderer.length <= 0) && this.itemRenderer) {
                var e = new this.itemRenderer;
                e.show(), e.data = t, e.itemIndex = this._itemRenderer.length, e.selected = !1, this.addChild(e), this._itemRenderer.push(e), this.updateDisplayList() } }, s.getItemByIndex = function(t) {
            return t < this._itemRenderer.length ? this._itemRenderer[t] : null }, s.show = function() { this.touchEnabled = !0, this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            for (var t = 0; t < this._itemRenderer.length; t++) this._itemRenderer[t].show() }, s.hide = function() { this.touchEnabled = !1, this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
            for (var t = 0; t < this._itemRenderer.length; t++) this._itemRenderer[t].hide() }, s.onTouchTap = function(t) {
            if (this._itemRenderer && !(this._itemRenderer.length <= 0)) {
                var i = this._itemRenderer[0].width,
                    n = this._itemRenderer[0].height,
                    s = Math.floor(t.localX / (i + this.left + this.right)),
                    a = Math.floor(t.localY / (n + this.top + this.bottom));
                s++, a++;
                var o;
                this._layout == e.VERTICAL ? (a = a - 1 >= 0 ? a - 1 : 0, o = a * this.cols + s) : this._layout == e.HORIZENTOL && (s = s - 1 >= 0 ? s - 1 : 0, o = s * this.rows + a), o--, this.dispatchEventWith(e.ITEM_CLICKED, null, this._itemRenderer[o]) } }, e.VERTICAL = "vertical", e.HORIZENTOL = "horizental", e.ITEM_CLICKED = "item_clicked", e }(t.BaseSprite);
    t.List = e, egret.registerClass(e, "wy.List") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function(e) {
        function i() { e.call(this), this.init() }
        __extends(i, e);
        var n = __define,
            s = i,
            a = s.prototype;
        return a.init = function() { this._container = new egret.DisplayObjectContainer, this._scroller = new egret.ScrollView(this._container), this.addChild(this._scroller), this._list = new t.List, this._container.addChild(this._list) }, n(a, "scrollTop", void 0, function(t) { this._scroller.scrollTop = t }), n(a, "scrollLeft", void 0, function(t) { this._scroller.scrollLeft = t }), n(a, "verticalScrollPolicy", void 0, function(t) { this._scroller.verticalScrollPolicy = t }), n(a, "horizontalScrollPolicy", void 0, function(t) { this._scroller.horizontalScrollPolicy = t }), n(a, "bounces", void 0, function(t) { this._scroller.bounces = t }), n(a, "itemRenderer", void 0, function(t) { this._list.itemRenderer = t }), n(a, "width", function() {
            return this._width }, function(t) { this._width = t, this._scroller.width = this._width }), n(a, "height", function() {
            return this._height }, function(t) { this._height = t, this._scroller.height = this._height }), n(a, "dataProvider", function() {
            return this._list.dataProvider }, function(t) { this._list.dataProvider = t }), a.updateDisplayList = function() { this._list.updateDisplayList() }, n(a, "layout", void 0, function(t) { this._list.layout = t }), a.updateItem = function(t, e) { this._list.updateItem(t, e) }, a.addItem = function(t) { this._list.addItem(t) }, a.show = function() { this._list.show() }, a.hide = function() { this._list.hide() }, i }(t.BaseSprite);
    t.ScrollerList = e, egret.registerClass(e, "wy.ScrollerList") }(wy || (wy = {}));
var wy;
! function(t) {
    function e() { i.init() }
    var i = function() {
        function e() {}
        var i = (__define, e);
        i.prototype;
        return e.init = function() { this.stage = egret.MainContext.instance.stage, this.sceneContainer = new egret.DisplayObjectContainer, this.stage.addChild(this.sceneContainer), this.viewContainer = new egret.DisplayObjectContainer, this.stage.addChild(this.viewContainer), this.PopUpContainer = new egret.DisplayObjectContainer, this.stage.addChild(this.PopUpContainer), this.MsgContainer = new egret.DisplayObjectContainer, this.stage.addChild(this.MsgContainer), t.BaseViewManager.init(), t.Data.init(), t.StageBtnUtils.init() }, e.stage = null, e.PopUpContainer = null, e.MsgContainer = null, e.viewContainer = null, e.sceneContainer = null, e }();
    t.GameInterface = i, egret.registerClass(i, "wy.GameInterface"), t.init = e }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e);
        i.prototype;
        return e.init = function() { this.getViewMustNew = !0, this.panels = [], this.shape = new egret.Shape, this.shape.graphics.beginFill(0, .5), this.shape.graphics.drawRect(0, 0, egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight), this.shape.graphics.endFill(), this.shape.touchEnabled = !0 }, e.getView = function(t) {
            var e, i;
            if (this.getViewMustNew || ("string" == typeof t ? e = this.panels[t] : (i = egret.getQualifiedClassName(t), e = this.panels[i])), null == e || void 0 == e)
                if ("string" == typeof t) {
                    var n = egret.getDefinitionByName(t);
                    e = new n, this.panels[t] = e } else e = new t, i = egret.getQualifiedClassName(t), this.panels[i] = e;
            return e }, e.changeScene = function(e, i, n, s) { this.preScene = this.nowScene;
            var a = this.getView(e);
            a.show(n), t.GameInterface.sceneContainer.addChild(a), this.nowScene = a, this.preScene == this.nowScene && (this.preScene = null), this.preScene && this.preScene.hide(), i ? this.play(this.nowScene, this.preScene, i, s) : this.preScene && t.Tools.removeFromParent(this.preScene) }, e.hideScene = function(e, i) { this.nowScene && this.nowScene.hide(), e ? (this.preScene = null, this.play(this.preScene, this.nowScene, e, i)) : t.Tools.removeFromParent(this.nowScene) }, e.changeView = function(e, i, n, s, a) { void 0 === a && (a = !1), this.preView = this.nowView;
            var o = this.getView(e);
            o.show(n), a && t.GameInterface.viewContainer.addChild(this.shape), t.GameInterface.viewContainer.addChild(o), this.nowView = o, this.preView == this.nowView && (this.preView = null), this.preView && this.preView.hide(), i ? this.play(this.nowView, this.preView, i, s) : this.preView && t.Tools.removeFromParent(this.preView) }, e.openPopUpView = function(e, i, n, s, a) { void 0 === a && (a = !0), this.prePopUpView = this.nowPopUpView;
            var o = this.getView(e);
            o.show(n), o.x = .5 * t.GameInterface.stage.stageWidth - .5 * o.width + o.anchorOffsetX, o.y = .5 * t.GameInterface.stage.stageHeight - .5 * o.height + o.anchorOffsetY, a && t.GameInterface.PopUpContainer.addChild(this.shape), t.GameInterface.PopUpContainer.addChild(o), this.nowPopUpView = o, this.prePopUpView == this.nowPopUpView && (this.prePopUpView = null), this.prePopUpView && this.prePopUpView.hide(), i ? this.play(this.nowPopUpView, this.prePopUpView, i, s) : this.prePopUpView && t.Tools.removeFromParent(this.prePopUpView) }, e.hideView = function(e, i) { t.Tools.removeFromParent(this.shape), this.nowView && this.nowView.hide(), e ? (this.preView = null, this.play(this.preView, this.nowView, e, i)) : t.Tools.removeFromParent(this.nowView) }, e.hidePopUpView = function(e, i) { t.Tools.removeFromParent(this.shape), this.nowPopUpView && this.nowPopUpView.hide(), e ? (this.prePopUpView = null, this.play(this.prePopUpView, this.nowPopUpView, e, i)) : t.Tools.removeFromParent(this.nowPopUpView) }, e.play = function(e, i, n, s) {
            var a = egret.getDefinitionByName(n),
                o = new a;
            o && o.switching(e, i, t.Tools.removeFromParent, this, s) }, e.panels = null, e.preScene = null, e.nowScene = null, e.preView = null, e.nowView = null, e.prePopUpView = null, e.nowPopUpView = null, e.shape = null, e.getViewMustNew = !0, e }();
    t.BaseViewManager = e, egret.registerClass(e, "wy.BaseViewManager") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function t() { this.regis = new Object, this.freshStrs = [] }
        var e = (__define, t),
            i = e.prototype;
        return t.getInstance = function() {
            return (null == this.instance || void 0 == this.instance) && (this.instance = new t), this.instance }, i.subscribeFunc = function(t, e, i) { this.regis[e] || (this.regis[e] = []);
            var n = this.freshStrs.indexOf(e);
            0 > n && this.freshStrs.push(e), this.regis[e].push({ func: t, "this": i }) }, i.unsubscribeFunc = function(t, e, i) {
            for (var n = this.regis[e], s = 0; s < n.length; s++)
                if (n[s].func == t && n[s]["this"] == i) { n.splice(s, 1);
                    break } }, i.notify = function(t) {
            for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
            var n, s, a;
            for (s = 0; s < this.freshStrs.length; s++)
                if (t == this.freshStrs[s])
                    for (n = this.regis[this.freshStrs[s]], a = 0; a < n.length; a++)
                        if (n[a].func instanceof Function)
                            if (n[a]["this"]) {
                                var o = n[a]["this"],
                                    r = n[a].func;
                                r.apply(o, e) } else n[a].func(e) }, t }();
    t.FreshNotifyManager = e, egret.registerClass(e, "wy.FreshNotifyManager") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e);
        i.prototype;
        return e.init = function() { t.Data.URL = window.gameUrl, this.openid = this.getItemByName("openid"), this.headimgurl = this.getItemByName("imgURL"), this.nickname = this.getItemByName("name"), this.sex = this.getItemByName("sex"), this.city = this.getItemByName("city"), this.country = this.getItemByName("country"), this.shareid = this.getItemByName("shareid"), this.delItemByName("shareid") }, e.share = function(t, e, i) { void 0 === i && (i = -1), 0 > i ? (window.sharedata[t] = e, window.timelinedata[t] = e, window.wx.onMenuShareAppMessage(window.sharedata), window.wx.onMenuShareTimeline(window.timelinedata)) : 0 == i ? (window.sharedata[t] = e, window.wx.onMenuShareAppMessage(window.sharedata)) : 1 == i && (window.timelinedata[t] = e, window.wx.onMenuShareTimeline(window.timelinedata)) }, e.getItemByName = function(t) {
            var e;
            return e = egret.localStorage.getItem(t), e || (e = window.localStorage.getItem(t), e || (e = this.getCookie(t), e || (e = decodeURI(decodeURI(window.getQueryString(t)))))), e }, e.delItemByName = function(t) { egret.localStorage.removeItem(t), window.localStorage.removeItem(t), this.delCookie(t) }, e.getCookie = function(t) {
            var e, i = new RegExp("(^| )" + t + "=([^;]*)(;|$)");
            return (e = document.cookie.match(i)) ? e[2] : null }, e.delCookie = function(t) {
            var e = new Date;
            e.setTime(e.getTime() - 1);
            var i = this.getCookie(t);
            null != i && (document.cookie = t + "=" + i + ";expires=" + e.toUTCString()) }, e.URL = "", e }();
    t.Data = e, egret.registerClass(e, "wy.Data") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function t() {}
        var e = (__define, t);
        e.prototype;
        return t.REMOVE = "remove_items", t.REMOVE_OVER = "remove_over", t }();
    t.FreshType = e, egret.registerClass(e, "wy.FreshType") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function t(t) { t && (this.jsondata = t, this.updateType()) }
        var e = (__define, t),
            i = e.prototype;
        return i.setData = function(t) { t && t instanceof Object && (this.jsondata = t, this.updateType()) }, i.getDataByIndex = function(t) {
            for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
            var n = null;
            if (1 == this.datatype)
                if (!e || e.length <= 0) n = this.jsondata[t];
                else {
                    for (var s = this.jsondata, a = 0, o = e.length; o > a && s; ++a)
                        for (var r = 0, h = s.length; h > r; ++r)
                            if (s[r].label == e[a]) { s = s[r].children;
                                break }
                    n = 0 > t ? s : t < s.length ? s[t] : null }
            return n }, i.getDataByLabel = function() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e - 0] = arguments[e];
            var i = null;
            if (1 == this.datatype)
                if (!t || t.length <= 0) i = null;
                else {
                    for (var n = this.jsondata, s = 0, a = t.length; a > s && n; ++s)
                        for (var o = 0, r = n.length; r > o; ++o)
                            if (n[o].label == t[s]) { n = n[o].children;
                                break }
                    i = n }
            return i }, i.getLabelArray = function() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e - 0] = arguments[e];
            var i = null;
            if (1 == this.datatype)
                if (!t || t.length <= 0) i = null;
                else {
                    for (var n = this.jsondata, s = 0, a = t.length; a > s && n; ++s)
                        for (var o = 0, r = n.length; r > o; ++o)
                            if (n[o].label == t[s]) { n = n[o].children;
                                break }
                    if (n && n.length > 0) { i = [];
                        for (var s = 0, r = n.length; r > s; s++) {
                            if (!n[s].hasOwnProperty("label")) throw Error("json 数据没有 label 属性 ");
                            i.push(n[s].label) } } }
            return i }, i.getLabelObjArray = function(t) {
            for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
            if (!t) return null;
            var n = null;
            if (1 == this.datatype)
                if (!e || e.length <= 0) n = null;
                else {
                    for (var s = this.jsondata, a = 0, o = e.length; o > a && s; ++a)
                        for (var r = 0, h = s.length; h > r; ++r)
                            if (s[r].label == e[a]) { s = s[r].children;
                                break }
                    if (s && s.length > 0) { n = [];
                        for (var a = 0, h = s.length; h > a; a++) {
                            if (!s[a].hasOwnProperty("label")) throw Error("json 数据没有 label 属性 ");
                            n.push({ key: s[a].label }) } } }
            return n }, i.updateType = function() { this.jsondata ? this.jsondata instanceof Object && this.jsondata instanceof Array ? this.datatype = 1 : this.jsondata instanceof Object ? this.datatype = 0 : this.datatype = -1 : this.datatype = -1, console.log("datatype=" + this.datatype) }, t }();
    t.Json = e, egret.registerClass(e, "wy.Json") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function t() {}
        var e = (__define, t);
        e.prototype;
        return t.LEFTIN = "wy.PageLeftIn", t.RIGHTIN = "wy.PageRightIn", t.TOPIN = "wy.PageTopIn", t.BOTTOMIN = "wy.PageBottomIn", t.ALPHAIN = "wy.PageAlphaIn", t.EJECTIN = "wy.PageScaleIn", t.LEFTOUT = "wy.PageLeftOut", t.RIGHTOUT = "wy.PageRightOut", t.TOPOUT = "wy.PageTopOut", t.BOTTOMOUT = "wy.PageBottomOut", t.ALPHAOUT = "wy.PageAlphaOut", t.EJECTOUT = "wy.PageScaleOut", t }();
    t.PopType = e, egret.registerClass(e, "wy.PopType") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e);
        i.prototype;
        return e.init = function(t, e, i, n, s, a) { void 0 === s && (s = -150), void 0 === a && (a = 50), this.posX = s, this.posY = a, this.playImg = i, n ? this.stopImg = n : this.stopImg = this.playImg, this.createMusicBtn(), this.btnNeedParent = !0, this.loadMusic(t, e) }, e.loadMusic = function(t, e) { void 0 === e && (e = !0), RES.getResByUrl("resource/assets/" + t + ".mp3", this.onSoundLoadOK1, this), this.needStart = e }, e.onSoundLoadOK1 = function(e, i) { this.bgmSound = e, this.needStart && (window.wx && window.is_weixin() ? window.wx.getNetworkType({ success: function(e) { e.networkType;
                    t.BGM.startMusic() } }) : this.startMusic()) }, e.startMusic = function() { this.bgmSound && (this.musicBtn && 0 == this.musicBtn.state && this.onClickMusicBtn(), this.btnNeedParent && this.musicBtn && !this.musicBtn.parent && (t.GameInterface.stage.addChild(this.musicBtn), this.musicBtn.x = this.posX, this.musicBtn.y = this.posY)) }, e.endMusic = function() { this.musicBtn && 1 == this.musicBtn.state && this.onClickMusicBtn() }, e.setXY = function(t, e) { this.musicBtn && (this.posX = t, this.posY = e, this.musicBtn.x = t, this.musicBtn.y = e) }, e.createMusicBtn = function() { this.musicBtn = t.Tools.createBitmapByName(this.playImg), t.Tools.center(this.musicBtn), this.musicBtn.state = 0, this.musicBtn.touchEnabled = !0, egret.Tween.get(this.musicBtn, { loop: !0 }).to({ rotation: 360 }, 4e3), egret.Tween.pauseTweens(this.musicBtn), this.musicBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickMusicBtn, this) }, e.onClickMusicBtn = function(t) { void 0 === t && (t = null), 1 == this.musicBtn.state ? (this.musicBtn.state = 0, this.musicBtn.texture = RES.getRes(this.stopImg), this.bgmSound && (this.bgmChannel.stop(), egret.Tween.pauseTweens(this.musicBtn), this.musicBtn.rotation = 0)) : (this.musicBtn.state = 1, this.musicBtn.texture = RES.getRes(this.playImg), this.bgmSound && (this.bgmChannel && this.bgmChannel.stop(), this.bgmChannel = this.bgmSound.play(0, 1e4), this.musicBtn.rotation = 0, egret.Tween.resumeTweens(this.musicBtn))) }, e.needStart = !0, e }();
    t.BGM = e, egret.registerClass(e, "wy.BGM") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function(e) {
        function i() { e.call(this), this.createOk() }
        __extends(i, e);
        var n = (__define, i),
            s = n.prototype;
        return s.createOk = function() { this.graphics.beginFill(0, .3), this.graphics.drawRect(0, 0, 640, 1036), this.graphics.endFill(), this.touchEnabled = !0, this.dialog = new egret.Sprite, this.dialog.graphics.beginFill(16777215, 1), this.dialog.graphics.drawRoundRect(0, 0, 400, 260, 30), this.dialog.graphics.endFill(), this.addChild(this.dialog), this.dialog.anchorOffsetX = this.dialog.width >> 1, this.dialog.anchorOffsetY = this.dialog.height >> 1, this.dialog.x = (640 - this.dialog.width) / 2 + this.dialog.anchorOffsetX, this.dialog.y = (1036 - this.dialog.height) / 2 + this.dialog.anchorOffsetY, this.dialog_btn_none = new egret.Shape, this.dialog_btn_none.graphics.beginFill(16777215, 1), this.dialog_btn_none.graphics.drawRoundRect(0, 0, 400, 70, 30), this.dialog_btn_none.graphics.endFill(), this.dialog_btn_none.y = 190, this.dialog.addChild(this.dialog_btn_none), this.dialog_btn_select = new egret.Shape, this.dialog_btn_select.graphics.beginFill(11052453, .5), this.dialog_btn_select.graphics.drawRoundRect(0, 0, 400, 70, 30), this.dialog_btn_select.graphics.endFill(), this.dialog_btn_select.y = 190, this.dialog.addChild(this.dialog_btn_select), this.dialog_btn_select.visible = !1, this.line = new egret.Shape, this.line.graphics.lineStyle(1, 0), this.line.graphics.moveTo(0, 190), this.line.graphics.lineTo(400, 190), this.dialog.addChild(this.line);
            var t = new egret.TextField;
            t.x = 0, t.y = 190, t.textAlign = egret.HorizontalAlign.CENTER, t.verticalAlign = egret.VerticalAlign.MIDDLE, t.fontFamily = "微软雅黑", t.width = 400, t.height = 70, t.textColor = 0, t.multiline = !1, t.size = 30, t.text = "确定", this.dialog.addChild(t), this.content_text = new egret.TextField, this.content_text.x = 0, this.content_text.y = 0, this.content_text.textAlign = egret.HorizontalAlign.CENTER, this.content_text.verticalAlign = egret.VerticalAlign.MIDDLE, this.content_text.fontFamily = "微软雅黑", this.content_text.width = 400, this.content_text.height = 190, this.content_text.textColor = 0, this.content_text.multiline = !0, this.content_text.lineSpacing = 15, this.content_text.size = 25, this.dialog.addChild(this.content_text), this.dialog_btn_none.touchEnabled = !0, this.dialog_btn_none.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.tap_begin, this), this.dialog_btn_none.addEventListener(egret.TouchEvent.TOUCH_END, this.tap_end, this), this.dialog_btn_none.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.tap_out, this) }, s.show_dialog = function(t, e) { this.dialog_btn_none.touchEnabled = !0, this.content_text.text = t, e.addChild(this) }, s.tap_begin = function() { this.dialog_btn_select.visible = !0 }, s.tap_out = function() { this.dialog_btn_select.visible = !1 }, s.tap_end = function() { this.dialog_btn_none.touchEnabled = !1, this.dialog_btn_select.visible = !1, this && this.parent && this.parent.removeChild(this) }, i.show = function(e, i) { void 0 === i && (i = t.GameInterface.stage), this.dialog.show_dialog(e, i) }, i.dialog = new i, i }(egret.Sprite);
    t.Dialog = e, egret.registerClass(e, "wy.Dialog") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e);
        i.prototype;
        return e.init = function(t) { this.myImg = document.createElement("img"), this.myImg.src = t }, e.set = function(e, i, n, s) {
            var a = n / t.GameInterface.stage.stageWidth * 100,
                o = s / t.GameInterface.stage.stageHeight * 100,
                r = e / t.GameInterface.stage.stageWidth * 100,
                h = i / t.GameInterface.stage.stageHeight * 100;
            this.myImg.style.width = a + "%", this.myImg.style.height = o + "%", this.myImg.style.position = "absolute", this.myImg.style.left = r + "%", this.myImg.style.top = h + "%" }, e.hide = function() {
            var t = document.getElementById("gameID");
            t.removeChild(this.myImg) }, e.show = function() {
            var t = document.getElementById("gameID");
            t.appendChild(this.myImg) }, e }();
    t.EWM = e, egret.registerClass(e, "wy.EWM") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function t() { this.MAX_SCALE = 3, this.MIN_SCALE = 0 }
        var e = (__define, t),
            i = e.prototype;
        return i.apply = function(t) {
            return null != t && void 0 != t && this.obj != t ? (this.cancel(), this.obj = t, egret.MainContext.deviceType == egret.MainContext.DEVICE_PC && (neoges.GestureManager.showTouchPoint = !0), this) : void 0 }, i.all = function() {
            return this.obj ? (this.scale().rotate().move(), this) : this }, i.scale = function() {
            return this.obj ? (this.pinch = new neoges.PinchGesture(this.obj), this.pinch.addEventListener(neoges.GestureEvent.BEGAN, this.onPinchBegan, this), this.pinch.addEventListener(neoges.GestureEvent.UPDATE, this.onPinchUpdate, this), this.pinch.addEventListener(neoges.GestureEvent.ENDED, this.onPinchEnd, this), this) : this }, i.rotate = function() {
            return this.obj ? (this.rot = new neoges.RotationGesture(this.obj), this.rot.addEventListener(neoges.GestureEvent.BEGAN, this.onRotationBegan, this), this.rot.addEventListener(neoges.GestureEvent.UPDATE, this.onRotationUpdate, this), this.rot.addEventListener(neoges.GestureEvent.ENDED, this.onRotationEnd, this), this) : this }, i.move = function() {
            return this.obj ? (this.pan = new neoges.PanGesture(this.obj), this.pan.addEventListener(neoges.GestureEvent.BEGAN, this.onPanBegan, this), this.pan.addEventListener(neoges.GestureEvent.UPDATE, this.onPanUpdate, this), this.pan.addEventListener(neoges.GestureEvent.ENDED, this.onPanEnd, this), this) : this }, i.cancel = function() {
            return this.pinch && (this.clearGesture(this.pinch), this.pinch.removeEventListener(neoges.GestureEvent.BEGAN, this.onPinchBegan, this), this.pinch.removeEventListener(neoges.GestureEvent.UPDATE, this.onPinchUpdate, this), this.pinch.removeEventListener(neoges.GestureEvent.ENDED, this.onPinchEnd, this)), this.rot && (this.clearGesture(this.rot), this.rot.removeEventListener(neoges.GestureEvent.BEGAN, this.onRotationBegan, this), this.rot.removeEventListener(neoges.GestureEvent.UPDATE, this.onRotationUpdate, this), this.rot.removeEventListener(neoges.GestureEvent.ENDED, this.onRotationEnd, this)), this.pan && (this.clearGesture(this.pan), this.pan.removeEventListener(neoges.GestureEvent.BEGAN, this.onPanBegan, this), this.pan.removeEventListener(neoges.GestureEvent.UPDATE, this.onPanUpdate, this), this.pan.removeEventListener(neoges.GestureEvent.ENDED, this.onPanEnd, this)), this }, i.onPinchBegan = function(t) { this.obj && (this.startScaleValue = this.obj.scaleX) }, i.onPinchUpdate = function(t) {
            if (this.obj && t.value != 1 / 0 && Math.abs(t.value) <= 5) {
                var e = this.startScaleValue * t.value;
                if (e > this.MAX_SCALE || e < this.MIN_SCALE) return;
                this.obj.scaleX = e, this.obj.scaleY = this.obj.scaleX } }, i.onPinchEnd = function(t) {}, i.onRotationBegan = function(t) { this.obj && (this.startRotationValue = this.obj.rotation) }, i.onRotationUpdate = function(t) { this.obj && t.value != 1 / 0 && Math.abs(t.value) <= 180 && (this.obj.rotation = this.startRotationValue + t.value) }, i.onRotationEnd = function(t) {}, i.onPanBegan = function(t) { this.startPoint = new egret.Point(t.host.x, t.host.y) }, i.onPanUpdate = function(t) { Math.abs(t.offsetX) <= 1e3 && (t.host.x = this.startPoint.x + t.offsetX, this.obj && (this.obj.x = t.host.x)), Math.abs(t.offsetY) <= 1e3 && (t.host.y = this.startPoint.y + t.offsetY, this.obj && (this.obj.y = t.host.y)) }, i.onPanEnd = function(t) {}, i.clearGesture = function(t) { t.dispose() }, t }();
    t.Gesture = e, egret.registerClass(e, "wy.Gesture") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function(t) {
        function e(i, n) { void 0 === n && (n = !0), t.call(this);
            var s;
            s = i ? i : e.RADIUS, this.bmp = new egret.Bitmap, this.addChild(this.bmp), this.bmp.width = this.bmp.height = 2 * s, this.bmp.x = this.bmp.y = -s, n && (this.shpMask = new egret.Shape, this.shpMask.graphics.beginFill(16777215, 1), this.shpMask.graphics.drawCircle(0, 0, s), this.shpMask.graphics.endFill(), this.addChild(this.shpMask), this.bmp.mask = this.shpMask) }
        __extends(e, t);
        var i = __define,
            n = e,
            s = n.prototype;
        return i(s, "source", function() {
            return this._source }, function(t) { this._source = t, RES.getResByUrl(t, this.compFunc, this, RES.ResourceItem.TYPE_IMAGE) }), s.compFunc = function(t) { this.bmp && (this.bmp.texture = t) }, i(s, "texture", function() {
            return this.bmp ? this.bmp.texture : null }, function(t) { this.bmp && (this.bmp.texture = t) }), e.RADIUS = 50, e }(egret.DisplayObjectContainer);
    t.HeadImg = e, egret.registerClass(e, "wy.HeadImg") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function(e) {
        function i() { e.call(this), this.createOk() }
        __extends(i, e);
        var n = (__define, i),
            s = n.prototype;
        return s.createOk = function() {
            this.graphics.beginFill(0, .5), this.graphics.drawRect(0, 0, 640, 1036), this.graphics.endFill(), this.touchEnabled = !0, this.dialog = new egret.Sprite, this.dialog.graphics.beginFill(1973790, 0), this.dialog.graphics.drawRoundRect(0, 0, 300, 200, 25), this.dialog.graphics.endFill(), this.addChild(this.dialog);
            var t = 170,
                e = 418;
            this.dialog.x = t, this.dialog.y = e, this.shape_sprite = new egret.Sprite, this.shape_sprite.graphics.beginFill(16711680, 0), this.shape_sprite.graphics.drawRect(0, 0, 139, 139), this.shape_sprite.graphics.endFill(), this.dialog.addChild(this.shape_sprite), this.shape_sprite.anchorOffsetX = this.shape_sprite.width >> 1, this.shape_sprite.anchorOffsetY = this.shape_sprite.height >> 1, this.shape_sprite.x = 83 + this.shape_sprite.anchorOffsetX, this.shape_sprite.y = 35 + this.shape_sprite.anchorOffsetY, this.loading1 = new egret.Shape, this.loading1.graphics.beginFill(16777215), this.loading1.graphics.drawCircle(120, 72, 10), this.loading1.graphics.endFill(), this.shape_sprite.addChild(this.loading1), this.loading2 = new egret.Shape, this.loading2.graphics.beginFill(16777215, .8), this.loading2.graphics.drawCircle(99, 18, 8), this.loading2.graphics.endFill(), this.shape_sprite.addChild(this.loading2), this.loading3 = new egret.Shape, this.loading3.graphics.beginFill(16777215, .6), this.loading3.graphics.drawCircle(35.5, 18.5, 6), this.loading3.graphics.endFill(), this.shape_sprite.addChild(this.loading3), this.loading4 = new egret.Shape, this.loading4.graphics.beginFill(16777215, .4), this.loading4.graphics.drawCircle(10, 71, 4), this.loading4.graphics.endFill(), this.shape_sprite.addChild(this.loading4), egret.Tween.get(this.shape_sprite, { loop: !0 }).to({ rotation: 360 }, 1e3)
        }, s.open_loading = function(t) { t.addChild(this) }, s.close_loading = function() { this && this.parent && this.parent.removeChild(this) }, i.open = function(e) { void 0 === e && (e = t.GameInterface.stage), this.loadingData.open_loading(e) }, i.close = function() { this.loadingData.close_loading() }, i.loadingData = new i, i
    }(egret.Sprite);
    t.LoadingData = e, egret.registerClass(e, "wy.LoadingData")
}(wy || (wy = {}));
var RandomUtils = function() {
    function t() {}
    var e = (__define, t),
        i = e.prototype;
    return t.limit = function(t, e) { t = Math.min(t, e), e = Math.max(t, e);
        var i = e - t;
        return t + Math.random() * i }, t.limitInteger = function(t, e) {
        return Math.round(this.limit(t, e)) }, i.randomArray = function(t) {
        var e = Math.floor(Math.random() * t.length);
        return t[e] }, t }();
egret.registerClass(RandomUtils, "RandomUtils");
var wy;
! function(t) {
    var e = function() {
        function t() {}
        var e = (__define, t);
        e.prototype;
        return t.checkMobile = function(t) {
            var e = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
            return e.test(t) ? !0 : !1 }, t }();
    t.RegUtils = e, egret.registerClass(e, "wy.RegUtils") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = __define,
            n = e;
        n.prototype;
        return i(e, "showTouchEffects", function() {
            return this._showTouchEffects }, function(e) { this._showTouchEffects = e, e ? t.GameInterface.stage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this) : t.GameInterface.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this) }), i(e, "showBtnEffects", function() {
            return this._showBtnEffects }, function(e) { this._showBtnEffects = e, e ? (t.GameInterface.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this), t.GameInterface.stage.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchRelease, this), t.GameInterface.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this)) : (t.GameInterface.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this), t.GameInterface.stage.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchRelease, this), t.GameInterface.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this)) }), e.init = function() { this.showBtnEffects = !0, this.showTouchEffects = !0 }, e.onTouchTap = function(e) { t.TouchEffects["do"](e.stageX, e.stageY) }, e.onTouchBegin = function(e) { "btn" == e.target.name && (t.Tools.center(e.target), e.target.scaleX = e.target.scaleY = .95) }, e.onTouchRelease = function(e) { "btn" == e.target.name && (e.target.scaleX = e.target.scaleY = 1), t.TouchEffects["do"](e.stageX, e.stageY) }, e.onTouchEnd = function(t) { "btn" == t.target.name && (t.target.scaleX = t.target.scaleY = 1) }, e.TYPE_BUTTON = "btn", e._showTouchEffects = !0, e._showBtnEffects = !0, e }();
    t.StageBtnUtils = e, egret.registerClass(e, "wy.StageBtnUtils") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e);
        i.prototype;
        return e.setContent = function(e, i, n, s) { void 0 === i && (i = t.GameInterface), void 0 === n && (n = 900), void 0 === s && (s = !1);
            var a = this.InstanceSpr();
            this.toastText.text = e, egret.Tween.removeTweens(a), s && (a.y = 1036, egret.Tween.get(a).to({ y: n }, 500)), egret.Tween.get(a).to({ alpha: 1 }, 300).wait(2e3).to({ alpha: 0 }, 300).call(function() { a.parent && a.parent.removeChild(a) }), a.y = n, i.stage.addChild(a) }, e.InstanceSpr = function() {
            if (null == this._instanceSpr) { this._instanceSpr = new egret.Sprite;
                var t = new egret.Matrix;
                t.createGradientBox(this.TF_WIDTH, this.TF_HEIGHT), this._instanceSpr.graphics.beginGradientFill(egret.GradientType.LINEAR, [this.BG_COLOR, this.BG_COLOR, this.BG_COLOR], [0, 1, 0], [0, 127, 255], t), this._instanceSpr.graphics.drawRect(0, 0, this.TF_WIDTH, this.TF_HEIGHT), this._instanceSpr.graphics.endFill(), this.toastText = new egret.TextField, this.toastText.size = this.FONT_SIZE, this.toastText.x = this.toastText.y = 0, this.toastText.width = this.TF_WIDTH, this.toastText.height = this.TF_HEIGHT, this.toastText.textAlign = "center", this.toastText.fontFamily = "微软雅黑", this.toastText.verticalAlign = egret.VerticalAlign.MIDDLE, this.toastText.textColor = this.TXT_COLOR, this._instanceSpr.addChild(this.toastText) }
            return this._instanceSpr.alpha = 0, this._instanceSpr }, e.BG_COLOR = 3488060, e.TXT_COLOR = 16777215, e.FONT_SIZE = 30, e.TF_HEIGHT = 60, e.TF_WIDTH = 640, e }();
    t.Toast = e, egret.registerClass(e, "wy.Toast") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function t() {}
        var e = (__define, t);
        e.prototype;
        return t.stop = function(t) { egret.Tween.removeTweens(t) }, t.removeFromParent = function(t) { t && t.parent && t.parent.removeChild(t) }, t.createMovieClip = function(t, e) { void 0 === e && (e = "png");
            var i = RES.getRes(t + "_json"),
                n = RES.getRes(t + "_" + e),
                s = new egret.MovieClipDataFactory(i, n),
                a = s.generateMovieClipData(t),
                o = new egret.MovieClip(a);
            return o }, t.createBitmapByName = function(t) {
            var e = new egret.Bitmap,
                i = RES.getRes(t);
            return e.texture = i, e }, t.createBitmapText = function(t) {
            var e = RES.getRes(t),
                i = new egret.BitmapText;
            return i.font = e, i }, t.createParticle = function(t, e) { void 0 === e && (e = "png");
            var i = RES.getRes(t + "_" + e),
                n = RES.getRes(t + "_json"),
                s = new particle.GravityParticleSystem(i, n);
            return s }, t.cnEnWordCount = function(t) {
            return t.replace(/[^\x00-\xff]/g, "**").length }, t.center = function(t) { t.x -= t.anchorOffsetX, t.y -= t.anchorOffsetY, t.anchorOffsetX = t.width >> 1, t.anchorOffsetY = t.height >> 1, t.x += t.anchorOffsetX, t.y += t.anchorOffsetY }, t.scaleImg = function(t, e, i) {
            var n = t.texture,
                s = n.textureWidth / n.textureHeight;
            n.textureWidth > n.textureHeight ? (n.textureWidth > e ? (t.width = e, t.height = t.width / s) : (t.width = n.textureWidth, t.height = n.textureHeight), t.height > i && (t.height = i, t.width = s * t.height)) : (n.textureHeight > i ? (t.height = i, t.width = s * t.height) : (t.width = n.textureWidth, t.height = n.textureHeight), t.width > e && (t.width = e, t.height = t.width / s)) }, t }();
    t.Tools = e, egret.registerClass(e, "wy.Tools") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function t() {}
        var e = (__define, t);
        e.prototype;
        return t["do"] = function(t, e, i) {
            for (var n = 0; n < this._num; n++) {
                var s, a = 2 * Math.PI * Math.random(),
                    o = Math.sin(a) * this._starDis,
                    r = Math.cos(a) * this._starDis,
                    h = t + o,
                    c = e + r,
                    l = t + 4 * o,
                    g = e + 4 * r,
                    d = (this._size + this._size * Math.random(), new egret.Shape),
                    u = 5;
                if (s = i ? i : RandomUtils.limit(0, 16777215), Math.random() > .5) { d.graphics.lineStyle(1, s), d.graphics.moveTo(u, 0), d.graphics.beginFill(s), d.x = h, d.y = c;
                    for (var p = 1; 11 > p; p++) {
                        var f = u;
                        p % 2 && (f /= 2);
                        var a = 2 * Math.PI / 10 * p;
                        d.graphics.lineTo(Math.cos(a) * f, Math.sin(a) * f) } } else u *= 1.2, d.graphics.lineStyle(1, s), d.graphics.moveTo(0, -u), d.graphics.beginFill(s), d.x = h, d.y = c, d.graphics.drawArc(-u * Math.SQRT1_2, 0, u, -Math.PI / 2, Math.PI / 2), d.graphics.drawArc(-u * (Math.SQRT1_2 + 1), 0, Math.SQRT2 * u, Math.PI / 4, -Math.PI / 4, !0);
                d.graphics.endFill(), egret.MainContext.instance.stage.addChild(d), egret.Tween.get(d).to({ alpha: 1, x: l, y: g, scaleX: .1, scaleY: .1, rotation: 360 }, 500).call(this.removeStar, this, [d]) } }, t.removeStar = function(t) { egret.MainContext.instance.stage.removeChild(t) }, t._size = 2, t._num = 10, t._starDis = 10, t }();
    t.TouchEffects = e, egret.registerClass(e, "wy.TouchEffects") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function t() {}
        var e = (__define, t);
        e.prototype;
        return t.upload = function(t, e, i) { void 0 === i && (i = 0), this.func = t, this.thisObj = e, 0 == i ? selectImage(this.selectHandler, e) : selectImageWX(this.selectHandler, e) }, t.selectHandler = function(t, e, i) { RES.getResByUrl(e, t.compFunc, t, RES.ResourceItem.TYPE_IMAGE) }, t.compFunc = function(t) { this.thisObj ? this.func && this.func.call(this.thisObj, t) : this.func && this.func(t) }, t }();
    t.UploadImg = e, egret.registerClass(e, "wy.UploadImg") }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) {
            if (t) {
                var a = 1;
                t.alpha = 0, this.doAnim(t, a) }
            if (e) {
                var a = 1;
                this.doAnim(e, a, i, n) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeIn ? a.to({ alpha: i }, t.PageSwitch.durationIn, t.PageSwitch.easeIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ alpha: i }, t.PageSwitch.durationIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageAlphaIn = e, egret.registerClass(e, "wy.PageAlphaIn", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) {
            if (t) {
                var a = t.y + t.anchorOffsetY;
                t.y = egret.MainContext.instance.stage.stageHeight + t.anchorOffsetY, this.doAnim(t, a) }
            if (e) {
                var a = -e.height + e.anchorOffsetY;
                this.doAnim(e, a, i, n) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeIn ? a.to({ y: i }, t.PageSwitch.durationIn, t.PageSwitch.easeIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ y: i }, t.PageSwitch.durationIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageBottomIn = e, egret.registerClass(e, "wy.PageBottomIn", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) {
            if (t) {
                var a = t.x + t.anchorOffsetX;
                t.x = -t.width + t.anchorOffsetX, this.doAnim(t, a) }
            if (e) {
                var a = egret.MainContext.instance.stage.stageWidth + t.anchorOffsetX;
                this.doAnim(e, a, i, n) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeIn ? a.to({ x: i }, t.PageSwitch.durationIn, t.PageSwitch.easeIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ x: i }, t.PageSwitch.durationIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageLeftIn = e, egret.registerClass(e, "wy.PageLeftIn", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) {
            if (t) {
                var a = t.x + t.anchorOffsetX;
                t.x = egret.MainContext.instance.stage.stageWidth + t.anchorOffsetX, this.doAnim(t, a) }
            if (e) {
                var a = -e.width + e.anchorOffsetX;
                this.doAnim(e, a, i, n) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeIn ? a.to({ x: i }, t.PageSwitch.durationIn, t.PageSwitch.easeIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ x: i }, t.PageSwitch.durationIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageRightIn = e, egret.registerClass(e, "wy.PageRightIn", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(e, i, n, s, a) { e && (t.Tools.center(e), e.scaleX = e.scaleY = .5, this.doAnim(e)), i && this.doAnim(i, n, s) }, n.doAnim = function(e, i, n) { t.Tools.stop(e);
            var s = egret.Tween.get(e);
            t.PageSwitch.easeIn ? s.to({ scaleX: 1, scaleY: 1 }, t.PageSwitch.durationIn, t.PageSwitch.easeIn).call(function() { t.Tools.stop(e), i && (n ? i.call(n, e) : i()) }) : s.to({ scaleX: 1, scaleY: 1 }, t.PageSwitch.durationIn).call(function() { t.Tools.stop(e), i && (n ? i.call(n, e) : i()) }) }, e }();
    t.PageScaleIn = e, egret.registerClass(e, "wy.PageScaleIn", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(e, i, n, s, a) {
            if (e) {
                var o = e.y + e.anchorOffsetY;
                e.y = -e.height + e.anchorOffsetY, this.doAnim(e, o) }
            if (i) {
                var o = t.GameInterface.stage.stageHeight + i.anchorOffsetY;
                this.doAnim(i, o, n, s) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeIn ? a.to({ y: i }, t.PageSwitch.durationIn, t.PageSwitch.easeIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ y: i }, t.PageSwitch.durationIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageTopIn = e, egret.registerClass(e, "wy.PageTopIn", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) {
            if (e) {
                var a = 0;
                this.doAnim(e, a, i, n) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeIn ? a.to({ alpha: i }, t.PageSwitch.durationIn, t.PageSwitch.easeIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ alpha: i }, t.PageSwitch.durationIn).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageAlphaOut = e, egret.registerClass(e, "wy.PageAlphaOut", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) {
            if (e) {
                var a = egret.MainContext.instance.stage.stageHeight + e.anchorOffsetY;
                this.doAnim(e, a, i, n) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeOut ? a.to({ y: i }, t.PageSwitch.durationOut, t.PageSwitch.easeOut).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ y: i }, t.PageSwitch.durationOut).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageBottomOut = e, egret.registerClass(e, "wy.PageBottomOut", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) {
            if (e) {
                var a = -e.width + e.anchorOffsetY;
                this.doAnim(e, a, i, n) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeOut ? a.to({ x: i }, t.PageSwitch.durationOut, t.PageSwitch.easeOut).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ x: i }, t.PageSwitch.durationOut).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageLeftOut = e, egret.registerClass(e, "wy.PageLeftOut", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) {
            if (e) {
                var a = egret.MainContext.instance.stage.stageWidth + e.anchorOffsetX;
                this.doAnim(e, a, i, n) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeOut ? a.to({ x: i }, t.PageSwitch.durationOut, t.PageSwitch.easeOut).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ x: i }, t.PageSwitch.durationOut).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageRightOut = e, egret.registerClass(e, "wy.PageRightOut", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) { e && this.doAnim(e, i, n) }, n.doAnim = function(e, i, n) { t.Tools.stop(e);
            var s = egret.Tween.get(e);
            t.PageSwitch.easeOut ? s.to({ scaleX: 0, scaleY: 0 }, t.PageSwitch.durationOut, t.PageSwitch.easeOut).call(function() { t.Tools.stop(e), i && (n ? i.call(n, e) : i()) }) : s.to({ scaleX: 0, scaleY: 0 }, t.PageSwitch.durationOut).call(function() { t.Tools.stop(e), i && (n ? i.call(n, e) : i()) }) }, e }();
    t.PageScaleOut = e, egret.registerClass(e, "wy.PageScaleOut", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function e() {}
        var i = (__define, e),
            n = i.prototype;
        return n.switching = function(t, e, i, n, s) {
            if (t) {
                var a = -t.height + t.anchorOffsetY;
                this.doAnim(t, a) }
            if (e) {
                var a = -e.height + e.anchorOffsetY;
                this.doAnim(e, a, i, n) } }, n.doAnim = function(e, i, n, s) { t.Tools.stop(e);
            var a = egret.Tween.get(e);
            t.PageSwitch.easeOut ? a.to({ y: i }, t.PageSwitch.durationOut, t.PageSwitch.easeOut).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) : a.to({ y: i }, t.PageSwitch.durationOut).call(function() { t.Tools.stop(e), n && (s ? n.call(s, e) : n()) }) }, e }();
    t.PageTopOut = e, egret.registerClass(e, "wy.PageTopOut", ["wy.IPageSwitch"]) }(wy || (wy = {}));
var wy;
! function(t) {
    var e = function() {
        function t() {}
        var e = (__define, t);
        e.prototype;
        return t.durationIn = 300, t.easeIn = null, t.durationOut = 300, t.easeOut = null, t }();
    t.PageSwitch = e, egret.registerClass(e, "wy.PageSwitch") }(wy || (wy = {}));
