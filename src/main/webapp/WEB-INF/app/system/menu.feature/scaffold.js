var {json} = require('cdeio/response');
var {mark} = require('cdeio/mark');
var {SecurityUtils} = org.apache.shiro;

exports.style = 'tree';

exports.enableFrontendExtension = true;

exports.filters = {
    defaults: {
        '!menuItemFilter': ['children', 'parent(1)']
    }
};

exports.labels = {
    name: '名称',
    description: '描述',
    path: '标识',
    iconClass: '图标',
    option: '配置'
};

exports.fieldGroups = {
    DEFAULT: [
        'name',
        'description',
        'path',
        'iconClass', {
            name: 'option',
            type: 'textarea',
            rowspan: 5
        }
    ]
};

exports.doWithRouter = function(router) {
    router.get('/all', mark('services', 'system/menu').on(function(service) {
        var subject = SecurityUtils.getSubject(),
        p = subject.getPrincipal();
        return json({results: service.list(p.id)}, exports.filters.defaults);
    }));
};
