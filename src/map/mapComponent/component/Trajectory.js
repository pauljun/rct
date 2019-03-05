import React from 'react';
import MakerPoints from './MakerPoints';
import InfoWindow from './InfoWindow';
import { map } from '../mapContext';
import { Switch } from 'antd';
import { cloneDeep, orderBy } from 'lodash';
import '../style/map-trajectory-tools.scss';

const IconFont = Loader.loadBaseComponent('IconFont');

@map
class Trajectory extends React.Component {
  constructor(props) {
    super(props);
    this.pathSimplifier = null;
    this.pathNavigator = null;
    this.data = [];
    this.dataExt = {};
    this.markerIndex = Utils.getMakerIndex();
    this.currentMakerIndex = -1;
    this.pointIndex = -1;
    this.MakerPoints = null;
    this.infoWindow = null;
    this.state = {
      center: null,
      visible: false,
      status: 'resume', //'resume' : 'pause'
      isClear: true,
      current: null
    };
  }
  initWinInfoAction = infoWindow => {
    this.infoWindow = infoWindow;
    this.initPathSimplifier(() => {
      this.props.init && this.props.init(this);
    });
  };
  componentWillUnmount() {
    this.clearPathNavigators();
    this.pathSimplifier = null;
    this.pathNavigator = null;
    this.data = null;
    this.pointIndex = null;
    this.MakerPoints = null;
    this.infoWindow = null;
  }

  createMarkers() {
    let data = [];
    Object.keys(this.dataExt).map(key => {
      data.push({
        index: key,
        position: this.dataExt[key][0].position
      });
    });
    if (this.MakerPoints) {
      this.MakerPoints.createIndexMarkers({
        points: data,
        options: {},
        color: '#17bc84'
      });
    }
  }
  initPathSimplifier(callback) {
    const { map } = this.props;
    AMapUI.loadUI(['misc/PathSimplifier'], PathSimplifier => {
      this.pathSimplifier = new PathSimplifier(this.createOptions(map));
      callback && callback();
    });
  }
  createOptions = map => {
    return {
      map,
      zIndex: 101,
      clickToSelectPath: false,
      renderOptions: {
        eventSupport: false,
        eventSupportInvisible: false,
        pathTolerance: 0,
        //轨迹线的样式
        pathLineStyle: {
          strokeStyle: '#f7a319',
          lineWidth: 6,
          dirArrowStyle: true,
          eventSupportInvisible: false
        },
        pathLineHoverStyle: {
          strokeStyle: 'orange',
          lineWidth: 6,
          dirArrowStyle: true,
          eventSupportInvisible: false
        }
      },
      getPath: function(pathData, pathIndex) {
        //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
        return pathData.path;
      },
      getHoverTitle() {
        return false;
      }
    };
  };

  /**
   * @desc 生成轨迹记录id，初始化数据
   * @param {array} data
   */
  setDataInfo(data) {
    if (!data.length) {
      return;
    }
    this.data = [];
    this.dataExt = {};
    for (let i = 0, l = data.length; i < l; i++) {
      let dataItem = {};
      let item = data[i];
      dataItem.id = `path-${item.cameraId}-${Utils.uuid()}`;
      dataItem.deviceName = item.cameraName;
      dataItem.captureTime = item.captureTime;
      dataItem.objectInfo = item;
      dataItem.deviceId = item.cameraId;
      dataItem.position = item.position;
      this.setDataExt(dataItem);
    }
    let arr = [];
    this.data = Object.keys(this.dataExt).map(k => (arr = [].concat(...arr, ...this.dataExt[k])));
    this.data = orderBy(arr, ['data', 'desc'], ['id', 'asc']);
    this.createMarkers();
  }

  setDataExt(item) {
    const keys = Object.keys(this.dataExt);
    let index = this.getFreeIndex();
    for (let i in keys) {
      const key = keys[i];
      let dataItem = this.dataExt[key].find(v => v.cameraId === item.cameraId && v.position.toString() === item.position.toString());
      if (dataItem) {
        index = key;
        break;
      }
    }
    item.index = index;
    if (this.dataExt[index]) {
      this.dataExt[index].push(item);
    } else {
      this.dataExt[index] = [item];
    }
  }

  getFreeIndex(index = 'A') {
    if (this.dataExt[index]) {
      const nextIndex = this.markerIndex[this.markerIndex.indexOf(index) + 1];
      if (nextIndex) {
        return this.getFreeIndex(nextIndex);
      } else {
        return Math.random();
      }
    } else {
      return index;
    }
  }

  /**
   * @desc 设置轨迹
   * @param {array} arr
   */
  setData(arr) {
    this.clearPathNavigators();
    this.clearOtherInfo();
    if (!Array.isArray(arr) || arr.length === 0) {
      this.hide();
      this.setState({ isClear: true });
      return false;
    }
    this.setDataInfo(arr);
    this.show();
    const data = this.data.map(v => v.position);
    this.pathSimplifier.setData([{ path: data }]);
    this.createStart();
    this.setState({
      current: this.data[0],
      center: this.data[0].position,
      visible: true
    });
  }

