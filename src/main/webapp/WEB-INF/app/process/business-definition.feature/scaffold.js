var logger = require('ringo/logging').getLogger(module.id);
var {mark} = require('cdeio/mark');

var {Date}          = java.util;

var {SecurityUtils} = org.apache.shiro;

exports.enableFrontendExtension = true;

exports.haveDataLevel = false;

exports.haveFilter = true;

//过滤器
exports.filters = {
    defaults: {
        '!businessDefinitionFilter': ''
    }
};

//实体每个属性与字段对应显示标签(列表与form页面使用)
exports.labels = {
    businessName: '业务名称',
    businessMark: '业务标识代码'
};

//form页面标题(新增/编辑***)
exports.entityLabel = '流程业务定义';

//设置form页面一行显示2列
exports.forms = {
    defaults: {
        groups: [
            {name: 'defaults',columns: 2}
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
        'businessName', 'businessMark'
    ],
    filter: [
        'businessName', 'businessMark'
    ]
};

//列表显示字段
exports.grid = {
    columns: [
        'businessName', 'businessMark'
    ],
    filterToolbar: true,
    fixedHeader: true,
    numberColumn: true,
    defaultOrder: 'createdTime-desc'
};

exports.picker = {
    grid: {
        columns: [
            {name: 'businessName', header: '业务名称', filter: 'text'},
            {name: 'businessMark', header: '业务标识代码', filter: 'text'}
        ]
    },
    callback: 'procBusiDefiPickerCallback',
    afterPickerConfirm: 'afterProcBusiDefiPickerConfirm'
};

exports.validators = {
    create: {
        defaults: mark('services', 'process/business-definition').on(function (busiDefiSvc, context, entity, request) {
            var isExists;

            if(entity.businessMark){
                isExists = busiDefiSvc.isExists(entity);
                if (isExists) {
                    context.addViolation({ message: '业务标识代码已存在' });
                }
            }
        })
    },
    remove: {
        defaults: mark('services', 'process/process-definition').on(function (procDefiSvc, context, entity, request) {
            var proDefiCount;

            proDefiCount = procDefiSvc.getProDefiCountByBusiMark(entity.businessMark);
            if (proDefiCount > 0) {
                context.addViolation({ message: '此流程业务正在使用，不能删除' });
            }
        })
    }
};

//相关数据处理
exports.hooks = {
    //创建数据之前执行函数
    beforeCreate: {
        defaults: function (businessDefinition){
            var subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal();

            businessDefinition.creator = user.id;
            businessDefinition.creatorName = user.realName;
            businessDefinition.createdTime = new Date();
        }
    },

    //编辑数据之前执行函数
    beforeUpdate: {
        defaults: function (businessDefinition){
            var subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal();

            businessDefinition.lastModifier = user.id;
            businessDefinition.lastModifierName = user.realName;
            businessDefinition.lastModifiedTime = new Date();
        }
    }
};
