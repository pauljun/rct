import React from 'react';
import { Icon, Popover, message } from 'antd';
import PropTypes from 'prop-types';
import Status from '../status';
import CustomSlider from './CustomSlider';
import moment from 'moment';

import '../style/contraller-bar.scss';

const IconFont = Loader.loadBaseComponent('IconFont')
const FullScreenLayout = Loader.loadBaseComponent('FullScreenLayout')

export class TopContrallerBar extends React.Component {
  static contextTypes = {
    getPlayContainer: PropTypes.func
  };
  render() {
    const { getPlayContainer } = this.context;
    const { className, title, closeVideo, customTopBar } = this.props;
    return (
      <div
        className={`top-contraller-bar contraller-bar-layout ${
          className ? className : ''
        }`}
      >
        <div className="player-title">{title}</div>
        <div className="top-contraller">
          {customTopBar}
          <FullScreenLayout
            className="fullscreen-bar"
            getContainer={getPlayContainer}
          >
            {isFullscreen => (
              <IconFont
                title={!isFullscreen ? '全屏播放' : '窗口播放'}
                type={!isFullscreen ? 'icon-Full_Main' : 'icon-ExitFull_Main'}
                theme="outlined"
              />
            )}
          </FullScreenLayout>
          <IconFont
            className="close-video"
            type="icon-Close_Main1"
            onClick={closeVideo}
          />
        </div>
      </div>
    );
  }
}

const SpeedLibs = [0.125, 0.25, 0.5, 1, 2, 4, 8];

export class BottomContrallerBar extends React.Component {
  static contextTypes = {
    getPlayContainer: PropTypes.func,
    isLiving: PropTypes.bool,
    isNativeVideo: PropTypes.bool,
    stretching: PropTypes.string,
    setStretching: PropTypes.func,
    player: PropTypes.object,
    isLoop: PropTypes.bool,
    setPlayStatus: PropTypes.func,
    playStatus: PropTypes.string,
    fileData: PropTypes.object,
    screenToCanvas: PropTypes.func, // 框选搜图
  };
  state = {
    volume: 0, // 0~100
    speed: 1
  };
  componentDidMount() {
    // const { getPlayContainer } = this.context;
    // const video = getPlayContainer().querySelector('video');
    // this.setState({
    //   volume: video ? video.volume * 100 : 0
    // });
    const { player } = this.context;
    player.setVolume(0);
  }
  setVolume = value => {
    const { player } = this.context;
    this.setState({ volume: value });
    player.setVolume(value);
  };

  setMuted = event => {
    Utils.stopPropagation(event);
    const { player } = this.context;
    if (this.state.volume > 0) {
      player.setVolume(0);
      this.setState({ volume: 0, muted: true });
    } else {
      player.setVolume(100);
      this.setState({ volume: 100, muted: false });
    }
  };

  setSpeed = (num, event) => {
    Utils.stopPropagation(event);
    const { player } = this.context;
    player.setPlaybackRate(num);
    this.setState({ speed: num });
  };

  liveAction = event => {
    Utils.stopPropagation(event);
    const { setPlayMethods } = this.props;
    const { isLiving } = this.context;
    !isLiving && setPlayMethods({ isLiving: true });
  };
  historyAction = event => {
    Utils.stopPropagation(event);
    const { openHistoryPopup } = this.props;
    openHistoryPopup(true, 'history');
  };
  playOrPause = event => {
    Utils.stopPropagation(event);
    const { player, playStatus, setPlayStatus } = this.context;
    if (playStatus === Status.Pause) {
      player.play();
      setPlayStatus(Status.Play);
    } else {
      player.pause();
      setPlayStatus(Status.Pause);
    }
  };
  downloadAction = event => {
    const { getPlayContainer } = this.context;
    const ele = getPlayContainer().querySelector('video');
    ele.currentTime = 10;
    Utils.stopPropagation(event);
    const { openHistoryPopup } = this.props;
    openHistoryPopup(true, 'download');
  };

  // 截屏事件
  screenCapture = e => {
    const { fileData, player, isLiving, screenToCanvas } = this.context;
    const base64 = screenToCanvas();
    if(!base64) {
      return message.info('当前状态无法截屏');
    }
    const options = {
      start: { clientX: e.clientX, clientY: e.clientY },
      url: base64
    };
    Utils.animateFly(options);
    window.BaseStore.mediaLib.add({
      cameraId: fileData.cid,
      cameraName: fileData.deviceName,
      captureTime: Date.now(),
      imgUrl: base64,
      type: 'image'
    });
    let description = '';
    if (isLiving) {
      description = `保存点位【${fileData.deviceName}】 ${moment().format(Shared.format.dataTime)}的截图`;
    } else {
      let hisTime = moment(
        moment(fileData.historyList.beginDate)*1 + player.currentTime * 1000
      ).format(Shared.format.dataTime);
      description = `保存点位【${fileData.deviceName}】${hisTime}的截图`;
    }
    Service.logger.save({
      description,
      ...Service.url.request.screenShotModule
    });
  };
  
