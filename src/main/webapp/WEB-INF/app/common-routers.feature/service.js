var logger          = require('ringo/logging').getLogger(module.id);

var {mark} 			= require('cdeio/mark');
var {json}          = require('cdeio/response');
var {SecurityUtils}      = org.apache.shiro;

var {Department}         = com.zyeeda.cdeio.commons.organization.entity;
var {Account}            = com.zyeeda.cdeio.commons.organization.entity;
var {TodoInfo}           = com.zyeeda.model.work.entity;
var {TaskInfo}           = com.zyeeda.model.work.entity;
var {EvaluateInfo}       = com.zyeeda.model.work.entity;
var {WorkPackage}        = com.zyeeda.model.work.entity;

exports.createService = function () {
    return {
        getTodoInfosByWorkPackageId: mark('managers', TodoInfo).mark('tx').on(function (todoInfoMgr, entryId){
            return todoInfoMgr.getTodoInfoByWorkPackageId({workPackageId: entryId});
        }),
        getTaskInfosByWorkPackageId: mark('managers', TaskInfo).mark('tx').on(function (taskMgr, entryId){
            return taskMgr.getTaskInfosByWorkPackageId({workPackageId: entryId});
        }),
        getEvaluateListsByWorkPackageId: mark('managers', EvaluateInfo, WorkPackage, Account).mark('tx').on(function (evaluateInfoMgr, workPackageMgr, accountMgr, entryId){
            var currentUser,
                currentRole,
                currentRoles,
                currRolesIt,
                workPackage;

            //获取当前用户所有的角色
            currentUser = SecurityUtils.getSubject().getPrincipal();
            currentRoles = accountMgr.find(currentUser.id).roles;
            currRolesIt = currentRoles.iterator();

            //判断当前用户是否是项目负责人
            while(currRolesIt.hasNext()) {
                currentRole = currRolesIt.next();
                if ("项目负责人" === currentRole.name){
                    return evaluateInfoMgr.getEvaluateListsByWorkPackageId({workPackageId: entryId});
                }
            }

            workPackage = workPackageMgr.find(entryId);
            //所有评估用户都完成评估
            if ("3" === workPackage.status || "4" === workPackage.status){
                return evaluateInfoMgr.getEvaluateListsByWorkPackageId({workPackageId: entryId});
            }

            return evaluateInfoMgr.getEvaluateListsByWorkPackageIdAndAccountId({workPackageId: entryId, accountId: currentUser.id});
        })
	};
};
