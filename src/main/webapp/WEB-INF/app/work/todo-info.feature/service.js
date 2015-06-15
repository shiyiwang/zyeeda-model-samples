var {mark}              = require('cdeio/mark');
var {createService}     = require('cdeio/service');
var {createManager}     = require('cdeio/manager');

var {TodoInfo}           = com.zyeeda.model.work.entity;
// var {Account}            = com.zyeeda.cdeio.commons.organization.entity;

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
        submitTodoInfo: mark('managers', TodoInfo).mark('tx').on(function (infoMgr, data) {
            var toDoInfo;

            toDoInfo = infoMgr.find(data.id);
            toDoInfo.status = '3';

            return toDoInfo;
        })
    };
};
