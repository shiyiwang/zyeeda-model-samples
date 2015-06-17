var _               = require('underscore');
var logger          = require('ringo/logging').getLogger(module.id);
var {SecurityUtils} = org.apache.shiro;

var {json, error, html} = require('cdeio/response');
var {mark}              = require('cdeio/mark');

var {BCrypt}          = com.zyeeda.cdeio.commons.crypto;
var {Account, Gender} = com.zyeeda.cdeio.commons.organization.entity;
var {Update}          = com.zyeeda.cdeio.validation.group;
var {createService}   = require('system/accounts.feature/service');

exports.service = function(service){
    return _.extend(service, createService());
};

exports.filters = {
    defaults: {
        '!accountFilter': ['password', 'password2'],
        '!departmentFilter': ['accounts', 'children', 'parent(1)'],
        '!roleFilter': ['accounts', 'permissions']
    },
    userpermissions: {
        '!accountFilter': ['password', 'password2'],
        '!departmentFilter': ['accounts', 'children', 'parent(1)'],
        '!roleFilter': ['accounts'],
        '!permissionFilter': ['roles']
    },
    get: {
        '!accountFilter': ['password', 'password2'],
        '!departmentFilter': ['accounts', 'children', 'parent(1)'],
        '!roleFilter': ['accounts'],
        '!permissionFilter': ['roles']
    }
};

exports.haveDataLevel = false;

exports.haveFilter = true;

exports.enableFrontendExtension = true;
exports.style = 'grid';

exports.entityLabel = '账户';
exports.labels = {
    id: 'ID',
    realName: '姓名',
    accountName: '账户名',
    password: '密码',
    password2: '重复密码',
    email: '邮箱',
    mobile: '手机',
    telephone: '电话',
    disabled: '状态',
    oldPassword: '原密码',
    newPassword: '新密码',
    newPassword2: '重复密码',
    department: '部门',
    'department.id': '部门',
    'department.name': '部门',
    dataLevel: '数据权限'
};

exports.fieldGroups = {
    baseInfo: [
        'accountName', 'email'
    ],
    pwdInfo: [{
        name: 'password',
        type: 'password'
    }, {
        name: 'password2',
        type: 'password'
    }],
    addExtInfo: ['realName', 'department', 'mobile', 'telephone',
        {name: 'dataLevel', type: 'dropdown', defaultValue: '2',
            source: [
                {id: '1', text: '一级'},
                {id: '2', text: '二级'}
            ]
        },
        {name: 'disabled', type: 'dropdown', defaultValue: 'false',
            source: [
                {id: 'true', text: '禁用'},
                {id: 'false', text: '启用'}
            ]
        }
    ],
    editExtInfo: ['realName', 'department', 'mobile', 'telephone',
        {name: 'dataLevel', type: 'dropdown',
            source: [
                {id: '1', text: '一级'},
                {id: '2', text: '二级'}
            ]
        },
        {name: 'disabled', type: 'dropdown', defaultValue: 'false',
            source: [
                {id: 'true', text: '禁用'},
                {id: 'false', text: '启用'}
            ]
        }
    ],
    roles: [{
        label: '角色', name: 'roles', type: 'inline-grid', colspan: 2, multiple: true, crossPage: true
    }],
    editPwdInfo: [
        {name: 'oldPassword', type: 'password', required: true, validations: {rules: {required: true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}}},
        {name: 'newPassword', type: 'password', required: true, validations: {rules: {required: true, rangelength:[6, 60]}, messages: {required: '不能为空', rangelength:'个数必须在6和60之间'}}},
        {name: 'newPassword2', type: 'password', required: true, validations: {rules: {required: true, equalTo: 'newPassword'}, messages: {required: '不能为空', equalTo: '不匹配'}}}
    ],
    filter: [
        'realName', 'accountName',
        {name: 'disabled', type: 'dropdown',
            source: [
                {id: 'true', text: '禁用'},
                {id: 'false', text: '启用'}
            ]
        },
        'department.name'
    ]
};

exports.feature = {
    views: ['form:changePassword']
};

exports.forms = {
    edit: {
        groups: [{
            name: 'baseInfo',
            columns: 2
        }, {
            name: 'editExtInfo',
            columns: 2
        }, 'roles']
    },
    show: {
        groups: [{
            name: 'baseInfo',
            columns: 2
        }, {
            name: 'addExtInfo',
            columns: 2
        }, 'roles']
    },
    add: {
        groups: [{
            name: 'baseInfo',
            columns: 2
        }, {
            name: 'pwdInfo',
            columns: 2
        }, {
            name: 'addExtInfo',
            columns: 2
        }, 'roles']
    },
    changePassword: {
        size: 'mini',
        groups: ['editPwdInfo']
    },
    filter: {
        groups: [{
            name: 'filter',
            columns: 4
        }]
    }
};

exports.grid = {
    columns: [
        { name: 'realName', sortable: false },
        'accountName', 'email', 'mobile',
        { name: 'disabled', type: 'boolean', renderer: 'disabledRenderer' },
        { name: 'department.name', header: '部门', defaultContent: '', sortable: false }
    ],
    filterToolbar: true,
    events: {
        'system/departments#tree:onClick': 'departmentChanged'
    },
    numberColumn: true
};

