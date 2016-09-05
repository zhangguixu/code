/* ---目标文件--- */
(function (global){

    var modules = {};

    global.define = function(id, factory){
        if(!modules[id]){
            modules[id] = {
                id : id,
                factory : factory
            };
        }
    };

    global.require = function(id){
        var m = modules[id];

        if(!m){
            throw new Error("fail to find module!");
        }

        if(!m.exports){
            m.exports = {};
            m.factory.call(m.exports, require, m.exports, m);
        }
        return m.exports;
    };

})(this);
define("hello", function(require, exports, module) {

    function hello() {
        return "hello world";
    }

    module.exports = {
        hello : hello
    };
});