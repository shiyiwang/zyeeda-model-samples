var logger          = require('ringo/logging').getLogger(module.id);

var {json}          = require('cdeio/response');
var {mark}          = require('cdeio/mark');
var {createRouter}  = require('cdeio/router');
var {cdeio}         = require('config');
var _               = require('underscore');
var config          = require('cdeio/config');
var {join}          = require('cdeio/util/paths');

var {JSONArray}     = org.json;
var {JSONObject}    = org.json;

var {BufferedReader}    = java.io;
var {InputStream}       = java.io;
var {InputStreamReader} = java.io;
var {StringBuilder}     = java.lang;
var {HashSet}           = java.util;
var {File}              =java.io;

var router = exports.router = createRouter();

exports.filters = {
    currUserInfoFilter: {
        '!companyFilter': ['children', 'parent(1)', 'equipmentLedgers']
    },
    allDeptsAndAccountsFilter: {
        '!accountFilter': ['roles'],
        '!departmentFilter': ['children', 'accounts']
    },
    allCompanysFilter: {
        '!companyFilter': ['children', 'parent(1)', 'equipmentLedgers']
    },
    entryApprovalHistorysFilter: {
        'approvalHistoryFilter': ['id', 'taskDesc', 'operateTime', 'comment', 'suggestion', 'operator'],
        'accountFilter': ['id', 'realName']
    },
    allEquipmentLedgersOutOfCollectorFilter: {
        '!equipmentLedgerFilter': [ 'scrapApply', 'returnApply', 'equipmentDelivery', 'equipmentStorage', 'auxEnergyMeters', 'curSecondaryDrops', 'volSecondaryDrops', 'executionInfos','equipmentLedgerOperatingDiarys', 'project', 'defects', 'mainEnergyMeters', 'voltageTransformers', 'currentTransformers', 'meterSetting', 'companyEquipmentledgers', 'companys', 'allocateApply'],
        '!companyFilter': ['children', 'parent(1)', 'equipmentLedgers'],
        '!expEquipmentFilter': ['photo', 'expInfos', 'verificationCertificate']
    },
    allExecInfosFilter: {
        '!executionInfoFilter': ['plan'],
        '!equipmentLedgerFilter': ['project', 'equipmentDelivery', 'returnApply', 'scrapApply', 'equipmentStorage', 'meterSetting', 'defects', 'mainEnergyMeters', 'auxEnergyMeters', 'voltageTransformers', 'currentTransformers', 'volSecondaryDrops', 'curSecondaryDrops','executionInfos', 'companyEquipmentledgers', 'equipmentLedgerOperatingDiarys', 'companys', 'allocateApply'],
        '!companyFilter': ['children', 'equipmentLedgers'],
        '!expEquipmentFilter': ['expInfos', 'photo'],
        '!energyMeterFilter': ['executionInfo'],
        '!currentTransformerFilter': ['executionInfo'],
        '!voltageTransformerFilter': ['executionInfo'],
        '!secondaryDropFilter': ['executionInfo']
    },
    todoInfoFilter: {
        '!todoInfoFilter': ['account', 'workPackage'],
        '!workPackageFilter': ['evaluateInfos', 'todoInfos'],
        '!accountFilter': ['department', 'roles']
    }
};

// 获取当前用户所属单位(返回台帐部门对象)
router.get('/get-curr-unit', mark('services', 'common-routers').on(function (commSvc, request) {
    return json(commSvc.getCurrentUnit(), exports.filters.currUserInfoFilter);
}));

