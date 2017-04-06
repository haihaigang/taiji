 /**
 * 自定义提示框
 **/

(function() {
    var that = this,
        preventDefault, panel, panelBg, delay, count = 0,
        toastPanel, temp;

    //自定义提示框，依赖jquery
    var TipPanel = function(el, options) {
        var that = this;

        that.panel = el || $('#tj-panel');
        that.panelBg = panelBg || $('#tj-panel-bg');
        that.dialogContent = that.panel.find('.dialog-content');
        that.panelContent = that.panel.find('.panel-content');
        that.panelTitle = that.panel.find('.panel-title');
        that.panelTips = that.panel.find('.panel-tips');
        that.panelButtons = that.panel.find('.panel-buttons');
        that.btnOk = that.panel.find('.btn-primary');
        that.btnCancel = that.panel.find('.btn-default');
        that.panelText = that.panel.find('.panel-text');
        that.panelTick = that.panel.find('.panel-tick');
        that.panelInput = that.panel.find('.panel-input');

        that.options = {
            type: 'error',
            tick: 0,
            okText: '确定',
            cancelText: '取消',
            showTitle: false,
            showTips: false,
            textAline: 'center',
        };

        //关闭
        that.panel.on('click', '.btn-primary', function(e) {
            e.preventDefault();
            that.hide(true);
        });

        //取消
        that.panel.on('click', '.btn-default', function(e) {
            e.preventDefault();
            that.hide();
        });
    };

    TipPanel.prototype = {
        delay: undefined,
        count: 0,
        setOptions: function(options) {
            var that = this;

            for (i in options) that.options[i] = options[i];

            if (that.options.showTitle) {
                that.panelTitle.show();
            } else {
                that.panelTitle.hide();
            }
            if (that.options.showTips) {
                that.panelTips.show();
            } else {
                that.panelTips.hide();
            }
            if (that.options.panelInput) {
                that.panelInput.show();
            } else {
                that.panelInput.hide();
            }
            if (that.options.okText) {
                that.btnOk.text(that.options.okText);
            }
            if (that.options.cancelText) {
                that.btnCancel.text(that.options.cancelText);
            }
            if (that.options.tipsText) {
                that.panelTips.html(that.options.tipsText);
            }
            if (that.options.titleText) {
                that.panelTitle.text(that.options.titleText);
            }
            if (that.options.type == 'confirm') {
                that.btnOk.show();
                that.btnCancel.show();
            } else if (that.options.type == 'prompt') {
                that.btnOk.show();
                that.btnCancel.show();
            } else {
                that.btnOk.show();
                that.btnCancel.hide();
            }
            if (that.options.className) {
                that.panelText.addClass(that.options.className);
            } else {
                that.panelText.removeClass(that.options.className);
            }

            that.panelText.html(that.options.message);
            that.panel.show();
            that.panelBg.show();

            //确定窗口位置
            if (that.dialogContent.height() > $(window).height()) {
                that.dialogContent.css({
                    'margin-top': 0,
                    'top': 0
                });
            } else {
                that.dialogContent.css({
                    'margin-top': -(that.dialogContent.height() / 2),
                    'top': '50%'
                });
            }
            that.panelContent.css('max-height', ($(window).height() - that.panelButtons.height()));
            // document.addEventListener('touchmove', prevent, true);

            if (that.options.tick > 1000) {
                that.panelTick.text(that.options.tick / 1000);
                that.delay = setInterval(function() {
                    if (that.count < that.options.tick - 1000) {
                        that.count = count + 1000;
                        that.panelTick.text((that.options.tick - count) / 1000);
                    } else {
                        that._end();
                        that.count = 0;
                        clearInterval(that.delay);
                    }
                }, 1000);
            } else if (that.options.tick <= 1000 && that.options.tick > 0) {
                that.delay = setTimeout(function() {
                    that._end();
                }, that.options.tick);
            }
        },
        _end: function() {
            var that = this;

            that.panel.hide();
            that.panelBg.hide();

            if (typeof that.options.tipsCallback == 'function') {
                that.options.tipsCallback();
                that.options.tipsCallback = undefined;
            } else if (typeof that.options.yesCallback == 'function') {
                that.options.yesCallback();
                that.options.yesCallback = undefined;
            }
        },
        show: function() {

        },
        hide: function(yesClick) {
            var that = this;

            if (that.delay) {
                clearTimeout(that.delay);
            }
            if (!that.panel) {
                return;
            }
            that.panel.hide();
            that.panelBg.hide();

            if (yesClick) {
                typeof that.options.yesCallback == 'function' && that.options.yesCallback();
            } else {
                typeof that.options.noCallback == 'function' && that.options.noCallback();
            }
            that.options.yesCallback = undefined;
            that.options.noCallback = undefined;
            // document.removeEventListener('touchmove', prevent,true);
        },
        preventDefault: function(e) {
            e.preventDefault();
        }
    }

    function prevent(e) {
        e.preventDefault();
    }

})()
