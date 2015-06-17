var {mark}              = require('cdeio/mark');
var {createService}     = require('cdeio/service');
var {createManager}     = require('cdeio/manager');

var {TaskInfo}           = com.zyeeda.model.work.entity;

var {EntityMetaResolver} = com.zyeeda.cdeio.web.scaffold;
var {SecurityUtils}      = org.apache.shiro;

exports.createService = function() {
    return {
        list: mark('beans', EntityMetaResolver).mark('managers').mark('tx').on(function (resolver, entity, options) {
            var meta = resolver.resolveEntity(TaskInfo),
                taskInfoMgr = createManager(meta.entityClass),
                currentUser = SecurityUtils.getSubject().getPrincipal();

            options.filters = options.filters || [];

            options.filters.push(['eq', 'account.id', currentUser.id]);

            if (options.filters) {
                fetchResult = taskInfoMgr.findByEntity(options);
            } else {
                fetchResult = taskInfoMgr.findByExample(entity, options);
            }

            return fetchResult;
        })
    };
};
