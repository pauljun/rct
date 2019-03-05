import React,{ Component } from 'react';
import { toJS } from 'mobx';
import { Form, Input, message } from 'antd';
import './index.less'
// 管理权限
const OrgTreeSelectUsers = Loader.loadBusinessComponent('OrgTreeSelectUsers');
const privilegeNames = [
  ['keyPersonnelLibraryView'],
  ['outsiderLibraryView'],
  [''],
  ['privateNetLibraryView']
]

@Form.create() 
class FormLibInfo extends Component {
  state = {
    userIds: [],
    checkUserId: false
  }

  /**
   * @desc 提交数据
   * @params {func} 验证成功后的回调函数
   */
  onSubmit(callback){
    this.props.form.validateFields((err, libInfo) => {
      if(err){
        return message.error('表单填写有误')
      }
      const userList = this.state.userIds    
      if(!userList.length){
        this.setState({
          checkUserId: true
        })
        return message.error('管理人员不能为空')
      }
      libInfo.userIds = userList;
      libInfo.libType = this.props.libInfo.libType
      callback && callback(libInfo)
    })
  }

  /**
   * @desc 从OrgTreeSelectUsers组件拿到userIds
   * @param {array} userList 管理权限用户
   */
  setCheckedKeys = (userList) => {
    let userIds = userList.map(item => item.id)
    this.setState({ 
      userIds,
      checkUserId: true
    })
    this.props.form.setFieldsValue({
      userIds
    })
  }

  componentWillMount(){
    const { viewRef, libInfo } = this.props;
    viewRef(this);
    this.setState({
      userIds: libInfo.userIds || []
    })
  }

  componentDidMount(){
    const { form, libInfo } = this.props;
    if(libInfo && libInfo.id){
      let userIds = toJS(libInfo.userIds);
      form.setFieldsValue({
        name: libInfo.name,
        description: libInfo.description,
        userIds
      })
    }
  }

  render() { 
    const { userIds, checkUserId } = this.state;
    let label = this.props.libInfo.libType === 1 ? '重点人员' : '合规人员';
    const hasError = !userIds.length;
    const privilegeName = privilegeNames[this.props.libInfo.libType - 1]
    const { getFieldDecorator } = this.props.form
    return (
      <Form
        className='monitee-form-lib-info'
        layout='horizontal'
        autocomponent="off"
      >
        <Form.Item label={`${label}库名称`}>
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              message: `请输入${label}库名称`
            },{
              max: 50, 
              message: `${label}库名称不超过${50}个字`
            }]
          })(
            <Input placeholder={`请输入${label}库名称`}/>
          )}
        </Form.Item>
        <Form.Item label={`${label}库描述`}>
          {getFieldDecorator('description', {
            rules: [{
              max: 200,
              message: `布控库描述不超过${200}个字`
            }]
          })(
            <Input.TextArea />
          )}
        </Form.Item>
        <Form.Item className='user-id-container'>
          {getFieldDecorator('userIds')(
            <Input type='hidden' />
          )}
        </Form.Item>
        <div className='promission-container ant-form-item'>
          <div className='ant-form-item-label'>
            <label className='ant-form-item-required'>
              管理权限
            </label>
          </div>
          <div className='ant-form-item-control-wrapper'>
            <OrgTreeSelectUsers 
              defaultSelectUser={userIds}
              privilegeName={privilegeName}
              onChange={this.setCheckedKeys}
            />
            {hasError && checkUserId && <div className='ant-form-explain'>请输入管理权限</div>}
          </div>
        </div>
      </Form >
    )
  } 
}

export default FormLibInfo;

