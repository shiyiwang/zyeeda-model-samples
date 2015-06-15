define({
    type: 'form-view',
    formName: 'common-import-view',
    labelOnTop: true,
    avoidLoadingHandlers: true,
    size: 'small',

    fieldGroups: {
        group: [
            {name: 'attachment', label: '模板文件', type: 'file-picker', required: true, url: 'invoke/system/upload',acceptFileTypes: "(\\.|\\/)(xls|xlsx)$"
            }
        ]
    },
    form: {
        groups: {name: 'group'}
    },
    validation: {
        rules: {
            attachment: 'required'
        },
        messages: {
            attachment: { required: '请选择要导入的 excel 文件, 注意: 支持的文件格式为 xls或者xlsx'}
        }
    }
});
