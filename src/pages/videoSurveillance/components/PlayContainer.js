import React from 'react';
import moment from "moment";
import { message } from 'antd';
import MoveableTimeChoise from './MoveableTimeChoise';

import '../style/PlayContainer.less';
const PlayComponent = Loader.loadBusinessComponent('Player');

export default class PlayContainer extends React.Component {
  constructor(props) {
    super(props);
    const { currentScreen } = props;
    this.state = {
      current: null, // 选中的播放窗口
      playerIndex: 0,
    };
    this.fileDatas = Utils.arrayFill(currentScreen.value, { isLoop: false });
  }
  dragModalOption = {
    draggable: false,
  }
  componentDidMount() {
    const { init } = this.props;
    init && init(this);
  }

  /**
   * 设置播放的窗口
   * @param {number} index 窗口索引
   */
  selectCurrentPlayer(index) {
    const { current, playerIndex } = this.state;
    const fileData = this.fileDatas[index];
    if(fileData.cid && !fileData.isLiving) {
      this.props.updateTimeChoiseDeviceInfo(fileData);
    }
    this.setState({
      current: current !== index ? index : null,
      playerIndex: current !== index ? index : playerIndex
    });
  }

  /**
   * 设置新的播放器索引
   * @param {number} index 窗口索引
   */
  setNewIndex = () => {
    const { playerIndex } = this.state;
    const newIndex = this.getFreeIndex();
    if (playerIndex === newIndex) {
      this.setState({ current: null });
    } else {
      this.setState({ playerIndex: newIndex, current: null });
    }
  }

  /**
   * 更新窗口的播放信息，后回传给父组件所有窗口信息
   * @param {Object} fileData 播放信息
   */
  selectDevice(fileData, cancelNotify) {
    const { playerIndex } = this.state;
    if(playerIndex === -1 || !fileData) {
      return message.warn('没有空闲的窗口！');
    }
    this.fileDatas[playerIndex] = Object.assign(
      this.fileDatas[playerIndex],
      fileData
    );
    this.fileDatas[playerIndex].isLiving = true;
    this.fileDatas[playerIndex].isLoop = false;
    this.setNewIndex();
    if (!cancelNotify) {
      this.props.changePlayer && this.props.changePlayer(this.fileDatas);
    }
  }

  /**
   * 批量更新播放器
   * @param {Object} fileDatas
   */
  selectDeviceList(fileDatas) {
    fileDatas.map(item => {
      this.selectDevice(item, true);
    });
    this.props.changePlayer && this.props.changePlayer(this.fileDatas);
  }

  /**
   * 更新可轮巡容器的视频
   * @param {object} loopFileDatas
   */
  playLoopVideo(loopFileDatas) {
    let index = 0;
    this.fileDatas.forEach(item => {
      if (item.isLoop) {
        loopFileDatas[index] &&
          (item = Object.assign(item, loopFileDatas[index]));
        index++;
      }
    });
    this.forceUpdate();
    this.props.changePlayer && this.props.changePlayer(this.fileDatas);
  }

  /**
   * 更新播放容器的可轮巡的状态
   * @param {Array} loopVideoBox
   */
  setLoopVideBox(loopVideoBox) {
    loopVideoBox.map((item, index) => {
      if (this.fileDatas[index]) {
        this.fileDatas[index].isLoop = item.isLoop;
      } else {
        this.fileDatas[index] = { isLoop: item.isLoop };
      }
    });
    this.setState({ playerIndex: this.getFreeIndex() });
  }
  /**
   * 获取空闲的窗口
   */
  getFreeIndex() {
    const { currentScreen } = this.props;
    let { playerIndex } = this.state;
    let arr = Array.from({ length: currentScreen.value });
    let index = null;
    for (let i = 0; i < arr.length; i++) {
      if (!this.fileDatas[i].cid && !this.fileDatas[i].isLoop) {
        index = i;
        break;
      }
    }
    if (index !== null) {
      return index;
    } 
    if (this.fileDatas.filter(v => !v.isLoop).length === 0) {
      return -1;
    } 
    return this.getNoLoopIndex(playerIndex, currentScreen.value);
  }

  /**
   * 获取没有轮巡的窗口索引
   * @param {number} playerIndex
   * @param {number} max
   */
  getNoLoopIndex(playerIndex, max) {
    playerIndex++;
    if (playerIndex >= max) {
      playerIndex = 0;
    }
    if (this.fileDatas[playerIndex].isLoop) {
      return this.getNoLoopIndex(playerIndex, max);
    } else {
      return playerIndex;
    }
  }

  /**
   * 关闭所有播放器
   */
  closeAllVideo() {
    const { currentScreen } = this.props;
    this.fileDatas = Utils.arrayFill(currentScreen.value, { isLoop: false });
    this.setState({
      current: null,
      playerIndex: 0
    });
  }

  /**
   * 关闭当前播放器
   * @param {Number} index 播放器索引
   */
  closeSingleVideo(index) {
    const fileData = this.fileDatas[index];
    const { isLoop } = this.fileDatas[index];
    this.fileDatas[index] = { isLoop };
    const { changePlayer, closeSingleVideo } = this.props;
    changePlayer && changePlayer(this.fileDatas);
    closeSingleVideo(fileData);
    this.forceUpdate();
  }

  // 选时控件改变事件
  handleHistoryVideo = (options, index, isHistory) => {
    if(!isHistory) {
      this.setPlayMethods(options, index);
    } else {
      this.props.handleHistoryVideo(options, index);
    }
  }

