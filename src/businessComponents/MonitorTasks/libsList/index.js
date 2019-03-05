import React, { Component } from 'react'
import { Input, Form } from 'antd'
import ScoreSlider from '../components/score/index.js'
import LibSelect from '../components/libSelect/index.js'
import MachinLibTreeView from '../components/AIOlibsSelect/index.js'
import './index.less';

export default class LibsList extends Component {
	componentDidMount(){
		let item = this.props.itemDate || {}
		if(item.alarmThreshold){
			this.props.form.setFieldsValue({
        alarmThreshold: item.alarmThreshold,
        libIds: item.libIds ? item.libIds : [],
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
   * @desc 布控库选择
   * @param {array} 布控库id数组
   */
	onSelected = (data) => {
		this.toFatherComponent({
			libIds: data
		})
		this.props.form.setFieldsValue({
			libIds: data
		})
	}

	change = (scope) => {
		this.toFatherComponent({
			alarmThreshold: scope
		})
		this.props.form.setFieldsValue({
			alarmThreshold: scope
		})
	}
	
	render(){
		const { errorShow, itemDate, form } = this.props
		const { getFieldDecorator } = form
		const { alarmThreshold = 80, libIds = [] } = itemDate
		let libs = []
		if(this.props.item){
			libs = this.props.item.libs || []
		}
		let titleLibs = ['重点人员库', '合规人员库','魅影','布控库']
		return(
			<div className='monitee-tasks-box libs-list'>
				<Form.Item>
					{getFieldDecorator('alarmThreshold', {
						rules: [{
							required: true
						}]
					})(
						<Input type="hidden" />
					)}
				</Form.Item>
				<div className='form-group-item score-form-item alarm-threshold'>
					<div className='form-group-item-label-required'>
						告警阈值 : 
					</div>
					<div 
						className='form-group-item-content'
					>
						{/* <span className='score-span'>{ alarmThreshold }</span> */}
						<ScoreSlider 
							value={Number(alarmThreshold)}
							onChange={this.change}
							libType={this.props.libType}
						/>
					</div>
        </div>
				<Form.Item>
					{getFieldDecorator('libIds', {
						rules: [{
							required: true
						}]
					})(
						<Input type="hidden" />
					)}
				</Form.Item>
				<div className='form-group-item libs-sel-box'>
            <div className='form-group-item-label-required'>
              {titleLibs[this.props.libType - 1]} :
            </div>
             <div className='form-group-item-content'>
              {this.props.libType === 4 ?
               <MachinLibTreeView
								libs={libs}
								onSelected={this.onSelected}
							/>
              :<LibSelect 
                libIds={libIds}
                onSelected={this.onSelected}
                titleLibs={titleLibs[this.props.libType - 1]}
                libType={this.props.libType}
              /> } 
               {!!!libIds.length && errorShow && <div className='monitees-error' style={{marginTop: '10px'}}>请选择布控库</div>} 
            </div> 
          </div> 
			</div>
		)
	}
}