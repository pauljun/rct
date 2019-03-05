import React from 'react';

const InfiniteScrollLayout = Loader.loadBaseComponent(
  'InfiniteScrollLayout'
);

@Decorator.businessProvider('device')
class Test extends React.Component {
  data = [1, 2, 3, 4, 5, 6, 7, 8, 9,0,1, 2, 3, 4, 5, 6, 7, 8, 9,0]
  loadMore = page => {
    this.data = this.data.concat(this.data)
    if(this.data.length > 101){
      this.data = this.data.slice(0,101)
    }
    this.forceUpdate()
  };
  render() {
    // return null
    return (
      <InfiniteScrollLayout
        count={101}
        rowSize={2}
        data={this.data}
        height={300}
        loadMore={this.loadMore}
        renderItem={(item, index) => <div style={{background:'red'}}>{item}-{index}</div>}
      />
    );
  }
}

export default Test;
