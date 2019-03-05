import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { Form, Input, Radio, Row, Col, Cascader ,message} from 'antd'
import ConfirmBtns from './components/ConfirmBtns';
import BaseInfo from './components/BaseInfo';
import { cloneDeep } from 'lodash';

import './index.less'
import { Promise } from 'q';


const FormItem = Form.Item
const RadioGroup = Radio.Group
const searchFormat = Utils.queryFormat
const _Cascader = Utils._Cascader
_Cascader.init({data: Dict.map.location});

const Title = Loader.loadBusinessComponent("SystemTitle");
const MapCenter = Loader.loadBusinessComponent("MapComponent",'ZoomCenter');
const WrapperView = Loader.loadBusinessComponent("SystemWrapper");

@withRouter
@Decorator.businessProvider('userManagement','tab','user','roleManagement')
@observer
class AddOrEditUser extends React.Component {

  state = {
    loading: false,
    visible: false,
    roleId: null,
    mapShow: true,
    zoomLevelCenter: null,
    centerPoint: null,
    roleList:[],
    initData:{}, 
    imgUrl:''
  }

  isAdd = null 
  isView = null
  userView = this.props.userView

  /**
   * 获取系统logo
   */
  getSystemMes = (data) => {
    const { userManagement}=this.props
    Service.kvStore.getKvStore(data).then(res => {
      userManagement.setData({systemMes: (res && eval("("+res.data.storeValue+")")) || []})
    }).catch(err => {
      console.error('获取系统logo失败', err)
    })
  }

  async componentWillMount() {
    const { user, userManagement, location ,userCheckItems} = this.props
    this.isView = this.userView === 'userCheck' ? true : false;
    this.isAdd = this.userView === 'userModify' ? true : false;
    if (!this.isAdd) {   
      const { id, name ,roleName,phoneNum,identityCardNum} = this.isView? userCheckItems:location.state.pageState;
      this.userId = id;
      this.getSystemMes({userId:user.userInfo.id,storeKey: 'SYSTEM_MES'})
      Service.user.queryUserInfo({id, name}).then(res => {
        const options = Object.assign({},res.data,{roleName,phoneNum,identityCardNum})
        this.setState({
          initData:options && options
        })
      })
    }
  }
  componentDidMount() {
    SocketEmitter.on('UPDATE_ROLE_LIST',this.updateRoleList);
    const { form } = this.props
    this.updateRoleList()
    if (this.isAdd) {
      form.setFieldsValue({
        userSex: 100001,
        validEndTime: moment().add(3, 'year'),
      })
    }
  }
  componentWillUnmount(){
    SocketEmitter.off('UPDATE_ROLE_LIST',this.updateRoleList);
  }
  // 监听角色列表变化
  updateRoleList = () => {
    const { roleManagement } = this.props;
    roleManagement.initData();
    roleManagement.editSearchData({pageSize:9999})
    roleManagement.queryRoleList().then(res => {
      this.setState({
        roleList:  res.data.list&&res.data.list 
      })
    })
  }

