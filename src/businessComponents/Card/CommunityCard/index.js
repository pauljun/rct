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
      if(v.code === '119100') {
        let arrLabel = JSON.parse(JSON.stringify(Dict.getDict(v.name)));
        arrLabel.map(v => {
          v.label = v.label.indexOf('经常出现') === -1 ? '经常出现' + v.label : v.label
        });
        arr = arr.concat(arrLabel);
      } else {
        arr = arr.concat(Dict.getDict(v.name));
      }
    });
    return arr;
  };
  render() {
    let { onClick, data = {}, onFollow, onRelation } = this.props;
    let {
      aid,
      recentAddress,
      recentTime,
      url,
      appearDaysInMonth,
      isFocus,
      portraitPicUrl,
      presentAddress,
      lastAddress,
      lastTime,
      name,
      id,
      continuousUncapturedDays,
      tagCodes = []
    } = data;
    let tagsList = this.getLabel(tagCodes?tagCodes:[]) || [];
    let tag=tagCodes?tagCodes.filter(v => !!v):[];
    return (
      <div
        className="community-personnel-card"
        onClick={() => onClick && onClick(data)}>
        <div className="community-personnerl-header">
          <div className="img-box">
            <ImageView type="multiple" src={url||portraitPicUrl} />
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
                  className={isFocus ? 'icon-alive' : 'icon-not-alive'}
                  theme="outlined"
                  onClick={e => onFollow && onFollow(data, e)}
                />
              </Popover>
              {(id) && (
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
            {id && (
              <div className="info-content">
                <p className="content-text name">
                  <IconFont
                    type={'icon-TreeIcon_People_Main2'}
                    theme="outlined"
                  />
                  <span className="value">{name}</span>
                </p>
                <p className="content-text">
                  <IconFont type={'icon-Map_Main2'} theme="outlined" />
                  <span className="value" title={presentAddress}>
                    {presentAddress}
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
            {(recentAddress||lastAddress) && (
              <div className="info-content">
                <div className="title">最近出现：</div>
                <p className="content-text">
                  <IconFont type={'icon-Add_Main2'} theme="outlined" />
                  <span className="value" title={recentAddress||lastAddress}>
                    {recentAddress||lastAddress}
                  </span>
                </p>
                <p className="content-text">
                  <IconFont type={'icon-Clock_Light'} theme="outlined" />
                  <span className="value">
                    {(recentTime||lastTime)
                      ? Utils.formatTimeStamp(+(recentTime||lastTime))
                      : '-'}
                  </span>
                </p>
              </div>
            )}
            {(appearDaysInMonth||continuousUncapturedDays) && (
              <div className="info-content">
                <div className="title">30天内出现：</div>
                <p className="content-text">
                  <IconFont
                    type={'icon-Select_Choosed_Main'}
                    theme="outlined"
                  />
                  <span className="value">{`${appearDaysInMonth||continuousUncapturedDays}天`}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        {tag&&tag.length ? (
          <div className="community-personnerl-footer">
            {tag.map(item => {
              return (
                <div className="label">
                  {tagsList.length > 0 &&
                    tagsList.find(v => v.value == item) &&
                    tagsList.find(v => v.value == item).label}
                </div>
              );
            })}
            {tag.length > 4 && <span className="label-d">...</span>}
          </div>
        ) : (
          <div className="footer-none">无标签</div>
        )}
      </div>
    );
  }
}

export default ObjectMapPersonnelCard;
