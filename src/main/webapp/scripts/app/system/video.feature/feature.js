define({
    layout: {
        regions: {
            types: 'types',
            content: 'content'
        }
    },

    views: [{
        name: 'inline:types', region: 'types', extend: {
            serializeData: function(su) {
                data = su.apply(this);
                data.types = [
                    // {text: 'Type A', name: 'a'},
                    // {text: 'Type B', name: 'b'},
                    // {text: 'Type C', name: 'c'}
                ];
                return data;
            }
        }, events: {
            'click type-*': 'showType'
        }
    },{
        name: 'inline:content',
        region: 'content',
        avoidLoadingHandlers: true,
        extend: {
            serializeData: function(su) {
                var initVideos,
                    employeeNotSeeVideos,
                    videos = [],
                    roles,
                    roleKey,
                    data = su.apply(this);

                //发送请求查询用户角色
                $.ajax({
                    type: 'get',
                    url: 'invoke/scaffold/system/accounts/roles',
                    cache: false,
                    async: false,
                    data: {}
                }).done(function ( result ) {
                    roles = result;
                });

                $.each(roles, function(i, v){
                    if('工作班成员' === v.name){
                        roleKey = 'employee';
                        return true;
                    }else if('工作负责人' === v.name || '专责监护人' === v.name || '工作票签发人'  === v.name || '系统管理员'  === v.name){
                        roleKey = 'manager';
                        return false;
                    }
                });

                //demo ext support flv/swf/mp4
                //注：mp4只支持AVC格式的视频编码
                //{title: 'thedawn', name: 'thedawn', type: 'a', ext: 'swf'},

                initVideos = [
                    {title: '提交单位、人员安全资质', name: '0-1', ext: 'swf'},
                    {title: '现场工作准备', name: '0-2', ext: 'swf'},
                    {title: '工作票办理', name: '0-3', ext: 'swf'},
                    {title: '工作结束要求', name: '0-4', ext: 'swf'},
                    {title: '开工作业前，必须开具工作票', name: '1', ext: 'swf'},
                    {title: '核对编号后，方可工作', name: '2', ext: 'swf'},
                    {title: '开工前，应召开班前会', name: '3', ext: 'swf'},
                    {title: '开工作业前，必须完成安全措施布置', name: '4', ext: 'swf'},
                    // {title: '按规定和顺序装设接地线', name: '5', ext: 'swf'},
                    {title: '专职监护人必须认真履行监护职责', name: '6', ext: 'swf'},
                    {title: '作业现场必须按要求设置围栏或警戒线，悬挂警示牌', name: '7', ext: 'swf'},
                    // {title: '严禁擅自进行解闭锁操作', name: '8', ext: 'swf'},
                    {title: '作业人员严禁擅自改变作业范围和安全措施', name: '9', ext: 'swf'},
                    {title: '全体成员撤离后，再办理工作票终结手续', name: '10', ext: 'swf'},
                    {title: '持证上岗', name: '11', ext: 'swf'},
                    {title: '严禁高空抛掷物品', name: '12', ext: 'swf'},
                    {title: '高空作业必须带好个人安全防护用品，穿戴符合规定', name: '13', ext: 'swf'},
                    {title: '正确佩戴安全合格的安全帽', name: '14', ext: 'swf'},
                    {title: '在梯子上高空作业', name: '15', ext: 'swf'},
                    {title: '动火作业', name: '16', ext: 'swf'},
                    // {title: '起重设备', name: '17', ext: 'swf'},
                    {title: '在风洞、电缆沟盖板处工作', name: '18', ext: 'swf'},
                    // {title: '按规定使用合格的安全工器具', name: '19', ext: 'swf'},
                    {title: '按规定搬运和使用梯子及长管等长物', name: '20', ext: 'swf'},
                    // {title: '高压试验', name: '21', ext: 'swf'},
                    {title: '严禁酒后作业', name: '22', ext: 'swf'},
                    // {title: '按照标识驾驶机动车辆', name: '23', ext: 'swf'},
                    {title: '严禁私拉乱接电源', name: '24', ext: 'swf'},
                    // {title: '进入工作现场，必须正确着装', name: '25', ext: 'swf'}
                ];

                //工作班成员不能看的视频
                employeeNotSeeVideos = [
                    '0-1', '0-2', '0-3', '0-4', '1', '10'
                ];

                $.each(initVideos, function(i, v){
                    if('employee' === roleKey){
                        if($.inArray(v.name, employeeNotSeeVideos) === -1){
                            videos.push(v);
                        }
                    }else if('manager' === roleKey){
                        videos.push(v);
                    }
                });

                data.videos = videos;
                return data;
            },
            afterRender: function(su) {
                var ctn = this.$('isotope');
                this.isotope = ctn.isotope({
                    itemSelector: '.video-item',
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
                this.$$('.video-popup').colorbox({iframe: true, width: 800, height: 500});
                return su.apply(this);
            }
        }
    }]
});
