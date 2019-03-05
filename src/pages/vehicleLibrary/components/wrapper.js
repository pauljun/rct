/**
 * @desc 机动车图库
 * @modify tlzj 2019-1-22
 * @modify tlzj 2019-3-04
 */

 /**
 * @desc state 参数
 * @param {Array} list 列表数据
 * @param {Boolean} loading 加载状态
 * @param {String} size 图片查看状态  default: normal normal(默认) small(小)  large(大)
 * @param {Boolean} isSearch 是否是以图搜图
 * @param {Array} checkedIds 生成轨迹选中的id
 * @param {Array} this.searchType 查询类型 0: 以图搜图 1： 上传图片进行搜图
 */

import React from 'react'
import { Spin, message } from 'antd'
import Search from './search'
import _ from 'lodash'
import { toJS } from 'mobx'
import { withRouter } from 'react-router-dom'
const Content = Loader.loadBusinessComponent('ResourceComponents', 'Content')
const Wrapper = Loader.loadBusinessComponent('BaseLibComponents', 'Wrapper')
const RightHeader = Loader.loadBusinessComponent('BaseLibComponents', 'RightHeader')
const TitleOptions = Loader.loadBusinessComponent('BaseLibComponents', 'TitleOptions')
const structurError = '提取图片特征失败，请重新上传图片！'

@withRouter
@Decorator.businessProvider('vehicle', 'tab')
class vehicleLibrary extends React.Component {
  constructor(props){
    super(props)
    this.urlParams = Utils.queryFormat(props.location.search)
    this.state = {
      list: [],
      loading: true,
      total: 0, // 当前条件下数据总数
      size: 'normal',
      url: '',
      key: Math.random(),
      cKey: Math.random(),
      checkedIds: []
    }
  }
  componentWillMount(){
    const options = this.urlParams
    this.suffix = this.props.location.pathname.split('/')[1]
    const { searchData } = this.props.vehicle
    if(options.id){
      LM_DB.get('parameter',options.id)
      .then(result => {
        if(result && options.isSearch){
          // 如果是搜图
          if(this.getPictureBySearch()){
            // 搜图 --- 上传图片
            this.mergeSearchData({
              url: result.url
            })
            this.setState({
              url: result.url
            })
          }else{
            // 关联搜图 --- imgId
            this.mergeSearchData({
              ...result.searchData,
              //id: options.id
            })
            this.setState({
              url: result.data.vehicleUrl,
              key: Math.random()
            }, () => {
              console.log('imgID97987979889798')
            })
          }
        }else{
          // 用户带缓存参数进入（非搜图），普通列表展示
          this.mergeSearchData({
            ...result.data,
            //...Utils.getTimerArea(searchData.timerTabsActive)
          })
        }
      })
    }else{
      // 列表查询
      this.mergeSearchData(Utils.getTimerArea(searchData.timerTabsActive))
    }
  }

  /**
   * @desc 根据url获取查询条件
   */
  initUrlOptions = params => {
    const { score, url } = this.props.vehicle.searchData
    const options = this.urlParams
    //根据id查询
    if(options.isSearch && !this.getPictureBySearch()){
      params.imgId = options.id
    }
    //以图搜图
    if(options.isSearch && this.getPictureBySearch()){
      if(url && url.indexOf('data:image/png;base64') >= 0){
        params.base64 = url.split(',')[1]
      }else{
        params.url = BaseStore.user.systemConfig.domainAddress + url
      }
    }
    params.score = score
    return params
  }

  /**
   * @desc 判断是否是上传图片搜图
   */
  getPictureBySearch = () => {
    return parseInt(this.urlParams.searchType, 10) === 1
  }

  /**
   * @desc 查询
   */
  search = (isLoadMore = false) => {
    // 对机动车数据进行处理
    const { searchData } = this.props.vehicle
    let options = Utils.vehicleOptions(searchData)
    let serviceName = 'queryPassRecords'
    /**列表 总资源 */
    if(this.urlParams.isSearch){
      options = this.initUrlOptions(options)
      serviceName = 'queryVehiclePictures'
    }
    this.setState({
      loading: true
    })
    Service.vehicle[serviceName](options)
      .then(result => {
        let list = []
        if(isLoadMore){
          list = this.state.list
        }
        this.setState({
          list: (result.data.list || []).concat(list),
          loading: false,
          total: result.data.total,
          cKey: Math.random()
        })
      })
      .catch(() => {
        if(serviceName === 'queryVehiclePictures'){
          message.error(structurError)
          this.setState({
            loading: false,
            list: []
          })
          return 
        }
        this.setState({loading: false})
      })
  }

