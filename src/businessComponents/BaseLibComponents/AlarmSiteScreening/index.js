import React from 'react';
import { observer } from "mobx-react";
import { Select } from 'antd';
import './index.less';

const Option = Select.Option;

@observer
class AlarmSiteScreening extends React.Component {
  constructor(props) {
    super(props);
    // let sitesValue = props.searchData.installationSites ? props.searchData.installationSites : ['119100']
    let sitesValue = props.searchData.installationSites
    this.state = {
      sitesValue
    };
  }
  //场所筛选
  handleHomeChange = value => {
    let arr = [
      '119101',
      '119102',
      '119103',
      '119104',
      '119105',
      '119106',
      '119107',
      '119108',
      '119109',
      '119110',
      '119111',
      '119112',
      '119113',
      '119114',
      '119115',
    ];
    if (value.indexOf('119100') > -1) {
      let data = [];
      this.props.onTypeChange({
        offset: 0,
        installationSites: undefined,
        noInstallationSites: undefined
      });
      value = ['119100'];
    } else {
      if (value.indexOf('119115') > -1) {
        arr = arr.filter(v => value.indexOf(v) === -1);
        this.props.onTypeChange({
          offset: 0,
          noInstallationSites: arr,
          installationSites: undefined
        });
      } else {
        this.props.onTypeChange({
          offset: 0,
          installationSites: value,
          noInstallationSites: undefined
        });
      }
    }
    this.setState({
      sitesValue: value
    });
  };
  render() {
    let { sitesValue } = this.state;
    let data = Dict.getDict('bigDatePlaceType').sort((a,b) => a.value - b.value);
    return (
      <div className="alarm-site-screening">
        <Select
          dropdownClassName="header_filter_select_type_downwrap"
          className="header_filter_home_select"
          style={{ width: 120 }}
          onChange={this.handleHomeChange}
          value={sitesValue}
          placeholder="场所筛选"
          size='small'
          mode="multiple">
          {/* <Option value={'119100'}>全部场所</Option> */}
          { data.map(item => {
            // return <Option disabled={sitesValue.indexOf('119100') > -1} value={item.value}>
            return <Option value={item.value}>
            { item.label}
          </Option>
          }) }
        </Select>
      </div>
    );
  }
}

export default AlarmSiteScreening;
