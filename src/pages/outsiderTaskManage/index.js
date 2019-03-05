import React from 'react'
import { observer, inject } from 'mobx-react'
import { message, Form } from 'antd'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import './index.less'

//-基本信息--布控库添加--任务范围--任务接收
const BasicInfo = Loader.loadModuleComponent('MonitorTasks', 'BasicInfo')
const LibsList = Loader.loadModuleComponent('MonitorTasks', 'LibsList')
const TasksScope = Loader.loadModuleComponent('MonitorTasks', 'TasksScope')
const TasksReceive = Loader.loadModuleComponent('MonitorTasks', 'TasksReceive')
const FormBtn = Loader.loadModuleComponent('MonitorTasks', 'FormBtn')

const MonitorNavigation = Loader.loadBusinessComponent('MonitorNavigation')
const ConfirmComponent = Loader.loadBaseComponent('ConfirmComponent')

@withRouter
@Form.create()
@inject('user', 'tab')
@observer
class outsiderTaskManage extends React.Component {
  constructor(props){
    super(props)
    this.libType = 2 // 布控任务类型 2 -- 外来人员
    this.state = {
      taskData: {
        taskType: "101502", //101501-黑名单 101502-外来人员布控 101503-魅影
        name:'', // 布控任务名称
        description:'', // 布控任务描述
        validTime: moment(new Date()), // 开始时间
        invalidTime: moment().add('days',3), // 结束时间
        captureStartTime: '00:00:00', // 开始抓拍时间
        captureEndTime: '23:59:59', // 结束抓拍时间
        libIds: [], // 布控库id
        deviceIds: [], // 布控范围
        alarmMode:['1', '2'], // 报警方式
        repeatMode: '8', // 重复方式
        acceptAlarmUserIds: [this.props.user.userInfo.id], // 告警接收人员
        alarmThreshold: 80 // 告警阈值 重点-85  外来-80  魅影-无 一体机-85
      },
      errorShow: false,
      isShowModel: false
    }
  }
  
  /**
   * @desc 组件数据收集
   * @param {object} obj 要修改的字段集合
   */
  changeTasksData = (obj) => {
    let taskData = Object.assign({}, this.state.taskData, obj)
    this.setState({ taskData })
  }

  toViewTaskList = () => {
    //跳转添加布控任务列表界面
		const { tab, location } = this.props
    tab.goPage({
      moduleName: 'outsiderTaskView',
      location,
      isUpdate: true,
    })
  }

  /**
   * @desc 数据提交
   */
  onSubmit = () => {
    const { form } = this.props
    form.validateFields((err,data) => {
      if(err){
        this.setState({
          errorShow: true
        })
        return message.error('表单验证失败')
      }
      let taskData = Object.assign({}, this.state.taskData, data)
      //对收集的数据进行处理
      taskData.validTime = taskData.validTime * 1
			taskData.invalidTime = taskData.invalidTime * 1
      if(taskData.alarmMode){
        taskData.alarmMode = taskData.alarmMode.join(',')
      }
      // 对相机id进行处理
      let deviceIds = []
      for(let i = 0; i < taskData.deviceIds.length; i++){
        deviceIds.push(taskData.deviceIds[i].id)
      }
      taskData.deviceIds = deviceIds
      Service.monitorTask.addMonitorTask(taskData).then(res => {
        if(res && res.code === 200000){
          message.success('添加成功')
          this.toViewTaskList() // 添加成功后跳转
        }
      }).catch(err => {
        message.error(err.message || '添加失败')
      })
    })
  }

  cancleAddTask = () => {
    this.setState({
      isShowModel: true
    })
  }
  
  handleCancel = () => {
    this.setState({
			isShowModel: false
		})
  }
  render() {
    const { taskData, errorShow, isShowModel } = this.state
    return <MonitorNavigation
      libType={this.libType}
      currentMenu='outsiderTaskView'
    >
    <div className='monitor-content-wrapper monitee-tasks-add'>
      <div className="task-top">
        <h1 className='tasks-add-title'>新建外来人员告警任务</h1>
      </div>
      <Form
        autocomplete="off"
      >
        <h2 className='header-step-title'>基本信息</h2>
            <BasicInfo 
          itemDate={taskData}
          changeTasksData={this.changeTasksData}
          form={this.props.form}
          libType={this.libType}
          />   
        <div>
          <h2 className='header-step-title'>合规人员</h2>
            <LibsList 
          itemDate={taskData}
          errorShow={errorShow}
          changeTasksData={this.changeTasksData}
          form={this.props.form}
          libType={this.libType}
        />   
        </div>
        <h2 className='header-step-title'>任务范围</h2>
          <TasksScope 
          errorShow={errorShow}
          itemDate={taskData}
          changeTasksData={this.changeTasksData}
          form={this.props.form}
        />  
        <h2 className='header-step-title'>任务接收</h2>
          <TasksReceive 
          itemDate={taskData}
          errorShow={errorShow}
          changeTasksData={this.changeTasksData}
          form={this.props.form}
          libType={this.libType}
          />
        <FormBtn 
          cancleSubmit={this.cancleAddTask}
          toSubmit={this.onSubmit}
        />
      </Form>
      <ConfirmComponent
        title="提示"
        visible={isShowModel}
        onCancel={this.handleCancel}
        onOk={this.toViewTaskList}
        className='monitor-tasks-model'
        img='warning'
      >
        <div className='model-content'>
          <div className="title-name">
            确定取消操作吗?
          </div>
        </div>
      </ConfirmComponent>
    </div>
    </MonitorNavigation>
  }
}

export default outsiderTaskManage

