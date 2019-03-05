import React from 'react'

import HeaderView from './components/header'
import { Spin } from 'antd'

const IconFont = Loader.loadBaseComponent('IconFont')
const NoData = Loader.loadBaseComponent('NoData')
const ImageMovieMap = Loader.loadBusinessComponent('ImageMovieMap')
const Wrapper = Loader.loadBusinessComponent('BaseLibDetails', 'Wrapper')
const List = Loader.loadBusinessComponent('BaseLibDetails', 'DetailList')
const PageDetails = Loader.loadBusinessComponent('PageDetails')
const pageSize = 6

export default 
class resourceSearchDetail extends React.Component {
  constructor(props){
    super(props)
    this.id = Utils.queryFormat(props.location.search).id
    this.state = {
      searchData: {},  
      loading: true,
      /**默认选中id */
      activeId: '',
      //所有数据
      list: [],          
      //页码
      current: 0,
      type: 'face',
      url: ''
    }
  }

  componentWillMount(){
    if(this.id){
      LM_DB.get('parameter', this.id)
      .then(data => {
        this.maxCurrent = Math.ceil(data.list.length / pageSize)
        let current = 0
        data.list.find((v,i) => {
          if(v.id === data.id){ current = parseInt(i / pageSize) }
        })
        this.setState({
          searchData: data.searchData,
          activeId: data.id,
          list: data.list,
          current,
          type: data.type,
          url: data.url,
          loading: false
        })
      }).catch(() => {
        this.setState({ loading: false });
      });
    }else{
      this.setState({
        loading: false
      })
    }
  }

  /**
   * @desc 上一页
   */
  getPreData = (activeId) => {
    const { current, list } = this.state
    const data = this.getListData(list, current - 1)
    this.setState({ 
      current: current - 1,
      activeId: activeId || data[data.length - 1].id
    })
  }

  /**
   * @desc 下一页
   * @param {String} type pre: 上一页 next: 下一页
   */
  getNextData = () => {
    const { current, list } = this.state
    const data = this.getListData(list, current + 1)
    this.setState({ 
      current: current + 1,
      activeId: data[0].id
    })
  }

  /**
   * @desc 点击切换
   */
  changeActiveId = (activeId, type) => {
    const { list, current } = this.state
    let data = this.getListData(list, current)
    if(!data.find(v => v.id === activeId)){
      if(type === 'pre'){
        this.getPreData(activeId)
      }
      if(type === 'next'){
        this.getNextData()
      }
    }else{
      this.setState({activeId})
    }
  }

  // 获取展示列表数据
  getListData = (list, current) => {
    const startIdx = pageSize*current
    const endIdx = pageSize*(current + 1)
    const listData = list.slice(startIdx, endIdx)
    return listData
  }

  renderContent(){
    const {
      loading,
      list,
      current,
      type,
      activeId,
      url
    } = this.state
    if(loading){
      return null
    }

    if(!!!list.length){
      return <NoData />
    }
    let activeIndex = 0
    const data = list.find((v, i) => { 
      if(v.id === activeId){
        activeIndex = i
      } 
      return v.id === activeId
    })
    //上一条数据
    const preData = list[activeIndex - 1]              
    //下一条第一条数据
    const nextData = list[activeIndex + 1]      
    const preList = this.getListData(list, current - 1)     
    const nextList = this.getListData(list, current + 1)
    const nowList = this.getListData(list, current)
    return (
      <React.Fragment>
        <HeaderView {...data} type={type} url={url} />
        <div className='picture-container'>
          {preData && <div className='nav-l'>
            <PageDetails 
              imgUrl={preData[`${type}Url`]}
              onChange={this.changeActiveId}
              id={preData.id}
              pageType='pre'
            />
          </div>}
          {nextData && <div className='nav-r'>
            <PageDetails 
              imgUrl={nextData[`${type}Url`]}
              id={nextData.id}
              onChange={this.changeActiveId}
            />
          </div>}
          <ImageMovieMap 
            type={type}
            data={data} 
            key={data.id} 
          />
        </div>
        <div className='footer-list-container'>
          {!!preList.length && <div className='cg l' onClick={() => this.getPreData()}><IconFont type='icon-Arrow_Big_Left_Main' /></div>}
          {!!nextList.length && <div className='cg r' onClick={() => this.getNextData()}><IconFont type='icon-Arrow_Big_Right_Main' /></div>}
          <div className={`detail-list-item ${nowList.length !== 6 ? 'less' : ''}`}>
            {nowList.map(v => 
                <List 
                  deviceName={v.deviceName}
                  score={parseInt(v.score)}
                  active={v.id === activeId ? true : false}
                  captureTime={v.captureTime}
                  onClick={() => this.changeActiveId(v.id)}
                  url={v[`${type}Url`]}
                />
              )
            }
          </div>
        </div>
      </React.Fragment>
    )
  }

  render(){
    const { loading } = this.state
    return (
      <Wrapper>
        <Spin spinning={loading}>
          <div style={{ width: '100%', height: '100%', minHeight: 400 }}>{this.renderContent()}</div>          
        </Spin>
      </Wrapper>
    )
  }
}