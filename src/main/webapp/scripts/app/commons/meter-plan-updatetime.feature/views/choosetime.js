define({
    type: 'form-view',
    formName: 'choosetime',
    labelOnTop: true,
    avoidLoadingHandlers: true,
    size: 'small',

    fieldGroups: {
        group1: [
            {name: 'firstTime', label: '首次检定时间', type: 'datepicker', required: true}
        ]
    },
    form: {
        groups: {name: 'group1', column: 1}
    },
    validation: {
        rules: {
            firstTime: 'required'
        },
        messages: {
            firstTime: { required: '请选择首次检定时间'}
        }
    }
});