// 获取所有单位(返回台帐部门对象)
router.get('/get-all-company-unit', mark('services', 'common-routers').on(function (commSvc, request) {
    return json({results: commSvc.getAllCompanyUnit()});
}));
// 获取所有所有模板
router.get('/get-download-module', mark('services', 'common-routers').on(function (commSvc, request) {
    var results = [], webappPath = config.getOptionInProperties('cdeio.webapp.path'),
        path = join(webappPath, 'module/laboratory-meter');
    var fileDir = new File(path);

    if (fileDir.isDirectory()) {
        var files = fileDir.listFiles();
        for (var i = 0; i < files.length; i++) {
            var currFile = files[i];
            if(currFile.isFile()){
                results.push(currFile.getName());
            }
        }
    }
    return json({results: results});
}));
// 根据文件名称删除指定模板
router.get('/delete-download-module-by-file-name', mark('services', 'common-routers').on(function (commSvc, request) {
    var data = request.params,results = [],
        webappPath = config.getOptionInProperties('cdeio.webapp.path'),
        path = join(webappPath, 'module/laboratory-meter/' + data.fileName);

    var fileDir = new File(path);

    if (fileDir.isFile() && fileDir.exists()) {
        fileDir.delete();
        return json({flag: true});
    }
    return json({flag: false});
}));
// 根据业务数据 id 查询审批历史
router.get('/get-entry-approval-history', mark('services', 'common-routers').on(function (commSvc, request) {
    var entryId = request.params.selectedDataId, results = [];
    var approvalHistorys = commSvc.getEntryApprovalHistory(entryId);
    var processInstance = commSvc.getProcessInstance(entryId),
        businessMark, entity;
    if (processInstance.size() !== 0) {
        var settingItems = processInstance.get(0).processDefinition.settingItems;
        var flowStatus, departmentId;
        //已审批的记录
        for (var i = 0; i < approvalHistorys.size(); i++) {
            var approvalHistory = approvalHistorys.get(i);
            businessMark = approvalHistory.businessDefinition.businessMark;
            if ('Defect' === businessMark) {
                entity = commSvc.getDefectById(entryId);
            }
            var processSettingItem = approvalHistory.processTaskInfo.processSettingItem;
            departmentId = approvalHistory.operator.department.id;
            results.push({index: i + 1, taskDesc: approvalHistory.taskDesc, operateTime: approvalHistory.operateTime, comment: approvalHistory.comment, suggestion: approvalHistory.suggestion, operator: approvalHistory.operator.realName + ','});
        }
        if (approvalHistorys.size() > 1) {
            flowStatus = approvalHistorys.get(approvalHistorys.size() - 1).processTaskInfo.processSettingItem.flowStatus;
        } else {
            flowStatus = 0;
        }
        //未审批的记录
        for (var c =  Number(flowStatus); c < settingItems.size(); c++) {
            var processSettingItem = settingItems.get(c);
            var operator = '';
            var roles = cdeio.useOwnUnitProcessTaskRoles;
            var currentRoles = new HashSet();

            for (var v = 0; v < processSettingItem.roles.size(); v++) {
                var role = processSettingItem.roles.get(v);
                var status = false;
                for (var k = 0; k < roles.length; k++) {
                    if (role.name === roles[k]) {
                        status = true;
                        //根据部门ID和角色ID查找所以人员
                        var xxx = commSvc.getAccountsByDepartmentIdAndRoleId(departmentId, role.id);
                        for (var y = 0; y < xxx.size(); y++) {
                            operator = operator + xxx.get(y).realName + ',';
                        }
                        break;
                    }
                }
                if (status === false) {
                    for (var y = 0; y < role.accounts.size(); y++) {
                        operator = operator + role.accounts.get(y).realName + ',';
                    }
                }
            }
            for (var b = 0; b < processSettingItem.accounts.size(); b++) {
                operator = operator + processSettingItem.accounts.get(b).realName + ',';
            }
            for (var n = 0; n < processSettingItem.departments.size(); n++) {
                var department = processSettingItem.departments.get(n);
                for (var j = 0; j < department.accounts.size(); j++) {
                    operator = operator + department.accounts.get(j).name + ',';
                }
            }

            results.push({index: c, taskDesc: processSettingItem.flowStatusDesc, operateTime: '在办', comment: '', suggestion: '', operator: operator});
        }
    }
    if ('Defect' === businessMark) {
        if (!entity.isMaster) {
            return json({results: _.filter(results, function(result){ return result.taskDesc === '上报' || result.taskDesc === '变电班组负责人审核'; })});
        }
    }

    return json({results: results});
}));

