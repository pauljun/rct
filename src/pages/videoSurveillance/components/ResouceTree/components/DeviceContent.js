import React from 'react';
import DragContent from './DragContent';
import { videoContext } from '../../../moduleContext';
import { message, Button, Select, Popover, Radio } from 'antd';
import '../style/device-content.less';

const Option = Select.Option;
const ListComponent = Loader.loadBusinessComponent('ListComponent');
const OrgTree = Loader.loadBusinessComponent('OrgTree');
const PlaceTree = Loader.loadBaseComponent('PlaceTree');
const IconFont = Loader.loadBaseComponent('IconFont');
const AuthComponent = Loader.loadBusinessComponent('AuthComponent');
const danbing = Dict.getDict('db');
const qiuji = Dict.getDict('qj');
const ModalSetPointMap = Loader.loadBusinessComponent('ModalSetPointMap')

@videoContext
class DeviceContent extends React.Component {
  constructor(props) {
    super(props);
    this.groupNames = [];
    // this.currentDevice = null;
    this.deviceExts = [];
    this.setDeviceExt(this.props.deviceList);
    this.listRef = React.createRef();
    this.state = {
      showOrgLayout: true,
      showDeviceLayout: true,
      selectOrg: null,
      point: null,
      visible: false,
      currentId: null,
      isShowPointMap: false, // 设置地图点位弹框
      setPointItem: {}, // 当前点位
      mode: 'org', // 设备展示方式 org, place
      activePlaceId: null,
    };
  }

  domPrefix = Math.random().toString().split('.')[1];

  componentWillReceiveProps(nextProps) {
    this.setDeviceExt(nextProps.deviceList);
  }
  /**
   * @desc 补充设备列表状态
   * @param {array} deviceList
   */
  setDeviceExt(deviceList) {
    let arr = [];
    for (let i = 0, l = deviceList.length; i < l; i++) {
      let item = deviceList[i];
      let ext = this.deviceExts.find(v => v.id === item.id);
      if (!ext) {
        arr.push({ id: item.id, visible: false });
      } else {
        arr.push(ext);
      }
    }
    this.deviceExts = arr;
  }

  /**
   * @desc 显示和隐藏组织和设备部分布局
   */
  changeLayoutStatus = (isDevice, flag) => {
    if (isDevice) {
      this.setState({ showDeviceLayout: flag });
    } else {
      this.setState({ showOrgLayout: flag });
    }
  };

  /**
   * @desc 选中组织机构
   */
  onSelectOrg = item => {
    const { selectOrg } = this.state;
    let id = null;
    if (selectOrg !== item[0]) {
      id = item[0];
    }
    this.setState({ selectOrg: id });
    this.props.changeOrg && this.props.changeOrg(id);
  };

  /**
   * @desc 显示设备收藏信息
   */
  showDeviceGroup = (item, index, event) => {
    Utils.stopPropagation(event);
    this.layoutGroupUp = document.body.clientHeight - event.pageY < 110;
    const { collectionList } = this.props;
    this.groupNames = collectionList.filter(
        v => v.deviceList.find(v2 => v2.id === item.id)
      ).map(v => v.groupName);
    // this.currentDevice = null;
    this.deviceExts.forEach(v => (v.visible = false));
    this.deviceExts[index].visible = true;
    this.listRef.current.forceUpdateGrid();
  };

  /**
   * @desc 缓存选中的分组
   */
  changeGroup = (selectGroup, item) => {
    this.groupNames = selectGroup;
    // this.currentDevice = item;
    this.listRef.current.forceUpdateGrid();
  };

  /**
   * @desc 取消分组
   */
  cancelGroup = index => {
    this.groupNames = [];
    // this.currentDevice = null;
    this.deviceExts[index].visible = false;
    this.listRef.current.forceUpdateGrid();
  };

