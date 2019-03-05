import React from "react";
import moment from 'moment'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { message, Collapse, Button, Form } from 'antd'
import "./index.less"

// 查看组件
const BasicInfoView = Loader.loadModuleComponent('MonitorTasks', 'BasicInfoView')
const TasksScopeView = Loader.loadModuleComponent('MonitorTasks', 'TasksScopeView')
const TasksReceiveView = Loader.loadModuleComponent('MonitorTasks', 'TasksReceiveView')
const FormBtn = Loader.loadModuleComponent('MonitorTasks', 'FormBtn')

// 编辑组件
const BasicInfoEdit = Loader.loadModuleComponent('MonitorTasks', 'BasicInfo')
const TasksScopeEdit = Loader.loadModuleComponent('MonitorTasks', 'TasksScope')
const TasksReceiveEdit = Loader.loadModuleComponent('MonitorTasks', 'TasksReceive')

// 组件注入
const IconFont = Loader.loadBaseComponent('IconFont')
const AuthComponent = Loader.loadBusinessComponent('AuthComponent')
const ConfirmComponent = Loader.loadBaseComponent('ConfirmComponent')
const Panel = Collapse.Panel

@Form.create()
@Decorator.businessProvider('device')
@observer
class monitorTasksViewAndEdit extends React.Component {
	state = {
    taskData: {
      taskType: 101503 // 魅影
		}, //布控任务信息
		componentIsEdit: false, // 是否是编辑转态
		activeKey: ['0'], // 默认展开的信息
		initTaskData: {}, // 布控初始值，当编辑取消时使用
		errorShow: false, // 表单验证
		isShowModel: false, // 编辑二次确认弹框
		libType: 3 // 任务类型-魅影
  }
	componentDidMount() {
		this.dealItemData()
	}

	/**
   * @desc 对传入的说数据进行处理 
   */
	dealItemData = () => {
		let item = this.props.item
		if (item && item.name){
			// 对device进行处理
			let devices = item.devices || []
			let cameraArray = this.props.device.cameraArray || []
			let deviceArr = _.intersectionBy(cameraArray, devices, 'id')
			// 对告警接收人员进行处理
			let acceptAlarmUsers = item.acceptAlarmUsers || []
			let acceptAlarmUserIds = acceptAlarmUsers.map(item => item.id)
			let taskData = {
				id: item.id,
				name: item.name,
				validTime: moment(new Date(item.validTime * 1)),
        invalidTime: moment(new Date(item.invalidTime * 1)),
				captureStartTime: item.captureStartTime ? item.captureStartTime : '00:00:00',//兼容之前布控任务
				captureEndTime: item.captureEndTime ? item.captureEndTime : '23:59:59',
        description: item.description ? item.description : '',//兼容之前布控任务
				deviceIds: deviceArr, // 设备的详细信息，提交的时候进行处理
        acceptAlarmUserIds, // 告警人员id[string]
				alarmMode: (item.alarmMode && item.alarmMode.length > 0) ? item.alarmMode.split(',') : ['1', '2'],
				repeatMode: item.repeatMode ? item.repeatMode : '8'//兼容之前布控任务
			}
			this.setState({
				taskData,
				initTaskData: _.cloneDeep(taskData)
			})
		}
	}

	/**
   * @desc 手风琴头部定义
   */
	collapseHeader = (index) => {
		let title =['基本信息','魅影','任务范围','任务接收',]
		return (
			<div className='colla-header'>
				<div className="left-title">
					<div className="colla-left">{title[index]}</div>
				</div>
				<div className="right-icon" onClick={this.changeActive.bind(this, index + '')}>
					<IconFont type={~this.state.activeKey.indexOf(index + '') ? 'icon-Arrow_Small_Up_Main' : 'icon-Arrow_Small_Down_Mai'}/>
				</div>
			</div>
		)
	}

	/**
   * @desc 展开手风琴菜单
   */
	changeActive = (index) => {
		let activeKey = []
		if(~this.state.activeKey.indexOf(index)){
			// 存在--剔除
			activeKey = _.without(this.state.activeKey, index)
		}else{
			// 不存在--追加
			activeKey = this.state.activeKey.concat(index)
		}
		this.setState({
			activeKey
		})
	}

