import React from 'react';
import { Button, message } from 'antd';
import { withRouter } from 'react-router-dom';
import ListView from './view/list';
import MapView from './view/map';
import _ from 'lodash';

import ResourceTreeView from './components/ResouceTree';
import { observer } from 'mobx-react';
import VideoLoopSetting from './components/VideoLoopSetting';
import GroupModal from './components/GroupModal';
import { Provider } from './moduleContext';
import MoveableTimeChoise from './components/MoveableTimeChoise';
import LinkTools from './components/LinkTools';

import './style/index.less';

const videoScreen = Dict.getDict('videoScreen');
const ClusterMap = Loader.loadBusinessComponent('MapComponent','ClusterMap');
const IconFont = Loader.loadBaseComponent('IconFont');

@withRouter
@Decorator.businessProvider(
  'organization',
  'device',
  'tab',
  'deviceGroup',
  'videoModule',
  'user'
)
@Decorator.withEntryLog()
@observer
class VideoSurveillance extends React.Component {
  constructor(props) {
    super(props);
    this.videoLayoutDom = React.createRef();
    this.mapViewRef = React.createRef();
    this.listViewRef = React.createRef();
    this.slideDom = React.createRef();
    this.timeChoiseRef = React.createRef();
    this.playerDatas = []; //当前播放的视频列表
    
    //TODO 轮巡相关
    this.loopList = []; //轮巡设备列表
    this.loopInterval = 1000; //轮巡间隔时间
    this.loopVideoBox = null; //可轮巡的播放容器配置
    this.loopListNumber = 1; //轮巡设备的页数
    this.loopTimer = null; //轮巡定时器
    this.loopOneListSize = 0; //每次轮巡的数量
    
    const { location } = this.props;
    const urlParams = Utils.queryFormat(location.search);
    const mapMode = !(urlParams.mapMode === "false");
    this.state = {
      mapMode,
      isSlide: true,
      selectDevice: [],
      isLoop: false,
      showLoopSetting: false,
      loopOrgInfo: {},
      loopGroupName: null,
      showGroup: false,
      currentGroup: null,
      groupModalKey: Math.random(),
      loopModalKey: Math.random(),
    };
  }
  /**
   * @desc context 属性
   */
  getModuleContext() {
    return {
      isMapMode: this.state.mapMode, //是否地图模式
      selectDevice: this.state.selectDevice, //选中的设备集合
      onSelectDevice: this.onSelectDevice, //地图模式选中设备后执行的逻辑
      setDeviceListForCurrentPlayerBox: this.setDeviceListForCurrentPlayerBox, //对比播放中的设备，匹配当前选中设备列表，去除无效的设备选中状态
      startVideoLoop: this.startVideoLoop, //
      endVideoLoop: this.endVideoLoop, //
      showLoopSettingLayout: this.showLoopSettingLayout, //
      closeLoopSettingLayout: this.closeLoopSettingLayout, //
      playBoxConfig: [], //对于轮巡的窗口配置
      isLoop: this.state.isLoop, //轮巡的状态
      loopOrgInfo: this.state.loopOrgInfo,
      loopGroupName: this.state.loopGroupName,
      deleteGroupDevice: this.deleteGroupDevice,
      editGroupDevice: this.editGroupDevice,
      showGroupModal: this.showGroupModal,
      goPage: this.goPage,
      deleteGroup: this.deleteGroup,
      videoLayoutDom: this.videoLayoutDom.current,
      handleHistoryVideo: this.handleHistoryVideo, // 处理历史视频时间选择
      toggleTimeChoiseContent: this.toggleTimeChoiseContent, // 时间控件开关
      getHistoryTimeRange: this.getHistoryTimeRange, // 获取历史视频时间
      queryRealTimeAddressMulti: this.queryRealTimeAddressMulti, // 获取实时视频流
      queryHistoryAddress: this.queryHistoryAddress, // 获取历史视频流
    };
  }

