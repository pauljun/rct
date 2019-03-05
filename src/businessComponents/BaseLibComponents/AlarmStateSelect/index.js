import React from 'react';
import { Select } from 'antd';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont')
const Option = Select.Option;

class AlarmStateSelect extends React.Component {
  constructor(props) {
    super(props);
  }
  // 类别筛选
  handleTypeChange = value => {
    if (value === 'undefined') {
      value = undefined;
    }
    this.props.onTypeChange({ offset: 0, alarmOperationType: value });
  };
  render() {
    let { searchData } = this.props;
    return (
      <div className="alarm-state-type">
        <Select
          dropdownClassName="header_filter_select_type_downwrap"
          className="header_filter_type_select"
          style={{ width: 110 }}
          value={searchData.alarmOperationType + ''}
          onChange={this.handleTypeChange}
          defaultValue={'undefined'}
          size='small'
          suffixIcon={<IconFont type='icon-Arrow_Big_Down_Main' />}>
          <Option value={'undefined'}>全部状态</Option>
          <Option value="1">已处理</Option>
          <Option value="2">未处理</Option>
          <Option value="3">有效</Option>
          <Option value="4">无效</Option>
        </Select>
      </div>
    );
  }
}

export default AlarmStateSelect;
