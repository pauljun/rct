import React from 'react'

const Timer = Loader.loadBusinessComponent('BaseLibComponents', 'Timer')
const PointSelect = Loader.loadBusinessComponent('BaseLibComponents', 'PointSelect')
const ColligateSearch = Loader.loadComponent('SearchInput')
const SearchButton = Loader.loadBusinessComponent('BaseLibComponents', 'SearchButton')
const VehicleColorView = Loader.loadBusinessComponent('BaseLibComponents', 'VehicleColor')
const PlateColorView = Loader.loadBusinessComponent('BaseLibComponents', 'PlateColor')
const SelectView = Loader.loadBusinessComponent('BaseLibComponents', 'Select')
const ScoreSlider = Loader.loadBusinessComponent('BaseLibComponents', 'ScoreSlider')

let { plateColor, vehicleBrands, vehicleClasses, vehicleColor } = Dict.map
vehicleBrands.unshift({
  value: null,
  label: '全部'
})
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
    const { searchData = {}, url = '', isSearch } = this.props
    return (
      <div className='baselib-search-wrapper'>
        <SearchButton 
          type='vehicle'
          url={url}
          change={this.change}
          changeUrl={this.props.changeUrl}
        />
        <div className='kw-search'>
          <ColligateSearch 
            width='100%'
            placeholder='请输入车牌号搜索'
            onChange={plateNo => this.change({ plateNo }, false)}
            onPressEnter={e => this.change({ plateNo: e.target.value })}
          />
        </div>
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
        <PlateColorView
          data={plateColor}
          label='车牌颜色'
          iconFont='icon-Brand_Dark'
          value={searchData.plateColor}
          name='plateColor'
          change={this.change}
        />        
        <VehicleColorView
          data={vehicleColor}
          label='机动车颜色'
          iconFont='icon-_CarAlarm'
          value={searchData.vehicleColor}
          name='vehicleColor'
          change={this.change}
        />
        <SelectView 
          data={vehicleBrands}
          label='车牌品牌'
          placeholder='请选择机动车品牌'
          iconFont='icon-Sign_Dark'
          value={searchData.vehicleBrands}
          name='vehicleBrands'
          change={this.change}
        />
        <SelectView 
          data={vehicleClasses}
          label='机动车类型'
          iconFont='icon-Type_Dark'
          placeholder='请选择机动车类型'
          value={searchData.vehicleClasses}
          name='vehicleClasses'
          change={this.change}
        />
      </div>
    )
  }
}