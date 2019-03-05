import React, { Component } from 'react'
const RangePicker = Loader.loadBaseComponent('RangePicker')
const IconFont = Loader.loadBaseComponent('IconFont')
const PointSelect = Loader.loadBusinessComponent('BaseLibComponents', 'PointSelect')

class SearchComponent extends Component {

  handleDateChange = (type, value) => {
    type = type === 'startTime' ? 'beginTime' : type;
    this.onChange({[type]: value}, false);
  }

  handleDeviceChange = (data) => {
    this.onChange({ selectList: data.cameraIds })
  }

  onChange = (data={}, doSearch=true) => {
    const { onChange } = this.props;
    onChange && onChange(data, doSearch);
  }

  render(){
    const { searchData } = this.props
    const { beginTime, endTime, selectList = [] } = searchData;
    return (
      <div className='baselib-search-wrapper'>
        <div className='small-title'>摘要筛选 :</div>
        <div className='time-choose'>
          <div className='search-title'>
            <IconFont type="icon-Clock_Light"/>
            时间：
          </div>
          <RangePicker
            allowClear={false}
            maxDate={true}
            minDate={-30}
            startLabel='从'
            endLabel='到'
            divider={false}
            startTime={beginTime}
            endTime={endTime}
            onOk={this.onChange}
            onChange={this.handleDateChange}
          />
        </div>
        <PointSelect 
          onChange={this.handleDeviceChange}
          selectList={selectList}
        />
      </div>
    )
  }
}
export default SearchComponent