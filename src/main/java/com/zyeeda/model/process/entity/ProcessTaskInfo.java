package com.zyeeda.model.process.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.model.commons.entity.MEDomainEntity;

/**
 * 流程任务
 *
 * $Author$
 */
@Entity
@Table(name = "ZDA_PROCESS_TASK_INFO")
@Scaffold("/process/process-taskinfo")
public class ProcessTaskInfo extends MEDomainEntity {

	/**
	 * 序列化
	 */
	private static final long serialVersionUID = 2194674113004615766L;

	/**
	 * 所属流程实例
	 */
	private ProcessInstance processInstance;

	/**
	 * 所关联流程配置项
	 */
	private ProcessSettingItem processSettingItem;

	/**
	 * 流程状态
	 */
	private String flowStatus;

	/**
	 * 状态描述
	 */
	private String flowStatusDesc;

	/**
	 * 是否签收(0:否/未签收,1:是/已签收)
	 */
	private Boolean isSign;

	/**
	 * 签收人
	 */
	private Account signor;

	/**
	 * 签收时间
	 */
	private Date signTime;

	/**
	 * 是否审批
	 */
	private Boolean isApproval;

	/**
	 * 审批人
	 */
	private Account approvalor;

	/**
	 * 审批时间
	 */
	private Date approvalTime;

	/**
	 * 审批结果(1:同意,2:不同意)
	 */
	private String comment;

	/**
	 * 审批意见
	 */
	private String suggestion;

	/**
	 * 扩展属性1
	 */
	private String extendFiled1;

	/**
	 * 扩展属性2
	 */
	private String extendFiled2;

	/**
	 * 扩展属性3
	 */
	private String extendFiled3;

	/**
	 * 业务申请单编号
	 */
	private String requestNo;

	/**
	 * 创建用户
	 */
	private Account createUser;

	/**
	 * 创建时间
	 */
	private Date createTime;

	@ManyToOne
	@JoinColumn(name = "F_PROCESS_INSTANCE_ID")
	public ProcessInstance getProcessInstance() {
		return processInstance;
	}

	public void setProcessInstance(ProcessInstance processInstance) {
		this.processInstance = processInstance;
	}

	@OneToOne
	@JoinColumn(name = "F_PROCESS_SETTINGITEM_ID")
	public ProcessSettingItem getProcessSettingItem() {
		return processSettingItem;
	}

	public void setProcessSettingItem(ProcessSettingItem processSettingItem) {
		this.processSettingItem = processSettingItem;
	}

	@Column(name = "F_FLOW_STATUS", length = 300)
	public String getFlowStatus() {
		return flowStatus;
	}

	public void setFlowStatus(String flowStatus) {
		this.flowStatus = flowStatus;
	}

	@Column(name = "F_FLOW_STATUS_DESC", length = 300)
	public String getFlowStatusDesc() {
		return flowStatusDesc;
	}

	public void setFlowStatusDesc(String flowStatusDesc) {
		this.flowStatusDesc = flowStatusDesc;
	}

	@Column(name = "F_IS_SIGN", length = 300)
	public Boolean getIsSign() {
		return isSign;
	}

	public void setIsSign(Boolean isSign) {
		this.isSign = isSign;
	}

	@ManyToOne
	@JoinColumn(name = "F_SIGNOR_USER_ID")
	public Account getSignor() {
		return signor;
	}

	public void setSignor(Account signor) {
		this.signor = signor;
	}

	@Column(name = "F_SIGN_TIME")
	public Date getSignTime() {
		return signTime;
	}

	public void setSignTime(Date signTime) {
		this.signTime = signTime;
	}

	@Column(name = "F_IS_APPROVAL", length = 300)
	public Boolean getIsApproval() {
		return isApproval;
	}

	public void setIsApproval(Boolean isApproval) {
		this.isApproval = isApproval;
	}

	@ManyToOne
	@JoinColumn(name = "F_APPROVALOR_USER_ID")
	public Account getApprovalor() {
		return approvalor;
	}

	public void setApprovalor(Account approvalor) {
		this.approvalor = approvalor;
	}

	@Column(name = "F_APPROVAL_TIME")
	public Date getApprovalTime() {
		return approvalTime;
	}

	public void setApprovalTime(Date approvalTime) {
		this.approvalTime = approvalTime;
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

	@Column(name = "F_EXTEND_FIELD_1", length = 4000, columnDefinition = "text")
	public String getExtendFiled1() {
		return extendFiled1;
	}

	public void setExtendFiled1(String extendFiled1) {
		this.extendFiled1 = extendFiled1;
	}

	@Column(name = "F_EXTEND_FIELD_2", length = 4000, columnDefinition = "text")
	public String getExtendFiled2() {
		return extendFiled2;
	}

	public void setExtendFiled2(String extendFiled2) {
		this.extendFiled2 = extendFiled2;
	}

	@Column(name = "F_EXTEND_FIELD_3", length = 4000, columnDefinition = "text")
	public String getExtendFiled3() {
		return extendFiled3;
	}

	public void setExtendFiled3(String extendFiled3) {
		this.extendFiled3 = extendFiled3;
	}

	@Column(name = "F_REQUEST_NO", length = 300)
	public String getRequestNo() {
		return requestNo;
	}

	public void setRequestNo(String requestNo) {
		this.requestNo = requestNo;
	}

	@ManyToOne
	@JoinColumn(name = "F_CREATE_USER_ID")
	public Account getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Account createUser) {
		this.createUser = createUser;
	}

	@Column(name = "F_CREATE_TIME")
	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
}
