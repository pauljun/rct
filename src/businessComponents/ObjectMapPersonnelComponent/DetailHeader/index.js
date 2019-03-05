/*
 * @Author: suyi
 * @Date: 2019-03-01 14:08:15
 * @Last Modified by: suyi
 * @Last Modified time: 2019-03-04 19:37:35
 */
import React, { Component } from 'react';
import { Popover } from 'antd';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');
const ImageView = Loader.loadBusinessComponent('ImageView');
const HorizontalScrollLayout = Loader.loadBaseComponent(
  'HorizontalScrollLayout'
);

/**
 * @desc 人员档案详情header
 * @param {Object}  data 人员数据
 * @param {Boolean} hasPersonId 是否有PersonId
 * @param {Booleam} hasAid 是否有Aid
 * @param {Function} onFollow 关注方法
 * @param {Function} onRelation 关联方法
 */

class DetailHeader extends Component {
  constructor(props) {
    super(props);
    this.infoRef = React.createRef();
  }
  renderItem = item => {
    return (
      <div className="wheel-box">
        <img
          className="wheel-img"
          src={item.newestPictureUrl || item.lastestPictureUrl}
        />
      </div>
    );
  };

  render() {
    let {
      onFollow,
      onRelation,
      data = {},
      hasPersonId = false,
      hasAid = false
    } = this.props;
    const {
      portraitPictureUrl,
      isFocus,
      personName,
      ageSection,
      identityCardNumber,
      age,
      bindAids = [],
      mobile,
      educationDegree,
      gender,
      address,
      maritalStatus,
      aidPictureInfos = [],
      nationality,
      recentAppearanceAddress,
      recentAppearanceTime,
      firstAppearanceAddress,
      firstAppearanceTime
    } = data;
    return (
      <div className="objectMap-ploy-detail-header">
        <div className="header-title">基本信息：</div>
        <div className="detail-content">
          <div className="content-left">
            <div className="picture-box">
              <ImageView className="image" src={portraitPictureUrl || aidPictureInfos.length > 0 && aidPictureInfos[0].newestPictureUrl} />
              <p className="picture-info">AID聚类照片</p>
            </div>
            {hasAid && (
              <HorizontalScrollLayout
                size={3}
                data={aidPictureInfos}
                className="picture-horizont"
                renderItem={this.renderItem}
                prevIcon={<IconFont type="icon-Arrow_Small_Left_Mai" />}
                nextIcon={<IconFont type="icon-Arrow_Small_Right_Ma" />}
              />
            )}
          </div>
          <div className="content-right">
            <div className="info-header" ref={this.infoRef}>
              <Popover
                placement="left"
                content={isFocus ? '取消关注' : '关注'}
                getPopupContainer={() => this.infoRef.current}>
                <IconFont
                  type={
                    isFocus ? 'icon-Follow_Yes_Main' : 'icon-Follow_No_Main'
                  }
                  className={isFocus ? 'icon-alive' : ''}
                  theme="outlined"
                  onClick={onFollow}
                />
              </Popover>
              {hasPersonId && (
                <Popover
                  placement="left"
                  content={'关联'}
                  getPopupContainer={() => this.infoRef.current}>
                  <IconFont
                    type={'icon-Linked_Main'}
                    theme="outlined"
                    onClick={onRelation}
                  />
                </Popover>
              )}
            </div>
            {hasPersonId && (
              <div className="info-center">
                <div className="info">
                  <p className="info-name">姓名：</p>
                  <span className="info-val">{personName || '-'}</span>
                </div>
                <div className="info">
                  <p className="info-name">年龄段：</p>
                  <span className="info-val">
                    {ageSection ? Dict.getLabel('generation', ageSection) : '-'}
                  </span>
                </div>
                <div className="info">
                  <p className="info-name">证件号码：</p>
                  <span className="info-val">{identityCardNumber || '-'}</span>
                </div>
                <div className="info">
                  <p className="info-name">年龄：</p>
                  <span className="info-val">{age ? `${age}岁` : '-'}</span>
                </div>
                {hasAid && (
                  <div className="info">
                    <p className="info-name">虚拟身份：</p>
                    <span className="info-val">{bindAids[0] || '-'}</span>
                  </div>
                )}
                <div className="info">
                  <p className="info-name">文化程度：</p>
                  <span className="info-val">
                    {educationDegree
                      ? Dict.getLabel('degreeEducation', educationDegree)
                      : '-'}
                  </span>
                </div>
                <div className="info">
                  <p className="info-name">民族：</p>
                  <span className="info-val">
                    {nationality ? Dict.getLabel('nation', nationality) : '-'}
                  </span>
                </div>
                <div className="info">
                  <p className="info-name">手机号：</p>
                  <span className="info-val">{mobile ? mobile : '-'}</span>
                </div>
                <div className="info">
                  <p className="info-name">性别：</p>
                  <span className="info-val">
                    {gender ? Dict.getLabel('sex', gender) : '-'}
                  </span>
                </div>
                <div className="info">
                  <p className="info-name">地址：</p>
                  <span className="info-val">{address || '-'}</span>
                </div>
                <div className="info">
                  <p className="info-name">婚姻状态：</p>
                  <span className="info-val">
                    {maritalStatus
                      ? Dict.getLabel('marital', maritalStatus)
                      : '-'}
                  </span>
                </div>
              </div>
            )}
            {hasAid && (
              <div className="info-center">
                <div className="info">
                  <p className="info-name">最近出现：</p>
                  <div className="info-time">
                    <div className="address">
                      <IconFont type={'icon-Add_Main2'} theme="outlined" />
                      <span
                        className="info-val"
                        title={recentAppearanceAddress}>
                        {recentAppearanceAddress || '-'}
                      </span>
                    </div>
                    <div className="address">
                      <IconFont type={'icon-Clock_Light'} theme="outlined" />
                      <span className="info-val">
                        {recentAppearanceTime
                          ? Utils.formatTimeStamp(+recentAppearanceTime)
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="info">
                  <p className="info-name">首次出现：</p>
                  <div className="info-time">
                    <div className="address">
                      <IconFont type={'icon-Add_Main2'} theme="outlined" />
                      <span className="info-val" title={firstAppearanceAddress}>
                        {firstAppearanceAddress || '-'}
                      </span>
                    </div>
                    <div className="address">
                      <IconFont type={'icon-Clock_Light'} theme="outlined" />
                      <span className="info-val">
                        {firstAppearanceTime
                          ? Utils.formatTimeStamp(firstAppearanceTime)
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DetailHeader;
