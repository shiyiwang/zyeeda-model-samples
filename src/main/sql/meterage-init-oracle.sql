prompt Created on 2014年3月14日 星期五 by Administrator
set feedback off
set define off
prompt Creating ZDA_DEPARTMENT...
create table ZDA_DEPARTMENT
(
  F_ID        VARCHAR2(255 CHAR) primary key,
  F_DELETED   NUMBER(1),
  F_NAME      VARCHAR2(30 CHAR),
  F_PATH      VARCHAR2(3000 CHAR),
  F_PARENT_ID VARCHAR2(255 CHAR)
);

alter table ZDA_DEPARTMENT
  add constraint FK47381E3A1CC80208 foreign key (F_PARENT_ID)
  references ZDA_DEPARTMENT (F_ID);

prompt Creating ZDA_ACCOUNT...
create table ZDA_ACCOUNT
(
  F_ID            VARCHAR2(255 CHAR) primary key,
  F_ACCOUNT_NAME  VARCHAR2(30 CHAR),
  F_DELETED       NUMBER(1),
  F_DISABLED      NUMBER(1),
  F_EMAIL         VARCHAR2(100 CHAR),
  F_MOBILE        VARCHAR2(30 CHAR),
  F_PASSWORD      VARCHAR2(60 CHAR),
  F_REALNAME      VARCHAR2(30 CHAR),
  F_TELEPHONE     VARCHAR2(30 CHAR),
  F_DEPARTMENT_ID VARCHAR2(255 CHAR)
);

alter table ZDA_ACCOUNT
  add constraint FK5277D0257F08DAE0 foreign key (F_DEPARTMENT_ID)
  references ZDA_DEPARTMENT (F_ID);

prompt Creating ZDA_MENUITEM...
create table ZDA_MENUITEM
(
  F_ID        VARCHAR2(255 CHAR) primary key,
  F_DESC      VARCHAR2(2000 CHAR),
  F_ICON      VARCHAR2(100 CHAR),
  F_NAME      VARCHAR2(100 CHAR),
  F_OPTION    VARCHAR2(2000 CHAR),
  F_PATH      VARCHAR2(200 CHAR),
  F_PARENT_ID VARCHAR2(255 CHAR)
);

alter table ZDA_MENUITEM
  add constraint FK57F141DAED0F3FE3 foreign key (F_PARENT_ID)
  references ZDA_MENUITEM (F_ID);

prompt Creating ZDA_PERMISSION...
create table ZDA_PERMISSION
(
  F_ID       VARCHAR2(255 CHAR) primary key,
  F_DESC     VARCHAR2(2000 CHAR),
  F_NAME     VARCHAR2(100 CHAR),
  F_SCAFFOLD NUMBER(1),
  F_VALUE    VARCHAR2(200 CHAR)
);
alter table ZDA_PERMISSION

prompt Creating ZDA_ROLE...
create table ZDA_ROLE
(
  F_ID            VARCHAR2(255 CHAR) primary key,
  F_DESC          VARCHAR2(3000 CHAR),
  F_SCAFFOLD      NUMBER(1),
  F_NAME          VARCHAR2(30 CHAR),
  F_DEPARTMENT_ID VARCHAR2(255 CHAR)
);

alter table ZDA_ROLE
  add constraint FK69DB55E7F08DAE0 foreign key (F_DEPARTMENT_ID)
  references ZDA_DEPARTMENT (F_ID);

prompt Creating ZDA_ROLE_ACCOUNT...
create table ZDA_ROLE_ACCOUNT
(
  F_ROLE_ID    VARCHAR2(255 CHAR) not null,
  F_ACCOUNT_ID VARCHAR2(255 CHAR) not null
);
alter table ZDA_ROLE_ACCOUNT
  add constraint FK5E68342C60C2DF4 foreign key (F_ACCOUNT_ID)
  references ZDA_ACCOUNT (F_ID);
alter table ZDA_ROLE_ACCOUNT
  add constraint FK5E68342CCD4BE4EA foreign key (F_ROLE_ID)
  references ZDA_ROLE (F_ID);

prompt Creating ZDA_ROLE_PERMISSION...
create table ZDA_ROLE_PERMISSION
(
  F_ROLE_ID       VARCHAR2(255 CHAR) not null,
  F_PERMISSION_ID VARCHAR2(255 CHAR) not null
);
alter table ZDA_ROLE_PERMISSION
  add primary key (F_ROLE_ID, F_PERMISSION_ID)
  using index 
  pctfree 10
  initrans 2
  maxtrans 255
  storage
  (
    initial 64K
    minextents 1
    maxextents unlimited
  );
alter table ZDA_ROLE_PERMISSION
  add constraint FK5157EB508F57464A foreign key (F_PERMISSION_ID)
  references ZDA_PERMISSION (F_ID);
alter table ZDA_ROLE_PERMISSION
  add constraint FK5157EB50CD4BE4EA foreign key (F_ROLE_ID)
  references ZDA_ROLE (F_ID);

prompt Creating ZDA_SETTINGITEM...
create table ZDA_SETTINGITEM
(
  F_ID    VARCHAR2(255 CHAR) primary key,
  F_DESC  VARCHAR2(2000 CHAR),
  F_NAME  VARCHAR2(200 CHAR),
  F_VALUE VARCHAR2(1000 CHAR)
);

