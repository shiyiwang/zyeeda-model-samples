package com.zyeeda.model.work.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.ManyToOne;
import javax.persistence.ManyToMany;
import javax.persistence.FetchType;
import javax.persistence.JoinTable;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import com.zyeeda.cdeio.commons.base.entity.RevisionDomainEntity;
import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.validation.constraint.NullableSize;
import com.zyeeda.model.work.entity.WorkEvaluate;
import com.zyeeda.model.work.entity.EvaluateInfo;
import com.zyeeda.model.work.entity.TodoInfo;
import com.zyeeda.model.work.entity.TaskInfo;

/**
 * 工作包
 *
 * $Autuor$
 */
@Entity
@Table(name = "MO_WORK_WORK_PACKAGE")
@Scaffold("/work/work-package")
public class WorkPackage extends RevisionDomainEntity {

    /**
     * 工作包编号
     */
    private String code;

    /**
     * 工作包名称
     */
    private String name;

    /**
     * 截止时间
     */
    private Date endTime;

    /**
     * 所属功能模块
     */
    private String model;

    /**
     * 前置工作包
     */
    private List<WorkPackage> preWorkPackages;

    /**
     * 后置工作包
     */
    private List<WorkPackage> postWorkPackages;

    /**
     * 工作包研究内容
     */
    private String content;

    /**
     * 工作包验收标准
     */
    private String accStandard;

    /**
    *  评估状态（1：未评估，2；评估中，3：已评估）
    */
    private String status;

    /**
    *  评估信息
    */
    private List<EvaluateInfo> evaluateInfos;

    /**
    *  送交的评估信息
    */
    private List<TodoInfo> todoInfos;

    /**
    *  负责人
    */
    private List<TaskInfo> taskInfos;

    @NullableSize(max = 166)
    @Column(name = "F_CODE", length = 100)
    public String getCode(){
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @NotNull
    @NullableSize(max = 166)
    @Column(name = "F_NAME", length = 300)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

    @NotNull
    @Temporal(TemporalType.DATE)
    @Column(name = "F_END_TIME")
	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

    @NotNull
    @NullableSize(max = 166)
    @Column(name = "F_MODEL", length = 300)
	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

    @ManyToMany
    @JoinTable(name = "MO_PACKAGE_PREPACKAGE",
        joinColumns = {@JoinColumn(name="F_PACKAGE_ID")},
        inverseJoinColumns = {@JoinColumn(name="F_PRE_PACKAGE_ID")})
	public List<WorkPackage> getPreWorkPackages() {
		return preWorkPackages;
	}

	public void setPreWorkPackages(List<WorkPackage> preWorkPackages) {
		this.preWorkPackages = preWorkPackages;
	}

    @ManyToMany
    @JoinTable(name = "MO_PACKAGE_POSTPACKAGE",
        joinColumns = {@JoinColumn(name="F_PACKAGE_ID")},
        inverseJoinColumns = {@JoinColumn(name="F_POST_PACKAGE_ID")})
	public List<WorkPackage> getPostWorkPackages() {
		return postWorkPackages;
	}

	public void setPostWorkPackages(List<WorkPackage> postWorkPackages) {
		this.postWorkPackages = postWorkPackages;
	}

    @NotNull
    @NullableSize(max = 166)
    @Column(name = "F_CONTENT", length = 300)
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

    @NotNull
    @NullableSize(max = 166)
    @Column(name = "F_ACC_STANDARD", length = 300)
	public String getAccStandard() {
		return accStandard;
	}

	public void setAccStandard(String accStandard) {
		this.accStandard = accStandard;
	}

    @OneToMany(mappedBy = "workPackage", fetch = FetchType.LAZY)
    public List<EvaluateInfo> getEvaluateInfos() {
        return evaluateInfos;
    }

    public void setEvaluateInfos(List<EvaluateInfo> evaluateInfos) {
        this.evaluateInfos = evaluateInfos;
    }

    @OneToMany(mappedBy = "workPackage", fetch = FetchType.LAZY)
    public List<TodoInfo> getTodoInfos() {
        return todoInfos;
    }

    public void setTodoInfos(List<TodoInfo> todoInfos) {
        this.todoInfos = todoInfos;
    }

    @Column(name = "F_STATUS", length = 300)
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @OneToMany(mappedBy = "workPackage")
    public List<TaskInfo> getTaskInfos() {
        return taskInfos;
    }

    public void setTaskInfos(List<TaskInfo> taskInfos) {
        this.taskInfos = taskInfos;
    }

}
