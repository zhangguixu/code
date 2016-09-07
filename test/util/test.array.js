(function (){

    QUnit.module("array function test", {
        beforeEach : function () {
            this.arr = [1,2,2,5,5,5,5,7,3,3,5];
            this.array = require("array");
        }
    });

    QUnit.test("array indexOf test", function(assert) {
        assert.expect(3);

        assert.equal(7, this.array.indexOf(this.arr, 7), "查找元素，返回对应的下标7");
        assert.equal(0, this.array.indexOf(this.arr, 1), "查找元素，返回对应的下标0");
        assert.equal(-1, this.array.indexOf(this.arr, 8), "查找元素，返回对应的下标-1");
    });

    QUnit.test("array unique test", function (assert) {
        assert.deepEqual([1,2,7,3,5], this.array.unique(this.arr), "数组去重");
    });

})();