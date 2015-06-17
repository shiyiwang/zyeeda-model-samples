var {mark}              = require('cdeio/mark');
var {createService}     = require('cdeio/service');

var {WorkPackage} = com.zyeeda.model.work.entity;
var {WorkTask}    = com.zyeeda.model.work.entity;
var {TaskInfo}    = com.zyeeda.model.work.entity;
var {Account}     = com.zyeeda.cdeio.commons.organization.entity;

exports.createService = function() {
    return {
        saveWorkTask: mark('managers', WorkPackage, WorkTask, Account, TaskInfo).mark('tx').on(function (packageMgr, workTaskMgr, accountMgr, taskInfoMgr, data) {
            var workPackage, workTask, accountList = [], account, toDoInfo;

            workPackage = packageMgr.find(data.workPackageId);

            for (v in data.accounts){
                account = accountMgr.find(data.accounts[v].id);
                accountList.push(account);

                taskInfo = new TaskInfo();
                taskInfo.workPackage = workPackage;
                taskInfo.account = account;
                taskInfoMgr.save(taskInfo);
            }

            workTask = new WorkTask();
            workTask.workPackage = workPackage;
            workTask.accounts = accountList;
            workTaskMgr.save(workTask);

            workPackage.status = '4';
        })
    };
};
