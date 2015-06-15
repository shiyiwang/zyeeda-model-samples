var logger          = require('ringo/logging').getLogger(module.id);

var {Date}              = java.util;

var {SecurityUtils}     = org.apache.shiro;

exports.enableFrontendExtension = false;

//过滤器
exports.filters = {
    defaults: {
        '!processSettingItemFilter': 'processDefinition',
        '!accountFilter': ['department', 'roles'],
        '!roleFilter': ['permissions'],
        '!departmentFilter': ['children', 'parent(1)']
    },
    get: {
        '!processSettingItemFilter': 'processDefinition',
        '!accountFilter': ['department', 'roles'],
        '!roleFilter': ['permissions'],
        '!departmentFilter': ['children', 'parent(1)']
    }
};

//实体每个属性与字段对应显示标签(列表与form页面使用)
exports.labels = {
    processDefinition: '所属流程定义',
    flowStatus: '流程状态',
    flowStatusDesc: '状态描述'
};

//form页面标题(新增/编辑***)
exports.entityLabel = '流程配置项';

//设置form页面一行显示2列
exports.forms = {
    defaults: {
        groups: [
            {name: 'defaults',columns: 2},
            'inlineAccountsGrid', 'inlineRolesGrid', 'inlineDepartmentsGrid'
        ],
        size: 'large'
    }
};

//form页面显示内容及方式配置
exports.fieldGroups = {
    defaults: [
        'flowStatus', 'flowStatusDesc'
    ],
    inlineAccountsGrid: [
        {label: '审批用户', type: 'inline-grid', name: 'accounts', allowPick: true, multiple: true, crossPage: true, allowAdd: false}
    ],
    inlineRolesGrid: [
        {label: '审批角色', type: 'inline-grid', name: 'roles', allowPick: true, multiple: true, crossPage: true, allowAdd: false}
    ],
    inlineDepartmentsGrid: [
        {label: '审批部门', type: 'inline-grid', name: 'departments', allowPick: true, multiple: true, crossPage: true, allowAdd: false}
    ]
};

exports['inline-grid'] = {
    columns: [
        'flowStatus', 'flowStatusDesc'
    ]
};
