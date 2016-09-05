define("hello", function(require, exports, module) {

    function hello() {
        return "hello world";
    }

    module.exports = {
        hello : hello
    };
});