var {mark}              = require('cdeio/mark');
var _                   = require('underscore');

var {Date}             = java.util;
var {SecurityUtils}    = org.apache.shiro;

exports.entityLabel = '工作包';

exports.enableFrontendExtension = true;

exports.haveFilter = true;

exports.labels = {
    code: '工作包编号',
    name: '工作包名称',
    endTime: '截止时间',
    model: '所属功能模块',
    preWorkPackage: '前置工作包',
    postWorkPackage: '后置工作包',
    content: '工作包研究内容',
    accStandard: '工作包验收标准',
    status: '状态',
    'workTask.account.accountName': '负责人'
};

exports.filters = {
    defaults: {
        '!workPackageFilter': ['preWorkPackage', 'postWorkPackage', 'workEvaluate'],
        '!evaluateInfoFilter': ['workPackage'],
        '!todoInfoFilter': ['workPackage'],
        '!workListFilter': 'evaluateInfo',
        '!accountFilter': ['department', 'roles'],
        '!workTaskFilter': ['workPackage']
    },
    list: {
        '!workPackageFilter': ['preWorkPackage', 'postWorkPackage', 'workEvaluate'],
        '!evaluateInfoFilter': ['workPackage'],
        '!todoInfoFilter': ['workPackage'],
        '!workListFilter': 'evaluateInfo',
        '!accountFilter': ['department', 'roles'],
        '!workTaskFilter': ['workPackage']
    }
};

exports.style = 'grid';

exports.grid = {
    numberColumn: true,
    columns: [
        {name: 'code', defaultContent: '', width: 80},
        {name: 'name', defaultContent: '',width: 120},
        {name: 'endTime', defaultContent: '', width: 80},
        {name: 'model', defaultContent: '', width: 100, renderer: 'modifyModel'},
        {name: 'content', width: 100},
        {name: 'accStandard', defaultContent: '', width: 100},
        {name: 'status', defaultContent: '', width: 60, renderer: 'modifyStatus'}
    ],
    defaultOrder: 'createdTime-desc'
};

exports.fieldGroups = {
    add: [
        'name', 'endTime',
        {name: 'model',
        type: 'dropdown',
        source: [
            {id: '1', text: '模块1'},
            {id: '2', text: '模块2'},
            {id: '3', text: '模块3'}
        ]},
        {name: 'content', type: 'textarea', colspan: 2},
        {name: 'accStandard', type: 'textarea', colspan: 2}
    ],
    edit: [
        'code', 'name', 'endTime',
        {name: 'model',
        type: 'dropdown',
        source: [
            {id: '1', text: '模块1'},
            {id: '2', text: '模块2'},
            {id: '3', text: '模块3'}
        ]},
        {name: 'content', type: 'textarea', colspan: 2},
        {name: 'accStandard', type: 'textarea', colspan: 2}
    ],
    filter: [
        'code', 'name', 'endTime',
        {name: 'model',
        type: 'dropdown',
        source: [
            {id: '1', text: '模块1'},
            {id: '2', text: '模块2'},
            {id: '3', text: '模块3'}
        ]},
    ],
    inlinePreWorkListGrid: [{
        label: '前置工作包',
        type: 'inline-grid',
        name: 'preWorkPackages',
        allowAdd: false,
        allowEdit: false,
        multiple: true,
        allowPick: true
    }],
    inlinePostWorkListGrid: [{
        label: '后置工作包',
        type: 'inline-grid',
        name: 'postWorkPackages',
        allowAdd: false,
        allowEdit: false,
        multiple: true,
        allowPick: true
    }],
    evaluateInfoGroup: [
        {label: '评估记录', type: 'inline-grid', name: 'evaluateInfos', readOnly: true, hideLabel: true}
    ],
    workTaskGroup: [
        'workTask.account.accountName'
    ]
};

exports.forms = {
    add: {
        size: 'large',
        groups: [
            {name: 'add', columns: 2},
            {name: 'inlinePreWorkListGrid'},
            {name: 'inlinePostWorkListGrid'}
        ]
    },
    edit: {
        size: 'large',
        groups: [
            {name: 'edit', columns: 2},
            {name: 'inlinePreWorkListGrid'},
            {name: 'inlinePostWorkListGrid'}
        ]
    },
    show: {
        size: 'large',
        groups: [
            {name: 'edit', columns: 2},
            {name: 'evaluateInfoGroup'},
            {name: 'workTaskGroup'},
            {name: 'inlinePreWorkListGrid'},
            {name: 'inlinePostWorkListGrid'}
        ],
        tabs: [
            {title: '工作包', groups: ['edit', 'inlinePreWorkListGrid', 'inlinePostWorkListGrid']},
            {title: '评估信息', groups: ['evaluateInfoGroup']},
            {title: '负责人', groups: ['workTaskGroup']}
        ]
    },
    filter: {
        groups: [
            {name: 'filter', columns: 4}
        ]
    }
};

exports.picker = {
    grid: {
        columns: [
            { name: 'code', header: '工作包编号', search: false, filter: 'text', defaultContent: '' },
            { name: 'name', header: '工作包名称', search: false, filter: 'text', defaultContent: ''},
            { name: 'endTime', header: '截止时间', search: false, filter: 'text' , defaultContent: ''},
            { name: 'model', header: '所属功能模块', search: true, filter: 'text', defaultContent: ''},
            { name: 'content', header: '工作包研究内容', search: true, filter: 'text', defaultContent: ''}
        ]
    }
};

exports['inline-grid'] = {
    columns: [
        'code', 'name', 'endTime', 'model', 'status'
    ]
};

exports.operators = {
    evaluate: { label: '送交评估', icon: 'icon-envelope-alt', group: '30-refresh', order: 10, show: 'single-selected', style: 'btn-pink' },
    task: { label: '分配负责人', icon: 'icon-hand-right', group: '30-refresh', order: 20, show: 'single-selected', style: 'btn-green' }
};

//相关数据处理
exports.hooks = {
    //创建数据之前执行函数
    beforeCreate: {
        defaults: mark('services', 'work/work-package', 'system/accounts').on(function (workPackageSvc, accountSvc, workPackage) {
            var user = SecurityUtils.getSubject().getPrincipal();

            //自动添加创建人账户名和姓名，创建时间
            workPackage.creator = user.accountName;
            workPackage.creatorName = user.realName;
            workPackage.createdTime = new Date();
            workPackage.status = '1';
            //自动生成编号
            workPackage.code = workPackageSvc.autoGenerateNo();
        })
    },
    //编辑数据之前执行函数
    beforeUpdate: {
        defaults: function (workPackage){
            var user = SecurityUtils.getSubject().getPrincipal();
            //自动添加修改人账户名，姓名，修改时间
            workPackage.lastModifier = user.accountName;
            workPackage.lastModifierName = user.realName;
            workPackage.lastModifiedTime = new Date();
        }
    }
};
