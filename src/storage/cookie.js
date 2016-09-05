define("cookie", function(require, exports, module){
    
    function set(name, value, expiresdays, domain, path) {
        if(!name)return;
        name = encodeURIComponent(name);
        value = value ? encodeURIComponent(value) : "";
        
        expiresdays = expiresdays || 30;

        var now = new Date();
        now.setDate(now.getDate() + expiresdays);

        var cookie = name + "=" + value + ";expires=" + now.toUTCString() + ";";

        if(domain){
            cookie += "domain=" + domain + ";";
        }

        if(path){
            cookie += "path" + path + ";";
        }

        document.cookie = cookie;
    }

    function get(name){
        var match = document.cookie.match(new RegExp("(?:^|;)\\s*" + name + "=([^;]*)"));
        return (match ? match[1] : ""); 
    }

    function clear(name){
        set(name, "", -1);
    }

    module.exports = {
        set : set,
        get : get,
        clear : clear
    };

});