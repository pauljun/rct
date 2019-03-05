/**
 * @desc 人体图库
 * @author wwj
 * @modify tlzj
 */

 /**
 * @desc state 参数
 * @param {Array} list 列表数据
 * @param {Boolean} loading 加载状态
 * @param {String} size 图片查看状态  default: normal normal(默认) small(小)  large(大)
 * @param {Array} checkedIds 生成轨迹选中的id
 * @param {Array} this.searchType 查询类型 0: 以图搜图 1： 上传图片进行搜图
 */

import React from 'react'
import { Spin, message } from 'antd'
import { toJS } from 'mobx'
import Search from './search'
import { withRouter } from 'react-router-dom'

const Wrapper = Loader.loadBusinessComponent('BaseLibComponents', 'Wrapper')
const TitleOptions = Loader.loadBusinessComponent('BaseLibComponents', 'TitleOptions')
const RightHeader = Loader.loadBusinessComponent('BaseLibComponents', 'RightHeader')
const Content = Loader.loadBusinessComponent('ResourceComponents', 'Content')
const structurError = '提取图片特征失败，请重新上传图片！'

@withRouter
@Decorator.businessProvider('body', 'tab')
class bodyLibrary extends React.Component {
  constructor(props){
    super(props)
    this.urlParams = Utils.queryFormat(props.location.search)
    this.init = false
    this.state = {
      list: [],
      checkedIds: [],
      loading: true,
      size: 'normal',
      key: Math.random(),
      cKey: Math.random(),
      total: 0,
      url: ''
    }
  }

  componentWillMount(){
    this.suffix = this.props.location.pathname.split('/')[1]
    this.initUrlOptions()
  }

  /**
   * @desc 判断是否是上传图片搜图
   */
  getPictureBySearch = () => {
    return parseInt(this.urlParams.searchType, 10) === 1
  }

  /**
   * @desc 进行图片结构化
   */
  getFearture = url => {
    let isBase64 = false
    if (url && url.indexOf('data:image/png;base64') >= 0) {
      url = url.split(',')[1]
      isBase64 = true
    }else{
      url = BaseStore.user.systemConfig.domainAddress + url
    }
    return Service.body.getFeature({
      [isBase64 ? 'base64' : 'url']: url
    })
  }

  /**
   * @desc 根据url获取查询条件
   */
  initUrlOptions = () => {
    const { searchData } = this.props.body
    const options = this.urlParams
    if(options.id){
      LM_DB.get('parameter', options.id).then(result => {
        if(result && options.isSearch){
          // 以图搜图--上传图片搜图
          if(this.getPictureBySearch()){
            this.setState({
              url: result.url
            })
            this.getFearture(result.url).then(res => {
              if(!res.data.list.length){
                return message.warning(structurError)
              } 
              this.mergeSearchData({
                ...Utils.getTimerArea(searchData.timerTabsActive),
                bodyFeature: res.data.list,
              })
            }).catch(() => {
              message.warning(structurError)
              this.setState({
                loading: false
              })
            })
          }else{
            /**根据id获取详情 */
            this.getDataDetail()
            .then(res => {
              /**设置显示url */
              this.setState({ url: res.data.bodyUrl, key: Math.random() })
              this.mergeSearchData({
                ...Utils.getTimerArea(searchData.timerTabsActive),
                ...result.searchData, 
              })
            })
          }
        }else{
          result && this.mergeSearchData({
            ...result.data,
            ...Utils.getTimerArea(searchData.timerTabsActive)
          })
        }
      })
    }else{
      this.mergeSearchData(Utils.getTimerArea(searchData.timerTabsActive))
    }
  }

  /**
   * @desc 根据id获取详情 
   */
  getDataDetail = () => {
    return Service.body.bodies({id: this.urlParams.id})
      .then(res => {
        this.setState({data: res.data})
        return res
      })
  }

  /**
   * @desc 以图搜图查询判断-上传图片搜图和关联搜图处理
   */
  handleOptionsByType = options => {
    const { searchData } = this.props.body
    options.feature = this.getPictureBySearch()
    options.offset = 0
      ? searchData.bodyFeature[0].feature 
      : this.state.data.bodyFeature
    if(this.getPictureBySearch()){
      options.vids = searchData.bodyFeature[0].vids || undefined
    }else{
      options.id = this.urlParams.id
    }
    // 以图搜图增加相似度
    options.score = searchData.score
    return options
  }

