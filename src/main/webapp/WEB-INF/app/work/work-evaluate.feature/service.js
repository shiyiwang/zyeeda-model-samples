var {mark}              = require('cdeio/mark');
var {createService}     = require('cdeio/service');

var {WorkPackage}  = com.zyeeda.model.work.entity;
var {WorkEvaluate} = com.zyeeda.model.work.entity;
var {TodoInfo}     = com.zyeeda.model.work.entity;
var {Account}      = com.zyeeda.cdeio.commons.organization.entity;

exports.createService = function() {
    return {
        saveEvaluate: mark('managers', WorkPackage, WorkEvaluate, Account, TodoInfo).mark('tx').on(function (packageMgr, evaluateMgr, accountMgr, infoMgr, data) {
            var workPackage, evaluate, accountList = [], account, toDoInfo;

            workPackage = packageMgr.find(data.workPackageId);
            for (v in data.accounts){
                account = accountMgr.find(data.accounts[v].id);
                accountList.push(account);

                toDoInfo = new TodoInfo();
                toDoInfo.workPackage = workPackage;
                toDoInfo.packageCode = workPackage.code;
                toDoInfo.packageName = workPackage.name;
                toDoInfo.packageEndTime = workPackage.endTime;
                toDoInfo.packageModel = workPackage.model;
                toDoInfo.account = account;
                toDoInfo.accountName = account.accountName;
                toDoInfo.status = '1';
                infoMgr.save(toDoInfo);
            }

            evaluate = new WorkEvaluate();
            evaluate.workPackage = workPackage;
            evaluate.accounts = accountList;
            evaluateMgr.save(evaluate);

            workPackage.status = '2';
        })
    };
};
