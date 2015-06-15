var _               = require('underscore');
var {mark}          = require('cdeio/mark');
var logger          = require('ringo/logging').getLogger(module.id);
var {join}          = require('cdeio/util/paths');
var fs              = require('fs');
var config          = require('cdeio/config');

var {File}                  = java.io;
var {FileInputStream}       = java.io;
var {FileNotFoundException} = java.io;
var {IOException}           = java.io;
var {InputStream}           = java.io;

var {Byte}                  = java.lang;
var {String}                = java.lang;
var {Integer}               = java.lang;
var {Double}                = java.lang;
var {Long}                  = java.lang;
var {Short}                 = java.lang;
var {StringBuffer}          = java.lang;

var {Field}                 = java.lang.reflect;

var {Bigdecimal}            = java.math;

var {SimpleDateFormat}      = java.text;

var {Date}                  = java.util;
var {HashMap}               = java.util;
var {Map}                   = java.util;
var {Locale}                = java.util;
var {ArrayList}             = java.util;

var {Matcher}               = java.util.regex;
var {Pattern}               = java.util.regex;

var {HSSFCell}        = org.apache.poi.hssf.usermodel;
var HSSFDateUtil      = org.apache.poi.hssf.usermodel.HSSFDateUtil;
var {HSSFRow}         = org.apache.poi.hssf.usermodel;
var {HSSFSheet}       = org.apache.poi.hssf.usermodel;
var {HSSFWorkbook}    = org.apache.poi.hssf.usermodel;
var {POIFSFileSystem} = org.apache.poi.poifs.filesystem;

var {Attachment} = com.zyeeda.cdeio.commons.resource.entity;

/*
 * 读取Excel表格表头的内容
 * @param InputStream
 * @return String 表头内容的数组
 */
var readExcelTitle = function(is, importSetting, params) {
    var colNum,
        i,
        poifs, wb, sheet,
        row,
        titles;

    titles = [];

    try {
        poifs = new POIFSFileSystem(is);
        wb = new HSSFWorkbook(poifs);
    } catch (e) {
        new Error('导入 excel 错误，请联系系统管理员,错误信息:' + e.getMessage());
    }

    if(importSetting.module === 'equipmentLedger'){
        sheet = wb.getSheet(params.equipmentType);
    }else{
        sheet = wb.sheetAt(0);
    }

    row = sheet.getRow(0);

    // 标题总列数
    colNum = row.getPhysicalNumberOfCells();

    for (i = 0; i < colNum; i++) {
        titles.push(getCellFormatValue(row.getCell(Short.parseShort(i + '')), importSetting));
    }

    return titles;
};

/*
 * 读取Excel数据内容
 * @param InputStream
 * @return Map 包含单元格数据内容的Map对象
 */