  /**
   * @desc 查询
   */
  search = (isLoadMore = false) => {
    const { searchData } = this.props.body
    let options = Utils.bodyOptions(searchData)
    /**列表查询 */
    if(this.urlParams.isSearch){
      if(this.getPictureBySearch() && !searchData.bodyFeature.length){
        this.setState({ loading: false, list: [] })
        return message.error(structurError)
      } 
      this.handleOptionsByType(options)    
      /**以图搜图 */
      Service.body.queryBodiesByFeature(options)
        .then(res => {
          this.setState({
            loading: false,
            list: res.data.list
          })
          this.init = true
        }).catch(err => {
          message.error('查询失败')
          this.setState({loading: false})
        })
    }else{
      Promise.all([
        Service.body.queryBodies(options),
        Service.body.countBodies(options)
      ]).then(results => {
        let list = []
        if(isLoadMore){
          list = this.state.list
        }
        this.setState({
          list: list.concat(results[0].data.list), 
          loading: false,
          total: results[1].data.count
        })
        this.init = true
      })
      .catch(() => {
        this.setState({loading: false})
      })
    }
  }

  /**
   * @desc 修改查询条件
   * @param {Object} options 查询条件
   * @param {Boolean} needSearch 是否进行查询, 默认查询
   */
  mergeSearchData = (options, needSearch = true, needReplace = false) => {
    if(!options.minId){
      options.minId = ''
    }
    return this.props.body.mergeSearchData(options)
      .then(() => {
        if(needSearch){
          this.setState({loading: true})
          this.search()
          if(needReplace){
            this.setState({cKey: Math.random()})
            const id = Utils.uuid()
            LM_DB.add('parameter', {
              id,
              data: toJS(this.props.body.searchData)
            }).then(() => {
              this.props.tab.goPage({
                moduleName: 'bodyLibrary',
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
   * @desc 刷新
   */
  Refresh = () => {
    this.mergeSearchData(Utils.getTimerArea(this.props.body.searchData.timerTabsActive))
  }

  /**
   * @desc 重置
   */
  reset = () => {
    const { initSearch } = this.props.body 
    this.mergeSearchData(initSearch)
  }

  /**
   * @desc 勾选
   */
  onChecked = checkedIds => {
    const infiniteRefCurrent = this.refContent.infiniteRef.current
    this.setState({checkedIds}, () => infiniteRefCurrent && infiniteRefCurrent.forceUpdateGrid())
  }

  /**
   * @desc 滚动加载
   */
  loadMore = () => {
    const { list } = this.state
    if(!this.init){
      return
    }
    this.mergeSearchData({
      minId: list[list.length - 1].id
    }, false).then(() => 
      this.search(true)
    )
  }

  /**
   * @desc 切换图片显示大小
   */
  changesize = size => {
    this.setState({size, cKey: Math.random()})
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
      this.getFearture(url).then(res => {
        if(!res.data.list.length){
          return message.warning(structurError)
        } 
        this.mergeSearchData({
          bodyFeature: res.data.list || [],
        })
      })
    }
  }

  /**
   * 人体搜图详情跳转
   */
  goPage = (id) => {
    const { tab, location, body } = this.props
    LM_DB.add('parameter', {
      list: this.state.list,
      searchData: Utils.bodyOptions(body.searchData),
      url: this.state.url,
      id,
      type: 'body'
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
      loading,
      size,
      url,
      key,
      checkedIds,
      total,
      cKey
    } = this.state
    const {
      searchData
    } = this.props.body
    const isSearch = this.urlParams.isSearch
    const count = isSearch ? list.length : total
    let listDataIds = []
    list.map(v => {
      if(v.latitude && v.longitude){
        listDataIds.push(v.id)
      }
      return v
    })
    return (
      <Spin spinning={loading} wrapperClassName='baselib-spining'>
        <Wrapper className='body-wrapper' reset={this.reset} title='人体图库'>
          <Search 
            mergeSearchData={values => this.mergeSearchData(values, true, true)}
            searchData={searchData}
            url={url}
            key={key}
            isSearch={isSearch}
            changeUrl={this.changeUrl}
          />
          <Content 
            count={count}
            list={list}
            wrappedComponentRef={refContent => this.refContent = refContent}
            loading={!loading}
            onChecked={this.onChecked}
            loadMore={this.loadMore}
            size={size}
            searchData={searchData}
            isSearch={isSearch}
            key={cKey}
            type='body'
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
                type='body'
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

export default bodyLibrary