module.exports = function(grunt) {
    "use strict";
    var bannerContent = "/* ---目标文件--- */\n";
    var distJsName = "modules";

    // 读取测试配置文件
    var testConfig = grunt.file.readJSON("test.json");
    var i, len;

    // 根据配置读取测试的模块代码
    var libs = ["m.js"], srcPathHeader = "src/**/";
    var testModules = libs.concat(testConfig.testModules);
    for(i = 0, len = testModules.length; i < len; i++){
        testModules[i] = srcPathHeader + testModules[i];
    }

    // 根据配置生成测试代码
    var testPathHeader = "test/**/";
    var tests = testConfig.tests;
    for(i = 0, len = tests.length; i < len; i++){
        tests[i] = testPathHeader + tests[i];
    }

    // 根据配置，是否读取数据文件
    if(testConfig.ajax){
        var ajaxConf = testConfig.ajax;
        for(var key in ajaxConf){
            ajaxConf[key] = grunt.file.readJSON("data/" + ajaxConf[key]);
        }
    }

    // 解析参数
    var parse = function (s) {
        var params = s.toString().split("&");
        var ret = {}, p;
        for(var i = 0; i < params.length; i++){
            p = params[i].split("=");
            ret[p[0]] = p[1];
        }
        return ret;
    };


    // 配置任务
    grunt.initConfig({
        // 读取package.json文件
        pkg : grunt.file.readJSON("package.json"),
        
        // jshint
        jshint : {
            files : ["Gruntfile.js", "src/**/*.js", "test/*.js"],
            options : {
                trailing : true,
                unused : true
            }
        },

        // 拼接文件
        concat : {
            options : {
                    banner : bannerContent
            },
            testModule : {
                src : testModules,
                dest : "dist/" + distJsName + ".js",
                nonull : true 
            },
            test : {
                src : tests,
                dest : "test/testinit.js",
                nonull : true
            }        
        },  

        // 单元测试
        qunit : {
            files : ["test/test.html"],
            timeout : 50000
        },

        // 压缩混淆文件
        uglify : {
            options : {
                banner : bannerContent
            },
            target : {
                src : ["src/**/*.js"],
                dest : "dist/" + distJsName + ".min.js" 
            }
        },

        // 监视文件变化
        watch : {
            files : ["src/**/*.js", "test/*.js"],
            tasks : ["jshint", "concat", "qunit"]
        },

        // 搭建一个server
        connect : {
            server : { // 用于打开测试页面
                options : {
                    protocol : "http",
                    port : 8080,
                    hostname : "*",
                    keepalive : true, // 进程不会执行后自动退出
                    debug : true,
                    base : ["."],
                    open : { // 只能打开默认的浏览器
                        target : "http://localhost:8080/test/test.html"
                    },
                    middleware: function(connect, options, middlewares) {
                        // get
                        middlewares.unshift(function(req, res, next) {
                            if(!ajaxConf || !ajaxConf.hasOwnProperty(req.url))return next();
                            res.end(JSON.stringify(ajaxConf[req.url]));
                        });
                        // 返回请求的数据
                        middlewares.unshift(function(req, res, next){
                            if(req.url.indexOf("data") < 0){
                                return next();
                            }
                            var ret, url = req.url;
                            if(req.method.toUpperCase() == "GET"){ // get 请求，直接在url上进行获取
                                ret = parse(url.substring(url.indexOf("?")+1));
                                res.end(JSON.stringify(ret));
                            } else { // post请求，获取请求体
                                req.on("data", function (rawData){
                                    ret = parse(rawData);
                                    res.end(JSON.stringify(parse(rawData)));
                                });
                            }                     
                        });
                        return middlewares;
                    }
                }
            }
        }
    });

    // 加载和注册任务
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-connect");

    // 默认任务
    grunt.registerTask("default", ["concat:testModule", "concat:test"]);

    // 拼接任务
    grunt.registerTask("concatfile", ["concat"]);

    // 普通单元测试任务
    grunt.registerTask("unittest", ["jshint", "concat:testModule", "concat:test", "connect:server"]);

   
};