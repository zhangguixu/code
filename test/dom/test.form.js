(function (){

    QUnit.module("form test", {
        before : function () {
            // 创建表单元素
            var div = document.createElement("div");
            div.id = "form";
            div.innerHTML = "<form>" + 
                            "<input type='text' name='username' value='zhangguixu'>" + 
                            "<input type='checkbox' name='isCaibi' value='true' checked>" +
                            "<input type='radio' name='gender' value='female'>" +
                            "<input type='radio' name='gender' value='male' checked>" +
                            "<select name='school'>" +
                                "<option value='scut'>华工</option>" +
                                "<option selected>cs</option>" +
                            "</select>" +
                            "<input type='submit' value='提交'>" +
                            "<input type='reset' value='重置'>" +
                            "</form>";
            document.body.appendChild(div);
            this.div = div;
            this.form = require("form");
            this.result = "username=zhangguixu&isCaibi=true&gender=male&school=cs";
        },
        after : function (){
            // 移除表单元素
            document.body.removeChild(document.getElementById("form"));
            this.div = null;
        }
    });

    QUnit.test("serialize test", function(assert){
        var result = this.form.serialize(this.div.firstChild);
        assert.equal(this.result, result, "表单序列化");
    });

})();