define({
    type: 'form-view',
    formName: 'meter-report-view',
    labelOnTop: true,
    avoidLoadingHandlers: true,
    size: 'small',

    fieldGroups: {
        group: [
            {name: 'factoryStation', label: '厂站', type: 'tree-picker', source: 'archive/company', required: true},
            {name: 'equipmentType', label: '设备类型', type: 'dropdown', required: true, defaultValue: '1',
                source: [
                    {id: '1', text: '电能表'},
                    {id: '2', text: '电压互感器'},
                    {id: '3', text: '电流互感器'},
                    {id: '4', text: '电压二次回路'},
                    {id: '5', text: '电流二次回路'}
                ]
            },
            {name: 'testTime', label: '测试时间' + '<span class="required-mark">*</span>', type: 'date-range', required: true}
        ]
    },
    form: {
        groups: {name: 'group'}
    },
    validation: {
        rules: {
            factoryStation: 'required',
            equipmentType: 'required',
            testTime: 'required'
        },
        messages: {
            factoryStation: { required: '请选择厂站'},
            equipmentType: { required: '请选择设备类型'},
            testTime: { required: '请选择测试时间'}
        }
    }
});
