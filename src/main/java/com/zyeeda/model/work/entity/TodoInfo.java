package com.zyeeda.model.work.entity;

import java.util.List;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
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
import com.zyeeda.model.work.entity.WorkPackage;
import com.zyeeda.model.work.entity.EvaluateInfo;

/**
 * 提交评估
 *
 * $Author$
 */
@Entity
@Table(name = "MO_WORK_TODO_INFO")
@Scaffold("/work/todo-info")
public class TodoInfo extends RevisionDomainEntity {

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
     * 工作包编号
     */
    private String packageCode;

    /**
     * 工作包名称
     */
    private String packageName;

    /**
     * 工作包截止时间
     */
    private Date packageEndTime;

    /**
     * 工作包所属功能模块
     */
    private String packageModel;

    /**
     * 评估信息
     */
    private EvaluateInfo evaluateInfo;

    @Column(name = "F_STATUS", length = 300)
    @NotBlank
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

    @Column(name = "F_PACKAGE_CODE", length = 300)
    @NotBlank
    public String getPackageCode() {
        return packageCode;
    }

    public void setPackageCode(String packageCode) {
        this.packageCode = packageCode;
    }

    @Column(name = "F_PACKAGE_NAME", length = 300)
    @NotBlank
    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    @Column(name = "F_PACKAGE_END_TIME")
    @Temporal(TemporalType.DATE)
    public Date getPackageEndTime() {
        return packageEndTime;
    }

    public void setPackageEndTime(Date packageEndTime) {
        this.packageEndTime = packageEndTime;
    }

    @Column(name = "F_PACKAGE_MODEL", length = 300)
    public String getPackageModel() {
        return packageModel;
    }

    public void setPackageModel(String packageModel) {
        this.packageModel = packageModel;
    }

    @Column(name = "F_ACCOUNT_NAME", length = 300)
    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    @OneToOne
    @JoinColumn(name = "F_EVALUATE_INFO_ID")
    public EvaluateInfo getEvaluateInfo() {
        return evaluateInfo;
    }

    public void setEvaluateInfo(EvaluateInfo evaluateInfo) {
        this.evaluateInfo = evaluateInfo;
    }
}