var readExcelContent = function(is, importSetting, params) {
    var poifs, wb, sheet,
        row, rowNum, startRow, colNum, colName,
        rowDataArray, contentMap, pickerFields, specialFields,
        mappingItem, mapping,
        mappingItemSource, mappingItemSources,
        firstCell, cellValue,
        uniqueFieldValues, uniqueFieldValueMap,
        failRowIdxes, repeatRowIdxes,
        repeatIdx, repeatIdxes,
        repeatFieldIdxesMap, repeatEveryRowIdxes, repeatRowIdxesStrBuf,
        checkFlag,
        key, value, valueArr,
        i, j, k, m;

    // init some variable
    contentMap = {};
    rowDataArray = [];
    pickerFields = [];
    specialFields = [];
    uniqueFieldValues = [];
    uniqueFieldValueMap = {};
    repeatRowIdxes = [];
    failRowIdxes = [];
    repeatFieldIdxesMap = {};
    repeatRowIdxesStrBuf = new StringBuffer();

    startRow = getStartRowForModule(importSetting, params) - 1;

    try {
        poifs = new POIFSFileSystem(is);
        wb = new HSSFWorkbook(poifs);
    } catch (e) {
        new Error('导入 excel 错误,请联系系统管理员,错误信息:' + e.getMessage());
    }

    if(importSetting.module === 'equipmentLedger'){
        sheet = wb.getSheet(params.equipmentType);
    }else{
        sheet = wb.getSheetAt(0);
    }

    row = sheet.getRow(0);

    // 得到总行数
    rowNum = sheet.getLastRowNum();

    // 取到总列数
    colNum = row.getPhysicalNumberOfCells();

    // 获取导入字段配置
    mapping = getImportMappingForModule(importSetting, params);

    // 正文内容应该从第二行开始,第一行为表头的标题
    for (i = startRow; i <= rowNum; i++) {
        // init some variable
        contentMap = {};
        row = sheet.getRow(i);

        // 不为空
        if(isNotBlank(row) === true){
            firstCell = row.getCell(0);

            // 如果第一个单元格数据为空，则终止循环
            if(isBlank(firstCell) === true){
                break;
            }
        } else {
            break;
        }

        for (j = 0; j < colNum; j++) {
            for (k = 0; k < mapping.length; k++) {
                mappingItem = mapping[k];
                colName = mappingItem.name;

                if(mappingItem.column === (j + 1)){

                    cellValue = trim(getCellFormatValue(row.getCell(Short.parseShort(j + '')), importSetting));

                    // excel 内部验证唯一性字段
                    if(mappingItem.unique === true){
                        uniqueFieldValues = uniqueFieldValueMap[colName + '-' + cellValue] || [];
                        repeatEveryRowIdxes = repeatFieldIdxesMap[colName + '-' + cellValue] || [];

                        // 拿到当前数据已存在的其它行数
                        repeatIdxes = getIndexInArray(uniqueFieldValues, {idx: i, val: cellValue});

                        if(repeatIdxes.length > 0){
                            repeatEveryRowIdxes.push(repeatIdxes[0] + 1);
                            repeatEveryRowIdxes.push(i + 1);
                        }

                        repeatEveryRowIdxes = _.uniq(repeatEveryRowIdxes);

                        uniqueFieldValues.push({idx: i, val: cellValue});

                        uniqueFieldValueMap[colName + '-' + cellValue] = uniqueFieldValues;
                        repeatFieldIdxesMap[colName + '-' + cellValue] = repeatEveryRowIdxes;
                    }

                    // excel 各种数据类型验证
                    if(mappingItem.type === 'string'){
                        checkFlag = checkExcelData(mappingItem, mappingItem.type, cellValue, failRowIdxes, i);
                        if(checkFlag === true){
                            if(isBlank(cellValue)){ // excel 值为空
                                if(mappingItem.defaultValue){ // 如果有设置默认值，在 excel 单元格内容为空时使用默认值
                                    contentMap[colName] = mappingItem.defaultValue;
                                }
                            }else{
                                contentMap[colName] = cellValue;
                            }
                        }
                    }else if(mappingItem.type === 'date'){

                        // 当数据不为空时直接转换
                        if(isNotBlank(cellValue) === true){
                            try{
                                contentMap[colName] = new SimpleDateFormat(importSetting.dateFormat, Locale.US).parse(cellValue);
                            }catch(e){
                                // 保存验证失败的行数
                                if(_.contains(failRowIdxes, i) === false){
                                    failRowIdxes.push(i + 1);
                                }
                            }
                        }else{
                            if(mappingItem.isNull === false){
                                // 保存验证失败的行数
                                if(_.contains(failRowIdxes, i) === false){
                                    failRowIdxes.push(i + 1);
                                }
                            }
                        }
                    }else if(mappingItem.type === 'int'){
                        checkFlag = checkExcelData(mappingItem, mappingItem.type, cellValue, failRowIdxes, i);
                        if(checkFlag === true){
                            if(cellValue.lastIndexOf('.') > 0){
                                contentMap[colName] = new Integer(cellValue.substring(0, cellValue.lastIndexOf('.')));
                            }else{
                                contentMap[colName] = new Integer(0);
                            }
                        }
                    }else if(mappingItem.type === 'double'){
                        checkFlag = checkExcelData(mappingItem, mappingItem.type, cellValue, failRowIdxes, i);
                        if(checkFlag === true){
                            contentMap[colName] = parseDouble(cellValue);
                        }
                    }else if(mappingItem.type === 'long'){
                        checkFlag = checkExcelData(mappingItem, mappingItem.type, cellValue, failRowIdxes, i);
                        if(checkFlag === true){
                            contentMap[colName] = parseLong(cellValue);
                        }
                    }else if(mappingItem.type === 'short'){
                        checkFlag = checkExcelData(mappingItem, mappingItem.type, cellValue, failRowIdxes, i);
                        if(checkFlag === true){
                            contentMap[colName] = parseShort(cellValue);
                        }
                    }else if(mappingItem.type === 'byte'){
                        checkFlag = checkExcelData(mappingItem, mappingItem.type, cellValue, failRowIdxes, i);
                        if(checkFlag === true){
                            contentMap[colName] = parseByte(cellValue);
                        }
                    }else if(mappingItem.type === 'bigdecimal'){
                        checkFlag = checkExcelData(mappingItem, mappingItem.type, cellValue, failRowIdxes, i);
                        if(checkFlag === true){
                            contentMap[colName] = parseBigDecimal(cellValue);
                        }
                    }else if(mappingItem.type === 'dropdown'){
                        checkFlag = checkExcelData(mappingItem, mappingItem.type, cellValue, failRowIdxes, i);
                        if(checkFlag === true){
                            mappingItemSources = mappingItem.source;

                            for (m = 0; m < mappingItemSources.length; m++) {
                                mappingItemSource = mappingItemSources[m];
                                if(isNotBlank(cellValue)){ // excel 值不为空
                                    if(cellValue === mappingItemSource.text){
                                        contentMap[colName] = mappingItemSource.id;
                                    }
                                }else{
                                    if(mappingItem.defaultValue){ // 如果有设置默认值，在 excel 单元格内容为空时使用默认值
                                        contentMap[colName] = mappingItem.defaultValue;
                                    }
                                }
                            }
                        }
                    }else if(mappingItem.type === 'picker'){
                        pickerFields.push({colName: cellValue, rowNum: i});
                    }else if(mappingItem.type === 'special'){
                        specialFields.push({colName: cellValue, rowNum: i});
                    }
                }
            }
        }

        rowDataArray.push(contentMap);
    }

    // for(key in repeatFieldIdxesMap){
    //     valueArr = repeatFieldIdxesMap[key];

    //     for (m = 0; m < valueArr.length; m++) {
    //         value = valueArr[m];

    //         if(m === valueArr.length - 1){
    //             repeatRowIdxesStrBuf.append(value + '');
    //         }else{
    //             repeatRowIdxesStrBuf.append(value + '、');
    //         }
    //     }

    //     repeatRowIdxes.push(repeatRowIdxesStrBuf.toString());
    // }

    return {
        rowDataArray: rowDataArray,
        pickerFields: pickerFields,
        specialFields: specialFields,
        failRowIdxes: failRowIdxes,
        repeatRowIdxes: repeatRowIdxes,
        repeatFieldIdxesMap: repeatFieldIdxesMap
    };
};

