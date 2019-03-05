import React from 'react';
import { Modal } from 'antd';
import ModalFooter from './components/ModalFooter';
import './index.less';

export default class ModalComponent extends React.Component {
  render() {
    const {
      className,
      onOk,
      disabled,
      onCancel,
      otherModalFooter = null,
      children = null,
      okText = '确认',
      cancelText = '取消',
      ...props
    } = this.props;
    return (
      <Modal
        className={`modal-component ${className}`}
        {...props}
        onCancel={onCancel}
        footer={null}
      >
        <div className="modal-content">{children}</div>
        {otherModalFooter ? (
          otherModalFooter
        ) : (
          <ModalFooter okText={okText} cancelText={cancelText} onCancel={onCancel} disabled={disabled} onOk={onOk} />
        )}
      </Modal>
    );
  }
}
