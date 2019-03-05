import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { Spin } from 'antd'
import Search from './components/search.js'
import Content from './components/content.js'
import moment from 'moment'
import './index.less';

const Wrapper = Loader.loadBusinessComponent('BaseLibComponents', 'Wrapper')
const TitleOptions = Loader.loadBusinessComponent('BaseLibComponents', 'TitleOptions')

@withRouter
@inject('tab')
class VideoAbstract extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false,
      listKey: Math.random,
      searchData: {
        beginTime: moment().subtract('days',3).valueOf(),
        endTime: new Date().getTime(),
        selectList: [],
        limit: 100,
        offset: 0
      }, // 搜索条件
      list: [],
      total: 0
    }
  }

  componentDidMount(){
    const { location } = this.props;
    const urlParams = Utils.queryFormat(location.search);
    if(!urlParams.pid) {
      return this.search();
    }
    LM_DB.get('parameter', urlParams.pid).then(result => {
      if(!result) {
        return this.search();
      }
      const selectList = result.data.devices;
      const searchData = selectList ? {selectList} : result.data;
      this.changeSearchData(searchData);
    })
  }

  changeSearchData = (data={}, doSearch=true, isReset=true) => {
    const searchData = Object.assign({}, this.state.searchData, data);
    this.setState({
      searchData,
    }, () => {
      doSearch && this.search(isReset)
    })
  }

  // 分页改变事件， 保留list数据，不改变参数
  onPaginatinoChange = (data) => {
    this.changeSearchData(data, true, false)
  }

  search = (isReset = true) => {
    const { searchData, list } = this.state;
    const { selectList, ...rest } = searchData;
    rest.cid = selectList.map(v => v.cid || v.id);
    this.setState({ loading: true });
    if(isReset) {
      // 搜索条件改变，重新记录参数
      const id = Utils.uuid();
      LM_DB.add('parameter', {
        id,
        data: searchData
      }).then(() => {
        this.goPage({
          moduleName: 'videoAbstract',
          isUpdate: true,
          data: { pid:id },
          action: 'replace'
        })
      })
    }
    Service.video.queryVideoAbstract(rest).then(res => {
      const newList = isReset ? res.data.list : [].concat(list, res.data.list);
      if(isReset) {
        this.setState({
          listKey: Math.random()
        })
      }
      this.setState({
        list: newList,
        total: res.data.total,
        loading: false
      })
    }).catch(err => {
      this.setState({ loading: false })
    })
  }

  goPage = options => {
    const { location ,tab } = this.props;
    tab.goPage({
      location,
      ...options
    });
  };

  render(){
    const { loading, list, searchData, total, listKey } = this.state
    return (
      <Spin spinning={loading} wrapperClassName='baselib-spining'>
        <Wrapper className='video-abstract' title='视频摘要'>
          <Search 
            searchData={searchData}
            onDateChange={this.onDateChange}
            onChange={this.changeSearchData}
          />
          <Content 
            listKey={listKey}
            list={list}
            total={total}
            searchData={searchData}
            onChange={this.onPaginatinoChange}
            loading={loading}
          />
          <TitleOptions 
            isSelect={false}
            Refresh={this.search}
          />
        </Wrapper>
      </Spin>
    )
  }
}
export default VideoAbstract
