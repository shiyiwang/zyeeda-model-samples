define({
    layout: {
        components: [{
            type: 'layout',
            defaults: {
                spacing_open: 0,
                hideTogglerOnSlide: true
            },
            center: {
                spacing_open: 5
            },
            east: {
                size: 440,
                findNestedContent: true
            }
        }],

        regions: {
            flashPlayArea: 'flashPlayerArea',
            flashImagesArea: 'flashImagesArea'
        }
    },

    views: [{
        name: 'flash-image',
        region: 'flashImagesArea'
    },{
        name: 'inline:flash-playOrPause',
        region: 'flashPlayArea',
        events: {
            'click flashPlayer': 'pauseFlash',
            'click play-pause-button': 'playOrPauseFlash'
        }
    }]
});