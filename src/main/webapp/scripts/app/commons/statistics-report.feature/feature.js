define({
    layout: {
        components: [{
            type: 'layout',
            defaults: {
                spacing_open: 0,
                hideTogglerOnSlide: true
            },
            center: {
                findNestedContent: true
            }
        }],
        regions: {
            statisticsArea: 'statistics-report-area'
        }
    },

    views: [{
        name: 'inline:statistics-report',
        region: 'statisticsArea',
        events: {
            'click *': 'statisticsReport'
        },
        extend: {
            serializeData: function(_super) {
                var deferred = $.Deferred(),
                    data = _super.apply(this),
                    permissions = [],
                    rowList = [], groupList = [], reportList = [],
                    reportName = {
                        'statistics/energy-station-count-info:show': '电能计量点统计',
                        'statistics/energy-collector-small-count-info:show': '电能表、采集器、小主站统计',
                        'statistics/current-voltage-count-info:show': '电流、电压互感器统计',
                        'statistics/energy-collector-comm-time-count-info:show': '电能表、采集器投运时间统计',
                        'statistics/energy-collector-model-count-info:show': '电能表、采集器型号统计',
                        'commons/down-report:show': '电能计量报表（448表）',
                        'statistics/energy-bug-count-info:show': '电能计量器具运行中故障情况统计',
                        'statistics/energy-second-meter-count-info:show': '电能表检定计划完成情况统计',
                        'statistics/voltage-current-meter-count-info:show': '互感器检定计划完成情况统计'},
                    reportImg = {
                        'statistics/energy-station-count-info:show': 'icon-list-alt blue icon-5x',
                        'statistics/energy-collector-small-count-info:show': 'icon-list-alt red icon-5x',
                        'statistics/current-voltage-count-info:show': 'icon-list-alt green icon-5x',
                        'statistics/energy-collector-comm-time-count-info:show': 'icon-list-alt grey icon-5x',
                        'statistics/energy-collector-model-count-info:show': 'icon-list-alt purple icon-5x',
                        'commons/down-report:show': 'upload-icon icon-cloud-download blue icon-5x',
                        'statistics/energy-bug-count-info:show': 'icon-list-alt icon-5x',
                        'statistics/energy-second-meter-count-info:show': 'icon-list-alt orange icon-5x',
                        'statistics/voltage-current-meter-count-info:show': 'icon-list-alt brown icon-5x'},
                    reportPermissions = [
                        'statistics/energy-station-count-info:show',
                        'statistics/energy-collector-small-count-info:show',
                        'statistics/current-voltage-count-info:show',
                        'statistics/energy-collector-comm-time-count-info:show',
                        'statistics/energy-collector-model-count-info:show',
                        'statistics/energy-bug-count-info:show',
                        'statistics/energy-second-meter-count-info:show',
                        'statistics/voltage-current-meter-count-info:show',
                        'commons/down-report:show'];

                $.ajax({
                    type: 'get',
                    url: 'invoke/scaffold/system/accounts/userpermissions',
                    data: {},
                    cache: false,
                    async: false
                }).done(function ( results ) {
                    permissions = results;
                });

                $.each(reportPermissions, function (i, v){

                    $.each(permissions, function (j, permission){
                        if (permission === v) {
                            var report = {};
                            report.index = i + 1;
                            report.img = reportImg[v];
                            report.reportName = reportName[v];
                            report.reportPermission = v;

                            groupList.push(report);
                        }
                    });

                    if (i === reportPermissions.length - 1) {
                        rowList.push({groupList: groupList});
                    } else if (groupList.length === 4) {
                        rowList.push({groupList: groupList});
                        groupList = [];
                    }
                });

                data.rowList = rowList;
                deferred.resolve(data);

                return deferred.promise();
            }
        }
    }]
});
