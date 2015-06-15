define(['vendors/swfobject/swfobject', 'vendors/swfobject/jquery.swfobject'], function(swfobject, $swfobject){
    return {
        pauseFlash: function(e) {
            var me = this,
                playPauseButtonIcon = $('.se-flash-play-pause-button > i'),
                object = me.$('flashPlayer > object');

            //切换播放按钮图标
            if(playPauseButtonIcon.hasClass('icon-pause')){
                playPauseButtonIcon.removeClass('icon-pause').addClass('icon-play');
            }

            //暂停flash播放
            object[0].StopPlay();
        },
        playOrPauseFlash: function(e) {
            var me = this,
                playPauseButtonIcon = $('.se-flash-play-pause-button > i'),
                object = me.$('flashPlayer > object');

            //切换播放按钮图标
            if(playPauseButtonIcon.hasClass('icon-play')){
                //继续播放flash
                object[0].Play();
                playPauseButtonIcon.removeClass('icon-play').addClass('icon-pause');
            }else{
                //暂停播放flash
                object[0].StopPlay();
                playPauseButtonIcon.removeClass('icon-pause').addClass('icon-play');
            }
        }
    };
});