define({
    type: 'form-view',
    formName: 'params',
    labelOnTop: true,
    avoidLoadingHandlers: true,
    size: 'small',

    fieldGroups: {
        group: [
            {name: 'company', label: '单位', type: 'dropdown', defaultValue: '全部', multiple: true,
                source: [
                    {id: '全部', text: '全部'},
                    {id: '公司外委', text: '公司外委'},
                    {id: '广州局', text: '广州局'},
                    {id: '贵阳局', text: '贵阳局'},
                    {id: '南宁局', text: '南宁局'},
                    {id: '柳州局', text: '柳州局'},
                    {id: '梧州局', text: '梧州局'},
                    {id: '百色局', text: '百色局'},
                    {id: '天生桥局', text: '天生桥局'},
                    {id: '曲靖局', text: '曲靖局'},
                    {id: '昆明局', text: '昆明局'},
                    {id: '大理局', text: '大理局'}
                    ]
            },
            {name: 'startTime', label: '开始日期', type: 'datepicker', required :true
            },
            {name: 'endTime', label: '结束日期', type: 'datepicker', required :true
            },
            {name: 'type', label: '设备类型', type: 'dropdown', defaultValue: '1', required: true,
                multiple: true,
                source: [
                    {id: '1', text: '电能表'},
                    {id: '2', text: '电压互感器'},
                    {id: '3', text: '电流互感器'},
                    {id: '4', text:'电压二次回路'},
                    {id: '5', text: '电流二次回路'}
                ]
            }
        ]
    },
    form: {
        groups: {name: 'group'}
    },
    validation: {
        rules: {
            type: 'required',
            startTime: 'required',
            endTime: 'required'
        },
        messages: {
            startTime: { required: '请选择开始时间'},
            endTime: { required: '请选择结束时间'},
            type: { required: '请选择设备类型'}
        }
    }
});
