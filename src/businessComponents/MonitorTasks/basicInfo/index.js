import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Form, Input } from 'antd'
import CaptureTime from '../components/captionTime/index.js'
import moment from 'moment'
import './index.less'
const DateRangePicker = Loader.loadComponent('RangePicker')
@observer
class BasicInfo extends Component {
	componentDidMount(){
		let item = this.props.itemDate || {}
		if(item.name){
			this.props.form.setFieldsValue({
        name: item.name,
        description: item.description
      })
		}
	}

	/**
   * @desc 数据提交到父组件
   * @param {object} obj 要修改的字段集合
   */
	toFatherComponent = (obj) => {
		this.props.changeTasksData && this.props.changeTasksData(obj)
	}

	/**
   * @desc 选时控件change
   * @param {string} type 标记开始还是结束时间
   */
  timeChange = (type, value) => {
    if (type === 'startTime'){
			this.toFatherComponent({
        validTime : moment(new Date(value))
      })
    } else {
			this.toFatherComponent({
        invalidTime : moment(new Date(value))
      })
    }
	}

	/**
   * @desc 抓拍时间change
   * @param {object} obj
   */
	captureTimeChange = (obj) => {
		this.toFatherComponent(obj)
	}
	
	render(){
		const {
			validTime= moment(new Date()),
			invalidTime= moment().add('days',3),
			captureStartTime='00:00:00',
			captureEndTime='23:59:59'
		} = this.props.itemDate
		const { libType, form } = this.props
		const { getFieldDecorator } = form;
		return(
			<div className='task-basic-info monitee-tasks-box'>
				<Form.Item label='任务名称'>
					{getFieldDecorator('name', {
						rules: [{ 
							message: '请输入任务名称',
							required: true
						},
						{ 
							max: 50, 
							message: `布控任务名称不超过${50}个字`
						}]
					})(
						<Input placeholder='请输入布控任务名称' className='taks-name' />
					)}
				</Form.Item>
					<div className='form-group-item col-item'>
						<div className='form-group-item-label-required'>
							任务有效期 :
							</div>
						<div className='form-group-item-content'>
							<DateRangePicker
								allowClear={false}
								className='date-range'
								startTime={validTime}
								endTime={invalidTime}
								onChange={this.timeChange}
								divider="~"
							/>
						</div>
					</div>
					{libType === 3 && <div className='form-group-item task-capture-time-box'>
						<div className='form-group-item-label-required'>
							任务执行时间 :
							</div>
						<div className='form-group-item-content'>
							<CaptureTime
								captureStartTime={captureStartTime}
								captureEndTime={captureEndTime}
								captureTimeChange={this.captureTimeChange}
							/>
						</div>
					</div>}
					<Form.Item label='任务说明'>
						{getFieldDecorator('description', {
							rules:[{
								max: 200, message: `布控任务说明不超过${200}个字`
							}]
						})(
							<Input.TextArea 
								placeholder='请输入任务说明文字' 
								className='task-describe-basic'
								style={{ width: '80%', height: 100, resize: 'none' }}
							/>
						)}
					</Form.Item>
			</div>
		)
	}
}
export default BasicInfo