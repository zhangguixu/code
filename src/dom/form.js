define("form", function(require, exports, module){
    
    function isTypeSupported(type) {
        var input = document.createElement("input");
        try { // IE8下会报错，保护性代码
            input.type = type; 
        }catch(_){}

        return (input.type == type); 
    }

    function serialize(form) {

        if(!form || form.nodeName.toUpperCase() != "FORM"){
            throw new Error("invalid parameter");
        }

        var encode = encodeURIComponent,
            slice = Array.prototype.slice,
            params = [],
            fields = slice.call(form.elements),
            len = fields.length,
            i = 0,
            el,
            type;

        var j, opts, oLen, selected, opt;
           
        for(; i < len; i++){
            el = fields[i];
            type = el.type.toLowerCase();
            switch(type){
                case "undefined":
                case "button":
                case "reset":
                case "submit":
                case "file":
                    break;
                case "select-one":
                case "select-multiple":
                    if(el.name.length){
                        opts = slice.call(el.options);
                        oLen = opts.length;
                        selected = [];

                        for(j = 0; j < oLen; j++){
                            opt = opts[j];
                            if(!opt.selected)continue;
                            selected.push(encode(opt.value)); // <option>如果没有value属性，则会取得元素内的文本
                        }
                        params.push(encode(el.name) + "=" + selected.join(","));
                    }
                    break;
                case "checkbox":
                case "radio":
                    if(!el.checked)break; /** 添加下面的注释，才能通过jshint */
                    /* falls through */
                default :
                    if(el.name.length) {
                        params.push(encode(el.name) + "=" + encode(el.value));
                    } 
            }
        }

        return params.join("&");
    }

    module.exports = {
        isTypeSupported : isTypeSupported,
        serialize : serialize
    };

});