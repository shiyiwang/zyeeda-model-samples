define(['vendors/jquery/jquery-barcode-2.0.2', 'jquery', 'underscore'], function ($bar, $, _){
    return {
        layout: {
            regions: {
                barcodeViewRegion: 'barcode-area'
            }
        },
        views: [{
            name: 'inline:barcode-view',
            region: 'barcodeViewRegion',
            avoidLoadingHandlers: true,
            extend: {
                serializeData: function(su) {
                    var me = this,
                        data = su.apply(this),
                        feature = app.archive.findFeature('equipment-ledger'),
                        grid = feature.views['grid:body'].components[0],
                        dataArray = grid.getSelected(),
                        equipments = [],
                        equipment;

                    if(_.isArray(dataArray)){
                        _.each(dataArray, function(v, i){
                            equipment = v.toJSON();
                            equipment.aeestsCode_1 = equipment.aeestsCode.substring(0, 4);
                            equipment.aeestsCode_2 = equipment.aeestsCode.substring(4, 5);
                            equipment.aeestsCode_3 = equipment.aeestsCode.substring(5, 7);
                            equipment.aeestsCode_4 = equipment.aeestsCode.substring(7, 16);
                            equipment.aeestsCode_5 = equipment.aeestsCode.substring(16, equipment.aeestsCode.length);

                            if(i === 0){
                                equipment.style = '';
                            }else{
                                equipment.style = 'padding-top: 18px;';
                            }
                            equipments.push(equipment);
                        });
                    }else{
                        equipment = dataArray.toJSON();
                        equipment.aeestsCode_1 = equipment.aeestsCode.substring(0, 4);
                        equipment.aeestsCode_2 = equipment.aeestsCode.substring(4, 5);
                        equipment.aeestsCode_3 = equipment.aeestsCode.substring(5, 7);
                        equipment.aeestsCode_4 = equipment.aeestsCode.substring(7, 16);
                        equipment.aeestsCode_5 = equipment.aeestsCode.substring(16, equipment.aeestsCode.length);

                        equipment.style = '';
                        equipments.push(equipment);
                    }

                    data.equipments = equipments;
                    me.equipments = equipments;

                    return data;
                },
                afterRender: function(su) {
                    var me = this,
                        aeestsCode;

                    _.each(me.equipments, function(v, i){
                        me.$('barcode-' + v.aeestsCode, me.$el).barcode(v.aeestsCode, 'code128', {showHRI: false, barHeight: 40, output: 'bmp'});
                        $('object', me.$el).css('width', '49mm');
                    });

                    return su.apply(this);
                }
            }
        }]
    };
});
