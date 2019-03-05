/**
 * onClick 跳转方法
 * imgUrl 图片路径
 * onFollow 设置关注
 * onRelation 设置关联 不传择不显示关联图标
 * personId 人员personId
 * aid  人员aid
 * address 地址
 * personName 人员姓名
 * lastTime 最后出现时间
 * lastAddress 最后出现地点
 * tags 标签数组
 * isFocus 是否关注
 * countDay 出现天数
 * hasAid  是否已经关联aid
 */

import React from 'react';
import { Popover } from 'antd';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');
const ImageView = Loader.loadBusinessComponent('ImageView');

class ObjectMapPersonnelCard extends React.Component {
  constructor(props) {
    super(props);
    this.infoRef = React.createRef();
  }

  getLabel = labelList => { 
    if (labelList.length === 0) {
      return [];
    }
    labelList = [
      ...new Set(
        labelList.map(v => {
          return parseInt(v / 10) * 10;
        })
      )
    ];
    labelList = labelList.map(v => v + '');
    let dictLabel = Dict.typeCode.filter(v => labelList.indexOf(v.code) > -1);
    let arr = [];
    dictLabel.map(v => {
      if (v.code === '119100') {
        let arrLabel = JSON.parse(JSON.stringify(Dict.getDict(v.name)));
        arrLabel.map(v => {
          v.label =
            v.label.indexOf('经常出现') === -1 ? '经常出现' + v.label : v.label;
        });
        arr = arr.concat(arrLabel);
      } else {
        arr = arr.concat(Dict.getDict(v.name));
      }
    });
    return arr;
  };
  render() {
    let {
      onClick,
      data = {},
      onFollow,
      onRelation,
      personId,
      aid,
      address,
      personName,
      imgUrl,
      lastTime,
      lastAddress,
      tags = [],
      isFocus = false,
      countDay,
      hasAid,
      countTitle,
    } = this.props;
    let tagsList = this.getLabel(tags) || [];
    return (
      <div
        className="object-map-personnel-card"
        onClick={() => onClick && onClick(data)}>
        <div className="map-personnerl-header">
          <div className="img-box">
            <ImageView className="image" src={imgUrl} />
          </div>
          <div className="header-info">
            <div className="info-header" ref={this.infoRef}>
              <Popover
                placement="left"
                content={isFocus ? '取消关注' : '关注'}
                getPopupContainer={() => this.infoRef.current}>
                <IconFont
                  type={
                    isFocus ? 'icon-Follow_Yes_Main' : 'icon-Follow_No_Main'
                  }
                  className={isFocus ? 'icon-alive' : 'icon-false'}
                  theme="outlined"
                  onClick={e => onFollow && onFollow(data, e)}
                />
              </Popover>
              {hasAid && (
                <Popover
                  placement="left"
                  content={'关联'}
                  getPopupContainer={() => this.infoRef.current}>
                  <IconFont
                    type={'icon-Linked_Main'}
                    theme="outlined"
                    onClick={e => onRelation && onRelation(data, e)}
                  />
                </Popover>
              )}
            </div>
            {!aid && personId && (
              <div className="info-content">
                <p className="content-text name">
                  <IconFont
                    type={'icon-TreeIcon_People_Main2'}
                    theme="outlined"
                  />
                  <span className="value">{personName}</span>
                </p>
                <p className="content-text">
                  <IconFont type={'icon-Map_Main2'} theme="outlined" />
                  <span className="value" title={address}>
                    {address}
                  </span>
                </p>
              </div>
            )}
            {aid && (
              <div className="info-content">
                <p className="content-text">
                  <IconFont type={'icon-Clustering'} theme="outlined" />
                  <span className="value" title={aid}>
                    {aid}
                  </span>
                </p>
              </div>
            )}
              <div className="info-content">
                <div className="title">最近出现：</div>
                <p className="content-text">
                  <IconFont type={'icon-Add_Main2'} theme="outlined" />
                  <span className="value" title={lastAddress||'--'}>
                    {lastAddress||'--'}
                  </span>
                </p>
                <p className="content-text">
                  <IconFont type={'icon-Clock_Light'} theme="outlined" />
                  <span className="value">
                    {lastTime ? Utils.formatTimeStamp(+lastTime) : '--'}
                  </span>
                </p>
              </div>
            {countDay && (
              <div className="info-content">
                <div className="title">{`${countTitle||'30天内出现'}：`}</div>
                <p className="content-text">
                  <IconFont
                    type={'icon-Select_Choosed_Main'}
                    theme="outlined"
                  />
                  <span className="value">{`${countDay}天`}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        {tags.length ? (
          <div className="map-personnerl-footer">
            {tags.filter(v => !!v).map(item => {
              return (
                <div className="label">
                  {' '}
                  {tagsList.length > 0 &&
                    tagsList.find(v => v.value == item) &&
                    tagsList.find(v => v.value == item).label}
                </div>
              );
            })}
            {tags.length > 4 && <span className="label-d">...</span>}
          </div>
        ) : (
          <div className="footer-none">无标签</div>
        )}
      </div>
    );
  }
}

export default ObjectMapPersonnelCard;