// 获取某个值在数组中的下标
var getIndexInArray = function(array, data){
    var item,
        i,
        arrs;

    arrs = [];

    for (i = 0; i < array.length; i++) {
        item = array[i];
        if(item.val === data.val){
            arrs.push(item.idx);
        }
    }

    return arrs;
};

// 验证单元格数据
var checkExcelData = function(mappingItem, mappingItemType, cellValue, failRowIdxes, i){
    // set minLength default value
    mappingItem.minLength = mappingItem.minLength || 0;

    if(mappingItemType === 'string' || mappingItemType === 'byte'){
        // 可否为空验证不通过
        if(mappingItem.isNull === false && isNotBlank(cellValue) === false){ // 为空
            // 保存验证失败的行数
            if(_.contains(failRowIdxes, i) === false){
                failRowIdxes.push(i + 1);
            }

            // logger.error('check fail col null :' + i + ',' + mappingItem.name);
            return false;
        }else if(cellValue.length > mappingItem.maxLength){ // 长度超长
            // 保存验证失败的行数
            if(_.contains(failRowIdxes, i) === false){
                failRowIdxes.push(i + 1);
            }

            // logger.error('check fail col long :' + i + ',' + mappingItem.name);
            return false;
        }else if(cellValue.length < mappingItem.minLength){ // 长度不够
            // 保存验证失败的行数
            if(_.contains(failRowIdxes, i) === false){
                failRowIdxes.push(i + 1);
            }

            // logger.error('check fail col short :' + i + ',' + mappingItem.name);
            return false;
        }
    }else if(mappingItemType === 'dropdown'){
        // 可否为空验证不通过
        if(mappingItem.isNull === false && isNotBlank(cellValue) === false){ // 为空
            // 保存验证失败的行数
            if(_.contains(failRowIdxes, i) === false){
                failRowIdxes.push(i + 1);
            }

            // logger.error('check fail col null :' + i + ',' + mappingItem.name);
            return false;
        }
    }else if(mappingItemType === 'int' || mappingItemType === 'double' || mappingItemType === 'long' || mappingItemType === 'short' || mappingItemType === 'bigdecimal' ){
        // 可否为空验证不通过
        if(mappingItem.isNull === false && isNotBlank(cellValue) === false){ // 为空
            // 保存验证失败的行数
            if(_.contains(failRowIdxes, i) === false){
                failRowIdxes.push(i + 1);
            }

            // logger.error('check fail col null :' + i + ',' + mappingItem.name);
            return false;
        }else if(isNumeric(cellValue) === false){ // 类型不对
            // 保存验证失败的行数
            if(_.contains(failRowIdxes, i) === false){
                failRowIdxes.push(i + 1);
            }

            // logger.error('check fail col type :' + i + ',' + mappingItem.name);
            return false;
        }else if(toString(cellValue).length > mappingItem.maxLength){ // 长度超长
            // 保存验证失败的行数
            if(_.contains(failRowIdxes, i) === false){
                failRowIdxes.push(i + 1);
            }

            // logger.error('check fail col long:' + i + ',' + mappingItem.name);
            return false;
        }else if(toString(cellValue).length < mappingItem.minLength){ // 长度不够
            // 保存验证失败的行数
            if(_.contains(failRowIdxes, i) === false){
                failRowIdxes.push(i + 1);
            }

            // logger.error('check fail col short :' + i + ',' + mappingItem.name);
            return false;
        }
    }

    return true;
};

