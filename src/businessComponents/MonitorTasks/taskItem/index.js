import React, { Component } from 'react'
import './index.less'
const IconFont = Loader.loadBaseComponent('IconFont')
const AuthComponent = Loader.loadBusinessComponent('AuthComponent')
const AuthComponentArray = ['keyPersonnelTaskManage', 'outsiderTaskManage','eventTaskManage','privateNetTaskManage'] // 权限字段

class TaskItem extends Component{
  /**
   * @desc 判断布控任务状态
	 * @param {object} item 单个布控任务信息
	 * @param {boolean} isClass 返回className还是文字
   */
	taskTypeStr = (item, isClass) => {
    let res = ''
    switch(item.taskStatus){
      case 0 :
        res = isClass ? 'state be-paused' : '已暂停'
        break;
      case 1 :
        res = isClass ? 'state be-running' : '运行中'
        break;
      case 2 :
        res = isClass ? 'state out-of-date' : '未开始'
        break;
      case 3 :
        res = isClass ? 'state out-of-date' : '已过期'
        break;
      default: 
        break;
    }
    return res
  }
  
  /**
   * @desc 查看布控任务详情
   */
  getDetailLib = id => {
    let activeItem = this.props.activeItem
    if (activeItem.id !== id) {
      this.props.setItemById && this.props.setItemById(id)	
    }
  }

   /**
   * @desc 删除布控任务
   */
  delTasksModel = (obj) => {
    this.props.delTasksModel && this.props.delTasksModel(obj)
  }

   /**
   * @desc 开始暂停布控任务
   */
  onStartPauseBtnClick = (e, item) => {
    this.props.onStartPauseBtnClick && this.props.onStartPauseBtnClick(e, item)
  }

  render(){
    const { item, activeItem } = this.props
    return (
      <div
        className={item.id === activeItem.id ? 'task-item active' : 'task-item'}
        onClick={() =>
          this.getDetailLib(item.id)
        }
      >
        <div className="title-name">
          <span className='title-tl' title={item.name}>{item.name}</span>
        </div>
        <div className="btn-message">
          <span className={this.taskTypeStr(item, true)}></span>
          <span>{this.taskTypeStr(item, false)}</span>
          {/* <AuthComponent actionName={AuthComponentArray[this.props.libType - 1]}>
            <IconFont 
              type="icon-Delete_Main"
              className="del_task"
              title='删除任务'
              onClick={(e) => { this.delTasksModel({e,id:item.id, isActive: item.id === activeItem.id ? true: false, name:item.name}) }}
            />
          </AuthComponent> */}
            {(this.taskTypeStr(item, true) === 'state out-of-date' || item.canOperate === 0) ? null :
            <AuthComponent actionName={AuthComponentArray[this.props.libType - 1]}>
            	<IconFont 
                type={item.type === '1' ? 'icon-Pause_Main' : 'icon-Play_Main'}
                title={item.type === '1' ? '暂停任务' : '开启任务'}
                onClick={(e) => this.onStartPauseBtnClick(e, item)}
                className="stop_or_play_icon"
              />
            </AuthComponent>
            }
        </div>
      </div>
    )
  }
}
export default TaskItem