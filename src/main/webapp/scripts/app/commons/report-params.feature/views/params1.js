define({
    type: 'form-view',
    formName: 'params',
    labelOnTop: true,
    avoidLoadingHandlers: true,
    size: 'small',

    fieldGroups: {
        group1: [
            {name: 'equipmentType', label: '计量装置类型', type: 'dropdown', defaultValue: '电子式电能表', required: true,
                source: [
                    {id: '电子式电能表', text: '电子式电能表'},
                    {id: '感应式电能表', text: '感应式电能表'},
                    {id: '电压互感器', text: '电压互感器'},
                    {id: '电流互感器', text: '电流互感器'}
                    ]
            }
        ]
    },
    form: {
        groups: {name: 'group1'}
    },
    validation: {
        rules: {
            equipmentType: 'required'
        },
        messages: {
            equipmentType: { required: '请选择计量装置类型'}
        }
    }
});
