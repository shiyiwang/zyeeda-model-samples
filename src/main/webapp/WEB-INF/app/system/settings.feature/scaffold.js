var config = require('cdeio/config');
var {createService} = require('cdeio/service');
var {json} = require('cdeio/response');
var {SettingItem} = com.zyeeda.cdeio.commons.resource.entity;
var {SecurityUtils} = org.apache.shiro;
var logger = require('ringo/logging').getLogger(module.id);

var getSession = function() {
    var subject = SecurityUtils.getSubject(),
        p = subject.getPrincipal(),
        service = createService(),
        isAdmin = false,
        i,
        j;

    logger.debug('current user = {}', p);

    if (p == null) {
        return null;
    }

    if('admin' === (p.getAccountName()).toLowerCase()){
    	isAdmin = true;
    }

    o = {
        accountName: p.getAccountName(),
        realName: p.getRealName(),
        email: p.getEmail(),
        isAdmin: isAdmin,
        roles: [],
        permissions: {},
        authenticated: subject.isAuthenticated()
    };

    roles = service.findRolesByAccountId(null, {id: p.id})
    for (i = 0; i < roles.size(); i ++) {
        role = roles.get(i);
        o.roles.push(role.name);
        for (j = role.permissions.iterator(); j.hasNext(); ) {
            permission = j.next();
            o.permissions[permission.value] = true;
        }
    }

    return o;
};


exports.filters = {
    defaults: {
        exclude: {
            settingFilter: ''
        }
    }
};

exports.doWithRouter = function(router) {
    router.get('all', function(request) {
        var baseService = createService(),
            manager = baseService.createManager(SettingItem),
            list = manager.getAll(),
            result = {}, key, item,
            frontendSettings = config.frontendSettings;

        for (key in frontendSettings) {
            result[key] = frontendSettings[key];
        }

        for (key = 0; key < list.size(); key ++) {
            item = list.get(key);
            result[item.name] = item.value;
        }

        if (config.cdeio.disableAuthz !== true) {
            result.session = getSession();
        }
        return json(result);
    });
};