// 用于离线系统获取用户部门数据
router.get('/get-depts-accounts-from-online', mark('services', 'common-routers').on(function (commSvc, request) {
    var departments, accounts, data;

    data = request.params;
    departments = commSvc.getAllDepartments();
    accounts = commSvc.getAllAccounts();

    return json([{depts: departments}, {accounts: accounts}], exports.filters.allDeptsAndAccountsFilter);
}));

// 用于离线系统获取单位树台帐数据
router.get('/get-companys-from-online', mark('services', 'common-routers').on(function (commSvc, request) {
    var companys,
        updateTime;

    updateTime = request.params.updateTime;

    companys = commSvc.getAllCompanys(updateTime);

    return json([{companys: companys}], exports.filters.allCompanysFilter);
}));

// 用于离线系统获取用户部门角色以及单位树台帐数据
router.get('/get-equipments-from-online', mark('services', 'common-routers').on(function (commSvc, request) {
    var equipmentLedgers,
        updateTime;

    updateTime = request.params.updateTime;

    equipmentLedgers = commSvc.getAllEquipmentLedgersOutOfCollector(updateTime);

    return json([{energyTransformers: equipmentLedgers["energyTransformers"]}, {secondDrops: equipmentLedgers["secondDrops"]}, {expEquipments: equipmentLedgers["expEquipments"]}], exports.filters.allEquipmentLedgersOutOfCollectorFilter);
}));

//用于离线系统获取检定执行数据
router.get('/get-exec-infos-from-online', mark('services', 'common-routers').on(function (commSvc, request) {
    var execInfos;

    execInfos = commSvc.getAllExecInfos();

    return json([{execInfos: execInfos}], exports.filters.allExecInfosFilter);
}));

//用于处理离线推送的数据，更新在线系统
router.post('/deal-offline-data-to-online', mark('services', 'common-routers').on(function (commSvc, request) {
    var jsonArray,
        data;

    data = request.params;

    jsonArray = new JSONArray(data.execInfos);

    commSvc.updateExecInfos(jsonArray);

    return json({flag: true});
}));

