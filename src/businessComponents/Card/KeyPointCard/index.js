import React from 'react';
import { Progress } from 'antd';
import moment from 'moment';

import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');
const ImageView = Loader.loadBaseComponent('ImageView');

class KeyPointCard extends React.Component {
  constructor(props) {
    super(props);
  }

  handlePageJump = (id, alarmType) => {
    this.props.handleJumPage && this.props.handleJumPage(id, alarmType);
  };

  render() {
    let { data = {}, isActual = false, handleChangeYN} = this.props;
    let {
      imageUrl,
      faceUrl,
      score,
      cameraName,
      objectMainJson,
      captureTime,
      libName,
      isEffective,
      isHandle,
      id,
      deviceName,
      alarmType,
    } = data;
    return (
      <div
        className={`key-point-card ${!isActual ? 'handle' : ''}`}
        onClick={this.handlePageJump.bind(this, id, alarmType)}>
        <div className="card-header">
          <div className="header-box">
            <ImageView className='header-img' src={imageUrl} />
            <div className="img-text">布控照片</div>
          </div>
          <div className="header-box">
            <ImageView className='header-img' src={faceUrl} />
            <div className="img-text">抓拍照片</div>
          </div>
        </div>
        <div className="card-content">
          <div className="content-name">
            <div className="name">
              <IconFont type={'icon-TreeIcon_People_Dark'} theme="outlined" />
              <span
                className="info"
                title={
                  objectMainJson
                    ? objectMainJson.name && objectMainJson.name.length > 15
                      ? objectMainJson.name
                      : ''
                    : ''
                }>
                {objectMainJson
                  ? objectMainJson.name && objectMainJson.name.length > 15
                    ? objectMainJson.name.substring(0, 15) + '...'
                    : objectMainJson.name
                  : ''}
              </span>
            </div>
            <div className="process">
              <IconFont type={'icon-TreeIcon_People_Dark'} theme="outlined" />
              <span className="title">相似度</span>
              <Progress
                percent={score && Math.floor(score)}
                size="small"
                status="active"
                showInfo={false}
              />
              <span className="number">{score && Math.floor(score)}%</span>
            </div>
          </div>
          <div className="content-message">
            <IconFont type={'icon-Layer_Main'} theme="outlined" />
            <span className="title" title={libName}>
              {libName}
            </span>
          </div>
          <div className="content-message">
            <IconFont type={'icon-Add_Main2'} theme="outlined" />
            <span className="title" title={cameraName || deviceName}>
              {cameraName || deviceName}
            </span>
          </div>
          <div className="content-message">
            <IconFont type={'icon-Clock_Main2'} theme="outlined" />
            <span className="title">
              {moment(parseInt(captureTime, 10)).format('YYYY.MM.DD HH:mm:ss')}
            </span>
          </div>
        </div>
        { !isActual && isHandle == 0 && (
          <div className="card-footer">
            <div
              className="handle handle-no"
              onClick={handleChangeYN && handleChangeYN.bind(this, data, 0)}>
              <IconFont type={'icon-YesNo_No_Main'} theme="outlined" />
              无效
            </div>
            <div
              className="handle handle-yes"
              onClick={handleChangeYN && handleChangeYN.bind(this, data, 1)}>
              <IconFont type={'icon-YesNo_Yes_Main'} theme="outlined" />
              有效
            </div>
          </div>
        )}
        {isHandle == 1 && (
          <div
            className={`alam-rotate ${
              isEffective == 1 ? 'alarm-rotate-yes' : 'alarm-rotate-no'
            }`}
          />
        )}
      </div>
    );
  }
}

export default KeyPointCard;
