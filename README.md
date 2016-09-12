# 代码库

## 1. 说明

自己的代码库，平时积累的一些比较有通用性的代码，将其收录，模块化，之后方便在项目中使用。

### 1.1 目录结构

* src: 代码库  

    * lib: 构建代码的基础库，目前实现了模块化
    * util: 工具模块

* test: 测试代码

    * test.html 测试的页面，采用QUnit的测试框架，可以在不同的浏览器打开，对代码进行测试
    * testinit.js 合并的测试代码

* dist: 合并的待测试的代码
* test.json: 测试的文件配置

    * testModules : 数组，待测试的模块
    * tests : 数组，模块的测试代码
    * ajax : 默认为false，当不为false时，可以配置路径和对应的数据文件，例如{"/user/info" : "user.json"}

* Gruntfile.js: 使用grunt作为构建工具，来构建整个代码合并，测试的流程
* external : 一些辅助的文件，例如qunit.js、qunit.css
* data : 存储一些测试数据，当测试ajax的时候可以使用到

### 1.2 工作流程 

1. 在src下，编写自己的模块代码
2. 在test下，编写自己模块的测试代码
3. 配置test.json，填写需要测试的模块和相对应的测试代码
4. 运行`npm test`

### 1.3 其他说明

1. 代码中使用的`require`和`define`是自己实现的简易的模块化接口，实现在`lib/m.js`中，这样做有两个考虑：

    1. 在目前前端模块化中，这两个都是最主要的接口，一个是定义模块，一个是引入模块，这样可以提高代码的迁移性，即如果在项目中使用了requirejs、seajs，也可以适应。
    2. 代码库只需要对代码进行测试，情况比较简单，不需要使用到模块定义的库文件，减少各种依赖管理的开销，可以专注于代码的测试，同时又可以对代码进行封装。

2. 【X】使用的单元测试是grunt的插件`grunt-contrib-qunit`，默认执行QUnit任务，使用`phantomjs`对代码进行测试。【√】此处修改为直接打开测试页面进行测试，不再使用`phantomjs`，这样可以方便在不同浏览器测试代码的兼容性，同时还可以在浏览器进行代码测试，比较方便。

3. 为了避免一个模块一个测试页面（其实不太需要），保证测试入口文件唯一（test/test.html），我使用grunt构建工具和配置文件test.json的方式，来实现配置测试，grunt会读取我们的配置文件，将文件合并到统一的`module.js`和`testinit.js`，然后在测试入口文件中进行测试。

4. 使用`grunt-contrib-connect`，打开页面，可以在多个浏览器进行兼容性测试。

5. 使用`grunt-contrib-connect`的middlewares来进行请求的拦截，然后实现前后端通信，满足例如ajax模块的请求，对其进行测试。

6. 使用`connect-livereload`插件，结合watch的livereload属性和connect-livereload可以实现页面的自动刷新，重新进行代码测试。

## 2. 模块

### 2.1 AJAX

1. jsonp
2. xhr
3. ping

### 2.2 dom

1. form:serialize, form:isTypeSupported

### 2.3 storage

1. cookie:set, cookie:get, cookie:clear

### 2.4 util

1. array:indexOf, array:unique


