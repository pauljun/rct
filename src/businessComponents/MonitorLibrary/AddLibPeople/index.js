import React, {Component} from 'react';
import { observer } from 'mobx-react';
import { message, Modal, Spin } from 'antd';
import * as _ from 'lodash';
import './index.less';

const ModalComponent = Loader.loadBaseComponent('ConfirmComponent');
const LibPeople = Loader.loadBusinessComponent('MonitorLibrary','LibPeople');
const FormPeopleInfo = Loader.loadBusinessComponent('MonitorLibrary','FormPeopleInfo');

const AuthActionArray = [
  'keyPersonnelLibraryManage', // 重点人员布控库增删改权限
  'outsiderLibraryManage', // 外来人员布控库增删改权限
  'placeholder', // 占位
  'privateNetLibraryManage' // 一体机布控库增删改权限
]

@Decorator.businessProvider('monitorLib')
@observer
class MultiPeople extends Component {
  constructor(props) {
    super(props);
    this.libType = props.libTypeInfo.libType;
    this.libLabel = props.libTypeInfo.libLabel;
    this.actionName = AuthActionArray[this.libType - 1]
  }
  state = {
    editVisible: false,
    editInfo: {},
    showResult: false, // 上传结果弹窗
    peopleList: [], // 人员列表
    spinningTip: '',
    spinning: false,
    isShowModel: false // 二次确认取消添加
  }
  componentWillMount() {
    const { viewRef } = this.props;
    viewRef && viewRef(this);
  }
  componentWillUnmount(){
    this.formCancleCallback = null
  }

  setSpinning = (spinning = true, spinningTip = '') => {
    this.setState({
      spinning,
      spinningTip
    })
  }

  /**
   * @desc 上传图片
   */
  uploadDone = (peopleList) => {
    const oldPeopleList = this.state.peopleList;
    const newPeopleList = oldPeopleList.concat(peopleList)
    this.setState({
      peopleList:newPeopleList
    })
  }

  /**
   * @desc 更新store中单个人员信息
   */
  updatePeopleItem = (peopleInfo, callback) => {
    const peopleList = this.state.peopleList
    let peopleItem = peopleList.find(v => v.id === peopleInfo.id);
    peopleItem = callback&&callback(peopleItem)
    this.setState({ peopleList })
  }

  /**
   * @desc 批量删除人员
   */
  deletePeopleBatch = (checkList, libId, callback) => {
    const { peopleList } = this.state;
    const deleteList = [], newPeopleList=[];
    peopleList.map(v => {
      if(checkList.indexOf(v.id) !== -1){
        deleteList.push(...v.infoList)
      } else {
        newPeopleList.push(v)
      }
    })
    this.deleteLyFile(deleteList);
    this.setState({ peopleList: newPeopleList });
    callback && callback()
  }

  /**
   * @desc 删除人员
   */
  deleteLibPeople = (peopleInfo, id, callback) => {
    //删除数据库中存储的图片
    this.deleteLyFile(peopleInfo.infoList) // 取消手动掉羚羊云接口，后期修改
    // 本地删除
    const peopleList = this.state.peopleList.filter(v => v.id !== peopleInfo.id);
    this.setState({ peopleList })
    callback && callback();
  }

  /**
   * @desc 羚羊存储删除
   */
  deleteLyFile = (fileList) => {
    if(fileList.length){
      let objIds=[];
      fileList.map(file => {
        objIds.push(file.url)
      });
      Service.monitorLib.deleteMonitorPersonPic(objIds)
    }
  }

  /**
   * @desc 保存布控库
   */
  onSubmit = async (libInfo, callback) => {
    const { peopleList } = this.state;
    if(!peopleList.length) {
      // 布控人员是否不为空验证
      return callback && callback()
    }
    // 保存回调函数
    this.submitCallback = callback;
    // 设置超时定时器
    this.setTimer();
    // 设置全局loading   
    this.setSpinning(true, '人员上传中，请耐心等待...');
    const option = peopleList.map(people => ({
      libId: libInfo.id,
      selfAttr: people.selfAttr,
      objectInfos: people.infoList.map(v => ({
        imageUrl: v.url,
        type: 1
      }))
    }));
    const result = await Service.monitorLib.addMonitorLibPersons({
      "monitorLibPersons": option
    }, libInfo);
    if(this.timeout){
      console.log('上传成功')
      // 取消定时器
      clearTimeout(this.timeout);
      if (!result){
        this.showResult('信息保存失败，请重试', false)
        return 
      }
      // 显示上传结果
      this.showResult(`共添加${result.data.totalPictureCount}个图片，成功${result.data.successPictureCount}张，失败${result.data.totalPictureCount - result.data.successPictureCount}张`)
    }
  }

  /**
   * @desc 设置超时定时器
   */
  setTimer = () => {
    this.timeout = setTimeout(() => {  
      console.log('上传超时')
      this.timeout = null   
      this.showResult('上传时间超过1分钟，请到布控库中查询上传结果')
    },1000*60)
  }

