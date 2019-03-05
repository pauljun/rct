import React from 'react'
import { Checkbox } from 'antd'
import { withRouter } from 'react-router-dom'

const { rowSize, itemHeight, itemSearchHeight, itemWidth, pdWidth } = Dict.map.baselibOptions
const NoData = Loader.loadBaseComponent('NoData')
const CheckboxGroup = Checkbox.Group
const InfiniteScrollLayout = Loader.loadBaseComponent('InfiniteScrollLayout')
const List = Loader.loadBusinessComponent('BaseLibComponents', 'List')

@withRouter
class ContentView extends React.Component {
  constructor(props){
    super(props);
    this.infiniteRef = React.createRef()
  }

  // 单个选中飞入动画
  checkItem = (e, item) => {
    const suffix = window.location.pathname.split('/')[1]
    const target = document.getElementsByClassName(`select-list-toggle1-${suffix}`)[0]
    const start = {
      clientX: e.clientX,
      clientY: e.clientY,
    }
    if(e.target.checked){
      Utils.animateFly({
        start,
        url: item[`${this.props.type}Url`],
        target,
        speed: 800,
        posFix: {
          top: 0,
          left: 10
        }
      })
    }
  }  
  /**
   * @desc 勾选
   */
  onChecked = checkedIds => {
    this.props.onChecked(checkedIds)
  }

  /**
   * @desc 获取列表高度
   */
  getItemHeight = () => {
    const { isSearch, type = 'face', size } = this.props
    let height = 0
    if(isSearch){
      if(type === 'vehicle'){
        height = itemSearchHeight[size] + 24
      }else{
        height = itemSearchHeight[size]
      }
    }else{
      if(type === 'vehicle'){
        height = itemSearchHeight[size]
      }else{
        height = itemHeight[size]
      }
    }
    return height
  }

  render(){
    const { 
      checkedIds = [],
      list = [],
      size,
      isSearch,
      loading,
      loadMore,
      searchData = {} ,
      count,
      type,
      goPage
    } = this.props
    return (
      <CheckboxGroup
        style={{width: '100%', height: '100%'}}
        onChange={this.onChecked} 
        value={checkedIds}     
      >
        <div className='baselib-list-wrapper'>
          {!!list.length ? <InfiniteScrollLayout
            count={count}
            rowSize={rowSize[size]}
            ref={this.infiniteRef}
            pdWidth={pdWidth[size]}
            itemWidth={itemWidth[size]}
            itemHeight={this.getItemHeight()}
            data={list}
            loadMore={loadMore}
            hasLoadMore={loading}
            hasBackTop={true}
            renderItem={(v, index) => 
              <List 
                data={v}
                size={size}
                searchData={searchData}
                type={type}
                detailModuleName={isSearch ? 'resourceSearchDetail' : `${type}LibraryDetail`}
                goPage={goPage}
              >
                {isSearch && <Checkbox 
                  className='item-check' 
                  value={v.id} 
                  disabled={v.latitude && v.longitude ? false : true} 
                  onClick={(e) => this.checkItem(e, v)}
                >
                </Checkbox>}
              </List>
            }
          /> : <NoData />}
        </div>
      </CheckboxGroup>
    )
  }
}

export default ContentView