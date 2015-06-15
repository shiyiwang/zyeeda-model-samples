define(['jquery'], function($){
	return {
        //dialogType:add/edit/show,v:the current view,data:this dialog's data
        afterShowDialog: function(dialogType, v, data){
            // 打开form页面时，页面第一个可输入元素获提焦点
            if('show' !== dialogType){
                $('input[name]')[0].focus();
            }
        }
    };
});