define("fn", function(require, exports, module){

    // 函数节流，控制函数的执行频率
    // http://www.alloyteam.com/2012/11/javascript-throttle
    /*
        @Param fn 函数
        @Param delay 执行的时间间隔
        @Param mustRundelay 必须执行的时间间隔
     */
    function throttle(fn, delay, mustRunDelay){
        var timer = null;
        var t_start;
        return function () {
            var self = this,
                args = arguments,
                t_curr = Date.now();
            
            // 先清理定时器
            if(timer) {clearTimeout(timer);}
            
            // 判断时间间隔
            if(!t_start){
                t_start = t_cur;
            }

            if(t_curr - t_start >= mustRunDelay){
                fn.apply(self, args);
                t_start = t_curr;
            } else {
                timer = setTimeout(function () {
                   fn.apply(self, args); 
                }, delay);
            }
        };
    }

    // 绑定作用域和函数柯里化，es5中bind的原生实现 
    function bind(fn, scope){
        var args = Array.prototype.slice.call(arguments, 1);
        return function (){
            var innerArgs = Array.prototype.slice.call(arguments);
            var finalArgs = args.concat(innerArgs);
            fn.apply(scope, finalArgs);
        };
    }

    // 柯里化，创建已经设置了一个或多个参数的函数
    function curry(fn){
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            var innerArgs = Array.prototype.slice.call(arguments);
            var finalArgs = args.concat(innerArgs);
            return fn.apply(null, finalArgs);
        };
    }


    module.exports = {
        throttle : throttle,
        curry : curry,
        bind : bind
    };

});