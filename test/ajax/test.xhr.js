(function(){

    QUnit.module("xhr test", {
        before : function () {
            this.xhr = require("xhr");
            this.info = {
                "name":"zhangguixu",
                "password":"123"
            };
        }
    });

    QUnit.test("get test", function (assert) {
        var done = assert.async();
        var self = this;
        this.xhr.send({
            type : "get",
            url : "/user/info",
            success : function (ret){
                console.log();
                assert.deepEqual(self.info, ret, "返回json数据");
                done();
            }
        });
    });

    QUnit.test("post test with parameters", function(assert) {
        var done = assert.async();
        var self = this;
        this.xhr.send({
            type : "post",
            url : "/data",
            data : {
                "name" : "zhangguixu",
                "password" : "123"
            },
            success : function (ret){
                console.log(ret);
                assert.deepEqual(self.info, ret, "返回json数据");
                done();
            }
        });
    });

    QUnit.test("get test with parameters", function(assert) {
        var done = assert.async();
        var self = this;
        this.xhr.send({
            type : "get",
            url : "/data",
            data : {
                "name" : "zhangguixu",
                "password" : "123"
            },
            success : function (ret){
                console.log(ret);
                assert.deepEqual(self.info, ret, "返回json数据");
                done();
            }
        });
    });

    QUnit.test("timeout test", function(assert){
        var done = assert.async();
        this.xhr.send({
            type : "get",
            url : "/timeout",
            timeout : 2000,
            error : function(ret) {
                assert.equal("timeout", ret.msg, "进行超时处理");
                done();
            }
        });
    });

})();