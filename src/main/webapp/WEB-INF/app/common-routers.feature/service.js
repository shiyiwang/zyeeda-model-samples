var logger          = require('ringo/logging').getLogger(module.id);

var {mark} 			= require('cdeio/mark');
var {json}          = require('cdeio/response');

var {Department}         = com.zyeeda.cdeio.commons.organization.entity;
var {TodoInfo}           = com.zyeeda.model.work.entity;

exports.createService = function () {
    return {
        getTodoInfoByWorkPackageId: mark('managers', TodoInfo).mark('tx').on(function (todoInfoMgr, entryId){
            return todoInfoMgr.getTodoInfoByWorkPackageId({workPackageId: entryId});
        })
	};
};
