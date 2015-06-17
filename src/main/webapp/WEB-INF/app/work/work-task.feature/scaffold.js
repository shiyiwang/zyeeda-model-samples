var {mark}              = require('cdeio/mark');
var {json, error, html} = require('cdeio/response');

exports.entityLabel = '工作任务';

exports.enableFrontendExtension = true;

exports.labels = {
    accounts: '负责人',
    workPackage: '工作包',
    'workPackage.code': '工作包编号',
    'workPackage.name': '工作包名称'
};

exports.style = 'grid';

exports.filters = {
    defaults: {
        '!workTaskFilter': '',
        '!workPackageFilter': ['workTask', 'evaluateInfos', 'preWorkPackages', 'postWorkPackages', 'evaluateInfos', 'todoInfos'],
        '!accountFilter': ['department', 'roles']
    },
    list: {
        '!workTaskFilter': '',
        '!workPackageFilter': ['workTask', 'evaluateInfos', 'preWorkPackages', 'postWorkPackages', 'evaluateInfos', 'todoInfos'],
        '!accountFilter': ['department', 'roles']
    }
};

exports.style = 'grid';

exports.grid = {
    numberColumn: true,
    columns: [
        {name: 'workPackage.code', header: '工作包编号', defaultContent: ''},
        {name: 'workPackage.name', header: '工作包名称', defaultContent: ''}
    ],
    defaultOrder: 'workPackage-desc'
};

exports.fieldGroups = {
    defaults: [
        'workPackage.code', 'workPackage.name'
    ],
    inlineAccountsGrid: [{
        label: '负责人',
        type: 'inline-grid',
        name: 'accounts',
        allowAdd: false,
        allowEdit: false,
        multiple: true,
        allowPick: true
    }],
};

exports.forms = {
    defaults: {
        groups: [
            {name: 'defaults',columns: 2},
            'inlineAccountsGrid'
        ],
        size: 'large'
    }
};

exports.doWithRouter = function(router) {
    router.post('/task-person', mark('services', 'work/work-task').on(function (workTaskSvc, request) {
        var data = request.params;

        workTaskSvc.saveWorkTask(data);

        return json({flag: true});
    }));
};
