define("ping", function(require, exports, module){
    
    function send(url) {
        var img = new Image();
        img.onload = img.onerror = function () {}
        img.src = url;
    }
    
    module.exports = {
        send : send
    };

});