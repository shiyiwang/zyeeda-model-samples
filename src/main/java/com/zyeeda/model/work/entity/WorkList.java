package com.zyeeda.model.work.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.base.entity.RevisionDomainEntity;
import com.zyeeda.cdeio.validation.constraint.NullableSize;
import com.zyeeda.model.work.entity.EvaluateInfo;

/**
 *  工作清单
 *
 * $Autuor$
 */

@Entity
@Table(name = "MO_WORK_WORK_LIST")
@Scaffold("/work/work-list")
public class WorkList extends RevisionDomainEntity {

    /**
     * 活动资源类型
     */
    private String actType;

    /**
     *  活动资源名称
     */
    private String actName;

    /**
     * 工作量
     */
    private String workload;

    /**
     * 评估信息
     */
    private EvaluateInfo evaluateInfo;

    @NotNull
    @NullableSize(max = 166)
    @Column(name = "F_ACT_TYPE", length = 300)
    public String getActType (){
        return actType;
    }

    public void setActType (String actType){
        this.actType = actType;
    }

    @NotNull
    @NullableSize(max = 166)
    @Column(name = "F_ACT_NAME", length = 300)
    public String getActName (){
        return actName;
    }

    public void setActName (String actName){
        this.actName = actName;
    }

    @NotNull
    @Column(name = "F_WORKLOAD", length = 300)
    public String getWorkload (){
        return workload;
    }

    public void setWorkload (String workload){
        this.workload = workload;
    }

    @ManyToOne
    @JoinColumn(name = "F_EVALUATE_INFO_ID")
    public EvaluateInfo getEvaluateInfo() {
        return evaluateInfo;
    }

    public void setEvaluateInfo(EvaluateInfo evaluateInfo) {
        this.evaluateInfo = evaluateInfo;
    }
}
