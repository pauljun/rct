import React from 'react';
import './index.less';

const AutoSizer = Loader.loadComponent('ReactVirtualized', null, 'AutoSizer');
const List = Loader.loadComponent('ReactVirtualized', null, 'List');

export default class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }
  componentWillUnmount(){
    this.listRef = null
  }
  forceUpdateGrid = () => {
    this.listRef.current && this.listRef.current.forceUpdateGrid();
  };
  
  // 渲染列表项
  rowRender = ({ key, index, style }) => {
    const { data, renderItem } = this.props;
    const item = data[index];
    return (
      <div key={key} style={style}>
        {renderItem(item)}
      </div>
    );
  };

  render() {
    const { data, rowHeight = 30, className = '' } = this.props;
    return (
      <div className={`list-layout ${className}`}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={data.length}
              rowHeight={rowHeight}
              rowRenderer={this.rowRender}
              ref={this.listRef}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