  componentDidMount() {
    const { deviceGroup, device, location } = this.props;
    deviceGroup.initGroupData();
    this.getDevicePrefercence().then(() => {
      const urlParams = Utils.queryFormat(location.search);
      if(!urlParams.pid) { 
        return 
      }
      LM_DB.get('parameter', urlParams.pid).then(result => {
        if(!result) {
          return 
        }
        const { selectIds = [] } = result.data;
        let currentVideoScreen = videoScreen[1];
        if (selectIds.length > 4) {
          currentVideoScreen = videoScreen[2];
        }
        if (selectIds.length > 9) {
          currentVideoScreen = videoScreen[3];
        }
        if (currentVideoScreen !== videoScreen[1]) {
          this.selectSrceen(currentVideoScreen);
        }
        const list = device.queryCameraListByIds(selectIds);
        if (list.length > 0) {
          this.setState({ selectDevice: list }, () => {
            const listViewRef = this.listViewRef.current;
            listViewRef && listViewRef.selectDevice(list);
          });
        }
      })
    })
  }

  componentWillUnmount() {
    clearInterval(this.loopTime);
    setTimeout(() => {
      this.mapViewRef = null;
      this.listViewRef = null;
      this.slideDom = null;
      this.playerDatas = null;
      this.loopList = null;
      this.loopInterval = null;
      this.loopVideoBox = null;
      this.loopListNumber = null;
      this.loopTimer = null;
      this.loopOneListSize = null;
      this.timeChoiseRef = null;
    }, 60);
  }

  /**
   * @desc 切换模式清空已选中的设备
   */
  changeModeBtn = () => {
    const { mapMode, isLoop } = this.state;
    Utils.exitFullscreen();
    if (isLoop) {
      this.endVideoLoop();
    }
    this.playerDatas = [];
    const clearTime = true;
    this.toggleTimeChoiseContent(false, clearTime);
    this.setState({
      mapMode: !mapMode,
      selectDevice: [],
    }, () => {
      this.goPage({
        moduleName: 'videoSurveillance',
        isUpdate: true,
        action: 'replace',
        data: { mapMode: !mapMode, }
      })
    });
  };

  /**
   * 隐藏左侧树形控件
   */
  slideAction = () => {
    const { isSlide } = this.state;
    this.setState({ isSlide: !isSlide });
  };

  /**
   * @desc 显示轮巡的配置Modal 获取轮巡的摄像机列表
   * @param {object} item 组织信息
   * @param {boolean} isGroup 是否从分组过来
   */
  showLoopSettingLayout = (item, isGroup) => {
    const { isLoop } = this.state;
    if (isLoop) {
      return message.warn('当前正在执行轮巡任务！');
    }
    if (isGroup) {
      this.loopList = item.deviceList;
      this.setState({
        showLoopSetting: true,
        loopGroupName: item.groupName,
        loopModalKey: Math.random()
      });
    } else {
      const { device } = this.props;
      this.loopList = device.queryCameraByIncludeOrgId(item.id);
      this.setState({
        showLoopSetting: true,
        loopOrgInfo: item,
        loopModalKey: Math.random()
      });
    }
  };

  /**
   * @desc 关闭轮巡配置窗口
   */
  closeLoopSettingLayout = () => {
    this.setState({
      showLoopSetting: false,
      loopOrgInfo: {},
      loopGroupName: null
    }, () => {
      setTimeout(() => this.setState({ loopModalKey: Math.random() }), 500);
    });
  };

  /**
   * @desc 开始轮巡
   */
  startVideoLoop = ({ loopInterval, loopScreen, loopVideoBox }) => {
    this.setState({ showLoopSetting: false });
    this.selectSrceen(loopScreen);
    this.loopInterval = loopInterval;
    this.loopVideoBox = loopVideoBox;
    this.loopListNumber = 1;
    this.loopOneListSize = this.loopVideoBox.filter(v => v.isLoop).length;
    this.listViewRef.current.setLoopVideBox(this.loopVideoBox);
    this.setState({ isLoop: true });
    this.setCurrentLoopList();
    this.loopTimer = setInterval(() => {
      this.loopListNumber++;
      Array.isArray(this.loopList) && this.setCurrentLoopList();
    }, this.loopInterval + 1000);
  };

  /**
   * @desc 设置当前需要轮巡的设备
   */
  setCurrentLoopList() {
    const { selectDevice } = this.state;
    let startIndex = (this.loopListNumber - 1) * this.loopOneListSize;
    if (this.loopList.length <= this.loopOneListSize) {
      this.loopListNumber = 0;
    } else {
      if (startIndex + this.loopOneListSize >= this.loopList.length) {
        startIndex = this.loopList.length - this.loopOneListSize;
        this.loopListNumber = 0;
      }
    }
    let list = this.loopList.slice(
      startIndex,
      startIndex + this.loopOneListSize
    );
    this.listViewRef.current.playMethodForLoopDevice(list);
    this.setState({ selectDevice: selectDevice.concat(list) });
  }

