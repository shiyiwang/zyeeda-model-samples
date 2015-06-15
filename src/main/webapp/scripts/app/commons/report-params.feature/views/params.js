define({
    type: 'form-view',
    formName: 'params',
    labelOnTop: true,
    avoidLoadingHandlers: true,
    size: 'small',

    fieldGroups: {
        group1: [
            {name: 'companyName', label: '单位', type: 'dropdown', defaultValue: '全部', required: true, url: 'invoke/common-routers/get-all-company-unit'
                // source: [
                //     {id: '全部', text: '全部'},
                //     {id: '公司外委', text: '公司外委'},
                //     {id: '广州局', text: '广州局'},
                //     {id: '贵阳局', text: '贵阳局'},
                //     {id: '南宁局', text: '南宁局'},
                //     {id: '柳州局', text: '柳州局'},
                //     {id: '梧州局', text: '梧州局'},
                //     {id: '百色局', text: '百色局'},
                //     {id: '天生桥局', text: '天生桥局'},
                //     {id: '曲靖局', text: '曲靖局'},
                //     {id: '昆明局', text: '昆明局'},
                //     {id: '大理局', text: '大理局'}
                //     ]
            }
        ]
    },
    form: {
        groups: {name: 'group1'}
    },
    validation: {
        rules: {
            companyName: 'required'
        },
        messages: {
            companyName: { required: '请选择单位名称'}
        }
    }
});
