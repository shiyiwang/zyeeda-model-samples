var _               = require('underscore');
var {mark}          = require('cdeio/mark');
var logger          = require('ringo/logging').getLogger(module.id);

var {BusinessDefinition}    = com.zyeeda.model.process.entity;
var {ProcessDefinition}     = com.zyeeda.model.process.entity;
var {ProcessInstance}       = com.zyeeda.model.process.entity;
var {ProcessSettingItem}    = com.zyeeda.model.process.entity;
var {ProcessTaskInfo}       = com.zyeeda.model.process.entity;
var {ApprovalHistory}       = com.zyeeda.model.process.entity;

var {Date}      = java.util;

var {Integer}   = java.lang;
var {String}    = java.lang;

var {SecurityUtils} = org.apache.shiro;

// 根据流程业务标识创建流程实例
var createProcessInstanceByBusinessMark = mark('managers', ProcessDefinition, ProcessInstance).mark('tx').on(function (proDefMgr, proInsMgr, entity, businessMark, beforeFlowStatus, step, businessFeaturePath, requestNo, extendFiled1, extendFiled2, extendFiled3){
    var user = SecurityUtils.getSubject().getPrincipal(),
        processInstance = new ProcessInstance(),
        processDefinition = proDefMgr.getProcessDefinitionByBusinessMark({businessMark: businessMark}, 1),
        processTask,
        isEnd = false,
        endStatusesArr = processDefinition.endStatuses.split(','),
        operateTime = new Date();

    // 根据流程中配置的结束状态来判断该审批步骤是否为结束流程动作
    if(processDefinition.endStatuses.lastIndexOf(',') != -1){
        endStatusesArr = processDefinition.endStatuses.split(',');
        if(_.contains(endStatusesArr, ((beforeFlowStatus + step) + ''))){
            isEnd = true;
        }
    }else{
        if(endStatusesArr == (beforeFlowStatus + step)){
            isEnd = true;
        }
    }

    processDefinition.businessDefinition.businessFeaturePath = businessFeaturePath;

    processInstance.submitter = user;
    processInstance.submitTime = operateTime;
    processInstance.processDefinition = processDefinition;
    processInstance.isSign = false;
    processInstance.isFinished = false;
    if(isEnd){
        processInstance.isFinished = true;
        processInstance.isSign = true;
    }
    processInstance.relatedEntryId = entity.id;

    processInstance = proInsMgr.save(processInstance);

    // 创建流程任务
    processTask = createProcessTaskInfoByProcessInstance(entity, processInstance,  beforeFlowStatus, (beforeFlowStatus + step), true, operateTime, requestNo, extendFiled1, extendFiled2, extendFiled3);

    // 创建审批历史记录
    createApprovalHistory(entity, processInstance, true, operateTime, processTask);

    return processInstance;
});

// 根据流程业务标识创建流程实例
var updateProcessInstanceByBusinessMark = mark('managers', ProcessDefinition, ProcessInstance).mark('tx').on(function (proDefMgr, proInsMgr, entity, businessMark, beforeFlowStatus, step, extendFiled1, extendFiled2, extendFiled3){
    var user = SecurityUtils.getSubject().getPrincipal(),
        processDefinition = proDefMgr.getProcessDefinitionByBusinessMark({businessMark: businessMark}, 1),
        processTask,
        isEnd = false,
        endStatusesArr = processDefinition.endStatuses,
        operateTime = new Date(),
        processInstance = proInsMgr.getProcessInstanceByEntryIdAndBusinessMark({entryId: entity.id, businessMark: businessMark}, 1),
        requestNo;

    if(processDefinition.endStatuses.lastIndexOf(',') != -1){
        endStatusesArr = processDefinition.endStatuses.split(',');
        if(_.contains(endStatusesArr, ((beforeFlowStatus + step) + ''))){
            isEnd = true;
        }
    }else{
        if(endStatusesArr == (beforeFlowStatus + step)){
            isEnd = true;
        }
    }

    processTask = updateProcessTaskInfoByProcessInstanceAndFlowStatus(entity, processInstance, beforeFlowStatus, (beforeFlowStatus + step), false, operateTime, extendFiled1, extendFiled2, extendFiled3);

    // 创建审批历史记录
    createApprovalHistory(entity, processInstance, false, operateTime, processTask);

    // 保存业务数据编码
    requestNo = processTask.requestNo;

    // 审批意见(1:同意,2:不同意)
    if('2' === entity.flowComment){//审批不同意
        processInstance.finishor = user;
        processInstance.finishTime = operateTime;
        processInstance.isFinished = true;

        entity.flowStatus = -1;//流程状态（-2 : 审批完成, -1: 退回, 空或0: 初始, 其它: 审批中）
    }else if(isEnd){//流程结束
        processInstance.finishor = user;
        processInstance.finishTime = operateTime;
        processInstance.isFinished = true;

        entity.flowStatus = -2;//流程状态（-2 : 审批完成, -1: 退回, 空或0: 初始, 其它: 审批中）
    }else{
        processTask = createProcessTaskInfoByProcessInstance(entity, processInstance, beforeFlowStatus, (beforeFlowStatus + step), false, operateTime, requestNo, extendFiled1, extendFiled2, extendFiled3);
    }

    return processInstance;
});