  /**
   * @desc 结束轮巡
   */
  endVideoLoop = () => {
    this.loopList = [];
    this.loopListNumber = 1;
    this.loopVideoBox.forEach(item => {
      item.isLoop = false;
    });
    this.listViewRef.current.setLoopVideBox(this.loopVideoBox);
    clearInterval(this.loopTimer);
    this.setState({
      isLoop: false,
      loopOrgInfo: {},
      loopGroupName: null
    });
    message.success('结束轮巡！');
  };

  /**
   * @desc 摄像机列表选中设备后，执行的逻辑
   * @param {Object<CameraDevice>} item
   */
  onSelectDevice = (item, options={isLiving: true}) => {
    const { mapMode } = this.state;
    if (mapMode) {
      // 地图模式只能选中一个设备
      this.setState({ selectDevice: [item] });
      this.mapViewRef.current.wrappedInstance.markerClick(item, options);
    } else {
      // 列表模式可选中多个设备
      // 当前设备已经在播放实时视频，不做任何操作
      const livePlaying = this.playerDatas.find(v => v.cid === item.cid && v.isLiving === true);
      if(livePlaying) {
        return message.info('当前设备实时视频已打开')
      }
      const { selectDevice } = this.state;
      selectDevice.push(item);
      this.setState({ selectDevice });
      this.listViewRef.current.selectDevice([item]);
    }
  };

  /**
   * @desc 方法成功后，play容器返回，播放信息集合对比选中设备，删除无效选中的设备
   * @param {Object<CameraDevice & file | historyList>} playerDatas
   */
  setDeviceListForCurrentPlayerBox = playerDatas => {
    const { selectDevice } = this.state;
    this.playerDatas = playerDatas;
    const hasHistory = this.playerDatas.find(v => !v.isLiving && v.cid);
    if(!hasHistory) {
      const clearTime = true;
      this.toggleTimeChoiseContent(false, clearTime);
    }
    //TODO 子组件反馈播放容器数据后，核对选中的设备
    let list = selectDevice
      .map(item => {
        const isHas =
          this.playerDatas
            .filter(v => !!v)
            .findIndex(
              v => v.id === item.cid || v.id === item.id
            ) > -1;
        return isHas ? item : null;
      })
      .filter(v => !!v);
    this.setState({ selectDevice: list, loopModalKey: Math.random() });
  };

  /**
   * @desc 切换屏幕数量
   * @param {Object<>} item
   */
  selectSrceen = item => {
    const { videoModule } = this.props;
    videoModule.setVideoScreen(item);
  };

  /**
   * @desc 关闭按钮后，清空选中的设备
   */
  clearSelectDevice = () => {
    this.playerDatas = [];
    this.toggleTimeChoiseContent(false);
    this.setState({ selectDevice: [], loopModalKey: Math.random() });
  };

  /**
   * @desc 列表模式关闭一个窗口(检测时间控件是否需要更新)
   */
  closeSingleVideo = (fileData) => {
    const { deviceInfo } = this.timeChoiseRef.current.state;
    if (!fileData.isLiving && fileData.cid === deviceInfo.cid) {
      const nextHistory = this.playerDatas.find(v => !v.isLiving && v.cid);
      if(nextHistory) {
        this.updateTimeChoiseDeviceInfo(nextHistory);
      }
    }
  }

  /**
   * @desc 提供子组件新开页签的方法
   * @param {Object} options
   */
  goPage = options => {
    const { location ,tab } = this.props;
    tab.goPage({
      location,
      ...options
    });
  };

  /**
   * @desc 删除收藏下的设备
   * @param {Object} item
   */
  deleteGroupDevice = item => {
    const { deviceGroup } = this.props;
    return deviceGroup.deleteGroupDevice(item);
  };

  /**
   * @desc 新增收藏下的设备
   * @param {Object} item
   */
  editGroupDevice = (items, isEmpty) => {
    const { deviceGroup } = this.props;
    return deviceGroup.editDevice(items, isEmpty);
  };

  /**
   * @desc 打开分组弹窗
   * @param {boolean} isEdit
   * @param {Object} group
   */
  showGroupModal = (isEdit, group) => {
    this.setState({
      showGroup: true,
      currentGroup: isEdit ? group : null,
      groupModalKey: Math.random()
    });
  };

