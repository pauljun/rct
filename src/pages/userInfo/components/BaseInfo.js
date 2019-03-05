import React from 'react';
import ReactDOM from 'react-dom';
import {toJS} from 'mobx';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { 
  Form, Row, Col, Button, Input, Select, DatePicker, 
  InputNumber, Popconfirm, message ,Checkbox
} from 'antd';
import AddSystemLogoModal from './SystemLogo'

const FormItem = Form.Item
const Option = Select.Option
const IconFont = Loader.loadBaseComponent("IconFont");
const Title = Loader.loadBusinessComponent("SystemTitle");
const InputSelectTree = Loader.loadBusinessComponent("InputSelectTree");
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");
const FormUpload = Loader.loadBusinessComponent("UploadComponents",'UploadSingleFile');

@withRouter
@Decorator.businessProvider('userManagement','tab', 'user')
class BaseInfo extends React.Component {

  state={
    orgId: '',
    resetLoading: false,
    systemShow: false,
    isShowSystemLogoModel: false, // 显示logo设置模拟框
  }

  //定义systemLogo的Id名称
  systemLogoBox = 'systemLogoBox' + Math.random()
  systeLogoResItem = 'systeLogoResItem' + Math.random()

  componentDidMount() {
    const { location, isAdd } = this.props;
    let clickedOrgId = isAdd ? location.state.pageState.orgId : '';
    this.setState({orgId: clickedOrgId})

    document.querySelector('#root').addEventListener('click', this.closeSelectModel)
    document.getElementById(`${this.systemLogoBox}`).addEventListener('click',this.stopPropOfSelectModel)
    // ReactDOM.findDOMNode(this.formUpload).querySelector('.formUpload').addEventListener('click',this.stopPropOfSelectModel)
  }
  componentWillUnmount() {
    document.querySelector('#root').removeEventListener('click',this.closeSelectModel)
    document.getElementById(`${this.systemLogoBox}`).removeEventListener('click',this.stopPropOfSelectModel)
    // ReactDOM.findDOMNode(this.formUpload).querySelector('.formUpload').removeEventListener('click',this.stopPropOfSelectModel)
  }

  //点击空白处隐藏select模拟框
  closeSelectModel = (e) => {
    if(!this.systemLogoBoxBeingClicked){
      this.setState({
        isShowSystemLogoModel:false
      })
    }
  }

  // 点击select模拟框的删除按钮时，阻止事件冒泡隐藏模拟框
  stopPropOfSelectModel = (e) => {
    this.systemLogoBoxBeingClicked = true
    setTimeout(() => {
      this.systemLogoBoxBeingClicked = false
    }, 500)
  }

