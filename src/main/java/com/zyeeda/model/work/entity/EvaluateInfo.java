package com.zyeeda.model.work.entity;

import java.util.List;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.authc.entity.Role;
import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.cdeio.validation.constraint.NullableSize;
import com.zyeeda.cdeio.commons.base.entity.RevisionDomainEntity;
import com.zyeeda.model.work.entity.WorkList;

/**
 * 评估信息
 *
 * $Author$
 */
@Entity
@Table(name = "MO_WORK_EVALUATE_INFO")
@Scaffold("/work/evaluate-info")
public class EvaluateInfo extends RevisionDomainEntity {

    /**
     * 评估状态（1:未完成，2：已完成）
     */
    private String status;

    /**
     * 评估用户
     */
    private Account account;

    /**
     * 评估用户姓名
     */
    private String accountName;

    /**
     * 工作包
     */
    private WorkPackage workPackage;

    /**
     * 估算完成时间
     */
    private Date expectTime;

    /**
     * 估算工作量（人天）
     */
    private String workload;

    /**
     * 估算价值
     */
    private String workPrice;

    /**
     * 详细清单
     */
    private List<WorkList> workLists;

    @Column(name = "F_STATUS", length = 300)
    @NullableSize(max = 166)
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @ManyToOne
    @JoinColumn(name = "F_ACCOUNT_ID")
    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    @ManyToOne
    @JoinColumn(name = "F_WORK_PACKAGE_ID")
    public WorkPackage getWorkPackage() {
        return workPackage;
    }

    public void setWorkPackage(WorkPackage workPackage) {
        this.workPackage = workPackage;
    }

    @NotNull
    @Column(name = "F_EXPECT_TIME")
    @Temporal(TemporalType.DATE)
    public Date getExpectTime() {
        return expectTime;
    }

    public void setExpectTime(Date expectTime) {
        this.expectTime = expectTime;
    }

    @NotNull
    @Column(name = "F_WORKLOAD", length = 300)
    public String getWorkload() {
        return workload;
    }

    public void setWorkload(String workload) {
        this.workload = workload;
    }

    @OneToMany(mappedBy = "evaluateInfo")
    public List<WorkList> getWorkLists() {
        return workLists;
    }

    public void setWorkLists(List<WorkList> workLists) {
        this.workLists = workLists;
    }

    @Column(name = "F_ACCOUNT_NAME", length = 300)
    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    @NotNull
    @Column(name = "F_WORK_PRICE", length = 300)
    @NullableSize(max = 166)
    public String getWorkPrice() {
        return workPrice;
    }

    public void setWorkPrice(String workPrice) {
        this.workPrice = workPrice;
    }
}
