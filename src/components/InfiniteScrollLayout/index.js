import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Tooltip } from 'antd';

import './index.scss';

const AutoSizer = Loader.loadComponent('ReactVirtualized', null, 'AutoSizer');
const List = Loader.loadComponent('ReactVirtualized', null, 'List');
const InfiniteLoader = Loader.loadComponent('ReactVirtualized', null, 'InfiniteLoader');
const IconFont = Loader.loadBaseComponent('IconFont');

class InfiniteScrollLayout extends React.Component {
  static propTypes = {
    itemWidth: PropTypes.number.isRequired, //用于计算一行能放多少个，它的值不会用于宽度
    itemHeight: PropTypes.number.isRequired, // 用于计算滚动条的高度
    height: PropTypes.number, //容器高度
    count: PropTypes.number.isRequired, // 数据的总数
    data: PropTypes.array.isRequired,
    loadMore: PropTypes.func, //加载更多的方法，次方法应该修改props.data
    renderItem: PropTypes.func,
    rowClass: PropTypes.string,
    itemClass: PropTypes.string
  };
  static defaultProps = {
    itemWidth: 300,
    itemHeight: 200,
    height: 500
  };
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.scrollEle = React.createRef();
    this.renderData = [];
    this.infiniteRef = React.createRef();
    this.state = {
      isInit: false,
      showBackTop: false,
      rowSize: 1
    };
  }
  componentDidMount() {
    const { itemWidth, pdWidth = 0 } = this.props;
    const rowSize = Math.floor((this.scrollEle.current.offsetWidth - pdWidth * 2) / itemWidth);
    this.setState({ rowSize, isInit: true });
    window.addEventListener('resize', this.bindResizeEvent, false);
  }
  componentWillUnmount() {
    this.listRef = null;
    this.renderData = null;
    this.scrollEle = null;
    window.removeEventListener('resize', this.bindResizeEvent, false);
  }

  forceUpdateGrid() {
    this.infiniteRef.current && this.infiniteRef.current._registeredChild.forceUpdateGrid();
  }

  scrollToPosition(...args) {
    this.infiniteRef.current && this.infiniteRef.current._registeredChild.scrollToPosition(...args);
  }

  bindResizeEvent = () => {
    const { itemWidth, pdWidth = 0 } = this.props;
    const rowSize = Math.floor((this.scrollEle.current.offsetWidth - pdWidth * 2) / itemWidth);
    this.setState({ rowSize });
  };

  loadMore = ({ stopIndex }) => {
    const { loadMore, data, count, hasLoadMore = true } = this.props;
    if (stopIndex > this.renderData.length - 5 && count > data.length && hasLoadMore) {
      loadMore && loadMore();
    }
  };
  onScroll = options => {
    this.setState({ showBackTop: options.scrollTop > 200 });
    this.props.onScroll && this.props.onScroll(options);
  };

  // 渲染列表项
  rowRender = ({ key, index, style }) => {
    const { renderItem, renderSkeleton, rowClass = '', itemClass = '', pdWidth = 0, itemWidth, itemHeight } = this.props;
    const { rowSize } = this.state;
    let rowData = this.renderData[index];
    let len = rowSize - (Array.isArray(rowData) ? rowData.length : 0);
    let flag = true;
    if (!rowData) {
      rowData = [];
      flag = false;
    }
    if (rowData.length < rowSize) {
      for (let i = 0; i < len; i++) {
        rowData.push(null);
      }
    }
    return (
      <div key={key} style={{ padding: `0`, ...style }} className={`row-group-part ${rowClass}`}>
        {rowData.map((v, i) => (
          <div key={`${key}-${i}`} className={`row-item-part ${!flag ? 'row-item-placeholder' : ''} ${v !== null ? itemClass : ''}`} style={{ width: itemWidth, height: itemHeight }}>
            <Spin style={{ width: itemWidth, height: itemHeight }} spinning={!flag}>{v !== null ? renderItem(v, i) : !flag && renderSkeleton ? renderSkeleton() : null}</Spin>
          </div>
        ))}
      </div>
    );
  };
  _isRowLoaded = ({ index }) => {
    return !!this.renderData[index];
  };
  render() {
    const { className = '', itemHeight = 40, count = 0, data = [], hasBackTop = false } = this.props;
    const { rowSize, isInit, showBackTop } = this.state;
    this.renderData = Utils.arraySliceForX(data, rowSize);
    const rowCount = Math.ceil(count / rowSize);
    return (
      <div ref={this.scrollEle} className={`infinite-scroll-layout ${className}`}>
        {isInit ? (
          <InfiniteLoader isRowLoaded={this._isRowLoaded} loadMoreRows={this.loadMore} rowCount={rowCount} ref={this.infiniteRef}>
            {({ onRowsRendered, registerChild }) => {
              return (
                <AutoSizer>
                  {({ width, height }) => <List width={width} onRowsRendered={onRowsRendered} ref={registerChild} height={height} rowCount={rowCount} rowHeight={itemHeight} rowRenderer={this.rowRender} onScroll={this.onScroll} />}
                </AutoSizer>
              );
            }}
          </InfiniteLoader>
        ) : null}

        {hasBackTop && showBackTop && (
          <Tooltip title="返回顶部" placement="top">
            <div className="scoll-back-top" onClick={() => this.scrollToPosition(0)}>
              <IconFont type="icon-toTop_Main" />
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
}

export default InfiniteScrollLayout;
