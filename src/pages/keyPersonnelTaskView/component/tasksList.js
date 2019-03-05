import React from 'react'
import { message } from 'antd'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { toJS } from 'mobx'
// 加载组件
const TasksList = Loader.loadBusinessComponent('MonitorTasks', 'TasksList')
@withRouter
@Decorator.businessProvider('MonitorTask')
@observer
class monitorTasksList extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			queryType: 2,// 2-布控任务列表 告警列表类型: 1-全部任务（默认）  2-布控任务列表（自己创建） 3-指派任务 4-本地任务
			name:'',//当前搜索条件（布控任务)
			taskTypes: this.props.taskTypes,//101501-黑名单 101502-未知人员布控 101503-魅影 101504-一体机
			list: [], // 布控任务列表
			isShowModel: false, // 删除任务弹框确认
			libType: 1 // 任务类型
		}
	}

  componentWillMount() {
		const { changeLoadingState, setItem } = this.props
		this.getTaskList({}, (result) => {
			let res = result.list
			if(res.length){
				// 设置第一个为选中状态
				let item = res[0] ? res[0] : {}
				if(item.id){
					this.setItemById(item.id)	
				}
			}else{
				changeLoadingState && changeLoadingState(false)
				setItem && setItem()
			}
		})
	}

	componentDidMount(){
		const { refDom } = this.props
		refDom && refDom(this)
	}

	/**
   * @desc 根据条件查询任务列表
	 * @param {object} option 查询条件
	 * @param {func} callback 回调函数
   */
	getTaskList = (option = {}, callback) => {
		let { taskTypes, listType, name} = this.state
		let { MonitorTask, changeLoadingState } = this.props 
		let searchData = toJS(MonitorTask.searchData)
		// 将data数据合到mobx数据
		let data = Object.assign({}, searchData, {taskTypes, listType, name}, option)
		Service.monitorTask.queryMonitorTasks(data).then(res => {
			this.setState({
				list: res.data.list
			},() => {
				callback && callback(res.data)
			})
		}).catch(err => {
			message.error('布控任务列表查询失败')
			changeLoadingState && changeLoadingState(false)
		})
	}

	/**
   * @desc 通过id拿数据详情，并设置当前选中的任务
	 * @param {string} id 布控任务id
   */
	setItemById = (id) => {
		const { changeLoadingState, setItem, changeLibId } = this.props
		changeLoadingState && changeLoadingState(true) // 设置loading状态
		return Service.monitorTask.queryMonitorTaskDetail(id).then(res => {
			changeLoadingState && changeLoadingState(false)
			setItem && setItem(res.data || {})
			changeLibId && changeLibId(id)
		}).catch(err => {
			message.error('布控任务详情查询失败')
			changeLoadingState && changeLoadingState(false)
		})
	}

	/**
   * @desc 暂停/开启任务
	 * @param {object} e 事件对象-阻止冒泡
	 * @param {object} item 单个布控任务信息
   */
	onStartPauseBtnClick = (e, item) => {
		e.stopPropagation()
		if (Date.now() > item.endTime) {
			return message.info('请修改有效时间')
    }
    const { taskTypes } = this.state
		Service.monitorTask.changeMonitorTaskRunStatus({
      ids: [item.id], 
      type: item.type === '1' ? '0' : '1', 
      taskTypes,
      taskName: item.name
    }).then(response => {
			if (response.code === 200000) {
				this.getTaskList() // 重新刷新列表
				message.success('任务操作成功')
			} else {
				message.error('任务操作失败')
			}
		})
	}

	/**
   * @desc 根据名称搜索布控任务
	 * @param {string} value 布控任务名称
   */
	changeVal = (value) => {
		this.setState({ name: value })
		this.getTaskList({ name: value }, res => {
			const list = res.list || []
			let item = list[0] ? list[0] : {}
			if(item.id){
				this.setItemById(item.id)		
			}else {
				this.props.setItem && this.props.setItem({})
			}
		})
	}

	/**
   * @desc 删除布控任务弹框
	 * @param {object} obj
	 * 	--@param {string} id 布控任务id
	 * 	--@param {boolean} isActive 是否删除的是当前选中的布控任务
	 * 	--@param {string} name 布控名称
   */
	delTasksModel = ({e, id, isActive, name}) => {
		e.stopPropagation()
		this.delLibName = name
		this.isActive = isActive
		this.delId = id
		this.setState({
			isShowModel: true
		})
	}

	/**
   * @desc 取消删除
   */
	handleCancel = () => {
		this.delLibName = ''
		this.isActive = ''
		this.delId = ''
		this.setState({
			isShowModel: false
		})
	}

	/**
   * @desc 确认删除
   */
	handleOk = () => {
		const { setItem } = this.props
		Service.monitorTask.deleteMonitorTask(this.delId).then(res => {
			if(res.code === 200000){
				message.success('任务删除成功')
				this.setState({
					isShowModel: false
				})
				this.getTaskList({}, (res) => {
					let list = res.list || []
					if(this.isActive){
						let item = list[0] ? list[0] : {}
						if(item.id){
							this.setItemById(item.id)
						}else{
							setItem && setItem({})
						}
					}
				})
			}
		}).catch(err => {
			message.success(err.message || '任务删除失败')
		})
	}
	render() {
    const {
			list,
			isShowModel
		} = this.state
		const { item, libType } = this.props
		return (
			<TasksList 
				isShowModel={isShowModel}
				list={list}
				item={item}
				libType={libType}
				handleCancel={this.handleCancel}
				handleOk={this.handleOk}
				delLibName={this.delLibName}
				changeVal={this.changeVal}
				setItemById={this.setItemById}
				delTasksModel={this.delTasksModel}
				onStartPauseBtnClick={this.onStartPauseBtnClick}
				moduleName='keyPersonnelTaskManage'
			/>
		)}
}

export default monitorTasksList