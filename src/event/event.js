define("event", function (require, exports, module){
    
     var cache = {},
         elGuid = 1,
         fnGuid = 1;

    // 辅助函数
    function returnTrue () {
        return true;
    }
    function returnFalse () {
        return false;
    }
    function getExpando() {
        return "data" + (new Date).getTime();
    }
    function isEmpty(o) {
        for(var prop in o){
            return false;
        }
        return true;
    }


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
            guid = el[expando] = elGuid++;
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

    function tidyUp(el, type){
        var data = getData(el);

        // 清理el的type事件的回调程序
        if(data.handlers[type].length === 0){
            delete data.hanlders[type];

            if(el.removeEventListener){
                el.removeEventListener(type, data.dispatcher, false);
            } else if (el.detachEvent) {
                el.detach("on" + type, data.dispatcher);
            }
        }

        // 判断是否还有其他类型的事件处理程序
        if(isEmpty(data.handlers)){
            delete data.handlers;
            delete data.dispatcher;
        }

        // 判断是否还需要data
        if(isEmpty(data)){
            removeData(el);
        }
    }


    // 绑定事件
    function addEvent(el, type, fn) {
        var data = getData(el);

        if(!data.handlers)data.handlers = {};

        if(!data.handlers[type])data.handlers[type] = [];

        if(!fn.guid)fn.guid = fnGuid++;

        data.handlers[type].push(fn);

        // 为该元素的事件绑定统一的事件处理程序
        if(!data.dispatcher){
            data.disabled = false;
            data.dispatcher = function (event) {
                if(data.disabled)return;
                event = fixEvent(event);
                var handlers = data.handlers[type];
                if(handlers) {
                    for(var i = 0, len = handlers.length; i < len; i++){
                        handlers[i].call(el, event);
                    }
                }
            };
        }

        if(data.handlers.length == 1){
            if(el.addEventListener){
                el.addEventListener(type, data.dispatcher, false);
            } else if(el.attachEvent){
                el.attachEvent("on" + type, data.dispatcher);
            }
        }
    }

    // 解绑事件
    function removeEvent(el, type, fn){
        var data = getData(el);

        if(!data.handlers)return;

        var removeType = function(t) {
            data.handlers[t] = [];
            tidyUp(el, t);
        };

        // 删除所有的处理程序
        if(!type){
            for(var t in data.handlers){
                removeType(t);
            }
            return;
        }

        var handlers = data.handlers[type];
        if(!handlers)return;

        if(!fn){
            removeType(type);
            return;
        }

        // 删除特定的事件处理程序，这个时候根据guid来进行删除
        // 这里需要考虑的就是可能一个事件处理程序被绑定到一个事件类型多次
        // 因此，这里需要用到handlers.length，删除的时候，需要n--

        if(fn.guid){
            for(var n = 0; n < handlers.length; n++){
                if(handlers[n] === fn.guid){
                    handlers.splice(n--, 1);
                }
            }
        }

        // 返回之前清理资源
        tidyUp(el, type);
    }

    module.exports = {
        getData : getData,
        removeData : removeData,
        fixEvent : fixEvent,
        addEvent : addEvent,
        removeEvent : removeEvent
    };
    
});