import React from 'react';
import { Input, Select } from 'antd';

const IconFont = Loader.loadBaseComponent('IconFont')
const Option = Select.Option;
const {cameraAndSoldierType, deviceStatus } = Dict.map

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.suffix = Math.random()
    this.form = {
      keyword: null,
      status: null,
      type: null
    };
  }

  timer = null;
  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }
  changeStatus = value => {
    this.form.status = value;
    this.props.changeForm && this.props.changeForm(this.form);
  };
  changeType = value => {
    this.form.type = value;
    this.props.changeForm && this.props.changeForm(this.form);
  };
  changeKeyword = event => {
    clearTimeout(this.timer);
    let value = event.target.value;
    this.form.keyword = value;
    this.forceUpdate();
    this.timer = setTimeout(() => {
      this.props.changeForm && this.props.changeForm(this.form);
    }, 500);
  };
  clearKeyword = () => {
    clearTimeout(this.timer);
    this.form.keyword = null;
    this.props.changeForm && this.props.changeForm(this.form);
    this.forceUpdate();
  };
  render() {
    const { keyword } = this.form;
    return (
      <div className="form-search">
        <div className="search-keyword">
          <Input
            prefix={
              <IconFont type="icon-Search_Light" />
            }
            suffix={
              keyword && (
                <IconFont
                  type="icon-YesorNo_No_Dark"
                  onClick={this.clearKeyword}
                  style={{ fontSize: 12, cursor: 'pointer' }}
                />
              )
            }
            placeholder="请输入要搜索的摄像机名称、sn"
            value={keyword}
            onChange={this.changeKeyword}
          />
        </div>
        <div className={`search-type search-type-${this.suffix}`}>
          <Select
            getPopupContainer={() => document.getElementsByClassName(`search-type-${this.suffix}`)[0]}
            allowClear={true}
            placeholder={'全部状态'}
            onChange={this.changeStatus}
          >
            {deviceStatus.map(item => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
          <Select
           getPopupContainer={() => document.getElementsByClassName(`search-type-${this.suffix}`)[0]}
            allowClear={true}
            placeholder={'全部类型'}
            onChange={this.changeType}
          >
            {cameraAndSoldierType.map(item => (
              <Option value={item.value} key={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    );
  }
}
