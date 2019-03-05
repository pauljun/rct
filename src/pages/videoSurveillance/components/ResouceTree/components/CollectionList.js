import React from 'react';
import { Collapse, message, Modal } from 'antd';
import { videoContext } from '../../../moduleContext';
import { observer } from 'mobx-react';
const Panel = Collapse.Panel;
const confirm = Modal.confirm;

const IconFont = Loader.loadBaseComponent('IconFont');
const DeviceIcon = Loader.loadBaseComponent('DeviceIcon');
const AutoSizer = Loader.loadModuleComponent('ReactVirtualized', 'AutoSizer');
const List = Loader.loadModuleComponent('ReactVirtualized', 'List');

@videoContext
@observer
class CollectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null
    };
  }
  onChange = key => {
    this.setState({ activeKey: key[key.length - 1] });
  };
  clickDeviceItem(item) {
    const { onSelectDevice } = this.props;
    onSelectDevice(item);
  }
  deleteDevice(e, groupName, item) {
    Utils.stopPropagation(e);
    let data = {
      groupName,
      deviceKey: `${item.cid}/${item.deviceName}`
    };
    this.props
      .deleteGroupDevice(data)
      .then(() => message.success('操作成功！'));
  }
  deleteGroup(e, name) {
    Utils.stopPropagation(e);
    const { deleteGroup } = this.props;
    confirm({
      title: '提示',
      content: `确定删除分组“${name}”`,
      onOk() {
        return deleteGroup(name).then(() => message.success('操作成功！'));
      },
      onCancel() {}
    });
  }
  editGroup = (e, group) => {
    Utils.stopPropagation(e);
    const { showGroupModal } = this.props;
    showGroupModal(true, group);
  };
  loopVideo = (e, group) => {
    Utils.stopPropagation(e);
    this.props.showLoopSettingLayout(group, true);
  };
  rowRender = ({ key, style, data, groupName }) => {
    const { selectDevice } = this.props;
    const ids = selectDevice.map(v => v.id);
    return (
      <div
        style={style}
        className={`device-item ${ids.indexOf(data.id) > -1 ? 'active' : ''}`}
        key={key}
        onClick={() => this.clickDeviceItem(data)}
      >
        <div className="device-item-layout">
          <DeviceIcon
            type={data.deviceType}
            status={data.deviceStatus}
          />
          <span className="device-name">{data.deviceName}</span>
          <span className="device-item-tools">
            <IconFont
              type="icon-Delete_Main"
              title="删除"
              onClick={e => this.deleteDevice(e, groupName, data)}
            />
          </span>
        </div>
      </div>
    );
  };
  render() {
    const { isMapMode, loopGroupName } = this.props;
    const { activeKey } = this.state;
    const { collectionList } = this.props;
    return (
      <div className="collection-list-layout">
        <Collapse
          bordered={false}
          onChange={this.onChange}
          activeKey={activeKey}
        >
          {collectionList.map(item => (
            <Panel
              showArrow={false}
              key={item.groupName}
              className={`${
                loopGroupName === item.groupName ? 'loopGroup-item' : ''
              }`}
              header={
                <span className="group-name-layout">
                  <IconFont
                    type={
                      activeKey === item.groupName
                        ? 'icon-Arrow_Small_Up_Main'
                        : 'icon-Arrow_Small_Down_Mai'
                    }
                  />
                  <span className="group-name">{item.groupName}</span>
                  <span className="device-count">
                    <i className="online-count">
                      { item.deviceList.filter(
                          v => v.deviceStatus * 1 === 1
                        ).length
                      }
                    </i>
                    /
                    <i className="count">{item.deviceList.length}</i>
                  </span>
                  <span className="group-tools">
                    {!isMapMode && (
                      <IconFont
                        type="icon-RoundPlay_Main"
                        onClick={e => this.loopVideo(e, item)}
                        title="轮巡"
                      />
                    )}
                    <IconFont
                      title="编辑"
                      type="icon-Edit_Main"
                      onClick={e => this.editGroup(e, item)}
                    />
                    <IconFont
                      title="删除"
                      type="icon-Delete_Main"
                      onClick={e => this.deleteGroup(e, item.groupName)}
                    />
                  </span>
                </span>
              }
            >
              <div
                className="device-list-content"
                style={{
                  height: `calc(100vh - ${50 +
                    72 +
                    44 +
                    50 +
                    28 * collectionList.length +
                    collectionList.length}px)`
                }}
              >
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      width={width}
                      height={height}
                      rowCount={item.deviceList.length}
                      rowHeight={25}
                      rowRenderer={({ key, index, style }) =>
                        this.rowRender({
                          key,
                          index,
                          style,
                          data: item.deviceList[index],
                          groupName: item.groupName
                        })
                      }
                    />
                  )}
                </AutoSizer>
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  }
}
export default CollectionList;
