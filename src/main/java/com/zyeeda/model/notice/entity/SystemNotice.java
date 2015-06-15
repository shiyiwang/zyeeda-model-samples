package com.zyeeda.model.notice.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.validator.constraints.NotBlank;

import com.zyeeda.model.commons.entity.MERevisionDomainEntity;
import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.cdeio.commons.organization.entity.Department;
import com.zyeeda.cdeio.commons.resource.entity.Attachment;
import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.authc.entity.Role;
import com.zyeeda.cdeio.validation.constraint.NullableSize;

/**
 *通知
 *
 * $Autuor$
 */

@Entity
@Table(name = "ZDA_NOTICE")
@Scaffold("/system/notice")
public class SystemNotice extends MERevisionDomainEntity {
	/**
	 * 序列化
	 */
	private static final long serialVersionUID = -5425534084366285040L;

	/**
	 *标题
	 */
	private String title;

	/**
	 *内容
	 */
	private String content;

	/**
	 *创建时间
	 */
	private Date createTime;

	/**
	 * 发布时间
	 */
	private Date issueTime;

	/**
	 * 发布人
	 */
	private Account issueAccount;

	/**
	 *附件
	 */
	private Attachment attachment;

	/**
	 *状态（1初始/2发布/3关闭）
	 */
	private String status;

	/**
	 * 是否已查看(true/false)
	 */
	private Boolean sign;

	/**
	 * 待执行方法路径(扩展属性，在查看通知后执行path方法)
	 */
	private String methodPath;

	/**
	 * 扩展备用属性1
	 */
	private String extendFiled1;

	/**
	 * 扩展备用属性2
	 */
	private String extendFiled2;

	/**
	 * 扩展备用属性3
	 */
	private String extendFiled3;

	/**
	 *接收人
	 */
	private List<Account> accounts;

	/**
	 *接收部门
	 */
	private List<Department> departments;

	/**
	 *接收角色
	 */
	private List<Role> roles;

	@NotBlank
	@NullableSize(max = 166)
	@Column(name = "F_TITLE", length = 300)
	public String getTitle (){
		return title;
	}

	public void setTitle (String title){
		this.title = title;
	}

	@NullableSize(max = 300)
	@Column(name = "F_CONTENT", length = 4000, columnDefinition = "text")
	public String getContent (){
		return content;
	}

	public void setContent (String content){
		this.content = content;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "F_CREATE_TIME")
	public Date getCreateTime (){
		return createTime;
	}

	public void setCreateTime (Date createTime){
		this.createTime = createTime;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "F_ISSUE_TIME")
	public Date getIssueTime() {
		return issueTime;
	}

	public void setIssueTime(Date issueTime) {
		this.issueTime = issueTime;
	}

	@OneToOne
	@JoinColumn(name = "F_TTACHMENT_ID")
	public Attachment getAttachment (){
		return attachment;
	}

	public void setAttachment (Attachment attachment){
		this.attachment = attachment;
	}

	@Column(name = "F_STATUS", length = 300)
	public String getStatus (){
		return status;
	}

	public void setStatus (String status){
		this.status = status;
	}

	@Column(name = "F_SIGN")
	public Boolean getSign() {
		return sign;
	}

	public void setSign(Boolean sign) {
		this.sign = sign;
	}

	@ManyToMany
	@JoinTable(name = "ZDA_NOTICE_ACCOUNT",
	joinColumns=@JoinColumn(name = "F_NOTICE_ID"),
	inverseJoinColumns = @JoinColumn(name = "F_ACCOUNT_ID"))
	public List<Account> getAccounts() {
		return accounts;
	}

	public void setAccounts(List<Account> accounts) {
		this.accounts = accounts;
	}

	@Column(name = "F_METHOD_PATH", length = 300)
	public String getMethodPath() {
		return methodPath;
	}

	public void setMethodPath(String methodPath) {
		this.methodPath = methodPath;
	}

	@Column(name = "F_EXTEND_FILED1", length = 300)
	public String getExtendFiled1() {
		return extendFiled1;
	}

	public void setExtendFiled1(String extendFiled1) {
		this.extendFiled1 = extendFiled1;
	}

	@Column(name = "F_EXTEND_FILED2", length = 300)
	public String getExtendFiled2() {
		return extendFiled2;
	}

	public void setExtendFiled2(String extendFiled2) {
		this.extendFiled2 = extendFiled2;
	}

	@Column(name = "F_EXTEND_FILED3", length = 300)
	public String getExtendFiled3() {
		return extendFiled3;
	}

	public void setExtendFiled3(String extendFiled3) {
		this.extendFiled3 = extendFiled3;
	}

	@ManyToMany
	@JoinTable(name = "ZDA_NOTICE_DEPARTMENT",
	joinColumns=@JoinColumn(name = "F_NOTICE_ID"),
	inverseJoinColumns = @JoinColumn(name = "F_DEPARTMENT_ID"))
	public List<Department> getDepartments() {
		return departments;
	}

	public void setDepartments(List<Department> departments) {
		this.departments = departments;
	}

	@ManyToMany
	@JoinTable(name = "ZDA_NOTICE_ROLE",
	joinColumns=@JoinColumn(name = "F_NOTICE_ID"),
	inverseJoinColumns = @JoinColumn(name = "F_ROLE_ID"))
	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	@ManyToOne
	@JoinColumn(name = "F_ISSUE_ACCOUNT_ID")
	public Account getIssueAccount() {
		return issueAccount;
	}

	public void setIssueAccount(Account issueAccount) {
		this.issueAccount = issueAccount;
	}
}
