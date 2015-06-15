var {mark}              = require('cdeio/mark');
var {json, error, html} = require('cdeio/response');

exports.entityLabel = '分配工作包给评估人';

exports.enableFrontendExtension = true;

exports.labels = {
    accounts: '评估人',
    workPackage: '所属工作包',
    'workPackage.code': '工作包编号',
    'workPackage.name': '工作包名称',
    'workPackage.endTime': '截止时间',
    'workPackage.model': '所属模块'
};

exports.style = 'grid';

exports.filters = {
    defaults: {
        '!workEvaluateFilter': '',
        '!workPackageFilter': ''
    },
    list: {
        '!workEvaluateFilter': '',
        '!workPackageFilter': ''
    }
};

exports.fieldGroups = {
    defaults: [
        'workPackage.code', 'workPackage.name', 'workPackage.endTime', 'workPackage.model'
    ],
    inlineAccountsGrid: [
        {label: '评估用户', type: 'inline-grid', name: 'accounts', allowPick: true, multiple: true, crossPage: true, allowAdd: false}
    ]
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

/*exports.operators = {
    add: false,
    show: false,
    edit: false,
    del: false,
    evaluate: {label: '评估', style: 'btn-primary', icon: 'icon-file-alt', show: 'single-selected', group: '10-other'}
};*/

exports.doWithRouter = function(router) {
    router.post('/send-evaluate', mark('services', 'work/work-evaluate').on(function (evaluateSvc, request) {
        var data = request.params;

        evaluateSvc.saveEvaluate(data);

        return json({flag: true});
    }));
};