// 获取导入字段配置
var getImportMappingForModule = function(importSetting, params){
    var typeMapping, typeMappings,
        i;

    if(importSetting.module === 'equipmentLedger'){
        typeMappings = importSetting.equipmentTypeMapping;

        for (i = 0; i < typeMappings.length; i++) {
            typeMapping = typeMappings[i];
            if(typeMapping.equipmentType === params.equipmentType){
                return typeMapping.mapping;
            }
        }
    }

    return importSetting.mapping;
};

// 获取数据开始行配置
var getStartRowForModule = function(importSetting, params){
    var typeMapping, typeMappings,
        i;

    if(importSetting.module === 'equipmentLedger'){
        typeMappings = importSetting.equipmentTypeMapping;

        for (i = 0; i < typeMappings.length; i++) {
            typeMapping = typeMappings[i];
            if(typeMapping.equipmentType === params.equipmentType){
                return typeMapping.startRow || 2;
            }
        }
    }

    return importSetting.startRow || 2;
};

// 统一处理单元格数据
var getCellFormatValue = function(cell, importSetting) {
    var cellValue, date, sdf;

    cellValue = '';
    if (cell !== null) {
        // 判断当前Cell的Type
        switch (cell.getCellType()) {
        // 如果当前Cell的Type为NUMERIC
        case HSSFCell.CELL_TYPE_NUMERIC:
            cellValue = getStringCellValue(cell);
        case HSSFCell.CELL_TYPE_FORMULA: {
            // 判断当前的cell是否为Date
            if (HSSFDateUtil.isCellDateFormatted(cell)) {
                date = cell.getDateCellValue();
                sdf = new SimpleDateFormat(importSetting.dateFormat);
                cellValue = sdf.format(date);
            } else {// 如果是纯数字
                cellValue = toString(cell.getNumericCellValue());
            }
            break;
        }
        // 如果当前单元格的类型为 string
        case HSSFCell.CELL_TYPE_STRING:
            // 取得当前单元格的数据
            cellValue = cell.getRichStringCellValue().getString();
            break;
        // 默认的Cell值
        default:
            cellValue = '';
        }
    }

    return cellValue;
};

/*
 * 获取单元格数据内容为字符串类型的数据
 *
 * @param cell Excel单元格
 * @return String 单元格数据内容
 */
var getStringCellValue = function(cell) {
    var strCell;

    strCell = '';

    if (cell === null) {
        return strCell;
    }

    switch (cell.getCellType()) {
        case HSSFCell.CELL_TYPE_STRING:
            strCell = cell.getStringCellValue();
            break;
        case HSSFCell.CELL_TYPE_NUMERIC:
            strCell = toString(cell.getNumericCellValue());
            break;
        case HSSFCell.CELL_TYPE_BOOLEAN:
            strCell = toString(cell.getBooleanCellValue());
            break;
        case HSSFCell.CELL_TYPE_BLANK:
            strCell = '';
            break;
        default:
            strCell = '';
            break;
    }

    return strCell;
};

