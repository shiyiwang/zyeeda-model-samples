exports.entityLabel = '进度清单';

exports.enableFrontendExtension = true;

exports.labels = {
    actName: '活动',
    progress: '进度'
};

exports.filters = {
    get: {
        '!taskListFilter': ['taskInfo']
    },
    list: {
        '!taskListFilter': ['taskInfo']
    }
};

exports.grid = {
    columns: [
        'actName', 'progress'
    ],
    numberColumn: true
};

exports.fieldGroups = {
    defaults: [
        'actName', 'progress'
    ]
};

exports.forms = {
    defaults: {
        groups: [{name: 'defaults', columns: '2'}],
        size: 'normal'
    }
};

exports['inline-grid'] = {
    columns: [
        'actName', 'progress'
    ]
};
