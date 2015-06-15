var {mark}          = require('cdeio/mark');
var {createService} = require('cdeio/service');
var logger          = require('ringo/logging').getLogger(module.id);

var {ProcessDefinition}  = com.zyeeda.model.process.entity;
var {ProcessSettingItem} = com.zyeeda.model.process.entity;

exports.createService = function () {
	return {
		isExists: mark('managers', ProcessDefinition).on(function (processDefiMgr, entity) {
            var procDefiCount;

            if(entity.id){
                procDefiCount = processDefiMgr.getProcessDefinitionCountByMarkAndId({ businessMark: entity.businessDefinition.businessMark, busiDefiId: entity.id }, 1);
            }else{
                procDefiCount = processDefiMgr.getProcessDefinitionCountByMark({ businessMark: entity.businessDefinition.businessMark }, 1);
            }

            return procDefiCount > 0;
        }),
        removeRelatedInfo: mark('managers', ProcessSettingItem).on(function (proceSettMgr, entity) {
            var processSettings = proceSettMgr.getProcSettingItemsByProcDefiId({processDefinitionId: entity.id}),
                i;

            // remove processSettingItem
            for(i = 0; i < processSettings.size(); i++){
                proceSettMgr.remove(processSettings.get(i));
            }
        }),
        getProDefiCountByBusiMark: mark('managers', ProcessDefinition).on(function (processDefiMgr, businessMark) {
            var procDefiCount;

            procDefiCount = processDefiMgr.getProcessDefinitionCountByMark({ businessMark: businessMark }, 1);

            return procDefiCount;
        }),
	};
};
