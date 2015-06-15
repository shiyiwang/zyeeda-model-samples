exports.entityLabel = '角色';

exports.haveDataLevel = false;

exports.haveFilter = true;

exports.enableFrontendExtension = true;

exports.labels = {
    id: 'ID',
    name: '名称',
    description: '描述',
    department: '部门',
    permissions: '权限'
};

exports.fieldGroups = {
    defaults: ['name', 'description', {
        name: 'permissions', type: 'inline-grid', multiple: true, crossPage: true
    }],
    filter: [
        'name', 'description'
    ]
};

exports.forms = {
    defaults: {
        groups: [{
            name: 'defaults'
        }]
    },
    filter: {
        groups: [{
            name: 'filter',
            columns: 4
        }]
    }
};

exports.filters = {
    defaults: {
        '!roleFilter': ['permissions'],
        accountFilter: ['password', 'password2'],
        departmentFilter: ['children', 'accounts', 'parent(1)']
    },
    get: {
        '!roleFilter': '',
        '!permissionFilter': 'roles',
        accountFilter: ['password', 'password2'],
        departmentFilter: ['children', 'accounts', 'parent(1)']
    }
};

exports.style = 'grid';
exports.grid = {
    columns: [
        { name: 'name' },
        { name: 'description' }
    ]
};

exports.picker = {
    grid: {
        columns: [
            {name: 'name', header: '名称', filter: 'text'},
            {name: 'description', header: '描述', filter: 'text'}
        ]
    }
};
