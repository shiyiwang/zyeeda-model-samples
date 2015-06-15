(function() {
    define([
        'jquery',
        'underscore',
        'cdeio/core/util',
    ], function ($, _, util) {
        return {
            exportExcel: function (me){
                var ilterForm,
                    filters = [],
                    orderBy = [],
                    defaultFilters,
                    $ifrm;

                me.feature.request({
                    url: 'configuration/feature',
                    type: 'get'
                }).done(function(featureRes) {
                    if(featureRes.haveFilter === true){
                        filterForm = me.feature.views['form:filter'];
                        filters = filterForm.getFilters();
                    }
                    if ('equipment-ledger' === me.feature.baseName) {
                        if (undefined !== me.feature.defaultFilters) {
                            defaultFilters = me.feature.defaultFilters;
                            filters.push(defaultFilters[0]);
                        }
                    }

                    me.feature.request({
                        url: 'configuration/grid',
                        type: 'get'
                    }).done(function(gridRes) {
                        order = gridRes.defaultOrder;

                        me.feature.request({
                            url: 'export-excel',
                            type: 'get',
                            data: {
                                _filters: filters,
                                _order: order,
                                _pageSize: -1,
                                _first: 0
                            }
                        }).done(function(exportRes){
                            if(exportRes.flag === true){
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
                                $ifrm.attr('src', 'invoke/system/upload/down-export-file/' + encodeURIComponent(exportRes.filename));
                                $(document.body).append($ifrm);

                                // _self: 在报错时整个页面会显示异常信息
                                // _blank: 由于弹出窗口是程序发起, 浏览器会阴止此操作
                                // window.open('invoke/system/upload/down-export-file/' + encodeURIComponent(exportRes.filename),'_self');
                            }else{
                                app.error('导出Excel错误, 请联系系统管理员');
                            }
                        });
                    });
                });
            },
            exportEexcExcel: function (me){
                var  selectedDataId= me.feature.views['grid:body'].components[0].getSelected().id;

                var ilterForm,
                    filters = [],
                    orderBy = [],
                    defaultFilters,
                    $ifrm;

                me.feature.request({
                    url: 'configuration/feature',
                    type: 'get'
                }).done(function(featureRes) {
                    if(featureRes.haveFilter === true){
                        filterForm = me.feature.views['form:filter'];
                        filters = filterForm.getFilters();
                    }

                    me.feature.request({
                        url: 'configuration/grid',
                        type: 'get'
                    }).done(function(gridRes) {
                        order = gridRes.defaultOrder;

                        me.feature.request({
                            url: 'export-excel',
                            type: 'get',
                            data: {
                                _filters: filters,
                                _order: order,
                                _pageSize: -1,
                                _first: 0,
                                selectedDataId: selectedDataId
                            }
                        }).done(function(exportRes){
                            if(exportRes.flag === true){
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
                                $ifrm.attr('src', 'invoke/system/upload/down-export-file/' + encodeURIComponent(exportRes.filename));
                                $(document.body).append($ifrm);
                            }else{
                                app.error('导出Excel错误, 请联系系统管理员');
                            }
                        });
                    });
                });
            },
            exportReportExcel: function (feature){
                var ilterForm,
                    filters = [],
                    orderBy = [],
                    $ifrm;

                feature.request({
                    url: 'configuration/feature',
                    type: 'get'
                }).done(function(featureRes) {
                    if(featureRes.haveFilter === true){
                        filterForm = feature.views['form:filter'];
                        filters = filterForm.getFilters();
                    }

                    feature.request({
                        url: 'configuration/grid',
                        type: 'get'
                    }).done(function(gridRes) {
                        order = gridRes.defaultOrder;

                        feature.request({
                            url: 'export-excel',
                            type: 'get',
                            data: {
                                _filters: filters,
                                _order: order,
                                _pageSize: -1,
                                _first: 0
                            }
                        }).done(function(exportRes){
                            if(exportRes.flag === true){
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
                                $ifrm.attr('src', 'invoke/system/upload/down-export-file/' + encodeURIComponent(exportRes.filename));
                                $(document.body).append($ifrm);

                                // _self: 在报错时整个页面会显示异常信息
                                // _blank: 由于弹出窗口是程序发起, 浏览器会阴止此操作
                                // window.open('invoke/system/upload/down-export-file/' + encodeURIComponent(exportRes.filename),'_self');
                            }else{
                                app.error('导出Excel错误, 请联系系统管理员');
                            }
                        });
                    });
                });
            }
        };
    });
}).call(this);
