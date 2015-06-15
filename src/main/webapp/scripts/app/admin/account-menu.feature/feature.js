define(['jquery', 'underscore'], function($, _) {
    return {
        layout: {
            regions: {
                tasks: 'tasks',
                notices: 'notices',
                title: 'title',
                dropdown: 'dropdown'
            }
        },
        views: [{
            name: 'inline:tasks',
            region: 'tasks',
            avoidLoadingHandlers: true,
            model: 'process/process-taskinfo',
            extend: {
                serializeData: function(_super) {
                    var deferred = $.Deferred(),
                        m = this.model,
                        data = _super.apply(this),
                        results = [],
                        taskResults = [],
                        title = '';

                    m.fetch().done(function() {
                        results = m.toJSON().results;

                        $.each(results, function(i, v){
                            if(i < 5){
                                taskResults.push(v);
                            }
                            title = v.title = '关于' + v.processInstance.processDefinition.businessDefinition.businessName + '的' + v.flowStatusDesc + '任务';
                            if (!_.isEmpty(title) && title.length > 15) {
                                v.titleTemp = title.substring(0, 15) + "...";
                            }else{
                                v.titleTemp = title;
                            }
                        });
                        data.tasks = taskResults;
                        data.taskCount = results.length;

                        deferred.resolve(data);
                    });
                    return deferred.promise();
                }
            }
        }, {
            name: 'inline:notices',
            region: 'notices',
            model: 'system/my-notice/user-notice-list',
            events: {
                'click notice-link-*': 'showNotice'
            },
            extend: {
                serializeData: function(_super) {
                    var deferred = $.Deferred(),
                        m = this.model,
                        data = _super.apply(this),
                        results = [],
                        titleTemp,
                        noticeResults = [];

                    m.fetch().done(function() {
                        results = m.toJSON().results;

                        $.each(results, function(i, v){
                            if(i < 5){
                                titleTemp = v.title;
                                if (!_.isEmpty(titleTemp) && titleTemp.length > 15) {
                                    titleTemp = titleTemp.substring(0, 15) + "...";
                                }
                                v.titleTemp = titleTemp;
                                noticeResults.push(v);
                            }
                        });

                        data.notices = noticeResults;
                        data.noticeCount = results.length;
                        deferred.resolve(data);
                    });
                    return deferred.promise();
                }
            }
        }, {
            name: 'inline:title', region: 'title', avoidLoadingHandlers: true
        }, {
            name: 'inline:dropdown', region: 'dropdown', avoidLoadingHandlers: true
        }]
    };
});
