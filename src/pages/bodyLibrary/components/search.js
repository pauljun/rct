/**
 * @title 查询条件
 * @author 三波大佬
 */

import React from 'react'

const Timer = Loader.loadBusinessComponent('BaseLibComponents', 'Timer')
const SearchButton = Loader.loadBusinessComponent('BaseLibComponents', 'SearchButton')
const PointSelect = Loader.loadBusinessComponent('BaseLibComponents', 'PointSelect')
const RadioGroup = Loader.loadBusinessComponent('BaseLibComponents', 'RadioGroup')
const CheckGroup = Loader.loadBusinessComponent('BaseLibComponents', 'CheckGroup')
const ClothesColor = Loader.loadBusinessComponent('BaseLibComponents', 'ClothesColor')
const { generation, sex, head, bigDatePlaceType, upperColor, lowerColor, lowerTexture, upperTexture, goods } = Dict.map
const ScoreSlider = Loader.loadBusinessComponent('BaseLibComponents', 'ScoreSlider')

export default class Search extends React.Component {
  constructor(props){
    super(props)
    this.sexArray = [].concat(sex,[{
      value: 'other',
      label: '其他'
    }])
  }
  activeTabId = 'tlzj-' + Math.random()
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
          type='body'
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
        <ClothesColor
          label='衣服颜色'
          iconFont='icon-Theme_Main'
          valueUpper={searchData.upColor}
          nameUpper='upColor'
          valueLower={searchData.lowerColor}
          nameLower='lowerColor'
          change={this.change}
          activeTabId={this.activeTabId}
        />          
        <RadioGroup
          data={head}
          label='头部特征'
          value={searchData.head}
          iconFont='icon-Control_Black_Main'
          name='head'
          change={this.change}
        />        
        <RadioGroup
          data={upperTexture}
          label='上身纹理'
          iconFont='icon-Skin_Main'
          value={searchData.upperTexture}
          name='upperTexture'
          change={this.change}
        /> 
        <RadioGroup
          data={lowerTexture}
          label='下身类别'
          iconFont='icon-Pants_Dark'
          value={searchData.lowerTexture}
          name='lowerTexture'
          change={this.change}
        />                     
        <RadioGroup 
          data={goods}
          label='随身物品'
          iconFont='icon-Bag_Dark'
          value={searchData.goods}
          name='goods'
          change={this.change}
        />
        <CheckGroup 
          label='场所'
          data={bigDatePlaceType}
          value={searchData.placeType}
          iconFont='icon-Community_Main1'
          name='placeType'
          change={this.change}
        />          
      </div>
    )
  }
}