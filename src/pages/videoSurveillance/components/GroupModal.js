import React from 'react';
import { Input } from 'antd';

const TreeSelectCamera = Loader.loadBusinessComponent('TreeSelectCamera');
const ModalComponent = Loader.loadBusinessComponent('ModalComponent');
export default class GroupModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.group ? props.group.groupName : null,
      selectList: props.group ? props.group.deviceList : []
    };
  }
  onChange = event => {
    this.setState({ name: event.target.value });
  };
  selectChange = selectList => {
    this.setState({ selectList });
  };
  submit = () => {
    const { name, selectList } = this.state;
    const { onOk, group } = this.props;
    let isEdit = !!group;
    onOk && onOk(isEdit, name, selectList, group);
  };
  render() {
    const { name } = this.state;
    const { visible, onOk, onCancel, group, ...props } = this.props;
    return (
      <ModalComponent
        width={910}
        visible={visible}
        onCancel={onCancel}
        onOk={this.submit}
        className="group-modal-layout"
        title={group ? `编辑分组-${group.groupName}` : '新建分组'}
        disabled={name === null || name === ''}
      >
        <div className="modal-group-form">
          <div className="group-name">分组名称：</div>
          <Input
            placeholder="请填写分组名称"
            onChange={this.onChange}
            value={name}
          />
        </div>
        <span className="select-label">请在下方勾选摄像机：</span>
        <TreeSelectCamera
          selectList={group ? group.deviceList : []}
          footer={true}
          defaultExpandAll={false}
          onCancel={onCancel}
          onChange={this.selectChange}
        />
      </ModalComponent>
    );
  }
}
