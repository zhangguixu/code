(function(){

    QUnit.module("Cookie", {
        before : function (){
            this.cookie = require("cookie");
        }
    });

    QUnit.test("set/get cookie", function(assert){
        this.cookie.set("name", "value", 10);
        assert.equal("value", this.cookie.get("name"));
    });

    QUnit.test("clear cookie", function(assert){
        this.cookie.clear("name");
        assert.equal("", this.cookie.get("name"));
    });

})();