exports['inline-grid'] = {
    columns: [
        { name: 'realName', sortable: false },
        'accountName', 'email', 'mobile',
        { name: 'department.name', header: '部门', defaultContent: '', sortable: false }
    ]
};

exports.picker = {
    grid: {
        columns: [
            { name: 'realName', header: '姓名', width: 70, filter: 'text' },
            { name: 'accountName', header: '账户名', width: 130, filter: 'text' },
            { name: 'email', header: '邮箱', filter: 'text' },
            { name: 'mobile', header: '手机', filter: 'text' },
            { name: 'department.name', header: '部门', defaultContent: '', sortable: false, filter: 'text' }
        ]
    },
    callback: 'accountPickerCallback',
    afterPickerConfirm: 'afterAccountPickerConfirm'
};

exports.operators = {
    changePassword: { label: '修改密码', icon: 'icon-key', style: 'btn-pink', group: '20-selected' }
};

exports.validators = {
    update: {
        defaults: function (context, account, request) {
            if (account.getDisabled() === true
                    && account.getAccountName() === SecurityUtils.getSubject().getPrincipal().getAccountName()) {
                context.addViolation({ message: '不能禁用当前用户' });
            }
        }
    },

    remove: {
        defaults: function (context, account, request) {
            if (account.getAccountName() === SecurityUtils.getSubject().getPrincipal().getAccountName()) {
                context.addViolation({ message: '不能删除当前登录的用户!' });
            }
        }
    },

    batchRemove: {
        defaults: function (context, accounts, request) {
            if (accounts.length > 2) {
                context.addViolation({ message: '不能同时删除两条以上的数据' });
            }
        }
    }
};

exports.hooks = {
    beforeCreate: {
    	defaults: mark('services', 'system/accounts').on(function (accountSvc, entity) {
            accountSvc.hashPassword(entity);
        })
    },

    beforeUpdate: {
        changePassword: mark('services', 'system/accounts').on(function (accountSvc, account, request) {
            accountSvc.hashPassword(account);
        }),

        enable: mark('services', 'system/accounts').on(function (accountSvc, account) {
            accountSvc.enableAccount(account);
        }),

        disable: mark('services', 'system/accounts').on(function (accountSvc, account) {
            accountSvc.disableAccount(account);
        })
    },

    beforeRemove: {
        defaults: mark('services', 'system/accounts').on(function (accountSvc, account){
            accountSvc.removeAcountRole(account);
            accountSvc.removeExtension(account);
        })
    }

    // afterCreate: {
    // 	defaults: mark('services','system/jms').on(function (jmsService, account) {
    //         var msg = {resource: 'account', type: 'create',	content: account};
    //         json(msg, exports.filters.defaults).body.forEach(function(str){
    //             jmsService.sendMsg(str);
    //         })
    //     })
    // },

    // afterUpdate: {
    // 	defaults: mark('services','system/jms').on(function (jmsService, account) {
    //         var msg = {resource: 'account', type: 'update',	content: account};
    //         json(msg, exports.filters.defaults).body.forEach(function(str){
    //             jmsService.sendMsg(str);
    //         })
    //     })
    // },

    // afterRemove: {
    //     defaults: mark('services','system/jms').on(function (jmsService, account) {
    //         var msg = {resource: 'account', type: 'remove',	content: account};
    //         json(msg, exports.filters.defaults).body.forEach(function(str){
    //             jmsService.sendMsg(str);
    //         })
    //     })
    // }
};

exports.doWithRouter = function(router) {
    router.get('/sync/:path', mark('services', 'system/accounts').on(function (accountSvc, request, path) {
        var results;
        if(!path) {
            return html('notfound!');
        }else if(path.indexOf(',') !== -1) {
            results = accountSvc.getAccounts(path, true);
        }else {
            results = accountSvc.getAccounts(path, false);
        }
        return json(results, exports.filters.defaults);
    }));

    router.put('/password', mark('services', 'system/accounts').on(function (accountSvc, request) {
    	var data = request.params,
            result = accountSvc.changePassword(data),
            filter = exports.filters.defaults;

        if (result.violations) {
            return json(result, _.extend({ status: 422 }, filter));
        }

        return json(result, filter);
    }));

    router.get('/roles', mark('services', 'system/accounts').on(function (accountSvc, request) {
        return json(accountSvc.getRoles(), exports.filters.defaults);
    }));

    router.get('/userpermissions', mark('services', 'system/accounts').on(function (accountSvc, request) {
        return json(accountSvc.getUserPermissions(), exports.filters.userpermissions);
    }));

    router.get('/update-old-datalevel', mark('services', 'system/accounts').on(function (accountSvc, request) {
        accountSvc.updateOldDataLevel();

        return json({flag: true});
    }));

    router.get('/get-datalevel-by-account-id', mark('services', 'system/accounts').on(function (accountSvc, request) {
        var accountId,
            result;

        accountId = request.params.accountId;

        result = accountSvc.getAccountDataLevel(accountId);

        return json({dataLevel: result.dataLevel});
    }));

    router.put('/update-account-datalevel', mark('services', 'system/accounts').on(function (accountSvc, request) {
        var account;

        account = request.params;

        accountSvc.updateAccountDataLevel(account);

        return json({flag: true});
    }));
};
