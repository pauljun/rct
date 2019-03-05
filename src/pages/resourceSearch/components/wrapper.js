/**
 * @desc 以图搜图
 */

import React from 'react'
import { Spin, Checkbox, message } from 'antd'
import Search from './search'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import RightHeader from './RightHeader'
const List = Loader.loadBusinessComponent('BaseLibComponents', 'List')
const NoData = Loader.loadBaseComponent('NoData')
const Wrapper = Loader.loadBusinessComponent('BaseLibComponents', 'Wrapper')
const Pagination = Loader.loadBaseComponent('Pagination')
const imgSearchPageSizeOptions = [ '24', '36', '48', '72', '96' ]
const CheckboxGroup = Checkbox.Group
const structurError = '提取图片特征失败，请重新上传图片！'

@withRouter
@Decorator.businessProvider('baselibSearch', 'tab')
class searchLibrary extends React.Component {
  constructor(props){
    super(props)
    const pageState = props.location.state ? props.location.state.pageState : null
    this.type = 'face'
    // 查询类型 0: 以图搜图 1： 上传图片进行搜图
    this.searchType = 0 
    if(pageState){
      this.id = pageState.id
      this.type =pageState.type
    }
    this.state = {
      list: [],
      checkedIds: [],
      data: {},
      loading: pageState ? true : false,
      current: 1,
      pageSize: 24,
      url: ''
    }
  }
  componentWillMount(){
    const { location } = this.props
    this.suffix = location.pathname.split('/')[1]
    /**根据id获取详情 */
    if(this.id){
      this.getDataDetail()
      .then(res => {
        /**设置显示url */
        this.setState({ url: res.result[`${this.type}Path`] })
        this.mergeSearchData({
          ...location.state.pageState
        })
      })
    }else{
      this.mergeSearchData({
        timerTabsActive: 3, 
        ...Utils.getTimerArea(3)
      }, false)
    }
  }

  /**
   * @desc 根据id获取详情 
   */
  getDataDetail = () => {
    return Service[this.type].queryFeatureById({id: this.id})
      .then(res => {
        this.setState({data: res.result})
        return res
      })
  }

  /**
   * @desc 查询
   */
  search = () => {
    const { startTime, endTime, cameraIds, sex, score, id, features} = this.props.baselibSearch.searchData
    if(this.searchType && !features){
      this.setState({ loading: false })
      return message.error(structurError)
    }
    const type = this.type
    let options = {
      startTime,
      endTime,
      score,
      [`${type}Tags`]: sex ? [sex] : undefined,
      cameraIds: !!cameraIds.length ? cameraIds.map(v => v.cid.toString() || v.id.toString()) : undefined
    }
    options[`${type}Feature`] = this.searchType ? features.feature : this.state.data[`${type}Feature`]
    if(this.searchType){
      options.vids = features.vids
    }else{
      options.id = id
    }
    Service[type].queryFeatureList(options)
      .then(res => {
        this.setState({
          loading: false,
          list: res.result[type]
        })
      })
  }

  /**
   * @desc 修改查询条件
   * @param {Object} options 查询条件
   * @param {Boolean} needSearch 是否进行查询, 默认查询
   */
  mergeSearchData = (options, needSearch = true) => {
    this.props.baselibSearch.mergeSearchData(options)
      .then(() => {
        if(needSearch){
          this.setState({loading: true})
          this.search()
        }
      })
  }

  // 前端分页事件
  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize})
  }

  // 获取展示列表数据
  getListData = (list, current, pageSize) => {
    const startIdx = pageSize*(current - 1)
    const endIdx = pageSize*current
    const listData = list.slice(startIdx, endIdx)
    return listData
  }

  /**
   * @desc 查看详情
   */
  goPage = (id) => {
    const { tab, location, baselibSearch } = this.props
    const { startTime, endTime, timerTabsActive} = baselibSearch.searchData
    tab.goPage({
      moduleName: 'resourceSearchDetail',
      location,
      state: {
        list: this.state.list,
        searchData: {
          startTime,
          endTime,
          timerTabsActive
        },
        url: this.state.url,
        id,
        type: this.type
      }
    })
  }

  /**
   * @desc 重置
   */
  reset = () => {
    const { initSearch } = this.props.baselibSearch 
    this.searchType = 0
    this.mergeSearchData(initSearch)
  }

  onPageChange = (current, pageSize, type) => {
  }

  // 单个选中飞入动画
  checkItem = (e, item) => {
    const suffix = this.props.location.pathname.split('/')[1]
    const target = document.getElementsByClassName(`select-list-toggle1-${suffix}`)[0]
    const start = {
      clientX: e.clientX,
      clientY: e.clientY,
    }
    if(e.target.checked){
      Utils.animateFly({
        start,
        url: item.facePath || item.bodyPath,
        target,
        speed: 800,
        posFix: {
          top: 0,
          left: 10
        }
      })
    }
  }  

  /**
   * @desc 勾选
   */
  onChecked = checkedIds => {
    this.setState({checkedIds})
  }

  /**
   * @desc 图片检索成功
   */
  uploadChange = values => {
    if(!values.length){
      message.error(structurError)
    }
    this.searchType = 1
    this.mergeSearchData({
      features: values[0] ? values[0][this.type] : undefined
    })
  }

  render() {
    const {
      loading,
      list = [],
      pageSize,
      current,
      checkedIds = [],
      url
    } = this.state
    const {
      searchData
    } = this.props.baselibSearch
    const listData = this.getListData(list, current, pageSize)
    const type = this.type
    return (
      <Spin spinning={loading} wrapperClassName='baselib-spining'>
        <Wrapper 
          className='baselib-search-wrapper' 
          title={`${type === 'face' ? '人脸' : '人体'}以图搜图`} 
          reset={this.reset}
        >
          <Search 
            mergeSearchData={this.mergeSearchData}
            searchData={searchData}
            url={url}
            type={type}
            uploadChange={this.uploadChange}
          />
          <React.Fragment>
            <CheckboxGroup
              style={{width: '100%', height: '100%'}}
              onChange={this.onChecked} 
              value={checkedIds}
            >
              <div className='baselib-list-wrapper'>
                {!!listData.length 
                  ? listData.map(v => 
                    <div className='box-item'>
                      <Checkbox 
                        className='item-check' 
                        value={v.id} 
                        disabled={v.latitude && v.longitude ? false : true} 
                        onClick={(e) => this.checkItem(e, v)}
                      >
                      </Checkbox>
                      <List 
                        data={v}
                        type={type}
                        startTime={searchData.startTime}
                        endTime={searchData.endTime}
                        detailModuleName='resourceSearchDetail'
                        goPage={this.goPage}
                        timerTabsActive={searchData.timerTabsActive}
                      />
                    </div>
                  )
                  : <NoData title='以图搜图资源，请在左边上传图片搜索' />
                }
              </div>
              <Pagination 
                total={list.length}
                current={current}
                pageSize={pageSize}
                onChange={this.handlePageChange}
                pageSizeOptions={imgSearchPageSizeOptions}
              />
            </CheckboxGroup>
          </React.Fragment>
          <div className='header-little-pagtion'>
            <RightHeader
              type={type}
              list={list}
              suffix={this.suffix}
              listDataIds={listData.map(v => v.id)}
              onChecked={this.onChecked}
              checkedIds={checkedIds}
            />
          </div>          
        </Wrapper>
      </Spin>
    )
  }
}

export default searchLibrary