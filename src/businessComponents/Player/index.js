import React from 'react';
import LivePlayer from 'html5-player';
import HistoryPlayer from 'html5-player/libs/history';
import moment from 'moment';
import VideoEvent from './component/VideoEvent';
import PropTypes from 'prop-types';
import NoPlayerData from './component/NoPlayerData';
import {
  TopContrallerBar,
  BottomContrallerBar
} from './component/ContrallerBar';

import HistoryTimeChoise from './component/HistoryTimeChoise';
import CameraControl from './component/CameraControl';
import RectSearch from './component/RectSearch';
import { Modal, message } from 'antd';
import { cloneDeep } from 'lodash';

import 'html5-player/libs/assets/css/style.css';
import './style/index.scss';

const DomMarkRepeat = Loader.loadBusinessComponent('WaterMakeDom')

const MAX_ERROR_NUM = 5;
const RE_CONNECT_TIME = 2 * 1000;


/**
 * 关闭部分默认配置，自定义实现
 */
const defaultControls = {
  playPause: false,
  volume: false,
  speed: false
};

const LoadingMessageComponent = props => {
  return <span>加载超时，第{props.count}次重连中...</span>;
};

@Decorator.shouldComponentUpdate
class VideoPlayer extends React.Component {
  static childContextTypes = {
    getPlayContainer: PropTypes.func,
    videoDom: PropTypes.object,
    player: PropTypes.object,
    fileData: PropTypes.object,
    playStatus: PropTypes.string,
    setPlayStatus: PropTypes.func,
    isNativeVideo:PropTypes.bool,
    isLiving: PropTypes.bool,
    stretching: PropTypes.string,
    setStretching: PropTypes.func,
    screenToCanvas: PropTypes.func, // 播放器截图
    isLoop: PropTypes.bool
  };
  getChildContext() {
    return {
      getPlayContainer: () => this.playerContainerRef.current,
      videoDom: this.playerContainerRef.current,
      player: this.player,
      fileData: this.props.fileData,
      playStatus: this.state.playStatus,
      setPlayStatus: this.setPlayStatus,
      isLiving: this.props.isLiving !== false,
      isNativeVideo:this.props.isNativeVideo,
      stretching: this.state.stretching,
      setStretching: this.setStretching,
      screenToCanvas: this.screenToCanvas,
      isLoop: this.props.isLoop
    };
  }
  constructor(props) {
    super(props);
    this.playId = `lm-player-${Math.random()}`;
    this.player = null;
    this.playerContainerRef = React.createRef();
    this.rectRef = React.createRef();
    this.fileData = cloneDeep(props.fileData);
    this.timer = null;
    this.errorNum = 0;
    this.errorTimer = 0;
    this.rectSearchOptions = {}; // 框选搜图参数
    this.state = {
      playStatus: null,
      stretching: 'uniform',
      showHistoryTimeChoise: false,
      key: Math.random(),
      timeRange: null, // 时间控件默认时间段
      autoHideBar: false,
    };
  }
  componentWillUnmount() {
    this.fileData = null;
    clearTimeout(this.timer);
    this.timer = null;
  }
  componentWillReceiveProps(nextProps) {
    if (!Utils.isEqual(this.fileData, nextProps.fileData)) {
      const { isLiving = true } = nextProps;
      const newFileData = nextProps.fileData || {};
      const oldFileData = this.fileData || {};
      if (isLiving) {
        if (oldFileData.file !== newFileData.file) {
          this.setState({ key: Math.random(), playStatus: null });
        } else {
          this.setState({ playStatus: null });
        }
      } else {
        if (oldFileData.historyList !== newFileData.historyList) {
          this.setState({ key: Math.random(), playStatus: null });
        } else {
          this.setState({ playStatus: null });
        }
      }
      this.fileData = cloneDeep(newFileData);
      console.warn('当前视频播对象：', this.fileData);
    }
  }
  setStretching = type => {
    this.setState({ stretching: type ? type : 'uniform' });
  };
  setPlayStatus = status => {
    const { fileData } = this.props;
    this.setState({ playStatus: status });
    /**如果视频处于播放状态, 而且视频能够获取流, 通知后台修改设备状态 */
    if(status === 'play' && fileData.deviceStatus === '0'){
      const deviceInfo = BaseStore.device.queryCameraById(fileData.cid);
      Service.device.updateDeviceStatus(deviceInfo.id, true)
      let deviceList = []
      BaseStore.device.deviceList.map(v => {
        let item = Object.assign({}, v)
        if(v.id === deviceInfo.id){
          item.deviceStatus = true
        }
        deviceList.push(item)
        return v
      })
      BaseStore.device.setDeviceList(deviceList)
    }
  };
  videoCallback = player => {
    this.player = player;
    this.forceUpdate();
  };

