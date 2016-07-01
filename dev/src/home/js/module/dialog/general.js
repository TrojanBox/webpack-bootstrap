var $ = require('jquery');
var util = require('../util');
var WindowManger = require('../component/window/window.manager');
var AnimateRipple = require('../component/window/animate.ripple');

var GeneralView = function () {
    WindowManger.apply(this, arguments);
    this.animationAdapterObject = new AnimateRipple(this);
    this.contentDocument = undefined;
    this.view = {};
    this.classPrefix = 'general-view';
    this.content = "(null)";
    this.title = '提示信息';
};
util.inheritPrototype(GeneralView, WindowManger);

/**
 * 设置内容
 * @param content
 * @returns {GeneralView}
 */
GeneralView.prototype.setContent = function (content) {
    this.content = content;
    return this;
};

/**
 * 设置弹层标题
 * @param title
 * @returns {GeneralView}
 */
GeneralView.prototype.setTitle = function (title) {
    this.title = title;
    return this;
};

/**
 * 创建内容视图
 */
GeneralView.prototype.createView = function () {

    var view = $(this.windowManager.view);
    var _this = this;
    this.view.toolbar = document.createElement('div');
    this.view.title = document.createElement('span');
    this.view.closeButton = document.createElement('span');
    this.view.body = document.createElement('div');
    var toolbarHeight = 50;

    this.view.toolbar.className = this.getClassPrefix() + 'toolbar';
    this.view.title.className = this.getClassPrefix() + 'title';
    this.view.closeButton.className = this.getClassPrefix() + 'close';
    this.view.body.className = this.getClassPrefix() + 'body';

    this.view.toolbar.style.width = '100%';
    this.view.toolbar.style.height = toolbarHeight + 'px';
    this.view.title.innerHTML = this.title;
    this.view.title.style.float = 'left';

    this.view.closeButton.innerHTML = 'x';
    this.view.closeButton.style.float = 'right';

    this.view.body.style.margin = '5px';
    this.view.body.innerHTML = this.content;
    this.view.body.style.height = (this.coordinateParameter.bearingHeight - (toolbarHeight + 10)) + 'px';

    this.view.toolbar.appendChild(this.view.title);
    this.view.toolbar.appendChild(this.view.closeButton);
    this.windowManager.view.appendChild(this.view.toolbar);
    this.windowManager.view.appendChild(this.view.body);

    _this.windowManager.background.onclick = function () {
        _this.close();
    };
    _this.view.closeButton.onclick = function () {
        _this.close();
    };

    if (!util.isMobileBrowser()) {
        view.css({opacity: 0, marginTop: 3});
        setTimeout(function () {
            view.animate({opacity: 1, marginTop: 0}, _this.time * (4 / 3));
        }, this.time * (1 / 3));
    }
};

module.exports = GeneralView;