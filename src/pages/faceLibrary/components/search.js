import React from 'react'

const Timer = Loader.loadBusinessComponent('BaseLibComponents', 'Timer')
const SearchButton = Loader.loadBusinessComponent('BaseLibComponents', 'SearchButton')
const PointSelect = Loader.loadBusinessComponent('BaseLibComponents', 'PointSelect')
const RadioGroup = Loader.loadBusinessComponent('BaseLibComponents', 'RadioGroup')
const CheckGroup = Loader.loadBusinessComponent('BaseLibComponents', 'CheckGroup')
const ScoreSlider = Loader.loadBusinessComponent('BaseLibComponents', 'ScoreSlider')
let { sex, eyeGlass, bigDatePlaceType, generation } = Dict.map
export default class Search extends React.Component {
  constructor(props){
    super(props)
    this.sexArray = [].concat(sex,[{
      value: 'other',
      label: '其他'
    }])
  }
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
    const { searchData = {}, url = '', isSearch } = this.props
    return (
      <div className='baselib-search-wrapper'> 
        <SearchButton 
          type='face'
          url={url}
          change={this.change}
          changeUrl={this.props.changeUrl}
        />
        {isSearch && <ScoreSlider 
          value={searchData.score}
          change={this.change}
        />}
        <div className='small-title'>图库筛选 :</div>
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
        <RadioGroup
          data={this.sexArray}
          label='性别'
          iconFont='icon-Sex_Dark'
          value={searchData.sex}
          name='sex'
          change={this.change}
        />
        <RadioGroup
          data={generation}
          label='年龄段'
          iconFont='icon-Age_Main'
          value={searchData.generation}
          name='generation'
          change={this.change}
        />
        <RadioGroup
          data={eyeGlass}
          label='眼镜'
          value={searchData.eyeGlass}
          iconFont='icon-Control_Black_Main'
          name='eyeGlass'
          change={this.change}
        />        
        <CheckGroup 
          data={bigDatePlaceType}
          label='场所'
          value={searchData.placeType}
          iconFont='icon-Community_Main1'
          name='placeType'
          change={this.change}
        />
      </div>
    )
  }
}