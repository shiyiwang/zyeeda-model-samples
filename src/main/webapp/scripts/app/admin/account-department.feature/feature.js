define({
    layout: {
        components: [{
            type: 'layout',
            onresize: function(paneName) {
                if (paneName === 'center') {
                    app.findModule('system').findFeature('accounts').views['grid:body'].components[0].fnAdjustColumnSizing();
                }
            },
            defaults: {
                spacing_open: 0,
                hideTogglerOnSlide: true
            },
            west: {
                size: 260,
                minSize: 260,
                spacing_open: 5
            },
            center: {
                findNestedContent: true
            }
        }],

        regions: {
            deptTree: 'dept-tree',
            accountList: 'account-list'
        }
    },

    views: [{
        name: 'inline:dept-tree',
        region: 'deptTree',
        avoidLoadingHandlers: true
    }, {
        name: 'inline:account-list',
        region: 'accountList',
        avoidLoadingHandlers: true
    }],

    extend: {
        onStart: function(_super) {
            this.departmentDeferred = app.startFeature('system/scaffold:departments', { container: this.views['inline:dept-tree'].$el, ignoreExists: true });
            this.accountDeferred = app.startFeature('system/scaffold:accounts', { container: this.views['inline:account-list'].$el, ignoreExists: true });
        },

        onStop: function() {
            this.departmentDeferred.done(function(feature) {
                feature.stop();
            });
            this.accountDeferred.done(function(feature) {
                feature.stop();
            });
        }
    }
});
