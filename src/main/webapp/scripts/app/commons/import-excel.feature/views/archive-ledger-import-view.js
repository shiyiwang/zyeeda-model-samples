define({
    type: 'form-view',
    formName: 'archive-ledger-import-view',
    labelOnTop: true,
    avoidLoadingHandlers: true,
    size: 'small',

    fieldGroups: {
        group: [
            {name: 'attachment', label: '模板文件', type: 'file-picker', required: true, url: 'invoke/system/upload', acceptFileTypes: "(\\.|\\/)(xls)$"
            },
            {name: 'equipmentType', label: '设备类型', type: 'dropdown', required: true, defaultValue: '电能表', multiple: true,
                source: [
                    {id: '电能表', text: '电能表'},
                    {id: '电压互感器', text: '电压互感器'},
                    {id: '电流互感器', text: '电流互感器'},
                    {id: '电压二次回路', text: '电压二次回路'},
                    {id: '电流二次回路', text: '电流二次回路'}
                ]
            }
        ]
    },
    form: {
        groups: {name: 'group'}
    },
    validation: {
        rules: {
            attachment: 'required',
            equipmentType: 'required'
        },
        messages: {
            attachment: { required: '请选择要导入的 excel 文件, 注意: 支持的文件格式为 xls'},
            equipmentType: { required: '请选择设备类型'}
        }
    }
});