  /**
   * @desc 修改查询条件
   * @param {Object} options 查询条件
   * @param {Boolean} needSearch 是否进行查询, 默认查询
   * @param {Boolean} needReplace 是否存储indexDB
   */
  mergeSearchData = (options, needSearch = true, needReplace = false) => {
    if(!options.minId){
      options.minId = undefined
    }
    console.log(options, '=====')
    return this.props.vehicle.mergeSearchData(options)
      .then(() => {
        if(needSearch){
          this.setState({loading: true})
          this.search()
          if(needReplace){
            const id = Utils.uuid()
            this.setState({cKey: Math.random()})
            console.log(toJS(this.props.vehicle.searchData), 'toJS(this.props.vehicle.searchData)')
            LM_DB.add('parameter', {
              id,
              data: toJS(this.props.vehicle.searchData)
            }).then(() => {
              this.props.tab.goPage({
                moduleName: 'vehicleLibrary',
                location: this.props.location,
                isUpdate: true,
                data: {id},
                action: 'replace'
              })
            })
          }
        }
      })
  }

  /**
   * @desc 判断是否是上传图片搜图
   */
  getPictureBySearch = () => {
    return parseInt(this.urlParams.searchType, 10) === 1
  }

  /**
   * @desc 刷新
   */
  Refresh = () => {
    this.mergeSearchData(Utils.getTimerArea(this.props.vehicle.searchData.timerTabsActive))
  }

    /**
   * @desc 重置
   */
  reset = () => {
    const { initSearch } = this.props.vehicle 
    this.mergeSearchData(initSearch)
  }

  /**
   * @desc 切换图片显示大小
   */
  changesize = size => {
    this.setState({size, cKey: Math.random()})
  }

  /**
   * @desc 滚动加载
   */
  loadMore = () => {
    //const { limit, offset } = this.props.vehicle.searchData
    const { list } = this.state
    console.log('list', list , list[list.length - 1].id)
    this.mergeSearchData({
      minId: list[list.length - 1].id
    }, false).then(() => 
      this.search(true)
    )
  }
  
  /**
   * @desc 以图搜图切换图片(包含截图搜索)
   */
  changeUrl = url => {
    // url改变后切换为上传图片搜图类型
    this.urlParams.searchType = 1
    this.setState({
      url
    })
    if(!url){
      this.urlParams.isSearch = false
      this.mergeSearchData({})
    }else{
      this.mergeSearchData({
        url
      })
    }
  }

  /**
   * @desc 勾选
   */
  onChecked = checkedIds => {
    const infiniteRefCurrent = this.refContent.infiniteRef.current
    this.setState({checkedIds}, () => infiniteRefCurrent && infiniteRefCurrent.forceUpdateGrid())
  }

  /**
   * 车辆以图搜图详情
   */
  goPage = (id) => {
    const { tab, location, vehicle } = this.props
    LM_DB.add('parameter', {
      list: this.state.list,
      searchData: Utils.faceOptions(vehicle.searchData),
      url: this.state.url,
      id,
      type: 'vehicle'
    }).then(() => {
      tab.goPage({
        moduleName: 'resourceSearchDetail',
        location,
        data: {id}
      })
    })
  }

  render() {
    const {
      list,
      total = 0,
      loading,
      size,
      cKey,
      url,
      key,
      checkedIds
    } = this.state
    const {
      searchData
    } = this.props.vehicle
    const isSearch = this.urlParams.isSearch
    let listDataIds = []
    list.map(v => {
      if(v.latitude && v.longitude){
        listDataIds.push(v.id)
      }
      return v
    })
    console.log(toJS(searchData), 'searchDatasearchDatasearchData')
    return (
      <Spin spinning={loading} wrapperClassName='baselib-spining'>
        <Wrapper className='vehicle-wrapper' title='机动车图库' reset={this.reset}>
          <Search 
            mergeSearchData={values => this.mergeSearchData(values, true, true)}
            searchData={searchData}
            key={key}
            url={url}
            isSearch={isSearch}
            changeUrl={this.changeUrl}
          />
          <Content 
            count={total}
            list={list}
            wrappedComponentRef={refContent => this.refContent = refContent}
            loading={!loading}
            onChecked={this.onChecked}
            loadMore={this.loadMore}
            searchData={searchData}
            size={size}
            isSearch={isSearch}
            key={cKey}
            type='vehicle'
            checkedIds={checkedIds}
            goPage={this.goPage}
          />
          <div className='header-little-pagtion'>
            <TitleOptions 
              onChange={this.changesize}
              value={size}
              Refresh={this.Refresh}
            />
            {isSearch && 
              <RightHeader 
                type='vehicle'
                list={list}
                suffix={this.suffix}
                listDataIds={listDataIds}
                onChecked={this.onChecked}
                checkedIds={checkedIds}
              />
            }      
          </div>          
        </Wrapper>
      </Spin>
    )
  }
}

export default vehicleLibrary