var {mark}              = require('cdeio/mark');
var _                   = require('underscore');
var {json, error, html} = require('cdeio/response');
var {createService}     = require('work/todo-info.feature/service');

exports.service = function(service){
    return _.extend(service, createService());
};

exports.entityLabel = '待办信息';

exports.enableFrontendExtension = true;

exports.labels = {
    account: '评估人',
    workPackage: '工作包',
    packageCode: '工作包编号',
    packageName: '工作包名称',
    packageEndTime: '截止时间',
    packageModel: '所属模块',
    status: '状态'
};

exports.style = 'grid';

exports.grid = {
    columns: [
        {name: 'packageCode', defaultContent: '',width: 120},
        {name: 'packageName', defaultContent: '', width: 80},
        {name: 'packageEndTime', defaultContent: '', width: 100},
        {name: 'packageModel', defaultContent: '', width: 100}
    ],
    defaultOrder: 'createdTime-desc'
};

exports.filters = {
    defaults: {
        '!todoInfoFilter': '',
        '!workPackageFilter': ['evaluateInfos', 'todoInfos', 'workTask'],
        '!accountFilter': ['department', 'roles']
    },
    list: {
        '!todoInfoFilter': '',
        '!workPackageFilter': ['evaluateInfos', 'todoInfos', 'workTask'],
        '!accountFilter': ['department', 'roles']
    }
};

exports.fieldGroups = {
    defaults: [
        'packageCode', 'packageName', 'packageEndTime', 'packageModel'
    ]
};

exports.forms = {
    defaults: {
        groups: [
            {name: 'defaults',columns: 2}
        ],
        size: 'large'
    }
};

exports.operators = {
    add: false,
    show: false,
    edit: false,
    del: false,
    evaluate: {label: '评估', style: 'btn-primary', icon: 'icon-file-alt', show: 'single-selected', group: '10-other'},
    submit: {label: '提交', style: 'btn-pink', icon: 'icon-cloud-upload', show: 'single-selected', group: '20-other'}
};

exports.doWithRouter = function(router) {
    router.post('/get-todo-info-by-work-package-id', mark('services', 'work/work-evaluate').on(function (evaluateSvc, request) {
        var data = request.params;

        evaluateSvc.saveEvaluate(data);

        return json({flag: true});
    }));

    router.post('/submit-todo', mark('services', 'work/todo-info').on(function (todoInfoSvc, request) {
        var data = request.params;

        todoInfoSvc.submitTodoInfo(data);

        return json({flag: true});
    }));
};
