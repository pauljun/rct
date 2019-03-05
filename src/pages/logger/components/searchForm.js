import React from 'react';
import moment from 'moment';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { Form, Input, Button, Select, TreeSelect } from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const DateRangePicker = Loader.loadBaseComponent('RangePicker');
const IconFont = Loader.loadBaseComponent('IconFont');
const Search=Loader.loadBaseComponent('SearchInput');

@withRouter
@Decorator.businessProvider('logManagement','user','organization')
@observer
@Form.create({
	onFieldsChange: (props,files) => {
		let { user,form } = props;
    let data = {};
	  Object.keys(files).map(key => {
			data[key] = files[key].value
		})
			let options = {
				userAgent:data.userAgent&&[data.userAgent],
				userName: data.userName,
        modules: data.modules&&[data.modules.toString()],
        functions: data.functions&&[data.functions.toString()],
        description: data.description,
				organizationIds: data.organizationIds&&[data.organizationIds.toString()],
				offset: 0,
				centerIds: [_.cloneDeep(user.userInfo.operationCenterId)],
			}
			const newOptions = Object.assign({},data,options)
			props.search(newOptions);
	}
})
class SearchForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			actionModelTypeCopy:[],
			actionFeaturnTypeCopy: [],
			userInfo: {},
			// dateBegin: null,
			// dateEnd: moment(),

			dateBegin: null,
			dateEnd:moment(this.props.logManagement.searchData.endTime),
		};
	}


	componentDidMount(){    
		let {form,actionModelType}=this.props
		let actionModelTypeCopy=_.cloneDeep(actionModelType)
		actionModelTypeCopy.unshift({ code: null, text: '全部'})
		form.setFieldsValue({
			'userAgent': null,
		});
		this.setState({
			actionModelTypeCopy:actionModelTypeCopy
		})
	
	}

	 /**
   * 重置表单
   */
  reset = () => {
		let { logManagement,form } = this.props;
		logManagement.initData();
		let options = {
			description: '',
			userAgent: null,
		}
		let resetData = Object.assign({},logManagement.searchData,options)
		form.setFieldsValue({ ...resetData});
		this.setState({
			dateBegin: null,
			// dateEnd: moment()*1,
		})
		this.props.setEndTime()
    this.props.search()
  };
	handleSubmit = (e) => {
		let { user,form,search } = this.props;
		let userIds=[]
		e.preventDefault();
		 form.validateFieldsAndScroll((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
			if(values.userName){
				Service.user.queryUsers({keywords:`${values.userName}`}).then(res => {
					userIds=!!res.data.list.length&&res.data.list[0].id
				 }
				)
			}
			let options = {
				userAgent:values.userAgent&&[values.userAgent],
				userName: values.userName,
				userIds,
        modules: values.modules&&[values.modules.toString()],
        functions: values.functions&&[values.functions.toString()],
        description: values.description,
				organizationIds: values.organizationIds&&[values.organizationIds.toString()],
				offset: 0,
				centerIds: [_.cloneDeep(user.userInfo.operationCenterId)],
			};
			const newOptions = Object.assign({},values,options)
			search(newOptions);
		});
	};
	actionPlatType = (options) => {
		const { form,appList,actionModelType,actionFeaturnType,logInfoDict} = this.props;
		var actionFeaturnTypeCopy =[]
		var actionModelTypeCopy =[]
		if(options===undefined){
			form.setFieldsValue({
				"modules": undefined,
				"functions":undefined
			});
			actionModelTypeCopy= []
			actionFeaturnTypeCopy= []
		}else{
			form.setFieldsValue({
				"modules": null,
				"functions":null
			});
			if(options){
						if(options=='userAgentMobile'){
							_.unionBy([],appList,'code').map(v => {
								if(v.parent) {
									actionFeaturnTypeCopy.push(v);
								} else {
									actionModelTypeCopy.push(v);
								}
							})
						}else{
							logInfoDict.map(v => {
								if(v.parent) {
									actionFeaturnTypeCopy.push(v);
								} else {
									actionModelTypeCopy.push(v);
								}
							})
						}
					}else{
							actionModelTypeCopy= _.cloneDeep(actionModelType)
							actionFeaturnTypeCopy= _.cloneDeep(actionFeaturnType)
					}
			actionModelTypeCopy.unshift({ code: null, text: '全部'})
			actionFeaturnTypeCopy.unshift({ code: null, text: '全部'})
		}
		this.setState({
			actionModelTypeCopy,
			actionFeaturnTypeCopy
		})
	}
	menuTypeChange = (options) => {
		const { form, actionFeaturnType } = this.props;
		const {actionFeaturnList}=this.state
		var actionFeaturnTypeCopy =[]
		if(options===undefined){
			form.setFieldsValue({
				actionFeaturnTypeCopy: null,
				"functions":undefined
			});
			actionFeaturnTypeCopy=[]
		}else{
			form.setFieldsValue({
				actionFeaturnTypeCopy: null,
				"functions":null
			 });
			if(options){
				actionFeaturnTypeCopy=actionFeaturnType.filter(v => v.parent === options)
				actionFeaturnTypeCopy.unshift({code:null,text:'全部'}) 
			}else{
				actionFeaturnTypeCopy=actionFeaturnType
			}
		}
	
		
		this.setState({
			actionFeaturnTypeCopy,
		});
	};
	getTreeData = (data) => {
		let list = [];
		data.map((v) => {
			let childrenList = [];
			if (v.children && v.children.length > 0) {
				childrenList = this.getTreeData(v.children);
			}
			list.push({
				title: v.name,
				value: v.id + '',
				key: v.id,
				children: childrenList
			});
			return list;
		});
		return list;
	};
	timeChange = (type, value) => {
		const { logManagement } = this.props
    let {dateBegin, dateEnd} = this.state;
	  let startTime = moment(new Date(dateBegin)), endTime = moment(new Date(dateEnd));
	  if(type === 'startTime'){
      startTime = moment(new Date(value));
      this.setState({dateBegin: value});
	  } else{
      endTime = moment(new Date(value));
      this.setState({dateEnd: value});
		}
		// startTime = startTime.format('YYYY-MM-DD HH:mm:ss');
		// endTime = endTime.format('YYYY-MM-DD HH:mm:ss');		
		startTime = (new Date(startTime)).valueOf();
		endTime = (new Date(endTime)).valueOf();
		let timeOptions = {startTime, endTime}
		logManagement.editSearchData(timeOptions)
	}


	render() {
		const { getFieldDecorator } = this.props.form;
		const {actionPlatType,organization } = this.props
		const { actionFeaturnTypeCopy, dateBegin, dateEnd ,actionModelTypeCopy} = this.state;
		let treeData = this.getTreeData(toJS(organization.orgTreeData));
		return (
			<div className="logger-search-form">
				<Form layout="vertical" >
					<FormItem>
						{
							getFieldDecorator('userAgent')(
								<Select allowClear={true} onChange={this.actionPlatType} placeholder="请选择操作端" >
									{actionPlatType.map((v) => (
										<Option key={v.code} value={v.code} title={v.text}>
											{v.text}
										</Option>
									))}
              	</Select>
							)
						}
					</FormItem>
          <FormItem>
            {getFieldDecorator('modules')(
              <Select allowClear={true} onChange={this.menuTypeChange} placeholder="请选择操作模块">
                {actionModelTypeCopy.map((v) => (
                  <Option key={v.code} value={v.code} title={v.text}>
                    {v.text}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
					<FormItem>
            {getFieldDecorator('functions')(
              <Select allowClear={true} placeholder="请选择操作功能">
                {actionFeaturnTypeCopy.map((v) => (
                  <Option key={v.code} value={v.code} title={v.text}>
                    {v.text}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem className="rangeTime">
            {getFieldDecorator('rangeTime')(
							<DateRangePicker
								allowClear={false}
								startTime={dateBegin}
								endTime={dateEnd}
								onChange={this.timeChange}
					  	/>
					  )}
          </FormItem>
          <FormItem className="log-search-text">
            {getFieldDecorator('keywords', {
              rules: [
                { max: 100, message: '描述长度最大不能超过100' },
                { whitespace: true , message: '描述不能为空白'}
              ]
            })(<Search enterButton placeholder="请输入操作人姓名或描述搜索" />)}
          </FormItem>
				</Form>
			</div>
		);
	}
}

// export default Form.create({})(SearchForm);
export default SearchForm;

