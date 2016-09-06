(function(){

    QUnit.module("jsonp test", {
        before : function () {
            this.jsonp = require("jsonp");
            this.info = {
                "name":"zhangguixu",
                "password":"123"
            };
        }
    });

    QUnit.test("jsonp test", function (assert) {
        var done = assert.async();
        var self = this;
        this.jsonp.send({
            url : "/jsonp",
            data : {
                "name" : "zhangguixu",
                "password" : "123"
            },
            success : function (ret){
                console.log();
                assert.deepEqual(self.info, ret, "返回json数据");
                done();
            }
        });
    });


    QUnit.test("error test", function(assert){
        var done = assert.async();
        this.jsonp.send({
            url : "/error",
            error : function(ret) {
                assert.equal("error", ret.msg, "进行出错处理");
                done();
            }
        });
    });

})();