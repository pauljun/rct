import React from 'react';
import { Select } from 'antd';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont')
const Option = Select.Option;

class AlarmTimeTypeSelect extends React.Component {
  constructor(props) {
    super(props);
  }
    // 时间筛选
  handleTimeSort = value => {
    this.props.onTypeChange({ offset: 0, sort: [value] });
  };
  render() {
    let { searchData } = this.props;
    return (
      <div className="alarm-time-type">
          <Select
            dropdownClassName="alarm-time-type-downwrap"
            className="alarm-time-type-select"
            style={{ width: 134 }}
            value={searchData.sort}
            onChange={this.handleTimeSort}
            defaultValue={'captureTime|desc'}
            size='small'
            suffixIcon={<IconFont type='icon-Arrow_Big_Down_Main' />}
          >
            <Option value={'captureTime|desc'}>按时间排序</Option>
            <Option value={'score|desc'}>按相似度排序</Option>
          </Select>
      </div>
    )
  }
}

export default AlarmTimeTypeSelect;