// 根据 excel 数据按照导入配置封装实体的部分属性
var fillEntity = function(rowDataArray, importSetting, entityArray){
    var rowData,
        i, key;

    for (i = 0; i < rowDataArray.length; i++) {
        rowData = rowDataArray[i];

        fillEntityFieldWithObject(entityArray[i], rowData);
    }

    return entityArray;
};

/*
 * @Description: 从 object 对象中读取值设置到指定实体的对应属性中
 * @param entity
 *            对象
 * @return entity
 * @modify
 */
var fillEntityFieldWithObject = function(entity, rowData){
    var fields, f,
        i, key,
        fieldName, fieldType;

    fields = entity.getClass().getDeclaredFields();

    for (i = 0; i < fields.length; i++) {
        f = fields[i];
        f.setAccessible(true);

        fieldName = f.getName();
        fieldType = f.getType();

        for(key in rowData){
            if(fieldName === key){
                try {
                    // TODO 判断数据类型
                    f.set(entity, rowData[key]);
                } catch (e) {
                    logger.error('系统错误，请联系系统管理员，错误信息：' + e.getMessage());
                }
            }
        }

        f.setAccessible(false);
    }

    return entity;
};

// 重命名文件
var renameFile = function(origFilePath, newFilePath){
    var origFile, newFile;

    origFile = new File(origFilePath);
    newFile = new File(newFilePath);

    origFile.renameTo(newFile);
};

// 根据附件文件路径获取附件文件存放目录
var getAttachmentDirectory = function(filePath){
    return filePath.substring(0, filePath.lastIndexOf('/') + 1);
};

// 根据附件文件路径获取附件文件名称
var getAttachmentFileName = function(filePath){
    return filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length);
};

// 根据附件 id 返回附件文件对象
var gerAttachmentFilePathByAttachmentId = mark('managers', Attachment).on(function (attamentMgr, attachmentId){
    var attachmentId, attachment,
        uploadPathPrefix, sourcePath;

    uploadPathPrefix = config.getOptionInProperties('cdeio.upload.path')

    attachment = attamentMgr.find(attachmentId);

    sourcePath = join(uploadPathPrefix, attachment.path);

    return sourcePath;
});

// 重命名文件
var renameFile = function(origFilePath, newFilePath){
    var origFile, newFile;

    origFile = new File(origFilePath);
    newFile = new File(newFilePath);

    origFile.renameTo(newFile);
};

// 根据附件 id 删除附件
var deleteAttachmentById = mark('managers', Attachment).mark('tx').on(function (attamentMgr, attachmentId){
    var attachment;

    attachment = attamentMgr.find(attachmentId);

    fs.remove(gerAttachmentFilePathByAttachmentId(attachmentId) + '.xls');

    attamentMgr.remove(attachment);
});

/*
 * @Description: 把对象转换成String
 * @param obj
 *            对象
 * @return String
 * @modify
 */
var toString = function(obj) {
    return obj === null ? "" : obj.toString();
};

/*
 * 返回一个对象的字符串,多数是处理字符串的
 * @param obj
 * @return
 */
var trim = function(obj) {
    return obj === null ? '' : toString(obj).trim();
};

/*
 * 判断参数是否不为空或空字符串
 *
 * @param obj
 * @return true:不为空,false:为空
 */
var isNotBlank = function(obj) {
    if (obj === null || "".equals(toString(obj)) || "null".equalsIgnoreCase(toString(obj))) {
        return false;
    }
    return true;
};

/*
 * 判断参数是否为空或空字符串
 *
 * @param obj
 * @return true:为空,false:不为空
 */
var isBlank = function(obj) {
    if (obj === null || "".equals(toString(obj)) || "null".equalsIgnoreCase(toString(obj))) {
        return true;
    }
    return false;
};

/*
 * 判断一个字符串是否为数值
 *
 * @param str
 *            字符串
 * @return boolean
 */
var isNumeric = function(str) {
    var pattern, matcher;

    pattern = Pattern.compile("^[+\\-]?((\\d*\\.\\d+)|(\\d+))$");
    matcher = pattern.matcher(trim(str));

    return matcher.matches();
};

/*
 * 数字字符串的整型转换
 *
 * @param str
 *            数字字符串
 * @param defaultVal
 *            默认值
 * @return 转换后的结果
 */
var parseInteger = function(str) {
    try {
        return Integer.parseInt(str);
    } catch (e) {
        return null;
    }
};

