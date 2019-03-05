import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import './index.less';
import { Tooltip, Button, message } from 'antd';

const AuthComponent = Loader.loadBusinessComponent('AuthComponent');
const IconFont = Loader.loadBaseComponent('IconFont');
const PictureTools = Loader.loadBusinessComponent('PictureTools');
const FullScreenLayout = Loader.loadBaseComponent('FullScreenLayout')
const IMAGE_PATH = '/resource/image/demo.jpg';


/**
 * @ personKey
 * 
 */
@withRouter
@Decorator.businessProvider('device', 'tab', 'mediaLib')
class PictureCanvasView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenSelect: false,
      isCollection: false, // 收藏状态
      scale: 1,
      key:Math.random()
    };
    this.pictureCanvas = React.createRef();
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.updataCollectedState, this.updataCollectedState);
  }

  init = () => {
    const { mediaLib, data } = this.props;
    let key = data.captureId || data.id
    let type = mediaLib.hasCollectedKey(key);
    this.setState({
      isCollection: !!type
    })
    SocketEmitter.on(SocketEmitter.eventName.updataCollectedState, this.updataCollectedState)
  }
  updataCollectedState = (parms) => {
    const { data } = this.props;
    parms.map(v => {
      if(v.id === data.captureId || v.id === data.id) {
        this.setState({
          isCollection: false
        })
      }
    })
  }

  changeSelectStatus() {
    const { isOpenSelect } = this.state;
    if (!isOpenSelect) {
      this.pictureCanvas.current.startScreenshot();
    } else {
      this.pictureCanvas.current.cancelScreenshot();
    }
    this.setState({ isOpenSelect: !isOpenSelect });
  }

  
  // 处理跳转
  HandleLink = type => {
    // if (this.state.isOpenSelect) {
      // 框选搜图
      this.linkTo(type);
    // } else {
      // 以图搜图
      // message.info('关联搜索处理');
    // }
  };

  imgDownload = () => {
    const { imgUrl, data } = this.props;
    const name = data.deviceName;
    const time = data.captureTime || data.passTime;
    Utils.downloadLocalImage(imgUrl, `${name}_${moment(+time || time).format('YYYYMMDDTHHmmss')}`);
  }
  // 框选搜图跳转
  linkTo = type => {
    const { imgUrl, location, tab, data } = this.props;
    LM_DB.add('parameter', {
      id: data.captureId || data.id,
      url: imgUrl
    }).then(() => {
      tab.goPage({
          moduleName: `${type}Library`,
          location,
          data: { id: data.captureId || data.id, isSearch: true, searchType: 0 }
        });
    });
  };

  HandlePeopleLink = async() => {
    const { data, location, tab} = this.props;
    if(data.aid) {
      Service.person.queryRecentAppearanceByAids({aids: [data.aid]}).then(res => {
        let data = res.data[0];
        if(data && data.isPerson) {
          tab.goPage({
            moduleName: 'objectMapPersonnelDetailPloy',
            location,
            data: { id:data.personId }
          });
        }

        if(data && !data.isPerson) {
          tab.goPage({
            moduleName: 'objectMapPersonnelDetailAid',
            location,
            data: { id:data.aid }
          });
        }
      })
    }
  };

  fullScreenChange = () => {
    this.pictureCanvas.current.reloadPic();
    this.pictureCanvas.current.cancelScreenshot();
    this.setState({
      isOpenSelect: false
    })
  }

  /**收藏 */
  onCollection = () => {
    const { isCollection } = this.state;
    const { mediaLib, data } = this.props;
    let option = {
      id: data.captureId || data.id,
      cameraName: data.deviceName,
      cameraId: data.cid,
      aid: data.aid,
      type: 'image',
      startTime: data.captureTime,
      endTime: data.captureTime,
      captureTime: Number(data.captureTime || data.passTime),
      imgUrl: data.sceneUrl,
      dataInfo: data
    };
    if(isCollection) {
      mediaLib.deleteBatch([option]).then(() => {
        message.info('取消收藏');
        this.setState({
          isCollection: false
        })
      });
    } else {
      mediaLib.add(option).then(() => {
        message.info('收藏成功');
        this.setState({
          isCollection: true
        })
      });
    }

  }

  beforeJumppage = () => {
    const { beforeJumppage } = this.props;
    return new Promise((resolve, reject) => {
      if(!!!beforeJumppage){
        resolve(true)
      }else{
        beforeJumppage(resolve)
      }
    })
  }
  //复位
  resetAll = () => {
    this.pictureCanvas.current.resetRotate()
    this.pictureCanvas.current.resetScale()
  }
  render() {
    const { isOpenSelect, scale,key, isCollection } = this.state;
    const { data } = this.props;
    return (
      <PictureTools
        imagePath={this.props.imgUrl}
        ref={this.pictureCanvas}
        className='pictureCanvas-tool'
        key={key}
        beforeJumppage={this.beforeJumppage}
        changeScale={scale => this.setState({ scale })}>
        <ul className="actions-change actions-change-size">
        <Tooltip placement="left" title="复位">
            <li onClick={() => this.resetAll()}>
              <IconFont type="icon-Middle_Main" />
            </li>
          </Tooltip>
          <Tooltip placement="left" title="放大">
            <li
              onClick={() => this.pictureCanvas.current.scale(0.2)}
              className={scale === 3 ? 'disabled' : ''}>
              <IconFont type="icon-Zoom__Light" />
            </li>
          </Tooltip>
          <Tooltip placement="left" title="缩小">
            <li
              onClick={() => this.pictureCanvas.current.scale(-0.2)}
              className={scale === 1 ? 'disabled' : ''}>
              <IconFont type="icon-Zoom_-_Light" />
            </li>
          </Tooltip>
          <Tooltip placement="left" title="向左">
            <li onClick={() => this.pictureCanvas.current.rotate(-90)}>
              <IconFont type="icon-Left_Main" />
            </li>
          </Tooltip>
          <Tooltip placement="left" title="向右">
            <li onClick={() => this.pictureCanvas.current.rotate(90)}>
              <IconFont type="icon-Right_Main" />
            </li>
          </Tooltip>
        </ul>
        <ul className="actions-utils-btn">
          <li onClick={this.imgDownload}>
            <IconFont type="icon-Download_Main" />
          </li>
          <li>
        <FullScreenLayout
          className="footer_window"
          getContainer={() => this.pictureCanvas.current.cantainerRef.current}
          fullScreenChange={(...args) => this.fullScreenChange(...args)}
        >
          {isFullscreen => (
            <IconFont
              title={!isFullscreen ? '全屏' : '退出全屏'}
              type={!isFullscreen ? 'icon-Full_Main' : 'icon-ExitFull_Main'}
              theme="outlined"
            />
          )}
        </FullScreenLayout>
          </li>
        </ul>
        <div className="baselib-pic-search">
          <Button onClick={() => this.changeSelectStatus()}>
            <IconFont type="icon-SearchBox" />
            {isOpenSelect ? '取消框选' : '框选搜图'}
          </Button>
          {data.aid && <React.Fragment>
            <AuthComponent actionName='faceLibrary'>
              <Button onClick={() => this.HandleLink('face')}>
                <IconFont type="icon-Face_Main2" />
                人脸检索
              </Button>
            </AuthComponent>
            <AuthComponent actionName='bodyLibrary'>
            <Button onClick={() => this.HandleLink('body')}>
              <IconFont type="icon-Body_Main2" />
              人体检索
            </Button>
            </AuthComponent>
            <AuthComponent actionName='objectMapPersonnel'>
            <Button onClick={this.HandlePeopleLink}>
              <IconFont type="icon-Often_Dark" />
              人员档案
            </Button>
            </AuthComponent>
          </React.Fragment>
        }
        </div>
        <Tooltip placement="left" title={isCollection ? '取消收藏': '收藏' } onClick={this.onCollection}>
          <IconFont type="icon-Keep_Main" className={`actions-collect-btn ${isCollection ? 'actions-collect-btn-active' : ''}`} />
        </Tooltip>
      </PictureTools>
    );
  }
}

export default PictureCanvasView;
