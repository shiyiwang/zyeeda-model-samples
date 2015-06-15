var logger  = require('ringo/logging').getLogger(module.id);
var _       = require('underscore');

var {createService} = require('process/approval-history.feature/service');

exports.service = function(service){
    return _.extend(service, createService());
};

exports.enableFrontendExtension = true;

exports.haveDataLevel = false;

exports.haveFilter = true;

//过滤器
exports.filters = {
    defaults: {
        'approvalHistoryFilter': ['id', 'processTaskInfo', 'businessDefinition', 'taskDesc', 'operateTime', 'comment', 'suggestion', 'relatedEntryId'],
        '!businessDefinitionFilter': '',
        'processTaskInfoFilter': ['id', 'processInstance', 'requestNo', 'extendFiled1', 'extendFiled2', 'extendFiled3'],
        'processInstanceFilter': ['id', 'submitter', 'submitTime'],
        'accountFilter': ['id', 'realName']
    }
};

//实体每个属性与字段对应显示标签(列表与form页面使用)
exports.labels = {
    businessDefinition: '所属业务定义',
    taskDesc: '已办内容',
    isSendProcess: '是否送审操作',
    operateTime: '审批时间',
    comment: '审批结果',
    suggestion: '审批意见'
};

exports.forms = {
    filter: {
        groups: [{
            name: 'filter',
            columns: 4
        }]
    }
};

exports.fieldGroups = {
    filter: [
        {name: 'businessDefinition.businessName', label: '已办业务类型'},
        {name: 'processTaskInfo.processInstance.submitter.realName', label: '提交人'},
        {name: 'processTaskInfo.processInstance.submitTime', type: 'date-range', label: '提交时间'}
    ]
};

//列表显示字段
exports.grid = {
    columns: [
        {name: 'businessDefinition.businessName', defaultContent: '', sortable: false, header: '已办业务类型', renderer: 'modifyBusinessType'},
        'taskDesc',
        {name: 'processTaskInfo.processInstance.submitter.realName', header: '提交人', width: 65},
        {name: 'processTaskInfo.processInstance.submitTime', header: '提交时间', width: 150},
        {name: 'operateTime', width: 150}
    ],
    filterToolbar: true,
    fixedHeader: true,
    numberColumn: true
};

exports.operators = {
    add: false,
    edit: false,
    del: false
};
