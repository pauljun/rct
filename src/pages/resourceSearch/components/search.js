import React from 'react'

const Timer = Loader.loadBusinessComponent('BaseLibComponents', 'Timer')
const PointSelect = Loader.loadBusinessComponent('BaseLibComponents', 'PointSelect')
const RadioGroup = Loader.loadBusinessComponent('BaseLibComponents', 'RadioGroup')
const ScoreSlider = Loader.loadBusinessComponent('BaseLibComponents', 'ScoreSlider')
const UploadView = Loader.loadBusinessComponent('BaseLibComponents', 'UploadSearch')
const { sex } = Dict.map

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
    const { searchData = {}, url = '', uploadChange, type } = this.props
    return (
      <div className='baselib-search-wrapper'>
        <UploadView 
          url={url}
          uploadChange={uploadChange}
          type={type}
        />
        <Timer 
          value={searchData.timerTabsActive}
          onOk={this.change}
          change={this.change}
          startTime={searchData.startTime}
          endTime={searchData.endTime}
        />
        <ScoreSlider
          iconFont='icon-Like_Dark'
          name='score'
          value={searchData.score}
          change={this.change}
        />
        <PointSelect 
          onChange={this.change}
          selectList={searchData.cameraIds}
        />
        <RadioGroup
          data={sex}
          label='性别'
          iconFont='icon-Sex_Dark'
          value={searchData.sex}
          name='sex'
          change={this.change}
        />      
      </div>
    )
  }
}