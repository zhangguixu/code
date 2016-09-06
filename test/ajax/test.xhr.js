(function(){

    QUnit.module("xhr test", {
        before : function () {
            this.xhr = require("xhr");
            this.info = {
                "name":"zhangguixu",
                "passward":"123"
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

    QUnit.test("get test parameters", function(assert) {
        var done = assert.async();
        var self = this;
        this.xhr.send({
            type : "post",
            url : "/data",
            data : {
                "name" : "zhangguixu",
                "passward" : "123"
            },
            success : function (ret){
                console.log(ret);
                assert.deepEqual(self.info, ret, "返回json数据");
                done();
            }
        });
    });

    // QUnit.module("xhr error test", {
    //     before : function () {
    //         this.xhr = require("xhr");
    //     }
    // });

})();