var {mark} = require('cdeio/mark');
var {json} = require('cdeio/response');

var _               = require('underscore');
var {createService} = require('system/departments.feature/service');

exports.service = function(service){
    return _.extend(service, createService());
};

exports.haveDataLevel = false;

exports.enableFrontendExtension = true;

exports.filters = {
    defaults: {
        exclude: {
            departmentFilter: ['children', 'accounts', 'parent(1)']
        }
    },
    sub: {
        exclude: {
            departmentFilter: ['parent', 'children(1)'],
            accountFilter: ['department', 'password', 'password2']
        }
    },
    child: {
        exclude: {
            departmentFilter: ['parent'],
            accountFilter: ['department', 'password', 'password2']
        }
    }
};

exports.style = 'tree';

exports.entityLabel = '部门';
exports.labels = {
    name: '部门名称',
    parent: '上级部门',
    code: '部门编码'
};

exports['inline-grid'] = {
    columns: [
        { name: 'name'},
        { name: 'parent.name', defaultContent: '', sortable: false, header: '上级部门'}
    ]
};

// 其它业务选择数据时所用picker
exports.picker = {
    grid: {
        columns: [
            {name: 'name', header: '部门名称'},
            {name: 'parent.name', header: '上级部门'},
            {name: 'code', header: '部门编码'}
        ]
    }
};

exports.fieldGroups = {
    baseInfo: ['name', 'parent', {name: 'code', required: true}],
    editInfo: ['name', {name: 'code', required: true}]
};

exports.forms = {
    defaults: {
        groups: [{
            name: 'baseInfo'
        }],
        size: 'small'
    },
    edit: {
        groups: [{
            name: 'editInfo'
        }],
        size: 'small'
    }
};

exports.tree = {
    isAsync: false,
    root: '所有部门',
    rootNodeSetting: {iconSkin: 'rootDepartNode', nocheck: true},
	edit: {
        drag: {
            autoExpandTrigger: true
        },
		showRemoveBtn: false,
		showRenameBtn: false
	},
    view: {
        selectedMulti: false,
        showLine: false
    },
	callback: {
    	'onDrop': 'departmentMoved'
    }
};

exports.operators = {
    add: { label: '', show: 'always', title: '添加'},
    edit: { label: '', title: '编辑'},
    del: { label: '' , title: '删除'},
    refresh: { label: '', show: 'always', title: '刷新'},
    show: { label: '', title: '查看'},
    toggleMove: false
    // toggleMove: { icon: 'icon-move', style: 'btn-warning', group: 'other', show: 'always' }
};

exports.validators = {
    create: {
        defaults: mark('services', 'system/departments').on(function (departmentSvc, context, department, request) {
            var isExists;

            if(department.code){
                isExists = departmentSvc.isExists(department);
                if (isExists) {
                    context.addViolation({ message: '组织机构或部门编码已存在' });
                }
            }
        })
    },
    update: {
        defaults: mark('services', 'system/departments').on(function (departmentSvc, context, department, request) {
            var isExists;

            if(department.code){
                isExists = departmentSvc.isExists(department);
                if (isExists) {
                    context.addViolation({ message: '组织机构或部门编码已存在' });
                }
            }
        })
    },
    remove: {
        defaults: mark('services', 'system/departments').on(function (departmentSvc, context, department, request) {
            var isEmpty = departmentSvc.isEmpty(department);
            if (!isEmpty) {
                context.addViolation({ message: '不能删除非空的组织机构或部门' });
            }
        })
    }
};

exports.validation = {
    rules: {
        code: {required: true}
    }
}

exports.hooks = {
    beforeCreate: {
        defaults: function (department) {
            department.iconSkin = 'departmentNode';
        }
    },

    afterCreate: {
        defaults: mark('services', 'system/departments').on(function (departmentSvc, department) {
            departmentSvc.buildPath(department);
        })
    },

    beforeUpdate: {
        defaults: function (department) {
            department.iconSkin = 'departmentNode';
        }
    },

    afterUpdate: {
        move: mark('services', 'system/departments').on(function (departmentSvc, department) {
            departmentSvc.changeChildrenPath(department);
        })
    }
};
