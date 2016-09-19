(function (){

    QUnit.module("event", {
        before : function () {
            this.event = require("event");
             this.el = document.getElementById("qunit");
        }
    });

    QUnit.test("getData/removeData", function(assert){
        assert.expect(2);

        this.event.getData(this.el).title = "hello world";
        
        var data = this.event.getData(this.el);
        assert.equal("hello world", data.title, "关联元素和对象");

        this.event.removeData(this.el);
        data = this.event.getData(this.el);
        assert.notOk(data.title, "重新获取新的对象");
    });

    QUnit.test("fixEvent", function(assert) {
        assert.expect(2);

        var done = assert.async();
        var event = this.event;
        this.el.onclick = function(e){
            e = event.fixEvent(e);
            assert.equal("function", typeof e.preventDefault, "阻止默认行为函数");
            assert.ok(e.target, "获取目标元素");
            done();
        };
    });

})();