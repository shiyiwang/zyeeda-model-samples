package com.zyeeda.model.work.entity;

import java.util.List;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.FetchType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.authc.entity.Role;
import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.cdeio.validation.constraint.NullableSize;
import com.zyeeda.cdeio.commons.base.entity.RevisionDomainEntity;
import com.zyeeda.model.work.entity.WorkPackage;
import com.zyeeda.model.work.entity.TaskList;

/**
 * 任务信息
 *
 * $Author$
 */
@Entity
@Table(name = "MO_WORK_TASK_INFO")
@Scaffold("/work/task-info")
public class TaskInfo extends RevisionDomainEntity {

    /**
     * 负责人
     */
    private Account account;

    /**
     * 负责人姓名
     */
    private String accountName;

    /**
     * 工作包
     */
    private WorkPackage workPackage;

    /**
     * 整体进度
     */
    private String totalProgress;

    /**
     * 进度清单
     */
    private List<TaskList> taskLists;

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

    @Column(name = "F_TOTAL_PROGRESS", length = 300)
    public String getTotalProgress() {
        return totalProgress;
    }

    public void setTotalProgress(String totalProgress) {
        this.totalProgress = totalProgress;
    }

    @Column(name = "F_ACCOUNT_NAME", length = 300)
    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    @OneToMany(mappedBy = "taskInfo", fetch = FetchType.LAZY)
    public List<TaskList> getTaskLists() {
        return taskLists;
    }

    public void setTaskLists(List<TaskList> taskLists) {
        this.taskLists = taskLists;
    }

}
