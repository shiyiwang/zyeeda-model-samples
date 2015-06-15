var {mark}          = require('cdeio/mark');
var {createService} = require('cdeio/service');
var {json}          = require('cdeio/response');
var {createManager} = require('cdeio/manager');

var {AccountExtension}   = com.zyeeda.model.system.entity;
var {SystemNotice}       = com.zyeeda.model.notice.entity;

var {EntityMetaResolver} = com.zyeeda.cdeio.web.scaffold;

var {Integer}            = java.lang;
var {SimpleDateFormat}   = java.text;
var {ArrayList}          = java.util;

var {SecurityUtils}      = org.apache.shiro;

//获取当前时间
var getNowDate = function (dateFormat) {
    var date = new Date(),
        sdFormat= new SimpleDateFormat(dateFormat);

    //return 2014-03-21
    return sdFormat.format(date);
};

exports.createService = function () {
    return {
        list: mark('beans', EntityMetaResolver).mark('managers', AccountExtension).mark('tx').on(function (resolver, accountExtendMgr, entity, options) {
            var meta = resolver.resolveEntity(SystemNotice),
                noticeMgr = createManager(meta.entityClass),
                i, _i, _ref2, currSessionUser, currUserExtension, currUserExtensions,
                currDepartPath, currDeptPathArr, likeDeptPath;

            options.filters = options.filters || [];
            options.orderBy = options.orderBy || [];

            // 数据权限过滤
            if (options.haveDataLevel !== false) {
                currSessionUser = SecurityUtils.getSubject().getPrincipal();
                currUserExtensions = accountExtendMgr.getAccountExtensionByAccountId({accountId: currSessionUser.id});

                if(currUserExtensions.size() > 0){
                    currUserExtension = currUserExtensions.get(0);

                    if (currUserExtension.dataLevel !== void 0 && currUserExtension.dataLevel !== null && currUserExtension.dataLevel !== 1) {
                        currDepartPath = currUserExtension.account.department.path;
                        currDeptPathArr = currDepartPath.split('/');
                        likeDeptPath = '/';
                        if (currDeptPathArr.length - 1 >= currUserExtension.dataLevel) {
                            for (i = _i = 0, _ref2 = currUserExtension.dataLevel - 1; _i <= _ref2; i = _i += 1) {
                                likeDeptPath += currDeptPathArr[i];
                            }
                            if (currUserExtension.dataLevel > 1) {
                                likeDeptPath += '/';
                            }
                            options.filters.push([
                                'like', 'createDeptPath', likeDeptPath, {
                                    mode: 'start'
                                }
                            ]);
                        } else {
                            options.filters.push(['eq', 'id', '']);
                        }
                    }
                }
            }

            if (options.filters) {
                fetchResult = noticeMgr.findByEntity(options);
            } else {
                fetchResult = noticeMgr.findByExample(entity, options);
            }

            return fetchResult;
        }),
        getUserNoticelist: mark('managers', SystemNotice).mark('tx').on(function (noticeMgr) {
            var user = SecurityUtils.getSubject().getPrincipal(),
                notices;

            notices = noticeMgr.getRecipientNoticeByRecipientId({userId: user.id});
            return notices;
        }),
        getNowDateFun: function () {
            return getNowDate("yyyy-MM-dd");
        },
        getById: mark('managers', SystemNotice).mark('tx').on(function (noticeMgr, id) {
            return noticeMgr.find(id);
        }),
        updateNoticeParamsById: mark('managers', SystemNotice).mark('tx').on(function (noticeMgr, id, params) {
            var notice, user;

            user = SecurityUtils.getSubject().getPrincipal();
            notice = noticeMgr.find(id);

            notice.status = params.status;

            // 状态（1初始/2发布/3关闭）
            if ('2' === params.status) {
                notice.issueAccount = user;
                notice.issueTime = new Date();
            } else if ('1' === params.status) {
                notice.issueTime = null;
            }

            return notice;
        }),
        saveNotice: mark('managers', SystemNotice).mark('tx').on(function (noticeMgr, params) {
            var notice = new SystemNotice(),
                subject = SecurityUtils.getSubject(),
                user = subject.getPrincipal();

            notice.title = params.title;
            notice.content = params.content;
            notice.createdTime = new Date();
            notice.creatorName = params.creatorName || '';
            notice.createTime = new Date();
            notice.issueAccount = user;
            notice.status = params.status;
            notice.methodPath = params.methodPath;
            notice.extendFiled1 = params.extendFiled1;
            notice.extendFiled2 = params.extendFiled2;
            notice.extendFiled3 = params.extendFiled3;
            notice.accounts = params.accounts || new ArrayList();
            notice.roles = params.roles || new ArrayList();
            notice.departments = params.departments || new ArrayList();

            if(true === params.sign){
                notice.sign = true;
            } else if (false === params.sign) {
                notice.sign = false;
            }

            if ('2' === params.status) {
                notice.issueTime = new Date();
            }

            return noticeMgr.save(notice);
        })
    };
};
