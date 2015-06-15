(function() {
    define([
        'jquery',
        'underscore',
        'cdeio/core/util',
    ], function($, _, util) {
        return {
            downloadImportTemplate: function(me){
                var getFileDirectoryByFilePath, getFileNameByFilePath;

                getFileDirectoryByFilePath = function(filePath) {
                    return filePath.substring(0, filePath.lastIndexOf('/'));
                };
                getFileNameByFilePath = function(filePath) {
                    return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
                };

                return me.feature.request({
                    url: 'configuration/importsettings',
                    type: 'get'
                }).done(function(result) {
                    var $ifrm;

                    if(result.enable === false){
                        app.error('导入服务不可用，请联系系统管理员');
                        return false;
                    }else if(result.templateExists === false){
                        app.error('模板文件不存在，请联系系统管理员');
                        return false;
                    }

                    $ifrm = $('<iframe></iframe>');
                    $ifrm.css({
                        width: '0px',
                        height: '0px',
                        display: 'none'
                    });
                    $ifrm.attr('onload', function() {
                        return setTimeout(function() {
                            return $ifrm.remove();
                        }, 1000);
                    });
                    $ifrm.attr('src', 'invoke/scaffold/' + me.feature.module.paths.join("/").replace("app/", "") + '/' + me.feature.baseName + '/down-import-template/' + encodeURIComponent(getFileNameByFilePath(result.filename)));
                    return $(document.body).append($ifrm);
                });
            },
            importXls: function(me){
                var commonImportFeature, importView;

                commonImportFeature = app.loadFeature('commons/import-excel', {container: '<div></div>', ignoreExists: true});
                commonImportFeature.done(function(feature) {
                    importView = feature.views['common-import-view'];
                    app.showDialog({
                        view: importView,
                        title: '导入 Excel',
                        onClose: function() {
                            feature.stop();
                        },
                        buttons: [{
                            label: '确定',
                            status: 'btn-primary',
                            fn: function() {
                                data = importView.getFormData();

                                if(!data.attachment){
                                    app.error('请选择要导入的 excel 文件, 注意: 支持的文件格式为 xls');
                                    return false;
                                }

                                if(importView.isValid()){
                                    me.feature.request({
                                        url: 'import-excel',
                                        type: 'post',
                                        data: {attachment: data.attachment}
                                    }).done(function(result){
                                        if(result.repeatRowNum > 0 || result.failRowIdxes.length > 0){
                                            message += '共有 ' + (Number(result.repeatRowNum) + Number(result.failRowIdxes.length)) +' 行数据导入失败';

                                            if(result.repeatRowIdxes.length > 0){
                                                message += ',第' + result.repeatRowIdxes.join(',') + '行数据重复';
                                            }
                                            if(result.failRowIdxes.length > 0){
                                                message += ',第' + result.failRowIdxes.join(',') + '行数据验证失败';
                                            }
                                        }else{
                                            message += '共有 ' + result.successNum + ' 行数据导入成功';
                                            checkFlag = true;
                                        }

                                        if(checkFlag === true){
                                            app.success(message);
                                            grid.refresh();
                                        }else{
                                            app.error(message);
                                        }
                                    });
                                }
                            }
                        }]
                    });
                });
            }
        };
    });
}).call(this);
