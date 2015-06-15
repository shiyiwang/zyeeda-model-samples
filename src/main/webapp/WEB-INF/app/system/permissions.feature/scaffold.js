exports.entityLabel = '权限';

exports.haveDataLevel = false;

exports.haveFilter = true;

exports.enableFrontendExtension = true;

exports.filters = {
    defaults: {
        '!permissionFilter': ['roles'],
    }
};

exports.style = 'grid';

exports.labels = {
    id: 'ID',
    name: '名称',
    value: '值',
    description: '描述'
};

exports.fieldGroups = {
    defaults: ['name', 'value', 'description'],
    filter: [
        'name', 'value', 'description'
    ]
};

exports.forms = {
    filter: {
        groups: [{
            name: 'filter',
            columns: 4
        }]
    }
};

exports.grid = {
    columns: [
        { name: 'name' },
        { name: 'value' },
        { name: 'description' }
    ]
};

exports.picker = {
    grid: {
        columns: [
            {name: 'name', header: '名称', filter: 'text'},
            {name: 'value', header: '值', filter: 'text'},
            {name: 'description', header: '描述', filter: 'text'}
        ]
    }
};