  /**
   * @desc 清除巡航器
   */
  clearPathNavigators() {
    if (this.pathNavigator) {
      this.pathNavigator.off('move', this.moveAction);
      this.pathNavigator.off('pause', this.stopAction);
      this.pathNavigator.destroy();
    }
    this.pathSimplifier && this.pathSimplifier.clearPathNavigators();
  }

  /**
   * @desc 清理点位和图片信息
   */
  clearOtherInfo() {
    this.MakerPoints && this.MakerPoints.removeAllMarker();
    this.infoWindow && this.infoWindow.close();
  }

  /**
   * @desc 开始一个轨迹
   */
  createStart() {
    //创建一个巡航器
    this.pointIndex = -1;
    this.pathNavigator = this.pathSimplifier.createPathNavigator(0, {
      loop: false,
      speed: 10
    });
    this.pathNavigator.on('move', this.moveAction);
    this.pathNavigator.on('pause', this.stopAction);
    this.pathNavigator.start();
    this.setState({ status: 'resume', isClear: false });
  }

  /**
   * @desc 监听轨迹move事件
   */
  moveAction = event => {
    const { idx } = event.target.getCursor();
    if (idx !== this.pointIndex) {
      this.pointIndex = idx;
      const current = this.data[this.pointIndex];
      const next = this.data[this.pointIndex + 1];
      if (current && next) {
        const dis = AMap.GeometryUtil.distance(current.position, next.position);
        dis > 10 && event.target.setSpeed(dis / 3 / (1000 / 3600));
      }
      setTimeout(() => {
        this.setState({
          current,
          center: current.position
        });
      }, 10);
      this.props.changeIndexCallback && this.props.changeIndexCallback(this.pointIndex, current);
    }
  };

  /**
   * @desc 监听轨迹停止事件
   */
  stopAction = event => {
    this.setState({ status: 'repeat' });
  };

  /**
   * @desc 初始化加点位组件，用户辅助轨迹
   */
  initPoints = MakerPoints => {
    this.MakerPoints = MakerPoints;
  };
  hide() {
    if (this.pathSimplifier) {
      !this.pathSimplifier.isHidden() && this.pathSimplifier.hide();
    }
  }
  show() {
    if (this.pathSimplifier) {
      this.pathSimplifier.isHidden() && this.pathSimplifier.show();
    }
  }
  changeIndex = index => {
    this.pathNavigator.pause();
    const current = this.data[index];
    this.setState({
      status: 'pause',
      current,
      center: current.position
    });
    this.props.changeIndexCallback && this.props.changeIndexCallback(index);
  };

  /**
   * @desc 修改当前轨迹的点位
   */
  changeCurrent = (key = 'dataId', value) => {
    let index = this.data.findIndex(v => v[key] && v[key] === value);
    index > -1 && this.changeIndex(index);
  };
  navClk(status) {
    const currentStatus = this.pathNavigator.getNaviStatus();
    if (status === 'repeat' || status === 'stop') {
      this.pathNavigator.start();
      this.setState({ status: 'resume' });
      return false;
    }
    if (currentStatus === 'moving') {
      this.pathNavigator.pause();
      this.setState({ status: 'pause' });
      return false;
    }
    if (currentStatus === 'pause') {
      this.pathNavigator.resume();
      this.setState({ status: 'resume' });
      return false;
    }
  }
  prev() {
    if (this.pointIndex > 0) {
      this.pathNavigator.moveToPoint(this.pointIndex - 1, 1);
    }
  }
  next() {
    if (this.pointIndex < this.data.length) {
      this.pathNavigator.moveToPoint(this.pointIndex + 1, 1);
    }
  }
  onCheck(flag) {
    this.setState({ visible: flag });
  }
  render() {
    const { center, status, visible } = this.state;
    const { content = null } = this.props;
    const isMove = status === 'resume';
    return (
      <div className="map-trajectory">
        <MakerPoints init={this.initPoints} />
        <InfoWindow init={this.initWinInfoAction} center={center} content={content} visible={visible} notMove={true} />
        <div className="map-trajectory-tools">
          <div className="tool-item" onClick={this.navClk.bind(this, isMove ? 'pause' : status)}>
            <IconFont type={!isMove ? 'icon-Play_Main' : 'icon-Pause_Main'} />
            {!isMove ? '开始' : '暂停'}
          </div>

          <div className="tool-item" onClick={this.navClk.bind(this, 'repeat')}>
            <IconFont type={'icon-Reset_Dark'} />
            复位
          </div>

          <div className="tool-item" onClick={this.prev.bind(this)}>
            <IconFont type={'icon-Forward_Main'} />
            上一个
          </div>
          <div className="tool-item next-btn" onClick={this.next.bind(this)}>
            <IconFont type={'icon-Backward_Main'} />
            下一个
          </div>
          <div className="tool-item">
            <Switch checked={visible} onChange={this.onCheck.bind(this)} />
            {`${visible ? '关闭' : '开启'}图片`}
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Trajectory;