  /**
   * @desc 提交设备分组信息
   */
  subGroup = (item, index) => {
    const { editGroupDevice } = this.props;
    let isEmpty, arr;
    if (this.groupNames.length === 0) {
      isEmpty = true;
      arr = [{
        deviceKey: `${item.cid}/${item.deviceName}`
      }]
    } else {
      arr = this.groupNames.map(name => ({
        groupName: name,
        deviceKey: `${item.cid}/${item.deviceName}`
      }));
    }
    editGroupDevice(arr, isEmpty)
      .then(() => {
        message.success('操作成功！');
      })
      .then(() => this.cancelGroup(index));
  };

  /**
   * @desc 计算当前render 设备列表中 各个设备状态的统计
   * @param {Array} deviceList
   */
  computedListStatus(deviceList) {
    let onlineList = [],
      offlineList = [];
    for (let i = 0, l = deviceList.length; i < l; i++) {
      let item = deviceList[i];
      if (item.deviceStatus * 1 === 0) {
        offlineList.push(item);
      } else {
        onlineList.push(item);
      }
    }
    return {
      list: onlineList.concat(offlineList),
      onlineCount: onlineList.length,
      offlineCount: offlineList.length
    };
  }

  /**
   * @desc 跳转设备编辑
   */
  jumpDeviceEdit = (event, item) => {
    Utils.stopPropagation(event);
    const { goPage } = this.props;
    goPage({
      moduleName: 'deviceManagement',
      data: { id: item.id }
    });
  };

  // 同步远程开流偏好数据
  getDevicePrefercence = () => {
    const { device, user } = BaseStore;
    const userId = user.userInfo.id;
    const storeKey = device.streamKVKey;
    return Service.kvStore.getKvStore({userId, storeKey}).then(storeValue => {
      const streamPreference = JSON.parse(storeValue.data.storeValue) || [];
      return device.setStreamPreference(streamPreference);
    }).catch(() => false);
  }

  /**
   * @desc 处理新的开流偏好数据  
   */
  handleStreamPreference = async (deviceId, shouldFlv) => {
    let streamPreference = await this.getDevicePrefercence();
    if(!streamPreference){
      message.error('设置失败，请重试');
      return false 
    }
    const index = streamPreference.indexOf(deviceId);
    if(shouldFlv && index === -1) {
      streamPreference.push(deviceId);
    } 
    if(!shouldFlv && index !== -1){
      streamPreference.splice(index, 1);
    }
    return streamPreference;
  }
  /**
   * @desc 设置开流偏好
   */
  setStreamPreference = async (deviceItem, shouldFlv) => {
    const { device, user } = BaseStore;
    const userId = user.userInfo.id;
    const storeKey = device.streamKVKey;
    const storeValue = await this.handleStreamPreference(deviceItem.cid, shouldFlv);
    if(storeValue) {
      Service.kvStore.setUserKvStore({
        userId, 
        storeKey, 
        storeValue
      }).then(result => {
        message.success('设置成功');
        device.setStreamPreference(storeValue);
        this.listRef.current.forceUpdateGrid();
      }).catch(() => {
        message.success('设置失败，请重试');
      })
    }
  }

  // 
  handleHistoryVideo = (event, item) => {
    Utils.stopPropagation(event);
    this.props.handleHistoryVideo(item);
  }
  /**
   * @desc 设置地图点位
   */
  setMapPoint = (e, item) => {
    Utils.stopPropagation(e);
    this.setState({
      isShowPointMap: true,
      setPointItem: item,
    })
  }

  /**
   * @desc 关闭设置点位弹框
   */
  cancelPointMap = () => {
    this.setState({
      isShowPointMap: false,
    })
  }

  /**
   * @desc 更新点位回调
   */
  setPoint = () => {
    this.cancelPointMap()
  }

  // 资源展示方式
  setResourceMode = (mode) => {
    this.setState({ mode })
    this.props.setResourceMode(mode);
  }

