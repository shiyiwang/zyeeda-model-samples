define({
    download: function(e) {
        var fileName = $(e.currentTarget).attr('name');

        $ifrm = $('<iframe></iframe>');
        $ifrm.css({
            width: '0px',
            height: '0px',
            display: 'none'
        });
        $ifrm.attr('onload', function(){
            setTimeout(function(){
                $ifrm.remove();
            }, 1000);
        });
        $ifrm.attr('src', 'invoke/system/upload/down-module-laboratory-exec/' + encodeURIComponent(fileName));
        $(document.body).append($ifrm);
    },
    delete: function(e) {
        var id = $(e.currentTarget).parents('tr').attr('class'),
            fileName = $(e.currentTarget).attr('name');

        app.confirm('确定要删除' + fileName + '文件?', function(confirmed) {
            if (confirmed) {
                $.ajax({
                    url: 'invoke/common-routers/delete-download-module-by-file-name',
                    type: 'get',
                    data: {fileName: fileName},
                    async: false
                }).done(function (data){
                    $("." + id).remove();
                    app.success(fileName + '文件删除成功');
                });
                return true;
            }
            return;
        });
    }
});