/*
 * 数字字符串的浮点型转换
 *
 * @param str
 *            数字字符串
 * @param defaultVal
 *            默认值
 * @return 转换后的结果
 */
var parseDouble = function(str) {
    try {
        return Double.parseDouble(str);
    } catch (e) {
        return null;
    }
};

/*
 * 数字字符串的浮点型转换
 *
 * @param str
 *            数字字符串
 * @param defaultVal
 *            默认值
 * @return 转换后的结果
 */
var parseLong = function(str) {
    try {
        return Long.parseLong(str);
    } catch (e) {
        return null;
    }
};

/*
 * 数字字符串的浮点型转换
 *
 * @param str
 *            数字字符串
 * @param defaultVal
 *            默认值
 * @return 转换后的结果
 */
var parseFloat = function(str) {
    try {
        return Float.parseFloat(str);
    } catch (e) {
        return null;
    }
};

/*
 * 数字字符串的短整型转换
 *
 * @param str
 *            数字字符串
 * @return 转换后的结果
 */
var parseShort = function(str) {
    try {
        return Short.parseShort(str);
    } catch (e) {
        return null;
    }
};

/*
 * 字符串的字节型转换
 *
 * @param str
 *            字符串
 * @return 转换后的结果
 */
var parseByte = function(str) {
    try {
        return Byte.parseByte(str);
    } catch (e) {
        return null;
    }
};

/*
 * 字符串的大数据类型转换
 *
 * @param str
 *            字符串
 * @return 转换后的结果
 */
var parseBigDecimal = function(str) {
    str = str || '';
    try {
        return new Bigdecimal(str);
    } catch (e) {
        return null;
    }
};

/*
 * 使用指定的模式来解析日期(时间)字符串
 * @param pattern 格式
 * @param dateStr 日期字符串
 * @return
 */
var parseSimpleDT = function(pattern, dateStr) {
    try {
        return new SimpleDateFormat(pattern, Locale.US).parse(dateStr);
    } catch (e) {
        return null;
    }
};

/*
 * 使用指定的方式来解析日期时间格式
 * @param dateStr
 * @param dateFormat
 * @return
 */
var parseDate = function(dateStr, dateFormat) {
    if(dateStr !== null && dateStr !== ""){
        return parseSimpleDT(dateFormat, dateStr);
    }else{
        return null;
    }
};

exports.createService = function() {
    return {
		importExcel: mark('managers', Attachment).on(function (attamentMgr, params, importSetting) {
            var origFilePath, newFilePath,
                i, key, rowInfo,
                titles, rowDataArray, contentMap,
                is;

            // 由于原附件无后缀名,故先重命名附件文件,加上后缀名
            origFilePath = gerAttachmentFilePathByAttachmentId(params.attachment.id);
            newFilePath = origFilePath + '.xls';
            renameFile(origFilePath, newFilePath);

            try {
                is = new FileInputStream(newFilePath);

                /*
                // 对读取Excel表格标题测试
                titles = readExcelTitle(is, importSetting, params);

                logger.error('excel 表格标题');
                for (i = 0; i < titles.length; i++) {
                    logger.error(titles[i]);
                }
                */

                // 对读取Excel表格内容测试
                rowInfo = readExcelContent(is, importSetting, params) || [];

                for (i = 0; i < rowInfo.rowDataArray.length; i++) {
                    contentMap = rowInfo.rowDataArray[i];

                    for(key in contentMap){
                        logger.error(key + ': ' + contentMap[key]);
                    }
                }

                // 删除因导入操作临时上传的附件
                // deleteAttachmentById(params.attachment.id);
            } catch (e) {
                logger.error('未找到指定文件, 错误信息: ' + e);
            }

            return {
                rowNum: rowInfo.rowDataArray.length,
                rowDataArray: rowInfo.rowDataArray,
                pickerFields: rowInfo.pickerFields,
                specialFields: rowInfo.specialFields,
                failRowIdxes: rowInfo.failRowIdxes,
                repeatRowIdxes: rowInfo.repeatRowIdxes,
                repeatFieldIdxesMap: rowInfo.repeatFieldIdxesMap
            };
        }),
        fillEntity: function(rowDataArray, importSetting, entityArray){
            var resultArray;

            resultArray = fillEntity(rowDataArray, importSetting, entityArray);

            return {entityArray: resultArray};
        }
    };
};
