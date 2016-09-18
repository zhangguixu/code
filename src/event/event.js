define("event", function (require, exports, module){
    
     var cache = {},
        guidCounter = 1;

    function returnTrue () {return true;}
    function returnFalse () {return false;}
    function getExpando() {return "data" + (new Date).getTime();}


    // 修复已有的event对象的属性，使其暴漏与标准一样的API

    function fixEvent(event) {
        if(!event || !event.stopPropagation) { // 判断是否需要修复
            var old = event || window.event; // IE的event从window对象中获取

            event = {}; // 复制原有的event对象的属性

            for(var prop in old) {
                event[prop] = old[prop];
            }

            // 处理target
            if(!event.target) {
                event.target = event.srcElement || document;
            }

            // 处理relatedTarget
            event.relatedTarget = event.fromElement === event.target ? 
                                            event.toElement : 
                                            event.fromElement;
            
            // 处理preventDefault
            event.preventDefault = function () {
                event.returnValue = false;
                // 标识，event对象是否调用了preventDefault函数
                event.isDefaultPrevented = returnTrue; 
            }
            /*
                可以调用event.isDefaultPrevented()来查看是否调用event.preventDefault
            */
            event.isDefaultPrevented = returnFalse; 

            event.stopPropagation = function () {
                event.cancelBubble = true;
                event.isPropagationStopped = returnTrue;
            }

            event.isPropagationStopped = returnFalse;

            // 阻止事件冒泡，并且阻止执行其他的事件处理程序
            // 借助标识位，可以在后面进行handlers队列处理的时候使用
            event.stopImmediatePropagation = function () {
                event.isImmediatePropagationStopped = returnTrue;
                event.stopPropagation();
            }

            event.isImmediatePropagationStopped = returnFalse;

            // 鼠标坐标，返回文档坐标
            if(event.clientX != null){
                var doc = document.documentElement, body = document.body;

                event.pageX = event.clientX +
                    (doc && doc.scrollLeft || body && body.scrollLeft || 0) - 
                    (doc && doc.clientLeft || body && body.clientLeft || 0);
                
                event.pageY = event.clientY +
                    (doc && doc.scrollTop || body && body.scrollTop || 0) -
                    (doc && doc.clientTop || body && body.clientTop || 0);
            }
        
            event.which = event.charCode || event.keyCode;

            // 鼠标点击模式 left -> 0 middle -> 1 right -> 2
            if(event.button != null){
                event.button = (event.button & 1 ? 0 : 
                        (event.button & 4 ? 1 : 
                            (event.button & 2 ? 2 : 0)));
            }
        }
        return event;
    }


    function getData(el) {
        var expando = getExpando();
        var guid = el[expando];
        if(!guid){
            guid = el[expando] = guidCounter++;
            cache[guid] = {};
        }
        return cache[guid];
    }

    function removeData(el) {
        var guid = el[expando];
        if(!guid) return;
        delete cache[guid];
        try {
            delete el.expando;
        } catch(e){
            if(el.removeAttribute){
                el.removeAttribute(expando);
            }
        }
    }

    


});