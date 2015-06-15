define(['cdeio/vendors/jquery/flot/jquery.flot.min', 'cdeio/vendors/jquery/flot/jquery.flot.pie.min', 'cdeio/vendors/jquery/flot/jquery.flot.axislabels'], function (flot, pie, axisLabel){
    return {
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
                systemHomeArea: 'system-home-area'
            }
        },
        views: [{
            name: 'inline:system-home',
            region: 'systemHomeArea',
            avoidLoadingHandlers: true,
            extend: {
                afterRender: function(su){
                    var me = this, choiceContainer = this.$('choices'),
                        company = {} , meterData, voltageTransformerData, currentTransformerData, defectData, companyDefectData, defectStatusData, shallExecInfoData, alreadyExecInfoData;

                    $.ajax({
                        url: 'invoke/common-routers/get-system-home-data',
                        type: 'get',
                        async: false,
                    }).done(function (results){
                        meterData = results.meterData;
                        voltageTransformerData = results.voltageTransformerData;
                        currentTransformerData = results.currentTransformerData;
                        defectData = results.defectData;
                        companyDefectData = results.companyDefectData;
                        defectStatusData = results.defectStatusData;
                        shallExecInfoData = results.shallExecInfoData;
                        alreadyExecInfoData = results.alreadyExecInfoData;
                    });

                    //图标数据
                    meterData = [{ label: "电能表", data: meterData, color: "#a3d368" }];
                    var transformerData = [
                        { label: "电流互感器", data: currentTransformerData, color: "#5f9cf0", bars: {
                            align: "center",
                            barWidth: 0.375
                        }},
                        { label: "电压互感器", data: voltageTransformerData, color: "#85e3c5",bars: {
                            align: "left",
                            barWidth: 0.375
                        }}
                    ];
                    var verificationData = [
                        { label: "待检定", data: shallExecInfoData, color: '#fe815a'},
                        { label: "已检定", data: alreadyExecInfoData, color: '#5f9cf0'}
                    ];

                    var ticks = [[0, "公司外委"], [1, "广州局"], [2, "贵阳局"], [3, "南宁局"], [4, "柳州局"], [5, "梧州局"], [6, "百色局"], [7, "天生桥局"], [8, "曲靖局"], [9, "昆明局"], [10, "大理局"]];
                    var monthTicks = [[0, "一月"], [1, "二月"], [2, "三月"], [3, "四月"], [4, "五月"], [5, "六月"], [6, "七月"], [7, "八月"], [8, "九月"], [9, "十月"], [10, "十一月"], [11, "十二月"]];
                    //报表属性配置
                    var meterOptions = {
                        series: {
                            bars: {
                                show: true,
                                fillColor: { colors: [{ opacity: 1 }, { opacity: 1}] }
                            }
                        },
                        bars: {
                            align: 'center',
                            barWidth: 0.5,
                            lineWidth: 2
                        },
                        xaxis: {
                            axisLabelUseCanvas: true,
                            axisLabelFontSizePixels: 12,
                            axisLabelFontFamily: 'Verdana, Arial',
                            axisLabelPadding: 3,
                            ticks: ticks
                        },
                        yaxis: {
                            axisLabel: "单位(台)",
                            axisLabelUseCanvas: true,
                            axisLabelFontSizePixels: 12,
                            axisLabelFontFamily: 'Verdana, Arial',
                            axisLabelPadding: 3
                        },
                        legend: {
                            noColumns: 0,
                            labelBoxBorderColor: "#000000",
                            position: "ne"
                        },
                        grid: {
                            hoverable: true,
                            borderWidth: 2,
                            backgroundColor: { colors: ["#ffffff", "#EDF5FF"] }
                        }
                    };
                    var defectOptions = {
                        series: {
                            pie: {
                                show: true,
                            }
                        },
                        legend: {
                            show: true,
                            noColumns: 3,
                            margin: 2,
                            backgroundColor: "#f5f5f5"
                        },
                        grid: {
                            hoverable: true
                        }
                    };
                    var verificationOptions = {
                        series: {
                            lines: {
                                show: true
                            },
                            points: {
                                radius: 3,
                                fill: true,
                                show: true
                            }
                        },
                        xaxis: {
                            axisLabelUseCanvas: true,
                            axisLabelFontSizePixels: 12,
                            axisLabelFontFamily: 'Verdana, Arial',
                            axisLabelPadding: 3,
                            ticks: monthTicks
                        },
                        yaxis: {
                            axisLabel: "单位(台)",
                            axisLabelUseCanvas: true,
                            axisLabelFontSizePixels: 12,
                            axisLabelFontFamily: 'Verdana, Arial',
                            axisLabelPadding: 3,
                            min: 0
                        },
                        legend: {
                            noColumns: 0,
                            labelBoxBorderColor: "#000000",
                            position: "nw"
                        },
                        grid: {
                            hoverable: true,
                            borderWidth: 2,
                            backgroundColor: { colors: ["#ffffff", "#EDF5FF"] }
                        },
                        colors: ["#FF0000", "#0022FF"]
                    };
                    //提示
                    var previousPoint = null, previousLabel = null;

                    $.fn.UseTooltip = function () {
                        $(this).bind("plothover", function (event, pos, item) {
                            if (item) {
                                if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                                    previousPoint = item.dataIndex;
                                    previousLabel = item.series.label;
                                    $("#tooltip").remove();
                                    var x = item.datapoint[0];
                                    var y = item.datapoint[1];

                                    var color = item.series.color;
                                    showTooltip(item.pageX,
                                    item.pageY,
                                    color,
                                    "<strong>" + item.series.label + "</strong><br>" + item.series.xaxis.ticks[x].label + " : <strong>" + y + "</strong> 台");
                                }
                            } else {
                                $("#tooltip").remove();
                                previousPoint = null;
                            }
                        });
                    };

                    function showTooltip(x, y, color, contents) {
                        $('<div id="tooltip">' + contents + '</div>').css({
                            position: 'absolute',
                            display: 'none',
                            top: y - 40,
                            left: x - 120,
                            border: '2px solid ' + color,
                            padding: '3px',
                            'font-size': '9px',
                            'border-radius': '5px',
                            'background-color': '#fff',
                            'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
                            opacity: 0.9
                        }).appendTo("body").fadeIn(200);
                    }

                    $.fn.showDefectData = function () {
                        $(this).bind("plothover", function (event, pos, item) {
                            if (!item) { return; }
                            var html = [];
                            var percent = parseFloat(item.series.percent).toFixed(2);

                            html.push("<div style=\"border:1px solid grey;background-color:",
                                 item.series.color,
                                 "\">",
                                 "<span style=\"color:white\">",
                                 item.series.label,
                                 " : ",
                                 item.series.data[0][1] + '台',
                                 " (", percent, "%)",
                                 "</span>",
                                 "</div>");
                            $(".flot-memo").html(html.join(''));
                        });
                    };

                    if (meterData.length === 0) {
                        this.$('meter').text('没有相关数据');
                    } else {
                        $.plot(this.$('meter'), meterData, meterOptions);
                        $(this.$('meter')).UseTooltip();
                    }
                    if (voltageTransformerData.length === 0 && currentTransformerData.length === 0) {
                        this.$('transformer').text('没有相关数据');
                    } else {
                        $.plot(this.$('transformer'), transformerData, meterOptions);
                        $(this.$('transformer')).UseTooltip();
                    }
                    if (defectData.length === 0) {
                        this.$('defect').text('没有相关数据');
                    } else {
                        $.plot(this.$('defect'), defectData, defectOptions);
                        $(this.$('defect')).showDefectData();
                    }

                    if (shallExecInfoData.length === 0 && alreadyExecInfoData.length === 0) {
                        this.$('verification').text('没有相关数据');
                    } else {
                        $.plot(this.$('verification'), verificationData, verificationOptions);
                        $(this.$('verification')).UseTooltip();
                    }
                    //缺陷饼图维度
                    choiceContainer.find("input").click(plotAccordingToChoices);

                    function plotAccordingToChoices() {
                        choiceContainer.find("input:checked").each(function () {
                            var key = $(this).attr("value");

                            if ('1' === key) {
                                if (companyDefectData.length === 0) {
                                    me.$('defect').text('没有相关数据');
                                } else {
                                    $.plot(me.$('defect'), companyDefectData, defectOptions);
                                    $(me.$('defect')).showDefectData();
                                }
                            } else if ('2' === key) {
                                if (defectData.length === 0) {
                                    me.$('defect').text('没有相关数据');
                                } else {
                                    $.plot(me.$('defect'), defectData, defectOptions);
                                    $(me.$('defect')).showDefectData();
                                }
                            } else if ('3' === key) {
                                if (defectStatusData.length === 0) {
                                    me.$('defect').text('没有相关数据');
                                } else {
                                    $.plot(me.$('defect'), defectStatusData, defectOptions);
                                    $(me.$('defect')).showDefectData();
                                }
                            }
                        });
                    }

                    return su.apply(this);
                }
            }
        }]
    };
});
