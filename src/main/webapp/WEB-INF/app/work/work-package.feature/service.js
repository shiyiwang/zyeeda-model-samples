var {mark}              = require('cdeio/mark');
var {createService}     = require('cdeio/service');
var {createManager}     = require('cdeio/manager');

var {WorkPackage}        = com.zyeeda.model.work.entity;
var {AccountExtension}   = com.zyeeda.model.system.entity;
var {EntityMetaResolver} = com.zyeeda.cdeio.web.scaffold;

exports.createService = function() {
    return {
        //自动生成编号
        autoGenerateNo: mark('managers', WorkPackage).mark('tx').on(function (workPackageMgr) {
            var code,
                temp,
                codeStart = "SPTL";

            code = workPackageMgr.getMaxWorkPackageCode({}, 1);
            temp = (null == code) ? 1 : Number(code.replace(codeStart, "")) + 1;

            while(temp.toString().length < 3){
                temp = "0" + temp;
            }

            return codeStart + temp;
        }),
        //根据Id查询
        getById: mark('managers', WorkPackage).mark('tx').on(function (workPackageMgr, id) {
            return workPackageMgr.find(id);
        })

    };
};
