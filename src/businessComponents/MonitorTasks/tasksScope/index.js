import React, { Component } from 'react'
import { Input, Form } from 'antd'
import * as _ from 'lodash'
import './index.less'
import DeviceSelectBtn from '../components/deviceSelectBtn/index.js'
const TreeSelectCamera = Loader.loadBaseComponent('TreeSelectCamera')
const MapSelectDevices = Loader.loadModuleComponent('MapComponent', 'SelectMap')

@Decorator.businessProvider('organization', 'device')
class TasksScope extends Component {
	constructor(props){
		super(props)
		let points = this.props.device.cameraArray.filter(v => v.deviceType !== Dict.map.db.value);
		this.state = {
			type: 1, // 1-地图模式 2-列表模式
			selectList: [],
			points
		}
	}
	
	changeType = (type) => {
		if(this.state.type !== type){
			this.setState({
				type
			})
		}
	}

	componentDidMount(){
		let item = this.props.itemDate || {}
		if(item.deviceIds){
			this.props.form.setFieldsValue({
        deviceIds: item.deviceIds
      })
		}
	}

	shouldComponentUpdate(nextProps,nextState){
		if(nextState.type !== this.state.type){
			return true
		}
		if(nextProps.errorShow !== this.props.errorShow){
			return true
		}
		if(nextProps.itemDate.deviceIds.length === this.deviceIds.length){
			return false
		}
		return true
	}

	toFatherComponent = (selectList) => {
		let obj = {
			deviceIds: selectList
		}
		this.props.changeTasksData && this.props.changeTasksData(obj)
	}

	changeSelectList = (isMap, selectList) => {
		if(isMap){
			selectList = selectList.list
		}
		this.props.form.setFieldsValue({
			deviceIds: selectList
		})
		this.toFatherComponent(selectList)
	}

	render(){
		const { errorShow, itemDate, form } = this.props
		const { getFieldDecorator } = form
		let deviceIds = itemDate.deviceIds || []
		this.deviceIds = JSON.parse(JSON.stringify(deviceIds))
		return(
			<div className='monitee-tasks-box tasks-scope'>
				<DeviceSelectBtn 
					type={this.state.type}
					changeType={this.changeType}

				/>
				<div className="tasks-scope-box">
				<Form.Item>
					{getFieldDecorator('deviceIds', {
						rules: [{
							required: true,
						}]
					})(
						<Input type="hidden" /> 
					)}
				</Form.Item>
					<div className='form-group-item'>
						 {/* <div className='form-group-item-label-required'>
							 布控范围 : 
									</div>  */}
						<div className='form-group-item-content'>
							{this.state.type === 1 ? 
							<div className='libs-select-map'>
								 <MapSelectDevices 
								 		points={this.state.points}
										selectList={deviceIds}
										onChange={this.changeSelectList.bind(this, true)}
								 />
								</div> 
							: <div className='libs-select-list'>
								 <TreeSelectCamera 
										onChange={this.changeSelectList.bind(this, false)}
										selectList={deviceIds}
										noSoldier={true}
									/>
								</div>}
							{!!!deviceIds.length && errorShow && <div className='monitees-error'>请选择布控范围 </div>}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default TasksScope