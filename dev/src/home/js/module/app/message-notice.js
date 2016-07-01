var MInterface = require('./message-interface');
var MessageBody = require('./message-body');

/**
 * 系统平台构造器
 * @param platform
 * @constructor
 */
var MessageNotice = function (platform) {
    this.url = '';
    if (platform != null && platform != '' && platform != undefined && platform != "NULL") {
        this.platform = platform;
    } else {
        var webView = window.webview || {};
        if (webView && webView.localEvent) {
            this.platform = MInterface.Platform.ANDROID;
        } else {
            this.platform = MInterface.Platform.IOS;
        }
    }
};

/**
 * 设置通知地址，用于IOS的IFRAME通知
 * @param url
 * @returns {MessageNotice}
 */
MessageNotice.prototype.setUrl = function (url) {
    this.url = url;
    return this;
};

/**
 * 标准事件类型
 * @param event
 * @param request
 */
MessageNotice.prototype.event = function (event, request) {
    switch (this.platform) {
        case MInterface.Platform.ANDROID:
            webview.localEvent(event, request);
            break;
        case MInterface.Platform.IOS:
        default:
            return new MessageBody(this.url)
                .setEventName(event)
                .setRequestData(request)
                .request();
            break;
    }
};

module.exports = {
    MessageNotice: MessageNotice
};