var {mark}          = require('cdeio/mark');
var {createService} = require('cdeio/service');
var {createManager} = require('cdeio/manager');
var logger          = require('ringo/logging').getLogger(module.id);
var {cdeio}         = require('config');
var _               = require('underscore');

var {ProcessTaskInfo}    = com.zyeeda.model.process.entity;
var {Account}            = com.zyeeda.cdeio.commons.organization.entity;
var {EntityMetaResolver} = com.zyeeda.cdeio.web.scaffold;

var {SecurityUtils} = org.apache.shiro;

var {HashSet}   = java.util;
var {ArrayList} = java.util;

exports.createService = function () {
	return {
		list: mark('beans', EntityMetaResolver).mark('managers', Account).mark('tx').on(function (resolver, accountMgr, entity, options) {
			var user = SecurityUtils.getSubject().getPrincipal(),
                roles = cdeio.useOwnUnitProcessTaskRoles,
                currentRole, currentRoles = new HashSet(),
                isExistRoleCurrentUser = false,
                tasks, currRolesIt, tasksIt, results = new ArrayList(),
                meta = resolver.resolveEntity(ProcessTaskInfo),
                proTasMgr = createManager(meta.entityClass);

            //获取当前用户所有的角色
            currentRoles = accountMgr.find(user.id).roles;
            currRolesIt = currentRoles.iterator();

            tasks = proTasMgr.getProcessTasksByUserId({userId: user.id, requestNo: '%' + getSearchContentByField(options.filters, 'like', 'requestNo') + '%', businessName: '%' + getSearchContentByField(options.filters, 'like', 'requestNo') + '%'});
            tasksIt = tasks.iterator();

            //判断当前用户在不在配置的角色中
            while(currRolesIt.hasNext()) {
                currentRole = currRolesIt.next();
                for (var j = 0; j < roles.length; j++) {
                    if (currentRole.name === roles[j]) {
                        isExistRoleCurrentUser = true;

                        //判断每条流程任务的提交人(submitter)是否与当前用户同一个局
                        while(tasksIt.hasNext()){
                            task = tasksIt.next();
                            //如果不是从流程任务移除任务
                            if (task.processInstance.submitter.department.path !== user.department.path) {
                                tasksIt.remove();
                            }
                        }
                        break;
                    }
                }
            }

            // 多于一页则从中挑出一页的数据单独保存
            if(tasks.size() > options.maxResults){
                for(var i = options.firstResult; i < options.firstResult + options.maxResults; i++){
                    if(i < tasks.size()){
                        results.add(tasks.get(i));
                    }
                }
            }else{
                results = tasks;
            }

            if(options.fetchCount){
                return tasks.size();
            }
            return results;
		}),
        getById: mark('managers', ProcessTaskInfo).mark('tx').on(function (procTaskMgr, id) {
            return procTaskMgr.find(id);
        })
	};
};

var getSearchContentByField = function(filters, filterType, field){
    if(filters){
        for(var i = 0; i < filters.length; i++){
            if(_.contains(filters[i], field)){
                if(filterType === 'like'){
                    return filters[i][2];
                }
            }
        }
    }
    return '';
};
