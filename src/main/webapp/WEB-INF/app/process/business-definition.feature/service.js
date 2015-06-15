var {mark}          = require('cdeio/mark');
var {createService} = require('cdeio/service');
var logger          = require('ringo/logging').getLogger(module.id);

var {BusinessDefinition} = com.zyeeda.model.process.entity;

exports.createService = function () {
	return {
		isExists: mark('managers', BusinessDefinition).on(function (busiDefiMgr, entity) {
            var busiDefiCount;

            if(entity.id){
                busiDefiCount = busiDefiMgr.getBusinessDefinitionCountByMarkAndId({ busiDefiMark: entity.businessMark, busiDefiId: entity.id }, 1);
            }else{
                busiDefiCount = busiDefiMgr.getBusinessDefinitionCountByMark({ busiDefiMark: entity.businessMark }, 1);
            }

            return busiDefiCount > 0;
        }),
	};
};