  /**
   * @desc 显示上传结果弹窗
   */
  showResult = (title, goBack = true) => {    
    // 取消全局loading  
    this.setSpinning(false);
    const that = this;    
    Modal.info({
      title,
      keyboard: false,      
      okText: '确定',
      onOk() {
        goBack && that.submitCallback();     
      }
    });
  }

  /**
   * @desc 取消新建布控库
   */
  onCancel = (callback) => {
    this.formCancleCallback = callback
    this.setState({
      isShowModel: true
    })
  }

  /**
   * @desc 确认取消，跳转布控库查看页面
   */
  toViewLibList = () => {
    const { peopleList } = this.state
    let fileList = [];
    peopleList.map(v => fileList.push(...v.infoList))
    this.deleteLyFile(fileList);
    //跳转
    this.formCancleCallback && this.formCancleCallback();
  }

  /**
   * @desc 取消新建弹框退出
   */
  handleFormCancel = () => {
    this.setState({
      isShowModel: false
    })
  }

  render() {
    const { libTypeInfo } = this.props;
    const { editInfo, editVisible, peopleList, spinning, spinningTip, isShowModel } = this.state;
    const currentLength = peopleList.length;
    const libDetail = {
      objectMainList: peopleList,
    }
    return (
      <div className={'monitee-multi-people-wrapper'}>
        <LibPeople 
          actionName={this.actionName}
          deleteCheckable
          libTypeInfo={libTypeInfo}
          libDetail={libDetail}
          currentLength={currentLength}
          uploadDone={this.uploadDone}
          deleteLibPeople={this.deleteLibPeople}
          editLibPeople={this.editLibPeople}
          deletePeopleBatch={this.deletePeopleBatch}
        />
        <ModalComponent
          className='monitee-lib-modal'
          visible={editVisible}
          title={`编辑${this.libLabel}：${editInfo.selfAttr && editInfo.selfAttr.name}`}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
          width='800px'
        >
          <FormPeopleInfo 
            formRef={form => this.editForm = form}
            uploadType='local'
            selfAttr={editInfo.selfAttr}
            infoList={editInfo.infoList}
            deleteImg={this.deleteImg} 
            beforeUpload={this.editBeforeUpload}
            uploadDone={this.editUploadDone}
          />
        </ModalComponent>   
        {spinning && (
          <Spin 
            size="large"
            className='monitor-spin-content'
            wrapperClassName="monitor-spin-wrapper"
            tip={spinningTip}
            spinning={true}
          >
            <div></div>
          </Spin>
        )}
        <ModalComponent
          title="提示"
          visible={isShowModel}
          onCancel={this.handleFormCancel}
          onOk={this.toViewLibList}
          className='monitor-tasks-model'
          img='warning'
        >
          <div className='model-content'>
            <div className="title-name">
               确定取消操作吗?
            </div>
          </div>
        </ModalComponent>
      </div>
    )
  }
  
  /**
   * @desc 删除图片
   */
  deleteImg = (item) => {
    const uid = item.uid;
    const { editInfo } = this.state;
    editInfo.infoList = editInfo.infoList.filter(v => v.uid !== uid);
    this.setState({
      editInfo
    })
  }
  editBeforeUpload = (v) => {
    // 设置loading
  }

  /**
   * @desc 单个布控对象增加图片
   */
  editUploadDone = (file) => {
    // 保存图片到本地
    if(file){
      const { editInfo } = this.state;
      editInfo.infoList.push(file);
      this.setState({
        editInfo
      })
    }
  }

  /**
   * @desc 保存单个人员编辑信息
   */
  handleOk = () => {
    // 上传图片到羚羊
    this.editForm.validateFields((err,values) => {
      if (err) {
        return message.error('表单填写有误')
      }
      const { editInfo } = this.state;
      // 1. 批量上传图片到羚羊
      const fileList = editInfo.infoList.filter(v => v.isNeedToUpload);
      if(fileList.length){
        Promise.all(fileList.map(file => Service.monitorLib.uploadMonitorPersonPic(file)))
        .then(results => {
          let errCount = 0;
          results.map((v,k) => {
            if(v.url){
              fileList[k].url = v.url;
              fileList[k].isNeedToUpload = "";
            } else {
              errCount++
              fileList.splice(k,1) 
            }
          })
          errCount && message.info(`${errCount}张图片上传失败`);
          // 2. 保存用户信息
          this.updatePeopleItem(editInfo, peopleItem => {
            peopleItem.selfAttr = values
            peopleItem.infoList = editInfo.infoList
            return peopleItem
          })
          // 3. 取消模态框
          this.handleCancel()
        })
      } else {
        this.updatePeopleItem(editInfo, peopleItem => {
          peopleItem.selfAttr = values
          peopleItem.infoList = editInfo.infoList
          return peopleItem
        })
        this.handleCancel()
      }
    })
  }
 
  /**
   * @desc 取消人员编辑
   */
  handleCancel = () => {
    this.setState({
      editVisible: false,
      editInfo: {}
    })
  }

  /**
   * @desc 编辑布控人员
   */
  editLibPeople = (item) => {
    const editInfo = _.cloneDeep(item);
    this.setState({
      editVisible: true,
      editInfo
    })
  }
}


export default MultiPeople;