	showEditComponent = () => {
		// 编辑转态下默认展开第一个组件
		let activeKey = ['0']
		this.setState({
			activeKey,
			componentIsEdit: true
		})
	}

	/**
   * @desc 取消编辑
   */
	cancleSubmit = () => {
		this.setState({
			isShowModel: true
		})
	}
	
	/**
	 * @desc 二次确认
	 */
	handleCancel = () => {
		this.setState({
			isShowModel: false,
			activeKey: ['0']
		})
	}

	handleOk = () => {
		let initTaskData = this.state.initTaskData
		this.setState({ 
			taskData: initTaskData,
			componentIsEdit: false,
			isShowModel: false,
			activeKey: ['0']
		})
	}

	/**
	 * @desc 确认修改
	 */
	toSubmit = () => {
		this.props.form.validateFields((err, data) => {
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
      // 提交数据
      const taskType = "101503"
			Service.monitorTask.updateMonitorTask(taskData, taskType).then(res => {
        if(res && res.code === 200000){
          message.success('修改成功')
					// 调用接口，更新列表和单个任务详情
					this.props.updateMonitorTasksList && this.props.updateMonitorTasksList()
        }
      }).catch(err => {
        message.error(err.message || '修改失败')
      })
		})
	}

	/**
	 * @desc 从编辑子组件修改的数据
	 */
	changeTasksData = (obj) => {
		let taskData = Object.assign({}, this.state.taskData, obj)
    this.setState({ taskData })
	}
	render() {
		const { taskData, componentIsEdit, libType, activeKey, errorShow, isShowModel } = this.state
		const { item } = this.props
		return (
			<div className="monitor-task-view-edit-container">
				<div className="taks-full-top">
					<div className="task-top">
						<span title={taskData.name} className="title">{taskData.name}</span>
						{!componentIsEdit && 
								<AuthComponent actionName='eventTaskManage'>
								<Button onClick={this.showEditComponent}><IconFont type="icon-Edit_Main"/>编辑</Button>
							</AuthComponent>
						}
					</div>
				</div>
				<div className="view-edit-box">
					<Form autocomplete="off">
					<div className="task-form-box">
						<Collapse bordered={false} activeKey={activeKey}>
							<Panel header={this.collapseHeader(0)} key="0">
								{componentIsEdit ? <div>
									<BasicInfoEdit 
										itemDate={taskData}
										changeTasksData={this.changeTasksData}
										form={this.props.form}
										libType={libType}
									/>
								</div> : <BasicInfoView 
													item={item} 
													libType={libType}
											/>}
							</Panel>
							<Panel header={this.collapseHeader(2)} key="2" className='area-camera-list'>
								{componentIsEdit ? <div>
										<TasksScopeEdit 
											errorShow={errorShow}
											changeTasksData={this.changeTasksData}
											itemDate={taskData}
											form={this.props.form}
										/>
									</div> : 
									<TasksScopeView item={taskData}/>
									}
							</Panel> 
							 <Panel header={this.collapseHeader(3)} key="3">
								{componentIsEdit ? <div>
										<TasksReceiveEdit 
											itemDate={taskData}
											errorShow={errorShow}
											changeTasksData={this.changeTasksData}
											form={this.props.form}
											libType={libType}
										/> 
									</div> : <TasksReceiveView item={item} libType={libType}/>}
							</Panel>  
						</Collapse>
						{componentIsEdit && <FormBtn 
							cancleSubmit={this.cancleSubmit}
							toSubmit={this.toSubmit}
						/>}
					</div>
					</Form>
				</div>
				<ConfirmComponent
					title="提示"
					visible={isShowModel}
					onCancel={this.handleCancel}
					onOk={this.handleOk}
					className='monitor-tasks-model'
					img='warning'
				>
					<div className='model-content'>
						<div className="title-name">
							确定要取消编辑吗？已经编辑的数据将不会保存。
						</div>
					</div>
				</ConfirmComponent>
			</div>
		)
	}
}

export default monitorTasksViewAndEdit
