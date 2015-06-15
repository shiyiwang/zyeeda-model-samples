package com.zyeeda.model.process.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.model.commons.entity.MEDomainEntity;

/**
 * 流程实例
 *
 * $Author$
 */
@Entity
@Table(name = "ZDA_PROCESS_INSTANCE")
public class ProcessInstance extends MEDomainEntity {

	/**
	 * 序列化
	 */
	private static final long serialVersionUID = -61951968204595108L;

	/**
	 * 业务数据id
	 */
	private String relatedEntryId;

	/**
	 * 所属流程定义
	 */
	private ProcessDefinition processDefinition;

	/**
	 * 此流程是否结束(0:否/未结束,1:是/结束)
	 */
	private Boolean isFinished;

	/**
	 * 结束人
	 */
	private Account finishor;

	/**
	 * 结束时间
	 */
	private Date finishTime;

	/**
	 * 是否签收(0:否/未签收,1:是/已签收)
	 */
	private Boolean isSign;

	/**
	 * 提交人
	 */
	private Account submitter;

	/**
	 * 提交时间
	 */
	private Date submitTime;

	@Column(name = "F_ENTRY_ID", length = 300)
	public String getRelatedEntryId() {
		return relatedEntryId;
	}

	public void setRelatedEntryId(String relatedEntryId) {
		this.relatedEntryId = relatedEntryId;
	}

	@ManyToOne
	@JoinColumn(name = "F_PROCESS_DEFINITION_ID")
	public ProcessDefinition getProcessDefinition() {
		return processDefinition;
	}

	public void setProcessDefinition(ProcessDefinition processDefinition) {
		this.processDefinition = processDefinition;
	}

	@Column(name = "F_IS_FINISHED", length = 300)
	public Boolean getIsFinished() {
		return isFinished;
	}

	public void setIsFinished(Boolean isFinished) {
		this.isFinished = isFinished;
	}

	@Column(name = "F_FINISH_TIME")
	public Date getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Date finishTime) {
		this.finishTime = finishTime;
	}

	@ManyToOne
	@JoinColumn(name = "F_FINISHOR_USER_ID")
	public Account getFinishor() {
		return finishor;
	}

	public void setFinishor(Account finishor) {
		this.finishor = finishor;
	}

	@Column(name = "F_IS_SIGN", length = 300)
	public Boolean getIsSign() {
		return isSign;
	}

	public void setIsSign(Boolean isSign) {
		this.isSign = isSign;
	}

	@ManyToOne
	@JoinColumn(name = "F_SUBMITTER_USER_ID")
	public Account getSubmitter() {
		return submitter;
	}

	public void setSubmitter(Account submitter) {
		this.submitter = submitter;
	}

	@Column(name = "F_SUBMIT_TIME")
	public Date getSubmitTime() {
		return submitTime;
	}

	public void setSubmitTime(Date submitTime) {
		this.submitTime = submitTime;
	}
}
