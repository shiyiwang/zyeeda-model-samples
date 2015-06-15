exports.entityLabel = '活动清单';

exports.enableFrontendExtension = true;

exports.labels = {
    actName: '活动资源名称',
    actType: '活动资源类型',
    workload: '工作量'
};

exports.filters = {
    get: {
        '!workListFilter': ['evaluateInfo'],
        'evaluateInfoFilter': ''
    },
    list: {
        'workListFilter': ['id', 'actName', 'actType', 'workload']
    }
};

exports.grid = {
    columns: [
        'actName', 'actType', 'workload'
    ],
    numberColumn: true
};

exports.fieldGroups = {
    defaults: [
        'actName', 'actType', 'workload'
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
        'actName', 'actType', 'workload'
    ]
};
