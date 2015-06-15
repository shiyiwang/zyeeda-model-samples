package com.zyeeda.model.notice.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.base.entity.RevisionDomainEntity;
import com.zyeeda.cdeio.commons.organization.entity.Account;
import com.zyeeda.cdeio.commons.resource.entity.Attachment;
import com.zyeeda.cdeio.validation.constraint.NullableSize;

/**
 *我的通知
 *
 * $Autuor$
 */

@Entity
@Table(name = "ZDA_MY_NOTICE")
@Scaffold("/system/my-notice")
public class MyNotice extends RevisionDomainEntity{

	/**
	 * 序列化
	 */
	private static final long serialVersionUID = -2620539407140824191L;

	/**
	 *标题
	 */
	private String title;

	/**
	 *内容
	 */
	private String content;

	/**
	 * 发布时间
	 */
	private Date issueTime;

	/**
	 * 发布人
	 */
	private Account issueAccount;

	/**
	 * 接收人
	 */
	private Account receiveAccount;

	/**
	 *附件
	 */
	private Attachment attachment;

	/**
	 * 是否已查看(true/false)
	 */
	private Boolean sign;

	@NullableSize(max = 166)
	@Column(name = "F_TITLE", length = 300)
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@NullableSize(max = 1333)
	@Column(name = "F_CONTENT", length = 4000, columnDefinition = "text")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "F_ISSUE_TIME")
	public Date getIssueTime() {
		return issueTime;
	}

	public void setIssueTime(Date issueTime) {
		this.issueTime = issueTime;
	}

	@OneToOne
	@JoinColumn(name = "F_ISSUE_ACCOUNT_ID")
	public Account getIssueAccount() {
		return issueAccount;
	}

	public void setIssueAccount(Account issueAccount) {
		this.issueAccount = issueAccount;
	}

	@ManyToOne
	@JoinColumn(name = "F_RECEIVE_ACCOUNT_ID")
	public Account getReceiveAccount() {
		return receiveAccount;
	}

	public void setReceiveAccount(Account receiveAccount) {
		this.receiveAccount = receiveAccount;
	}

	@OneToOne
	@JoinColumn(name = "F_ATTACHMENT_ID")
	public Attachment getAttachment() {
		return attachment;
	}

	public void setAttachment(Attachment attachment) {
		this.attachment = attachment;
	}

	@Column(name = "F_SIGN")
	public Boolean getSign() {
		return sign;
	}

	public void setSign(Boolean sign) {
		this.sign = sign;
	}
}
