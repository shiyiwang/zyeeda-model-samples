package com.zyeeda.model.process.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.model.commons.entity.MEDomainEntity;

/**
 * 流程审批历史
 *
 * $Author$
 */
@Entity
@Table(name = "ZDA_PROCESS_APPROVAL_HISTORY")
@Scaffold("/process/approval-history")
public class ApprovalHistory extends MEDomainEntity {

	/**
	 * 序列化
	 */
	private static final long serialVersionUID = -4518377876047284267L;

	/**
	 * 业务数据id
	 */
	private String relatedEntryId;

	/**
	 * 关联业务定义
	 */
	private BusinessDefinition businessDefinition;

	/**
	 * 关联流程任务
	 */
	private ProcessTaskInfo processTaskInfo;

	/**
	 * 任务描述
	 */
	private String taskDesc;

	/**
	 * 是否送审操作
	 */
	private Boolean isSendProcess;

	/**
	 * 操作人
	 */
	private Account operator;

	/**
	 * 操作时间
	 */
	private Date operateTime;

	/**
	 * 审批结果(1:同意,2:不同意)
	 */
	private String comment;

	/**
	 * 审批意见
	 */
	private String suggestion;

	@Column(name = "F_ENTRY_ID", length = 300)
	public String getRelatedEntryId() {
		return relatedEntryId;
	}

	public void setRelatedEntryId(String relatedEntryId) {
		this.relatedEntryId = relatedEntryId;
	}

	@ManyToOne
	@JoinColumn(name = "F_BUSINESS_DEFINITION_ID")
	public BusinessDefinition getBusinessDefinition() {
		return businessDefinition;
	}

	public void setBusinessDefinition(BusinessDefinition businessDefinition) {
		this.businessDefinition = businessDefinition;
	}

	@Column(name = "F_IS_SEND_PROCESS")
	public Boolean getIsSendProcess() {
		return isSendProcess;
	}

	public void setIsSendProcess(Boolean isSendProcess) {
		this.isSendProcess = isSendProcess;
	}

	@ManyToOne
	@JoinColumn(name = "F_OPERATOR_USER_ID")
	public Account getOperator() {
		return operator;
	}

	public void setOperator(Account operator) {
		this.operator = operator;
	}

	@Column(name = "F_OPERATE_TIME")
	public Date getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Date operateTime) {
		this.operateTime = operateTime;
	}

	@Column(name = "F_COMMENT", length = 300)
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "F_SUGGESTION", length = 4000, columnDefinition = "text")
	public String getSuggestion() {
		return suggestion;
	}

	public void setSuggestion(String suggestion) {
		this.suggestion = suggestion;
	}

	@Column(name = "F_TASK_DESC", length = 300)
	public String getTaskDesc() {
		return taskDesc;
	}

	public void setTaskDesc(String taskDesc) {
		this.taskDesc = taskDesc;
	}

	@OneToOne
	@JoinColumn(name = "F_PROCESS_TASK_INFO_ID")
	public ProcessTaskInfo getProcessTaskInfo() {
		return processTaskInfo;
	}

	public void setProcessTaskInfo(ProcessTaskInfo processTaskInfo) {
		this.processTaskInfo = processTaskInfo;
	}
}
