define("jsonp", function(require, exports, module){
    var id = 0,
        container = document.getElementsByTagName("head")[0];
    
    /*
        {
            url : 请求地址
            data : 请求的数据
            success : 成功返回的回调
            error : 错误返回的回调
        }
    */
    function send(params) {
        if(!params || !params.url){
            throw new Error("invalid parameters");
        }

        var scriptNode = document.createElement("script"),
            data = params.data || {},
            url = params.url,
            success = params.success || function(){},
            error = params.error || function(){},
            fnName = "jsonp" + (id++);
        
        // 添加回调
        data.callback = fnName;

        var p = [];
        for(var key in data){
            p.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }

        url = url.indexOf("?") > 0 ? url : (url + "?");
        url += p.join("&");

        // 将回调函数暴漏为全局方法，这样才可以执行
        window[fnName] = function(ret) {
            try{
                ret = typeof JSON.parse == "function" ? JSON.parse(ret) : ret;
            }catch(_){}
            success(ret);
            container.removeChild(scriptNode);
            scriptNode = null;
            delete window[fnName];
        };

        scriptNode.onerror = function() {
            error({msg:"error"});
            container.removeChild(scriptNode);
            scriptNode = null;
        };
        
        scriptNode.src = url;
        scriptNode.type = "text/javascript";
        container.appendChild(scriptNode);
    }

    module.exports = {
        send : send
    };
});