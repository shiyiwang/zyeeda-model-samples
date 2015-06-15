var {mark}          = require('cdeio/mark');
var {json}          = require('cdeio/response');
var {createRouter}  = require('cdeio/router');
var _               = require('underscore');
var {createService} = require('system/notice.feature/service');

var router = exports.router = createRouter();

var {HashSet}       = java.util;

var {SecurityUtils} = org.apache.shiro;

exports.service = function(service){
    return _.extend(service, createService());
};

exports.entityLabel = '通知';

exports.enableFrontendExtension = true;

exports.haveFilter = true;

exports.labels = {
    title: '标题',
    content: '内容',
    createTime: '创建日期',
    issueTime: '发布日期',
    attachment: '附件',
    status: '状态',//（1初始/2发布/3关闭）
    creatorName: '发起人',
    departments: '接收部门',
    roles: '接收角色',
    'account.realName': '接收人',
    'issueAccount.realName': '发布人'
};

exports.filters = {
    defaults: {
        '!systemNoticeFilter': [''],
        '!accountFilter': ['department', 'roles', 'password', 'password2'],
        '!departmentFilter': ['children', 'parent(1)'],
        '!roleFilter': ['permissions'],
        '!attachmentFilter': ['']
    },
    list: {
        'systemNoticeFilter': ['id', 'title', 'content', 'issueAccount', 'issueTime', 'status'],
        'accountFilter': ['realName']
    }
};

exports.style = 'grid';

exports.grid = {
    numberColumn: true,
    columns: [
        {name: 'title', width: 250},
        'content',
        {name: 'issueAccount.realName', header: '发布人', defaultContent: '', width: 120},
        {name: 'issueTime', width: 120},
        {name: 'status', defaultContent: '', renderer: 'modifyStatus', width: 60}
    ],
    defaultOrder: 'createdTime-desc'
};

exports.fieldGroups = {
    defaults: [
        {name: 'title'},
        {name: 'createTime'},
        {name: 'content', type: 'textarea', colspan: 2},
        {name: 'creatorName'},
        {name: 'attachment', type: 'file-picker', url: 'invoke/system/upload', acceptFileTypes: "(\\.|\\/)(swf|mp4|avi|wmv|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|pdf|txt|jpg|jpeg|png|gif)$"}/*,
        {name: 'status', type: 'dropdown', defaultValue: '1',
            source: [
                {id: '1', text: '初始'},
                {id: '2', text: '发布'},
                {id: '3', text: '关闭'}
            ]
        }*/
    ],
    inlineAccountstGrid: [
        {label: '接收用户', type: 'inline-grid', name: 'accounts', multiple: true, crossPage: true, allowPick: true, allowAdd: false, colspan: 2}
    ],
    inlineDepartmenstGrid: [
        {label: '接收部门', type: 'inline-grid', name: 'departments', multiple: true, allowPick: true, allowAdd: false, colspan: 2}
    ],
    inlineRolesGrid: [
        {label: '接收角色', type: 'inline-grid', name: 'roles', multiple: true, crossPage: true, allowPick: true, allowAdd: false, colspan: 2}
    ],
    filter: [
        {name: 'title'},
        {name: 'content'},
        {name: 'issueAccount.realName'},
        {name: 'issueTime', type: 'date-range'},
        {name: 'status', type: 'dropdown',
            source: [
                {id: '1', text: '初始'},
                {id: '2', text: '发布'}/*,
                {id: '3', text: '关闭'}*/
            ]
        }
    ]
};

exports.forms = {
    defaults: {
        size: 'large',
        groups: [
            {name: 'defaults', columns: 2 },
            'inlineAccountstGrid', 'inlineRolesGrid', 'inlineDepartmenstGrid'
        ]
    },
    filter: {
        groups: [
            {name: 'filter', columns: 4}
        ]
    }
};

exports.operators = {
    issue: {label: '发布', style: 'btn-pink', icon: 'icon-share-alt', group: '20-selected', order: 310}/*,
    revert: {label: '撤销', style: 'btn-warning', icon: 'icon-undo', group: '20-selected', order: 320},
    close: {label: '关闭', style: 'btn-danger', icon: 'icon-ban-circle', group: '20-selected', order: 330}*/
};

exports.hooks = {
    beforeCreate: {
        defaults: mark('services', 'system/notice', 'system/accounts').on(function (sysNoticeSvc, accountSvc, notice) {
            var subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal(),
                account,
                ref;

            notice.creator = user.id;
            notice.createdTime = new Date();
            notice.lastModifiedTime = new Date();
            notice.sign = false;
            notice.status = '1';

            account = accountSvc.getById(user.id);
            notice.createDeptPath = ((ref = user.department) != null ? ref.path : void 0) || '';
        })
    },

    //编辑数据之前执行函数
    beforeUpdate: {
        defaults: function (notice){
            var subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal();

            notice.lastModifier = user.accountName;
            notice.lastModifierName = user.realName;
            notice.lastModifiedTime = new Date();
        }
    }
};

exports.doWithRouter = function (router) {
    //取默认数据  当前用户与时间
    router.get('/get-default-data', mark('services', 'system/notice').on(function (sysNoticeSvc) {
        var result = {},
            subject = SecurityUtils.getSubject(),
            user = subject.getPrincipal();

        result.creatorName = user.realName;
        result.createTime = sysNoticeSvc.getNowDateFun();

        return json(result);
    }));

    router.post('/update-notice-statu-by-id', mark('services', 'system/notice', 'system/my-notice').on(function (sysNoticeSvc, myNoticeSvc, request) {
        var result = {},
            id = request.params.id,
            params = request.params,
            notice, accounts = new HashSet();

        notice = sysNoticeSvc.updateNoticeParamsById(id, params);
        // 状态（1初始/2发布/3关闭）
        if ('2' === notice.status) {
            if (0 !== notice.accounts.size()) {
                for (var i = 0; i < notice.accounts.size(); i++) {
                    accounts.add(notice.accounts.get(i));
                }
            }
            if (0 !== notice.departments.size()) {
                for (var m = 0; m < notice.departments.size(); m++) {
                    var department = notice.departments.get(m);
                    if (0 !== department.accounts.size()) {
                        for (var j = 0; j < department.accounts.size(); j++) {
                            accounts.add(department.accounts.get(j));
                        }
                    }
                }
            }
            if (0 !== notice.roles.size()) {
                for (var n = 0; n < notice.roles.size(); n++) {
                    var role = notice.roles.get(n);
                    if (0 !== role.accounts.size()) {
                        for (var k = 0; k < role.accounts.size(); k++) {
                            accounts.add(role.accounts.get(k));
                        }
                    }
                }
            }
            myNoticeSvc.addMyNotice(notice, accounts);
        }
        result.notice = notice;
        return json(result, exports.filters.defaults);
    }));

    router.get('/user-notice-list', mark('services', 'system/notice').on(function (sysNoticeSvc, request) {
        var result = {};

        result.results = sysNoticeSvc.getUserNoticelist();
        return json(result, exports.filters.defaults);
    }));
};
