var {mark}              = require('cdeio/mark');
var {createService}     = require('cdeio/service');
var {createManager}     = require('cdeio/manager');

var {EvaluateInfo} = com.zyeeda.model.work.entity;
var {WorkPackage}  = com.zyeeda.model.work.entity;
var {WorkList}     = com.zyeeda.model.work.entity;
var {TodoInfo}     = com.zyeeda.model.work.entity;
var {Account}      = com.zyeeda.cdeio.commons.organization.entity;

var {EntityMetaResolver} = com.zyeeda.cdeio.web.scaffold;
var {SecurityUtils}      = org.apache.shiro;
var {Calendar}           = java.util;
var {Integer}            = java.lang;

exports.createService = function() {
    return {
        saveEvaluateInfo: mark('managers', WorkPackage, EvaluateInfo, Account, WorkList, TodoInfo).mark('tx').on(function (packageMgr, evaluateInfoMgr, accountMgr, workListMgr, todoInfoMgr, data) {
            var workPackage, evaluateInfo, account, work, workList = [], todoInfo, key, allPass = true, todo;

            workPackage = packageMgr.find(data.workPackageId);
            account = accountMgr.find(data.accountId);
            todoInfo = todoInfoMgr.find(data.todoInfoId);
            evaluateInfo = new EvaluateInfo();

            for (key in data.workLists){
                work = new WorkList();
                work.actName = data.workLists[key].actName;
                work.actType = data.workLists[key].actType;
                work.workload = data.workLists[key].workload;
                work.evaluateInfo = evaluateInfo;
                workListMgr.save(work);
                workList.push(work);
            }

            evaluateInfo.workPackage = workPackage;
            evaluateInfo.account = account;
            evaluateInfo.accountName = account.accountName;
            evaluateInfo.workLists = workList;
            evaluateInfo.workload = data.workload;
            evaluateInfo.expectTime = new Date(data.expectTime.replace(/-/g,   "/"));
            evaluateInfoMgr.save(evaluateInfo);

            todoInfo.status = '2';
            todoInfoMgr.save(todoInfo);

            for (var i = 0; i < workPackage.todoInfos.size(); i++) {
                todo = workPackage.todoInfos.get(i);
                if (todo.status == '1'){
                    allPass = false;
                }
            }
            if (allPass == true){
                workPackage.status = '3';
            }
        })
    };
};
