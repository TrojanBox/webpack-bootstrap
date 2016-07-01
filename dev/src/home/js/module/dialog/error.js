var $ = require('jquery');
var util = require('../util');
var WindowManger = require('../component/window/window.manager');
var AnimateRipple = require('../component/window/animate.ripple');

var ErrorView = function () {
    WindowManger.apply(this, arguments);
    this.animationAdapterObject = new AnimateRipple(this);
    this.contentDocument = undefined;
    this.view = {};
    this.classPrefix = 'error-view';
    this.content = "(null)";
    this.title = '提示信息';
    this.height = 185;
    this.maxWidth = 440;
    this.top = 150;
    this.successEvent = undefined;
    this.errorEvent = undefined;
    this.promptText = '确认';
    this.cancelText = '取消';
};
util.inheritPrototype(ErrorView, WindowManger);

/**
 * 设置内容
 * @param content
 * @returns {ErrorView}
 */
ErrorView.prototype.setContent = function (content) {
    this.content = content;
    return this;
};

/**
 * 设置弹层标题
 * @param title
 * @returns {ErrorView}
 */
ErrorView.prototype.setTitle = function (title) {
    this.title = title;
    return this;
};

/**
 * 创建内容视图
 */
ErrorView.prototype.createView = function () {

    var view = $(this.windowManager.view);
    var _this = this;
    this.view.toolbar = document.createElement('div');
    this.view.operation = document.createElement('div');
    this.view.title = document.createElement('span');
    this.view.body = document.createElement('div');
    this.view.successButton = document.createElement('div');
    this.view.errorButton = document.createElement('div');
    var toolbarHeight = 50;
    var operationHeight = 50;

    this.view.operation.className = this.getClassPrefix() + 'operation';
    this.view.toolbar.className = this.getClassPrefix() + 'toolbar';
    this.view.title.className = this.getClassPrefix() + 'title';
    this.view.successButton.className = this.getClassPrefix() + 'success';
    this.view.errorButton.className = this.getClassPrefix() + 'error';
    this.view.body.className = this.getClassPrefix() + 'body';

    this.view.toolbar.style.width = '100%';
    this.view.toolbar.style.height = toolbarHeight + 'px';
    this.view.title.innerHTML = this.title;
    this.view.title.style.float = 'left';

    this.view.body.style.margin = '5px';
    this.view.body.innerHTML = this.content;
    this.view.body.style.height = (this.coordinateParameter.bearingHeight - (toolbarHeight + operationHeight + 10)) + 'px';

    this.view.operation.style.height = operationHeight + 'px';
    this.view.operation.style.width = '100%';

    this.view.successButton.innerHTML = this.promptText;
    this.view.errorButton.innerHTML = this.cancelText;

    this.view.toolbar.appendChild(this.view.title);
    this.view.operation.appendChild(this.view.errorButton);
    this.view.operation.appendChild(this.view.successButton);
    this.windowManager.view.appendChild(this.view.toolbar);
    this.windowManager.view.appendChild(this.view.body);
    this.windowManager.view.appendChild(this.view.operation);

    this.view.successButton.onclick = function () {
        if (_this.successEvent) _this.successEvent();
        _this.close();
    };

    this.view.errorButton.onclick = function () {
        if (_this.errorEvent) _this.errorEvent();
        _this.close();
    };

    if (!util.isMobileBrowser()) {
        view.css({opacity: 0, marginTop: 3});
        setTimeout(function () {
            view.animate({opacity: 1, marginTop: 0}, _this.time * (4 / 3));
        }, this.time * (1 / 30));
    }
};

/**
 * 成功事件回调处理
 * @param success
 * @returns {ErrorView}
 */
ErrorView.prototype.success = function (success) {
    this.successEvent = success;
    return this;
};

/**
 * 失败事件回调处理
 * @param error
 * @returns {ErrorView}
 */
ErrorView.prototype.error = function (error) {
    this.errorEvent = error;
    return this;
};

ErrorView.prototype.setConfirmButtonText = function (text) {
    this.promptText = text;
};

ErrorView.prototype.setCancelButtonText = function (text) {
    this.cancelText = text;
};

module.exports = ErrorView;