  // 播放器截屏
  screenToCanvas = () => {
    const player = this.player
    // if (player.isError || player.loading || player.ended){
    //   return false
    // }
    const video = this.playerContainerRef.current.querySelector('video');
    let canvas = document.createElement('canvas');
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL();
    setTimeout(() => {
      ctx = null;
      canvas.remove();
      canvas = null;
    }, 10);
    return base64;
  }

  // 处理框选搜图
  handleRectSearch = () => {
    const { rectSearchStatus } = this.props.fileData;
    const { method } = this.props;
    if(rectSearchStatus) {
      this.clearRectSearch();
      method.handleRectSearch(false);
    } else {
      let base64 = this.screenToCanvas();
      if(!base64) {
        method.handleRectSearch(false);
        return message.info('当前状态无法框选');
      }
      this.startRectSearch(base64);
      method.handleRectSearch(true);
    }
  }
  // 开启框选搜图
  startRectSearch = (base64) => {
    const isLiving = this.props.isLiving !== false;
    const player = this.player;
    if(!isLiving && player.playing) {
      player.pause();
      this.setPlayStatus('pause');
    }
    const width = this.playerContainerRef.current.querySelector('video').clientWidth;
    const rectSearchOptions = {
      width,
      imagePath: base64,
    }
    this.rectSearchOptions = rectSearchOptions;
  }
  // 关闭框选搜图
  clearRectSearch = () => {
    this.rectSearchOptions = {};
  }
  
  openOrHideHistoryPopup = (flag, eventType) => {
    Utils.exitFullscreen();
    if (eventType === 'download') {
      const { isLiving, historyList } = this.props.fileData;
      if(!isLiving && historyList) {
        const { beginDate, duration } = historyList;
        const timeRange = {
          startTime: moment(beginDate)*1,
          endTime: duration*1000 + moment(beginDate)*1
        }
        this.setState({ timeRange });
      }
      this.setState({ showHistoryTimeChoise: !!flag, eventType });
    } else {
      const { method, fileData } = this.props;
      const isHistory = true;
      method.setPlayMethods(fileData, isHistory);
    }
  };
  handleSelectTime = options => {
    const { eventType } = this.state;
    const { method } = this.props;
    if (eventType === 'history') {
      method.setPlayMethods(options);
    } else if (eventType === 'download') {
      method.downloadVideo(options);
    }
  };
  mouseoverAction = e => {
    clearTimeout(this.timer);
    this.setState({ autoHideBar: false });
    this.timer = setTimeout(() => {
      this.setState({ autoHideBar: true });
    }, 5000);
  };
  mouseooutAction = () => {
    clearTimeout(this.timer);
    this.setState({ autoHideBar: true });
  };

  /**
   * @desc 前进后退
   * @param {number} 时间间隔
   */
  changeVideoTime = time => {
    let duration = this.player.duration;
    let currentTime = this.player.currentTime;
    let percent = (currentTime + time) / duration;
    this.player.setSeeking(percent);
  }

