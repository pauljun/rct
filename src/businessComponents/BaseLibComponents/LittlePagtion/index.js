import React from 'react';
import { Select, Button } from 'antd';
import './index.less';

// const Option = Select.Option;
// const IconFont = Loader.loadBaseComponent('IconFont');
const RefreshButton = Loader.loadBaseComponent('RefreshButton');

class LittlePagTion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 顶部小型分页选择
  littePagtionChange = value => {
    this.props.onShowSizeChange(0, value);
  };
  onChangeType = type => {
    let { onChange, searchData, total } = this.props;
    let limit = searchData.limit,
    offset = searchData.offset;
    if (type == 1) {
      if (offset > 0) {
        onChange({ offset: offset - limit, limit});
      } else {
        return;
      }
    }
    if (
      type == 2 && offset < total - limit
    ) {
      onChange({offset: offset + limit, limit});
    }
  };

  Refresh = () => {
    const { Refresh, onChange } = this.props
    if(Refresh){
      return Refresh()
    }
    onChange && onChange()
  };

	thousand(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
 }
  render() {
    let { searchData = {}, total, loading } = this.props;
    return (
      <div className="little-pagtion">
        <div className="header-text" style={{ paddingLeft: '5px' }}>
          共显示
          <b className="text-red"> {total && this.thousand(+total)} </b>
          条资源
        </div>
        {/* <div className="header-pagtion-top">
          <Select
            onChange={this.littePagtionChange}
            value={searchData.limit}
            style={{ width: 98 }}
            defaultValue={searchData.limit}
            dropdownClassName={'little-pagtion-down'}>
            <Option value={24}>24条/页</Option>
            <Option value={36}>36条/页</Option>
            <Option value={48}>48条/页</Option>
            <Option value={72}>72条/页</Option>
            <Option value={96}>96条/页</Option>
          </Select>
        </div> */}
        {/* <div className="header-input-people">
          <div className="pagtion_Paging">
            <div
              className={`paging_left ${
                searchData.offset === 0? 'paging_left_No' : ''
              }`}
              onClick={this.onChangeType.bind(this, 1)}>
              <IconFont type={'icon-Arrow_Big_Left_Main'} theme="outlined" />
            </div>
            <p className="paging_number">
              第
              <span>{this.thousand(searchData.offset / searchData.limit + 1)}</span>
              页
            </p>
            <div
              className={`paging_left ${
                searchData.offset > total - searchData.limit
                  ? 'paging_left_No'
                  : ''
              }`}
              onClick={this.onChangeType.bind(this, 2)}>
              <IconFont type={'icon-Arrow_Big_Right_Main'} theme="outlined" />
            </div>
          </div>
        </div> */}
        <RefreshButton onClick={this.Refresh} size={'default'} loading={loading}/>
        {/* <div className="header-button">
          <Button block={true} type="primary" onClick={this.Refresh}>
            <IconFont type={'icon-Right_Main'} theme="outlined" />
            刷新
          </Button>
        </div> */}
      </div>
    );
  }
}

export default LittlePagTion;
