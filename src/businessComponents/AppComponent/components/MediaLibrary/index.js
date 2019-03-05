import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { message, Tabs, Drawer } from 'antd';
import CollapseList from "./components/CollapseList";
import './index.less';
// 组件加载
const TabPane = Tabs.TabPane;
const IconSpan = Loader.loadBaseComponent('IconSpan')
const AuthComponent = Loader.loadBusinessComponent('AuthComponent')
const ModalComponent = Loader.loadBaseComponent('ModalComponent')
const PictureCanvas = Loader.loadBusinessComponent('PictureCanvas');
const PlayComponent = Loader.loadBusinessComponent('Player')
// 视图tab栏数据
const mediaTabs = [
  {
    title: '全部',
    value: 'all'
  },
  {
    title: '图片',
    value: 'image'
  },
  {
    title: '视频',
    value: 'video'
  }
] 

@withRouter
@Decorator.businessProvider('mediaLib', 'user', 'device')
@observer
class MediaLibView extends Component {
  constructor(props){
    super(props)
    this.state = {
      isEdit: false,// 批量编辑状态,
      visible: false, // 预览弹窗
      modalContent: {},
    }
  }
  
  componentDidMount(){
    const { user, mediaLib } = this.props;
    mediaLib.setData({
      userId: user.userInfo.id
    })
    mediaLib.getMediaList();
  }

  /**
   * @desc 切换视图库tab标签
   * @param {string} activeTab 选中tab
   */
  changeTab = (activeTab) => {
    // 1. 切换激活的tab,清空选中列表
    const { mediaLib } = this.props;
    mediaLib.setData({
      activeTab,
      selectList: []
    })
    // 2. 清空mediaList每一项的checkedList
    mediaLib.handleCheckAll(activeTab);
  }

