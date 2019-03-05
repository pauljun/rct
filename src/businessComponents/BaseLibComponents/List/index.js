/**
 * @author wwj
 * @createTime 2019-1-7
 * @update wwj
 * @updateTime 2019-1-9
 */

import React from 'react'
import { Tooltip } from 'antd'
import { withRouter } from 'react-router-dom'
import './index.less'

const WaterMarkView = Loader.loadBusinessComponent('WaterMarkView')
const IconFont = Loader.loadBaseComponent('IconFont')
const AuthComponent = Loader.loadBusinessComponent('AuthComponent');

@withRouter
@Decorator.businessProvider('tab')
class List extends React.Component {

  /**
   * @desc 获取关联人脸人体icon
   */
  getIconByType = () => {
    const { type = 'face', data = {}} = this.props
    let iconType = ''
    switch(type){
      case 'face':
        iconType = data.hasBody ? 'icon-Body_Main' : null
        break
      case 'body':
        iconType = data.hasFace ? 'icon-Face_Main' : null
        break
      default: 
        break
    }
    return (
      iconType 
      ? <AuthComponent actionName={type === 'face' ? 'bodyLibrary' : 'faceLibrary'}><IconFont 
          type={iconType} 
        /></AuthComponent>
      : null
    )
  }

  /**
   * @desc 跳转关联查询
   * @param {Number} mode 1: 关联人脸 2: 关联人体
   */
  goPage = mode => {
    const { tab, location, data, type = 'face', searchData={} } = this.props
    const { startTime, endTime, timerTabsActive } = searchData
    let id = data.id, moduleName = 'faceLibrary'
    if(type === 'face' && mode === 2){
      moduleName = 'bodyLibrary'
    }
    if(type === 'body' && mode === 2){
      moduleName = 'bodyLibrary'
    }
    if(type === 'vehicle'){
      moduleName = 'vehicleLibrary'
    }
    LM_DB.add('parameter', {
      id,
      searchData: {
        startTime,
        endTime,
        timerTabsActive,
      },
      data
    }).then(() => {
      tab.goPage({
        moduleName,
        location,
        data: {
          id,
          isSearch: true,
          searchType: 0
        }
      })
    })
  }

  goPersonDetail = () => {
    const { data, tab, location } = this.props;
    Service.person.queryRecentAppearanceByAids({aids: [data.aid]}).then(res => {
      let data = res.data[0];
      if(data && data.isPerson) {
        tab.goPage({
          moduleName: 'objectMapPersonnelDetailPloy',
          location,
          data: { id: data.personId }
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
  /**
   * @desc 获取关联检索
   */
  getAssociationRetrieval = () => {
    const { data, type = 'face', personMap=true } = this.props
    const FaceIcon = <AuthComponent actionName='faceLibrary'><Tooltip title='关联人脸' onClick={() => this.goPage(1)}><IconFont type='icon-Face_Main'/></Tooltip></AuthComponent>
    const BodyIcon = <AuthComponent actionName='bodyLibrary'><Tooltip title='关联人体' onClick={() => this.goPage(2)}><IconFont type='icon-Body_Main'/></Tooltip></AuthComponent>
    const CarIcon = <Tooltip title='车辆检索' onClick={() => this.goPage(3)}><IconFont type='icon-Car_Main'/></Tooltip>
    const PersonIcon = <Tooltip title='人员档案' onClick={this.goPersonDetail}><IconFont type='icon-Often_Dark'/></Tooltip>
    let templete = []
    switch(type){
      case 'face':
        templete.push(FaceIcon)
        !!data.hasBody && templete.push(BodyIcon)
        break
      case 'body':
        templete.push(BodyIcon)
        !!data.hasFace && templete.push(FaceIcon)
        break
      case 'vehicle':
        templete.push(CarIcon)
        break
      default:
        break
    }
    if(personMap && data.aid) {
      templete.push(PersonIcon)
    }
    return (
      templete ? <div className='search-btn-group'>
        {templete}    
      </div> : null
    )
  }

  /**
   * @desc 获取显示内容
   */
  getFooterComponent = () => {
    const { data, type = 'face' } = this.props
    let score = data.score
    if(score){
      if(score >= 100){ 
        score = 99 
      }
      else{
        score = score.toString().substring(0, 2)
      }
    }
    return (
      <div className='footer'>
        {type === 'vehicle' && <div className='item car-name'>
          <IconFont type='icon-Brand_Dark' />
          {data.plateNo || '-'}
        </div>}
        {!!data.score && <div className='item'>
          <IconFont type='icon-Like_Dark' />
          <span className='info-value'>
            相似度  
            <span className='slide-box'><span style={{width: score + '%'}}></span></span>
            <span className='highlight'>{ score}%</span>
          </span>
        </div>}
        <div className='item' title={data.deviceName}>
          <IconFont type='icon-Add_Main' />
          {data.deviceName}
        </div>
        <div className='item'>
          <IconFont type='icon-Clock_Main2' />
          {Utils.formatTimeStamp(data.captureTime)}
        </div>  
        {this.getAssociationRetrieval()}
      </div>
    )
  }

  /**
   * @desc 获取图片Url
   */
  getUrlPath = () => {
    const { type = 'face', data } = this.props
    return data[`${type}Url`]
  }

  /**
   * @desc 查看详情
   */
  goDetail = () => {
    let { tab, location, detailModuleName = 'faceLibraryDetail', data, searchData, type, hasDetail = true, goPage } = this.props
    if(!hasDetail){
      return
    }
    if(detailModuleName === 'resourceSearchDetail'){
      return goPage(data.id)
    }
    window.LM_DB.add('parameter', {
      id: data.id.toString(),
      data,
      searchData: Utils[`${type}Options`](searchData)
    }).then(function(){
      tab.goPage({
        moduleName: detailModuleName,
        location,
        data: {
          id: data.id
        }
      })
    })
  }

  render(){
    const { size = 'normal', children } = this.props
    return (
      <div className={`baselib-list-item size-${size}`}>
        <div className='content'>
          <div 
            className='sence-bg'
            onClick={this.goDetail}
          >
            <WaterMarkView 
              src={this.getUrlPath()}
            />     
            {this.getIconByType()}
          </div>
        </div>
        {this.getFooterComponent()}
        {children}
      </div>
    )
  }
}

export default List