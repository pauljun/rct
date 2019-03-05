import React from 'react';
import { inject, observer } from 'mobx-react';
import { Popover } from 'antd';
import { intersection, remove, differenceBy, uniqBy, orderBy } from 'lodash';
import './index.less';

const OrgTree = Loader.loadBusinessComponent('OrgTree');
const ListComponent = Loader.loadBusinessComponent('ListComponent');
const PlaceTree = Loader.loadBusinessComponent('PlaceTree');
const IconFont = Loader.loadBaseComponent('IconFont');

@inject('device')
@observer
class TreeSelectCamera extends React.Component {
  constructor(props) {
    super(props);
    this.resourceRef = React.createRef()
    this.state = {
      selectList: props.selectList ? JSON.parse(JSON.stringify(props.selectList)) : [],
      orgId: null,
      placeId: null,
      mode: 'org'
    };
  }

  onSelect = (mode, id) => {
    this.setState({ [`${mode}Id`]: id },() => {
      this.resourceRef.current.forceUpdateGrid()
    });
  };
  changeMode = mode => {
    this.setState({ mode });
  };
  selectCamera = ({ item, flag, changeAll, list }) => {
    let { selectList } = this.state;
    if (flag) {
      !changeAll ? selectList.push(item) : (selectList = [].concat(selectList, list));
    } else {
      if (changeAll) {
        selectList = differenceBy(selectList, list, 'id');
      } else {
        remove(selectList, v => v.id === item.id);
      }
    }
    selectList = orderBy(uniqBy(selectList, 'id'), ['deviceStatus', 'deviceName'], ['desc', 'asc']);
    this.setState({ selectList });
    this.props.onChange && this.props.onChange(selectList);
  };
  computedList(list) {
    const { noSoldier = false } = this.props;
    const { orgId, placeId, mode } = this.state;
    let newList = [];
    if (noSoldier) {
      list = list.filter(v => v.deviceType !== Dict.map.db.value);
    }
    if (mode === 'org') {
      if (!orgId) {
        newList = list;
      } else {
        let orgIds = BaseStore.organization.queryOrgIdsForParentOrgId(orgId);
        newList = list.filter(item => {
          const arr = item.organizationIds || [];
          return intersection(arr, orgIds).length > 0;
        });
      }
    } else {
      if (!placeId) {
        newList = list;
      } else {
        let placeIds = BaseStore.place.queryPlaceIdsForParentId(placeId);
        newList = list.filter(item => {
          return placeIds.indexOf(item.placeId) > -1;
        });
      }
    }
    return newList;
  }
  render() {
    const { selectList, orgId, mode, placeId } = this.state;
    const { className = '', device, singleMode } = this.props;
    const cameraList = this.computedList(device.cameraArray);
    let treeView;
    if (singleMode) {
      treeView =
        singleMode === 'org' ? (
          <OrgTree activeKey={[orgId]} hasTitle={true} hasSearch={true} onSelect={keys => this.onSelect(mode, keys[0])} showCount={true} />
        ) : (
          <PlaceTree activeKey={[placeId]} hasTitle={true} hasSearch={true} onSelect={keys => this.onSelect(mode, keys[0])} showCount={true} />
        );
    } else {
      treeView =
        mode === 'org' ? (
          <OrgTree
            activeKey={[orgId]}
            hasTitle={true}
            hasSearch={true}
            onSelect={keys => this.onSelect(mode, keys[0])}
            showCount={true}
            title={
              <div className="change-select-mode">
                <SelectModeView currentMode={mode} changeMode={this.changeMode} title="组织机构" />
              </div>
            }
          />
        ) : (
          <PlaceTree
            activeKey={[placeId]}
            hasTitle={true}
            hasSearch={true}
            onSelect={keys => this.onSelect(mode, keys[0])}
            showCount={true}
            title={
              <div className="change-select-mode">
                <SelectModeView currentMode={mode} changeMode={this.changeMode} title="行政区划" />
              </div>
            }
          />
        );
    }

    return (
      <div className={`org-select-camera ${className}`}>
        <div className="select-resource">
          {treeView}
          <ListComponent ref={this.resourceRef} hasTitle={true} checkable={true} hasSearch={true} hasCheckAll={true} listData={cameraList} selectList={selectList} onChange={this.selectCamera} title="摄像机列表" />
        </div>
        <ListComponent className="select-result" listData={selectList} hasTitle={true} hasClear={true} onChange={this.selectCamera} title={`已选摄像机(${selectList.length}个)`} />
      </div>
    );
  }
}

const models = [{ value: 'org', label: '组织机构' }, { value: 'place', label: '行政区划' }];

class SelectModeView extends React.Component {
  render() {
    const { title, changeMode, currentMode, isSingleMode } = this.props;
    return (
      <Popover
        overlayClassName="select-mode-view"
        placement="bottom"
        content={
          <div className="mode-change-popup">
            {models.map(v => (
              <div className={currentMode === v.value ? 'active-mode' : ''} onClick={() => changeMode(v.value)}>
                {v.label}
              </div>
            ))}
          </div>
        }
        trigger="click"
        onVisibleChange={this.handleVisibleChange}
      >
        <span>
          {title} <IconFont type="icon-Arrow_Small_Down_Mai" />
        </span>
      </Popover>
    );
  }
}

export default TreeSelectCamera;
