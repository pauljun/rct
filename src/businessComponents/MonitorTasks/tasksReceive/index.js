import React, { Component } from 'react'
import { Checkbox, Radio, Button } from 'antd'
import { Input, Form } from 'antd'
import './index.less';
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group;
const OrgTreeSelectUsers = Loader.loadBusinessComponent('OrgTreeSelectUsers')
const timeBtns = [
	{
		label: '周一',
		value: '1'
	}, {
		label: '周二',
		value: '2'
	}, {
		label: '周三',
		value: '3'
	},{
		label: '周四',
		value: '4'
	},{
		label: '周五',
		value: '5'
	},{
		label: '周六',
		value: '6'
	},{
		label: '周日',
		value: '7'
	},
]
// 任务告警接收权限
const privilegeNames = [
	['keyPersonnelHistory', 'alarmResultHandle'],
	['outsiderHistory', 'alarmResultHandle'],
	['eventHistoryNotify', 'eventMonitorHandle'],
	['privateNetHistory', 'alarmResultHandle']
]
export default class TasksReceive extends Component {
	state = {
		repeatModeState: 1
	}
	componentDidMount(){
		let item = this.props.itemDate || {}
		if(item.alarmMode){
			let repeatModeState = 1
			if(item.repeatMode === '8'){
				repeatModeState = 1
			}else if(item.repeatMode === '9'){
				repeatModeState = 2
			}else if(item.repeatMode === '10'){
				repeatModeState = 3
			}else{
				if(item.repeatMode){
					repeatModeState = 4
				}
			}
			this.setState({
				repeatModeState
			})
			this.props.form.setFieldsValue({
        acceptAlarmUserIds: item.acceptAlarmUserIds,
				alarmMode: item.alarmMode || [],
				repeatMode: item.repeatMode ? item.repeatMode : '8',
      })
		}
	} 

	/**
   * @desc 数据提交到父组件
   * @param {object} obj 
   */
	toFatherComponent = (obj) => {
		this.props.changeTasksData && this.props.changeTasksData(obj)
	}

	/**
   * @desc 报警方式选择
   * @param {array} val
   */
	changeAlarmMode = (val) => {
		this.toFatherComponent({
			alarmMode: val
		})
		this.props.form.setFieldsValue({
      alarmMode: val
    })
	}

	/**
   * @desc 重复方式类型选择
   * @param {obj} e 事件对象
   */
	repeatMode = (e) => {
		let repeatModeState = e.target.value
		let repeatMode = ''
		switch(repeatModeState){
			case 1:
				repeatMode = '8'
				break
			case 2:
				repeatMode = '9'
				break
			case 3:
				repeatMode = '10'
				break
			case 4:
				repeatMode = ''
				break
			default:
				break
		}
		this.setState({
			repeatModeState: e.target.value,
		})
		this.toFatherComponent({
			repeatMode
		})
		this.props.form.setFieldsValue({
      repeatMode
    })
	}

	/**
   * @desc 重复方式类型选择-自定义
   * @param {string} val 事件对象
   */
	changeRepeatModeItem = (val) => {
		let repeatMode = this.props.itemDate.repeatMode
		let repeatModeArr = repeatMode.length > 0 ? repeatMode.split(',') : []
		let index = repeatModeArr.indexOf(val)
		if(index !== -1){
			repeatModeArr.splice(index,1)
		}else{
			repeatModeArr.push(val)
		}
		repeatMode = repeatModeArr.join(',')
		this.setState({repeatMode})
		this.props.form.setFieldsValue({
      repeatMode
		})
		this.toFatherComponent({
			repeatMode
		})
	}

	/**
	 * @desc 从用户选择组件传递的数据
   * @param {array} selectUserList 报警接收人员
   */
  changeSelectUser = (selectUserList) => {
    let userId = [];
    selectUserList.forEach(item => {
      userId.push(item.id)
		})
		this.toFatherComponent({
			acceptAlarmUserIds: userId
		})
		this.props.form.setFieldsValue({
      acceptAlarmUserIds: userId
    })
	}

	render(){
		const { repeatModeState } = this.state
		const { errorShow, form } = this.props
		const { getFieldDecorator } = form
		const { alarmMode=[], repeatMode = [], acceptAlarmUserIds=[] } = this.props.itemDate
		let repeatModeArr = (repeatMode && repeatMode.length > 0) ? repeatMode.split(',') : []
		let privilegeName = privilegeNames[this.props.libType - 1]
		return(
			<div className='monitee-tasks-box tasks-receive'>
				{/* --------------报警方式----------------- */}
				<Form.Item>
					{getFieldDecorator('alarmMode', {
						rules: [{
							required: true
						}]
					})(
						<Input type="hidden" />
					)}
				</Form.Item>
				{this.props.libType !== 3 &&<div className='form-group-item'>
					 <div className='form-group-item-label-required no-require'>
					 是否推送App :
          </div>
					<div className='form-group-item-content'>
						<CheckboxGroup onChange={this.changeAlarmMode} value={alarmMode}>
							{/* <Checkbox value={'1'}>电脑端页面推送</Checkbox> */}
							<Checkbox value={'2'}>App</Checkbox>	
						</CheckboxGroup>			
					</div> 
					{!!!alarmMode.length && errorShow && <div className='monitees-error' style={{marginTop: '10px'}}>至少选择一种报警方式</div>}
				</div>}

				{/* --------------------重复方式-------------------- */}
				<Form.Item>
					{getFieldDecorator('repeatMode', {
						rules: [{
							required: true
						}]
					})(
						<Input type="hidden" />
					)}
				</Form.Item>
				<div className='form-group-item repeat-mode-box'>
					<div className='form-group-item-label-required'>
						重复方式 :
          </div>
					<div className='form-group-item-content repeat-mode'>
						<RadioGroup style={{marginBottom:'10px'}} onChange={this.repeatMode} value={repeatModeState}>
							<Radio value={1}>每天</Radio>
							{/* <Radio value={2} style={{marginLeft: '50px'}}>工作日</Radio>
							<Radio value={3} style={{marginLeft: '50px'}}>周末</Radio> */}
							<Radio value={4} style={{marginLeft: '50px'}}>自定义</Radio>
						</RadioGroup>
						{	repeatModeState === 4 && 
							 timeBtns.map(v => (<Button
									key={v.value}
									className={repeatModeArr.indexOf(v.value) === -1 ? '' : 'active'}
									onClick={this.changeRepeatModeItem.bind(this,v.value)}
								>
									{v.label}
								</Button>)
							) 
						}
					</div>
				</div>
					{!!!repeatModeArr.length && errorShow && <div className='monitees-error repeat-mode-error' style={{marginTop: '10px'}}>至少选择一种重复方式</div>}
					{/* ---------------------------接收报警人员---------------------------- */}
					<Form.Item>
						{getFieldDecorator('acceptAlarmUserIds', {
							rules: [{
								required: true
							}]
						})(
							<Input type="hidden" />
						)}
					</Form.Item>
          <div className='form-group-item'>
            <div
              className='form-group-item-label-required'
            >
              接收报警人员 :
            </div>
            <div className='form-group-item-content'>
							<OrgTreeSelectUsers 
								defaultSelectUser={acceptAlarmUserIds}
								onChange={this.changeSelectUser}
								privilegeName={privilegeName}
								andOr={2}
							/>
               {!!!acceptAlarmUserIds.length && errorShow && <div className='monitees-error' style={{marginTop: '10px'}}>请输入管理权限</div>} 
            </div>
          </div> 
			</div>
		)
	}
}