  /**
   * @desc 点击历史视频播放 和 切换实时视频
   * @param {object} options 历史视频传出来的时间参数
   * @param {Number} index 播放器索引
   */
  setPlayMethods = async (options, index, deviceInfo) => {
    const { playerIndex } = this.state;
    if(playerIndex === -1) {
      return message.warn('没有空闲的窗口！');
    }
    let cid, deviceName;
    if(index === -1) {
      index = this.getFreeIndex();
      cid = deviceInfo.cid;
      deviceName = deviceInfo.deviceName;
    } else {
      cid = this.fileDatas[index].cid;
      deviceName = this.fileDatas[index].deviceName;
    }
    const oldFile = {...this.fileDatas[index]};
    const { isLiving, startTime, endTime } = options;
    let hasLivePlaying;
    if (!isLiving) {
      const { queryHistoryAddress } = this.props;
      const res = await queryHistoryAddress({cid, deviceName, startTime, endTime});
      this.fileDatas[index] = Object.assign({ isLoop: false }, deviceInfo);
      this.fileDatas[index].isLiving = false;
      this.fileDatas[index].historyList = res;
    } else {
      hasLivePlaying = this.fileDatas.find(v => v.cid === oldFile.cid && v.isLiving === true);
      if(hasLivePlaying) {
        return message.info('当前设备实时视频已打开');
      }
      index = this.getFreeIndex();
      this.fileDatas[index] = { ...oldFile };
      this.fileDatas[index].isLiving = true;
      this.fileDatas[index].historyList = undefined;
      if(!this.fileDatas[index].file) {
        const file = await this.getLiveFileData(this.fileDatas[index]);
        this.fileDatas[index].file = file;
      }
    }
    this.setNewIndex();
    const { closeSingleVideo, changePlayer } = this.props;
    changePlayer && changePlayer(this.fileDatas);
    if(isLiving && !hasLivePlaying) {
      closeSingleVideo && closeSingleVideo(oldFile);
    }
  }

  /**
   * 获取实时视频流
   * @param {*} info 
   */
  getLiveFileData = (info) => {
    return this.props.queryRealTimeAddressMulti([info]).then(fileData => fileData[0].file);
  }

  /**
   * 下载视频
   * @param {Number} startTime 秒级时间戳
   */
  downloadVideo({ startTime, endTime }, index) {
    const fileData = this.fileDatas[index];
    Shared.downloadVideo({ startTime, endTime, fileData });
  }

  /**
   * 拖拽改变播放器位置
   */
  onDrop = (endIndex, event) => {
    const startIndex = +event.dataTransfer.getData('playIndex');
    const startItem = this.fileDatas[startIndex];
    const endItem = this.fileDatas[endIndex];
    const rectSearchStatus = endItem.rectSearchStatus;
    if(rectSearchStatus) {
      endItem.rectSearchStatus = false;
      // startItem.rectSearchStatus = true;
    }
    this.fileDatas[startIndex] = endItem;
    this.fileDatas[endIndex] = startItem;
    this.forceUpdate();
  };
  /**
   * 开始拖拽，保存开始的索引
   */
  onDragStart = (startIndex, event) => {
    event.dataTransfer.setData('playIndex', startIndex);
  };

  handleRectSearch = (status, index) => {
    this.fileDatas[index].rectSearchStatus = status;
    this.forceUpdate();
  }

  render() {
    const { currentScreen, getHistoryTimeRange } = this.props;
    const { current } = this.state;
    const { fileDatas } = this;
    const boxLength = Array.from({ length: currentScreen.value });
    // console.log('======= fileDatas ========', fileDatas);
    return (
      <div className="player-mutipart-layout">
        <MoveableTimeChoise 
          visible={true}
          startTime={moment().subtract(1,'h').format(Shared.format.dateTime)}
          endTime={moment().format(Shared.format.dateTime)}
          maxDate={true}
          minDate={false}
        />
        {boxLength.map((item, index) => {
          if (!fileDatas[index]) {
            fileDatas[index] = { isLoop: false };
          }
          let draggable = !fileDatas[index].rectSearchStatus;
          return (
            <div
              key={index}
              className={`player-item-layer ${
                current === index ? 'player-item-layer-active' : ''
              }`}
              data-index={index}
              draggable={draggable}
              style={{ width: currentScreen.size, height: currentScreen.size }}
              onDragStart={event => this.onDragStart(index, event)}
              onDrop={event => this.onDrop(index, event)}
              onDragOver={event => event.preventDefault()}
              onClick={event => this.selectCurrentPlayer(index, event)}
            >
              <PlayComponent
                className="player-item"
                method={{
                  closeVideo: () => this.closeSingleVideo(index),
                  setPlayMethods: (options, isHistory) => this.handleHistoryVideo(options, index, isHistory),
                  downloadVideo: options => this.downloadVideo(options, index),
                  getHistoryTimeRange,
                  handleRectSearch: (status) => this.handleRectSearch(status, index),
                }}
                event={{
                  onClick: event => this.selectCurrentPlayer(index, event)
                }}
                ptzControl={
                  fileDatas[index]
                    ? fileDatas[index].deviceType * 1 === 100602
                    : false
                }
                fileData={fileDatas[index] ? fileDatas[index] : {}}
                isLiving={fileDatas[index] ? fileDatas[index].isLiving : true}
                isLoop={fileDatas[index] ? fileDatas[index].isLoop : false}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
