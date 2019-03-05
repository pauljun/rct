import React,{ Component } from 'react';
import { observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import { Button, message } from 'antd';
import './index.less';
// 加载组价
const MonitorNavigation = Loader.loadBusinessComponent('MonitorNavigation');
const FormLibInfo = Loader.loadBusinessComponent('MonitorLibrary','FormLibInfo');
const LibHeader = Loader.loadBusinessComponent('MonitorLibrary','LibHeader');
const AddLibPeople = Loader.loadBusinessComponent('MonitorLibrary','AddLibPeople');

@withRouter
@Decorator.businessProvider('monitorLib', 'tab')
@observer
class LibAddContainer extends Component {
  constructor(props) {
    super(props)
    this.libTypeInfo = {
      libType: 1,
      libLabel: '重点人员',
      moduleName: 'keyPersonnelLibraryView',
    }
    
    this.libInfo = {
      userIds: [BaseStore.user.userInfo.id], // 默认选中用户
      libType: 1, // 布控库类型 1- 重点人员  2-外来人员
    }
  }

  componentWillMount() {
    this.props.monitorLib.editSearchData({ libType: 1 });
  }

  /**
   * @desc 第一步：提交布控库信息
   */
  submitLibInfoForm = async () => {
    this.libInfoView.onSubmit(libInfo => {
      Service.monitorLib.addMonitorLib(libInfo).then(result => {
        if(result && result.data){
          libInfo.id = result.data.id;
          this.libInfo = libInfo; // 保存添加信息到本地
          this.submitPeople()
        }
      }).catch(err => {
        message.error(err.message || '创建布控库失败，请重试')
      })
    }) 
  }

  /**
   * @desc 第二步：提交布控人员
   */
  submitPeople = () => {
    // 1. 提交人员信息    
    this.multiView.onSubmit(this.libInfo, () => {
      // 2. 跳转列表
      this.jumpUrl();
    })
  }

  /**
   * @desc 取消新建布控库
   */
  handleCancel = () => {
    const that = this;
    that.multiView.onCancel(() => {
      that.jumpUrl()
    })
  }

  /**
   * @desc 路由跳转
   */
  jumpUrl = () => {
    const { tab, location } = this.props;
    tab.goPage({
      location,
      moduleName: this.libTypeInfo.moduleName,
      isUpdate: true
    })
  }
  
  render(){
    const { libType, moduleName, libLabel } = this.libTypeInfo;
    return (
      <MonitorNavigation
        libType={libType}
        currentMenu={moduleName}
        contentClass='monitee-lib-wrapper monitee-lib-add-wrapper'
      >
        <div className='lib-add-header'>
          <span className='highlight'>{`新建${libLabel}布控库`}</span>
        </div>
        <div className='lib-add-content-wrapper'>
          <div className='lib-add-content-container'>
            <LibHeader title={`${libLabel}库详情`} />
            <FormLibInfo
              libInfo={this.libInfo}
              viewRef={view => this.libInfoView = view}
            />
            <AddLibPeople
              libTypeInfo={this.libTypeInfo}
              viewRef={multiView => this.multiView = multiView}
            />
            <div 
              className='monitee-lib-btns'
            >
              <Button onClick={() => this.handleCancel()}>取消</Button>
              <Button type='primary' onClick={() => this.submitLibInfoForm()}>确定</Button>
            </div>
          </div>
        </div>
      </MonitorNavigation>
    )
  }
}

export default LibAddContainer;

