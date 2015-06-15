var logger 			= require('ringo/logging').getLogger(module.id);
var {createManager} = require('cdeio/manager');
var {mark}			= require('cdeio/mark');

var {ArrayList}          = java.util;

var {EntityMetaResolver} = com.zyeeda.cdeio.web.scaffold;

var {Department} 		 = com.zyeeda.cdeio.commons.organization.entity;

var PATH_DELIMITER = '/';

var buildPath = function(department) {
    var path;
    if (department.parent) {
        path = department.parent.path + department.id + PATH_DELIMITER;
    } else {
        path = PATH_DELIMITER + department.id + PATH_DELIMITER;
    }
    return path;
};

exports.createService = function () {
	var asc = function (x, y) {
        return x.rank < y.rank ? -1 : 1;
    };

	return {
		list: mark('beans', EntityMetaResolver).mark('tx').on(function (resolver, entity, options) {
            var meta = resolver.resolveEntity(Department),
                deptMgr = createManager(meta.entityClass),
                department,
                departments = new ArrayList(),
                departmentArr = [],
                i;

            if (options.filters) {
                departments = deptMgr.findByEntity(options);
            } else {
                departments = deptMgr.findByExample(entity, options);
            }

            for (i = 0; i < departments.size(); i ++) {
                department = departments.get(i);
                department.iconSkin = 'departmentNode';

                departmentArr.push(department);
            }

            departmentArr.sort(asc);

            return departmentArr;
        }),
		isEmpty: mark('managers', Department).on(function (deptMgr, department) {
			var deptCount = deptMgr.getSubDepartmentCount({ departmentId: department.getId() }, 1);
			var accountCount = deptMgr.getAccountCount({ departmentId: department.getId() }, 1);

			return deptCount === 0 && accountCount === 0;
		}),
        isExists: mark('managers', Department).on(function (deptMgr, department) {
            var deptCount;

            if(department.id){
                deptCount = deptMgr.getDepartmentCountByCodeAndId({ departmentCode: department.code, departmentId: department.id }, 1);
            }else{
                deptCount = deptMgr.getDepartmentCountByCode({ departmentCode: department.code}, 1);
            }

            return deptCount > 0;
        }),
		buildPath: mark('managers', Department).mark('tx').on(function (deptMgr, department) {
			department.path = buildPath(department);
		}),
        getDepartmentByName: mark('managers', Department).mark('tx').on(function (deptMgr, name) {
            return deptMgr.getDepartmentByName({name: name}, 1);
        }),
		changeChildrenPath: mark('managers', Department).mark('tx').on(function (deptMgr, department) {
			var oldPath = department.path;
			var newPath = buildPath(department);
			var children = deptMgr.getChildrenDepartments({likePath: oldPath + '%', path: oldPath});
			department.path = newPath;
			var i = 0, _len = children.size(), child;
			for (i; i < _len; i++) {
				child = children.get(i);
				child.path = child.path.replace(oldPath, newPath);
			}
			return department;
		})
	};
};
