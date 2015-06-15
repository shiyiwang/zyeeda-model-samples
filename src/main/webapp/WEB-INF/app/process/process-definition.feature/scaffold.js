var logger          = require('ringo/logging').getLogger(module.id);
var {mark}          = require('cdeio/mark');

var {Date}              = java.util;

var {SecurityUtils}     = org.apache.shiro;

exports.enableFrontendExtension = true;

exports.haveDataLevel = false;

exports.haveFilter = true;

//过滤器
exports.filters = {
    defaults: {
        '!processDefinitionFilter': '',
        '!businessDefinitionFilter': '',
        '!processSettingItemFilter': 'processDefinition',
        '!departmentFilter': ['parent(1)', 'children', 'accounts'],
        '!accountFilter': [''],
        '!roleFilter': ['department', 'accounts'],
        '!permissionFilter': ['roles']
    }
};

//实体每个属性与字段对应显示标签(列表与form页面使用)
exports.labels = {
    businessDefinition: '所属业务',
    endStatuses: '结束状态',//(多个状态值以','隔开)
    createdTime: '创建时间',
    creatorName: '创建人',
    'businessDefinition.businessName': '所属业务'
};

//form页面标题(新增/编辑***)
exports.entityLabel = '流程定义';

//设置form页面一行显示2列
exports.forms = {
    defaults: {
        groups: [
            {name: 'defaults',columns: 2},
            'inlineSettingItemsGrid'
        ],
        size: 'large'
    },
    show: {
        groups: [
            {name: 'showFormGroup',columns: 2},
            'inlineSettingItemsGrid'
        ],
        size: 'large'
    },
    filter: {
        groups: [{
            name: 'filter',
            columns: 4
        }]
    }
};

//form页面显示内容及方式配置
exports.fieldGroups = {
    defaults: [
        {name: 'businessDefinition', textKey: 'businessName'}, {name: 'endStatuses', validations: {rules: {required: true, number: true, digits: false}}}
    ],
    showFormGroup: [
        'businessDefinition.businessName', {name: 'endStatuses', validations: {rules: {required: true, number: true, digits: false}}}
    ],
    inlineSettingItemsGrid: [
        {label: '流程配置项', type: 'inline-grid', name: 'settingItems', allowPick: false, allowEdit: true, allowAdd: true}
    ],
    filter: [
        {name: 'businessDefinition.businessName', label: '业务名称'},
        {name: 'businessDefinition.businessMark', label: '业务标识代码'}
    ]
};

//列表显示字段
exports.grid = {
    columns: [
        {name: 'businessDefinition.businessName', header: '业务名称'},
        {name: 'businessDefinition.businessMark', header: '业务标识代码'},
        'endStatuses', 'creatorName'
    ],
    filterToolbar: true,
    fixedHeader: true,
    numberColumn: true,
    defaultOrder: 'createdTime-desc'
};

//验证方法
exports.validators = {
    create: {
        defaults: mark('services', 'process/process-definition').on(function (procDefiSvc, context, processDefinition, request) {
            var isExists,
                settingItemsSize = processDefinition.settingItems ? processDefinition.settingItems.size() : 0;

            // 验证是否有添加流程配置项
            if (settingItemsSize === 0) {
                context.addViolation({message: '请添加流程配置项'});
            }
            if(!processDefinition.businessDefinition){
                context.addViolation({message: '请选择流程所属业务'});
            }

            isExists = procDefiSvc.isExists(processDefinition);
            if (isExists) {
                context.addViolation({ message: '业务流程已存在' });
            }
        })
    },
    update: {
        defaults: mark('services', 'process/process-definition', 'process/common').on(function (procDefiSvc, processSvc, context, processDefinition, request) {
            var isExists,
                processingProInsCount,
                settingItemsSize;

            settingItemsSize = processDefinition.settingItems ? processDefinition.settingItems.size() : 0;

            // 验证是否有添加流程配置项
            if (settingItemsSize === 0) {
                context.addViolation({message: '请添加流程配置项'});
            }

            if(!processDefinition.businessDefinition){
                context.addViolation({message: '请选择流程所属业务'});
            }

            proInsCount = processSvc.getProcessingProInsCountByProDefi(processDefinition);
            if (proInsCount > 0) {
                context.addViolation({ message: '此流程正在使用，请不要修改' });
            }
        })
    },
    remove: {
        defaults: mark('services', 'process/common').on(function (processSvc, context, processDefinition, request) {
            var proInsCount;

            proInsCount = processSvc.getProInsCountByProDefi(processDefinition);
            if (proInsCount > 0) {
                context.addViolation({ message: '此流程正在使用，不能删除' });
            }
        })
    }
};

//相关数据处理
exports.hooks = {
    //创建数据之前执行函数
    beforeCreate: {
        defaults: function (processDefinition){
            var subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal();

            processDefinition.creator = user.id;
            processDefinition.creatorName = user.realName;
            processDefinition.createdTime = new Date();

            processDefinition.lastModifiedTime = new Date();
        }
    },

    //编辑数据之前执行函数
    beforeUpdate: {
        defaults: function (processDefinition){
            var subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal();

            processDefinition.lastModifier = user.id;
            processDefinition.lastModifierName = user.realName;
            processDefinition.lastModifiedTime = new Date();
        }
    },

    //删除数据之前执行
    beforeRemove: {
        defaults: mark('services', 'process/process-definition').on(function (procDefiSvc, processDefinition) {
            procDefiSvc.removeRelatedInfo(processDefinition);
        })
    }
};
