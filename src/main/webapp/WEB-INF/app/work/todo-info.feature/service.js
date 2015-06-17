var {mark}              = require('cdeio/mark');
var {createService}     = require('cdeio/service');
var {createManager}     = require('cdeio/manager');

var {TodoInfo}           = com.zyeeda.model.work.entity;
var {WorkPackage}        = com.zyeeda.model.work.entity;

var {EntityMetaResolver} = com.zyeeda.cdeio.web.scaffold;
var {SecurityUtils}      = org.apache.shiro;

exports.createService = function() {
    return {
        list: mark('beans', EntityMetaResolver).mark('managers').mark('tx').on(function (resolver, entity, options) {
            var meta = resolver.resolveEntity(TodoInfo),
                todoInfoMgr = createManager(meta.entityClass),
                currentUser = SecurityUtils.getSubject().getPrincipal();

            options.filters = options.filters || [];

            options.filters.push(['ne', 'status', '3']);
            options.filters.push(['eq', 'account.id', currentUser.id]);

            if (options.filters) {
                fetchResult = todoInfoMgr.findByEntity(options);
            } else {
                fetchResult = todoInfoMgr.findByExample(entity, options);
            }

            return fetchResult;
        }),
        submitTodoInfo: mark('managers', TodoInfo, WorkPackage).mark('tx').on(function (infoMgr, workPackageMgr, data) {
            var todoInfo, todo, workPackage, allPass = true;

            todoInfo = infoMgr.find(data.id);
            todoInfo.status = '3';

            workPackage = workPackageMgr.find(data.workPackage.id);

            for (var i = 0; i < workPackage.todoInfos.size(); i++) {
                todo = workPackage.todoInfos.get(i);
                if (todo.status == '1'){
                    allPass = false;
                }
            }
            if (allPass == true){
                workPackage.status = '3';
            }

            return todoInfo;
        })
    };
};
