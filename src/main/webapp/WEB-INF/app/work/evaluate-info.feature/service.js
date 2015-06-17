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
        saveEvaluateInfo: mark('managers', WorkPackage, EvaluateInfo, Account, TodoInfo).mark('tx').on(function (packageMgr, evaluateInfoMgr, accountMgr, todoInfoMgr, data) {
            var workPackage, evaluateInfo, account, work, workList = [], todoInfo, key, allPass = true;

            workPackage = packageMgr.find(data.workPackageId);
            account = accountMgr.find(data.accountId);
            todoInfo = todoInfoMgr.find(data.todoInfoId);
            evaluateInfo = new EvaluateInfo();

            evaluateInfo.workPackage = workPackage;
            evaluateInfo.account = account;
            evaluateInfo.accountName = account.accountName;
            evaluateInfo.workPrice = data.workPrice;
            evaluateInfo.workload = data.workload;
            evaluateInfo.expectTime = new Date(data.expectTime.replace(/-/g,   "/"));
            evaluateInfoMgr.save(evaluateInfo);

            todoInfo.status = '2';
            todoInfo.evaluateInfo = evaluateInfo;
            todoInfoMgr.save(todoInfo);
        })
    };
};
