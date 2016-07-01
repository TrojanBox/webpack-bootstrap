[TOC]

# webpack-bootstrap
基于 webpack + gulp 搭建纯静态页面型前端工程解决方案模板。
###### 2016年5月25日 更新
    1. 通过 gulp 构建项目时会产生相应的资源映射文件。

###### 2016年5月24日 更新
    1. webpack-bootstrap 配置文件支持多项目切换。
    2. 只会编译 js 文件，css, images 不再参与编译操作。

### 安装软件
- Node.js：v4.0+
- compass（非必须）：v1.0+

### 拷贝项目模板
``` bash
$ git clone http://debug.otouzi.com:8876/otouzi/webpack-bootstrap.git
```

### 安装依赖模块 [必须安装]
``` bash
$ npm install -g gulp webpack
$ npm install -g node-dev # 推荐这个工具，代码改动会自动重启node进程
$ npm install -g bower
$ cd webpack-bootstrap # 进入到 webpack-bootstrap 目录 
$ npm install  # 安装 node.js 扩展
$ bower install # 安装 bower 扩展
```

### 安装依赖模块 [可选安装]
``` bash
$ npm install -g typescript # 可选，对 typescript 提供支持
$ npm install -g tsd # 可选，提供第三方 .d.ts 文件，例如 jquery，在使用 ts 开发时有效
$ npm install node-sass # 提供 sass 样式文件支持，不过安装比较繁琐，可以使用项目代替方案 LESS
```

# 项目信息
### 目录结构
```
build                       # 开发文件目录
  home
    js
    mapping.source.json     # 资源映射文件
dist                        # 生产环境目录
  home
    js
    mapping.source.json     # 资源映射文件
  ...                       # 其他目录
browser_components          # bower 管理目录，前段类库目录
node_modules                # npm 目录，后端类库目录
typings                     # .d.ts 文件目录
dev
  src                       # 项目源码目录
    home                    # Home 项目目录
      js                    # js 目录，webpack 只会构建此目录中的 .js 文件。
                            # 此文件夹内所有子文件夹内的文件都不会直接参与构建。
    webpack                 # webpack 配置目录
.jshintrc                   # jsHit 配置文件
gulpfile.js                 # gulp 配置文件
package.json                # npm 配置文件
bower.json                  # bower 配置文件
webapck.config.js           # webpack 配置文件，在这里通过配置文件，配置新的工作目录和其工作环境
tsconfg.json                # typescript 配置文件
tsd.json                    # .d.ts 头文件配置
```

### 项目目录
项目目录中的文件约定目录为 js, css, images, fonts 四个文件。

### 多环境切换
你可以在`webapck.config.js`文件中创建并切换多个工作环境。

# 支持的转义插件
----
##### .jsx 支持
> 推荐使用`.jsx`代替`.js`来进行开发，它能向下兼容 es5 语法。  
> 比如：直接把文件名从`.js`改成`.jsx`也能通过编译。  

如果文件名以`.jsx`方式结尾，将交给`babel-loader`转义器处理。  
转移器会将 es6 代码转义成 es3 以兼容更低版本的浏览器。  
需要注意的是，虽然`.jsx`在部分 IDE 支持如下写法，并不报错。  
``` jsx
var html = <a href="###">a</a>;
```
但 webpack 在编译时仍会报错，因为他不属于 ES6 的一部分。  

##### .ts/.d.ts 支持
> 不推荐使用

如果文件名以`.ts`方式结尾，将交给`ts-loader`转义器处理。  
TypeScript 支持更严格的类型检查，语法相对复杂。  

##### .less 支持
方便CSS的编写和维护。功能上没`scss`强大。但部署简单。

##### .scss 支持
方便CSS的编写和维护。功能上比`less`强大。但部署起来麻烦。  
依赖模块 `node-sass` 需要编译安装。  


# 其他特性
----
##### require.ensure 按需加载
> 在需要的时候才下载依赖的模块，当参数指定的模块都下载下来了(下载下来的模块还没执行),便执行参数指定的回调函数。

```js
var module = require('module');

document.getElementById("click-button").onclick = function () {
    require.ensure([], function (require) {
        // 这里的内容只有在 onclick 事件执行之后才下载
        var dialog = require('./dialog');
        var errorView = new dialog.ErrorView();
        // .....
    });
};
```

##### TypeScript
> 已经提供对 ts 支持，不过需要先下载相应的依赖。  
> 项目统一使用 --module commonjs 编译，webpack 会自动解决相应依赖关系。  
> 使用 ts 开发时可以使用大部分 es6 代码。

```typescript
var a:int = 1;
var b:double = 2;
class A<T> {
  public userId:int;
  public obj:T;
}
```

下面通过两种方式处理外部依赖。    

**方式1**
通过 `var $ = require('jquery')` 方式引入依赖会跳过 ts 中的文件类型检测。
与方式2相比，程序在执行过程中无区别，但在使用IDE时缺少语法检查功能和智能提示。

**方式2**
通过 `import * as $ from 'jquery'` 方式引入 ts 会检查对应声明文件(.d.ts 头文件)。  
如果通过这种方式引入 jq 会出现编译不通过的提示，在当前文件头加入 `/// <reference path="./libs/jquery.d.ts"/>` 即可。
```js
/// <reference path="./libs/jquery.d.ts"/>          // 声明使用 jquery.d.ts 头文件，ts 在编译时会执行安全检查。
import * as $ from 'jquery'                         // 导入 jQuery 包文件。
```

##### ECMAScript 6 规范支持
> 已经提供对 ES6 的支持，相应模块已被内置。  
> 功能由 babel es2015 模块提供，如果使用 es6 功能需要创建后缀名为 `.jsx` 的文件。webpack 会自动构建成 `.js` 并处理相关依赖。  

```js
var a = () => {};
var b = (b) => b;
const double = [1, 2, 3].map((num) => num * 2);
class A {}
```

# 命令以及任务
----
##### webpack -w
热更新，文件每次改动会直接生成新的资源文件。

##### webpack -d -p
项目构建，生成map文件，同时压缩文件。

##### gulp default
项目完整构建，会生成map文件，资源映射文件，同时压缩代码。

### License
----

Author: justwe9517@foxmail.com

MIT.
