var {mark}          = require('cdeio/mark');
var {json}          = require('cdeio/response');
var {createRouter}  = require('cdeio/router');
var _               = require('underscore');
var {createService} = require('system/my-notice.feature/service');
var {SecurityUtils} = org.apache.shiro;
var router = exports.router = createRouter();


exports.service = function(service){
    return _.extend(service, createService());
};

exports.entityLabel = '我的通知';

exports.enableFrontendExtension = true;

exports.haveFilter = true;

exports.labels = {
    title: '标题',
    content: '内容',
    issueTime: '发布时间',
    sign: '是否查阅',
    attachment: '附件',
    issueAccount: '发布人',
    'issueAccount.realName': '发布人'
};

exports.filters = {
    defaults: {
        '!myNoticeFilter': [''],
        '!accountFilter': ['department', 'roles', 'password', 'password2'],
        '!attachmentFilter': ['']
    },
    list: {
        'myNoticeFilter': ['id', 'title', 'sign', 'issueTime', 'issueAccount'],
        'accountFilter': ['realName']
    }
};

exports.grid = {
    numberColumn: true,
    columns: [
        {name: 'title'},
        {name: 'issueAccount.realName', header: '发布人', width: 140},
        {name: 'issueTime', width: 130},
        {name: 'sign', defaultContent: '', renderer: 'modifySign', width: 70}
    ],
    defaultOrder: 'createdTime-desc'
};

exports.fieldGroups = {
    defaults: [
        'title', 'issueTime', 'issueAccount.realName',
        {name: 'attachment', type: 'file-picker', url: 'invoke/system/upload', acceptFileTypes: "(\\.|\\/)(swf|mp4|avi|wmv|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|pdf|txt|jpg|jpeg|png|gif)$"},
        {name: 'content', type: 'textarea', colspan: 2}
    ],
    filter: [
        {name: 'title'},
        {name: 'issueTime', type: 'date-range'},
        {name: 'issueAccount.realName'},
        {name: 'sign', type: 'dropdown',
            source: [
                {id: true, text: '是'},
                {id: false, text: '否'}
            ]
        }
    ]
};

exports.forms = {
    defaults: {
        size: 'large',
        groups: [
            {name: 'defaults',columns: 2}
        ]
    },
    filter: {
        groups: [{
            name: 'filter',
            columns: 4
        }]
    }
};

exports.doWithRouter = function (router) {
    //取得所有未查看的通知
    router.get('/user-notice-list', mark('services', 'system/my-notice').on(function (myNoticeSvc, request) {
        var result = {};

        result.results = myNoticeSvc.getUserNoticelist();
        return json(result, exports.filters.defaults);
    }));
    router.put('/update-sign', mark('services', 'system/my-notice').on(function (myNoticeSvc, request) {
        var options = request.params;
        //更新是否已查看
        myNoticeSvc.updateSignById(options.id);
        return json({flag: true});
    }));
};


