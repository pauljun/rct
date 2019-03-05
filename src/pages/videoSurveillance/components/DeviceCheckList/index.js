import React from 'react';
import { Icon, Checkbox } from 'antd';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { orderBy } from 'lodash';
import LinkTools from '../LinkTools';
import './index.less';

const ListComponent = Loader.loadBusinessComponent('ListComponent');

@withRouter
@inject('tab')
class DeviceCheckList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectList: JSON.parse(JSON.stringify(props.deviceList))
    };
  }
  clickDeviceItem(item) {
    const { onSelectDevice } = this.props;
    onSelectDevice && onSelectDevice(item);
  }
  clearSelect() {
    const { clearSelect } = this.props;
    clearSelect();
  }
  onChangeSelect = ({ list, isClear, item }) => {
    this.setState({ selectList: JSON.parse(JSON.stringify(list)) });
    if (isClear) {
      this.props.deleteDeviceItem(item);
    }
  };
  getSelectList = () => {
    return this.state.selectList;
  }
  sortList(deviceList) {
    return orderBy(deviceList, ['deviceStatus', 'deviceName'], ['desc', 'asc']);
  }
  render() {
    const { selectList } = this.state;
    const { deviceList, className, clearSelect, onSelectDevice, goPage } = this.props;
    const isCheckAll = selectList.length === deviceList.length;
    const list = this.sortList(deviceList);
    return (
      <div
        className={`video-device-check-list-layout ${
          className ? className : ''
        }`}
      >
        <div className="title-part">
          <span>
            已选设备（
            {deviceList.length}
            个）
          </span>
          <Icon type="close" onClick={clearSelect} />
        </div>
        <div className="content-part">
          <div className="content-tools">
            <span>
              <Checkbox
                onChange={e =>
                  this.onChangeSelect({ list: !isCheckAll ? deviceList : [] })
                }
                checked={isCheckAll}
                indeterminate={!isCheckAll && selectList.length > 0}
              />
              全选
            </span>
            <span onClick={clearSelect}>清空</span>
          </div>
          <div className="device-check-list-layout">
            <ListComponent
              checkable={true}
              hasCheckAll={false}
              hasClear={true}
              listData={list}
              selectList={selectList}
              onClick={onSelectDevice}
              onChange={this.onChangeSelect}
            />
          </div>
          <LinkTools 
            className='button-group'
            theme='filled'
            size='large'
            placement='bottom'
            goPage={goPage}
            getSelectList={this.getSelectList}
          />
        </div>
      </div>
    );
  }
}
export default DeviceCheckList;
