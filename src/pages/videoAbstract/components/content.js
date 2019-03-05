import React, { Component } from 'react'
import Card from './card.js'
const NoData = Loader.loadBaseComponent('NoData');
const InfiniteScrollLayout = Loader.loadBaseComponent('InfiniteScrollLayout');

class Content extends Component {
  loadMore = () => {
    let { searchData, onChange, total, list} = this.props;
    if(total === list.length) {
      return;
    }
    searchData.offset += searchData.limit;
		onChange && onChange(searchData);
  }

  renderItem = (item, index) => {
    return (
      <div key={index}>
        <Card item={item}/>
      </div>
    )
  }

  render(){
    const { list, total, loading, listKey } = this.props;
    return (
      <div className='video-abstract-container'>
        {list.length > 0 
          ? <InfiniteScrollLayout 
              key={listKey}
              count={total}
              itemWidth={420}
              itemHeight={312}
              pdWidth={60}
              data={list}
              hasBackTop={true}
              loadMore={this.loadMore}
              hasLoadMore={!loading}
              renderItem={this.renderItem}
            /> 
          : <NoData imgType={2} title={'数据'}/>}
      </div>
    )
  }
}
export default Content