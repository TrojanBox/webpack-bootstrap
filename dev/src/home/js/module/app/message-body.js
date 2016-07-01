require('../standard/base64');

/**
 * 构造器
 * @param host 定义域名
 * @constructor
 */
var MessageBody = function (host) {
    this.host = host;
    this.eventName = '';
    this.requestData = '';
};

/**
 * 设置事件名称
 * @param eventName
 * @returns {MessageBody}
 */
MessageBody.prototype.setEventName = function (eventName) {
    this.eventName = eventName;
    return this;
};

/**
 * 设置请求类型
 * @param requestData
 * @returns {MessageBody}
 */
MessageBody.prototype.setRequestData = function (requestData) {
    this.requestData = encodeURIComponent(BASE64.encoder(requestData));
    return this;
};

/**
 * 请求
 * @returns {boolean}
 */
MessageBody.prototype.request = function () {
    var uri = this.host + '/app.d/event/' + this.eventName + '/request/' + this.requestData;
    var frame = document.createElement('iframe');
    frame.style.display = 'none';
    frame.style.width = 0;
    frame.style.height = 0;
    frame.src = uri;
    document.getElementsByTagName('body')[0].appendChild(frame);
    setTimeout(function () {
        frame.parentNode.removeChild(frame);
    }, 400);
    return true;
};

module.exports = MessageBody;