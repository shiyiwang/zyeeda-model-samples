var _               = require('underscore');
var {mark}          = require('cdeio/mark');
var logger          = require('ringo/logging').getLogger(module.id);
var config          = require('cdeio/config');
var {join}          = require('cdeio/util/paths');
var fs              = require('fs');
var service         = require('cdeio/scaffold/service');

var {ArrayList}        = java.util;
var {HashMap}          = java.util;
var {Date}             = java.util;
var {SimpleDateFormat} = java.text;

var {XLSTransformer}   = net.sf.jxls.transformer;

exports.createService = function() {
    return {
		dealParameters: function (options, service, entityClass) {
			var orderStr, orderByObj = {}, orderColumn, result;

            options.filters = [];
            options.orderBy = [];

            options._filters = options._filters || [];

            _.each(options._filters, function(v, i){
                options.filters.push(v);
            });

            if(options._order){
                orderStr = options._order;

                orderColumn = orderStr.substring(0, orderStr.lastIndexOf("-"));
                orderByObj[orderColumn] = orderStr.substring(orderStr.lastIndexOf("-") + 1);

                options.orderBy.push(orderByObj);
            }

            if(service.list){
                result = service.list(entityClass, options);
                options.dataList = result.results;
            }

            return options;
		},
        exportExcel: function (beans, exportModule, exportFileName){
            var ext = 'xls',
                transformer,
                templateFileName,
                destFilePath,
                destFileName,
                filename,
                dataFormat = new SimpleDateFormat('yyyyMMddHHmmssSSS');

            templateFileName = join(config.getOptionInProperties('cdeio.webapp.path'), 'module/export', exportModule);

            filename = exportFileName + '_' + dataFormat.format(new Date()) + '.' + ext;
            destFilePath = join(config.getOptionInProperties('cdeio.upload.path'), 'export');
            destFileName = join(destFilePath, filename);

            if(!fs.exists(destFilePath)){
                fs.makeTree(destFilePath);
            }

            transformer = new XLSTransformer();

            try {
                transformer.transformXLS(templateFileName, beans, destFileName);
            } catch (e) {
                logger.error('export error info: ', e);
                return {flag: false};
            }
            return {flag: true, filename: filename};
        },
        convertEntityToObj: function (entity){
            var field, fields, fieldVal, vo, j;

            vo = {};

            fields = entity.getClass().getDeclaredFields();
            for (j = 0; j < fields.length; j++) {
                field = fields[j];

                if('serialVersionUID' === field.getName()){
                    continue;
                }

                field.setAccessible(true);
                fieldVal = field.get(entity);
                field.setAccessible(false);
                vo[field.getName() + ''] = fieldVal;
            }

            return vo;
        },
        listEntities: function (options, meta){
            var entities;

            entities = new ArrayList();

            if(options.dataList){
                entities = options.dataList;
            }else{
                entities = service.createService(meta.entityClass, meta).list(meta.entityClass, options);
            }

            return entities;
        }
    };
};
