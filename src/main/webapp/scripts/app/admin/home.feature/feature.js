define({
    layout: {regions: {
        title: 'title',
        overview: 'overview',
        popular: 'popular',
        'sale-status': 'sale-status',
        recent: 'recent',
        conversation: 'conversation'
    }},

    views: [{
        name: 'inline:title', region: 'title', avoidLoadingView: true, avoidLoadingHandlers: true
    }, {
        name: 'inline:overview', region: 'overview', avoidLoadingView: true, avoidLoadingHandlers: true,
        components: [
            {selector: 'pie1', type: 'easy-pie'},
            {selector: 'pie2', type: 'easy-pie'},
            {selector: 'spark1', type: 'sparkline', data: [3,4,2,3,4,4,2,2]},
            {selector: 'spark2', type: 'sparkline'},
            {
                selector: 'pie3', type: 'plot',
                data: [
                    { label: "social networks",  data: 38.7, color: "#68BC31"},
                    { label: "search engines",  data: 24.5, color: "#2091CF"},
                    { label: "ad campaings",  data: 8.2, color: "#AF4E96"},
                    { label: "direct traffic",  data: 18.6, color: "#DA5430"},
                    { label: "other",  data: 10, color: "#FEE074"}
                ],
                series: {
                    pie: {
                        show: true, tilt:0.8, highlight: {opacity: 0.25},
                        stroke: {color: '#fff', width: 2},
                        startAngle: 2
                    }
                },
                legend: {show: true, position: "ne", labelBoxBorderColor: null, margin:[-30,15]},
                grid: {hoverable: true, clickable: true},
                tooltip: true,
                tooltipOpts: {content: "%s : %y.1", shifts: {x: -30, y: -50}}
            }
        ]
    }, {
        name: 'inline:popular', region: 'popular', avoidLoadingView: true, avoidLoadingHandlers: true
    }, {
        name: 'inline:sale-status', region: 'sale-status', avoidLoadingView: true, avoidLoadingHandlers: true,
        components: [function(){
            var d1 = [];
            for (var idx1 = 0; idx1 < Math.PI * 2; idx1 += 0.5) {
                d1.push([idx1, Math.sin(idx1)]);
            }

            var d2 = [];
            for (var idx2 = 0; idx2 < Math.PI * 2; idx2 += 0.5) {
                d2.push([idx2, Math.cos(idx2)]);
            }

            var d3 = [];
            for (var idx3 = 0; idx3 < Math.PI * 2; idx3 += 0.2) {
                d3.push([idx3, Math.tan(idx3)]);
            }

            return {
                selector: 'sales-charts', type: 'plot', data: [
                    { label: "Domains", data: d1 },
                    { label: "Hosting", data: d2 },
                    { label: "Services", data: d3 }
                ],
                hoverable: true,
                shadowSize: 0,
                series: {
                    lines: { show: true },
                    points: { show: true }
                },
                xaxis: {
                    tickLength: 0
                },
                yaxis: {
                    ticks: 10,
                    min: -2,
                    max: 2,
                    tickDecimals: 3
                },
                grid: {
                    backgroundColor: { colors: [ "#fff", "#fff" ] },
                    borderWidth: 1,
                    borderColor:'#555'
                }
            };
        }]
    }, {
        name: 'inline:recent', region: 'recent', avoidLoadingView: true, avoidLoadingHandlers: true,
        components: [{
            selector: 'comments',
            type: 'slimscroll',
            height: '300px'
        }]

    }, {
        name: 'inline:conversation', region: 'conversation', avoidLoadingView: true, avoidLoadingHandlers: true,
        components: [{
            selector: 'dialogs',
            type: 'slimscroll',
            height: '300px'
        }]
    }]
});
