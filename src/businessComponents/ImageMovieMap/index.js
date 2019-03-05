import React from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { observer } from 'mobx-react';

import './index.less';
const PlayComponent = Loader.loadBusinessComponent('PlayComponent');
const PictureCanvas = Loader.loadBusinessComponent('PictureCanvas');
const SimpleMap = Loader.loadBusinessComponent('MapComponent', 'SimpleMap');
const IconFont = Loader.loadBaseComponent('IconFont');

@withRouter
@Decorator.businessProvider('tab', 'user', 'device')
@observer
class ImageMovieMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      IMMType: 0,
      PathCurrent: {},
      movieTrue: false,
      overdue: false, // 视频是否过期
      fileData: null,
      deviceList: {},
      data: {}
    };
    this.movieTime = null;
    this.getUserTime();
    this.trajectRef = React.createRef();
  }

  componentWillMount() {
    clearTimeout(this.movieTime);
    this.init(this.props.data);
  }

  init = (parms) => {
    let deviceList = this.props.device.queryCameraById(parms.cid);
    parms.ponitList = deviceList;
    this.setState({
      data: parms
    })
  }

  videoImgChange = () => {
    let { imgVideoChange } = this.state;
    this.setState({
      imgVideoChange: !imgVideoChange
    });
  };

  getUserTime = async () => {
    let { user, data } = this.props;
    const storageLimit = await this.judgeHistory(data);
    const NOW_DATE = moment().valueOf();
    if (NOW_DATE - data.captureTime > storageLimit * 24 * 60 * 60 * 1000) {
      this.setState({
        overdue: true
      });
      return;
    }
    let systemTime = user.systemTime;
    if (systemTime - data.captureTime > 60000) {
      this.setState({
        movieTrue: true
      });
    } else {
      this.movieTime = setTimeout(() => {
        this.setState({
          movieTrue: true
        });
      }, systemTime - data.captureTime);
    }
  };

  handleChangeIMM = type => {
    const { switchCheck, data } = this.props;
    let { movieTrue, overdue } = this.state;
    if ((!movieTrue && type === 1) || (overdue && type === 1)) {
      return;
    }
    switchCheck && switchCheck(type);
    if (type === 1) {
      let option = {
        cid: data.cid,
        deviceName: data.deviceName,
        startTime: parseInt(data.captureTime / 1000) - 15,
        endTime: parseInt(data.captureTime / 1000) + 15
      };
      this.getHistoryMovie(option);
    }
    this.setState({
      IMMType: type
    });
  };

  judgeHistory = parms => {
    return Service.device
      .queryDeviceInfoByCid(parms.cid)
      .then(result => {
        let storageLimit;
        try {
          storageLimit = +result.data.extJson.cameraInfo.storage.video || 7;
        } catch {
          storageLimit = 7;
        }
        return storageLimit;
      })
      .catch(e => 7);
  };
  // 获取历史视频
  getHistoryMovie = option => {
    if (this.state.fileData) {
      return;
    }
    Service.video.queryHistoryAddress(option).then(item => {
      let res = this.props.device.queryCameraById(
        option.cid || option.deviceId
      );
      let fileDatas = Object.assign({}, res, {
        historyList: item,
        isLiving: false,
        timeRange: {
          startTime: option.startTime * 1000,
          endTime: option.endTime * 1000
        }
      });
      this.setState({
        fileData: fileDatas
      });
    });
  };

  render() {
    let { IMMType, movieTrue, fileData, overdue ,data} = this.state;
    let {
      type,
      handleArray = ['pic', 'video', 'map']
    } = this.props;
    return (
      <div className="imm-view-box">
        <div className="switch-btn-container">
          <div className="imm-switch">
            {handleArray.indexOf('pic') > -1 && (
              <div
                className={`switch-box ${IMMType == 0 && 'switch-box-active'}`}
                onClick={this.handleChangeIMM.bind(this, 0)}>
                <IconFont type={'icon-Imge_Main'} theme="outlined" />
                看图片
              </div>
            )}
            {handleArray.indexOf('video') > -1 && (
              <div
                className={`switch-box ${IMMType == 1 && 'switch-box-active'} ${
                  movieTrue ? '' : 'switch-box-dis'
                }`}
                onClick={this.handleChangeIMM.bind(this, 1)}
                title={`${
                  !movieTrue
                    ? overdue
                      ? '视频已过期'
                      : '视频生成中，请稍后再试'
                    : ''
                }`}>
                <IconFont type={'icon-Video_Main'} theme="outlined" />
                看视频
              </div>
            )}
            {handleArray.indexOf('map') > -1 && (
              <div
                className={`switch-box ${IMMType == 2 && 'switch-box-active'}`}
                onClick={this.handleChangeIMM.bind(this, 2)}>
                <IconFont type="icon-List_Map_Main" theme="outlined" />
                看地图
              </div>
            )}
          </div>
        </div>
        <div className="imm-content">
          <div
            className={`imm-content-box ${IMMType == 0 &&
              'imm-content-box-active'} `}>
            <PictureCanvas
              name={data.cameraName}
              imgUrl={data && data.sceneUrl}
              data={data}
              type={type}
            />
          </div>
          <div
            className={`imm-content-box ${IMMType == 1 &&
              'imm-content-box-active'} `}>
            {IMMType == 1 && fileData && (
              <PlayComponent
                isLiving={false}
                hasLiving={false}
                fileData={fileData}
                method={{
                  downloadVideo: options =>
                    Utils.DownloadVideo({ fileData, ...options })
                }}
              />
            )}
          </div>
          <div
            className={`imm-content-box ${IMMType == 2 &&
              'imm-content-box-active'} `}>
            <SimpleMap
              points={[]}
              point={data.ponitList}
              id={data.id}
              center={[data.longitude, data.latitude]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ImageMovieMap;
