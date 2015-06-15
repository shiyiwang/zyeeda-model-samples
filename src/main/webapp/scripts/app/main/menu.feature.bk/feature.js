define({
    layout: {
        regions: {
            top: 'sidebar-shortcuts',
            center: 'center',
            bottom: 'sidebar-collapse'
        }
    },
    views: [{
        name: 'inline:shortcut', region: 'top', avoidLoadingHandlers: true
    }, {
        name: 'menu', region: 'center'
    }, {
        name: 'inline:tool', region: 'bottom',
        events: {
            'click btn': 'minMenu'
        }

    }]
});
