var {mark}              = require('cdeio/mark');
var _                   = require('underscore');
var {json, error, html} = require('cdeio/response');
var {createService}     = require('work/task-info.feature/service');

exports.service = function(service){
    return _.extend(service, createService());
};

exports.entityLabel = '工作任务';

exports.enableFrontendExtension = true;

exports.labels = {
    account: '负责人',
    workPackage: '工作包',
    totalProgress: '整体进度(%)',
    'account.accountName': '负责人',
    'workPackage.code': '工作包编号',
    'workPackage.name': '工作包名称'
};

exports.style = 'grid';

exports.grid = {
    columns: [
        {name: 'workPackage.code', header: '工作包编号', defaultContent: '',width: 120},
        {name: 'workPackage.name', header: '工作包名称', defaultContent: '', width: 80},
        {name: 'totalProgress', defaultContent: '', width: 100}
    ],
    defaultOrder: 'createdTime-desc'
};

exports.filters = {
    defaults: {
        '!taskInfoFilter': '',
        '!workPackageFilter': ['evaluateInfos', 'todoInfos', 'workTask', 'taskInfos'],
        '!accountFilter': ['department', 'roles'],
        '!taskListFilter': ['taskInfo']
    },
    list: {
        '!taskInfoFilter': '',
        '!workPackageFilter': ['evaluateInfos', 'todoInfos', 'workTask', 'taskInfos'],
        '!accountFilter': ['department', 'roles'],
        '!taskListFilter': ['taskInfo']
    }
};

exports.fieldGroups = {
    defaults: [
        'workPackage.name', 'workPackage.code'
    ],
    progressGroup: [
        {name: 'totalProgress', validations: {rules: {required: true, number: true, rangelength: [0, 100]}, messages: {rangelength:'必须在0和100之间'}}}
    ],
    inlineTaskListsGrid: [{
        label: '活动清单',
        type: 'inline-grid',
        name: 'taskLists',
        allowAdd: true,
        allowEdit: true,
        multiple: false,
        allowPick: false
    }]
};

exports.forms = {
    defaults: {
        groups: [
            {name: 'defaults',columns: 2},
            {name: 'progressGroup'},
            {name: 'inlineTaskListsGrid'}
        ],
        size: 'large'
    },
    edit: {
        groups: [
            {name: 'progressGroup'},
            {name: 'inlineTaskListsGrid'}
        ],
        size: 'large'
    }
};

exports['inline-grid'] = {
    columns: [
        {name: 'account.accountName', header: '负责人'},
        'totalProgress'
    ]
};

exports.operators = {
    add: false,
    del: false,
    edit: {label: '汇报进度', icon: 'icon-arrow-up', group: '20-selected', style: 'btn-warning', show: 'single-selected', order: 200}
};
