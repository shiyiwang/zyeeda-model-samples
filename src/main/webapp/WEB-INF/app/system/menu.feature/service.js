var {mark}  = require('cdeio/mark');
var {cdeio} = require('config');
var _       = require('underscore');

var {MenuItem} = com.zyeeda.cdeio.commons.resource.entity;

exports.createService = function() {
    var asc;

    asc = function (x, y) {
        return x.rank < y.rank ? -1 : 1;
    };

    return {
        list: mark('managers', MenuItem).on(function(mm, id) {
            var items = mm.getAll(),
                p, addIt = false,
                role, roles = mm.findRolesByAccountId({id: id}), perms = {}, roleName,
                roleNames = [],
                i, j, item, tmp = {}, results = [],
                haveSystemMenuRoles = cdeio.haveSystemMenuRoles;

            for (i = 0; i < roles.size(); i ++) {
                role = roles.get(i);

                roleNames.push(role.name);

                for (j = role.permissions.iterator(); j.hasNext(); ) {
                    permission = j.next();
                    perms[permission.value] = true;
                }
            }

            for (i = 0; i < items.size(); i ++) {
                item = items.get(i);
                if (!item.path) {
                    tmp[item.id] = item;
                }
            }

            for (i = 0; i < items.size(); i ++) {
                item = items.get(i);
                path = item.path;
                if (!path) continue;

                addIt = false;

                if (path.indexOf('#report') === 0){
                    p = path.substring(8);
                    names = p.split('/');
                    if (names[names.length - 1].indexOf(':') !== -1) {
                        name = names[names.length - 1];
                        name = name.substring(8);
                        names.pop();
                        names.push(name);
                    }
                    p = names.join('/') + ':show';
                    if (perms[p]) addIt = true;
                } else if (perms[path]){
                    addIt = true;
                } else if (path.indexOf('#feature') === 0) {
                    p = path.substring(9);
                    names = p.split('/');
                    if (names[names.length - 1].indexOf(':') !== -1) {
                        name = names[names.length - 1];
                        name = name.substring(9);
                        names.pop();
                        names.push(name);
                    }
                    p = names.join('/') + ':show';

                    if (perms[p]){
                        // 如果是用户、角色或部门菜单时，只有配置的角色才可显示菜单
                        if(p.indexOf('role') !== -1 || p.indexOf('department') !== -1 || p.indexOf('account') !== -1){
                            for (j = 0; j < haveSystemMenuRoles.length; j++) {
                                roleName = haveSystemMenuRoles[j];
                                if(_.contains(roleNames, roleName)){
                                    addIt = true;
                                }
                            }
                        }else{
                            addIt = true;
                        }
                    }
                }
                if (addIt) {
                    results.push(item);
                    while (item.parent && tmp[item.parent.id]) {
                        results.push(tmp[item.parent.id]);
                        delete tmp[item.parent.id];
                        item = item.parent;
                    }
                }
            }

            results.sort(asc);
            return results;
        })
    };
};
