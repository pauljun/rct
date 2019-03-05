import React from 'react'

const Timer = Loader.loadBusinessComponent('BaseLibComponents', 'Timer')
const PointSelect = Loader.loadBusinessComponent('BaseLibComponents', 'PointSelect')
const ColligateSearch = Loader.loadBusinessComponent('ColligateSearch')

export default class Search extends React.Component {
  /**
   * @desc 编辑查询条件
   */
  change = (options={}, needSearch = true) => {
    this.props.mergeSearchData(options, needSearch)
  }

  /**
   * @desc 切换时间Tabs
   */
  render(){
    const { searchData = {} } = this.props
    return (
      <div className='baselib-search-wrapper'>
        <div className='kw-search'>
          <ColligateSearch 
            width='100%'
            placeholder='请输入关键字搜索'
            onSearch={plateNo => this.change({ plateNo })}
          />
        </div>
        <div className='small-title'>资源筛选 :</div>
        <Timer 
          value={searchData.timerTabsActive}
          change={this.change}
          onOk={this.change}
          startTime={searchData.startTime}
          endTime={searchData.endTime}
        />
        <PointSelect 
          onChange={this.change}
          selectList={searchData.cameraIds}
        />
      </div>
    )
  }
}