  /**
   * @desc 选中行政区划
   */
  onSelectPlace = (ids) => {
    let { activePlaceId } = this.state;
    activePlaceId = activePlaceId === ids[0] ? null : ids[0];
    this.setState({ activePlaceId });
    this.props.changePlace && this.props.changePlace(activePlaceId);
  };

  renderAction = item => {
    const showGroupInfo = this.deviceExts.find(v => v.id === item.id);
    const index = this.deviceExts.findIndex(v => v.id === item.id);
    const streamPreference = BaseStore.device.streamPreference;
    const isFlv = streamPreference.indexOf(item.cid) !== -1;
    return (
      <>
        <span className="device-item-tools">
          <AuthComponent actionName="historyVideo">
            <IconFont
              type="icon-Video"
              title="历史视频"
              onClick={e => this.handleHistoryVideo(e, item)}
            />
          </AuthComponent>
          <IconFont
            type="icon-Keep_Main"
            title="添加到分组"
            onClick={event => this.showDeviceGroup(item, index, event)}
          />
          {item.deviceType != danbing.value && (
            <React.Fragment>
              <AuthComponent actionName="deviceLocation">
                <IconFont
                  type="icon-SetCamera_Main2"
                  title="点位设置"
                  onClick={e => this.setMapPoint(e, item)}
                />
              </AuthComponent>
              <AuthComponent actionName="deviceModify">
                <IconFont
                  type="icon-Edit_Main"
                  onClick={e => this.jumpDeviceEdit(e, item)}
                  title="设备编辑"
                />
              </AuthComponent>
            </React.Fragment>
          )}
          {item.deviceType != danbing.value &&
           item.deviceType != qiuji.value && (
            <Popover
              content={
                <div>
                  <Radio 
                    checked={isFlv} 
                    onChange={() => this.setStreamPreference(item, true)}
                  >实时优先</Radio>
                  <Radio 
                    checked={!isFlv} 
                    onChange={() => this.setStreamPreference(item, false)}
                  >流畅优先</Radio>
                </div>
              }
              trigger="click"
              placement="topRight"
              getPopupContainer={() => document.querySelector(`.device-stream-tools-${index}-${this.domPrefix}`)}
            >
              <IconFont
                className={`device-stream-tools device-stream-tools-${index}-${this.domPrefix}`}
                type="icon-Set_Main2"
                title="播放设置"
              />
            </Popover>
          )}
        </span>
        {showGroupInfo.visible && this.renderGroup(item, index)}
      </>
    );
  };
  renderGroup = (item, index) => {
    const { collectionList } = this.props;
    return (
      <div
        className={`device-to-group ${
          this.layoutGroupUp ? 'device-to-group-up' : ''
        }`}
        onClick={e => Utils.stopPropagation(e)}
      >
        <div className="group-select-title">{item.deviceName}</div>
        <div className={`group-select-${item.id} group-select-${item.id}-${this.domPrefix}`} />
        <Select
          placeholder="请选择分组"
          mode="multiple"
          onChange={v => this.changeGroup(v, item)}
          className="group-select-com"
          value={this.groupNames}
          getPopupContainer={() =>
            document.querySelector(`.group-select-${item.id}-${this.domPrefix}`)
          }
        >
          {collectionList.map(v => (
            <Option key={v.groupName} value={v.groupName}>
              {v.groupName}
            </Option>
          ))}
        </Select>
        <div className="group-btn">
          <Button size="small" onClick={() => this.cancelGroup(index)}>
            取消
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => this.subGroup(item, index)}
          >
            确定
          </Button>
        </div>
      </div>
    );
  };
  render() {
    const { 
      showOrgLayout, showDeviceLayout, selectOrg, 
      isShowPointMap, setPointItem, mode, activePlaceId
    } = this.state;
    const {
      deviceList,
      orgList,
      selectDevice,
      onSelectDevice,
      isMapMode,
      showLoopSettingLayout,
      loopOrgInfo,
      collectionList,
      keyword
    } = this.props;
    const result = this.computedListStatus(deviceList);
    return (
      <div className="org-tree-with-device-layer">
        <div className="org-tree-part">
          <div className="title-part">
            <div
              className="title-part-left fl"
              onClick={() => this.changeLayoutStatus(false, !showOrgLayout)}
            >
              <IconFont
                type={
                  showOrgLayout
                    ? 'icon-Arrow_Small_Up_Main'
                    : 'icon-Arrow_Small_Down_Mai'
                }
              />
              { mode==='org' ? '组织机构' : '行政区划'}
            </div>
            <div className='title-part-right fr'>
              <Select 
                value={mode}
                onChange={this.setResourceMode}
                onClick={this.test}
              >
                <Option value='org'>按组织结构展示</Option>
                <Option value='place'>按行政区划展示</Option>
              </Select>
            </div>
          </div>
          { mode==='org' 
            ? <OrgTree
                showCount={true}
                className={!showOrgLayout ? 'hide-tree' : ''}
                activeKey={[selectOrg]}
                defaultExpandedKeys={[orgList[0] ? orgList[0].id : '']}
                onSelect={this.onSelectOrg}
                renderSuffix={node =>
                  !isMapMode ? (
                    <span
                      className="video-lx"
                      title="视频轮巡"
                      onClick={e => {
                        Utils.stopPropagation(e);
                        showLoopSettingLayout(node);
                      }}
                    >
                      <IconFont type="icon-RoundPlay_Main" />
                    </span>
                  ) : null
                }
                treeNodeClass={node =>
                  node.id === loopOrgInfo.id ? 'loop-org' : ''
                }
              />
            : <PlaceTree
                showCount={true}
                className={!showOrgLayout ? 'hide-tree' : ''}
                activeKey={[activePlaceId]}
                onSelect={this.onSelectPlace}
                renderSuffix={node =>
                  !isMapMode ? (
                    <span
                      className="video-lx"
                      title="视频轮巡"
                      onClick={e => {
                        Utils.stopPropagation(e);
                        showLoopSettingLayout(node);
                      }}
                    >
                      <IconFont type="icon-RoundPlay_Main" />
                    </span>
                  ) : null
                }
                treeNodeClass={node =>
                  node.id === loopOrgInfo.id ? 'loop-org' : ''
                }
              />
          }
        </div>
        <DragContent
          className={`${!showOrgLayout ? 'no-darg-height' : ''} ${
            !showDeviceLayout ? 'hide-darg-height' : ''
          }`}
          disabled={!showOrgLayout || !showDeviceLayout}
        >
          <div className="device-list-part" ref={this.deviceListRef}>
            <div
              className="title-part"
              onClick={() => this.changeLayoutStatus(true, !showDeviceLayout)}
            >
              <IconFont
                type={
                  showDeviceLayout
                    ? 'icon-Arrow_Small_Up_Main'
                    : 'icon-Arrow_Small_Down_Mai'
                }
              />
              摄像机列表
              <span className="count-part">
                <span className="count-part-on">{result.onlineCount}</span>
                <span className="count-part-off">{result.offlineCount}</span>
              </span>
            </div>
            <div
              className={`device-list-content ${
                !showDeviceLayout ? 'hide' : ''
              }`}
            >
              <ListComponent
                ref={this.listRef}
                listData={result.list}
                keyword={keyword}
                renderSuffix={this.renderAction}
                selectItemClass="active"
                onClick={onSelectDevice}
                selectList={selectDevice}
              />
            </div>
          </div>
        </DragContent>
        {/* 设置点位model */}
        <ModalSetPointMap
          className='set-point-modal'
          title='点位设置' 
          visible={isShowPointMap} 
          showSearch={true}
          onCancel={this.cancelPointMap}
          onOk={this.setPoint}
          width='50%'
          height='70%'
          point={setPointItem}
          showPlaceModal={true}
        />
      </div>
    );
  }
}
export default DeviceContent;