  /**
   * @desc 切换视图库显示状态
   */
  toggleHidden = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    })
  }

  /**
   * @desc 单个删除
   * @param {object} item 要删除的视图数据集合
   */
  handleDeleteOne = (item) => {
    this.props.mediaLib.deleteBatch([item])
  }
  
  /**
   * @desc 批量删除
   */
  deleteBatch = () => {
    const { mediaLib } = this.props;
    const selectList = mediaLib.getSelectList();
    mediaLib.deleteBatch(selectList);
  }

  /**
   * @desc 摄像头选中
   */
  handleCheckCamera = (e, cameraId, idx) => {
    // 阻止事件冒泡
    Utils.stopPropagation(e);
    const { mediaLib } = this.props;
    const checked = e.target.checked;
    mediaLib.handleCheckCamera(cameraId, checked, idx);
  }

 /**
   * @desc 单个选中
   * @param {object} checkList 
   * @param {string} cameraId 
   */
  handleCheckItem = (checkList, cameraId) => {
    this.props.mediaLib.handleCheckItem(checkList, cameraId);
  }

  /**
   * @desc 单个下载
   * @param {object} item 
   */
  handleDownloadOne = (item) => {
    this.props.mediaLib.downloadBatch([item])
  }

  /**
   * @desc 批量下载
   */
  downloadBatch = () => {
    const { mediaLib } = this.props;
    const selectList = mediaLib.getSelectList()
    mediaLib.downloadBatch(selectList);
  }

  /**
   * @desc 图片预览
   * @param {object} item
   */
  handleImageView = (item) => {
    this.setState({
      visible: true,
      modalContent: {
        item,
        title: '图片预览',
        previewUrl: item.imgUrl
      }
    })
  }

  /**
   * @desc 取消图片预览
   */
  handleCancel = () => {
    this.setState({
      visible: false,
      modalContent: {}
    })
  }

  /**
   * @desc 播放历史视频
   */
  handleVideoPlay = (item) => {
    const { device } = this.props;
    const cameraInfo = device.queryCameraById(item.cameraId);
    const option = {
      deviceName: item.cameraName,
      cid: item.cameraId,
      startTime: new Date(item.startTime)*1 / 1000,
      endTime: new Date(item.endTime)*1 / 1000
    };
    Service.video.queryHistoryAddress(option).then((historyList) => {
      if(!historyList.fragments.length) {
        return message.warn('未获取到视频！')
      }
			const fileData = Object.assign({}, cameraInfo, {
        isLiving: false,
				historyList,
        timeRange: {
          startTime: option.startTime*1000,
          endTime: option.endTime*1000
        }
			});
      this.setState({
        visible: true,
        modalContent: {
          title: '视频查看',
          fileData,
        }
      })
		});
  }
  
  /**
   * @desc 历史视频下载
   */
  downloadVideo = ({startTime, endTime, fileData}) => {
    Shared.downloadVideo({ startTime, endTime, fileData });
  }

  // 复制下载链接
  handleCopyLink = (item) => {
    if(item.type === 'image'){
      return this.doCopyLink(item.imgUrl);
    }
    const shouldDownload = false;
    const { device } = this.props;
    device.asyncDownloadVideo({
      cameraId: item.cameraId,
      cameraName: item.cameraName,
      begin: Math.floor(new Date(item.startTime) / 1000),
      end: Math.floor(new Date(item.endTime) / 1000)
    }, shouldDownload, false).then(url => {
      if(!url) {
        return message.error('复制失败，请重试');
      }
      this.doCopyLink(url)
    })
  }

  doCopyLink = (url) => {
    this.inputDom.value = url
    this.inputDom.select();
    document.execCommand("Copy");
    message.success('复制成功');
  }

  beforeJumppage = (resolve) => {
    const { hideMediaLib } = this.props;
    this.setState({
      visible: false,
      modalContent: {}
    }, () => {
      hideMediaLib()
      resolve(true)
    })
  }

  render() {
    const { mediaLib, isVisible, hideMediaLib } = this.props;
    const { isEdit, visible, modalContent:{title, item, fileData, previewUrl} } = this.state;
    return (
      <Drawer
        className='media-lib-drawer-wrapper'
        placement="right"
        closable={false}
        width={300}
        onClose={hideMediaLib}
        visible={isVisible}
      >
        <div className='media-lib-module-wrapper'>
          <div className='media-lib-header'>
            <span className='title'>我的视图</span>
            <input style={{
                position: "absolute", 
                opacity: "0",
              }} 
              ref={input => this.inputDom = input}
            />
            <IconSpan
              className='close-btn'
              icon='icon-Close_Main'
              title='关闭'
              mode='horizontal'
              onClick={hideMediaLib}
            />
            <IconSpan
              mode='horizontal'
              className='edit-btn'
              onClick={this.toggleHidden}
              icon={isEdit ? 'icon-Delete_Light' : 'icon-Edit_Main'}
              label={isEdit ? '取消编辑' : '编辑'}
            />
          </div>
          <div className='media-lib-content'>
            <Tabs
              className='media-lib-tab'
              hideAdd={true}
              animated={true}
              activeTab={mediaLib.activeTab}
              onChange={this.changeTab}
            >
              {mediaTabs.map(v => {
                let dataType = v.value
                let collapseData = mediaLib.getTabMediaList(dataType);
                return (
                  <TabPane
                    key={dataType}
                    tab={<span>{v.title}</span>}
                  >
                    <CollapseList
                      collapseData={collapseData}
                      editStatus={!isEdit}
                      onCheckCamera={this.handleCheckCamera}
                      onCheckItem={this.handleCheckItem}
                      onDeleteOne={this.handleDeleteOne}
                      onDownloadOne={this.handleDownloadOne}
                      onVideoPlay={this.handleVideoPlay}
                      onImageView={this.handleImageView}
                      onCopyLink={this.handleCopyLink}
                    />
                  </TabPane>
                )
              })}
            </Tabs>
          </div>
          {isEdit && (
            <div className='media-lib-footer'>
              {mediaLib.activeTab !== 'all' && (
                <AuthComponent actionName={mediaLib.activeTab === 'image' ? 'BaselibImgDownload' : 'DownloadVideo'}>
                  <IconSpan
                    className='download-btn'
                    mode='horizontal'
                    icon="icon-Download_Main"
                    onClick={this.downloadBatch}
                    label={'下载'}
                  />
                </AuthComponent>
              )}
              <IconSpan
                className='delete-btn'
                mode='horizontal'
                icon="icon-Delete_Main"
                onClick={this.deleteBatch}
                label={'删除'}
              />
            </div>
          )}
          <ModalComponent
            visible={visible} 
            title={title}
            otherModalFooter={true}
            onCancel={this.handleCancel} 
            footer={null}
            className='media-library-model'
            >
            { !!previewUrl && (
              <PictureCanvas
                name={item.cameraName}
                imgUrl={previewUrl}
                data={item}
                beforeJumppage={this.beforeJumppage}
              />
            )}
            { fileData && (
              <PlayComponent
                isLiving={false}
                hasLiving={false}
                fileData={fileData} 
                hasHistory={false}
                hasDownload={false}
                hasScreenshot={false}
                method={{
                  downloadVideo: options => this.downloadVideo({ fileData, ...options })
                }}
              />
            )}
          </ModalComponent>
        </div>
      </Drawer>
    )
  }
}

export default MediaLibView;