  /**
   * @desc 关闭分组弹窗
   */
  hideGroupModal = () => {
    this.setState({ showGroup: false });
  };

  /**
   * @desc 新增分组
   */
  addOrEditGroup = (isEdit, name, list, group) => {
    const { deviceGroup } = this.props;
    let deviceIds = list.map(v => `${v.cid}/${v.deviceName}`);
    if (isEdit) {
      return deviceGroup
        .editGroup(
          { groupName: group.groupName },
          { groupName: name, deviceIds }
        )
        .then(() => {
          this.hideGroupModal();
          message.success('操作成功！');
        });
    } else {
      return deviceGroup
        .add({
          groupName: name,
          deviceIds
        })
        .then(() => {
          this.hideGroupModal();
          message.success('操作成功！');
        });
    }
  };
  
  cancelAddGroup = () => {
    this.setState({ showGroup: false });
  };

  /**
   * @desc 删除收藏下的设备
   * @param {String} name
   */
  deleteGroup = name => {
    const { deviceGroup } = this.props;
    return deviceGroup.delete({ groupName: name });
  };

  // 历史视频业务
  /**
   * @desc 处理历史视频点击事件
   * @param {object} item: 设备信息
   */
  handleHistoryVideo = async (item) => {
    if(!item.storageLimit) {
      const storageLimit = await this.getDeviceStorageLimit(item);
      item.storageLimit = storageLimit;
    }
    this.updateTimeChoiseDeviceInfo(item);
    this.toggleTimeChoiseContent();
  }

  // 查询设备存储周期
  getDeviceStorageLimit = (item) => {
    return Service.device.queryDeviceInfoByCid(item.cid).then(result => {
      let storageLimit;
      try {
        storageLimit = +result.data.extJson.cameraInfo.storage.video || 7;
      } catch {
        storageLimit = 7;
      }
      return storageLimit;
    }).catch(e => 7);
  }

  // 更新设备
  updateTimeChoiseDeviceInfo = (item) => {
    this.timeChoiseRef.current.setDeviceInfo(_.cloneDeep(item));
  }
  /**
   * @desc 提交选时控件时间
   * @param {object} options: { startTime, endTime }
   */
  submitHistoryTime = (options) => {
    const MAX_HISTORY_GAP = 7;
    if(options.startTime - options.endTime > 3600 * 24 * MAX_HISTORY_GAP) {
      return message.error(`历史视频查看不能超过${MAX_HISTORY_GAP}天`);
    }
    options.isLiving = false;
    const { mapMode, selectDevice } = this.state;
    const { deviceInfo } = this.timeChoiseRef.current.state;
    if(mapMode) {
      this.onSelectDevice(deviceInfo, options);
    } else {
      const playerIndex = this.playerDatas.findIndex(v => v.cid === deviceInfo.cid && v.isLiving === false);
      selectDevice.push(deviceInfo);
      this.setState({ selectDevice });
      this.listViewRef.current.playerHistoryVideo(options, playerIndex, deviceInfo);
    }
  }
  // 获取选时控件时间
  getHistoryTimeRange = () => {
    const { startTime, endTime } = this.timeChoiseRef.current.state;
    const timeRange = {
      startTime, endTime
    }
    return timeRange;
  }
  /**
   * @desc 选时控件显示或隐藏开关
   * @params {boolean} visible 显示/隐藏
   * @params {boolean} clearTime 清空时间
   */
  toggleTimeChoiseContent = (visible=true, clearTime=false) => {
    if(!visible) {
      this.timeChoiseRef.current.setDeviceInfo();
    }
    this.timeChoiseRef.current.setVisible(visible, clearTime);
  }

  /**
   * @desc 获取历史视频流
   */
  queryHistoryAddress = ({cid, startTime, endTime, deviceName}) => {
    const data = {
      cid, 
      deviceName,
      startTime, 
      endTime
    }
    return Service.video.queryHistoryAddress(data)
  }

  /**
   * @desc 获取实时视频流
   */
  queryRealTimeAddressMulti = (deviceList) => {
    const { device } = this.props;
    const deviceInfos = deviceList.map(v => {
      let flvStream = device.streamPreference.indexOf(v.cid) !== -1;
      const data = {
        cid: v.cid || v.id,
        deviceName: v.deviceName || v.name,
        deviceType: v.deviceType,
        flvStream
      }
      // ptzTypes.push(
      //   info.extJson &&
      //     info.extJson.cameraInfo &&
      //     info.extJson.cameraInfo.type
      // );
      return data;
    })
    return Service.video.queryRealTimeAddressMulti(deviceInfos);
  }

