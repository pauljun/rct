import React, { Component } from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';

const IconFont = Loader.loadBaseComponent('IconFont');
const PictureTools = Loader.loadBusinessComponent('PictureTools');

class Card extends Component {

  constructor(props){
    super(props);
    this.pictureCanvas = React.createRef();
    this.state = {
      rectSearchStatus: false,
      imgError: false,
      collectStatus: false,
    }
  }

  componentWillMount() {
    const { item } = this.props;
    const collectStatus = !!BaseStore.mediaLib.hasCollectedKey(item.imgId);
    if(collectStatus) {
      this.setState({
        collectStatus
      })
    }
    SocketEmitter.on(SocketEmitter.eventName.updataCollectedState, this.updateCollectStatus)
  }

  componentWillUnmount() {
    SocketEmitter.off(SocketEmitter.eventName.updataCollectedState, this.updateCollectStatus)

  }

  updateCollectStatus = (selectList) => {
    const { item } = this.props;
    const temp = selectList.find(v => v.id === item.imgId);
    if(temp) {
      this.setState({
        collectStatus: false
      })
    }
  }

  handleRectSearch = () => {
    const { rectSearchStatus } = this.state;
    if(rectSearchStatus) {
      this.pictureCanvas.current.cancelScreenshot();
    } else {
      this.pictureCanvas.current.startScreenshot();
    }
    this.setState({
      rectSearchStatus: !rectSearchStatus
    })
  }
  
  cancelCollection = () => {
    const { item } = this.props;
    BaseStore.mediaLib.deleteBatch([{
      id: item.imgId,
      cameraId: item.cid,
      type: 'image'
    }]);
  }

  addCollection = (e) => {
    const { item } = this.props;
    const options = {
      start: { clientX: e.clientX, clientY: e.clientY },
      url: item.sceneUrl
    };
    Utils.animateFly(options);
    BaseStore.mediaLib.add({
      id: item.imgId,
      cameraId: item.cid,
      cameraName: item.deviceName,
      captureTime: +item.captureTime,
      imgUrl: item.sceneUrl,
      type: 'image'
    }).then(() => {
      this.setState({
        collectStatus: true
      })
    })
  }

  handleCollectiton = (e) => {
    const { collectStatus } = this.state;
    if(collectStatus) {
      this.cancelCollection()
    } else {
      this.addCollection(e)
    }
  }

  catchError = () => {
    this.setState({
      imgError: true
    })
  }

  render(){
    const { item } = this.props;
    const { rectSearchStatus, imgError, collectStatus } = this.state;
    return (
      <div className={`video-item ${imgError ? 'error': 'success'}`}>
        <div className='content'>  
          <PictureTools 
            ref={this.pictureCanvas}
            catchError={this.catchError}
            imagePath={item.sceneUrl}
            width={'400'}
            allowDrag={false}
          />
        </div>
        <div className='footer'>
          <div className='item'>
            <IconFont type={'icon-Add_Main2'} theme="outlined" />
            { item.deviceName }
          </div>
          <div className='item'>
            <IconFont type={'icon-Clock_Main2'} theme="outlined" />
            {moment(item.captureTime*1).format(Shared.format.dataTime)}
          </div>
          <div className='btn-group'>
            <Tooltip title={`${collectStatus ? '取消' : ''}收藏`}>
              <IconFont 
                className={`${collectStatus ? 'active' : ''}`}
                type='icon-Keep_Main' 
                onClick={this.handleCollectiton}
              />
            </Tooltip>
            <Tooltip title={!rectSearchStatus ? '框选搜图' : '取消框选'}>
              <IconFont 
                type='icon-Choose__Main1' 
                onClick={() => this.handleRectSearch()} 
                className={rectSearchStatus ? 'active' : ''}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }
}

export default Card