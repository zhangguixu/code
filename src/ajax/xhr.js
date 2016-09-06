define("xhr", function(require, exports, module){
    function get(url){
        var xhr = new XMLHttpRequest();
        xhr.open("get",url);
        xhr.onreadystatechange = function (){
            if(xhr.readyState == 4 && xhr.status == 200){
                console.log(xhr.responseText);
            }
        }
    
    }
});