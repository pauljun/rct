import React from 'react'
import { Spin } from 'antd'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import './index.less'
import TasksList from './component/tasksList.js'
import TaskViewOrEdit from './component/taskViewOrEdit/index.js'
const MonitorNavigation = Loader.loadBusinessComponent('MonitorNavigation')
const NoDataComp = Loader.NoData

@withRouter
@observer
class privateNetTaskView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      taskTypes: ["101504"],//101501-黑名单 101502-未知人员布控 101503-魅影 101504-一体机
      isLoading: true,
      item: undefined,// 当前列表选中的任务
      EidtKey: Math.random(),
      libType: 4
    }
  }

  /**
   * @desc 改变loading状态 ---布控任务查询详情loading
   * @param {boolean} state loading状态
   */
  changeLoadingState = (state) => {
    this.setState({
      isLoading: state
    })
  }

  /**
   * @desc 编辑保存布控任务后更新列表和当前选中的布控任务
   */
  updateMonitorTasksList = () => {
    this.MonitorTasksListDom.getTaskList({},(res) => {
      let list = res.list
      let item = list[0] ? list[0] : {}
			item.id && this.MonitorTasksListDom.setItemById(item.id).then(res => {
        this.setState({
          EidtKey: Math.random()
        })
      })
    })
  }

  /**
   * @desc 设置当前选中的布控任务
   * @param {object} item 单个布控任务详细信息
   */
  setItem = (item={}) => {
    this.setState({
      item,
      libId: item.id
    })
  }

  init = (ref) => {
    this.MonitorTasksListDom = ref
  }

  render() {
    const { item, taskTypes, libType } = this.state
    return <MonitorNavigation
      libType={libType}
      currentMenu='privateNetTaskView'
    >
        <div className='monitor-content-aside'>
        <TasksList 
          changeLibId={id => {
            this.setState({
              libId: id
            })
          }}
          item={item ? item : {}}
          changeLoadingState={this.changeLoadingState}
          setItem={this.setItem}
          refDom={this.init}
          taskTypes={taskTypes}
          libType={libType}
        />
        </div>
        <div className='monitor-content-wrapper' key={this.state.libId}>
          <Spin spinning={this.state.isLoading} size='large'>
              {!item || !item.name ? 
              <NoDataComp title={'暂无数据'} imgType={2}/> : 
              <TaskViewOrEdit
                item={item}
                updateMonitorTasksList={this.updateMonitorTasksList}
                key={this.state.EidtKey}
              />
              }
          </Spin>
        </div>
    </MonitorNavigation>
  }
}

export default privateNetTaskView