  renderLeftStatus() {
    const { isLoop, isNativeVideo, isLiving } = this.context;
    const { hasHistory, hasLiving } = this.props;
    if (isLoop) {
      return (
        <div className="video-loop">
          视频轮巡中
          <Icon type="loading" />
        </div>
      );
    } else {
      if (isNativeVideo) {
        return null;
      } else {
        return (
          <div className="play-type">
            {hasLiving && (
              <i onClick={this.liveAction} className={isLiving ? 'active' : ''}>
                实时
              </i>
            )}
            {hasHistory && (
              <i
                onClick={this.historyAction}
                className={!isLiving ? 'active' : ''}
              >
                历史
              </i>
            )}
          </div>
        );
      }
    }
  }

  renderRightStatus() {
    const { isNativeVideo, isLiving, getPlayContainer } = this.context;
    const { hasDownload, hasScreenshot=true } = this.props;
    const { speed } = this.state;
    if (isNativeVideo) {
      return null;
    }
    return (
      <React.Fragment>
        {hasDownload && (
          <IconFont
            type="icon-Download_Main"
            title="下载"
            onClick={this.downloadAction}
          />
        )}
        {hasScreenshot && <IconFont
          type="icon-Photo_Main"
          title="截屏"
          onClick={this.screenCapture}
        />}
        {!isLiving && (
          <Popover
            placement="top"
            overlayClassName={'popup-speed-volume'}
            getPopupContainer={() =>
              getPlayContainer().querySelector('.popup-set-speed-popup')
            }
            content={
              <div className="speed-popup">
                {SpeedLibs.map(v => (
                  <span key={v} onClick={event => this.setSpeed(v, event)}>
                    {v}x
                  </span>
                ))}
              </div>
            }
          >
            <span className="speed">{speed}x</span>
          </Popover>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { volume } = this.state;
    const {
      isLiving,
      stretching,
      setStretching,
      isLoop,
      isNativeVideo,
      playStatus,
      getPlayContainer
    } = this.context;
    const {
      className,
      customBottmLeftBar,
      customBottmRightBar,
      hasRectSearch,
      handleRectSearch,
      rectSearchStatus,
      changeVideoTime,
    } = this.props;
    return (
      <div
        className={`bottom-contraller-bar contraller-bar-layout ${
          className ? className : ''
        }`}
      >
        <div className="left-contraller">
          {this.renderLeftStatus()}
          <div className="play-tools">
            {!isLiving || isNativeVideo ? (
              <IconFont
                onClick={this.playOrPause}
                type={
                  playStatus !== Status.Pause
                    ? 'icon-Pause_Main'
                    : 'icon-Play_Main'
                }
              />
            ) : null}
            <Popover
              placement="top"
              trigger="hover"
              overlayClassName={'popup-set-volume'}
              getPopupContainer={() =>
                getPlayContainer().querySelector('.popup-set-volume-popup')
              }
              content={
                <CustomSlider
                  vertical
                  percent={volume / 100}
                  onChange={this.setVolume}
                />
              }
            >
              <IconFont
                onClick={this.setMuted}
                type={
                  volume === 100
                    ? 'icon-volume-max'
                    : volume === 0
                    ? 'icon-volume-close'
                    : 'icon-volume-normal-fuben'
                }
              />
            </Popover>
            {customBottmLeftBar}
          </div>
        </div>
        <div className="right-contraller">
          {customBottmRightBar}
          { hasRectSearch && (
            <IconFont
              className={`rect-search-btn ${rectSearchStatus ? 'active' : ''}`}
              title='框选搜图'
              // type='icon-SearchBox'
              type='icon-Size__Main'
              onClick={() => handleRectSearch()}
            />
          )}
          <IconFont
            title={stretching === 'uniform' ? '画面填充' : '画面自适应'}
            type={
              stretching === 'uniform' ? 'icon-Size__Main' : 'icon-Size__Main1'
            }
            onClick={() =>
              setStretching(stretching === 'uniform' ? 'exactfit' : null)
            }
          />
          {this.renderRightStatus()}
        </div>
        {!isLiving && (
          <React.Fragment>
            <IconFont 
              title='快退'
              className='change-time-btn time-slow'
              type='icon-Arrow_Small_Prev_Mai'
              onClick={() => changeVideoTime(-5)}
            />
            <IconFont 
              title='快进'
              className='change-time-btn time-fast'
              type='icon-Arrow_Small_Next_Mai'
              onClick={() => changeVideoTime(5)}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}
