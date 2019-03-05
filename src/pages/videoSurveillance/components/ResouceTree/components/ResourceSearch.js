import React from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import SearchForm from './SearchForm';
import CollectionList from './CollectionList';
import IconFont from '../../../../../components/IconFont';
import { videoContext } from '../../../moduleContext';
import * as _ from 'lodash';
import { Button } from 'antd';
import DeviceContent from './DeviceContent'

import '../style/resouce-search.less';


@videoContext
@observer
class ResourceSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isResource: true,
      form: {
        keyword: '',
        status: '',
        type: '',
        orgId: '',
        placeId: '',
      }
    };
  }
  changeForm(form) {
    this.setState({ form });
  }

  filterList = (list, ids, key) => {
    const newList = list.filter(item => {
      let flag = false;
      const arrTemp = item[key] || [];
      for (let i = 0; i < arrTemp.length; i++) {
        if (ids.indexOf(arrTemp[i]) > -1) {
          flag = true;
          break;
        }
      }
      return flag;
    });
    return newList
  }

  filterPlaceList = (list, ids) => {
    const newList = list.filter(item => (
      ids.indexOf(item.placeId) > -1
    ))
    return newList
  }

  queryDevice(list, params) {
    const resourceMode = this.resourceMode || 'org';
    let { keyword, status, type, orgId, placeId } = params;
    keyword = _.trim(keyword);
    if (!keyword && !status && !type && !`${resourceMode}Id`) {
      return list;
    }

    let newList = list;

    if(resourceMode==='org') {
      if (!!orgId) {
        let orgIds = BaseStore.organization.queryOrgIdsForParentOrgId(orgId);
        newList = this.filterList(list, orgIds, 'organizationIds');
      }
    } else {
      if (!!placeId) {
        let placeIds = BaseStore.place.queryPlaceIdsForParentId(placeId);
        newList = this.filterPlaceList(list, placeIds);
      }
    }

    !!keyword
      ? (newList = newList.filter(
          item => (
            (item.deviceName && item.deviceName.indexOf(keyword) > -1) 
            || item.sn === keyword || item.cid === keyword
          )
        ))
      : null;

    !!type && type !== '-1'
      ? (newList = newList.filter(item => item.deviceType * 1 === type * 1))
      : null;

    !!status && status !== '-1'
      ? status * 1 === 0
        ? (newList = newList.filter(item => item.deviceStatus * 1 === 0))
        : (newList = newList.filter(item => item.deviceStatus * 1 === 1))
      : null;

    return newList;
  }
  addGroup = () => {
    const { showGroupModal } = this.props;
    showGroupModal();
  };

  changeOrg(orgId) {
    const { form } = this.state;
    this.setState({ form: Object.assign({}, form, { orgId }) });
  }
  
  changePlace = (placeId) => {
    const { form } = this.state;
    this.setState({ form: Object.assign({}, form, { placeId }) });
  }

  setResourceMode = (mode) => {
    this.resourceMode = mode;
  }

  render() {
    const { deviceList, orgList, collectionList, showGroupModal } = this.props;
    const { isResource, form } = this.state;
    const {
      isMapMode,
      showLoopSettingLayout,
      isLoop,
      loopOrgInfo,
    } = this.props;
    const listOrg = Utils.computTreeList(_.cloneDeep(toJS(orgList)));
    const listDevice = this.queryDevice(deviceList, form);

    return (
      <div className="resource-search">
        <div className="tab-layout">
          <div
            onClick={() => !isResource && this.setState({ isResource: true })}
            className={`tab-item ${isResource ? 'tab-item-active' : ''}`}
          >
            全部资源
          </div>
          <div
            onClick={() => isResource && this.setState({ isResource: false })}
            className={`tab-item ${!isResource ? 'tab-item-active' : ''}`}
          >
            我的分组
          </div>
        </div>
        <div className={`resource-part ${!isResource ? 'hide-resource' : ''}`}>
          <SearchForm changeForm={this.changeForm.bind(this)} />
          <DeviceContent
            setResourceMode={this.setResourceMode}
            changeOrg={this.changeOrg.bind(this)}
            changePlace={this.changePlace}
            deviceList={listDevice}
            orgList={listOrg}
            isMapMode={isMapMode}
            isLoop={isLoop}
            keyword={form.keyword}
            showLoopSettingLayout={showLoopSettingLayout}
            collectionList={collectionList}
            loopOrgInfo={loopOrgInfo}
            className="org-tree-with-device"
          />
        </div>
        <div
          className={`collection-part ${isResource ? 'hide-collection' : ''}`}
        >
          <div className="group-action">
            <div className="group-num-info">
              <div><span>分组数量：</span>{collectionList.length}</div>
              <div>
                <span>摄像机数量：</span>{BusinessStore.deviceGroup.groupCountDevice}
              </div>
            </div>
            <Button onClick={showGroupModal} type="primary" className="orange-btn">
              <IconFont type="icon-_Main1" style={{ fontSize: 14 }} />
              新增分组
            </Button>
          </div>
          <CollectionList collectionList={collectionList} />
        </div>
      </div>
    );
  }
}
export default ResourceSearch