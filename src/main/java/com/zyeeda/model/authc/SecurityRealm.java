package com.zyeeda.model.authc;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.subject.PrincipalCollection;

import com.zyeeda.cdeio.commons.authc.entity.Permission;
import com.zyeeda.cdeio.commons.authc.entity.Role;
import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.cdeio.sso.openid.consumer.realm.OpenIdConsumerRealm;

/**
 * @author guyong
 *
 */
public class SecurityRealm extends OpenIdConsumerRealm{

    private EntityManager entityManager = null;

    @PersistenceContext
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
        super.setEntityManager(entityManager);
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        if (principals.isEmpty()) {
            return null;
        }
        String accountId = ((Account)principals.getPrimaryPrincipal()).getId();
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        List<Role> roles = getRoles(accountId);
        for (Role role : roles) {
            info.addRole(role.getName());
            for (Permission perm : role.getPermissions()) {
                info.addStringPermission(perm.getValue());
            }
        }
        return info;
    }

    public List<Role> getRoles(String accountId) {
        TypedQuery<Role> query = entityManager.createNamedQuery("findRolesByAccountId", Role.class);
        query.setParameter("id", accountId);
        return query.getResultList();
    }
}
