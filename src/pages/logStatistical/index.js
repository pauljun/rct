import React from 'react';
import StatisticalTab from './components/statisticalTab';
import { observer } from 'mobx-react';
import {withRouter} from 'react-router-dom'
import SearchForm from './components/searchForm';
import moment from 'moment'
import './index.less';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const WrapperView = Loader.loadBusinessComponent('SystemWrapper');
@withRouter
@Decorator.businessProvider('logStatistic')
@observer
class StatisticalView extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      loding: false,
      list: [],
      total: 0,
      timeActive: 7
    }
  }
  componentDidMount() {
    this.setTimeRange(7)
    this.getList()
  }
  //获取列表
  getList() {
    const { logStatistic } = this.props
    const { searchData } = logStatistic
    Service.logStatistics.queryList(searchData).then(res => {
      this.setState({
        list: res.result,
        total: res.result.length
      })
    })
  }
  // 修改store的searchData
  updateStoreSearchData = (data) => {
    const {logStatistic} = this.props;
    logStatistic.updateSearchData(data);
  }
  // 选时控件change
  timeChange = (type, value) => {
    const newDate = {}
    if (type === 'startTime') {
      newDate.begin = moment(new Date(value)).format(DATE_FORMAT)
    } else {
      newDate.end = moment(new Date(value)).format(DATE_FORMAT)
    }
    this.updateStoreSearchData(newDate);
    this.setState({
      timeActive: null
    })
  }

  // 切换统计时间
  setTimeRange = (value) => {
    const end = new Date();
    const begin = moment(end).subtract(value, 'days');
    this.updateStoreSearchData({
      begin: moment(begin).format(DATE_FORMAT),
      end: moment(end).format(DATE_FORMAT)
    })
    this.setState({
      timeActive: value
    })
  }
  // 切换统计类型
  setSearchType = (type) => {
    this.updateStoreSearchData({
      type
    })
    this.setTimeRange(this.state.timeActive)
    this.getList()
  }

  render() {
    const { list,total,timeActive } = this.state
    const { logStatistic } = this.props;
    const { searchData } = logStatistic;
    return (
      < WrapperView name = '数据统计' >
        <div className='logstatistical-view'> 
          < div className = 'logstatistical-title table-setting-title' >
            < SearchForm 
              doSearch = {() => this.getList()} 
              className = 'logstatistical-search-view' 
              setTimeRange={this.setTimeRange} 
              setSearchType={(typeValue) => this.setSearchType(typeValue)} 
              timeActive = {'22'}
              timeChange = {(type,value) => {this.timeChange(type,value)}}
            />
          </div>
          <div className="statistical-list">
            < StatisticalTab
              columnType={searchData.type-1}
              dataSource={list} 
              handleTableChange={this.handleTableChange}
              total={total}
              searchData={searchData}
              scroll={{ y: '100%' }}
            />
          </div>
        </div>
      </WrapperView>
    )
  }
}

export default StatisticalView