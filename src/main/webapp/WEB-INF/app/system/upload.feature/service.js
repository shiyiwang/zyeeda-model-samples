var {mark}          = require('cdeio/mark');
var {createService} = require('cdeio/service');

var {Attachment}    = com.zyeeda.cdeio.commons.resource.entity;

exports.createService = function() {
    var service = {
        getAttachmentById: mark('managers', Attachment).mark('tx').on(function (attachmentMgr, id) {
            return attachmentMgr.find(id);
        })
    };
    return service;
};
