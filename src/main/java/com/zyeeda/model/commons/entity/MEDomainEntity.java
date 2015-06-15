package com.zyeeda.model.commons.entity;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.zyeeda.cdeio.commons.base.entity.DomainEntity;

/**
 * 流程基类实体
 *
 * $Author$
 */
@MappedSuperclass
public class MEDomainEntity extends DomainEntity {

    /**
     * 序列化
     */
    private static final long serialVersionUID = -8628556388726617069L;

    /**
     * 创建数据的用户所属部门路径.
     */
    private String createDeptPath;

    @Column(name = "F_CREATE_DEPT_PATH", length = 3000, columnDefinition = "text", updatable = false)
    public String getCreateDeptPath() {
        return createDeptPath;
    }

    public void setCreateDeptPath(String createDeptPath) {
        this.createDeptPath = createDeptPath;
    }
}
