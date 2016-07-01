var $ = require('jquery');

var Manager = function () {
    this.container = [];    // 容器内容
    this.number = 7;        // 容器存储数量
    this.messageBox = document.createElement('div');
    this.messageBox.className = 'messagebox';
};

Manager.prototype.addNoticeNode = function (node) {
    if (typeof node != 'object') throw new Error('Undefined Type.');
    this.container.push(node);
    if (this.messageBox.childNodes.length == 0) {
        this.messageBox.appendChild(node.insert());
    } else {
        this.messageBox.insertBefore(node.insert(), this.messageBox.childNodes[0]);
    }
    setTimeout(function () {
        node.destroy(1000);
    }, 10000);
    node.run();
    if (this.container.length > this.number) this.container.shift().destroy();
    document.getElementsByTagName('body')[0].appendChild(this.messageBox);
};

var Node = function (data) {
    this.classPrefix = data.classPrefix ? data.classPrefix : 'notice-';
    this.data = {};
    this.data.title = !data.title ? '系统推送给您的消息' : data.title;
    this.data.content = !data.content ? '(null)' : data.content;
    this.view = {};
};

Node.prototype.createView = function () {
    this.view.noticeDocumentFragment = document.createDocumentFragment();
    this.view.messageNode = document.createElement('div');
    this.view.nodeName = document.createElement('div');
    this.view.nodeContent = document.createElement('div');
    this.view.messageNode.className = this.classPrefix + 'message';
    this.view.nodeName.className = this.classPrefix + 'name';
    this.view.nodeContent.className = this.classPrefix + 'content';
    this.view.messageNode.style.display = 'none';
    this.view.nodeName.innerHTML = this.data.title;
    this.view.nodeContent.innerHTML = this.data.content;
    this.view.noticeDocumentFragment.appendChild(this.view.messageNode);
    this.view.messageNode.appendChild(this.view.nodeName);
    this.view.messageNode.appendChild(this.view.nodeContent);
    if (this.data.event) {
        var i;
        for (i in this.data.event) {
            if (this.data.event.hasOwnProperty(i)) {
                this.view.messageNode.addEventListener(i, this.data.event[i]);
            }
        }
    }
};

/** 执行节点，默认情况下由通知管理器调用 */
Node.prototype.insert = function () {
    this.createView();
    return this.view.noticeDocumentFragment;
};

Node.prototype.run = function () {
    $(this.view.messageNode).fadeIn();
};

/** 自毁，默认情况下由通知管理器调用 */
Node.prototype.destroy = function (time) {
    var messageNode = $(this.view.messageNode);
    messageNode.fadeOut(time, function () {
        if (messageNode.parentNode) messageNode.parentNode.removeChild(this);
    });
};

module.exports = {
    Manager: Manager,
    Node: Node
};