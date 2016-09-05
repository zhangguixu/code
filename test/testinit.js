/* ---目标文件--- */
var result = require("hello").hello();

QUnit.test("hello", function(assert) {
    assert.equal("hello world", result);
});