  //系统logo模拟
  showSystemLogoModel = () => {
    this.setState({
      isShowSystemLogoModel: true
    })
  }
  //选中logo
  selectSystemLogo = (id) => {
    this.props.selectSystemLogo(id);
    this.setState({
      isShowSystemLogoModel: false
    })
  }

/**删除系统logo和名称 */
delSystemMes(id,userId){
  // const searchFormat = Utils.queryFormat
  const { userManagement } = this.props
  let systemMes = toJS(userManagement.systemMes)
  let systemMesNow = systemMes.filter(item => {
    return item.systemId !== id
  })
  let delItem = systemMes.find(item => {
    return item.systemId === id
  })
  userManagement.setData({
    systemMes: systemMesNow
  })
  let systemMesToServer = JSON.parse(JSON.stringify(systemMesNow))
  systemMesToServer.forEach((item) => {
    if(item && item.systemName){
      item.systemName = item.systemName.replace(/#/,escape('#'))
      item.systemLogo = escape(item.systemLogo)
    }
  })
  // const ObjId = searchFormat(delItem.systemLogo.split('?')[1]).obj_id
 return Service.kvStore.setUserKvStore(
  {
    userId, 
    storeKey: 'SYSTEM_MES',
    storeValue: systemMesToServer
  }
 )
}

  //删除logo
  delSystemLogo = (id) => {
    const { userManagement, user } = this.props;
    this.delSystemMes(id, user.userInfo.id).then(() => {
      message.success('删除成功')
      this.forceUpdate()
    })
  }

  
  /**重置密码 */
  resetPsw = id => {
    this.setState({ resetLoading: true })
    Service.user.resetPassword(id).then(() => {
      message.success('重置密码成功')
      this.setState({ resetLoading: false })
    })
  }

  goAddRole = () => {
    const { location, tab } = this.props;
    tab.goPage({
      moduleName: 'roleView',
      location,
    })
  }

  disabledDate = (current) => {
    // Can not select days before today 
    return current && current < moment().subtract(1, 'd').endOf('day');
  }

  render() {
    const {
      user, userManagement, getFieldDecorator, initData, isDisabled, 
      roleList, userId, isView, isAdd, onUploadChange,
    } = this.props;
    const { systemShow, isShowSystemLogoModel, resetLoading, orgId } = this.state;
    const maxUserGrade = user.userInfo.userGrade || 100;
    let systemMesData = toJS(userManagement.systemMes)
    systemMesData && systemMesData.unshift({
      systemId: '',
      systemLogo: '',
      systemName: '默认',
      userList: [{}]
    }) 

    const imageUrl = this.props.imageUrl;
    const image = (
      <div className='user-avatar'>
        <img src={imageUrl} alt="" />
      </div>
    );
    const initImageDom = (
      <div className='user-avatar'>
        <img src={initData.userAvatarUrl} alt="" />
      </div>
    );
    return (
      <div className='baseInfo'>
        <Title name='基本信息'/>
        <Row>
          <Col span={24}>
            <FormItem
              className="uploadForm"
              label="上传头像:"
              ref={view => this.formUpload = view}
            >
              {getFieldDecorator('userAvatarUrl',{
                initialValue: isAdd ? '' : initData.userAvatarUrl
              })(
                <FormUpload
                  name="userAvatarUrl"
                  uploadDone={onUploadChange}
                  uploadService={Service.user.uploadImg}
                  uploadTip={false}
                  children= {imageUrl && !imageUrl.file 
                    ? image
                    : initData.userAvatarUrl
                    ? initImageDom
                    :''
                   }
                 
                  {...isDisabled} 
                />
              )}
            </FormItem>
            {!(isView || isAdd) && (
              <Button 
                className='user-reset-psw' 
                icon='lock'
                loading={resetLoading}
                onClick={() => this.resetPsw(userId)}
                >
                  重置密码
              </Button>
            )}
          </Col>
          <Col span={24}>
            <FormItem label="登录名称:">
              {getFieldDecorator('loginName', {
                rules: [
                  { required: true, message: '登录名称必须填写' },
                  { max: 20, message: '用户名最大长度20' }
                ],
                initialValue:isAdd?'':initData.loginName
              })(
                <Input
                  name="loginName"
                  placeholder="请填写登录名称"
                  {...isDisabled}
                />
              )}
            </FormItem>
            <FormItem className='userGradeInput'label='级别'>
              {getFieldDecorator('userGrade', {
                rules: [
                  { required: true, message: '级别必须填写' },
                  { type: 'integer', message: '级别为正整数' },
                  { //自定义验证规则
                    validator(rule, value, callback) {
                      const errors = [];
                      if (value < 1) {
                        errors.push('级别不能小于1')
                      }
                      if (value >= maxUserGrade) {
                        errors.push('级别应小于当前用户级别：' + maxUserGrade)
                      }
                      callback(errors);
                    }
                  },
                ],
                initialValue:isAdd? '':initData.userGrade
              })(
                <InputNumber
                  name="userGrade"
                  placeholder="请填写用户级别"
                  {...isDisabled}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="用户角色:">
              {getFieldDecorator('roleIds', {
                rules: [{ required: true, message: '用test色必须填写' }],
                initialValue:initData.roleIds&&(initData.roleIds.map(v => v))
              })(
                <Select
                    name="roleIds"
                    mode="multiple"
                    // className="ant-col-14 user-roleName"
                    placeholder="请选择用户角色"
                    {...isDisabled}
                  >
                    {roleList && roleList.map((item) => (
                      <Option key={item.id} value={item.id}>
                          {item.roleName}
                      </Option>
                    ))}
                  </Select>
              )
            }
            </FormItem>
            <FormItem label="有效期限:">
              {getFieldDecorator('validEndTime',{
                initialValue: isAdd? '' : initData.validEndTime && moment(Number(initData.validEndTime))})(
                <DatePicker
                  name="validEndTime"
                  className="datePick"
                  format="YYYY.MM.DD"
                  placeholder="失效时间"
                  {...isDisabled}
                  disabledDate={this.disabledDate}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="所属部门:">
              {getFieldDecorator('organizationId', {
                rules: [{ required: true, message: '所属部门必须填写' }],
                initialValue: isAdd ? orgId : initData.organizationId
              })(
                <InputSelectTree
                  {...isDisabled}
                  showSearch={false}
                  name="organizationId"
                  placeholder="请填写所属部门"
                />
              )}
            </FormItem>
            <FormItem label="系统名称:">
              <div id={this.systemLogoBox} className='systemLogoBoxStyle'>
                {getFieldDecorator('systemId', {initialValue:isAdd?'':initData.systemId?initData.systemId:''})(
                  <Select
                    placeholder="请选择系统名称"
                    {...isDisabled}
                    getPopupContainer={() => document.getElementById(`${this.systemLogoBox}`)}
                    onFocus={this.showSystemLogoModel}
                  >
                    {systemMesData && systemMesData.map((v, k) => {
                      console.log(systemMesData,33333333333)
                      let systemLogo = Utils.escapeUrl(v.systemLogo, false)
                      console.log(systemLogo,'系统图片')
                      return <Option value={v.systemId} key={k} title={v.systemName}>
                        <img src={systemLogo} width='40' />
                        <span className={!v.systemLogo ? 'systemName_res': ''}>{v.systemName}</span>
                      </Option>
                    }
                    )} 
                  </Select>
                )}
                {isShowSystemLogoModel && !isDisabled.disabled && 
                  <div className="syste_logo_res_item" id={this.systeLogoResItem}>
                  {systemMesData && systemMesData.map((v, k) => {
                    let systemLogo = Utils.escapeUrl(v.systemLogo, false)
                    return <div className="item" key={k}> 
                      <div 
                        className="list_info" 
                        title={v.userList&&v.userList.length > 0 ? '该系统logo已经被占用，不支持删除': ''}   
                        onClick={() => this.selectSystemLogo(v.systemId)}
                      >
                        <img src={systemLogo} width='40' />
                        <span className="systemName_res">{v.systemName}</span>
                      </div>
                      {v.userList&&v.userList.length === 0 && 
                        <Popconfirm title="确定删除该系统logo?" 
                          onConfirm={() => this.delSystemLogo(v.systemId)} 
                          okText="是" 
                          cancelText="否"
                          placement="leftTop"
                          getPopupContainer={() => document.getElementById(`${this.systeLogoResItem}`)}
                        > 
                          <IconFont type="icon-Close_Main" />
                        </Popconfirm>
                      }
                    </div>
                    }
                  )}
                  </div> 
                }
              </div>
              {!isView && (
                <Button 
                  icon='plus'
                  onClick={() => this.setState({ systemShow: true })}
                  className='user-info-button'
                >
                  添加
                </Button>
              )}
            </FormItem>   
          </Col>
        </Row>
        {systemShow && <AddSystemLogoModal 
          uploadDone={onUploadChange}
          uploadTip={false}
          userId={user.userInfo.id}
          cancel={() => this.setState({ systemShow: false })}
        />}
      </div>
    )
  }
}

export default BaseInfo