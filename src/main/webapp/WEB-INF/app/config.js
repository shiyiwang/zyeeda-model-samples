var config = require('cdeio/config');
var logger = require('ringo/logging').getLogger(module.id);
var {mark} = require('cdeio/mark');

var {SecurityUtils}             = org.apache.shiro;

var {FrontendSettingsCollector} = com.zyeeda.cdeio.web;

exports.cdeio = {
  entityPackages: [
    'com.zyeeda.cdeio.commons.authc.entity',
    'com.zyeeda.cdeio.commons.resource.entity',
    'com.zyeeda.cdeio.commons.organization.entity',
    'com.zyeeda.model.process.entity',
    'com.zyeeda.model.notice.entity',
    'com.zyeeda.model.document.entity',
    'com.zyeeda.model.commons.entity',

    //工作包
    'com.zyeeda.model.work.entity'
  ],

  orms: [

    // 系统
    'src/main/resources/META-INF/mappings/system/account-department.orm.xml',
    'src/main/resources/META-INF/mappings/system/account.orm.xml',
    'src/main/resources/META-INF/mappings/system/notice.orm.xml',
    'src/main/resources/META-INF/mappings/system/my-notice.orm.xml',

    // 流程
    'src/main/resources/META-INF/mappings/process/businessDefinition.orm.xml',
    'src/main/resources/META-INF/mappings/process/processDefinition.orm.xml',
    'src/main/resources/META-INF/mappings/process/processInstance.orm.xml',
    'src/main/resources/META-INF/mappings/process/processTaskInfo.orm.xml',
    'src/main/resources/META-INF/mappings/process/processSettingItem.orm.xml',
    'src/main/resources/META-INF/mappings/process/approvalHistory.orm.xml',

    //工作包
    'src/main/resources/META-INF/mappings/work/work-package.orm.xml',
    'src/main/resources/META-INF/mappings/work/todo-info.orm.xml',
    'src/main/resources/META-INF/mappings/work/task-info.orm.xml'
  ],

  disableAuthz: false,

  defaultOperators: {
    add: {
      label: '添加', icon: 'icon-plus', group: '10-add', style: 'btn-success', show: 'unselected', order: 100
    },
    show: {
      label: '查看', icon: 'icon-eye-open', group: '20-selected', style: 'btn-info', show: 'single-selected', order: 100
    },
    edit: {
      label: '编辑', icon: 'icon-edit', group: '20-selected', style: 'btn-warning', show: 'single-selected', order: 200
    },
    del: {
      label: '删除', icon: 'icon-minus', group: '20-selected', style: 'btn-danger', show: 'single-selected', order: 300
    },
    refresh: {
      label: '刷新', icon: 'icon-refresh', group: '30-refresh', style: 'btn-purple', show: 'always', order: 100
    }
  },

  useOwnUnitProcessTaskRoles: [
    '变电班组人员',
    '变电班组负责人',
    '变电部门专责',
    '变电部门负责人',
    '设备部专责',
    '设备部负责人'
  ],

  haveSystemMenuRoles: [
    '系统管理员'
  ]
};

FrontendSettingsCollector.add('collector', 'registered in collector');

exports.frontendSettings = {
  'cdeio.application.name': 'cdeio.application.name',
  'cdeio.sso.rp.base.path': 'cdeio.sso.rp.base.path',
  'cdeio.upload.path': function(context){
    return config.getOptionInProperties('cdeio.upload.path');
  },
  'cdeio.webapp.path': function(context){
    return config.getOptionInProperties('cdeio.webapp.path');
  },
  'collector': 'collector',
  currentUser: function(context) {
    var subject = SecurityUtils.getSubject(),
      p = subject.getPrincipal(),
      isAdmin;

    if (p == null) {
      return {};
    }

    if ('admin' === (p.getAccountName()).toLowerCase()) {
      isAdmin = true;
    }

    return {
      accountName: p.getAccountName(),
      realName: p.getRealName(),
      email: p.getEmail(),
      isAdmin: isAdmin
    };
  },
  signOutUrl: mark('beans', 'openIdProvider').on(function(openIdProvider, context) {
    return openIdProvider.getSignOutUrl();
  })
};