  // 获取设备开流偏好设置
  getDevicePrefercence = () => {
    const { device, user } = this.props;
    const userId = user.userInfo.id;
    const storeKey = device.streamKVKey;
    return Service.kvStore.getKvStore({userId, storeKey}).then(storeValue => {
      const streamPreference = storeValue.data.storeValue || [];
      return device.setStreamPreference(streamPreference);
    }).catch(() => Promise.resolve())
  }

  getLinkSelectList = () => {
    const selectList = [this.hoverMarkerPoint]
    return selectList;
  }
  
  markerMouseover = (point) => {
    this.hoverMarkerPoint = point;
  }

  render() {
    const { videoModule, deviceGroup, organization, device } = this.props;
    const {
      isSlide,
      mapMode,
      showLoopSetting,
      showGroup,
      currentGroup,
      groupModalKey,
      loopModalKey,
    } = this.state;
    return (
      <Provider value={this.getModuleContext()}>
        <div className="video-surveillance" ref={this.videoLayoutDom}>
          <div
            className={`left-tree ${isSlide ? 'left-tree-slide' : ''}`}
            ref={this.slideDom}
          >
            <div className="slide-layout-left-tree">
              <ResourceTreeView
                deviceList={device.cameraArray}
                collectionList={deviceGroup.list}
                orgList={organization.orgArray}
              />
            </div>
            <span className="slider-btn" onClick={this.slideAction}>
              <IconFont
                type={
                  isSlide
                    ? 'icon-Arrow_Small_Left_Mai'
                    : 'icon-Arrow_Small_Right_Ma'
                }
                theme="outlined"
              />
            </span>
          </div>
          <div className="right-content">
            <Button
              type="primary"
              className="change-mode-btn orange-btn"
              onClick={this.changeModeBtn}
            >
              <IconFont
                type={mapMode ? 'icon-List_Map_Main' : 'icon-Map_Main'}
              />
              {mapMode ? '分屏模式' : '地图模式'}
            </Button>
            <MoveableTimeChoise 
              ref={this.timeChoiseRef}
              onOk={this.submitHistoryTime}
            />
            {mapMode ? (
              <ClusterMap
                toggleTimeChoiseContent={this.toggleTimeChoiseContent}
                closeVideo={this.clearSelectDevice}
                points={device.cameraArray}
                ref={this.mapViewRef}
                handleHistoryVideo={this.handleHistoryVideo}
                queryHistoryAddress={this.queryHistoryAddress}
                queryRealTimeAddressMulti={this.queryRealTimeAddressMulti}
                markerMouseover={this.markerMouseover}
                hoverContent={
                  <LinkTools 
                    className='map-icon-content-tools'
                    goPage={this.goPage}
                    excludeLink={['video']}
                    placement='bottom'
                    getSelectList={this.getLinkSelectList}
                  />
                }
              >
                <MapView
                  goPage={this.goPage}
                  onSelectDevice={this.onSelectDevice}
                  ProcessRef={this.videoLayoutDom}
                />
              </ClusterMap>
            ) : (
              <ListView
                closeVideo={this.clearSelectDevice}
                closeSingleVideo={this.closeSingleVideo}
                videoModule={videoModule}
                ref={this.listViewRef}
                selectSrceen={this.selectSrceen}
                currentScreen={videoModule.currentVideoScreen}
                updateTimeChoiseDeviceInfo={this.updateTimeChoiseDeviceInfo}
              />
            )}
          </div>
          <VideoLoopSetting
            playerDatas={this.playerDatas}
            startVideoLoop={this.startVideoLoop}
            closeLoopSettingLayout={this.closeLoopSettingLayout}
            showLoop={showLoopSetting}
            key={loopModalKey}
            currentScreen={videoModule.currentVideoScreen}
            loopListSize={this.loopList.length}
          />
          <GroupModal
            onOk={this.addOrEditGroup}
            visible={showGroup}
            onCancel={this.hideGroupModal}
            key={groupModalKey}
            group={currentGroup}
          />
        </div>
      </Provider>
    );
  }
}
export default VideoSurveillance;