// 创建流程任务
var createProcessTaskInfoByProcessInstance = mark('managers', ProcessTaskInfo, ProcessSettingItem).mark('tx').on(function (proTasMgr, proSetMgr, entity, processInstance, beforeFlowStatus, flowStatus, isSendProcess, operateTime, requestNo, extendFiled1, extendFiled2, extendFiled3){
    var user = SecurityUtils.getSubject().getPrincipal(),
        processTaskInfo = new ProcessTaskInfo(),
        processSettingItem = proSetMgr.getProcessSettingItemByFlowStatusAndProDefiId({flowStatus: (flowStatus + ''), processDefinitionId: processInstance.processDefinition.id}, 1);

    processTaskInfo.processInstance = processInstance;
    processTaskInfo.flowStatus = flowStatus;
    processTaskInfo.flowStatusDesc = processSettingItem.flowStatusDesc;
    processTaskInfo.processSettingItem = processSettingItem;
    processTaskInfo.createUser = user;
    processTaskInfo.createTime = operateTime;

    processTaskInfo.isSign = false;
    processTaskInfo.isApproval = false;
    processTaskInfo.requestNo = requestNo || '';
    processTaskInfo.extendFiled1 = (extendFiled1 || '');
    processTaskInfo.extendFiled2 = (extendFiled2 || '');
    processTaskInfo.extendFiled3 = (extendFiled3 || '');

    return proTasMgr.save(processTaskInfo);
});

// 根据状态及流程实例更新流程任务
var updateProcessTaskInfoByProcessInstanceAndFlowStatus = mark('managers', ProcessTaskInfo).mark('tx').on(function (proTasMgr, entity, processInstance, beforeFlowStatus, flowStatus, isSendProcess, operateTime, extendFiled1, extendFiled2, extendFiled3){
    var user = SecurityUtils.getSubject().getPrincipal(),
        processTaskInfo = proTasMgr.getProcessTaskByEntryIdAndProInsIdAndBefFlowStatus({entryId: entity.id, processInstanceId: processInstance.id, beforeFlowStatus: (beforeFlowStatus + '')}, 1);

    processTaskInfo.isApproval = true;
    processTaskInfo.approvalor = user;
    processTaskInfo.approvalTime = operateTime;
    processTaskInfo.comment = entity.flowComment;
    processTaskInfo.suggestion = entity.flowSuggestion;
    processTaskInfo.extendFiled1 = extendFiled1;
    processTaskInfo.extendFiled2 = extendFiled2;
    processTaskInfo.extendFiled3 = extendFiled3;

    return processTaskInfo;
});

// 保存审批历史记录
var createApprovalHistory = mark('managers', ApprovalHistory).mark('tx').on(function (apprHisMgr, entity, processInstance, isSendProcess, operateTime, processTask){
    var user = SecurityUtils.getSubject().getPrincipal(),
        approvalHistory = new ApprovalHistory();

    approvalHistory.relatedEntryId = entity.id;
    approvalHistory.businessDefinition = processInstance.processDefinition.businessDefinition;
    approvalHistory.isSendProcess = isSendProcess;
    approvalHistory.operator = user;
    approvalHistory.operateTime = operateTime;
    approvalHistory.comment = entity.flowComment;
    approvalHistory.suggestion = entity.flowSuggestion;
    approvalHistory.taskDesc = isSendProcess === true ? '上报' : processTask === undefined ? '' : processTask.flowStatusDesc;
    approvalHistory.processTaskInfo = (processTask || null);

    return apprHisMgr.save(approvalHistory);
});

