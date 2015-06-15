var {mark}              = require('cdeio/mark');
var {createService}     = require('cdeio/service');

var {WorkPackage} = com.zyeeda.model.work.entity;
var {WorkTask}    = com.zyeeda.model.work.entity;
var {Account}     = com.zyeeda.cdeio.commons.organization.entity;

exports.createService = function() {
    return {
        saveWorkTask: mark('managers', WorkPackage, WorkTask, Account).mark('tx').on(function (packageMgr, workTaskMgr, accountMgr, data) {
            var workPackage, workTask, accountList = [], account, toDoInfo;

            workPackage = packageMgr.find(data.workPackageId);

            account = accountMgr.find(data.accountId);

            workTask = new WorkTask();
            workTask.workPackage = workPackage;
            workTask.account = account;
            workTaskMgr.save(workTask);

            workPackage.status = '4';
        })
    };
};