  submitUserForm = () => {
    const { form } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      //根据systemId去补全name和logo,将数据传给后台
      let systemIdNow = values.systemId
      let systemLogos = toJS(this.props.userManagement.systemMes)
      if(systemIdNow){
        systemLogos.forEach(item => {
          if(item.systemId === systemIdNow){
            values.systemLogo = item.systemLogo
            values.systemName = item.systemName
          }
        })
      }else{
        values.systemLogo = ''
        values.systemName = ''
      }
      if(this.userImgUrl && this.userAvatarUrl){
        let objId = searchFormat(this.userAvatarUrl.split('?')[1]).obj_id
        Service.lingyang.deleteFile(objId)
      }
      // let codeAddress = values.addressCode.join(',')
      // values.addressCode = codeAddress
      const { initData }=this.state
      values.zoomLevelCenter = this.zoom? this.zoom : initData.zoomLevelCenter
      values.centerPoint=this.centerPoint? this.centerPoint : initData.centerPoint
      values.userAvatarUrl=this.userImgUrl?this.userImgUrl:initData.userAvatarUrl
      values.addressCode=values.addressCode.join()
      values.validEndTime=Date.parse(new Date(values.validEndTime))
      this.isAdd ? this.addUser(values) : this.editUser(values)
    })
  }
  editUser(userInfo) {
    let changeUserInfoModel = Object.assign({}, this.state.initData, {
      ...userInfo
    });
    const {initData} = this.state
    const changeMobileInfo = {
      id:changeUserInfoModel.id,
      mobile:changeUserInfoModel.phoneNum,
    }
    const changeZomLevelCenter = {
      zoomLevelCenter:changeUserInfoModel.zoomLevelCenter,
      centerPoint:changeUserInfoModel.centerPoint
    }
     if(initData.phoneNum!==changeUserInfoModel.phoneNum){
       Service.user.changeMobile(changeMobileInfo)
     } 
     if(initData.centerPoint!==changeUserInfoModel.centerPoint || initData.zoomLevelCenter!==changeUserInfoModel.zoomLevelCenter){
      Service.user.changeZoomLevelCenter(changeZomLevelCenter)
     }
      Service.user.changeUser(changeUserInfoModel).then(res => {
        this.cancelUserForm(false, userInfo);
      }) 
  }
  addUser(userInfo) {
    const { user ,roleManagement} = this.props;
    let changeUserInfoModel = Object.assign({}, this.state.initData, {
      ...userInfo
    });
      userInfo.operationCenterId = user.userInfo.operationCenterId
      userInfo.mobile=userInfo.phoneNum
      Service.user.addUser(userInfo).then(() => {
      this.cancelUserForm(false, userInfo)
    }
    )
  }
  /**增加一个参数，代表是否是由点击按钮触发 isBtn为true代表是点击触发 */
  cancelUserForm = (isBtn, dataInfo) => {
    if(this.userImgUrl && isBtn) {
      let objId = searchFormat(this.userImgUrl.split('?')[1]).obj_id
      Service.lingyang.deleteFile(objId)
    }
    this.cancel(dataInfo)
  }

  /**记录当前页面对应的上传图片的url */
  onUploadChange = (value) => {
    this.userImgUrl = value.url
    this.setState({
      imgUrl:this.userImgUrl
    })
  }
  //选中logo
  selectSystemLogo = (id) => {
    this.props.form.setFieldsValue({
      systemId: id
    })
  }

  /**取消操作 */
  cancel = (dataInfo) => {
    const { location, tab } = this.props;
    tab.closeCurrentTab({ location })
    if(dataInfo){
      SocketEmitter.emit('UPDATE_OrgTree_LIST', dataInfo)
    }
  }

  mapChange = (info) => {
    this.zoom=info.zoom
    this.centerPoint=`${info.center.lng},${info.center.lat}`
  }

  Pointparse = (point) => {
    let arr = point.split(',');
    return [arr[0]*1, arr[1]*1]
  }
  render() {
    const { form:{getFieldDecorator} } = this.props
    const { roleList, initData ,imgUrl} = this.state;

    // 查看页面就禁用各种输入框
    const isDisabled = this.isView ? { disabled: true } : {}
    let zoomLevelCenter = {};
    if(!this.isAdd){
      zoomLevelCenter = {
        zoom:initData.zoomLevelCenter && initData.zoomLevelCenter,
        center: initData.centerPoint ? this.Pointparse(initData.centerPoint) : null
      }
    }
    const zoomOrLevel = zoomLevelCenter.zoom || zoomLevelCenter.center
    return (
      <WrapperView  
        name={`${this.isView ? '查看' : !this.isAdd ? '编辑' : '新建'}用户`}
        width='100%'
      >
      <div className='changeUserView'>
        <div className="changeUserLayer">
          <div className="userForm">
            <Form layout='vertical'>
              <BaseInfo 
                getFieldDecorator={getFieldDecorator}
                initData={initData}
                isDisabled={isDisabled}
                selectSystemLogo={this.selectSystemLogo}
                roleList={roleList}
                userId={this.userId}
                isAdd={this.isAdd}
                isView={this.isView}
                onUploadChange={this.onUploadChange}
                imageUrl={imgUrl}
              />
              <div className='identifyInfo'>
                <Title name='身份信息'/>
                <Row>
                  <Col span={24}>
                    <FormItem label="真实姓名:">
                      {getFieldDecorator('realName', {
                        rules: [
                          { required: true, message: '真实名称必须填写' },
                          { max: 20, message: '真实姓名最大长度20' }
                        ],
                        initialValue:this.isAdd?'':initData.realName
                      })(
                        <Input
                          name="realName"
                          type="text"
                          placeholder="请填写真实名称"
                          {...isDisabled}
                        />
                      )}
                    </FormItem>
                    <FormItem label="性别:">
                      {getFieldDecorator('userSex', {
                        rules: [{ required: true, message: '性别必须填写' }],
                        initialValue:this.isAdd?'':initData.userSex
                      })(
                        <RadioGroup name="userSex" {...isDisabled}>
                          <Radio value={100001}>男</Radio>
                          <Radio value={100002}>女</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="手机号码:">
                      {getFieldDecorator('phoneNum', {
                        rules: [
                          { required: true, message: '手机号码必须填写' },
                          { pattern: /^(1)\d{10}$/, message: '请输入正确手机号码'}
                        ],
                        initialValue:this.isAdd?'':initData.phoneNum
                      })(
                        <Input
                          type="text"
                          placeholder="请填写手机号码"
                          {...isDisabled}
                        />
                      )}
                    </FormItem>
                    <FormItem label="身份证号:">
                      {getFieldDecorator('identityCardNum', {
                        rules: [
                          {
                            pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                            message: '请填写正确的身份证号码'
                          }
                        ],
                        initialValue:this.isAdd?'':initData.identityCardNum
                      })(
                        <Input
                          type="text"
                          placeholder="请填写身份证号"
                          {...isDisabled}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="邮箱:">
                      {getFieldDecorator('email', {
                        rules: [
                          { required: false },
                          {
                            pattern: /^[0-9A-Za-zd]+([-_.][0-9A-Za-zd]+)*@([0-9A-Za-zd]+[-.])+[A-Za-zd]{2,4}$/,
                            message: '请填写正确的邮箱'
                          }
                        ],
                        initialValue:this.isAdd?'':initData.policeEmail
                      })(
                        <Input
                          type="text"
                          placeholder="请填写邮箱"
                          {...isDisabled}
                        />
                        )}
                    </FormItem>
                    <FormItem label="办公室座机号:">
                      {getFieldDecorator('telephone', {
                        rules: [
                          { required: false },
                          {
                            pattern: /^(0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?)$/,
                            message: '请输入正确座机号码'
                          }
                        ],
                        initialValue:this.isAdd?'':initData.telephone
                      })(
                        <Input
                          type="text"
                          placeholder="请填写办公室座机号"
                          {...isDisabled}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={24}>
                    <FormItem label="所在城市:">
                      {getFieldDecorator('addressCode', {
                        rules: [
                          { required: true, message: '所在城市必须填写' }
                        ],
                        initialValue:this.isAdd?'':initData.addressCode && initData.addressCode.split(',')                    
                      })(
                        <Cascader 
                          options={_Cascader.levelData} 
                          placeholder="请选择所在城市" 
                          showSearch
                          {...isDisabled}
                        />
                      )}
                    </FormItem> 
                  </Col>
                </Row>
              </div> 
              {!this.isView && (
                <div className='map-setting'>
                  <Title name='地图设置'/>
                  <div className='mapShow'>
                 {
                   this.isAdd?
                  <MapCenter className='userCenter-mpa' 
                    zoomCenter={zoomLevelCenter}
                    mapChange = {this.mapChange}
                    showMapInfo={false}
                    />:
                  zoomOrLevel && <MapCenter className='userCenter-mpa' 
                    zoomCenter={zoomLevelCenter}
                    mapChange = {this.mapChange}
                    showMapInfo={false}
                  />
                 }
                  </div>
                </div>
              )}
            </Form>
          </div> 
         { !this.isView && <ConfirmBtns 
            className='setting-edit-btns'
            // isView={this.isView}
            cancelUserForm={this.cancelUserForm}
            submitUserForm={this.submitUserForm}
          />}
        </div>
      </div>
      </WrapperView>
    )
  }
}
export default Form.create()(AddOrEditUser)