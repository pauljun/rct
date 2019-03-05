import React from 'react'

import HeaderView from './components/header'
import { Spin } from 'antd'

const IconFont = Loader.loadBaseComponent('IconFont')
const NoData = Loader.loadBaseComponent('NoData')
const ImageMovieMap = Loader.loadBusinessComponent('ImageMovieMap')
const Wrapper = Loader.loadBusinessComponent('BaseLibDetails', 'Wrapper')
const List = Loader.loadBusinessComponent('BaseLibDetails', 'DetailList')
const PageDetails = Loader.loadBusinessComponent('PageDetails')
const limit = 6

export default 
class faceLibraryDetail extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      searchData: {},  
      loading: true,
      //默认选中id
      activeId: '',           
      //上一页数据
      preList: [],             
      //当前页数据         
      nowList: [],       
      //下一页数据      
      nextList: []                      
    }
  }
  componentWillMount(){
    const { location } = this.props;
    const { id } = Utils.queryFormat(location.search);
    window.LM_DB.get(
      'parameter', 
      id
    ).then(data => {
      if(!data){
        return 
      }
      this.setState({
        searchData: data.searchData,
        activeId: data.id,
        nowList: [data.data]
      })
      /**获取当前页 */
      this.queryFaces({
        minId: data.id,
        pageType: 2,
        limit: 5
      }).then(res => {
        Promise.all([
          this.queryFaces({
            minId: data.id,
            currentPage: 2,
            pageType: 2,
            limit
          }),
          this.queryFaces({
            maxId: data.id,
            limit,
            pageType: 1
          })
        ]).then(list => {
          this.setState({
            nowList: [data.data].concat(res),
            preList: list[1],
            nextList: list[0],
            loading: false
          })
        })
      })
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  changePageId = id => {
    const { preList, nowList, nextList, searchData } = this.state
    const allData = preList.concat(nowList).concat(nextList)
    LM_DB.add('parameter', {
      id, 
      data: allData.find(v => v.id === id),
      searchData
    }).then(() => {
      BaseStore.tab.goPage({
        moduleName: 'faceLibraryDetail',
        active: 'replace',
        isUpdate: true,
        data: {id}
      })
    })
  }

  /**
   * @desc 获取上一页数据
   */
  getPreData = (activeId) => {
    this.setState({ loading: true })
    const { preList, nowList } = this.state
    this.queryFaces({
      maxId: preList[0].id,
      pageType: 1,
      limit
    }).then(list => {
      this.setState({
        nextList: nowList,
        nowList: preList,
        preList: list,
        activeId: activeId || preList[0].id,
        loading: false
      })
    })
  }

  /**
   * @desc 翻到下一页数据
   * @param {String} type pre: 上一页 next: 下一页
   */
  getNextData = () => {
    this.setState({ loading: true })
    const { nextList, nowList } = this.state
    this.queryFaces({
      minId: nextList[nextList.length - 1].id,
      pageType: 2,
      limit
    }).then(list => {
      this.setState({
        nextList: list,
        nowList: nextList,
        preList: nowList,
        activeId: nextList[0].id,
        loading: false
      })
    })
  }

  /**
   * @desc 点击切换
   */
  changeActiveId = (activeId, type) => {
    this.changePageId(activeId)
    if(!this.state.nowList.find(v => v.id === activeId)){
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

  /**
   * @desc 列表查询
   * @param {Object} options
   */
  queryFaces = (options = {}) => {
    let searchData = Object.assign({}, this.state.searchData)
    if(options.pageType === 1){
      searchData.minId = undefined
    }
    return Service.face.queryFaces({...searchData, ...options})
      .then(res => {
        return res.data.list
      })
  }

  renderContent(){
    const {
      loading,
      activeId,
      nowList,
      preList,
      nextList
    } = this.state
    if(loading){
      return null
    }

    if(!!!nowList.length){
      return <NoData />
    }
    const data = nowList.find(v => v.id === activeId) || {}
    //所有列表数据
    const allData = preList.concat(nowList).concat(nextList)
    let index = 0
    allData.find((v, i) => {
      if(v.id === activeId){
        index = i
      }
    })
    //上一条数据
    const preData = allData[index - 1]              
    //下一条第一条数据
    const nextData = allData[index + 1]     
    return (
      <React.Fragment>
        <HeaderView {...data}/>
          <div className='picture-container'>
            {preData && <div className='nav-l'>
              <PageDetails 
                imgUrl={preData.faceUrl}
                onChange={this.changeActiveId}
                id={preData.id}
                pageType='pre'
              />
            </div>}
            {nextData && <div className='nav-r'>
              <PageDetails 
                imgUrl={nextData.faceUrl}
                id={nextData.id}
                onChange={this.changeActiveId}
              />
            </div>}
            <ImageMovieMap type="face" data={data} key={data.id} />
          </div>
          <div className='footer-list-container'>
            {!!preList.length && <div className='cg l' onClick={() => this.getPreData()}><IconFont type='icon-Arrow_Big_Left_Main' /></div>}
            {!!nextList.length && <div className='cg r' onClick={() => this.getNextData()}><IconFont type='icon-Arrow_Big_Right_Main' /></div>}
            <div className={`detail-list-item ${nowList.length !== 6 ? 'less' : ''}`}>
              {nowList.map(v => 
                  <List 
                    deviceName={v.deviceName}
                    active={activeId === v.id ? true : false}
                    captureTime={v.captureTime}
                    onClick={() => this.changeActiveId(v.id)}
                    url={v.faceUrl}
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