prompt Creating ZDA_DB_VERSION...
create table ZDA_DB_VERSION
(
  F_ID          VARCHAR2(255 CHAR) primary key,
  F_VERSION     VARCHAR2(50 CHAR),
  F_CREATE_TIME DATE default null
);

prompt Creating ZDA_ATTACHMENT...
CREATE TABLE ZDA_ATTACHMENT (
  F_ID varchar2(255 CHAR) primary key,
  F_CONTENT_TYPE varchar2(255 CHAR) DEFAULT NULL,
  F_CREATE_TIME DATE DEFAULT NULL,
  F_DRAFT NUMBER(1) DEFAULT NULL,
  F_FILENAME varchar2(255 CHAR) DEFAULT NULL,
  F_PATH varchar2(255 CHAR) DEFAULT NULL,
);

prompt Loading ZDA_DEPARTMENT...
prompt Table is empty
prompt Loading ZDA_ACCOUNT...
insert into ZDA_ACCOUNT (F_ID, F_ACCOUNT_NAME, F_DELETED, F_DISABLED, F_EMAIL, F_MOBILE, F_PASSWORD, F_REALNAME, F_TELEPHONE, F_DEPARTMENT_ID)
values ('799eb843-d9cd-460b-9c7c-5db6abacca40', 'admin', null, null, 'admin@zyeeda.com', null, '$2a$10$gp/mLxQcuIhsqXmPNbML.O0wef1uKN8l6nUDkWkWkydvwnq.HcaQ.', '管理员', null, null);
commit;
prompt 1 records loaded
prompt Loading ZDA_MENUITEM...
insert into ZDA_MENUITEM (F_ID, F_DESC, F_ICON, F_NAME, F_OPTION, F_PATH, F_PARENT_ID)
values ('9', null, 'icon-cogs', '系统设置', null, null, null);
insert into ZDA_MENUITEM (F_ID, F_DESC, F_ICON, F_NAME, F_OPTION, F_PATH, F_PARENT_ID)
values ('92', null, 'icon-key', '权限管理', null, '#feature/system/scaffold:permissions', '9');
insert into ZDA_MENUITEM (F_ID, F_DESC, F_ICON, F_NAME, F_OPTION, F_PATH, F_PARENT_ID)
values ('93', null, 'icon-group', '角色管理', null, '#feature/system/scaffold:roles', '9');
insert into ZDA_MENUITEM (F_ID, F_DESC, F_ICON, F_NAME, F_OPTION, F_PATH, F_PARENT_ID)
values ('94', null, 'icon-sitemap', '用户组织机构管理', null, '#feature/admin/account-department', '9');
commit;
prompt 4 records loaded
prompt Loading ZDA_PERMISSION...
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('901', null, '添加角色', null, 'system/roles:add');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('902', null, '显示角色管理界面', null, 'system/roles:show');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('903', null, '编辑角色', null, 'system/roles:edit');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('904', null, '删除角色', null, 'system/roles:del');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('911', null, '添加部门', null, 'system/departments:add');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('912', null, '编辑部门', null, 'system/departments:edit');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('913', null, '删除部门', null, 'system/departments:del');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('914', null, '拖动部门', null, 'system/departments:toggleMove');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('921', null, '添加账号', null, 'system/accounts:add');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('922', null, '查看账号', null, 'system/accounts:show');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('923', null, '编辑账号', null, 'system/accounts:edit');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('924', null, '删除账号', null, 'system/accounts:del');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('925', null, '修改账号密码', null, 'system/accounts:changePassword');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('931', null, '显示用户组织机构管理界面', null, 'admin/account-department:show');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('941', null, '查看部门', null, 'system/departments:show');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('951', null, '显示权限管理界面', null, 'system/permissions:show');
insert into ZDA_PERMISSION (F_ID, F_DESC, F_NAME, F_SCAFFOLD, F_VALUE)
values ('961', null, '显示菜单', null, 'system/menu:show');
commit;
prompt 17 records loaded
prompt Loading ZDA_ROLE...
insert into ZDA_ROLE (F_ID, F_DESC, F_SCAFFOLD, F_NAME, F_DEPARTMENT_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', null, null, '系统管理员', null);
commit;
prompt 1 records loaded
prompt Loading ZDA_ROLE_ACCOUNT...
insert into ZDA_ROLE_ACCOUNT (F_ROLE_ID, F_ACCOUNT_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '799eb843-d9cd-460b-9c7c-5db6abacca40');
commit;
prompt 1 records loaded
prompt Loading ZDA_ROLE_PERMISSION...
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '901');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '902');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '903');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '904');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '911');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '912');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '913');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '914');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '921');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '922');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '923');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '924');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '925');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '931');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '941');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '951');
insert into ZDA_ROLE_PERMISSION (F_ROLE_ID, F_PERMISSION_ID)
values ('26c49fad-dc2b-4b9a-b8fc-88324e3e0d70', '961');
commit;
prompt 17 records loaded
prompt Loading ZDA_SETTINGITEM...
prompt Table is empty
set feedback on
set define on
prompt Done.
