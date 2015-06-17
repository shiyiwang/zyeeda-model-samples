package com.zyeeda.model.work.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.zyeeda.cdeio.commons.annotation.scaffold.Scaffold;
import com.zyeeda.cdeio.commons.base.entity.DomainEntity;
import com.zyeeda.cdeio.validation.constraint.NullableSize;
import com.zyeeda.model.work.entity.TaskInfo;

/**
 *  工作任务进度清单
 *
 * $Autuor$
 */

@Entity
@Table(name = "MO_WORK_TASK_LIST")
@Scaffold("/work/task-list")
public class TaskList extends DomainEntity {

    /**
     *  活动资源名称
     */
    private String actName;

    /**
     * 进度
     */
    private String progress;

    /**
     * 评估信息
     */
    private TaskInfo taskInfo;

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
    @Column(name = "F_PROGRESS", length = 300)
    public String getProgress (){
        return progress;
    }

    public void setProgress (String progress){
        this.progress = progress;
    }

    @ManyToOne
    @JoinColumn(name = "F_WORK_TASK_INFO_ID")
    public TaskInfo getTaskInfo() {
        return taskInfo;
    }

    public void setTaskInfo(TaskInfo taskInfo) {
        this.taskInfo = taskInfo;
    }
}
