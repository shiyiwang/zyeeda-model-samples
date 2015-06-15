define(['vendors/swfobject/swfobject', 'vendors/swfobject/jquery.swfobject'], function(swfobject, $swfobject) {
    return {
        playFlash: function(e) {
            var el = $(e.currentTarget),
                me = this,
                videos = this.videos,
                flashIndexMap = this.flashIndexMap,
                indexFlashMap = this.indexFlashMap,
                $player = $('.se-flash-player'),
                playPauseButtonIcon = $('.se-flash-play-pause-button > i'),
                flashid = el.data('flashid'),
                index = flashIndexMap['' + flashid],
                nextIndex = Number(index) + 1,
                play = function(attachmentId){
                    $player.flash({
                        swf: 'invoke/system/upload/file/' + attachmentId,
                        width: '600',
                        height: '338',
                        play: 'true',
                        menu: 'true',
                        allowscriptaccess: 'always'
                    });
                },
                playFinished = function(){
                    $player.flash(function() {
                        if (this.PercentLoaded() === 100 && (this.TotalFrames() - this.CurrentFrame() <= 12)) {
                            if(Number(me.nextIndex) <= videos.length - 1){
                                play(indexFlashMap['' + me.nextIndex].file.id);

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

            //由于点击视频自动播放，故切换播放按钮至暂停按钮
            if(playPauseButtonIcon.hasClass('icon-play')){
                playPauseButtonIcon.removeClass('icon-play').addClass('icon-pause');
            }

            me.nextIndex = nextIndex;

            if(videos.length > 0){
                //播放flash
                play(indexFlashMap['' + index].file.id);

                window.setTimeout(playFinished, 0);

                //展示当前播放视频的标题
                $('.se-flash-title').html(indexFlashMap['' + index].name);

                //为当前播放视频的缩略图区域添加样式
                cleanCurrentVideoBackground();
                me.$('video-item-' + indexFlashMap["" + index].id).toggleClass('current');
            }
        }
    };
});
