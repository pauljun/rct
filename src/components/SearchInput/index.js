import React from 'react';
import { Input } from 'antd';
import './index.less';

const IconFont = Loader.loadBaseComponent('IconFont');

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ''
    };
    this.timer = null;
    this.focusState = false;
    if (props.isEnterKey) {
      document.addEventListener('keypress', this.initEnterEvent, false);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.initEnterEvent, false);
    clearTimeout(this.timer);
    this.timer = null;
    this.focusState = null;
  }
  initEnterEvent = event => {
    if ((event.keyCode === 13) && this.focusState) {
      this.props.onChange && this.props.onChange(this.state.value);
    }
  };
  // 增加防抖
  onChange = event => {
    const { isEnterKey } = this.props;
    clearTimeout(this.timer);
    let value = event.target.value;
    this.setState({
      value
    });
    if (!isEnterKey) {
      this.timer = setTimeout(() => {
        this.props.onChange && this.props.onChange(value);
      }, 500);
    }
  };
  clickSuffix = () => {
    this.onChange({
      target: {
        value: ''
      }
    });
  };
  onFocus = () => {
    this.focusState = true
    this.props.onFocus && this.props.onFocus()
  }
  render() {
    const { className = '', size = 'default', onChange, ...rest } = this.props;
    const sizeClass = size === 'default' ? 'c-search-12' : 'c-search-14';
    const IconState = this.state.value ? (
      <IconFont type="icon-Close_Main1" onClick={this.clickSuffix} />
    ) : null;
    return (
      <Input
        {...rest}
        className={`cc-search ${sizeClass} ${className}`}
        onChange={this.onChange}
        prefix={<IconFont type="icon-Search_Main" />}
        suffix={IconState}
        value={this.state.value}
        onFocus={this.onFocus}
      />
    );
  }
}
export default SearchInput;