  render() {
    const {
      stretching,
      showHistoryTimeChoise,
      key,
      timeRange,
      eventType,
      autoHideBar,
    } = this.state;

    const {
      fileData = {},
      method = {},
      event = {},
      options = {},
      isLiving = true,
      hasLiving = true,
      hasHistory = true,
      hasDownload = true,
      hasScreenshot=true,
      hideBar = false,
      isNativeVideo = false,
      customTopBar,
      customBottmLeftBar,
      customBottmRightBar,
      ...props
    } = this.props;
    // console.log(fileData, 203);
    let { file, historyList, rectSearchStatus } = fileData;

    const retryTimes = 5;
    const isEmpty = !file && !historyList;
    const Player = isLiving ? LivePlayer : HistoryPlayer;
    let playUrlOptions = { file, historyList };
    isLiving ? delete playUrlOptions.historyList : delete playUrlOptions.file;
    return (
      <div
        id={this.playId}
        className={`lm-player ${autoHideBar ? 'lm-player-hide-bar' : ''} ${
          props.className ? props.className : ''
        }`}
        draggable={false}
        ref={this.playerContainerRef}
        onMouseOver={this.mouseoverAction}
        onMouseMove={this.mouseoverAction}
        onMouseOut={this.mouseooutAction}
      >
        {isEmpty ? (
          <React.Fragment>
            {this.props.children &&
              React.cloneElement(this.props.children, { playInstance: this })}
            <NoPlayerData />
          </React.Fragment>
        ) : (
          <Player
            {...playUrlOptions}
            autoplay={props.autoplay !== false}
            isLiving={isNativeVideo ? false : isLiving}
            videoCallback={this.videoCallback}
            controls={defaultControls}
            contextMenu={[]}
            loop={false}
            stretching={stretching}
            livingMaxBuffer={3} // 直播缓存时间
            timeout={1000 * 15} // 超时重载
            retryTimes={retryTimes} // 重载次数
            LoadingMessageComponent={<LoadingMessageComponent />}
            key={key}
          >
            <div className="popup-set-volume-popup" />
            <div className="popup-set-speed-popup" />

            <DomMarkRepeat className="player-marke" />

            {rectSearchStatus && ( 
              <RectSearch 
                className='rect-search-wrapper' 
                rectSearchOptions={this.rectSearchOptions}
              />
            )}
            {!hideBar && (
              <React.Fragment>
                <TopContrallerBar
                  customTopBar={customTopBar}
                  title={fileData.deviceName}
                  closeVideo={method.closeVideo}
                />
                <BottomContrallerBar
                  hasHistory={hasHistory}
                  hasLiving={hasLiving}
                  hasDownload={hasDownload}
                  hasScreenshot={hasScreenshot}
                  hasRectSearch={!!method.handleRectSearch}
                  customBottmLeftBar={customBottmLeftBar}
                  customBottmRightBar={customBottmRightBar}
                  setPlayMethods={method.setPlayMethods}
                  openHistoryPopup={this.openOrHideHistoryPopup}
                  handleRectSearch={this.handleRectSearch}
                  rectSearchStatus={rectSearchStatus}
                  changeVideoTime={this.changeVideoTime}
                />
              </React.Fragment>
            )}
            {showHistoryTimeChoise && (
               <Modal visible={true} footer={false} width={320} title={false} closable={false} className="play-choise-time">
                <HistoryTimeChoise
                  timeRange={timeRange}
                  eventType={eventType}
                  close={() => this.openOrHideHistoryPopup(false, eventType)}
                  onSelectTime={this.handleSelectTime}
                />
              </Modal>
            )}
            {props.ptzControl && isLiving === true && (
              <CameraControl />
            )}
            <VideoEvent {...event} isEmpty={isEmpty} />
            {this.props.children &&
              React.cloneElement(this.props.children, { playInstance: this })}
          </Player>
        )}
      </div>
    );
  }
}
export default VideoPlayer