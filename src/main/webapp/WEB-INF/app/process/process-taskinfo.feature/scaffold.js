var logger  = require('ringo/logging').getLogger(module.id);
var _       = require('underscore');
var {json}  = require('cdeio/response');
var {mark}  = require('cdeio/mark');

var {createService} = require('process/process-taskinfo.feature/service');

var {Date} = java.util;

var {SecurityUtils}     = org.apache.shiro;

exports.enableFrontendExtension = true;

exports.haveFilter = true;

exports.service = function(service){
    return _.extend(service, createService());
};

//过滤器
exports.filters = {
    defaults: {
        '!processTaskInfoFilter': '',
        '!processInstanceFilter': '',
        '!processDefinitionFilter': '',
        '!processSettingItemFilter': 'processDefinition',
        '!businessDefinitionFilter': '',
        '!accountFilter': ['department', 'roles'],
        '!roleFilter': ['department', 'accounts', 'permissions']
    }
};

//实体每个属性与字段对应显示标签(列表与form页面使用)
exports.labels = {
    flowStatus: '流程状态',
    flowStatusDesc: '状态描述',
    isSign: '是否已签收',
    signTime: '签收时间'
};

//设置form页面一行显示2列
exports.forms = {
    filter: {
        groups: [{
            name: 'filter',
            columns: 4
        }]
    }
};

//form页面显示内容及方式配置
exports.fieldGroups = {
    filter: [
        {name: 'requestNo', label: '业务类型'}
    ]
};

//列表显示字段
exports.grid = {
    columns: [
        {name: 'processInstance.processDefinition.businessDefinition.businessName', header: '待办业务类型', renderer: 'modifyBusinessType'},
        {name: 'flowStatusDesc', header: '待办内容'},
        {name: 'processInstance.submitter.realName', header: '提交人', width: 65},
        {name: 'processInstance.submitTime', header: '提交时间', width: 150},
        {name: 'isSign', defaultContent: '', renderer: 'modifyIsSign', width: 85},
        // {name: 'signor.realName', defaultContent: '', sortable: false, header: '签收人姓名'},
        // 'signTime'
    ],
    filterToolbar: true,
    fixedHeader: true,
    numberColumn: true
};

exports.operators = {
    add: false,
    show: false,
    edit: false,
    del: false,
    audit: {label: '处理', style: 'btn-primary', icon: 'icon-file-alt', group: '10-other'}
};

exports.doWithRouter = function(router) {
    router.put('/sign', mark('services', 'process/process-taskinfo', 'process/common').on(function (procTaskSvc, processSvc, request) {
        var data = request.params,
            task = procTaskSvc.getById(data.id);

        processSvc.sign(task);

        return json({flag: true});
    }));

    router.put('/sign-by-entity', mark('services', 'process/process-taskinfo', 'process/common').on(function (procTaskSvc, processSvc, request) {
        var entity = request.params,
            processInstance = processSvc.getProcessInstanceByEntityAndBusinessMark(entity, entity.businessMark),
            task = processSvc.getProcessTaskByEntityAndProInsIdAndBefFlowStatus(entity, processInstance);

        processSvc.sign(task);

        return json({flag: true});
    }));
};
