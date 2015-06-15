var {mark}              = require('cdeio/mark');
var {json, error, html} = require('cdeio/response');

exports.entityLabel = '分配工作包负责人';

exports.enableFrontendExtension = true;

exports.labels = {
    account: '负责人',
    workPackage: '工作包',
    'workPackage.code': '工作包编号',
    'workPackage.name': '工作包名称',
};

exports.style = 'grid';

exports.filters = {
    defaults: {
        '!workTaskFilter': '',
        '!workPackageFilter': 'workTask',
        '!accountFilter': ['department', 'roles']
    },
    list: {
        '!workTaskFilter': '',
        '!workPackageFilter': 'workTask',
        '!accountFilter': ['department', 'roles']
    }
};

exports.fieldGroups = {
    defaults: [
        'workPackage.code', 'workPackage.name', 'account'
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

exports.doWithRouter = function(router) {
    router.post('/task-person', mark('services', 'work/work-task').on(function (workTaskSvc, request) {
        var data = request.params;

        workTaskSvc.saveWorkTask(data);

        return json({flag: true});
    }));
};
