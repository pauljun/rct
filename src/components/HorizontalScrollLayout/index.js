import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const IconFont = Loader.loadBaseComponent('IconFont');

class HorizontalScrollLayout extends React.Component {
  static propTypes = {
    renderItem: PropTypes.func.isRequired,
    itemWidth: PropTypes.number,
    size: PropTypes.number,
    data: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.state = {
      page: 1,
      size: 0
    };
  }
  componentDidMount() {
    this.setItemWidth();
    window.addEventListener('resize', this.setItemWidth, false);
    this.props.onInit && this.props.onInit(this);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.setItemWidth, false);
    this.listRef = null;
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.currentIndex !== nextProps.currentIndex) {
      const { size, page } = this.state;
      const newPage = Math.ceil((nextProps.currentIndex + 1) / size);
      if (page !== newPage) {
        this.changePage(newPage);
      }
    }
  }

  setItemWidth = () => {
    const { itemWidth, size } = this.props;
    const { width } = this.listRef.current.getBoundingClientRect();
    this.setState({ size: size ? size : Math.floor(width / itemWidth) });
  };

  changePage(page) {
    if (page === 0) {
      return;
    }
    if (page > this.renderData.length) {
      return;
    }
    this.setState({ page });
    this.props.onPageChange && this.props.onPageChange({ page, size: this.state.size });
  }

  render() {
    const { page, size } = this.state;
    const { data, renderItem, className = '', prevIcon, nextIcon } = this.props;
    this.renderData = Utils.arraySliceForX(data, size);
    let emptyData = [];
    if (data.length && data.length % size !== 0) {
      emptyData = Utils.arrayFill(size - (data.length % size), 0);
    }
    return (
      <div className={`horizontal-scroll-layout ${className}`}>
        <div className={`prev-group ${page === 1 ? 'disabled' : ''}`} onClick={() => this.changePage(page - 1)}>
          {prevIcon ? prevIcon : <IconFont className="page-icon" type="icon-Arrow_Small_Left_Mai" />}
        </div>
        <div className="content-layout" ref={this.listRef}>
          <div
            className="group-animate"
            style={{
              width: this.renderData.length * 100 + '%',
              transform: `translate(-${((page - 1) * 100) / this.renderData.length}%,0)`
            }}
          >
            {this.renderData.map((group, i) => (
              <div className="group-layout" style={{ width: `${100 / this.renderData.length}%` }}>
                {group.map((v, index) => (
                  <div className="item-content">{renderItem(v, i * size + index)}</div>
                ))}
                {i === this.renderData.length - 1 ? emptyData.map(v => <div className="item-content empty-item" />) : null}
              </div>
            ))}
          </div>
        </div>
        <div className={`next-group ${page > this.renderData.length - 1 ? 'disabled' : ''}`} onClick={() => this.changePage(page + 1)}>
          {nextIcon ? nextIcon : <IconFont className="page-icon" type="icon-Arrow_Small_Right_Ma" />}
        </div>
      </div>
    );
  }
}

export default HorizontalScrollLayout;
