define({
    layout: {
        regions: {
            laboratoryExecViewRegion: 'laboratoryExecViewRegion'
        }
    },

    views: [{
        name: 'inline:laboratory-exec-view',
        region: 'laboratoryExecViewRegion',
        events: {
            'click download-*': 'download',
            'click delete-*': 'delete'
        },
        extend: {
            serializeData: function(_super) {
                var deferred = $.Deferred(),
                    data = _super.apply(this),
                    downloadModuleS = [], noDownloadModule;

                //查找所有的检定模板
                $.ajax({
                    url: 'invoke/common-routers/get-download-module',
                    type: 'get',
                    async: false
                }).done(function (data){
                    _.each(data.results, function (element, index, list){
                        var downloadModule = {};
                        downloadModule.index = index + 1;
                        downloadModule.fileName = element;
                        downloadModuleS.push(downloadModule);
                    });
                });

                if (_.size(downloadModuleS) === 0) {
                    noDownloadModule = '没有相关检定模板，请上传检定模板！';
                }
                data.downloadModuleS = downloadModuleS;
                data.noDownloadModule = noDownloadModule;
                deferred.resolve(data);

                return deferred.promise();
            }
        }
    }]
});
