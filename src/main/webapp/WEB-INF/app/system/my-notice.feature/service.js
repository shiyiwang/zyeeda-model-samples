var {mark}          = require('cdeio/mark');
var {createService} = require('cdeio/service');
var {createManager} = require('cdeio/manager');

var {SecurityUtils} = org.apache.shiro;

var {EntityMetaResolver}  = com.zyeeda.cdeio.web.scaffold;
var {MyNotice}            = com.zyeeda.model.notice.entity;

exports.createService = function () {
    return {
        list: mark('beans', EntityMetaResolver).mark('tx').on(function (resolver, entity, options) {
            var user = SecurityUtils.getSubject().getPrincipal(),
                meta = resolver.resolveEntity(MyNotice),
                myNoticeMgr = createManager(meta.entityClass);

            options.filters = options.filters || [];

            options.filters.push(['eq', 'receiveAccount.id', user.id]);

            if (options.filters) {
                fetchResult = myNoticeMgr.findByEntity(options);
            } else {
                fetchResult = myNoticeMgr.findByExample(entity, options);
            }

            return fetchResult;
        }),
        //取得当前用户所有未查看的通知
        getUserNoticelist: mark('managers', MyNotice).mark('tx').on(function (myNoticeMgr) {
            var user = SecurityUtils.getSubject().getPrincipal(),
                notices;

            notices = myNoticeMgr.getRecipientNoticeByCurrentId({userId: user.id});
            return notices;
        }),
        //保存通知
        saveMyNotice: mark('managers', MyNotice).mark('tx').on(function (myNoticeMgr, params) {
            var myNotice = new MyNotice(),
                subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal();

            myNotice.title = params.title;
            myNotice.content = params.content;
            myNotice.createdTime = new Date();
            myNotice.issueTime = new Date();
            myNotice.issueAccount = user;
            myNotice.receiveAccount = params.receiveAccount;
            if(true === params.sign){
                myNotice.sign = true;
            } else if (false === params.sign) {
                myNotice.sign = false;
            }

            return myNoticeMgr.save(myNotice);
        }),
        //更新是否已查看
        updateSignById: mark('managers', MyNotice).mark('tx').on(function (myNoticeMgr, id) {
            var myNotice = myNoticeMgr.find(id);
            myNotice.sign = true;
            myNoticeMgr.save(myNotice);
        }),
        //新增通知
        addMyNotice: mark('managers', MyNotice).mark('tx').on(function (myNoticeMgr, notice, accounts) {
           var user = SecurityUtils.getSubject().getPrincipal(),
               iterator = accounts.iterator();

            while(iterator.hasNext()) {
                var myNotice = new MyNotice();
                account = iterator.next();

                myNotice.title = notice.title;
                myNotice.content = notice.content;
                myNotice.createdTime = new Date();
                myNotice.issueTime = new Date();
                myNotice.issueAccount = user;
                myNotice.receiveAccount = account;
                myNotice.sign = false;
                myNotice.attachment = notice.attachment;
                myNoticeMgr.save(myNotice);
            }
        })
    };
};
