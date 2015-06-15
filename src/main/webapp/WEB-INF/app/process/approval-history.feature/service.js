var {mark}          = require('cdeio/mark');
var {createService} = require('cdeio/service');
var {createManager} = require('cdeio/manager');
var logger          = require('ringo/logging').getLogger(module.id);

var {ApprovalHistory}   = com.zyeeda.model.process.entity;

var {EntityMetaResolver}= com.zyeeda.cdeio.web.scaffold;

var {SecurityUtils} = org.apache.shiro;

exports.createService = function () {
	return {
		list: mark('beans', EntityMetaResolver).mark('tx').on(function (resolver, entity, options) {
			var user = SecurityUtils.getSubject().getPrincipal(),
                fetchResult,
                meta = resolver.resolveEntity(ApprovalHistory),
                apprHisMgr = createManager(meta.entityClass);

            options.filters = options.filters || [];
            options.orderBy = options.orderBy || [];

            // 按操作时间倒序排列
            options.orderBy.push({operateTime: 'desc'});

            // 操作用户是当前用户
            options.filters.push(['eq', 'operator.id', user.id]);
            // 是否送审操作(1: true/是,0: false/否)
            options.filters.push(['eq', 'isSendProcess', '0']);

            if (options.filters) {
                fetchResult = apprHisMgr.findByEntity(options);
            } else {
                fetchResult = apprHisMgr.findByExample(entity, options);
            }

            return fetchResult;
		})
	};
};
