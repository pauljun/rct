/**
 * @desc 人脸图库
 */

import React from 'react'
import { Spin } from 'antd'
import Search from './search'
import _ from 'lodash'
const LittlePagtion = Loader.loadBusinessComponent('BaseLibComponents', 'LittlePagtion')
const List = Loader.loadBusinessComponent('BaseLibComponents', 'List')
const NoData = Loader.loadBaseComponent('NoData')
const Wrapper = Loader.loadBusinessComponent('BaseLibComponents', 'Wrapper')

@Decorator.businessProvider('wifi')
class wifiLibrary extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      list: [],
      loading: true
    }
  }
  componentWillMount(){
    const { searchData } = this.props.wifi
    this.mergeSearchData(Utils.getTimerArea(searchData.timerTabsActive))
  }

  /**
   * @desc 查询
   */
  search = () => {
    const { 
      page,
      pageSize,
      endTime,
      startTime,
      cameraIds,
      keyWord
    } = this.props.wifi.searchData
    let options = {
      page,
      pageSize,
      endTime,
      startTime,
      captureDeviceCids: !!cameraIds.length ? cameraIds.map(v => v.cid || v.id) : undefined,
      keyWord
    }
    Service.wifi.queryList(options)
      .then(result => {
        this.setState({
          list: result.result.list,
          loading: false,
          total: result.result.total
        })
      })
      .catch(() => {
        this.setState({loading: false})
      })
  }

  /**
   * @desc 修改查询条件
   * @param {Object} options 查询条件
   * @param {Boolean} needSearch 是否进行查询, 默认查询
   */
  mergeSearchData = (options, needSearch = true) => {
    this.props.wifi.mergeSearchData(options)
      .then(() => {
        if(needSearch){
          this.setState({loading: true})
          this.search()
        }
      })
  }

  /**
   * @desc 刷新
   */
  Refresh = () => {
    this.mergeSearchData(Utils.getTimerArea(this.props.wifi.searchData.timerTabsActive))
  }

  /**
   * @desc 重置
   */
  reset = () => {
    const { initSearch } = this.props.wifi 
    this.mergeSearchData(initSearch)
  }

  render() {
    const {
      list,
      total = 0,
      loading,
    } = this.state
    const {
      searchData
    } = this.props.wifi
    return (
      <Spin spinning={loading} wrapperClassName='baselib-spining'>
        <Wrapper className='wifi-wrapper' title='wifi资源库' reset={this.reset}>
          <Search 
            mergeSearchData={this.mergeSearchData}
            searchData={searchData}
          />
          <div className='baselib-list-wrapper'>
            {!!list.length 
              ? list.map(v => 
                <div className='box-item'>
                  <List data={v} type='wifi'></List>
                </div>
              )
              : <NoData />
            }
          </div>
          <div className='header-little-pagtion'>
            <LittlePagtion 
              onChange={this.mergeSearchData}
              searchData={searchData}
              Refresh={this.Refresh}
              total={total}
            />
          </div>          
        </Wrapper>
      </Spin>
    )
  }
}

export default wifiLibrary