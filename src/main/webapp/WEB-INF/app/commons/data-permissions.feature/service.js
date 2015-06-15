var {SecurityUtils}      = org.apache.shiro;

exports.createService = function() {
    return {
        // 数据权限过滤
		dataPermissionsFilter: function (options, accountExtendMgr) {
            var i, _i, _ref2,currSessionUser,
                currUserExtension, currUserExtensions,
                currDepartPath, currDeptPathArr, likeDeptPath;

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
		}
    };
};
