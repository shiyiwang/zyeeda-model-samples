define(['vendors/swfobject/swfobject', 'vendors/swfobject/jquery.swfobject'], function(swfobject, $swfobject) {
    return {
        events: {
            'click fla-link-*': 'playFlash'
        },
        extend: {
            serializeData: function(su) {
                var initVideos,
                    employeeNotSeeVideos,
                    videos = [],
                    data = su.apply(this),
                    flashIndexMap = {},
                    indexFlashMap = {},
                    videoNumber,
                    videoArea = [],
                    columnArea = [],
                    noVideoFlag,
                    noVideoTipFun = function(videos){
                        if(!videos || videos.length === 0){
                             //没有可以播放的视频提示
                            $.gritter.add({
                                title: '提示',
                                text: '没有可以播放的视频，如有疑问，请联系系统管理员',
                                class_name: 'gritter-error'
                            });
                            return true;
                        }
                        return false;
                    };

                $.ajax({
                    type: 'get',
                    url: 'invoke/system/trainonline',
                    data: {},
                    async: false
                }).done(function (result) {
                    videos = result.medias;
                });

                // videos = this.feature.videos;

                //没有可以播放的视频提示
                noVideoFlag = noVideoTipFun.call(this, videos);
                if(noVideoFlag){
                    return;
                }

                videoNumber = videos ? videos.length: 0;
                if(videoNumber === 0){
                    return;
                }
                $.each(videos, function(i, v){
                    videoObj = {};
                    flashIndexMap[v.id] = i;
                    indexFlashMap[i] = v;

                    //row 101 - 107为数据封装两层结构，最底层最多2个数据，作用是为了配合页面flash缩略图区域排版要求
                    videoArea.push(v);
                    if(i === videoNumber - 1){
                        columnArea.push({videoArea: videoArea});
                    }else if(videoArea.length === 2){
                        columnArea.push({videoArea: videoArea});
                        videoArea = [];
                    }
                });

                data.videos = videos;
                data.columnArea = columnArea;

                this.videos = videos;
                this.flashIndexMap = flashIndexMap;
                this.indexFlashMap = indexFlashMap;
                return data;
            },
            afterRender: function(su) {
                var me = this,
                    videos = this.videos,
                    flashIndexMap = this.flashIndexMap,
                    indexFlashMap = this.indexFlashMap,
                    $player = $('.se-flash-player'),
                    index = 0,
                    nextIndex = Number(index) + 1,
                    play = function(attachmentId, isAutoPlay){
                        $player.flash({
                            swf: 'invoke/system/upload/file/' + attachmentId,
                            width: '600',
                            height: '338',
                            play: isAutoPlay,
                            menu: 'true',
                            allowscriptaccess: 'always'
                        });
                    },
                    playFinished = function(){
                        $player.flash(function() {
                            if (this.PercentLoaded() === 100 && (this.TotalFrames() - this.CurrentFrame() <= 12)) {
                                if(Number(me.nextIndex) <= videos.length - 1){
                                    play(indexFlashMap['' + me.nextIndex].file.id, 'true');

                                    //将当前播放的视频图片滚动到当前页面可以看到的位置
                                    me.$('video-item-' + indexFlashMap["" + me.nextIndex].id)[0].scrollIntoView(true);

                                    //展示当前播放视频的标题
                                    $('.se-flash-title').html(indexFlashMap['' + me.nextIndex].name);

                                    //为当前播放视频的缩略图区域添加样式
                                    cleanCurrentVideoBackground();
                                    me.$('video-item-' + indexFlashMap["" + me.nextIndex].id).toggleClass('current');

                                    window.setTimeout(playFinished, 0);
                                    addNextIndex();
                                }
                            } else {
                                window.setTimeout(playFinished, 500);
                            }
                        });
                    },
                    addNextIndex = function(){
                        nextIndex = Number(me.nextIndex) + 1;
                        me.nextIndex = nextIndex;
                    },
                    cleanCurrentVideoBackground = function(){
                        $.each(videos, function(i, v){
                            me.$('video-item-' + v.id).removeClass('current');
                        });
                    };

                me.nextIndex = nextIndex;

                if(videos && videos.length > 0){
                    //播放flash
                    play(indexFlashMap['' + index].file.id, 'false');

                    window.setTimeout(playFinished, 0);

                    //显示播放器区域内容
                    $('.ui-layout-center').show();
                    $('.se-flash-title').show();
                    $('.se-flash-play-pause-button').show();

                    //展示当前播放视频的标题
                    $('.se-flash-title').html(indexFlashMap['' + index].name);

                    //为当前播放视频的缩略图区域添加样式
                    me.$('video-item-' + indexFlashMap["" + index].id).toggleClass('current');
                }else{
                    return;
                }

                return su.apply(this);
            }
        }
    };
});
