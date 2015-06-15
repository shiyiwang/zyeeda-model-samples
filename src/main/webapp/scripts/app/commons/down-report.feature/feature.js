define({
    layout: {
        components: [{
            type: 'layout',
            defaults: {
                spacing_open: 0,
                hideTogglerOnSlide: true
            },
            center: {
                findNestedContent: true
            }
        }],
        regions: {
            downArea: 'down-report-area'
        }
    },

    views: [{
        name: 'inline:down-report',
        region: 'downArea',
        events: {
            'click down-report': 'downReport'
        }
    }]
});
