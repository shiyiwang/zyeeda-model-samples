package com.zyeeda.model.work.entity;

import java.util.List;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.authc.entity.Role;
import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.cdeio.validation.constraint.NullableSize;
import com.zyeeda.cdeio.commons.base.entity.DomainEntity;
import com.zyeeda.model.work.entity.WorkPackage;

/**
 * 工作包负责人
 *
 * $Author$
 */
@Entity
@Table(name = "MO_WORK_WORK_TASK")
@Scaffold("/work/work-task")
public class WorkTask extends DomainEntity {
    /**
     * 负责人
     */
    private List<Account> accounts;

    /**
     * 工作包
     */
    private WorkPackage workPackage;

    @ManyToMany
    @JoinTable(name = "MO_WORK_TASK_SET_ACCOUNT",
        joinColumns = {@JoinColumn(name="F_ACCOUNT_ID")},
        inverseJoinColumns = {@JoinColumn(name="F_WORK_TASK_ID")})
    public List<Account> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<Account> accounts) {
        this.accounts = accounts;
    }

    @OneToOne
    @JoinColumn(name = "F_WORK_PACKAGE_ID")
    public WorkPackage getWorkPackage() {
        return workPackage;
    }

    public void setWorkPackage(WorkPackage workPackage) {
        this.workPackage = workPackage;
    }

}