//系统首页数据
router.get('/get-system-home-data', mark('services', 'common-routers').on(function (commSvc, request) {
    var meter, voltageTransformer, currentTransformer, defect, voltageExecInfo, currentExecInfo,defectCount, companyDefect, defectStatus, defectStatusData = [], meterData = [], voltageTransformerData = [], currentTransformerData = [], defectData = [], shallExecInfoData = [], alreadyExecInfoData = [], companyDefectData = [],
        companyMap = {
            '公司外委': 0,
            '广州局': 1,
            '贵阳局': 2,
            '南宁局': 3,
            '柳州局': 4,
            '梧州局': 5,
            '百色局': 6,
            '天生桥局': 7,
            '曲靖局': 8,
            '昆明局': 9,
            '大理局': 10
        },
        defectTypeMap = {
            1: '显示异常',
            2: '失压',
            3: '失流',
            4: '逆相序',
            5: '断相',
            6: '反向',
            7: '电压不平衡',
            8: '电流不平衡',
            9: '计量装置精度超差',
            10: '采集器软件故障',
            11: '采集器硬件故障',
            12: '通道故障',
            13: '时钟故障',
            14: '电池欠压',
            15: '按键故障',
            16: '主站软件故障',
            17: '主站硬件故障',
            18: '其他'
        },
        defectTypeColor = {
            1: '#F0E68C',
            2: '#FFC1C1',
            3: '#FF83FA',
            4: '#FF7F00',
            5: '#8B3A62',
            6: '#D15FEE',
            7: '#999999',
            9: '#87CEFA',
            10: '#66CD00',
            11: '#43CD80',
            12: '#32CD32',
            13: '#436EEE',
            14: 'rgb(122,122,155)',
            15: 'rgb(175,216,21)',
            16: '#436EEA',
            17: '#436EEB',
            18: '#436EEC'
        };

    meter = commSvc.getMeterData();
    voltageTransformer = commSvc.getVoltageTransformerData();
    currentTransformer = commSvc.getCurrentTransformerData();
    defect = commSvc.getDefectData();
    shallExecInfo = commSvc.getShallExecInfoData();
    alreadyExecInfo = commSvc.getAlreadyExecInfoData();
    companyDefect = commSvc.getCompanyDefectData();
    defectCount = commSvc.getDefectCount();
    defectStatus = commSvc.getDefectStatusCount();

    defectStatusData.push({label: '已消缺', data: defectCount.get(0) - defectStatus.get(0)});
    defectStatusData.push({label: '未消缺', data: defectStatus.get(0)});

    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < meter.size(); j++) {
            if (i == companyMap[meter.get(j)[0]]) {
                meterData.push([i, meter.get(j)[1]]);
                break;
            } else if (j == meter.size() - 1) {
                meterData.push([i, 0]);
            }
        }
    }

    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < voltageTransformer.size(); j++) {
            if (i == companyMap[voltageTransformer.get(j)[0]]) {
                voltageTransformerData.push([i, voltageTransformer.get(j)[1]]);
                break;
            } else if (j == voltageTransformer.size() - 1) {
                voltageTransformerData.push([i, 0]);
            }
        }
    }

    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < currentTransformer.size(); j++) {
            if (i == companyMap[currentTransformer.get(j)[0]]) {
                currentTransformerData.push([i, currentTransformer.get(j)[1]]);
                break;
            } else if (j == currentTransformer.size() - 1) {
                currentTransformerData.push([i, 0]);
            }
        }
    }

    for (var i = 0; i < 11; i++) {
        for (var j = 0; j < companyDefect.size(); j++) {
            if (i == companyMap[companyDefect.get(j)[0]]) {
                companyDefectData.push({label: companyDefect.get(j)[0], data: companyDefect.get(j)[1], color: defectTypeColor[i + 1]});
                break;
            }/* else if (j == companyDefect.size() - 1) {
                companyDefectData.push([i, 0]);
            }*/
        }
    }

    for (var i = 0; i < 18; i++) {
        for (var j = 0; j < defect.size(); j++) {
            if (i == defect.get(j)[0]) {
                defectData.push({label: defectTypeMap[i + 1], data: defect.get(j)[1], color: defectTypeColor[i + 1]});
                break;
            }/* else if (j == defect.size() - 1) {
                defectData.push({label: defectTypeMap[i + 1], data: 0, color: defectTypeColor[i + 1]});
            }*/
        }
    }

    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < shallExecInfo.size(); j++) {
            if (i == shallExecInfo.get(j)[0] - 1) {
                shallExecInfoData.push([i, shallExecInfo.get(j)[1]]);
                break;
            } else if (j == shallExecInfo.size() - 1) {
                shallExecInfoData.push([i, 0]);
            }
        }
    }

    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < alreadyExecInfo.size(); j++) {
            if (i == alreadyExecInfo.get(j)[0] - 1) {
                alreadyExecInfoData.push([i, alreadyExecInfo.get(j)[1]]);
                break;
            } else if (j == alreadyExecInfo.size() - 1) {
                alreadyExecInfoData.push([i, 0]);
            }
        }
    }

    return json({meterData: meterData, voltageTransformerData: voltageTransformerData, currentTransformerData: currentTransformerData, defectData: defectData, shallExecInfoData: shallExecInfoData, alreadyExecInfoData: alreadyExecInfoData, companyDefectData: companyDefectData, defectStatusData: defectStatusData});
}));

// 获取todoInfo数据
router.get('/get-todo-info-by-work-package-id', mark('services', 'common-routers').on(function (commSvc, request) {
    var entryId = request.params.selectedDataId, results = [], todoInfos;

    todoInfos = commSvc.getTodoInfoByWorkPackageId(entryId);

    if (todoInfos.size() !== 0){
        for (var i = 0; i < todoInfos.size(); i++) {
            var todoInfo = todoInfos.get(i);
            results.push({index: i + 1, name: todoInfo.account.accountName, status: todoInfo.status});
        }
    }

    return json({results: results});
}));
