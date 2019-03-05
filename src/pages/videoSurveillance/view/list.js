import React from 'react';
import PlayerContainer from '../components/PlayContainer';
import ListTools from '../components/ListTools';
import { videoContext } from '../moduleContext';
import { toJS } from 'mobx';

@videoContext
@Decorator.shouldComponentUpdate
class VideoSurveillanceListMode extends React.Component {
  constructor(props) {
    super(props);
    this.players = null;
  }
  componentWillUnmount() {
    this.players = null;
  }

  playerHistoryVideo = (options, index, deviceInfo) => {
    this.players.setPlayMethods(options, index, deviceInfo)
  }
  /**
   * 选中设备后获取播放信息，传递给播放容器组件
   * @param {object} info
   */
  selectDevice(deviceList) {
    if (this.players) {
      const { queryRealTimeAddressMulti } = this.props;
      queryRealTimeAddressMulti(deviceList).then(fileDatas => {
        fileDatas.map((v,k) => deviceList[k].file = v.file);
        this.players.selectDeviceList(toJS(deviceList));
      }).catch(() => this.players.selectDevice());
    }
  }

  /**
   * 获取轮巡设备的播放信息，提交给子Play组件处理
   * @param {Array} deviceList
   */
  playMethodForLoopDevice(deviceList) {
    if (this.players) {
      const { queryRealTimeAddressMulti } = this.props;
      queryRealTimeAddressMulti(deviceList).then(fileDatas => {
        fileDatas.map((v,k) => deviceList[k].file = v.file);
        this.players.playLoopVideo(toJS(deviceList));
      }).catch(() => this.players.playLoopVideo());
    }
  }

  /**
   * 传递给子，更新播放容器的可轮巡的状态
   * @param {Array} loopVideoBox
   */
  setLoopVideBox(loopVideoBox) {
    this.players.setLoopVideBox(loopVideoBox);
  }

  /**
   * 关闭视频，传递给子和父
   */
  closeVideo = () => {
    this.props.closeVideo();
    this.players.closeAllVideo();
  };

  initPlayer(players) {
    this.players = players;
  }

  render() {
    const {
      setDeviceListForCurrentPlayerBox,
      isLoop,
      endVideoLoop,
      currentScreen,
      selectSrceen,
      toggleTimeChoiseContent,
      handleHistoryVideo,
      getHistoryTimeRange,
      queryHistoryAddress,
      queryRealTimeAddressMulti,
      updateTimeChoiseDeviceInfo,
      closeSingleVideo,
      goPage
    } = this.props;
    return (
      <div className="list-mode-video">
        <div className="tools-top-layout">
          <ListTools
            isLoop={isLoop}
            currentScreen={currentScreen}
            selectSrceen={selectSrceen}
            closeVideo={this.closeVideo}
            stopLoop={endVideoLoop}
          />
        </div>
        <PlayerContainer
          goPage={goPage}
          queryHistoryAddress={queryHistoryAddress}
          queryRealTimeAddressMulti={queryRealTimeAddressMulti}
          getHistoryTimeRange={getHistoryTimeRange}
          updateTimeChoiseDeviceInfo={updateTimeChoiseDeviceInfo}
          toggleTimeChoiseContent={toggleTimeChoiseContent}
          handleHistoryVideo={handleHistoryVideo}
          currentScreen={currentScreen}
          changePlayer={setDeviceListForCurrentPlayerBox}
          closeSingleVideo={closeSingleVideo}
          init={this.initPlayer.bind(this)}
        />
      </div>
    );
  }
}
export default VideoSurveillanceListMode