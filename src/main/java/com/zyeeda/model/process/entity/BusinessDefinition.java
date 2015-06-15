package com.zyeeda.model.process.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.validator.constraints.NotBlank;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.validation.constraint.NullableSize;
import com.zyeeda.model.commons.entity.MERevisionDomainEntity;

/**
 * 流程业务定义
 *
 * $Author$
 */
@Entity
@Table(name = "ZDA_PROCESS_BUSI_DEFINITION")
@Scaffold("/process/business-definition")
public class BusinessDefinition extends MERevisionDomainEntity {

	/**
	 * 序列化
	 */
	private static final long serialVersionUID = 8159678916191080575L;

	/**
	 * 业务名称
	 */
	private String businessName;

	/**
	 * 业务标识代码
	 */
	private String businessMark;

	/**
	 * 业务菜单所在feature
	 */
	private String businessFeaturePath;

	@Column(name = "F_BUSINESS_NAME", length = 300)
	@NotBlank
	@NullableSize(max = 166)
	public String getBusinessName() {
		return businessName;
	}

	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}

	@Column(name = "F_BUSINESS_MARK", length = 300)
	@NotBlank
	@NullableSize(max = 166)
	public String getBusinessMark() {
		return businessMark;
	}

	public void setBusinessMark(String businessMark) {
		this.businessMark = businessMark;
	}

	@Column(name = "F_BUSINESS_FEATURE_PATH", length = 300)
	@NullableSize(max = 166)
	public String getBusinessFeaturePath() {
		return businessFeaturePath;
	}

	public void setBusinessFeaturePath(String businessFeaturePath) {
		this.businessFeaturePath = businessFeaturePath;
	}
}
