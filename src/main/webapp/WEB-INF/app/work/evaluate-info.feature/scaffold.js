var {mark}              = require('cdeio/mark');
var _                   = require('underscore');
var {json, error, html} = require('cdeio/response');
var {createService}     = require('work/evaluate-info.feature/service');

var {SecurityUtils} = org.apache.shiro;

exports.service = function(service){
    return _.extend(service, createService());
};

exports.entityLabel = '评估信息';

exports.enableFrontendExtension = true;

exports.labels = {
    account: '评估人',
    accountName: '评估人',
    workPackage: '工作包',
    expectTime: '估算完成时间',
    workload: '估算工作量（人天）',
    workPrice: '估算价值',
    'workPackage.code': '工作包编号',
    'workPackage.name': '工作包名称'
};

exports.style = 'grid';

exports.grid = {
    columns: [
        {name: 'workPackage.code', header: '工作包编号', defaultContent: '',width: 120},
        {name: 'workPackage.name', header: '工作包名称', defaultContent: '', width: 80},
        {name: 'expectTime', defaultContent: '', width: 100},
        {name: 'workload', defaultContent: '', width: 100}
    ],
    defaultOrder: 'createdTime-desc'
};

exports.filters = {
    defaults: {
        '!evaluateInfoFilter': 'account',
        '!workPackageFilter': ['evaluateInfos', 'todoInfos'],
        '!workListFilter': 'evaluateInfo'
    },
    list: {
        '!evaluateInfoFilter': 'account',
        '!workPackageFilter': ['evaluateInfos', 'todoInfos'],
        '!workListFilter': 'evaluateInfo'
    }
};

exports.fieldGroups = {
    defaults: [
        'expectTime', 'workload', 'workPrice'
    ]
    // inlineWorkListGrid: [{
    //     label: '活动清单',
    //     type: 'inline-grid',
    //     name: 'workLists',
    //     allowAdd: true,
    //     allowEdit: true,
    //     multiple: false,
    //     allowPick: false
    // }]
};

exports.forms = {
    defaults: {
        groups: [
            {name: 'defaults', columns: 2}
        ],
        size: 'large'
    }
};

exports['inline-grid'] = {
     columns: [
        'accountName', 'expectTime', 'workload', 'workPrice'
    ]
};

exports.operators = {
    add: false,
    show: false,
    edit: false,
    del: false,
    evaluate: {label: '评估', style: 'btn-primary', icon: 'icon-file-alt', show: 'selected', group: '10-other'}
};

exports.doWithRouter = function(router) {
    router.post('/evaluate', mark('services', 'work/evaluate-info').on(function (evaluateInfoSvc, request) {
        var data = request.params;

        evaluateInfoSvc.saveEvaluateInfo(data);

        return json({flag: true});
    }));
};

//相关数据处理
exports.hooks = {
    //创建数据之前执行函数
    beforeCreate: {
        defaults: mark('services', 'system/accounts').on(function (accountSvc, evaluateInfo){
            var subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal(),
                account, ref;

            evaluateInfo.creator = user.accountName;
            evaluateInfo.creatorName = user.realName;
            evaluateInfo.createdTime = new Date();
            evaluateInfo.status = '1';

            account = accountSvc.getById(user.id);
        })
    },

    //编辑数据之前执行函数
    beforeUpdate: {
        defaults: function (evaluateInfo){
            var subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal();

            evaluateInfo.lastModifier = user.accountName;
            evaluateInfo.lastModifierName = user.realName;
            evaluateInfo.lastModifiedTime = new Date();
        }
    }
};
