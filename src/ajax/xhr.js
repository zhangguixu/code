define("xhr", function(require, exports, module){
    
    var _createXhr = function () {
        var xhr, curVersion;

        if(window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
            _createXhr = function () {
                return new XMLHttpRequest();
            };
        } else if(window.ActiveXObject) {
            var versions = [ "MSXML2.XMLHTTP", "MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0"];
            for(var i = 0, len = versions.length; i < len; i++){
                try{
                    xhr = new ActiveXObject(versions[i]);
                    if(xhr){
                        curVersion = versions[i];
                        break;
                    }
                }catch(_){}
            }
            _createXhr = function () {
                return new ActiveXObject(curVersion);
            };       
        }
        if(!xhr){
            throw new Error("fail to create XHR");
        }
        return xhr;
    };

    function _serialize(data) {
        if(typeof data == "object"){
            var p = [];
            for(var key in data){
                p.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
            return p.join("&");
        } else if (typeof data == "string") {
            return encodeURIComponent(data);
        } else {
            throw new Error("invalid parameters");
        }
    } 

    function _get(params, xhr) {
        var url = params.url;
        if(params.data) {
            url = url.indexOf("?") > 0 ? url : (url + "?");
            url += _serialize(params.data);
        }
        xhr.open("get", url);
        xhr.send(null);
    }

    function _post(params, xhr) {
        var url = params.url, data;
        if(params.data) {
            data = _serialize(params.data);
        }

        xhr.open("post", url);
        xhr.setRequestHeader("Content-Type", params.contentType || "application/x-www-form-urlencoded");
        xhr.send(data);
    }

    /*
        {
            url : 请求地址
            type : 请求方法
            data : 数据，可以是Object或string
            contentType : 请求类型，默认为表单的请求类型
            timeout : 超时的时长，毫秒ms
            success : 成功的回调
            error ： 出错、超时的回调
        }
    */
    function send (params) {
        if(!params.url) {
            throw new Error("invalid parameters, no url!");
        }

        var type = params.type || "GET";
        var timeout = params.timeout || 60000;
        var success = params.success || function(){};
        var error = params.error || function () {};

        var xhr = _createXhr();

        // 超时处理
        if("timeout" in xhr) {
            xhr.timeout  = timeout;
            xhr.ontimeout = function () {
                error({msg : "timeout"});
            };
        } else {
            var timer = setTimeout(function () {
                xhr.abort();
                error({msg : "timeout"});
            }, timeout);
        }

        // 请求错误
        xhr.onerror = function() {
            if(timer)clearTimeout(timer); // 在进行压缩的时候，会变成 timer && clearTimeout(timer)的形式
            error({msg : "request error"});
        };

        // 正常返回
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                if(timer)clearTimeout(timer);
                var ret = xhr.responseText;
                try{
                    ret = typeof JSON.parse == "function" ? JSON.parse(ret) : ret;
                }catch(_){}
                success(ret);
            }
        };

        // 开启跨域
        if("withCredential" in xhr){
            xhr.withCredential = true;
        }

        // 处理参数
        type = type.toUpperCase();

        switch(type) {
            case "GET" : 
                _get(params, xhr);
                break;
            case "POST" :
                _post(params, xhr);
        }
    }

    module.exports = {
        send : send
    };
});