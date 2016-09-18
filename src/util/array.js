define("array", function(require, exports, module){
    
    // 在sizzlejs中使用了这个实现，根据jsperf的测试性能，比原生的实现性能好一点
    function indexOf(arr, elem){
        var i = 0, 
            len = arr.length;
        for(; i < len; i++){
            if(arr[i] === elem)return i;
        }
        return -1;
    }

    // 有多种实现方式，这里使用的据说是性能最好的，还未进行测试
    function unique(arr){
        var len = arr.length,
            el;

        while(len--){
            el = arr.shift();
            if(indexOf(arr, el) < 0){
                arr.push(el);
            }
        }

        return arr;
    }

    module.exports = {
        indexOf : indexOf,
        unique : unique
    };
    
});