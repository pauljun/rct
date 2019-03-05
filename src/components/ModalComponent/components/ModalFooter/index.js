import React from 'react';
import { Button } from 'antd';
import './index.less';

export default class ModalFooter extends React.Component {
  state = {
    loading: false
  };
  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }
  onSubmit = () => {
    this.setState({ loading: true });
    const onOk = this.props.onOk();
    if (Utils.judgeType(onOk, 'Promise')) {
      onOk
        .then(() => {
          this.setState({ loading: false });
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    } else {
      this.timer = setTimeout(() => {
        this.setState({ loading: false });
      }, 200);
    }
  };
  render() {
    const {
      className = '',
      onCancel,
      disabled,
      okText = '确认',
      cancelText = '取消'
    } = this.props;
    return (
      <div className={`modal-footer ${className}`}>
        <Button onClick={() => onCancel()}>{cancelText}</Button>
        <Button
          onClick={this.onSubmit}
          htmlType="submit"
          type="primary"
          loading={this.state.loading}
          disabled={disabled}
        >
          {okText}
        </Button>
      </div>
    );
  }
}
