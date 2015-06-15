package com.zyeeda.model.process.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotBlank;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.validation.constraint.NullableSize;
import com.zyeeda.model.commons.entity.MERevisionDomainEntity;

/**
 * 流程定义
 *
 * $Author$
 */
@Entity
@Table(name = "ZDA_PROCESS_DEFINITION")
@Scaffold("/process/process-definition")
public class ProcessDefinition extends MERevisionDomainEntity {

	/**
	 * 序列化
	 */
	private static final long serialVersionUID = 8473265951514814532L;

	/**
	 * 所属业务
	 */
	private BusinessDefinition businessDefinition;

	/**
	 * 结束状态(多个状态值以','隔开)
	 */
	private String endStatuses;

	/**
	 * 流程配置项
	 */
	private List<ProcessSettingItem> settingItems;

	@NotNull
	@OneToOne
	@JoinColumn(name = "F_BUSINESS_DEFINITION_ID")
	public BusinessDefinition getBusinessDefinition() {
		return businessDefinition;
	}

	public void setBusinessDefinition(BusinessDefinition businessDefinition) {
		this.businessDefinition = businessDefinition;
	}

	@Column(name = "F_END_STATUSES", length = 300)
	@NotBlank
	@NullableSize(max = 166)
	public String getEndStatuses() {
		return endStatuses;
	}

	public void setEndStatuses(String endStatuses) {
		this.endStatuses = endStatuses;
	}

	@NotNull
	@OneToMany(mappedBy = "processDefinition")
	@OrderBy("flowStatus ASC")
	public List<ProcessSettingItem> getSettingItems() {
		return settingItems;
	}

	public void setSettingItems(List<ProcessSettingItem> settingItems) {
		this.settingItems = settingItems;
	}
}
