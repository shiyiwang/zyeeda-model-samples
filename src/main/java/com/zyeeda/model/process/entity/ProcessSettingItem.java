package com.zyeeda.model.process.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.authc.entity.Role;
import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.cdeio.commons.organization.entity.Department;
import com.zyeeda.cdeio.validation.constraint.NullableSize;
import com.zyeeda.model.commons.entity.MEDomainEntity;

/**
 * 流程配置项
 *
 * $Author$
 */
@Entity
@Table(name = "ZDA_PROCESS_SETTINGITEM")
@Scaffold("/process/process-settingitem")
public class ProcessSettingItem extends MEDomainEntity {

	/**
	 * 序列化
	 */
	private static final long serialVersionUID = -3269127833700753272L;

	/**
	 * 所属流程定义
	 */
	private ProcessDefinition processDefinition;

	/**
	 * 流程状态
	 */
	private String flowStatus;

	/**
	 * 状态描述
	 */
	private String flowStatusDesc;

	/**
	 * 审批角色
	 */
	private List<Role> roles;

	/**
	 * 审批用户
	 */
	private List<Account> accounts;

	/**
	 * 审批部门
	 */
	private List<Department> departments;

	@NotNull
	@ManyToOne
	@JoinColumn(name = "F_PROCESS_DEFINITION_ID")
	public ProcessDefinition getProcessDefinition() {
		return processDefinition;
	}

	public void setProcessDefinition(ProcessDefinition processDefinition) {
		this.processDefinition = processDefinition;
	}

	@Column(name = "F_FLOW_STATUS", length = 300)
	@NotBlank
	@NullableSize(max = 166)
	public String getFlowStatus() {
		return flowStatus;
	}

	public void setFlowStatus(String flowStatus) {
		this.flowStatus = flowStatus;
	}

	@Column(name = "F_FLOW_STATUS_DESC", length = 300)
	@NotBlank
	@NullableSize(max = 166)
	public String getFlowStatusDesc() {
		return flowStatusDesc;
	}

	public void setFlowStatusDesc(String flowStatusDesc) {
		this.flowStatusDesc = flowStatusDesc;
	}

	@ManyToMany
	@JoinTable(name = "ZDA_PROCESS_SET_ACCOUNT",
				joinColumns=@JoinColumn(name = "F_SETTINGITEM_ID"),
				inverseJoinColumns = @JoinColumn(name = "F_ACCOUNT_ID"))
	@OrderBy("id ASC")
	public List<Account> getAccounts() {
		return accounts;
	}

	public void setAccounts(List<Account> accounts) {
		this.accounts = accounts;
	}

	@ManyToMany
	@JoinTable(name = "ZDA_PROCESS_SET_ROLE",
				joinColumns=@JoinColumn(name = "F_SETTINGITEM_ID"),
				inverseJoinColumns = @JoinColumn(name = "F_ROLE_ID"))
	@OrderBy("id ASC")
	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	@ManyToMany
	@JoinTable(name = "ZDA_PROCESS_SET_DEPARTMENT",
				joinColumns=@JoinColumn(name = "F_SETTINGITEM_ID"),
				inverseJoinColumns = @JoinColumn(name = "F_DEPARTMENT_ID"))
	@OrderBy("id ASC")
	public List<Department> getDepartments() {
		return departments;
	}

	public void setDepartments(List<Department> departments) {
		this.departments = departments;
	}
}