exports.createService = function() {
    return {
		sendProcess: function (entity, businessMark, step, businessFeaturePath, requestNo, extendFiled1, extendFiled2, extendFiled3) {
			var beforeFlowStatus = '0',
                step = !step ? 1 : step;

            entity.flowStatus = Integer.parseInt(beforeFlowStatus) + step;

            createProcessInstanceByBusinessMark(entity, businessMark, Integer.parseInt(beforeFlowStatus), step, businessFeaturePath, requestNo, extendFiled1, extendFiled2, extendFiled3);
		},
        audit: function(entity, businessMark, step, extendFiled1, extendFiled2, extendFiled3){
            var beforeFlowStatus = entity.flowStatus;

            entity.flowStatus = Integer.parseInt(beforeFlowStatus) + step;
            return updateProcessInstanceByBusinessMark(entity, businessMark, Integer.parseInt(beforeFlowStatus), step, extendFiled1, extendFiled2, extendFiled3);
        },
        getUserProcessTasks: mark('managers', ProcessTaskInfo).mark('tx').on(function (proTasMgr){
            var user = SecurityUtils.getSubject().getPrincipal();

            return proTasMgr.getProcessTasksByUserId({userId: user.id});
        }),
        getProcessInstanceByEntityAndBusinessMark: mark('managers', ProcessInstance).mark('tx').on(function (proInsMgr, entity, businessMark){
            return proInsMgr.getProcessInstanceByEntryIdAndBusinessMark({entryId: entity.id, businessMark: businessMark}, 1);
        }),
        getCleanProcessInstanceByEntityAndBusinessMark: mark('managers', ProcessInstance).mark('tx').on(function (proInsMgr, entity, businessMark){
            return proInsMgr.getCleanProcessInstanceByEntityAndBusinessMark({entryId: entity.id, businessMark: businessMark});
        }),
        getProcingProcessTaskByEntityAndProInsIdAndBefFlowStatus: mark('managers', ProcessInstance).mark('tx').on(function (proInsMgr, entity, businessMark){
            return proInsMgr.getProcingProcessTaskByEntityAndProInsIdAndBefFlowStatus({entryId: entity.id, processInstanceId: processInstance.id, businessMark: businessMark}, 1);
        }),
        getProcessTaskByEntityAndProInsIdAndBefFlowStatus: mark('managers', ProcessTaskInfo).mark('tx').on(function (proTasMgr, entity, processInstance){

            return proTasMgr.getProcessTaskByEntryIdAndProInsIdAndBefFlowStatus({entryId: entity.id, processInstanceId: processInstance.id}, 1);
        }),
        sign: mark('managers', ProcessTaskInfo, ProcessInstance).mark('tx').on(function (proTasMgr, proInsMgr, task){
            var user = SecurityUtils.getSubject().getPrincipal();

            instance = proInsMgr.find(task.processInstance.id);
            instance.isSign = true;

            task.isSign = true;
            task.signor = user;
            task.signTime = new Date();

            return proTasMgr.save(task);
        }),
        removeProssInfoByEntryId: mark('managers', ApprovalHistory, ProcessTaskInfo, ProcessInstance).mark('tx').on(function (apprHisMgr, proTasMgr, proInsMgr, entryId){
            var approvalHistorys = apprHisMgr.getApprovalHistorysByEntryId({entryId: entryId}),
                processTasks = proTasMgr.getProcessTasksByEntryId({entryId: entryId}),
                processInstances = proInsMgr.getProcessInstancesByEntryId({entryId: entryId}),
                i;

            // remove approvalHistory
            for(i = 0; i < approvalHistorys.size(); i++){
                apprHisMgr.remove(approvalHistorys.get(i));
            }
            // remove processTaskInfo
            for(i = 0; i < processTasks.size(); i++){
                proTasMgr.remove(processTasks.get(i));
            }
            // remove processInstance
            for(i = 0; i < processInstances.size(); i++){
                proInsMgr.remove(processInstances.get(i));
            }
        }),
        retrieveProcessByEntryAndProcessInstance: mark('managers', ApprovalHistory, ProcessTaskInfo, ProcessInstance).mark('tx').on(function (apprHisMgr, proTasMgr, proInsMgr, entity, processInstance){
            var processTasks = proTasMgr.getProcessTasksByEntryIdAndProInsId({entryId: entity.id, processInstanceId: processInstance.id}),
                approvalHistorys = apprHisMgr.getApprovalHistorysByTaskId({taskId: processTasks.get(0).id}),
                i;

            // remove approvalHistory
            for(i = 0; i < approvalHistorys.size(); i++){
                apprHisMgr.remove(approvalHistorys.get(i));
            }

            // remove processTaskInfo
            for(i = 0; i < processTasks.size(); i++){
                proTasMgr.remove(processTasks.get(i));
            }

            // remove processInstance
            proInsMgr.remove(processInstance);

            // rollback flow status
            entity.flowStatus = 0;
        }),
        getProInsCountByProDefi: mark('managers', ProcessInstance).mark('tx').on(function (proInsMgr, processDefinition){
            return proInsMgr.getProInsCountByProDefiId({ processDefinitionId: processDefinition.id }, 1);
        }),
        getProcessingProInsCountByProDefi: mark('managers', ProcessInstance).mark('tx').on(function (proInsMgr, processDefinition){
            return proInsMgr.getProcessingProInsCountByProDefiId({ processDefinitionId: processDefinition.id }, 1);
        })
    };
};
