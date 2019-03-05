import React from 'react'
import { Button, message } from 'antd'
import ViewItem from './item'
// import MapCenter from '../../components/MapZoomAndLevel';
import './index.less'
const IconFont = Loader.loadBaseComponent('IconFont')
const MapLerverZoom = Loader.loadBusinessComponent('MapLerverZoom')

@Decorator.businessProvider('operation')
class OperationCenterInfo extends React.Component {
  baseUrl = `${window.location.origin}/login/`
  render() {
    const { data } = this.props
    if (!data.systemName) {
      return null
    }
    let url = data.loginKeyUrl ? data.loginKeyUrl : ''
    return (
      <InfoView
        key="optCenterInfoView"
        data={data}
        url={this.baseUrl + url}
        {...this.props}
      />
    )
  }
}

/**
 * @desc 复制Url
 */
function copy() {
  var Url2 = document.getElementById("coLogoDefault");
  Url2.select();
  document.execCommand("Copy");
  message.success("复制成功!");
}

/**
 * @desc 地图中心点格式化
 * @param {String} point 
 */
function Pointparse(point) {
  let arr = point.split(',');
  return [arr[0] * 1, arr[1] * 1]
}

function InfoView(props) {
  const { data, url, changeModel } = props;
  const zoomLevelCenter = {
    zoom: data.zoomLevelCenter,
    center: data.centerPoint ? Pointparse(data.centerPoint) : null
  }
  return (
    <React.Fragment>
      <div className='operation-info-wrapper operation-container'>
        <div className='nav'>
          <Button
            onClick={changeModel}
          >
            <IconFont type='icon-Edit_Main' />
            编辑
          </Button>
        </div>
        <h3>基本信息</h3>
        <div />
        <ViewItem label="应用系统名称" required>
          {data.centerName}
        </ViewItem>
        <ViewItem label="联系人姓名">{data.contactPerson}</ViewItem>
        <ViewItem label="联系人电话">{data.contactPhone}</ViewItem>
        <h3>登录页信息</h3>
        <ViewItem label="登录账号">{data.userInfo.loginName}</ViewItem>
        <ViewItem label="登录手机号">{data.userInfo.phoneNum}</ViewItem>
        <ViewItem label="地图初始状态">
          <div>
            {/* <MapCenter
              zoomLevelCenter={zoomLevelCenter}
            /> */}
            <MapLerverZoom />
          </div>
        </ViewItem>
        <h3>登录页</h3>
        <ViewItem label="系统名称">{data.systemName}</ViewItem>
        <ViewItem label="系统logo">
          <div className='logo-bg w64'>
            <img src={data.systemLogo} />
          </div>
        </ViewItem>
        <ViewItem label="合作单位logo">
          <div className='logo-bg h44'>
            <img src={data.coLogo} />
          </div>
        </ViewItem>
        <ViewItem label='应用系统URL'>
          <div className='copy-btn'>
            <input
              type='text'
              id='coLogoDefault'
              defaultValue={url}
            />
            <span>{url}</span>
            <Button
              onClick={copy}
              className='login-url-copy'
            >
              <IconFont type='icon-Version_Main' />
              复制链接
            </Button>
          </div>
        </ViewItem>
      </div>
    </React.Fragment>
  );
}

export default OperationCenterInfo
